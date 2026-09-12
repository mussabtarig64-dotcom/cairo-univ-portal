const cloudinary = require('cloudinary').v2;

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
 * رفع ملف من الذاكرة (Buffer) إلى Cloudinary عبر Streams
 * يدعم كلاً من الصور والمستندات الكبيرة (PDFs, docs, etc.)
 *
 * @param {Buffer} buffer - الـ Buffer الخاص بالملف المرفوع
 * @param {Object} options - خيارات إضافية مثل المجلد واسم الملف
 * @returns {Promise<Object>} نتيجة الرفع من Cloudinary بما فيها secure_url
 */
const uploadBufferToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    if (!isCloudinaryConfigured()) {
      return reject(
        new Error(
          'Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your environment variables.'
        )
      );
    }

    const {
      folder = 'cairo_univ_cms',
      resourceType = 'auto',
      filename = 'document',
    } = options;

    const sanitizedFilename = filename
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 50);

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        public_id: `${Date.now()}_${sanitizedFilename}`,
        use_filename: true,
        unique_filename: true,
      },
      (error, result) => {
        if (error) {
          console.error('[Cloudinary Upload Stream Error]:', error);
          return reject(error);
        }
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
};

module.exports = {
  cloudinary,
  isCloudinaryConfigured,
  uploadBufferToCloudinary,
};
