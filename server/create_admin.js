const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config(); // also check root .env if any
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

async function createOrUpdateAdmin() {
  if (!MONGO_URI) {
    console.error('❌ Error: MONGO_URI is not set in environment or .env file');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas successfully.');

    const email = 'mussab@gmail.com';
    const plainPassword = '123456789';
    const name = 'Mussab';
    const role = 'admin';

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    let user = await User.findOne({ email: email.toLowerCase().trim() });

    if (user) {
      user.fullName = name;
      user.name = name;
      user.password = hashedPassword;
      user.role = role;
      user.status = 'approved';
      user.verificationStatus = 'verified';
      await user.save();
      console.log(`✅ Admin user with email [${email}] has been successfully updated/reset!`);
    } else {
      user = await User.create({
        fullName: name,
        name: name,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: role,
        phone: '+249000000000',
        studentId: 'ADMIN-01',
        department: 'العلوم العامة',
        academicLevel: 'المستوى الرابع',
        status: 'approved',
        verificationStatus: 'verified',
      });
      console.log(`✅ Admin user with email [${email}] has been successfully created!`);
    }

    console.log({
      id: user._id,
      name: user.name || user.fullName,
      email: user.email,
      role: user.role,
      status: user.status,
      verificationStatus: user.verificationStatus,
    });

    await mongoose.disconnect();
    console.log('MongoDB connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating/updating admin user:', error);
    process.exit(1);
  }
}

createOrUpdateAdmin();
