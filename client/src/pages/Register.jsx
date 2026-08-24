import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../config/api';
import {
  User,
  Mail,
  Lock,
  UserPlus,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  GraduationCap,
  Phone,
  MapPin,
  HeartHandshake,
  CreditCard,
  Upload,
  Eye,
  EyeOff,
  Loader2,
  FileText,
  Trash2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const CAIRO_UNIV_DEPARTMENTS = [
  'الكيمياء (Chemistry)',
  'الكيمياء / الفيزياء (Chemistry / Physics)',
  'الكيمياء / الحيوية (Biochemistry)',
  'الكيمياء / النبات (Chemistry / Botany)',
  'الكيمياء / الحيوان (Chemistry / Zoology)',
  'الكيمياء / الميكروبيولوجي (Chemistry / Microbiology)',
  'الفيزياء (Physics)',
  'الفيزياء / الفلك (Physics / Astronomy)',
  'الفيزياء / الجيوفيزياء (Physics / Geophysics)',
  'الرياضيات (Mathematics)',
  'الرياضيات / علوم الحاسب (Mathematics / Computer Science)',
  'الاحصاء (Statistics)',
  'النبات (Botany)',
  'الحيوان (Zoology)',
  'الحشرات (Entomology)',
  'الجيولوجيا (Geology)',
  'الجيوفيزياء (Geophysics)',
  'علوم البترول الجيولوجية (Petroleum Geology)',
  'الميكروبيولوجي (Microbiology)',
];

export const ACADEMIC_LEVELS = [
  'المستوى الأول (إعدادي علوم)',
  'المستوى الثاني',
  'المستوى الثالث',
  'المستوى الرابع (تخرج)',
  'دراسات عليا / ماجستير / دكتوراه',
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    age: '20',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    whatsapp: '',
    cairoAddress: '',
    emergencyContactName: '',
    emergencyContactRelation: 'الوالد / الوالدة',
    emergencyContactPhone: '',
    department: 'الكيمياء (Chemistry)',
    academicLevel: 'المستوى الأول (إعدادي علوم)',
    passportOrNationalId: '',
    idCardUrl: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [idPreview, setIdPreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const processFile = (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('حجم الصورة يجب ألا يتجاوز 5 ميجابايت.');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError('يرجى رفع ملف صورة صالح (JPG, PNG, WEBP).');
      return;
    }
    setError('');
    setFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setIdPreview(reader.result);
      setFormData((prev) => ({ ...prev, idCardUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIdPreview(null);
    setFileName('');
    setFormData((prev) => ({ ...prev, idCardUrl: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const {
      fullName,
      email,
      password,
      confirmPassword,
      phone,
      whatsapp,
      cairoAddress,
      emergencyContactName,
      emergencyContactPhone,
      department,
      academicLevel,
      passportOrNationalId,
    } = formData;

    if (!fullName.trim() || !email.trim() || !password) {
      setError('يرجى استكمال البيانات الأساسية (الاسم الرباعي، البريد الإلكتروني، وكلمة المرور).');
      return;
    }

    if (password.length < 6) {
      setError('كلمة المرور يجب ألا تقل عن 6 أحرف.');
      return;
    }

    if (password !== confirmPassword) {
      setError('كلمات المرور غير متطابقة.');
      return;
    }

    if (!phone.trim()) {
      setError('يرجى إدخال رقم الهاتف المصري.');
      return;
    }

    if (!cairoAddress.trim()) {
      setError('يرجى إدخال عنوان السكن بمصر.');
      return;
    }

    if (!emergencyContactName.trim() || !emergencyContactPhone.trim()) {
      setError('يرجى إدخال اسم وهاتف جهة الاتصال في حالات الطوارئ.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: fullName.trim(),
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        age: formData.age || '20',
        phone: phone.trim() || '01000000000',
        whatsapp: whatsapp.trim() || phone.trim() || '01000000000',
        residence: cairoAddress.trim() || 'القاهرة، مصر',
        cairoAddress: cairoAddress.trim() || 'القاهرة، مصر',
        emergencyContact: emergencyContactName.trim(),
        emergencyContactName: emergencyContactName.trim(),
        emergencyContactRelation: formData.emergencyContactRelation,
        emergencyContactPhone: emergencyContactPhone.trim(),
        department: department,
        academicLevel: academicLevel,
        academicYear: academicLevel,
        studentId: passportOrNationalId.trim() || `SSA-${Math.floor(100000 + Math.random() * 900000)}`,
        academicId: passportOrNationalId.trim() || `SSA-${Math.floor(100000 + Math.random() * 900000)}`,
        passportOrNationalId: passportOrNationalId.trim(),
        nationalId: passportOrNationalId.trim(),
        idCardUrl: formData.idCardUrl || '',
        idDocument: formData.idCardUrl || '',
        nationalIdPhoto: formData.idCardUrl || '',
      };

      let resData = null;

      try {
        const response = await axios.post('/api/register', payload, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });
        resData = response.data;
      } catch (primaryErr) {
        try {
          const fallbackResponse = await axios.post(`${API_BASE}/auth/register`, payload, {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          });
          resData = fallbackResponse.data;
        } catch (secondaryErr) {
          if (typeof register === 'function') {
            const authRes = await register(payload);
            if (authRes && authRes.success) {
              resData = authRes;
            } else {
              throw secondaryErr || primaryErr;
            }
          } else {
            throw secondaryErr || primaryErr;
          }
        }
      }

      if (resData && (resData.success || resData.user)) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/pending-approval');
        }, 1500);
      } else {
        setError(resData?.message || 'حدث خطأ أثناء إرسال استمارة التسجيل.');
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'حدث خطأ في الاتصال بالخادم المركزي.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Reusable styling classes
  const cardStyle = {
    backgroundColor: '#0d1522',
    borderRadius: '12px',
    boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.45)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  };

  const inputClass =
    'w-full block px-4 py-3 bg-[#060b13] border border-slate-700/60 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/25 transition-all duration-200 text-sm text-right';
  const labelClass = 'block w-full text-right text-xs font-semibold text-slate-300 mb-1.5';

  return (
    <div className="min-h-screen w-full flex flex-col py-10 px-4 sm:px-6 lg:px-8 bg-[#090d16]" style={{ direction: 'rtl' }}>
      <div className="w-full max-w-4xl mx-auto">

        {/* Form Container Header / Banner */}
        <div className="text-center w-full mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-3 shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            <span>رابطة الطلاب السودانيين - كلية العلوم جامعة القاهرة</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
            استمارة التسجيل المركزي واستبيان الطلاب
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            يرجى استيفاء البيانات بدقة لاعتماد القيد الأكاديمي وإصدار بطاقة العضوية الرقمية (Digital ID).
          </p>
        </div>

        {/* Global Error Alert */}
        {error && (
          <div className="mb-6 w-full p-4 bg-red-500/15 border border-red-500/50 rounded-xl text-red-300 flex items-center gap-3 text-sm font-medium animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span className="leading-relaxed text-right w-full">{error}</span>
          </div>
        )}

        {/* Global Success Alert */}
        {isSuccess && (
          <div className="mb-6 w-full p-4 bg-emerald-500/15 border border-emerald-500/50 rounded-xl text-emerald-300 flex items-center gap-3 text-sm font-medium animate-fadeIn">
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span className="text-right w-full">تم استلام طلب التسجيل بنجاح! حسابك قيد المراجعة، جاري التحويل...</span>
          </div>
        )}

        {/* Form Root */}
        <form onSubmit={handleSubmit} className="w-full space-y-6">

          {/* ================= CARD 1: البيانات الشخصية ================= */}
          <div style={cardStyle} className="w-full p-5 sm:p-6 transition-all duration-200">
            {/* Card Header */}
            <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5 text-amber-400 font-bold text-base">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <User className="w-4 h-4" />
                </div>
                <span>القسم الأول: البيانات الشخصية وبيانات السكن بمصر</span>
              </div>
              <span className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-slate-800 text-slate-400 border border-slate-700/50">
                1 من 4
              </span>
            </div>

            {/* 2-Column Responsive Grid */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {/* Full Name */}
              <div className="w-full">
                <label className={labelClass}>
                  الاسم رباعي كما في الجواز / الهوية <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="مثال: مصعب طارق محمد عثمان"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* Age */}
              <div className="w-full">
                <label className={labelClass}>
                  العمر / سنة الميلاد <span className="text-amber-400">*</span>
                </label>
                <input
                  type="number"
                  name="age"
                  min="16"
                  max="65"
                  required
                  placeholder="20"
                  value={formData.age}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* Email */}
              <div className="w-full">
                <label className={labelClass}>
                  البريد الإلكتروني الأساسي <span className="text-amber-400">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="student@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* Phone */}
              <div className="w-full">
                <label className={labelClass}>
                  رقم الهاتف المصري <span className="text-amber-400">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="010XXXXXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* WhatsApp */}
              <div className="w-full">
                <label className={labelClass}>
                  رقم الواتساب <span className="text-amber-400">*</span>
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  required
                  placeholder="010XXXXXXXX أو +249..."
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* Cairo Address */}
              <div className="w-full">
                <label className={labelClass}>
                  مكان وعنوان السكن بمصر بالتفصيل <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  name="cairoAddress"
                  required
                  placeholder="مثال: الجيزة - بين السرايات / الدقي / فيصل"
                  value={formData.cairoAddress}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* Password */}
              <div className="w-full">
                <label className={labelClass}>
                  كلمة المرور للحساب <span className="text-amber-400">*</span>
                </label>
                <div className="relative w-full">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className={`${inputClass} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400 transition-colors p-1"
                    aria-label="تبديل إظهار كلمة المرور"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="w-full">
                <label className={labelClass}>
                  تأكيد كلمة المرور <span className="text-amber-400">*</span>
                </label>
                <div className="relative w-full">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`${inputClass} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400 transition-colors p-1"
                    aria-label="تبديل إظهار تأكيد كلمة المرور"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ================= CARD 2: بيانات الطوارئ ================= */}
          <div style={cardStyle} className="w-full p-5 sm:p-6 transition-all duration-200">
            {/* Card Header */}
            <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5 text-amber-400 font-bold text-base">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <span>القسم الثاني: بيانات جهة الاتصال في حالات الطوارئ</span>
              </div>
              <span className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-slate-800 text-slate-400 border border-slate-700/50">
                2 من 4
              </span>
            </div>

            {/* 2-Column Responsive Grid */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {/* Emergency Contact Name */}
              <div className="w-full">
                <label className={labelClass}>
                  اسم جهة الاتصال / ولي الأمر للطوارئ <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  name="emergencyContactName"
                  required
                  placeholder="اسم القريب أو الصديق بمصر أو السودان"
                  value={formData.emergencyContactName}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* Emergency Contact Relation */}
              <div className="w-full">
                <label className={labelClass}>
                  صلة القرابة <span className="text-amber-400">*</span>
                </label>
                <select
                  name="emergencyContactRelation"
                  value={formData.emergencyContactRelation}
                  onChange={handleChange}
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="الوالد / الوالدة" className="bg-[#0b1622] text-white">الوالد / الوالدة</option>
                  <option value="أخ / أخت" className="bg-[#0b1622] text-white">أخ / أخت</option>
                  <option value="عم / خال / قريب" className="bg-[#0b1622] text-white">عم / خال / قريب</option>
                  <option value="صديق / زميل سكن" className="bg-[#0b1622] text-white">صديق / زميل سكن</option>
                </select>
              </div>

              {/* Emergency Contact Phone */}
              <div className="w-full md:col-span-2">
                <label className={labelClass}>
                  رقم هاتف الطوارئ <span className="text-amber-400">*</span>
                </label>
                <input
                  type="tel"
                  name="emergencyContactPhone"
                  required
                  placeholder="رقم الهاتف مع رمز الدولة (مثال: +20... أو +249...)"
                  value={formData.emergencyContactPhone}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* ================= CARD 3: البيانات الأكاديمية ================= */}
          <div style={cardStyle} className="w-full p-5 sm:p-6 transition-all duration-200">
            {/* Card Header */}
            <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5 text-amber-400 font-bold text-base">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span>القسم الثالث: البيانات الأكاديمية بكلية العلوم</span>
              </div>
              <span className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-slate-800 text-slate-400 border border-slate-700/50">
                3 من 4
              </span>
            </div>

            {/* 2-Column Responsive Grid */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {/* Department */}
              <div className="w-full md:col-span-2">
                <label className={labelClass}>
                  القسم العلمي / التخصص الأكاديمي <span className="text-amber-400">*</span>
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className={`${inputClass} border-amber-500/40 text-amber-300 font-semibold cursor-pointer`}
                >
                  {CAIRO_UNIV_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept} className="bg-[#0b1622] text-white font-normal">
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Academic Level */}
              <div className="w-full">
                <label className={labelClass}>
                  الفرقة / المستوى الدراسي <span className="text-amber-400">*</span>
                </label>
                <select
                  name="academicLevel"
                  value={formData.academicLevel}
                  onChange={handleChange}
                  className={`${inputClass} cursor-pointer`}
                >
                  {ACADEMIC_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl} className="bg-[#0b1622] text-white">
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>

              {/* Passport / National ID */}
              <div className="w-full">
                <label className={labelClass}>
                  رقم جواز السفر / الرقم الوطني / بطاقة الكلية <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  name="passportOrNationalId"
                  required
                  placeholder="مثال: P01234567 أو الرقم الوطني"
                  value={formData.passportOrNationalId}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* ================= CARD 4: إثبات الشخصية ================= */}
          <div style={cardStyle} className="w-full p-5 sm:p-6 transition-all duration-200">
            {/* Card Header */}
            <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5 text-amber-400 font-bold text-base">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <CreditCard className="w-4 h-4" />
                </div>
                <span>القسم الرابع: رفع إثبات الشخصية / الهوية الجامعية</span>
              </div>
              <span className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-slate-800 text-slate-400 border border-slate-700/50">
                4 من 4
              </span>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div className="w-full">
              <label className={labelClass}>
                صورة إثبات الهوية (جواز السفر / البطاقة الوطنية / بطاقة الكلية)
              </label>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`w-full relative border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all duration-200 ${isDragging
                  ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
                  : 'border-slate-700/80 bg-[#060b13]/80 hover:border-amber-500/60 hover:bg-[#060b13]'
                  }`}
              >
                <input
                  type="file"
                  id="idUpload"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {!idPreview ? (
                  <label htmlFor="idUpload" className="cursor-pointer flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-inner">
                      <Upload className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-white">
                        اسحب الملف وأفلته هنا، أو <span className="text-amber-400 underline underline-offset-4">تصفح من جهازك</span>
                      </p>
                      <p className="text-xs text-slate-400">
                        الصيغ المدعومة: JPG, PNG, WEBP (الحد الأقصى للحجم: 5 ميجابايت)
                      </p>
                    </div>
                  </label>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative group">
                      <img
                        src={idPreview}
                        alt="معاينة إثبات الهوية"
                        className="max-h-48 max-w-full rounded-lg border border-emerald-500/50 shadow-lg object-contain bg-black/40"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="absolute -top-2.5 -right-2.5 bg-red-600 hover:bg-red-500 text-white p-1.5 rounded-full shadow-md transition-transform hover:scale-110"
                        title="إلغاء وحذف الصورة"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full">
                      <CheckCircle size={14} />
                      <span>{fileName || 'تم تجهيز صورة الهوية بنجاح للاعتماد'}</span>
                    </div>

                    <label
                      htmlFor="idUpload"
                      className="text-xs text-slate-400 hover:text-amber-400 underline underline-offset-4 cursor-pointer transition-colors mt-1"
                    >
                      تغيير أو اختيار ملف آخر
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ================= SUBMIT ACTION AREA ================= */}
          <div className="pt-2 space-y-4 text-center w-full">
            <p className="text-xs text-slate-400 leading-relaxed max-w-2xl mx-auto">
              بالنقر على "إرسال استمارة التسجيل المركزي"، أقر بأن جميع البيانات المدخلة صحيحة ومطابقة لوثائقي الرسمية بكلية العلوم جامعة القاهرة.
            </p>

            <div className="flex justify-center w-full">
              <button
                type="submit"
                disabled={loading || isSuccess}
                className="w-full sm:w-2/3 md:w-1/2 py-3.5 px-6 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-base rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] cursor-pointer inline-flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                    <span>جاري إرسال الاستمارة والاعتماد...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 text-slate-950" />
                    <span>إرسال استمارة التسجيل المركزي</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </form>

        {/* Login Link Footer */}
        <div className="w-full text-center mt-8 pt-6 border-t border-slate-800 text-xs sm:text-sm text-slate-400">
          <span>لديك حساب مسجل بالفعل؟ </span>
          <Link
            to="/login"
            className="text-amber-400 hover:text-amber-300 font-bold transition-colors mr-1 underline underline-offset-4"
          >
            تسجيل دخول الأعضاء
          </Link>
        </div>

      </div>
    </div>
  );
}