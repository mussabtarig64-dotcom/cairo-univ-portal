const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { sendWelcomeEmail } = require('../utils/emailService');
const { sendRegistrationSMS } = require('../utils/smsService');

// مسار إنشاء حساب وتسجيل طالب جديد واستبيان القيد (Register)
router.post('/register', async (req, res) => {
  try {
    const {
      fullName,
      name,
      email,
      password,
      age,
      phone,
      whatsapp,
      cairoAddress,
      residence,
      studentId,
      universityId,
      academicId,
      department,
      academicLevel,
      academicYear,
      idDocument,
      idCardUrl,
      passportOrNationalId,
      emergencyContact,
      emergencyContactName,
      emergencyContactRelation,
      emergencyContactPhone,
    } = req.body;

    const studentName = (fullName || name || '').trim();
    const cleanEmail = (email || '').toLowerCase().trim();
    const sid = (studentId || academicId || universityId || `SSA-${Math.floor(100000 + Math.random() * 900000)}`).trim();

    if (!studentName || !cleanEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'يرجى إدخال الاسم والبريد الإلكتروني وكلمة المرور.',
      });
    }

    // فحص ما إذا كان المستخدم مسجلاً مسبقاً
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'البريد الإلكتروني مسجل بالفعل في قاعدة بيانات الرابطة.',
      });
    }

    // تشفير كلمة المرور
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName: studentName,
      name: studentName,
      email: cleanEmail,
      password: hashedPassword,
      age: age || '',
      phone: phone || '',
      whatsapp: whatsapp || phone || '',
      cairoAddress: cairoAddress || residence || 'القاهرة، مصر',
      residence: residence || cairoAddress || 'القاهرة، مصر',
      studentId: sid,
      academicId: sid,
      department: department || 'العلوم العامة',
      academicLevel: academicLevel || academicYear || 'المستوى الأول',
      academicYear: academicYear || academicLevel || 'المستوى الأول',
      idDocument: idDocument || idCardUrl || '',
      idCardUrl: idCardUrl || idDocument || '',
      passportOrNationalId: passportOrNationalId || '',
      emergencyContact: emergencyContact || emergencyContactName || '',
      emergencyContactName: emergencyContactName || emergencyContact || '',
      emergencyContactRelation: emergencyContactRelation || '',
      emergencyContactPhone: emergencyContactPhone || '',
      status: 'pending',
      verificationStatus: 'pending',
      role: 'user',
    });

    await newUser.save();

    // إرسال الإشعارات التلقائية (Email & SMS/WhatsApp) في الخلفية دون تعطيل الاستجابة
    Promise.allSettled([
      sendWelcomeEmail(newUser),
      sendRegistrationSMS(newUser),
    ]).then((results) => {
      console.log(`📨 [Auto-Notification] تم إطلاق إشعارات الترحيب للطالب: ${newUser.fullName}`);
    }).catch((err) => {
      console.error('Notification dispatch note:', err.message);
    });

    const userSafeData = {
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      phone: newUser.phone,
      whatsapp: newUser.whatsapp,
      age: newUser.age,
      cairoAddress: newUser.cairoAddress,
      residence: newUser.residence,
      studentId: newUser.studentId,
      academicId: newUser.academicId,
      department: newUser.department,
      academicLevel: newUser.academicLevel,
      idDocument: newUser.idDocument,
      idCardUrl: newUser.idCardUrl,
      status: 'pending',
      verificationStatus: 'pending',
      role: 'user',
      createdAt: newUser.createdAt,
    };

    res.status(201).json({
      success: true,
      message: 'تم استلام طلب التسجيل بنجاح! حسابك قيد المراجعة والاعتماد من قبل إدارة الرابطة.',
      user: userSafeData,
    });
  } catch (error) {
    console.error('❌ خطأ أثناء تسجيل الطالب:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في الخادم أثناء إرسال استمارة التسجيل.',
      error: error.message,
    });
  }
});

