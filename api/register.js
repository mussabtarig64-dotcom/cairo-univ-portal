// معالج تسجيل الحسابات والطلاب المباشر لمنصة Vercel Serverless
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  'mongodb+srv://mussabtarig64_db_user:Sezar123456@cluster0.xier0a3.mongodb.net/cairo_univ_db';

let cachedConn = null;

async function connectToDatabase() {
  if (cachedConn && mongoose.connection.readyState === 1) {
    return cachedConn;
  }
  cachedConn = await mongoose.connect(MONGO_URI, {
    bufferCommands: false,
    serverSelectionTimeoutMS: 5000,
  });
  return cachedConn;
}

// تحميل أو إنشاء نموذج المستخدم User
let User;
try {
  User = mongoose.model('User');
} catch (e) {
  const userSchema = new mongoose.Schema(
    {
      fullName: { type: String, default: 'طالب كلية العلوم', trim: true },
      name: { type: String, default: 'طالب كلية العلوم', trim: true },
      email: { type: String, required: true, lowercase: true, trim: true },
      password: { type: String, required: true },
      age: { type: String, default: '20' },
      phone: { type: String, default: '01000000000' },
      whatsapp: { type: String, default: '01000000000' },
      residence: { type: String, default: 'القاهرة، مصر' },
      cairoAddress: { type: String, default: 'القاهرة، مصر' },
      studentId: { type: String, default: () => `SSA-${Math.floor(100000 + Math.random() * 900000)}` },
      academicId: { type: String, default: () => `SSA-${Math.floor(100000 + Math.random() * 900000)}` },
      department: { type: String, default: 'الكيمياء منفرد' },
      academicLevel: { type: String, default: 'المستوى الأول (إعدادي علوم)' },
      academicYear: { type: String, default: 'المستوى الأول (إعدادي علوم)' },
      idDocument: { type: String, default: '' },
      idCardUrl: { type: String, default: '' },
      passportOrNationalId: { type: String, default: '' },
      emergencyContact: { type: String, default: '' },
      emergencyContactName: { type: String, default: '' },
      emergencyContactRelation: { type: String, default: 'الوالد / الوالدة' },
      emergencyContactPhone: { type: String, default: '' },
      status: { type: String, default: 'pending' },
      verificationStatus: { type: String, default: 'pending' },
      isApproved: { type: Boolean, default: false },
      isAdmin: { type: Boolean, default: false },
      role: { type: String, default: 'user' },
      createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
  );
  User = mongoose.model('User', userSchema);
}

module.exports = async function handler(req, res) {
  // تفعيل CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      message: 'نقطة نهاية تسجيل الطلاب والمنتسبين نشطة وجاهزة لاستقبال طلبات POST.',
      endpoint: '/api/auth/register',
    });
  }

  // التحقق الصريح من نوع الطلب POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: `Method ${req.method} Not Allowed`,
    });
  }

  try {
    await connectToDatabase();

    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }
    } else if (!body) {
      body = {};
    }
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
    const cleanDepartment = (department || 'الكيمياء منفرد').trim();
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

    if (cleanPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'كلمة المرور يجب أن لا تقل عن 6 أحرف.',
      });
    }

    // التحقق من وجود المستخدم
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'البريد الإلكتروني مسجل بالفعل مسبقاً.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(cleanPassword, salt);

    const newUser = await User.create({
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

    return res.status(201).json({
      success: true,
      message: 'تم إرسال استمارة التسجيل واعتماد العضوية بنجاح!',
      user: {
        _id: newUser._id,
        name: newUser.name,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
        verificationStatus: newUser.verificationStatus,
        department: newUser.department,
        academicLevel: newUser.academicLevel,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error('API Register Error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'حدث خطأ في معالجة طلب التسجيل.',
    });
  }
};
