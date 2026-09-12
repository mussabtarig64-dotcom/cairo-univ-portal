const express = require('express');
const router = express.Router();
const multer = require('multer');
const HubContent = require('../models/HubContent');

// 1. إعداد Multer لتخزين الملفات في الذاكرة لبيئة Vercel Serverless (Serverless-Safe Memory Storage)
// يمنع أي محاولة للكتابة على القرص الصلب لتجنب أخطاء نظام الملفات للقراءة فقط في Vercel (Read-Only Filesystem)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // حد أقصى 10 ميجابايت للملف المرفق
  },
  fileFilter: (req, file, cb) => {
    // قبول المستندات والصور بمرونة تامة
    cb(null, true);
  },
});

// Middleware لمعالجة طلبات الـ Multipart والملفات المرفقة وتفادي أي انهيار غير متوقع
const handleFileUpload = (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err) {
      console.error('Multer file parsing error in CMS route:', err.message, err.stack);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'حجم الملف المرفق كبير جداً. الحد الأقصى المسموح به هو 10 ميجابايت.',
          error: err.message,
        });
      }
      return res.status(400).json({
        success: false,
        message: `خطأ أثناء قراءة الملف المرفق: ${err.message}`,
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
// يدعم استلام كل من JSON العادي و Multipart/Form-Data مع معالجة الملفات في الذاكرة
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

    // معالجة الملف المرفق في الذاكرة لبيئات Vercel Serverless بدون حفظ على القرص
    if (uploadedFile) {
      fileName = fileName || uploadedFile.originalname;
      const sizeInMB = uploadedFile.size / (1024 * 1024);
      fileSize = fileSize || (sizeInMB >= 1 ? `${sizeInMB.toFixed(2)} MB` : `${Math.round(uploadedFile.size / 1024)} KB`);

      if (uploadedFile.buffer && uploadedFile.buffer.length > 0) {
        // تحويل الملف إلى Data URI آمن للتخزين في MongoDB Atlas مباشرة
        const mime = uploadedFile.mimetype || 'application/octet-stream';
        fileUrl = `data:${mime};base64,${uploadedFile.buffer.toString('base64')}`;
      } else if (!fileUrl) {
        // رابط بديل آمن في حال عدم توفر buffer
        fileUrl = 'https://placehold.co/600x400?text=Document';
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
      message: 'تم إضافة المحتوى بنجاح وحفظه في السجل المركزي (MongoDB Atlas)',
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

    // فحص إن كان هناك ملف جديد مرفوع
    let uploadedFile = req.file;
    if (!uploadedFile && req.files && req.files.length > 0) {
      uploadedFile = req.files[0];
    }

    if (uploadedFile) {
      const fileName = uploadedFile.originalname;
      const sizeInMB = uploadedFile.size / (1024 * 1024);
      const fileSize = sizeInMB >= 1 ? `${sizeInMB.toFixed(2)} MB` : `${Math.round(uploadedFile.size / 1024)} KB`;
      const mime = uploadedFile.mimetype || 'application/octet-stream';

      updateData.fileUrl = `data:${mime};base64,${uploadedFile.buffer.toString('base64')}`;
      updateData.fileSize = fileSize;
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
      message: 'تم تحديث المحتوى بنجاح في قاعدة البيانات',
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
