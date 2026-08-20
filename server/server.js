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

// الاتصال بقاعدة بيانات MongoDB Atlas
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://mussabtarig64_db_user:Sezar123456@cluster0.xier0a3.mongodb.net/cairo_univ_db';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ تم الاتصال بالسجل المركزي لقاعدة البيانات MongoDB Atlas بنجاح'))
  .catch((err) => console.error('❌ خطأ في الاتصال بقاعدة بيانات MongoDB:', err.message));

// تسجيل المسارات والـ API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/payments', paymentsRoutes);

// نقطة فحص صحة الخادم (Health Check)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    portal: 'رابطة الطلاب السودانيين - كلية العلوم - جامعة القاهرة (SSA-FS-CU)',
    timestamp: new Date(),
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

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`\n===========================================================`);
  console.log(`🇸🇩 خادم بوابة رابطة الطلاب السودانيين - كلية العلوم يعمل بنجاح!`);
  console.log(`🏛️ SSA-FS-CU Backend Server Running on http://localhost:${PORT}`);
  console.log(`===========================================================\n`);
});

module.exports = { app, server, io };
