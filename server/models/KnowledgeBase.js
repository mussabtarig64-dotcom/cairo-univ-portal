const mongoose = require('mongoose');

const knowledgeBaseSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
  },
  prompt: {
    type: String,
    trim: true,
  },
  answer: {
    type: String,
    default: '',
    trim: true,
  },
  category: {
    type: String,
    default: 'general',
    trim: true,
  },
  keywords: [
    {
      type: String,
      trim: true,
    },
  ],
  isActive: {
    type: Boolean,
    default: true,
  },
  author: {
    type: String,
    default: 'إدارة الرابطة - SSA-FS-CU',
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

module.exports = mongoose.models.KnowledgeBase || mongoose.model('KnowledgeBase', knowledgeBaseSchema);
