const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const multer = require('multer');
const User = require('../models/User');
const { sendWelcomeEmail } = require('../utils/emailService');
const { sendRegistrationSMS } = require('../utils/smsService');

const JWT_SECRET = process.env.JWT_SECRET || 'ssa_default_fallback_jwt_secret_key_2026';

// إعداد Multer في الذاكرة لبيئات Serverless و Vercel لمنع أي كتابة على القرص وتجنب تجاوز حد الـ 4.5MB
const memoryUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4.5 * 1024 * 1024 },
});

const handleMemoryUpload = (req, res, next) => {
  memoryUpload.any()(req, res, (err) => {
    if (err) {
      console.error('Memory upload error:', err.message, err.stack);
      return res.status(400).json({
        success: false,
        message: err.code === 'LIMIT_FILE_SIZE' 
          ? 'حجم الملف كبير جداً. الحد الأقصى المسموح به هو 4.5 ميجابايت لتفادي مشاكل الخادم.'
          : `خطأ في رفع الملف: ${err.message}`,
        error: err.message
      });
    }
    next();
  });
};

// مسار التهيئة السريعة لحساب الأدمن للطوارئ (Emergency Setup Admin Endpoint)
router.get('/setup-admin', async (req, res) => {
  try {
    const email = 'mussab@gmail.com';
    const plainPassword = '123456789';
    const name = 'مصعب طارق (المدير العام)';
    const role = 'admin';

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    let user = await User.findOne({
      email: { $regex: new RegExp(`^${email}$`, 'i') },
    });

    if (user) {
      user.fullName = name;
      user.name = name;
      user.password = hashedPassword;
      user.role = role;
      user.status = 'approved';
      user.verificationStatus = 'verified';
      user.phone = user.phone || '01000000000';
      user.studentId = user.studentId || 'ADMIN-MUSSAB';
      user.department = user.department || 'إدارة الرابطة';
      user.academicLevel = user.academicLevel || 'هيئة إدارية';
      await user.save();
    } else {
      user = await User.create({
        fullName: name,
        name: name,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: role,
        phone: '01000000000',
        whatsapp: '01000000000',
        cairoAddress: 'مقر الرابطة - كلية العلوم جامعة القاهرة',
        residence: 'مقر الرابطة - كلية العلوم جامعة القاهرة',
        studentId: 'ADMIN-MUSSAB',
        academicId: 'ADMIN-MUSSAB',
        department: 'إدارة الرابطة',
        academicLevel: 'هيئة إدارية',
        academicYear: 'هيئة إدارية',
        status: 'approved',
        verificationStatus: 'verified',
      });
    }

    res.json({
      success: true,
      message: 'Admin account initialized successfully',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        status: user.status,
        verificationStatus: user.verificationStatus,
      },
    });
  } catch (error) {
    console.error('Setup Admin error:', error.message, error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to initialize admin account',
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
    });
  }
});

