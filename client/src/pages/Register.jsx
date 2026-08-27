import connectDB from '../../server/db.js';
import User from '../../server/models/User.js';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  // السماح بطلبات POST فقط ومنع أي طريقة أخرى بإرجاع 405 رسمياً
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

  try {
    await connectDB();

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
      emergencyContact,
      emergencyContactName,
      emergencyContactRelation,
      emergencyContactPhone,
      department,
      academicLevel,
      academicYear,
      studentId,
      academicId,
      passportOrNationalId,
      nationalId,
      idCardUrl,
      idDocument,
    } = req.body;

    const userEmail = email || req.body.username;
    if (!userEmail || !password || !fullName) {
      return res.status(400).json({ success: false, message: 'يرجى إدخال البيانات الأساسية المطلوبة.' });
    }

    const existingUser = await User.findOne({ email: userEmail.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'البريد الإلكتروني مسجل بالفعل.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName: fullName || name,
      name: name || fullName,
      email: userEmail.toLowerCase(),
      password: hashedPassword,
      age: age || '20',
      phone: phone || '01000000000',
      whatsapp: whatsapp || phone || '01000000000',
      cairoAddress: cairoAddress || residence || 'القاهرة، مصر',
      residence: residence || cairoAddress || 'القاهرة، مصر',
      emergencyContact: emergencyContactName || emergencyContact,
      emergencyContactName: emergencyContactName || emergencyContact,
      emergencyContactRelation: emergencyContactRelation || 'الوالد / الوالدة',
      emergencyContactPhone: emergencyContactPhone || '',
      department: department || 'العلوم العامة',
      academicLevel: academicLevel || academicYear || 'المستوى الأول',
      academicYear: academicYear || academicLevel || 'المستوى الأول',
      studentId: studentId || academicId || passportOrNationalId,
      academicId: academicId || studentId || passportOrNationalId,
      passportOrNationalId: passportOrNationalId || nationalId || '',
      nationalId: nationalId || passportOrNationalId || '',
      idCardUrl: idCardUrl || idDocument || '',
      idDocument: idDocument || idCardUrl || '',
      status: 'pending',
      verificationStatus: 'pending',
      isApproved: false,
      isAdmin: false,
      role: 'user',
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح وهو قيد المراجعة.',
      user: {
        id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
      },
    });
  } catch (error) {
    console.error('Serverless Register Error:', error);
    return res.status(500).json({ success: false, message: 'خطأ في الخادم الداخلي: ' + error.message });
  }
}