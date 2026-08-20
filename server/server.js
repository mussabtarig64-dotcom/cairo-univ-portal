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

const app = express();
const server = http.createServer(app);

// إعداد Socket.IO للتواصل الحي في غرف المذاكرة
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// الوسائط والـ Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// الاتصال بقاعدة بيانات MongoDB Atlas مع دعم بيئات Serverless (Vercel)
const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  'mongodb+srv://mussabtarig64_db_user:Sezar123456@cluster0.xier0a3.mongodb.net/cairo_univ_db';

let cachedConnection = null;

async function connectDB() {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    cachedConnection = conn;
    console.log('✅ تم الاتصال بالسجل المركزي لقاعدة البيانات MongoDB Atlas بنجاح');
    return conn;
  } catch (err) {
    console.error('❌ خطأ في الاتصال بقاعدة بيانات MongoDB:', err.message);
    return null;
  }
}

// التأكد من جاهزية الاتصال بقاعدة البيانات قبل كل طلب
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }
  next();
});

// محاولة الاتصال المبدئي
connectDB();

// تسجيل المسارات والـ API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/payments', paymentsRoutes);

// نقطة فحص صحة الخادم وقاعدة البيانات (Health Check)
app.get('/api/health', async (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.json({
    status: 'online',
    database: isConnected ? 'connected' : 'connecting_or_error',
    readyState: mongoose.connection.readyState,
    portal: 'رابطة الطلاب السودانيين - كلية العلوم - جامعة القاهرة (SSA-FS-CU)',
    timestamp: new Date().toISOString(),
  });
});

// إدارة اتصالات Socket.IO
io.on('connection', (socket) => {
  console.log(`🔌 [Socket.io] مستخدم جديد متصل: ${socket.id}`);

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`👥 المستخدم ${socket.id} انضم إلى الغرفة: ${roomId}`);
  });

  socket.on('send_message', (data) => {
    // إعادة توجيه الرسالة لجميع أفراد الغرفة
    socket.to(data.room).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log(`🔌 [Socket.io] انقطع اتصال المستخدم: ${socket.id}`);
  });
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
