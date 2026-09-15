const mongoose = require('mongoose');

const advisorPromptSchema = new mongoose.Schema({
  prompt: {
    type: String,
    required: true,
    trim: true,
  },
  question: {
    type: String,
    trim: true,
  },
  answer: {
    type: String,
    trim: true,
    default: '',
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// مزامنة حقل prompt و question تلقائياً قبل الحفظ
advisorPromptSchema.pre('save', function () {
  if (this.prompt && !this.question) {
    this.question = this.prompt;
  }
  if (this.question && !this.prompt) {
    this.prompt = this.question;
  }
  this.updatedAt = new Date();
});

module.exports = mongoose.models.AdvisorPrompt || mongoose.model('AdvisorPrompt', advisorPromptSchema);
