const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config(); // also check root .env
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  'mongodb+srv://mussabtarig64_db_user:Sezar123456@cluster0.xier0a3.mongodb.net/cairo_univ_db';

async function createOrUpdateAdmin() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas successfully.');

    const email = 'mussab@gmail.com';
    const plainPassword = '123456789';
    const name = 'مصعب طارق (المدير العام)';
    const role = 'admin';

    // 1. Delete any existing user with this email
    const deleteResult = await User.deleteMany({
      email: { $regex: new RegExp(`^${email}$`, 'i') }
    });
    console.log(`🗑️ Removed ${deleteResult.deletedCount} existing user document(s) for [${email}].`);

    // 2. Hash the password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    // 3. Create fresh admin document
    const user = await User.create({
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
    console.log(`✅ Fresh admin user with email [${email}] has been successfully created with password [${plainPassword}]!`);

    // 4. Verify bcrypt check locally
    const isPasswordValid = await bcrypt.compare(plainPassword, user.password);
    console.log('🔑 Password verification test:', isPasswordValid ? 'PASSED ✅' : 'FAILED ❌');

    console.log('\n--- Fresh Admin User Record in MongoDB ---');
    console.log({
      id: user._id,
      fullName: user.fullName || user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      verificationStatus: user.verificationStatus,
      createdAt: user.createdAt,
    });

    await mongoose.disconnect();
    console.log('\nMongoDB connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating/updating admin user:', error);
    process.exit(1);
  }
}

createOrUpdateAdmin();

