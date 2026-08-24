// معالج تسجيل الدخول المباشر لمنصة Vercel Serverless
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
      department: { type: String, default: 'الكيمياء (Chemistry)' },
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
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
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
      message: 'نقطة نهاية تسجيل الدخول نشطة وجاهزة.',
    });
  }

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

    const { email, password } = body;
    const cleanEmail = (email || '').toLowerCase().trim();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail || !cleanPassword) {
      return res.status(400).json({
        success: false,
        message: 'يرجى إدخال البريد الإلكتروني وكلمة المرور.',
      });
    }

    // 1. حسابات الإدارة المعتمدة للطوارئ
    if (
      (cleanEmail === 'mussab@gmail.com' && cleanPassword === '123456789') ||
      (cleanEmail === 'admin@ssa.com' && cleanPassword === 'admin123')
    ) {
      const targetName = cleanEmail === 'mussab@gmail.com' ? 'مصعب طارق (المدير العام)' : 'المكتب التنفيذي للرابطة';
      let adminInDb = await User.findOne({ email: cleanEmail });
      if (!adminInDb) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(cleanPassword, salt);
        adminInDb = await User.create({
          fullName: targetName,
          name: targetName,
          email: cleanEmail,
          password: hash,
          phone: '01000000000',
          whatsapp: '01000000000',
          cairoAddress: 'مقر الرابطة - كلية العلوم جامعة القاهرة',
          studentId: 'ADMIN-MUSSAB',
          academicId: 'ADMIN-MUSSAB',
          department: 'إدارة الرابطة',
          academicLevel: 'هيئة إدارية',
          status: 'approved',
          verificationStatus: 'verified',
          isApproved: true,
          isAdmin: true,
          role: 'admin',
        });
      }
      return res.status(200).json({
        success: true,
        message: 'تم تسجيل الدخول بنجاح كمدير للنظام',
        token: `ssa_token_admin_${Date.now()}`,
        user: {
          _id: adminInDb._id,
          fullName: targetName,
          name: targetName,
          email: cleanEmail,
          role: 'admin',
          status: 'approved',
          verificationStatus: 'verified',
          department: 'إدارة الرابطة',
        },
      });
    }

    // 2. التحقق من المستخدم في قاعدة البيانات
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

    // فحص حالة الرفض
    const isRejected = (user.verificationStatus === 'rejected' || user.status === 'rejected') && user.role !== 'admin';
    if (isRejected) {
      return res.status(403).json({
        success: false,
        isRejected: true,
        message: 'تم رفض طلب تسجيلك بواسطة إدارة الرابطة. يرجى التواصل مع الإدارة لإعادة تفعيل الحساب.',
      });
    }

    // فحص حالة الانتظار والمراجعة
    const isApproved = user.verificationStatus === 'verified' || user.verificationStatus === 'approved' || user.status === 'approved' || user.role === 'admin';
    if (!isApproved) {
      return res.status(403).json({
        success: false,
        isPending: true,
        message: 'حسابك قيد المراجعة من قبل إدارة الرابطة. سيتم تفعيل حسابك فور التحقق من البيانات.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      token: `ssa_token_${user._id}_${Date.now()}`,
      user: {
        _id: user._id,
        fullName: user.fullName || user.name,
        name: user.name || user.fullName,
        email: user.email,
        phone: user.phone,
        whatsapp: user.whatsapp,
        age: user.age,
        cairoAddress: user.cairoAddress,
        studentId: user.studentId,
        department: user.department,
        academicLevel: user.academicLevel,
        status: user.status,
        verificationStatus: user.verificationStatus,
        role: user.role || 'user',
      },
    });
  } catch (error) {
    console.error('API Login Error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'حدث خطأ في معالجة طلب تسجيل الدخول.',
    });
  }
};
