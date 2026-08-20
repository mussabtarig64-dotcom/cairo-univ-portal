const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  activeTheme: {
    type: String,
    default: 'official-emerald',
  },
  themeTitle: {
    type: String,
    default: 'الهوية الرسمية للرابطة (الأخضر والذهبي)',
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
