const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');

// تهيئة إعدادات Cloudinary باستخدام المتغيرات البيئية
if (process.env.CLOUDINARY_URL) {
  cloudinary.config();
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
    api_key: process.env.CLOUDINARY_API_KEY || '',
    api_secret: process.env.CLOUDINARY_API_SECRET || '',
    secure: true,
  });
}

/**
 * قائمة أنواع الوسائط (MIME Types) المعتمدة بدقة لمستندات وإيصالات الطلاب
 */
const ALLOWED_DOCUMENT_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
];

/**
 * التحقق من توافق نوع الملف مع الصيغ المقبولة
 * @param {string} mimeType
 * @returns {boolean}
 */
const isValidDocumentMimeType = (mimeType) => {
  if (!mimeType) return false;
  return ALLOWED_DOCUMENT_MIME_TYPES.includes(mimeType.toLowerCase().trim());
};

/**
 * التحقق مما إذا كانت بيانات اعتماد Cloudinary مهيأة بشكل صحيح
 */
const isCloudinaryConfigured = () => {
  return Boolean(
    process.env.CLOUDINARY_URL ||
    (process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET)
  );
};

/**
 * رفع تدفقي عبر مجزأ الأجزاء (Streaming Chunked Upload)
 * يحمي استهلاك ذاكرة الرام (RAM) في استضافة Render ذات الحد 512MB
 * ويطبق التحسين التلقائي للجودة والصيغة { quality: 'auto', fetch_format: 'auto' }
 *
 * @param {ReadableStream|Buffer} streamOrBuffer - دفق البيانات أو المخزن المؤقت
 * @param {Object} options - خيارات الرفع والمجلد واسم الملف
 * @returns {Promise<Object>} نتيجة الرفع من Cloudinary بما فيها secure_url
 */
const uploadStreamToCloudinary = (streamOrBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    if (!isCloudinaryConfigured()) {
      return reject(
        new Error(
          'Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your environment variables.'
        )
      );
    }

    const {
      folder = 'cairo_univ_portal/documents',
      resourceType = 'auto',
      filename = 'document',
      mimetype = '',
    } = options;

    if (mimetype && !isValidDocumentMimeType(mimetype)) {
      return reject(
        new Error(
          `نوع الملف غير صالح (${mimetype}). الأنواع المسموح بها فقط هي: JPG, PNG, WEBP, PDF`
        )
      );
    }

    const sanitizedFilename = filename
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 50);

    const isPdf = mimetype === 'application/pdf' || filename.toLowerCase().endsWith('.pdf');

    // إعدادات الرفع مع التحسين التلقائي (quality: auto, fetch_format: auto)
    const uploadOptions = {
      folder,
      resource_type: isPdf ? 'auto' : (resourceType || 'auto'),
      public_id: `${Date.now()}_${sanitizedFilename}`,
      use_filename: true,
      unique_filename: true,
      chunk_size: 6 * 1024 * 1024, // رفع كل 6MB في جزء لمنع استنزاف ذاكرة Render
    };

    // تطبيق ضغط وتحسين الصور تلقائياً (لغير ملفات الـ PDF الخام)
    if (!isPdf) {
      uploadOptions.transformation = [
        { quality: 'auto', fetch_format: 'auto' },
      ];
    }

    const uploadStream = cloudinary.uploader.upload_chunked_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error('[Cloudinary Chunked Stream Upload Error]:', error);
          return reject(error);
        }
        resolve(result);
      }
    );

    if (Buffer.isBuffer(streamOrBuffer)) {
      const readable = Readable.from(streamOrBuffer);
      readable.pipe(uploadStream);
    } else if (streamOrBuffer && typeof streamOrBuffer.pipe === 'function') {
      streamOrBuffer.pipe(uploadStream);
    } else {
      uploadStream.end(streamOrBuffer);
    }
  });
};

/**
 * دالة مساعدة لرفع Buffer متوافقة مع الاستدعاءات الحالية
 */
const uploadBufferToCloudinary = (buffer, options = {}) => {
  return uploadStreamToCloudinary(buffer, options);
};

/**
 * دالة شاملة لرفع وثائق وإيصالات الطلاب مع التحقق من نوع الملف والتخزين الآمن
 * @param {Object|Buffer} file - كائن الملف المستلم من Multer أو Buffer
 * @param {Object} options - خيارات إضافية
 */
const uploadDocument = async (file, options = {}) => {
  if (!file) {
    throw new Error('الملف المطلوب رفعه غير موجود.');
  }

  let buffer = file.buffer || (Buffer.isBuffer(file) ? file : null);
  let mimetype = file.mimetype || options.mimetype || '';
  let filename = file.originalname || options.filename || 'student_document';

  // معالجة إذا تم تمرير Base64 string
  if (typeof file === 'string' && file.startsWith('data:')) {
    const match = file.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (match) {
      mimetype = match[1];
      buffer = Buffer.from(match[2], 'base64');
    }
  }

  if (mimetype && !isValidDocumentMimeType(mimetype)) {
    throw new Error(
      `نوع الملف غير صالح (${mimetype}). يسمح فقط بـ: JPG, PNG, WEBP, PDF`
    );
  }

  if (!buffer) {
    throw new Error('تعذر قراءة محتوى الملف.');
  }

  const result = await uploadStreamToCloudinary(buffer, {
    ...options,
    mimetype,
    filename,
  });

  return {
    secure_url: result.secure_url,
    url: result.secure_url,
    public_id: result.public_id,
    format: result.format,
    bytes: result.bytes,
  };
};

module.exports = {
  cloudinary,
  isCloudinaryConfigured,
  ALLOWED_DOCUMENT_MIME_TYPES,
  isValidDocumentMimeType,
  uploadStreamToCloudinary,
  uploadBufferToCloudinary,
  uploadDocument,
};
