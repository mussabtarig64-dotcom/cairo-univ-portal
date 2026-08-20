const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    default: 'منشور أكاديمي',
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    default: 'طالب بكلية العلوم',
  },
  authorEmail: {
    type: String,
    default: '',
  },
  authorRole: {
    type: String,
    default: 'طالب',
  },
  department: {
    type: String,
    default: 'العلوم العامة',
  },
  mediaType: {
    type: String,
    enum: ['none', 'image', 'video', 'pdf'],
    default: 'none',
  },
  mediaUrl: {
    type: String,
    default: '',
  },
  fileName: {
    type: String,
    default: '',
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
  likes: {
    type: Number,
    default: 0,
  },
  likedBy: {
    type: [String],
    default: [],
  },
  comments: [
    {
      author: String,
      authorEmail: String,
      text: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Post || mongoose.model('Post', postSchema);