// مسار إنشاء حساب وتسجيل طالب جديد واستبيان القيد (Register & Survey)
router.post(['/register', '/survey'], handleMemoryUpload, async (req, res) => {
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
      idCardImage,
      passportOrNationalId,
      emergencyContact,
      emergencyContactName,
      emergencyContactRelation,
      emergencyContactPhone,
    } = req.body || {};

    const studentName = (fullName || name || 'طالب كلية العلوم').trim();
    const cleanEmail = (email || '').toLowerCase().trim();

    if (!cleanEmail) {
      return res.status(400).json({
        success: false,
        message: 'يرجى إدخال البريد الإلكتروني الخاص بك للمتابعة.',
      });
    }

    const sid = (studentId || academicId || universityId || `SSA-${Math.floor(100000 + Math.random() * 900000)}`).trim();

    // في حال عدم توفير كلمة مرور، إنشاء كلمة مرور مؤقتة وتشفيرها
    const rawPassword = (password || 'SSA@Student2026').trim();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(rawPassword, salt);

    // معالجة ملف إثبات الهوية في الذاكرة دون كتابة على القرص
    let uploadedDoc = '';
    if (req.files && req.files.length > 0) {
      const f = req.files[0];
      uploadedDoc = `data:${f.mimetype};base64,${f.buffer.toString('base64')}`;
    } else if (req.file) {
      uploadedDoc = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }

    // تجهيز الحقول بقيم افتراضية آمنة تمنع أي خطأ في التحقق (Validation)
    const safeAge = age ? String(age).trim() : '';
    const safePhone = (phone || whatsapp || '01000000000').trim();
    const safeWhatsapp = (whatsapp || phone || safePhone || '').trim();
    const safeAddress = (cairoAddress || residence || 'القاهرة، مصر').trim();
    const safeResidence = (residence || cairoAddress || safeAddress || 'القاهرة، مصر').trim();
    const safeDepartment = (department || 'العلوم العامة').trim();
    const safeLevel = (academicLevel || academicYear || 'المستوى الأول').trim();
    const safeIdDoc = uploadedDoc || idDocument || idCardUrl || idCardImage || passportOrNationalId || '';
    const safePassportOrNationalId = (passportOrNationalId || '').trim();
    const safeEmergencyName = (emergencyContactName || emergencyContact || '').trim();
    const safeEmergencyRelation = (emergencyContactRelation || '').trim();
    const safeEmergencyPhone = (emergencyContactPhone || '').trim();

    // فحص ما إذا كان المستخدم مسجلاً مسبقاً
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      if (existingUser.role === 'admin') {
        return res.status(400).json({
          success: false,
          message: 'البريد الإلكتروني مسجل بالفعل كحساب إدارة في قاعدة بيانات الرابطة.',
        });
      }

      // تحديث بيانات الاستمارة وإعادة وضع الحساب في حالة قيد المراجعة (Pending)
      existingUser.fullName = studentName;
      existingUser.name = studentName;
      if (password) {
        existingUser.password = hashedPassword;
      }
      existingUser.age = safeAge || existingUser.age || '';
      existingUser.phone = safePhone || existingUser.phone || '01000000000';
      existingUser.whatsapp = safeWhatsapp || existingUser.whatsapp || '';
      existingUser.cairoAddress = safeAddress || existingUser.cairoAddress || 'القاهرة، مصر';
      existingUser.residence = safeResidence || existingUser.residence || 'القاهرة، مصر';
      existingUser.studentId = sid || existingUser.studentId;
      existingUser.academicId = sid || existingUser.academicId;
      existingUser.department = safeDepartment || existingUser.department || 'العلوم العامة';
      existingUser.academicLevel = safeLevel || existingUser.academicLevel || 'المستوى الأول';
      existingUser.academicYear = safeLevel || existingUser.academicYear || 'المستوى الأول';
      existingUser.idDocument = safeIdDoc || existingUser.idDocument || '';
      existingUser.idCardUrl = safeIdDoc || existingUser.idCardUrl || '';
      existingUser.passportOrNationalId = safePassportOrNationalId || existingUser.passportOrNationalId || '';
      existingUser.emergencyContact = safeEmergencyName || existingUser.emergencyContact || '';
      existingUser.emergencyContactName = safeEmergencyName || existingUser.emergencyContactName || '';
      existingUser.emergencyContactRelation = safeEmergencyRelation || existingUser.emergencyContactRelation || '';
      existingUser.emergencyContactPhone = safeEmergencyPhone || existingUser.emergencyContactPhone || '';
      existingUser.status = 'pending';
      existingUser.verificationStatus = 'pending';
      existingUser.isApproved = false;
      existingUser.isAdmin = false;
      existingUser.role = 'user';

      const savedUser = await existingUser.save();
      console.log("New student registration created:", savedUser);

      // إرسال الإشعارات بدون انتظار الاستجابة
      try {
        Promise.allSettled([
          sendWelcomeEmail(savedUser),
          sendRegistrationSMS(savedUser),
        ]).catch(() => { });
      } catch (notifyErr) { }

      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
      return res.status(200).json({
        success: true,
        message: 'تم استلام وتحديث استمارة طلب التسجيل بنجاح! حسابك قيد المراجعة والتدقيق بواسطة إدارة الرابطة.',
        user: savedUser,
      });
    }

    const newUser = new User({
      fullName: studentName,
      name: studentName,
      email: cleanEmail,
      password: hashedPassword,
      age: safeAge,
      phone: safePhone,
      whatsapp: safeWhatsapp,
      cairoAddress: safeAddress,
      residence: safeResidence,
      studentId: sid,
      academicId: sid,
      department: safeDepartment,
      academicLevel: safeLevel,
      academicYear: safeLevel,
      idDocument: safeIdDoc,
      idCardUrl: safeIdDoc,
      passportOrNationalId: safePassportOrNationalId,
      emergencyContact: safeEmergencyName,
      emergencyContactName: safeEmergencyName,
      emergencyContactRelation: safeEmergencyRelation,
      emergencyContactPhone: safeEmergencyPhone,
      status: 'pending',
      verificationStatus: 'pending',
      isApproved: false,
      isAdmin: false,
      role: 'user',
    });

    const savedUser = await newUser.save();
    console.log("New student registration created:", savedUser);

    // إرسال الإشعارات التلقائية (Email & SMS/WhatsApp) في الخلفية دون تعطيل الاستجابة
    try {
      Promise.allSettled([
        sendWelcomeEmail(savedUser),
        sendRegistrationSMS(savedUser),
      ]).catch(() => { });
    } catch (notifyErr) { }

    const userSafeData = {
      _id: savedUser._id,
      fullName: savedUser.fullName,
      name: savedUser.name,
      email: savedUser.email,
      phone: savedUser.phone,
      whatsapp: savedUser.whatsapp,
      age: savedUser.age,
      cairoAddress: savedUser.cairoAddress,
      residence: savedUser.residence,
      studentId: savedUser.studentId,
      academicId: savedUser.academicId,
      department: savedUser.department,
      academicLevel: savedUser.academicLevel,
      academicYear: savedUser.academicYear,
      idDocument: savedUser.idDocument,
      idCardUrl: savedUser.idCardUrl,
      status: 'pending',
      verificationStatus: 'pending',
      isApproved: false,
      isAdmin: false,
      role: 'user',
      createdAt: savedUser.createdAt,
    };

    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
    return res.status(201).json({
      success: true,
      message: 'تم استلام طلب التسجيل بنجاح! حسابك قيد المراجعة والاعتماد من قبل إدارة الرابطة.',
      user: userSafeData,
    });
  } catch (error) {
    console.error("Registration Server Error:", error.message, error.stack);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
    return res.status(400).json({
      success: false,
      message: error.message || 'حدث خطأ أثناء معالجة طلب التسجيل في الخادم.',
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
    });
  }
});

