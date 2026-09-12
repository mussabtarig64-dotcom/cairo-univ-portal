const express = require('express');
const router = express.Router();
const multer = require('multer');
const HubContent = require('../models/HubContent');
const {
  isCloudinaryConfigured,
  uploadBufferToCloudinary,
} = require('../utils/cloudinary');

// 1. إعداد Multer لتخزين الملفات في الذاكرة بأمان (Serverless-Safe Memory Storage)
// يدعم الملفات الكبيرة (حتى 50 ميجابايت) مثل مذكرات الـ PDF الشاملة، نماذج الامتحانات، والصور فائقة الدقة
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // قبول كافة صيغ المستندات والصور
    cb(null, true);
  },
});

// Middleware لمعالجة Multipart والملفات المرفقة وتفادي أي انهيار غير متوقع
const handleFileUpload = (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err) {
      console.error('Multer file parsing error in CMS route:', err.message, err.stack);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'حجم الملف المرفق يتجاوز الحد الأقصى المسموح به (50 ميجابايت).',
          error: err.message,
        });
      }
      return res.status(400).json({
        success: false,
        message: `خطأ أثناء استلام الملف المرفق: ${err.message}`,
        error: err.message,
      });
    }
    next();
  });
};

// 2. جلب محتويات قطاع معين (Hub Content Fetch)
router.get('/:hub', async (req, res) => {
  try {
    const { hub } = req.params;
    const { section, year, category, search } = req.query;

    const filter = { hub };
    if (section && section !== 'all') {
      filter.section = section;
    }
    if (year && year !== 'all') {
      filter.year = year;
    }
    if (category && category !== 'all') {
      filter.category = category;
    }
    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { subtitle: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const items = await HubContent.find(filter).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    console.error('Fetch Hub Content Error:', error.message, error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hub content',
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
    });
  }
});

// 3. إنشاء عنصر محتوى جديد (Create Hub Content - Admin CMS)
// يقوم برفع الملفات إلى Cloudinary وتخزين رابط الـ HTTPS السحابي فقط في MongoDB
router.post('/:hub', handleFileUpload, async (req, res) => {
  try {
    const { hub } = req.params;
    const body = req.body || {};

    const {
      section,
      title,
      subtitle,
      description,
      category,
      year,
      date,
      badge,
      author,
      status,
      icon,
      link,
      fileName: initialFileName,
      fileSize: initialFileSize,
    } = body;

    // استخراج الملف المرفوع سواء من req.file أو req.files
    let uploadedFile = req.file;
    if (!uploadedFile && req.files && req.files.length > 0) {
      uploadedFile = req.files[0];
    }

    let fileUrl = body.fileUrl || '';
    let fileName = initialFileName || body.name || '';
    let fileSize = initialFileSize || '';

    // إذا تم رفع ملف، قم برفعه إلى Cloudinary للحصول على رابط سحابي دائم ومباشر
    if (uploadedFile && uploadedFile.buffer && uploadedFile.buffer.length > 0) {
      fileName = fileName || uploadedFile.originalname;
      const sizeInMB = uploadedFile.size / (1024 * 1024);
      fileSize = fileSize || (sizeInMB >= 1 ? `${sizeInMB.toFixed(2)} MB` : `${Math.round(uploadedFile.size / 1024)} KB`);

      if (isCloudinaryConfigured()) {
        try {
          console.log(`[Cloudinary] Uploading file: ${fileName} (${fileSize}) to Cloudinary...`);
          const cloudResult = await uploadBufferToCloudinary(uploadedFile.buffer, {
            folder: `cairo_univ_${hub || 'cms'}`,
            filename: fileName,
            resourceType: 'auto',
          });
          fileUrl = cloudResult.secure_url;
          console.log(`[Cloudinary] File uploaded successfully: ${fileUrl}`);
        } catch (uploadError) {
          console.error('[Cloudinary Upload Failed]:', uploadError.message);
          return res.status(500).json({
            success: false,
            message: `فشل رفع الملف إلى التخزين السحابي Cloudinary: ${uploadError.message}`,
            error: uploadError.message,
          });
        }
      } else {
        console.warn('[Cloudinary Warning]: Cloudinary credentials not configured. Storing mock cloud link.');
        // رابط بديل آمن عند عدم توفر بيانات Cloudinary محلياً
        if (!fileUrl) {
          fileUrl = `https://placehold.co/800x600?text=${encodeURIComponent(fileName || 'Document')}`;
        }
      }
    }

    // استخراج ومعالجة extraData
    let extraData = body.extraData || {};
    if (typeof extraData === 'string') {
      try {
        extraData = JSON.parse(extraData);
      } catch (e) {
        extraData = { notes: extraData };
      }
    }

    if (body.extraNotes) extraData.extraNotes = body.extraNotes;
    if (fileName) extraData.fileName = fileName;
    if (fileSize) extraData.fileSize = fileSize;

    // التحقق من وجود العنوان أو استخدام اسم الملف كعنوان افتراضي
    const finalTitle = (title && title.trim()) ? title.trim() : (fileName ? fileName.replace(/\.[^/.]+$/, '') : '');
    if (!finalTitle) {
      return res.status(400).json({
        success: false,
        message: 'عنوان المحتوى مطلوب (Content title is required)',
      });
    }

    // حفظ الرابط السحابي فقط في MongoDB Atlas بدون Base64
    const newItem = new HubContent({
      hub,
      section: section || 'general',
      title: finalTitle,
      subtitle: subtitle || '',
      description: description || '',
      category: category || 'عام',
      year: year || new Date().getFullYear().toString(),
      date: date || new Date().toLocaleDateString('ar-EG'),
      badge: badge || '',
      author: author || 'إدارة الرابطة',
      status: status || 'نشط',
      icon: icon || '📌',
      fileUrl: fileUrl || '',
      fileSize: fileSize || '',
      link: link || '',
      extraData: extraData || {},
    });

    await newItem.save();

    res.status(201).json({
      success: true,
      message: 'تم إضافة المحتوى ورفع الملف إلى التخزين السحابي وحفظه بنجاح في السجل المركزي!',
      data: newItem,
    });
  } catch (error) {
    console.error('Create Hub Content Error:', error.message, error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to create hub content: ' + error.message,
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
    });
  }
});

