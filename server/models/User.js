const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    // البيانات الشخصية واستبيان السكن
    fullName: {
      type: String,
      default: 'طالب كلية العلوم',
      trim: true,
    },
    name: {
      type: String,
      default: 'طالب كلية العلوم',
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      default: '',
    },
    age: {
      type: String,
      default: '',
      trim: true,
    },
    phone: {
      type: String,
      default: '01000000000',
      trim: true,
    },
    whatsapp: {
      type: String,
      trim: true,
      default: '',
    },
    residence: {
      type: String,
      trim: true,
      default: 'القاهرة، مصر',
    },
    cairoAddress: {
      type: String,
      trim: true,
      default: 'القاهرة، مصر',
    },

    // البيانات الأكاديمية - كلية العلوم جامعة القاهرة
    studentId: {
      type: String,
      default: () => `SSA-${Math.floor(100000 + Math.random() * 900000)}`,
      trim: true,
    },
    academicId: {
      type: String,
      trim: true,
      default: '',
    },
    department: {
      type: String,
      default: 'العلوم العامة',
    },
    academicLevel: {
      type: String,
      default: 'المستوى الأول',
    },
    academicYear: {
      type: String,
      default: 'المستوى الأول',
    },

    // وثيقة إثبات الهوية (جواز السفر / الرقم الوطني / بطاقة الكلية)
    idDocument: {
      type: String,
      default: '',
    },
    idCardUrl: {
      type: String,
      default: '',
    },
    passportOrNationalId: {
      type: String,
      trim: true,
      default: '',
    },

    // بيانات الاتصال في حالات الطوارئ
    emergencyContact: {
      type: String,
      default: '',
      trim: true,
    },
    emergencyContactName: {
      type: String,
      default: '',
      trim: true,
    },
    emergencyContactRelation: {
      type: String,
      default: '',
      trim: true,
    },
    emergencyContactPhone: {
      type: String,
      default: '',
      trim: true,
    },

    // حالة التحقق والرتبة الإدارية (admin / user)
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'verified'],
      default: 'pending',
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'approved', 'rejected'],
      default: 'pending',
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'student'],
      default: 'user',
    },
    notes: {
      type: String,
      default: '',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware لمزامنة الحقول المترادفة تلقائياً
userSchema.pre('save', function () {
  if (!this.name && this.fullName) {
    this.name = this.fullName;
  }
  if (!this.fullName && this.name) {
    this.fullName = this.name;
  }
  if (!this.cairoAddress && this.residence) {
    this.cairoAddress = this.residence;
  }
  if (!this.residence && this.cairoAddress) {
    this.residence = this.cairoAddress;
  }
  if (!this.studentId && this.academicId) {
    this.studentId = this.academicId;
  }
  if (!this.academicId && this.studentId) {
    this.academicId = this.studentId;
  }
  if (!this.idDocument && this.idCardUrl) {
    this.idDocument = this.idCardUrl;
  }
  if (!this.idCardUrl && this.idDocument) {
    this.idCardUrl = this.idDocument;
  }
  if (!this.whatsapp && this.phone) {
    this.whatsapp = this.phone;
  }
  if (!this.academicLevel && this.academicYear) {
    this.academicLevel = this.academicYear;
  }
  if (!this.academicYear && this.academicLevel) {
    this.academicYear = this.academicLevel;
  }
  if (this.role === 'student') {
    this.role = 'user';
  }
  if (this.role === 'admin') {
    this.isAdmin = true;
    this.isApproved = true;
    this.status = 'approved';
    this.verificationStatus = 'verified';
  } else if (this.status === 'approved' || this.verificationStatus === 'verified' || this.verificationStatus === 'approved') {
    this.isApproved = true;
    this.status = 'approved';
    this.verificationStatus = 'verified';
  } else if (this.status === 'rejected' || this.verificationStatus === 'rejected') {
    this.isApproved = false;
    this.status = 'rejected';
    this.verificationStatus = 'rejected';
  } else {
    this.isApproved = false;
    this.status = 'pending';
    this.verificationStatus = 'pending';
  }
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);