const mongoose = require('mongoose');

const MONGO_URI =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  'mongodb+srv://mussabtarig64_db_user:Sezar123456@cluster0.xier0a3.mongodb.net/cairo_univ_db';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
    };

    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongooseInstance) => {
      console.log('✅ تم الاتصال بالسجل المركزي لقاعدة البيانات MongoDB Atlas بنجاح');
      return mongooseInstance;
    }).catch((err) => {
      console.error('❌ خطأ في الاتصال بقاعدة بيانات MongoDB:', err.message);
      cached.promise = null;
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.conn = null;
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}

module.exports = connectDB;
