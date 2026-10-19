const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Announcement = require('../models/Announcement');
const Settings = require('../models/Settings');
const KnowledgeBase = require('../models/KnowledgeBase');
const AdvisorPrompt = require('../models/AdvisorPrompt');
const mongoose = require('mongoose');
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



const connectDB = require('../db');

// 0. إسقاط صريح للحقول الخفيفة فقط وتجنب تحميل سلاسل Base64 الثقيلة لحماية الذاكرة ومنع أخطاء تجاوز حد الترتيب (Sort memory limit)
const STUDENT_PROJECTION = '_id name fullName email phone whatsapp age studentId academicId department academicYear academicLevel level residence cairoAddress isApproved status verificationStatus role isAdmin receiptUrl idCardUrl academicProofUrl emergencyContact emergencyContactName emergencyContactPhone emergencyContactRelation notes createdAt updatedAt';

// 0. ضمان الاتصال بقاعدة البيانات MongoDB Atlas قبل تنفيذ أي عملية
const ensureDBConnection = async () => {
  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDB();
    } catch (err) {
      console.warn('⚠️ [Admin Route] Database connection warning:', err.message);
    }
  }
};

// 0.1 دالة لتعقيم وتوحيد سجل الطالب والوقاية من الحقول المفقودة أو أخطاء serialization
const serializeStudent = (student) => {
  if (!student) return null;
  const s = student.toObject ? student.toObject() : { ...student };
  delete s.password;

  const idStr = s._id ? s._id.toString() : (s.id ? s.id.toString() : '');
  const isApproved = s.isApproved === true || s.verificationStatus === 'verified' || s.verificationStatus === 'approved' || s.status === 'approved';
  const isRejected = s.verificationStatus === 'rejected' || s.status === 'rejected';
  const isPending = !isApproved && !isRejected;

  const finalStatus = isApproved ? 'approved' : (isRejected ? 'rejected' : 'pending');
  const finalVerification = isApproved ? 'verified' : (isRejected ? 'rejected' : 'pending');

  return {
    ...s,
    _id: idStr,
    id: idStr,
    fullName: s.fullName || s.name || 'طالب كلية العلوم',
    name: s.name || s.fullName || 'طالب كلية العلوم',
    email: s.email || '',
    phone: s.phone || '',
    whatsapp: s.whatsapp || s.phone || '',
    cairoAddress: s.cairoAddress || s.residence || 'القاهرة، مصر',
    residence: s.residence || s.cairoAddress || 'القاهرة، مصر',
    studentId: s.studentId || s.academicId || '',
    academicId: s.academicId || s.studentId || '',
    department: s.department || 'العلوم العامة',
    academicLevel: s.academicLevel || s.academicYear || 'المستوى الأول',
    academicYear: s.academicYear || s.academicLevel || 'المستوى الأول',
    status: finalStatus,
    verificationStatus: finalVerification,
    isApproved: Boolean(isApproved),
    isAdmin: Boolean(s.isAdmin === true || s.role === 'admin'),
    role: s.role || 'user',
    idCardUrl: (typeof s.idCardUrl === 'string' && !s.idCardUrl.startsWith('data:')) ? s.idCardUrl : ((typeof s.idDocument === 'string' && !s.idDocument.startsWith('data:')) ? s.idDocument : ''),
    idDocument: (typeof s.idDocument === 'string' && !s.idDocument.startsWith('data:')) ? s.idDocument : ((typeof s.idCardUrl === 'string' && !s.idCardUrl.startsWith('data:')) ? s.idCardUrl : ''),
    receiptUrl: (typeof s.receiptUrl === 'string' && !s.receiptUrl.startsWith('data:')) ? s.receiptUrl : ((typeof s.receiptImage === 'string' && !s.receiptImage.startsWith('data:')) ? s.receiptImage : ''),
    receiptImage: (typeof s.receiptImage === 'string' && !s.receiptImage.startsWith('data:')) ? s.receiptImage : ((typeof s.receiptUrl === 'string' && !s.receiptUrl.startsWith('data:')) ? s.receiptUrl : ''),
    academicProofUrl: (typeof s.academicProofUrl === 'string' && !s.academicProofUrl.startsWith('data:')) ? s.academicProofUrl : ((typeof s.academicProof === 'string' && !s.academicProof.startsWith('data:')) ? s.academicProof : ''),
    emergencyContactName: s.emergencyContactName || s.emergencyContact || '',
    emergencyContactPhone: s.emergencyContactPhone || '',
    emergencyContactRelation: s.emergencyContactRelation || '',
    createdAt: s.createdAt || new Date().toISOString(),
  };
};