// مسار تسجيل الدخول (Login)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const cleanEmail = (email || '').toLowerCase().trim();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail || !cleanPassword) {
      return res.status(400).json({
        success: false,
        message: 'يرجى إدخال البريد الإلكتروني وكلمة المرور.',
      });
    }

    // 1. حسابات الأدمن الأساسية (Primary Admin Credentials Fallback & DB Sync)
    if (
      (cleanEmail === 'mussab@gmail.com' && cleanPassword === '123456789') ||
      (cleanEmail === 'admin@ssa.com' && cleanPassword === 'admin123')
    ) {
      const targetEmail = cleanEmail;
      const targetName = cleanEmail === 'mussab@gmail.com' ? 'مصعب طارق (المدير العام)' : 'المكتب التنفيذي للرابطة (المدير العام)';
      let adminInDb = null;
      try {
        adminInDb = await User.findOne({ email: targetEmail });
        if (!adminInDb) {
          const salt = await bcrypt.genSalt(10);
          const hash = await bcrypt.hash(cleanPassword, salt);
          adminInDb = new User({
            fullName: targetName,
            name: targetName,
            email: targetEmail,
            password: hash,
            phone: '01000000000',
            cairoAddress: 'مقر الرابطة - كلية العلوم جامعة القاهرة',
            studentId: targetEmail === 'mussab@gmail.com' ? 'ADMIN-MUSSAB' : 'SSA-ADMIN-001',
            department: 'إدارة الرابطة',
            academicLevel: 'هيئة إدارية',
            verificationStatus: 'verified',
            status: 'approved',
            role: 'admin',
          });
          await adminInDb.save();
        } else {
          // التأكد من أن الرتبة admin والحالة verified
          if (adminInDb.role !== 'admin' || adminInDb.verificationStatus !== 'verified') {
            adminInDb.role = 'admin';
            adminInDb.status = 'approved';
            adminInDb.verificationStatus = 'verified';
            await adminInDb.save();
          }
        }
      } catch (dbErr) {
        console.log('MongoDB Admin sync note:', dbErr.message);
      }

      return res.json({
        success: true,
        token: `ssa_token_admin_${Date.now()}`,
        user: {
          _id: adminInDb ? adminInDb._id : 'admin_default_id',
          fullName: targetName,
          email: targetEmail,
          role: 'admin',
          verificationStatus: 'verified',
          status: 'approved',
          department: 'إدارة الرابطة',
        },
      });
    }

    // 2. التحقق من قاعدة بيانات MongoDB
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'بيانات الدخول غير صحيحة، يرجى التأكد من البريد الإلكتروني.',
      });
    }

    // فحص كلمة المرور
    let isMatch = false;
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
      isMatch = await bcrypt.compare(cleanPassword, user.password);
    } else {
      isMatch = user.password === cleanPassword;
    }

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى.',
      });
    }

    // فحص ما إذا كان الحساب مرفوضاً من قبل الإدارة
    const isRejected = user.verificationStatus === 'rejected' || user.status === 'rejected';
    if (isRejected && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        isRejected: true,
        message: 'تم رفض طلب تسجيلك بواسطة إدارة الرابطة. يرجى التواصل مع الإدارة لإعادة تفعيل الحساب.',
      });
    }

    const isApproved = user.verificationStatus === 'verified' || user.verificationStatus === 'approved' || user.status === 'approved';
    const finalVerificationStatus = isApproved ? 'verified' : (user.verificationStatus || 'pending');
    const finalStatus = isApproved ? 'approved' : (user.status || 'pending');

    const userPayload = {
      _id: user._id,
      fullName: user.fullName || user.name,
      email: user.email,
      phone: user.phone,
      whatsapp: user.whatsapp,
      age: user.age,
      cairoAddress: user.cairoAddress,
      studentId: user.studentId,
      department: user.department,
      academicLevel: user.academicLevel,
      idDocument: user.idDocument,
      emergencyContactName: user.emergencyContactName,
      emergencyContactPhone: user.emergencyContactPhone,
      verificationStatus: finalVerificationStatus,
      status: finalStatus,
      role: user.role || 'user',
    };

    res.json({
      success: true,
      token: `ssa_token_${user._id}_${Date.now()}`,
      user: userPayload,
    });
  } catch (error) {
    console.error('❌ خطأ في تسجيل الدخول:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم أثناء تسجيل الدخول.',
      error: error.message,
    });
  }
});

