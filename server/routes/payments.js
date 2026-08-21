const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const Payment = require('../models/Payment');
const User = require('../models/User');
const { sendPaymentStatusEmail } = require('../utils/emailService');

// إعداد Multer لتخزين الملفات في الذاكرة (Serverless-Safe Memory Storage) وتجنب تجاوز حد الـ 4.5MB
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 4.5 * 1024 * 1024 }, // 4.5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('الملف يجب أن يكون صورة (JPG, PNG, WEBP) أو مستند PDF'));
    }
  },
});

// 1. مسار رفع إيصال دفع جديد (Student Submits Payment)
// يدعم إما رفع ملف عبر multipart/form-data أو إرسال JSON يحتوي على Base64
router.post('/', (req, res, next) => {
  upload.single('receiptFile')(req, res, (err) => {
    if (err) {
      console.error('Multer memory upload error:', err.message, err.stack);
      return res.status(400).json({
        success: false,
        message: err.code === 'LIMIT_FILE_SIZE' 
          ? 'حجم ملف الإيصال كبير جداً. الحد الأقصى المسموح به هو 4.5 ميجابايت.'
          : `خطأ في رفع ملف الإيصال: ${err.message}`,
        error: err.message
      });
    }
    next();
  });
}, async (req, res) => {
  try {
    const {
      studentEmail,
      studentName,
      studentId,
      department,
      phone,
      activityType,
      amount,
      transactionId,
      paymentMethod,
      receiptBase64,
      notes,
    } = req.body || {};

    if (!studentEmail || !studentName || !amount || !transactionId) {
      return res.status(400).json({
        success: false,
        message: 'يرجى استكمال جميع البيانات المطلوبة (الاسم، البريد، المبلغ، ورقم العملية).',
      });
    }

    let receiptUrl = '';
    if (req.file) {
      receiptUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    } else if (receiptBase64) {
      receiptUrl = receiptBase64;
    } else if (req.body && req.body.receiptUrl) {
      receiptUrl = req.body.receiptUrl;
    } else {
      receiptUrl = 'https://placehold.co/400?text=Receipt';
    }

    // محاولة ربط الدفعة بحساب الطالب إن وجد في قاعدة البيانات
    let studentObj = await User.findOne({ email: studentEmail.toLowerCase().trim() });

    const newPayment = new Payment({
      student: studentObj ? studentObj._id : null,
      studentName: studentName.trim(),
      studentEmail: studentEmail.toLowerCase().trim(),
      studentId: studentId || studentObj?.studentId || 'قيد المراجعة',
      department: department || studentObj?.department || 'العلوم العامة',
      phone: phone || studentObj?.phone || 'غير محدد',
      activityType: activityType || 'الاشتراك السنوي للرابطة (Annual Membership)',
      amount: Number(amount),
      transactionId: transactionId.trim(),
      paymentMethod: paymentMethod || 'vodafone_cash',
      receiptUrl: receiptUrl,
      notes: notes || '',
      status: 'pending',
      createdAt: new Date(),
    });

    await newPayment.save();

    res.status(201).json({
      success: true,
      message: 'تم إرسال إشعار الدفع بنجاح! سيتم مراجعته وتأكيده من الأمانة المالية للرابطة.',
      payment: newPayment,
    });
  } catch (error) {
    console.error('Payment Submission Error:', error.message, error.stack);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في الخادم أثناء تسجيل إشعار الدفع.',
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });
  }
});

// 2. جلب مدفوعات الطالب المسجل الحالية (My Payments)
router.get('/my', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ success: false, message: 'البريد الإلكتروني مطلوب' });
    }

    const payments = await Payment.find({
      studentEmail: email.toLowerCase().trim(),
    }).sort({ createdAt: -1 });

    res.json({ success: true, count: payments.length, payments });
  } catch (error) {
    console.error('Fetch My Payments Error:', error.message, error.stack);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب سجل المدفوعات',
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });
  }
});

