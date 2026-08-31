const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// 1. جلب قائمة الإشعارات العامة والحديثة
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(40);
    res.json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error('Fetch Notifications Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'فشل جلب الإشعارات',
      error: error.message,
    });
  }
});

// 2. بث ونشر إشعار جديد لجميع الطلاب والأجهزة (Admin Push Notification Broadcast)
router.post('/', async (req, res) => {
  try {
    const { title, message, type, link, sender, senderRole } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'عنوان الإشعار ونص الرسالة مطلوبان',
      });
    }

    const newNotification = new Notification({
      title: title.trim(),
      message: message.trim(),
      type: type || 'general',
      link: link || '/',
      sender: sender || 'إدارة الرابطة',
      senderRole: senderRole || 'admin',
    });

    await newNotification.save();

    // البث الحي عبر Socket.IO لجميع المستخدمين المتصلين لحظياً
    if (req.io) {
      req.io.emit('new_notification', newNotification);
    }

    res.status(201).json({
      success: true,
      message: 'تم إرسال وبث الإشعار لجميع الأجهزة والطلاب بنجاح 🔔🚀',
      notification: newNotification,
    });
  } catch (error) {
    console.error('Broadcast Notification Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'فشل إرسال الإشعار',
      error: error.message,
    });
  }
});

// 3. تحديد الإشعار كمقروء للمستخدم
router.post('/:id/read', async (req, res) => {
  try {
    const { userEmail } = req.body;
    if (!userEmail) {
      return res.json({ success: true });
    }

    await Notification.findByIdAndUpdate(req.params.id, {
      $addToSet: { readBy: userEmail },
    });

    res.json({ success: true, message: 'تم تحديث حالة القراءة' });
  } catch (error) {
    console.error('Mark Notification Read Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. تحديد جميع الإشعارات كمقروءة للمستخدم
router.post('/mark-all-read', async (req, res) => {
  try {
    const { userEmail } = req.body;
    if (!userEmail) {
      return res.json({ success: true });
    }

    await Notification.updateMany(
      {},
      { $addToSet: { readBy: userEmail } }
    );

    res.json({ success: true, message: 'تم تحديد كافة الإشعارات كمقروءة' });
  } catch (error) {
    console.error('Mark All Read Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. حذف إشعار (Admin)
router.delete('/:id', async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'تم حذف الإشعار بنجاح' });
  } catch (error) {
    console.error('Delete Notification Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
