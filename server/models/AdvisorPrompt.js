const mongoose = require('mongoose');

const advisorPromptSchema = new mongoose.Schema({
  prompt: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    default: 'general',
    trim: true,
  },
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

module.exports = mongoose.models.AdvisorPrompt || mongoose.model('AdvisorPrompt', advisorPromptSchema);
