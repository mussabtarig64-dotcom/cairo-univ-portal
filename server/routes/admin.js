const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Announcement = require('../models/Announcement');
const Settings = require('../models/Settings');
const KnowledgeBase = require('../models/KnowledgeBase');
const {
  sendStatusUpdateEmail,
  sendRoleUpdateEmail,
  sendAnnouncementBroadcastEmail,
} = require('../utils/emailService');
const {
  sendStatusUpdateSMS,
  sendRoleUpdateSMS,
  sendAnnouncementSMS,
} = require('../utils/smsService');

// 0. نقطة الصيانة الإجبارية لتنظيف قاعدة البيانات والاحتفاظ بالأدمن الأساسي فقط (Hard Reset DB Endpoint)
router.get('/hard-reset-db', async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    const email = 'mussab@gmail.com';
    const plainPassword = '123456789';
    const name = 'مصعب طارق (المدير العام)';
    const role = 'admin';

    // 1. مسح جميع المستخدمين باستثناء الأدمن ثم إعادة بناء الأدمن بصورة نقية
    await User.deleteMany({});

    // 2. تشفير كلمة المرور وتعيين حساب الأدمن الأساسي
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    const admin = await User.create({
      fullName: name,
      name: name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role,
      isAdmin: true,
      isApproved: true,
      status: 'approved',
      verificationStatus: 'verified',
      phone: '01000000000',
      whatsapp: '01000000000',
      cairoAddress: 'مقر الرابطة - كلية العلوم جامعة القاهرة',
      residence: 'مقر الرابطة - كلية العلوم جامعة القاهرة',
      studentId: 'ADMIN-MUSSAB',
      academicId: 'ADMIN-MUSSAB',
      department: 'إدارة الرابطة',
      academicLevel: 'هيئة إدارية',
      academicYear: 'هيئة إدارية',
    });

    console.log('✅ Database wiped. Only main admin retained.');
    res.json({
      success: true,
      message: 'Database wiped. Only main admin retained.',
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role,
        isApproved: admin.isApproved,
        status: admin.status,
      },
    });
  } catch (error) {
    console.error('Hard Reset DB Error:', error.message, error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to hard reset database',
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });
  }
});

// 1. جلب إحصائيات لوحة الإدارة
router.get('/stats', async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    const totalStudents = await User.countDocuments({ role: { $ne: 'admin' } });
    const verifiedStudents = await User.countDocuments({
      role: { $ne: 'admin' },
      $or: [{ verificationStatus: { $in: ['verified', 'approved'] } }, { status: 'approved' }, { isApproved: true }],
    });
    const pendingStudents = await User.countDocuments({
      role: { $ne: 'admin' },
      $or: [{ verificationStatus: 'pending' }, { status: 'pending' }, { isApproved: false }],
    });
    const rejectedStudents = await User.countDocuments({
      role: { $ne: 'admin' },
      $or: [{ verificationStatus: 'rejected' }, { status: 'rejected' }],
    });
    const adminCount = await User.countDocuments({ role: 'admin' });

    res.json({
      success: true,
      totalStudents,
      verifiedStudents,
      pendingStudents,
      rejectedStudents,
      adminCount,
    });
  } catch (error) {
    console.error('Admin Stats Error:', error.message, error.stack);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب إحصائيات الإدارة',
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });
  }
});

// 1.1 جلب الطلاب المعلقين مباشرة (Pending Registrations Endpoint)
router.get(['/pending', '/pending-students', '/pending-registrations'], async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    const pending = await User.find({
      role: { $ne: 'admin' },
      $or: [
        { verificationStatus: 'pending' },
        { status: 'pending' },
        { isApproved: false },
        { verificationStatus: { $exists: false } },
        { verificationStatus: null },
      ],
      $and: [
        { verificationStatus: { $ne: 'rejected' } },
        { status: { $ne: 'rejected' } },
        { verificationStatus: { $nin: ['verified', 'approved'] } },
        { status: { $ne: 'approved' } },
        { isApproved: { $ne: true } },
      ],
    })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: pending.length,
      students: pending,
      users: pending,
    });
  } catch (error) {
    console.error('Fetch Pending Students Error:', error.message, error.stack);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب بيانات الطلاب المعلقين',
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });
  }
});

// 1.2 جلب جميع المستخدمين مباشرة (All Users Endpoint)
router.get(['/users', '/all-users'], async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users,
      students: users,
    });
  } catch (error) {
    console.error('Fetch Users Error:', error.message, error.stack);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب بيانات المستخدمين',
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });
  }
});

