const bcrypt = require('bcryptjs');
const connectDB = require('../../server/db');
const User = require('../../server/models/User');

module.exports = async (req, res) => {
  // إعداد ترويسات CORS لبيئة Vercel Serverless
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // معالجة طلبات Preflight OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // فحص جاهزية المسار لطلبات GET
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      message: 'مسار تسجيل الدخول Serverless نشط وجاهز.',
      endpoint: '/api/auth/login',
    });
  }

  // السماح بطلبات POST فقط لتسجيل الدخول
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: `الطريقة ${req.method} غير مسموح بها على هذا المسار.`,
    });
  }

  try {
    await connectDB();

    const body = req.body || {};
    const { email, password } = body;

    const cleanEmail = (email || '').toLowerCase().trim();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail || !cleanPassword) {
      return res.status(400).json({
        success: false,
        message: 'يرجى إدخال البريد الإلكتروني وكلمة المرور.',
      });
    }

    // 1. حسابات الأدمن الأساسية (حساب المدير العام mussab@gmail.com وحساب الإدارة)
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
        } else {
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
          }
        }
      } catch (dbErr) {
        console.error('Admin DB check error:', dbErr.message);
      }

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

    // 2. فحص قاعدة البيانات للمستخدمين
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'بيانات الدخول غير صحيحة، يرجى التأكد من البريد الإلكتروني.',
      });
    }

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

    res.json({
      success: true,
      isPending,
      isApproved,
      message: isPending ? 'طلبك قيد المراجعة والتدقيق بواسطة إدارة الرابطة' : 'تم تسجيل الدخول بنجاح',
      token: `ssa_token_${user._id}_${Date.now()}`,
      user: {
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
      },
    });
  } catch (error) {
    console.error('Vercel Serverless Login Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم أثناء تسجيل الدخول.',
      error: error.message,
    });
  }
};
