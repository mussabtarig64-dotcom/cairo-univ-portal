const mongoose = require('mongoose');

const HubContentSchema = new mongoose.Schema(
  {
    hub: {
      type: String,
      required: true,
      index: true,
      // e.g. 'sports', 'academic', 'social', 'sudan', 'events', 'media', 'achievements', 'administration', 'constitution', 'archive'
    },
    section: {
      type: String,
      default: 'general',
      index: true,
      // e.g. 'tournaments', 'teams', 'results', 'standings', 'scorers', 'halloffame', 'initiatives', 'volunteer', 'support', 'families', 'heritage', 'states', 'talents', 'arts', 'publications', 'photos', 'records'
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'عام',
    },
    year: {
      type: String,
      default: new Date().getFullYear().toString(),
      index: true,
    },
    date: {
      type: String,
      default: '',
    },
    badge: {
      type: String,
      default: '',
    },
    author: {
      type: String,
      default: 'إدارة الرابطة',
    },
    status: {
      type: String,
      default: 'نشط',
    },
    icon: {
      type: String,
      default: '📌',
    },
    fileUrl: {
      type: String,
      default: '',
    },
    fileSize: {
      type: String,
      default: '',
    },
    link: {
      type: String,
      default: '',
    },
    extraData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('HubContent', HubContentSchema);