// 2. جلب قائمة الطلاب
router.get('/students', async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    const { search, status, role, limit = 500 } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
        { academicId: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { whatsapp: { $regex: search, $options: 'i' } },
        { cairoAddress: { $regex: search, $options: 'i' } },
        { residence: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
      ];
    }

    if (status && status !== 'all') {
      if (status === 'verified' || status === 'approved') {
        filter.$or = [{ verificationStatus: { $in: ['verified', 'approved'] } }, { status: 'approved' }, { isApproved: true }];
      } else if (status === 'rejected') {
        filter.$or = [{ verificationStatus: 'rejected' }, { status: 'rejected' }];
      } else if (status === 'pending') {
        filter.role = { $ne: 'admin' };
        filter.$or = [{ verificationStatus: 'pending' }, { status: 'pending' }, { isApproved: false }];
      } else {
        filter.verificationStatus = status;
      }
    }

    if (role && role !== 'all') {
      filter.role = role;
    }

    const students = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit, 10));

    res.json({ success: true, count: students.length, students, users: students });
  } catch (error) {
    console.error('Fetch Students Error:', error.message, error.stack);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب بيانات الطلاب',
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });
  }
});

// 3. تحديث حالة قبول/رفض الطالب (Approve / Reject) وإرسال الإشعارات التلقائية
router.patch('/students/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const normalizedStatus = status === 'approved' ? 'verified' : status;

    if (!['verified', 'pending', 'rejected'].includes(normalizedStatus)) {
      return res.status(400).json({ success: false, message: 'حالة التحقق غير صالحة' });
    }

    const student = await User.findByIdAndUpdate(
      id,
      {
        verificationStatus: normalizedStatus,
        status: normalizedStatus === 'verified' ? 'approved' : normalizedStatus,
        notes: notes || '',
      },
      { new: true }
    ).select('-password');

    if (!student) {
      return res.status(404).json({ success: false, message: 'لم يتم العثور على الطالب' });
    }

    // إرسال إشعارات البريد والرسائل (Email & SMS/WhatsApp) تلقائياً
    Promise.allSettled([
      sendStatusUpdateEmail(student, normalizedStatus, notes),
      sendStatusUpdateSMS(student, normalizedStatus, notes),
    ]).then(() => {
      console.log(`📬 [Auto-Alert] تم إرسال إشعار تحديث الحالة (${normalizedStatus}) للطالب: ${student.fullName}`);
    }).catch((err) => {
      console.error('Status notification note:', err.message);
    });

    res.json({
      success: true,
      message: `تم تحديث حالة الطالب بنجاح إلى: ${normalizedStatus === 'verified' ? 'معتمد' : 'مرفوض'}، وتم إرسال الإشعار التأكيدي عبر البريد والرسائل.`,
      student,
    });
  } catch (error) {
    console.error('Update Status Error:', error.message, error.stack);
    res.status(500).json({
      success: false,
      message: 'خطأ في تحديث حالة الطالب',
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });
  }
});

// 4. ترقية أو سحب صلاحيات الأدمن (Promote / Demote Role) وإرسال الإشعار
router.patch('/students/:id/role', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ success: false, message: 'الرتبة المحددة غير صالحة' });
    }

    const student = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select('-password');

    if (!student) {
      return res.status(404).json({ success: false, message: 'لم يتم العثور على المستخدم' });
    }

    // إرسال إشعارات الترقية وتعديل الصلاحيات (Email & SMS/WhatsApp)
    Promise.allSettled([
      sendRoleUpdateEmail(student, role),
      sendRoleUpdateSMS(student, role),
    ]).then(() => {
      console.log(`🛡️ [Auto-Alert] تم إرسال إشعار تحديث الرتبة (${role}) للمستخدم: ${student.fullName}`);
    }).catch((err) => {
      console.error('Role notification note:', err.message);
    });

    res.json({
      success: true,
      message: role === 'admin'
        ? 'تمت ترقية المستخدم إلى رتبة أدمن بنجاح وإرسال إشعار الترقية 🛡️'
        : 'تمت إزالة صلاحية الأدمن وإعادته إلى رتبة مستخدم عادي',
      student,
    });
  } catch (error) {
    console.error('Update Role Error:', error.message, error.stack);
    res.status(500).json({
      success: false,
      message: 'خطأ في تحديث رتبة المستخدم',
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });
  }
});

