const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  studentName: {
    type: String,
    required: true,
    trim: true,
  },
  studentEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  studentId: {
    type: String,
    required: true,
    trim: true,
  },
  department: {
    type: String,
    default: 'العلوم العامة',
    trim: true,
  },
  phone: {
    type: String,
    default: 'غير محدد',
    trim: true,
  },
  activityType: {
    type: String,
    required: true,
    default: 'الاشتراك السنوي للرابطة (Annual Membership)',
  },
  amount: {
    type: Number,
    required: true,
    min: 1,
  },
  transactionId: {
    type: String,
    required: true,
    trim: true,
  },
  paymentMethod: {
    type: String,
    enum: ['vodafone_cash', 'instapay', 'bank_transfer', 'fawry', 'cash', 'other'],
    default: 'vodafone_cash',
  },
  receiptUrl: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    default: '',
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  adminNotes: {
    type: String,
    default: '',
    trim: true,
  },
  reviewedBy: {
    type: String,
    default: '',
  },
  reviewedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
