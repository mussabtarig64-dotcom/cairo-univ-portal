const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  activeTheme: {
    type: String,
    default: 'classic-gold-blue',
  },
  themeTitle: {
    type: String,
    default: 'الكحلي والذهب الكلاسيكي (Classic Gold & Dark Blue)',
  },
  occasionMode: {
    type: String,
    enum: ['auto', 'none', 'ramadan', 'eid-fitr', 'eid-adha', 'sudan-national'],
    default: 'auto',
  },
  occasionGreeting: {
    type: String,
    default: '',
  },
  associationNameAr: {
    type: String,
    default: 'رابطة الطلاب السودانيين - كلية العلوم - جامعة القاهرة',
  },
  associationNameEn: {
    type: String,
    default: 'Sudanese Students Association - Faculty of Science, Cairo University',
  },
  associationAbbreviation: {
    type: String,
    default: 'SSA-FS-CU',
  },
  contactEmail: {
    type: String,
    default: 'info@ssa-fscu.org',
  },
  contactPhone: {
    type: String,
    default: '+20 100 000 0000',
  },
  cairoOfficeAddress: {
    type: String,
    default: 'كلية العلوم - الحرم الرئيسي لجامعة القاهرة - الجيزة',
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