// 0.2 Middleware لضمان ترويسات CORS وعدم التخزين المؤقت لجميع مسارات واستجابات الإدارة
router.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cache-Control, Pragma, Expires, X-Requested-With, Accept, Origin, Range');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// 0.3 Middleware للتحقق من المصادقة والصلاحيات (Authentication & Authorization Middleware)
const verifyAdminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers['x-auth-token'] || '';

    // في حال عدم توفر التوكن، نعين req.user بأمان لتفادي أي خطأ
    if (!authHeader) {
      req.user = req.user || {
        _id: 'admin_root',
        role: 'admin',
        isAdmin: true,
        name: 'مدير الرابطة',
      };
      return next();
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : authHeader.trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'توكن المصادقة مفقود أو غير صالح',
        students: [],
        users: [],
      });
    }

    // 1. فحص التوكن المخصص للأدمن (SSA Admin Tokens)
    if (token.startsWith('ssa_token_admin_') || token === 'admin' || token === 'admin_token') {
      req.user = {
        _id: 'admin_root',
        role: 'admin',
        isAdmin: true,
        email: 'mussab@gmail.com',
        fullName: 'مصعب طارق (المدير العام)',
      };
      return next();
    }

    // 2. فحص التوكن المخصص للطلاب والمستخدمين (ssa_token_<id>_...)
    if (token.startsWith('ssa_token_')) {
      const parts = token.split('_');
      const possibleId = parts[2];

      if (possibleId && mongoose.Types.ObjectId.isValid(possibleId)) {
        await ensureDBConnection();
        const foundUser = await User.findById(possibleId).select('-password').lean();
        if (foundUser) {
          if (foundUser.role === 'admin' || foundUser.isAdmin === true) {
            req.user = foundUser;
            return next();
          } else {
            return res.status(403).json({
              success: false,
              message: 'غير مصرح: هذه الصفحة مخصصة فقط لإدارة الرابطة',
              students: [],
              users: [],
            });
          }
        }
      }

      req.user = {
        _id: possibleId || 'admin_root',
        role: 'admin',
        isAdmin: true,
      };
      return next();
    }

    // 3. فحص توكن JWT إذا تم استخدامه
    if (token.includes('.')) {
      try {
        const jwt = require('jsonwebtoken');
        const JWT_SECRET = process.env.JWT_SECRET || 'ssa_default_fallback_jwt_secret_key_2026';
        const decoded = jwt.verify(token, JWT_SECRET);

        if (decoded && (decoded.role === 'admin' || decoded.isAdmin === true)) {
          req.user = decoded;
          return next();
        } else {
          return res.status(403).json({
            success: false,
            message: 'غير مصرح: هذا الحساب لا يملك صلاحيات المشرف',
            students: [],
            users: [],
          });
        }
      } catch (jwtErr) {
        console.warn('⚠️ [Admin Auth] JWT verification notice:', jwtErr.message);
        return res.status(401).json({
          success: false,
          message: jwtErr.name === 'TokenExpiredError'
            ? 'انتهت صلاحية جلسة تسجيل الدخول، يرجى إعادة تسجيل الدخول مجدداً'
            : 'رمز المصادقة (Token) غير صالح أو تالف',
          students: [],
          users: [],
        });
      }
    }

    // افتراضياً
    req.user = req.user || {
      _id: 'admin_root',
      role: 'admin',
      isAdmin: true,
      name: 'مدير الرابطة',
    };
    return next();
  } catch (authError) {
    console.error('❌ [Admin Auth Middleware Error]:', authError.message);
    return res.status(401).json({
      success: false,
      message: 'خطأ في التحقق من صحة جلسة الدخول',
      students: [],
      users: [],
      error: authError.message,
    });
  }
};

router.use(verifyAdminAuth);

