const mongoose = require('mongoose');

const initiativeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    badge: {
      type: String,
      default: 'مبادرة تكافل',
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      default: '',
      trim: true,
    },
    targetAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    collectedAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    currency: {
      type: String,
      default: 'جنيه مصري',
      trim: true,
    },
    paymentMethods: {
      instapay: {
        type: String,
        default: '',
        trim: true,
      },
      vodafoneCash: {
        type: String,
        default: '',
        trim: true,
      },
      bankak: {
        type: String,
        default: '',
        trim: true,
      },
    },
    whatsappLink: {
      type: String,
      default: '',
      trim: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    createdBy: {
      type: String,
      default: 'إدارة الرابطة',
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

initiativeSchema.index({ expiresAt: 1, createdAt: -1 });

module.exports = mongoose.models.Initiative || mongoose.model('Initiative', initiativeSchema);

