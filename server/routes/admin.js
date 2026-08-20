const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Announcement = require('../models/Announcement');
const Settings = require('../models/Settings');
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

// 1. جلب إحصائيات لوحة الإدارة
router.get('/stats', async (req, res) => {
  try {
    const totalStudents = await User.countDocuments();
    const verifiedStudents = await User.countDocuments({ $or: [{ verificationStatus: { $in: ['verified', 'approved'] } }, { status: 'approved' }] });
    const pendingStudents = await User.countDocuments({ verificationStatus: 'pending' });
    const rejectedStudents = await User.countDocuments({ $or: [{ verificationStatus: 'rejected' }, { status: 'rejected' }] });
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
    console.error('Admin Stats Error:', error);
    res.status(500).json({ success: false, message: 'خطأ في جلب إحصائيات الإدارة' });
  }
});

// 2. جلب قائمة الطلاب
router.get('/students', async (req, res) => {
  try {
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
        filter.$or = [{ verificationStatus: { $in: ['verified', 'approved'] } }, { status: 'approved' }];
      } else if (status === 'rejected') {
        filter.$or = [{ verificationStatus: 'rejected' }, { status: 'rejected' }];
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

    res.json({ success: true, count: students.length, students });
  } catch (error) {
    console.error('Fetch Students Error:', error);
    res.status(500).json({ success: false, message: 'خطأ في جلب بيانات الطلاب' });
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
    console.error('Update Status Error:', error);
    res.status(500).json({ success: false, message: 'خطأ في تحديث حالة الطالب' });
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
    console.error('Update Role Error:', error);
    res.status(500).json({ success: false, message: 'خطأ في تحديث رتبة المستخدم' });
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
    console.error('Delete Student Error:', error);
    res.status(500).json({ success: false, message: 'خطأ أثناء حذف الطالب' });
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
    console.error('Export CSV Error:', error);
    res.status(500).json({ success: false, message: 'فشل تصدير ملف البيانات' });
  }
});

// 7. مسارات الإعلانات وشريط الأخبار العاجلة مع بث الإشعارات التلقائية
router.get('/announcements', async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ isPinned: -1, date: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب الإعلانات' });
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
    res.status(500).json({ message: 'خطأ في حفظ الإعلان' });
  }
});

router.delete('/announcements/:id', async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'تم حذف الإعلان' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في حذف الإعلان' });
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
    res.status(500).json({ message: 'خطأ في جلب الإعدادات' });
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
    res.status(500).json({ message: 'خطأ في حفظ الإعدادات' });
  }
});

module.exports = router;