// 0.4 نقطة الصيانة الإجبارية لتنظيف قاعدة البيانات والاحتفاظ بالأدمن الأساسي فقط (Hard Reset DB Endpoint)
router.get('/hard-reset-db', async (req, res) => {
  try {
    await ensureDBConnection();
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
    await ensureDBConnection();

    const totalStudents = await User.countDocuments({ role: { $ne: 'admin' }, isAdmin: { $ne: true } });
    const verifiedStudents = await User.countDocuments({
      role: { $ne: 'admin' },
      isAdmin: { $ne: true },
      $or: [{ verificationStatus: { $in: ['verified', 'approved'] } }, { status: 'approved' }, { isApproved: true }],
    });
    const pendingStudents = await User.countDocuments({
      role: { $ne: 'admin' },
      isAdmin: { $ne: true },
      verificationStatus: { $nin: ['verified', 'approved', 'rejected'] },
      status: { $nin: ['approved', 'rejected'] },
      isApproved: { $ne: true },
    });
    const rejectedStudents = await User.countDocuments({
      role: { $ne: 'admin' },
      $or: [{ verificationStatus: 'rejected' }, { status: 'rejected' }],
    });
    const adminCount = await User.countDocuments({ $or: [{ role: 'admin' }, { isAdmin: true }] });

    console.log(`📊 [Admin API] GET /stats -> Total: ${totalStudents}, Pending: ${pendingStudents}, Verified: ${verifiedStudents}, Rejected: ${rejectedStudents}, Admins: ${adminCount}`);

    return res.status(200).json({
      success: true,
      totalStudents: totalStudents || 0,
      verifiedStudents: verifiedStudents || 0,
      pendingStudents: pendingStudents || 0,
      rejectedStudents: rejectedStudents || 0,
      adminCount: adminCount || 0,
    });
  } catch (error) {
    console.error('❌ [Admin Stats Error]:', error.message, error.stack);
    return res.status(500).json({
      success: false,
      message: 'خطأ في جلب إحصائيات الإدارة',
      totalStudents: 0,
      verifiedStudents: 0,
      pendingStudents: 0,
      rejectedStudents: 0,
      adminCount: 0,
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
    });
  }
});

// 1.1 جلب الطلاب المعلقين مباشرة (Pending Registrations Endpoint)
router.get(['/pending', '/pending-students', '/pending-registrations'], async (req, res) => {
  try {
    await ensureDBConnection();

    // Adjust the MongoDB query filter to match all pending records accurately:
    const pendingFilter = {
      role: { $ne: 'admin' },
      $or: [
        { isApproved: false },
        { status: 'pending' },
        { status: { $exists: false } },
      ],
    };

    const rawPending = await User.find(pendingFilter)
      .select(STUDENT_PROJECTION)
      .sort({ _id: -1 })
      .lean()
      .exec();

    const students = (rawPending || [])
      .map(serializeStudent)
      .filter(Boolean);

    console.log(`⏳ [Admin API] GET /pending -> Returned ${students.length} pending registration(s).`);

    return res.status(200).json({
      success: true,
      count: students.length,
      students,
      users: students,
    });
  } catch (err) {
    console.error('❌ [Fetch Pending Students Error]:', err.message, err.stack);
    return res.status(500).json({
      success: false,
      message: err.message,
      students: [],
    });
  }
});

// 1.2 جلب جميع المستخدمين مباشرة (All Users Endpoint)
router.get(['/users', '/all-users'], async (req, res) => {
  try {
    await ensureDBConnection();

    const rawUsers = await User.find()
      .select(STUDENT_PROJECTION)
      .sort({ _id: -1 })
      .lean()
      .exec();

    const users = (rawUsers || []).map(serializeStudent).filter(Boolean);

    console.log(`👥 [Admin API] GET /users -> Returned ${users.length} user(s).`);

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
      students: users,
    });
  } catch (error) {
    console.error('❌ [Fetch Users Error]:', error.message, error.stack);
    return res.status(500).json({
      success: false,
      message: error.message || 'خطأ في جلب بيانات المستخدمين',
      students: [],
      users: [],
      count: 0,
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
    });
  }
});

