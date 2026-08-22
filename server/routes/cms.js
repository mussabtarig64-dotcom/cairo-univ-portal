const express = require('express');
const router = express.Router();
const HubContent = require('../models/HubContent');

// 1. جلب محتويات قطاع معين (Hub Content Fetch)
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

// 2. إنشاء عنصر محتوى جديد (Create Hub Content - Admin CMS)
router.post('/:hub', async (req, res) => {
  try {
    const { hub } = req.params;
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
      fileUrl,
      fileSize,
      link,
      extraData,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'عنوان المحتوى مطلوب' });
    }

    const newItem = new HubContent({
      hub,
      section: section || 'general',
      title: title.trim(),
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
      message: 'Failed to create hub content',
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
    });
  }
});

// 3. تعديل عنصر محتوى موجود (Update Hub Content - Admin CMS)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

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
      message: 'Failed to update hub content',
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
    });
  }
});

// 4. حذف عنصر محتوى (Delete Hub Content - Admin CMS)
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
      message: 'Failed to delete hub content',
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
    });
  }
});

module.exports = router;
