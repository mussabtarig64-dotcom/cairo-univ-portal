const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['announcement', 'post', 'urgent', 'academic', 'event', 'general'],
    default: 'general',
  },
  link: {
    type: String,
    default: '/',
  },
  sender: {
    type: String,
    default: 'إدارة الرابطة (SSA-FS-CU)',
  },
  senderRole: {
    type: String,
    default: 'admin',
  },
  readBy: [{
    type: String,
  }],
  isBroadcast: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