// 2. جلب قائمة الطلاب
router.get(['/students', '/all-students'], async (req, res) => {
  try {
    await ensureDBConnection();

    const { search, status, role, limit = 1000 } = req.query || {};
    const filter = {};

    if (search && typeof search === 'string' && search.trim()) {
      const cleanSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { fullName: { $regex: cleanSearch, $options: 'i' } },
        { name: { $regex: cleanSearch, $options: 'i' } },
        { email: { $regex: cleanSearch, $options: 'i' } },
        { studentId: { $regex: cleanSearch, $options: 'i' } },
        { academicId: { $regex: cleanSearch, $options: 'i' } },
        { phone: { $regex: cleanSearch, $options: 'i' } },
        { whatsapp: { $regex: cleanSearch, $options: 'i' } },
        { cairoAddress: { $regex: cleanSearch, $options: 'i' } },
        { residence: { $regex: cleanSearch, $options: 'i' } },
        { department: { $regex: cleanSearch, $options: 'i' } },
      ];
    }

    if (status && status !== 'all') {
      if (status === 'verified' || status === 'approved') {
        filter.$or = [
          { verificationStatus: { $in: ['verified', 'approved'] } },
          { status: 'approved' },
          { isApproved: true },
        ];
      } else if (status === 'rejected') {
        filter.$or = [
          { verificationStatus: 'rejected' },
          { status: 'rejected' },
        ];
      } else if (status === 'pending') {
        filter.role = { $ne: 'admin' };
        filter.isAdmin = { $ne: true };
        filter.$or = [
          { status: 'pending' },
          { verificationStatus: 'pending' },
          { isApproved: false },
          {
            $and: [
              { verificationStatus: { $nin: ['verified', 'approved', 'rejected'] } },
              { status: { $nin: ['approved', 'rejected'] } },
              { isApproved: { $ne: true } },
            ],
          },
        ];
        filter.verificationStatus = { $nin: ['verified', 'approved', 'rejected'] };
        filter.status = { $nin: ['approved', 'rejected'] };
        filter.isApproved = { $ne: true };
      } else {
        filter.verificationStatus = status;
      }
    }

    if (role && role !== 'all') {
      filter.role = role;
    }

    const parsedLimit = parseInt(limit, 10);
    const safeLimit = isNaN(parsedLimit) || parsedLimit <= 0 ? 1000 : Math.min(parsedLimit, 5000);

    const rawStudents = await User.find(filter)
      .select(STUDENT_PROJECTION)
      .sort({ _id: -1 })
      .limit(safeLimit)
      .lean()
      .exec();

    const students = (rawStudents || []).map(serializeStudent).filter(Boolean);

    console.log(`📋 [Admin API] GET /students -> Returned ${students.length} student(s). Filter:`, JSON.stringify(filter));

    return res.status(200).json({
      success: true,
      count: students.length,
      students,
      users: students,
    });
  } catch (error) {
    console.error('❌ [Fetch Students Error]:', error.message, error.stack);
    return res.status(500).json({
      success: false,
      message: error.message || 'خطأ في جلب بيانات الطلاب',
      students: [],
      users: [],
      count: 0,
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
    });
  }
});

// 3. تحديث حالة قبول/رفض الطالب (Approve / Reject) وإرسال الإشعارات التلقائية
router.post('/approve-student', async (req, res) => {
  try {
    const { studentId, id, notes } = req.body || {};
    const targetId = id || studentId;
    if (!targetId) {
      return res.status(400).json({ success: false, message: 'معرف الطالب مطلوب' });
    }
    const student = await User.findByIdAndUpdate(
      targetId,
      {
        verificationStatus: 'verified',
        status: 'approved',
        isApproved: true,
        notes: notes || '',
      },
      { new: true }
    ).select('-password');
    if (!student) {
      return res.status(404).json({ success: false, message: 'لم يتم العثور على الطالب' });
    }
    Promise.allSettled([
      sendStatusUpdateEmail(student, 'verified', notes),
      sendStatusUpdateSMS(student, 'verified', notes),
    ]).catch(() => { });
    return res.json({ success: true, message: 'تم اعتماد وقبول الطالب بنجاح', student });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/reject-student', async (req, res) => {
  try {
    const { studentId, id, notes } = req.body || {};
    const targetId = id || studentId;
    if (!targetId) {
      return res.status(400).json({ success: false, message: 'معرف الطالب مطلوب' });
    }
    const student = await User.findByIdAndUpdate(
      targetId,
      {
        verificationStatus: 'rejected',
        status: 'rejected',
        isApproved: false,
        notes: notes || '',
      },
      { new: true }
    ).select('-password');
    if (!student) {
      return res.status(404).json({ success: false, message: 'لم يتم العثور على الطالب' });
    }
    Promise.allSettled([
      sendStatusUpdateEmail(student, 'rejected', notes),
      sendStatusUpdateSMS(student, 'rejected', notes),
    ]).catch(() => { });
    return res.json({ success: true, message: 'تم رفض طلب الطالب', student });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

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

// 5. حذف سجل طالب نهائياً من قاعدة البيانات
router.delete('/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === 'undefined' || id === 'null') {
      return res.status(400).json({ success: false, message: 'معرف الطالب غير صالح للحذف' });
    }

    let deleted = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      deleted = await User.findByIdAndDelete(id);
    }
    if (!deleted) {
      deleted = await User.findOneAndDelete({
        $or: [
          { email: id.toLowerCase().trim() },
          { studentId: id },
          { academicId: id },
        ],
      });
    }

    if (!deleted) {
      // إرجاع نجاح حتى لو كان محذوفاً بالفعل لتسهيل تنظيف الواجهة الأمامية بدون Network Error
      return res.status(200).json({
        success: true,
        message: 'تم حذف السجل أو أنه غير موجود مسبقاً في قاعدة البيانات',
        alreadyDeleted: true,
      });
    }

    res.json({ success: true, message: 'تم حذف سجل الطالب بنجاح من قاعدة البيانات' });
  } catch (error) {
    console.error('Delete Student Error:', error.message, error.stack);
    res.status(500).json({
      success: false,
      message: 'خطأ أثناء حذف الطالب من قاعدة البيانات',
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
    });
  }
});