// 3. مسار لوحة الإدارة: جلب كافة المدفوعات مع البحث والتصفية (Admin List Payments)
router.get('/', async (req, res) => {
  try {
    const { search, status, activityType, limit = 100 } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (activityType && activityType !== 'all') {
      filter.activityType = activityType;
    }

    if (search) {
      filter.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { studentEmail: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
        { transactionId: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const payments = await Payment.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit, 10));

    res.json({ success: true, count: payments.length, payments });
  } catch (error) {
    console.error('Admin Fetch Payments Error:', error.message, error.stack);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب قائمة المدفوعات',
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });
  }
});

// 4. إحصائيات المدفوعات والأموال المحصلة (Admin Financial Stats)
router.get('/stats', async (req, res) => {
  try {
    const totalCount = await Payment.countDocuments();
    const pendingCount = await Payment.countDocuments({ status: 'pending' });
    const approvedCount = await Payment.countDocuments({ status: 'approved' });
    const rejectedCount = await Payment.countDocuments({ status: 'rejected' });

    // إجمالي المبالغ المحصلة المعتمدة
    const approvedSums = await Payment.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, totalRevenue: { $sum: '$amount' } } },
    ]);
    const totalApprovedRevenue = approvedSums[0]?.totalRevenue || 0;

    // المبالغ قيد المراجعة
    const pendingSums = await Payment.aggregate([
      { $match: { status: 'pending' } },
      { $group: { _id: null, totalPending: { $sum: '$amount' } } },
    ]);
    const totalPendingAmount = pendingSums[0]?.totalPending || 0;

    // إحصائيات حسب نوع الفعالية
    const activityStats = await Payment.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$activityType', totalAmount: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { totalAmount: -1 } },
    ]);

    res.json({
      success: true,
      totalCount,
      pendingCount,
      approvedCount,
      rejectedCount,
      totalApprovedRevenue,
      totalPendingAmount,
      activityStats,
    });
  } catch (error) {
    console.error('Payment Stats Error:', error.message, error.stack);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب إحصائيات المدفوعات',
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });
  }
});

// 5. تحديث حالة الدفعة (اعتماد / رفض / كتابة ملاحظات + إرسال بريد) (Admin Update Payment Status)
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes, reviewedBy = 'الأمانة المالية' } = req.body;

    if (!['approved', 'pending', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'حالة الدفع غير صالحة' });
    }

    const updateData = {
      status,
      reviewedBy,
      reviewedAt: new Date(),
    };
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

    const payment = await Payment.findByIdAndUpdate(id, updateData, { new: true });
    if (!payment) {
      return res.status(404).json({ success: false, message: 'لم يتم العثور على سجل الدفع' });
    }

    // إرسال بريد إلكتروني تلقائي للطالب بإشعار حالة الدفع
    const student = await User.findOne({ email: payment.studentEmail });
    const emailResult = await sendPaymentStatusEmail(payment, student, status, adminNotes || '');

    res.json({
      success: true,
      message: `تم تحديث حالة الدفعة إلى: ${status === 'approved' ? 'معتمد وموثق' : status === 'rejected' ? 'مرفوض' : 'قيد المراجعة'}`,
      payment,
      emailSent: emailResult.sent,
      emailPreview: emailResult.previewUrl || null,
    });
  } catch (error) {
    console.error('Update Payment Status Error:', error.message, error.stack);
    res.status(500).json({
      success: false,
      message: 'خطأ في تحديث حالة الدفعة',
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });
  }
});

// 6. حذف سجل معاملة مالية (Admin Delete Payment)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Payment.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'لم يتم العثور على سجل المعاملة' });
    }
    res.json({ success: true, message: 'تم حذف سجل المعاملة المالية بنجاح' });
  } catch (error) {
    console.error('Delete Payment Error:', error.message, error.stack);
    res.status(500).json({
      success: false,
      message: 'خطأ أثناء حذف المعاملة المالية',
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });
  }
});

module.exports = router;
