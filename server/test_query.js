const connectDB = require('./db');
const User = require('./models/User');

async function test() {
  await connectDB();
  console.log('Testing /pending query:');
  const pending = await User.find({
    role: { $ne: 'admin' },
    isAdmin: { $ne: true },
    verificationStatus: { $nin: ['verified', 'approved', 'rejected'] },
    status: { $nin: ['approved', 'rejected'] },
    isApproved: { $ne: true },
  }).select('-password').sort({ createdAt: -1 });
  console.log('Pending count:', pending.length);

  console.log('Testing /students query:');
  const students = await User.find({}).select('-password').sort({ createdAt: -1 }).limit(100);
  console.log('Students count:', students.length);
}

test().then(() => process.exit(0)).catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
