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
      default: () => `student_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}@ssa-cu.edu`,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      default: '',
    },
    age: {
      type: String,
      default: '20',
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
      default: '01000000000',
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
      default: () => `SSA-${Math.floor(100000 + Math.random() * 900000)}`,
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
      default: 'الوالد / الوالدة',
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
      default: 'pending',
    },
    verificationStatus: {
      type: String,
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
    strict: false,
  }
);

// Middleware لمزامنة الحقول المترادفة تلقائياً وضمان عدم حدوث أخطاء أو فقدان في البيانات
userSchema.pre('save', function () {
  try {
    // 1. مزامنة الاسم
    if (!this.name && this.fullName) {
      this.name = this.fullName;
    }
    if (!this.fullName && this.name) {
      this.fullName = this.name;
    }

    // 2. مزامنة السكن والعنوان بالقاهرة
    if (!this.cairoAddress && this.residence) {
      this.cairoAddress = this.residence;
    }
    if (!this.residence && this.cairoAddress) {
      this.residence = this.cairoAddress;
    }

    // 3. مزامنة رقم القيد والرقم الأكاديمي
    if (!this.studentId && this.academicId) {
      this.studentId = this.academicId;
    }
    if (!this.academicId && this.studentId) {
      this.academicId = this.studentId;
    }

    // 4. مزامنة وثيقة إثبات الهوية والبطاقة
    if (!this.idDocument && this.idCardUrl) {
      this.idDocument = this.idCardUrl;
    }
    if (!this.idCardUrl && this.idDocument) {
      this.idCardUrl = this.idDocument;
    }

    // 5. مزامنة الهاتف ورقم الواتساب
    if (!this.whatsapp && this.phone) {
      this.whatsapp = this.phone;
    }
    if (!this.phone && this.whatsapp) {
      this.phone = this.whatsapp;
    }

    // 6. مزامنة المستوى الأكاديمي والفرقة الدراسية
    if (!this.academicLevel && this.academicYear) {
      this.academicLevel = this.academicYear;
    }
    if (!this.academicYear && this.academicLevel) {
      this.academicYear = this.academicLevel;
    }

    // 7. مزامنة بيانات الاتصال في حالات الطوارئ
    if (!this.emergencyContact && this.emergencyContactName) {
      this.emergencyContact = this.emergencyContactName;
    }
    if (!this.emergencyContactName && this.emergencyContact) {
      this.emergencyContactName = this.emergencyContact;
    }

    // 8. مزامنة حالة الحساب والرتب الإدارية
    if (this.role === 'admin') {
      this.isAdmin = true;
      this.isApproved = true;
      this.status = 'approved';
      this.verificationStatus = 'verified';
    } else if (
      this.status === 'approved' ||
      this.verificationStatus === 'verified' ||
      this.verificationStatus === 'approved' ||
      this.isApproved === true
    ) {
      this.isApproved = true;
      this.status = 'approved';
      this.verificationStatus = 'verified';
      if (!this.role || this.role === 'student') this.role = 'user';
    } else if (this.status === 'rejected' || this.verificationStatus === 'rejected') {
      this.isApproved = false;
      this.status = 'rejected';
      this.verificationStatus = 'rejected';
      if (!this.role || this.role === 'student') this.role = 'user';
    } else {
      this.isApproved = false;
      this.status = 'pending';
      this.verificationStatus = 'pending';
      if (!this.role || this.role === 'student') this.role = 'user';
    }
  } catch (e) {
    console.error('Error in User pre-save hook:', e);
  }
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);