import connectDB from '../../server/db.js';
import User from '../../server/models/User.js';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

  try {
    await connectDB();
    const { fullName, email, password, phone, cairoAddress, department, academicLevel, passportOrNationalId, idCardUrl } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ success: false, message: 'يرجى إدخال البيانات الأساسية المطلوبة.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'البريد الإلكتروني مسجل بالفعل.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      name: fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: phone || '01000000000',
      whatsapp: phone || '01000000000',
      cairoAddress: cairoAddress || 'القاهرة، مصر',
      residence: cairoAddress || 'القاهرة، مصر',
      department: department || 'العلوم العامة',
      academicLevel: academicLevel || 'المستوى الأول',
      academicYear: academicLevel || 'المستوى الأول',
      studentId: passportOrNationalId || `SSA-${Math.floor(100000 + Math.random() * 900000)}`,
      passportOrNationalId: passportOrNationalId || '',
      idCardUrl: idCardUrl || '',
      status: 'pending',
      isApproved: false,
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح وهو قيد المراجعة.',
      user: { id: newUser._id, email: newUser.email, fullName: newUser.fullName }
    });
  } catch (error) {
    console.error('Register API Error:', error);
    return res.status(500).json({ success: false, message: 'خطأ في الخادم: ' + error.message });
  }
}