// 4. تعديل عنصر محتوى موجود (Update Hub Content - Admin CMS)
router.put('/:id', handleFileUpload, async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body || {};
    const updateData = { ...body };

    // فحص إن كان هناك ملف جديد مرفوع للرفع إلى Cloudinary
    let uploadedFile = req.file;
    if (!uploadedFile && req.files && req.files.length > 0) {
      uploadedFile = req.files[0];
    }

    if (uploadedFile && uploadedFile.buffer && uploadedFile.buffer.length > 0) {
      const fileName = uploadedFile.originalname;
      const sizeInMB = uploadedFile.size / (1024 * 1024);
      const fileSize = sizeInMB >= 1 ? `${sizeInMB.toFixed(2)} MB` : `${Math.round(uploadedFile.size / 1024)} KB`;

      if (isCloudinaryConfigured()) {
        try {
          console.log(`[Cloudinary Update] Uploading file: ${fileName} to Cloudinary...`);
          const cloudResult = await uploadBufferToCloudinary(uploadedFile.buffer, {
            folder: 'cairo_univ_cms',
            filename: fileName,
            resourceType: 'auto',
          });
          updateData.fileUrl = cloudResult.secure_url;
          updateData.fileSize = fileSize;
          updateData.fileName = fileName;
        } catch (uploadError) {
          console.error('[Cloudinary Update Upload Failed]:', uploadError.message);
          return res.status(500).json({
            success: false,
            message: `فشل رفع الملف الجديد إلى Cloudinary: ${uploadError.message}`,
            error: uploadError.message,
          });
        }
      } else {
        updateData.fileSize = fileSize;
        updateData.fileName = fileName;
        if (!updateData.fileUrl) {
          updateData.fileUrl = `https://placehold.co/800x600?text=${encodeURIComponent(fileName)}`;
        }
      }
    }

    if (typeof updateData.extraData === 'string') {
      try {
        updateData.extraData = JSON.parse(updateData.extraData);
      } catch (e) {
        updateData.extraData = { notes: updateData.extraData };
      }
    }

    const updatedItem = await HubContent.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedItem) {
      return res.status(404).json({ success: false, message: 'عنصر المحتوى غير موجود' });
    }

    res.json({
      success: true,
      message: 'تم تحديث المحتوى والمرفق السحابي بنجاح في قاعدة البيانات',
      data: updatedItem,
    });
  } catch (error) {
    console.error('Update Hub Content Error:', error.message, error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to update hub content: ' + error.message,
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
    });
  }
});

// 5. حذف عنصر محتوى (Delete Hub Content - Admin CMS)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await HubContent.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ success: false, message: 'عنصر المحتوى غير موجود' });
    }

    res.json({
      success: true,
      message: 'تم حذف المحتوى بنجاح من قاعدة البيانات',
      deletedId: id,
    });
  } catch (error) {
    console.error('Delete Hub Content Error:', error.message, error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to delete hub content: ' + error.message,
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
    });
  }
});

module.exports = router;