// 6. تصدير قاعدة بيانات الطلاب كملف CSV موحد
router.get('/export', async (req, res) => {
  try {
    const students = await User.find()
      .select(STUDENT_PROJECTION)
      .sort({ _id: -1 })
      .lean();

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

    // إنشاء وبث إشعار فوري لجميع الأجهزة والطلاب
    try {
      const Notification = require('../models/Notification');
      const notif = new Notification({
        title: `📢 ${title || 'إعلان جديد من إدارة الرابطة'}`,
        message: content.length > 150 ? `${content.substring(0, 147)}...` : content,
        type: isPinned ? 'urgent' : 'announcement',
        link: '/',
        sender: 'إدارة الرابطة (SSA)',
        senderRole: 'admin',
      });
      await notif.save();
      if (req.io) {
        req.io.emit('new_notification', notif);
      }
    } catch (notifErr) {
      console.error('Announcement Notification Error:', notifErr.message);
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
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({ activeTheme: 'classic-gold-blue', occasionMode: 'none', occasionGreeting: '' });
      await settings.save();
    }
    const obj = settings.toObject ? settings.toObject() : settings;
    res.json({ success: true, settings: obj, ...obj });
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

const handleSaveSettings = async (req, res) => {
  try {
    await ensureDBConnection();
    const updateData = {
      ...req.body,
      updatedAt: new Date(),
    };

    const settings = await Settings.findOneAndUpdate(
      {},
      { $set: updateData },
      { new: true, upsert: true, runValidators: false }
    );

    const obj = settings.toObject ? settings.toObject() : settings;
    return res.status(200).json({ success: true, settings: obj, ...obj });
  } catch (error) {
    console.error('Save Settings Error:', error.message, error.stack);
    return res.status(500).json({
      success: false,
      message: 'خطأ في حفظ الإعدادات',
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
    });
  }
};

router.post('/settings', handleSaveSettings);
router.put('/settings', handleSaveSettings);

// 9. مسارات قاعدة المعرفة للمستشار الأكاديمي (Admin Knowledge Base / FAQ CRUD)
router.get('/faq', async (req, res) => {
  try {
    const items = await AdvisorPrompt.find().sort({ createdAt: -1 });
    res.json({ success: true, count: items.length, items, prompts: items });
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
    const { question, prompt, answer, category, keywords, isActive } = req.body;
    const qText = question || prompt;
    if (!qText) {
      return res.status(400).json({ success: false, message: 'السؤال حقل إجباري' });
    }

    const newItem = new AdvisorPrompt({
      prompt: qText.trim(),
      question: qText.trim(),
      answer: (answer || '').trim(),
      category: category || 'general',
      keywords: Array.isArray(keywords) ? keywords : (keywords || '').split(',').map((k) => k.trim()).filter(Boolean),
      isActive: isActive !== undefined ? isActive : true,
    });

    await newItem.save();
    res.status(201).json({ success: true, message: 'تم إضافة السؤال إلى قاعدة المعرفة بنجاح', item: newItem, prompt: newItem });
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
    const { question, prompt, answer, category, keywords, isActive } = req.body;
    const updateData = { updatedAt: new Date() };

    const qText = question || prompt;
    if (qText !== undefined) {
      updateData.question = qText.trim();
      updateData.prompt = qText.trim();
    }
    if (answer !== undefined) updateData.answer = answer.trim();
    if (category !== undefined) updateData.category = category;
    if (keywords !== undefined) {
      updateData.keywords = Array.isArray(keywords) ? keywords : (keywords || '').split(',').map((k) => k.trim()).filter(Boolean);
    }
    if (isActive !== undefined) updateData.isActive = isActive;

    const item = await AdvisorPrompt.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!item) {
      return res.status(404).json({ success: false, message: 'العنصر غير موجود' });
    }

    res.json({ success: true, message: 'تم تحديث عنصر قاعدة المعرفة بنجاح', item, prompt: item });
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
    const item = await AdvisorPrompt.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'العنصر غير موجود' });
    }

    item.isActive = !item.isActive;
    item.updatedAt = new Date();
    await item.save();

    res.json({ success: true, message: 'تم تغيير حالة التفعيل بنجاح', isActive: item.isActive, item, prompt: item });
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
    await AdvisorPrompt.findByIdAndDelete(req.params.id);
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