// مسار الاستعلام المباشر عن حالة اعتماد الطالب (Live Status Check)
router.get('/status/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const cleanEmail = (email || '').toLowerCase().trim();

    if (!cleanEmail) {
      return res.status(400).json({ success: false, message: 'البريد الإلكتروني مطلوب.' });
    }

    const user = await User.findOne({ email: cleanEmail }).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'المستخدم غير مسجل في قاعدة البيانات.' });
    }

    const isRejected = user.verificationStatus === 'rejected' || user.status === 'rejected';
    const isApproved = !isRejected && (user.verificationStatus === 'verified' || user.verificationStatus === 'approved' || user.status === 'approved');

    res.json({
      success: true,
      isRejected,
      verificationStatus: isRejected ? 'rejected' : (isApproved ? 'verified' : (user.verificationStatus || 'pending')),
      status: isRejected ? 'rejected' : (isApproved ? 'approved' : (user.status || 'pending')),
      role: user.role || 'user',
      user: {
        _id: user._id,
        fullName: user.fullName || user.name,
        email: user.email,
        studentId: user.studentId,
        department: user.department,
        verificationStatus: isRejected ? 'rejected' : (isApproved ? 'verified' : (user.verificationStatus || 'pending')),
        status: isRejected ? 'rejected' : (isApproved ? 'approved' : (user.status || 'pending')),
        role: user.role || 'user',
      },
    });
  } catch (error) {
    console.error('Live Status Check Error:', error);
    res.status(500).json({ success: false, message: 'خطأ أثناء التحقق من حالة المستخدم.' });
  }
});

// مسار الاستعلام العام الشامل برقم القيد أو الرقم الأكاديمي أو البريد أو الهاتف (Status Tracker Inquiry)
router.get('/status-check/:query', async (req, res) => {
  try {
    const rawQuery = (req.params.query || '').trim();
    if (!rawQuery) {
      return res.status(400).json({ success: false, message: 'يرجى إدخال رقم القيد أو البريد الإلكتروني للاستعلام.' });
    }

    const cleanQuery = rawQuery.toLowerCase();
    const queryRegex = new RegExp(`^${rawQuery}$`, 'i');

    const searchConditions = [
      { studentId: queryRegex },
      { academicId: queryRegex },
      { email: cleanQuery },
      { phone: rawQuery },
      { passportOrNationalId: rawQuery },
    ];

    if (rawQuery.match(/^[0-9a-fA-F]{24}$/)) {
      searchConditions.push({ _id: rawQuery });
    }

    const user = await User.findOne({ $or: searchConditions }).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        found: false,
        message: 'لم يتم العثور على طالب بهذ الرقم الأكاديمي أو البيانات المدخلة في السجل المركزي.',
      });
    }

    const isRejected = user.verificationStatus === 'rejected' || user.status === 'rejected';
    const isApproved =
      !isRejected &&
      (user.verificationStatus === 'verified' || user.verificationStatus === 'approved' || user.status === 'approved');

    const statusKey = isRejected ? 'rejected' : isApproved ? 'approved' : 'pending';
    const statusLabel = isRejected
      ? 'مرفوض ❌'
      : isApproved
      ? 'عضو معتمد ✅'
      : 'قيد المراجعة والاعتماد ⏳';

    res.json({
      success: true,
      found: true,
      statusKey,
      statusLabel,
      isApproved,
      isRejected,
      isPending: !isApproved && !isRejected,
      student: {
        _id: user._id,
        fullName: user.fullName || user.name,
        email: user.email,
        studentId: user.studentId || user.academicId || 'SSA-STUDENT',
        department: user.department || 'كلية العلوم',
        academicYear: user.academicYear || user.academicLevel || 'المستوى الأول',
        statusKey,
        statusLabel,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Status Check API Error:', error);
    res.status(500).json({ success: false, message: 'حدث خطأ في النظام أثناء الاستعلام عن حالة الحساب.' });
  }
});

module.exports = router;