// مسار تسجيل الدخول (Login)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', req.body?.email);

    const cleanEmail = (email || '').toLowerCase().trim();
    const cleanPassword = (password || '').trim();

    console.log('Normalized email for login:', cleanEmail);

    if (!cleanEmail || !cleanPassword) {
      console.log('Login rejected: missing email or password');
      return res.status(400).json({
        success: false,
        message: 'يرجى إدخال البريد الإلكتروني وكلمة المرور.',
      });
    }

    // 1. حسابات الأدمن الأساسية وتوفير الحساب التلقائي (Emergency Auto-Seed / Admin Pass)
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
          console.log(`Auto-seeding emergency admin user for [${targetEmail}] into MongoDB...`);
          const salt = await bcrypt.genSalt(10);
          const hash = await bcrypt.hash(cleanPassword, salt);
          adminInDb = new User({
            fullName: targetName,
            name: targetName,
            email: targetEmail,
            password: hash,
            phone: '01000000000',
            whatsapp: '01000000000',
            cairoAddress: 'مقر الرابطة - كلية العلوم جامعة القاهرة',
            residence: 'مقر الرابطة - كلية العلوم جامعة القاهرة',
            studentId: targetEmail === 'mussab@gmail.com' ? 'ADMIN-MUSSAB' : 'SSA-ADMIN-001',
            academicId: targetEmail === 'mussab@gmail.com' ? 'ADMIN-MUSSAB' : 'SSA-ADMIN-001',
            department: 'إدارة الرابطة',
            academicLevel: 'هيئة إدارية',
            academicYear: 'هيئة إدارية',
            verificationStatus: 'verified',
            status: 'approved',
            role: 'admin',
          });
          await adminInDb.save();
          console.log(`✅ Successfully auto-seeded admin [${targetEmail}] into MongoDB.`);
        } else {
          // التأكد من الرتبة والحالة
          let needSave = false;
          if (adminInDb.role !== 'admin' || adminInDb.verificationStatus !== 'verified' || adminInDb.status !== 'approved') {
            adminInDb.role = 'admin';
            adminInDb.status = 'approved';
            adminInDb.verificationStatus = 'verified';
            needSave = true;
          }
          const isPassValid = await bcrypt.compare(cleanPassword, adminInDb.password).catch(() => false);
          if (!isPassValid && adminInDb.password !== cleanPassword) {
            const salt = await bcrypt.genSalt(10);
            adminInDb.password = await bcrypt.hash(cleanPassword, salt);
            needSave = true;
          }
          if (needSave) {
            await adminInDb.save();
            console.log(`✅ Updated existing admin [${targetEmail}] in MongoDB.`);
          }
        }
      } catch (dbErr) {
        console.error('MongoDB Admin auto-seed / sync error:', dbErr.message);
      }

      console.log(`✅ Admin login successful for [${targetEmail}]`);
      return res.json({
        success: true,
        token: `ssa_token_admin_${Date.now()}`,
        user: {
          _id: adminInDb ? adminInDb._id : 'admin_default_id',
          fullName: targetName,
          name: targetName,
          email: targetEmail,
          role: 'admin',
          verificationStatus: 'verified',
          status: 'approved',
          department: 'إدارة الرابطة',
        },
      });
    }

    // 2. التحقق من قاعدة بيانات MongoDB لجميع المستخدمين
    const user = await User.findOne({ email: cleanEmail });
    console.log('MongoDB user query result:', user ? { id: user._id, email: user.email, role: user.role } : 'Not Found');

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

    console.log(`Password match result for [${cleanEmail}]:`, isMatch);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى.',
      });
    }

    // فحص ما إذا كان الحساب مرفوضاً من قبل الإدارة
    const isRejected = (user.verificationStatus === 'rejected' || user.status === 'rejected') && user.role !== 'admin';
    if (isRejected) {
      return res.status(403).json({
        success: false,
        isRejected: true,
        message: 'تم رفض طلب تسجيلك بواسطة إدارة الرابطة. يرجى التواصل مع الإدارة لإعادة تفعيل الحساب.',
      });
    }

    const isApproved = user.verificationStatus === 'verified' || user.verificationStatus === 'approved' || user.status === 'approved';
    const isPending = !isApproved && !isRejected;
    const finalVerificationStatus = isApproved ? 'verified' : isRejected ? 'rejected' : 'pending';
    const finalStatus = isApproved ? 'approved' : isRejected ? 'rejected' : 'pending';

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
      idCardUrl: user.idCardUrl,
      emergencyContactName: user.emergencyContactName,
      emergencyContactPhone: user.emergencyContactPhone,
      verificationStatus: finalVerificationStatus,
      status: finalStatus,
      role: user.role || 'user',
    };

    console.log(`✅ Login response for [${cleanEmail}], role: ${userPayload.role}, isPending: ${isPending}`);
    res.json({
      success: true,
      isPending,
      isApproved,
      message: isPending ? 'طلبك قيد المراجعة والتدقيق بواسطة إدارة الرابطة' : 'تم تسجيل الدخول بنجاح',
      token: `ssa_token_${user._id}_${Date.now()}`,
      user: userPayload,
    });
  } catch (error) {
    console.error('❌ خطأ في تسجيل الدخول:', error.message, error.stack);
    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم أثناء تسجيل الدخول.',
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
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
    console.error('Live Status Check Error:', error.message, error.stack);
    res.status(500).json({
      success: false,
      message: 'خطأ أثناء التحقق من حالة المستخدم.',
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
    });
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
    console.error('Status Check API Error:', error.message, error.stack);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في النظام أثناء الاستعلام عن حالة الحساب.',
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
    });
  }
});

module.exports = router;