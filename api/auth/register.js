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
      message: 'مسار التسجيل Serverless نشط وجاهز لاستقبال طلبات POST.',
      endpoint: '/api/auth/register',
    });
  }

  // السماح بطلبات POST فقط للتسجيل
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: `الطريقة ${req.method} غير مسموح بها على هذا المسار.`,
    });
  }

  try {
    // الاتصال الآمن بقاعدة البيانات
    await connectDB();

    const body = req.body || {};
    const {
      name,
      fullName,
      email,
      password,
      age,
      phone,
      whatsapp,
      residence,
      cairoAddress,
      department,
      academicLevel,
      academicYear,
      studentId,
      academicId,
      nationalId,
      passportOrNationalId,
      emergencyContact,
      emergencyContactName,
      emergencyContactRelation,
      emergencyContactPhone,
      idCardUrl,
      idDocument,
      nationalIdPhoto,
    } = body;

    const cleanName = (fullName || name || '').trim();
    const cleanEmail = (email || '').toLowerCase().trim();
    const cleanPassword = (password || '').trim();
    const cleanPhone = (phone || '').trim();
    const cleanWhatsapp = (whatsapp || phone || '').trim();
    const cleanDepartment = (department || 'الكيمياء (Chemistry)').trim();
    const cleanAcademicLevel = (academicLevel || academicYear || 'المستوى الأول (إعدادي علوم)').trim();
    const cleanAddress = (cairoAddress || residence || 'القاهرة، مصر').trim();
    const cleanEmergencyName = (emergencyContactName || emergencyContact || '').trim();
    const cleanEmergencyRelation = (emergencyContactRelation || 'الوالد / الوالدة').trim();
    const cleanEmergencyPhone = (emergencyContactPhone || '').trim();
    const cleanNationalId = (passportOrNationalId || nationalId || studentId || '').trim();
    const cleanIdDoc = (idCardUrl || idDocument || nationalIdPhoto || '').trim();

    if (!cleanName || !cleanEmail || !cleanPassword) {
      return res.status(400).json({
        success: false,
        message: 'يرجى إدخال الاسم الرباعي والبريد الإلكتروني وكلمة المرور.',
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: 'صيغة البريد الإلكتروني غير صحيحة.',
      });
    }

    if (cleanPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'كلمة المرور يجب ألا تقل عن 6 أحرف.',
      });
    }

    // التحقق من وجود المستخدم مسبقاً في قاعدة البيانات
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'البريد الإلكتروني مسجل بالفعل.',
      });
    }

    // تشفير كلمة المرور
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(cleanPassword, salt);

    // إنشاء وحفظ الطالب الجديد
    const newUser = new User({
      name: cleanName,
      fullName: cleanName,
      email: cleanEmail,
      password: hashedPassword,
      age: age ? age.toString().trim() : '20',
      phone: cleanPhone || '01000000000',
      whatsapp: cleanWhatsapp || '01000000000',
      residence: cleanAddress,
      cairoAddress: cleanAddress,
      department: cleanDepartment,
      academicLevel: cleanAcademicLevel,
      academicYear: cleanAcademicLevel,
      studentId: cleanNationalId || `SSA-${Math.floor(100000 + Math.random() * 900000)}`,
      academicId: cleanNationalId || `SSA-${Math.floor(100000 + Math.random() * 900000)}`,
      passportOrNationalId: cleanNationalId,
      emergencyContact: cleanEmergencyName,
      emergencyContactName: cleanEmergencyName,
      emergencyContactRelation: cleanEmergencyRelation,
      emergencyContactPhone: cleanEmergencyPhone,
      idCardUrl: cleanIdDoc,
      idDocument: cleanIdDoc,
      role: 'user',
      status: 'pending',
      verificationStatus: 'pending',
      isApproved: false,
      isAdmin: false,
    });

    const savedUser = await newUser.save();

    return res.status(201).json({
      success: true,
      message: 'تم إرسال استمارة التسجيل واعتماد العضوية بنجاح!',
      user: {
        _id: savedUser._id,
        name: savedUser.name,
        fullName: savedUser.fullName,
        email: savedUser.email,
        role: savedUser.role,
        status: savedUser.status,
        verificationStatus: savedUser.verificationStatus,
        department: savedUser.department,
        academicLevel: savedUser.academicLevel,
        createdAt: savedUser.createdAt,
      },
    });
  } catch (error) {
    console.error('Vercel Serverless Registration Error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.',
    });
  }
};
