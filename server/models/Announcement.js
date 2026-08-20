const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['academic', 'event', 'urgent', 'cultural', 'general'],
    default: 'general',
  },
  isPinned: {
    type: Boolean,
    default: false,
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