// 5. حذف سجل طالب
router.delete('/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'لم يتم العثور على الطالب لحذفه' });
    }
    res.json({ success: true, message: 'تم حذف سجل الطالب بنجاح' });
  } catch (error) {
    console.error('Delete Student Error:', error.message, error.stack);
    res.status(500).json({
      success: false,
      message: 'خطأ أثناء حذف الطالب',
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });
  }
});

// 6. تصدير قاعدة بيانات الطلاب كملف CSV موحد
router.get('/export', async (req, res) => {
  try {
    const students = await User.find().sort({ createdAt: -1 }).lean();

    const headers = [
      'الاسم الكامل',
      'العمر',
      'البريد الإلكتروني',
      'رقم الهاتف',
      'رقم الواتساب',
      'مكان السكن بالقاهرة',
      'الرقم الأكاديمي / رقم القيد',
      'القسم العلمي',
      'المستوى الأكاديمي',
      'اسم جهة اتصال الطوارئ',
      'صلة القرابة',
      'هاتف الطوارئ',
      'الرتبة',
      'حالة القيد',
      'تاريخ التسجيل',
    ];

    const escapeCsv = (str) => {
      if (!str) return '""';
      const clean = String(str).replace(/"/g, '""');
      return `"${clean}"`;
    };

    const rows = students.map((s) => [
      escapeCsv(s.fullName || s.name),
      escapeCsv(s.age || 'غير محدد'),
      escapeCsv(s.email),
      escapeCsv(s.phone),
      escapeCsv(s.whatsapp || s.phone),
      escapeCsv(s.cairoAddress || s.residence),
      escapeCsv(s.studentId || s.academicId),
      escapeCsv(s.department),
      escapeCsv(s.academicLevel || s.academicYear),
      escapeCsv(s.emergencyContactName || s.emergencyContact || 'غير متوفر'),
      escapeCsv(s.emergencyContactRelation || 'غير متوفر'),
      escapeCsv(s.emergencyContactPhone || 'غير متوفر'),
      escapeCsv(s.role === 'admin' ? 'أدمن / إدارة' : 'طالب / عضو'),
      escapeCsv(s.verificationStatus === 'verified' || s.verificationStatus === 'approved' || s.status === 'approved' ? 'معتمد' : s.verificationStatus === 'rejected' || s.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة'),
      escapeCsv(new Date(s.createdAt || Date.now()).toLocaleDateString('ar-EG')),
    ]);

    // تضمين BOM لدعم اللغة العربية في برنامج Excel
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="SSA-FS-CU-Students-Database-${Date.now()}.csv"`);
    res.status(200).send(csvContent);
  } catch (error) {
    console.error('Export CSV Error:', error.message, error.stack);
    res.status(500).json({
      success: false,
      message: 'فشل تصدير ملف البيانات',
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });
  }
});

// 7. مسارات الإعلانات وشريط الأخبار العاجلة مع بث الإشعارات التلقائية
router.get('/announcements', async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ isPinned: -1, date: -1 });
    res.json(announcements);
  } catch (error) {
    console.error('Fetch Announcements Error:', error.message, error.stack);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الإعلانات',
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });
  }
});

router.post('/announcements', async (req, res) => {
  try {
    const { title, content, category, isPinned } = req.body;
    if (!title && !content) {
      return res.status(400).json({ message: 'المحتوى مطلوب' });
    }
    const newAnnouncement = new Announcement({
      title: title || 'تنويه عام',
      content: content || title,
      category: category || 'عام',
      isPinned: !!isPinned,
    });
    await newAnnouncement.save();

    // إرسال إشعارات الإعلان العاجل للطلاب النشطين إذا كان مثبتاً أو هاماً
    if (isPinned) {
      User.find({ verificationStatus: { $in: ['verified', 'approved'] } })
        .limit(100)
        .then((students) => {
          students.forEach((student) => {
            sendAnnouncementBroadcastEmail(student, newAnnouncement).catch(() => {});
            sendAnnouncementSMS(student, newAnnouncement).catch(() => {});
          });
        })
        .catch(() => {});
    }

    res.status(201).json({ success: true, announcement: newAnnouncement });
  } catch (error) {
    console.error('Save Announcement Error:', error.message, error.stack);
    res.status(500).json({
      success: false,
      message: 'خطأ في حفظ الإعلان',
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });
  }
});

router.delete('/announcements/:id', async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'تم حذف الإعلان' });
  } catch (error) {
    console.error('Delete Announcement Error:', error.message, error.stack);
    res.status(500).json({
      success: false,
      message: 'خطأ في حذف الإعلان',
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });
  }
});

// 8. مسارات إعدادات المظهر والثيمات العامة (Admin-Exclusive Theme Settings)
router.get('/settings', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({ activeTheme: 'classic-gold-blue' });
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    console.error('Get Settings Error:', error.message, error.stack);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الإعدادات',
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });
  }
});

router.post('/settings', async (req, res) => {
  try {
    const { activeTheme, themeTitle } = req.body;
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();

    if (activeTheme) settings.activeTheme = activeTheme;
    if (themeTitle) settings.themeTitle = themeTitle;
    settings.updatedAt = new Date();

    await settings.save();
    res.json({ success: true, settings });
  } catch (error) {
    console.error('Save Settings Error:', error.message, error.stack);
    res.status(500).json({
      success: false,
      message: 'خطأ في حفظ الإعدادات',
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });
  }
});

// 9. مسارات قاعدة المعرفة للمستشار الأكاديمي (Admin Knowledge Base / FAQ CRUD)
router.get('/faq', async (req, res) => {
  try {
    const items = await KnowledgeBase.find().sort({ createdAt: -1 });
    res.json({ success: true, items });
  } catch (error) {
    console.error('Get FAQ Error:', error.message, error.stack);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب بيانات قاعدة المعرفة',
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });
  }
});

router.post('/faq', async (req, res) => {
  try {
    const { question, answer, category, keywords, isActive } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ success: false, message: 'السؤال والإجابة حقول إجبارية' });
    }

    const newItem = new KnowledgeBase({
      question,
      answer,
      category: category || 'general',
      keywords: Array.isArray(keywords) ? keywords : (keywords || '').split(',').map((k) => k.trim()).filter(Boolean),
      isActive: isActive !== undefined ? isActive : true,
    });

    await newItem.save();
    res.status(201).json({ success: true, message: 'تم إضافة السؤال إلى قاعدة المعرفة بنجاح', item: newItem });
  } catch (error) {
    console.error('Save FAQ Error:', error.message, error.stack);
    res.status(500).json({
      success: false,
      message: 'خطأ في حفظ السؤال بقاعدة المعرفة',
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });
  }
});

router.put('/faq/:id', async (req, res) => {
  try {
    const { question, answer, category, keywords, isActive } = req.body;
    const updateData = { updatedAt: new Date() };

    if (question !== undefined) updateData.question = question;
    if (answer !== undefined) updateData.answer = answer;
    if (category !== undefined) updateData.category = category;
    if (keywords !== undefined) {
      updateData.keywords = Array.isArray(keywords) ? keywords : (keywords || '').split(',').map((k) => k.trim()).filter(Boolean);
    }
    if (isActive !== undefined) updateData.isActive = isActive;

    const item = await KnowledgeBase.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!item) {
      return res.status(404).json({ success: false, message: 'العنصر غير موجود' });
    }

    res.json({ success: true, message: 'تم تحديث عنصر قاعدة المعرفة بنجاح', item });
  } catch (error) {
    console.error('Update FAQ Error:', error.message, error.stack);
    res.status(500).json({
      success: false,
      message: 'خطأ في تحديث عنصر قاعدة المعرفة',
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });
  }
});

router.patch('/faq/:id/toggle', async (req, res) => {
  try {
    const item = await KnowledgeBase.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'العنصر غير موجود' });
    }

    item.isActive = !item.isActive;
    item.updatedAt = new Date();
    await item.save();

    res.json({ success: true, message: 'تم تغيير حالة التفعيل بنجاح', isActive: item.isActive, item });
  } catch (error) {
    console.error('Toggle FAQ Error:', error.message, error.stack);
    res.status(500).json({
      success: false,
      message: 'خطأ في تغيير حالة التفعيل',
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });
  }
});

router.delete('/faq/:id', async (req, res) => {
  try {
    await KnowledgeBase.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'تم حذف السؤال من قاعدة المعرفة بنجاح' });
  } catch (error) {
    console.error('Delete FAQ Error:', error.message, error.stack);
    res.status(500).json({
      success: false,
      message: 'خطأ في حذف عنصر قاعدة المعرفة',
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });
  }
});

module.exports = router;

