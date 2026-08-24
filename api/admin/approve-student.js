const mongoose = require('mongoose');

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
      fullName: String,
      name: String,
      email: String,
      status: String,
      verificationStatus: String,
      isApproved: Boolean,
      notes: String,
    },
    { timestamps: true }
  );
  User = mongoose.model('User', userSchema);
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PATCH');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
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

    const { id, studentId, status, notes } = body;
    const targetId = id || studentId;

    if (!targetId) {
      return res.status(400).json({ success: false, message: 'معرف الطالب مطلوب' });
    }

    const newStatus = status === 'rejected' ? 'rejected' : 'approved';
    const newVerif = status === 'rejected' ? 'rejected' : 'verified';

    const student = await User.findByIdAndUpdate(
      targetId,
      {
        verificationStatus: newVerif,
        status: newStatus,
        isApproved: newStatus === 'approved',
        notes: notes || '',
      },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ success: false, message: 'لم يتم العثور على الطالب' });
    }

    return res.status(200).json({
      success: true,
      message: newStatus === 'approved' ? 'تم اعتماد وقبول الطالب بنجاح' : 'تم رفض طلب الطالب',
      student,
    });
  } catch (error) {
    console.error('Approve Student API Error:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
