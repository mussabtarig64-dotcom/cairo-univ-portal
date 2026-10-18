const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['user', 'ai', 'assistant', 'system'],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const aiConversationSchema = new mongoose.Schema({
  userId: {
    type: String,
    index: true,
    default: '',
  },
  userEmail: {
    type: String,
    index: true,
    trim: true,
    lowercase: true,
  },
  studentName: {
    type: String,
    default: 'طالب كلية العلوم',
  },
  department: {
    type: String,
    default: 'كلية العلوم',
  },
  academicLevel: {
    type: String,
    default: 'المرحلة الجامعية',
  },
  messages: [chatMessageSchema],
  lastInteraction: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

aiConversationSchema.index({ userEmail: 1, updatedAt: -1 });

module.exports = mongoose.models.AIConversation || mongoose.model('AIConversation', aiConversationSchema);
