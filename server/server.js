require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const path = require('path');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const postsRoutes = require('./routes/posts');
const roomsRoutes = require('./routes/rooms');
const aiRoutes = require('./routes/ai');
const paymentsRoutes = require('./routes/payments');
const cmsRoutes = require('./routes/cms');

const app = express();
const server = http.createServer(app);

// إعداد Socket.IO للتواصل الحي في غرف المذاكرة
const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// الوسائط والـ Middlewares
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://cairo-univ-app.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  credentials: true,
};

app.use(cors(corsOptions));


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const uploadsPath = path.join(__dirname, 'uploads');
try {
  const fs = require('fs');
  if (fs.existsSync(uploadsPath)) {
    app.use('/uploads', express.static(uploadsPath));
  }
} catch (e) { }

// الاتصال بقاعدة بيانات MongoDB Atlas
const connectDB = require('./db');

// ضمان الاتصال بقاعدة البيانات لكل طلب بدون إيقاف الـ Request
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Database connection warning:', err.message);
  }
  next();
});

// تسجيل المسارات والـ API Endpoints الأساسية بمسارات مفردة لتجنب أخطاء Express
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/admin', adminRoutes);
app.use('/admin', adminRoutes);

app.use('/api/posts', postsRoutes);
app.use('/posts', postsRoutes);

app.use('/api/rooms', roomsRoutes);
app.use('/rooms', roomsRoutes);

app.use('/api/ai', aiRoutes);
app.use('/ai', aiRoutes);

app.use('/api/payments', paymentsRoutes);
app.use('/payments', paymentsRoutes);

app.use('/api/cms', cmsRoutes);
app.use('/cms', cmsRoutes);

// مسار فحص صحة الخادم وقاعدة البيانات (Health Check)
app.get('/api/health', async (req, res) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    res.json({
      status: 'online',
      database: isConnected ? 'connected' : 'connecting_or_error',
      readyState: mongoose.connection.readyState,
      portal: 'رابطة الطلاب السودانيين - كلية العلوم - جامعة القاهرة (SSA-FS-CU)',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/health', async (req, res) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    res.json({
      status: 'online',
      database: isConnected ? 'connected' : 'connecting_or_error',
      readyState: mongoose.connection.readyState,
      portal: 'رابطة الطلاب السودانيين - كلية العلوم - جامعة القاهرة (SSA-FS-CU)',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// مسار التهيئة السريعة لحساب الأدمن (Quick Setup Admin Endpoint)
app.get('/api/setup-admin', async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    const User = require('./models/User');

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
    console.error('Setup Admin error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to initialize admin account', error: error.message });
  }
});

// إدارة اتصالات Socket.IO
io.on('connection', (socket) => {
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
  });

  socket.on('send_message', (data) => {
    socket.to(data.room).emit('receive_message', data);
  });

  socket.on('disconnect', () => { });
});

// تشغيل الخادم المستقل في البيئات المحلية
if (process.env.VERCEL !== '1' && require.main === module) {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`\n===========================================================`);
    console.log(`🇸🇩 خادم بوابة رابطة الطلاب السودانيين - كلية العلوم يعمل بنجاح!`);
    console.log(`🏛️ SSA-FS-CU Backend Server Running on http://localhost:${PORT}`);
    console.log(`===========================================================\n`);
  });
}

// إتاحة التطبيق لـ Vercel Serverless Function
app.server = server;
app.io = io;
module.exports = app;