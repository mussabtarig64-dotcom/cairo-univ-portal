const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    default: 'تنويه عام',
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    default: 'general',
  },
  isPinned: {
    type: Boolean,
    default: true,
  },
  author: {
    type: String,
    default: 'إدارة الرابطة - SSA-FS-CU',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Announcement || mongoose.model('Announcement', announcementSchema);
