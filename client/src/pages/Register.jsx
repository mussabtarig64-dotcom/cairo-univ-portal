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
  Calendar,
  MessageCircle,
  ChevronDown,
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

  const inputClass =
    'w-full block bg-[#060b13] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-right mt-2';
  const labelClass = 'block text-sm font-bold text-slate-300';

  return (
    <div className="min-h-screen w-full bg-[#0b1622] py-10 px-4 flex justify-center items-start" dir="rtl">
      <div className="w-full max-w-4xl space-y-8">

        {/* Page Header */}
        <div className="text-center w-full space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>رابطة الطلاب السودانيين - كلية العلوم جامعة القاهرة</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            استمارة التسجيل المركزي واستبيان الطلاب
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            يرجى استيفاء البيانات بدقة لاعتماد القيد الأكاديمي وإصدار بطاقة العضوية الرقمية (Digital ID) الخاصة بك.
          </p>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="p-4 bg-red-950/70 border border-red-500/50 rounded-2xl text-red-200 flex items-center gap-3 text-sm font-medium shadow-lg">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span className="text-right flex-1">{error}</span>
          </div>
        )}

        {/* Global Success Banner */}
        {isSuccess && (
          <div className="p-4 bg-emerald-950/70 border border-emerald-500/50 rounded-2xl text-emerald-200 flex items-center gap-3 text-sm font-medium shadow-lg">
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span className="text-right flex-1">
              تم استلام استمارة التسجيل بنجاح! حسابك قيد التدقيق والمراجعة، جاري توجيهك الآن...
            </span>
          </div>
        )}

        {/* Main Form Root */}
        <form onSubmit={handleSubmit} className="w-full space-y-8">

          {/* ========================================================================= */}
          {/* SECTION 1: البيانات الشخصية والسكن */}
          {/* ========================================================================= */}
          <div className="bg-[#112233] border border-slate-700/50 rounded-3xl p-6 sm:p-10 shadow-2xl w-full">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-700/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">القسم الأول: البيانات الشخصية والسكن</h2>
                  <p className="text-xs text-slate-400">معلومات الهوية الأساسية وعنوان الإقامة في جمهورية مصر العربية</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-900 text-amber-400 border border-slate-700">
                1 / 4
              </span>
            </div>

            {/* Grid Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">

              {/* Full Name */}
              <div className="md:col-span-2">
                <label className={labelClass}>
                  الاسم رباعي كما في الجواز أو الهوية <span className="text-amber-400">*</span>
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
              <div>
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
              <div>
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
              <div>
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
              <div>
                <label className={labelClass}>
                  رقم الواتساب للتواصل <span className="text-amber-400">*</span>
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
              <div className="md:col-span-2">
                <label className={labelClass}>
                  مكان وعنوان السكن بمصر بالتفصيل <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  name="cairoAddress"
                  required
                  placeholder="مثال: الجيزة - بين السرايات / الدقي / فيصل / مدينة نصر"
                  value={formData.cairoAddress}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* Password */}
              <div>
                <label className={labelClass}>
                  كلمة المرور للحساب <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className={`${inputClass} pl-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 mt-1 text-slate-400 hover:text-amber-400 transition-colors p-1"
                    aria-label="تبديل إظهار كلمة المرور"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className={labelClass}>
                  تأكيد كلمة المرور <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`${inputClass} pl-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 mt-1 text-slate-400 hover:text-amber-400 transition-colors p-1"
                    aria-label="تبديل إظهار تأكيد كلمة المرور"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 2: بيانات جهة الاتصال للطوارئ */}
          {/* ========================================================================= */}
          <div className="bg-[#112233] border border-slate-700/50 rounded-3xl p-6 sm:p-10 shadow-2xl w-full">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-700/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">القسم الثاني: بيانات الاتصال للطوارئ</h2>
                  <p className="text-xs text-slate-400">للتواصل مع الأهل أو الأقارب عند الحاجة الماسة أو الطوارئ</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-900 text-amber-400 border border-slate-700">
                2 / 4
              </span>
            </div>

            {/* Grid Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">

              {/* Emergency Contact Name */}
              <div>
                <label className={labelClass}>
                  اسم ولي الأمر / جهة الاتصال للطوارئ <span className="text-amber-400">*</span>
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
              <div>
                <label className={labelClass}>
                  صلة القرابة <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <select
                    name="emergencyContactRelation"
                    value={formData.emergencyContactRelation}
                    onChange={handleChange}
                    className={`${inputClass} appearance-none cursor-pointer`}
                  >
                    <option value="الوالد / الوالدة" className="bg-[#112233] text-white">الوالد / الوالدة</option>
                    <option value="أخ / أخت" className="bg-[#112233] text-white">أخ / أخت</option>
                    <option value="عم / خال / قريب" className="bg-[#112233] text-white">عم / خال / قريب</option>
                    <option value="صديق / زميل سكن" className="bg-[#112233] text-white">صديق / زميل سكن</option>
                  </select>
                  <ChevronDown className="absolute left-3.5 top-1/2 -translate-y-1/2 mt-1 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Emergency Contact Phone */}
              <div className="md:col-span-2">
                <label className={labelClass}>
                  رقم هاتف الطوارئ مع رمز الدولة <span className="text-amber-400">*</span>
                </label>
                <input
                  type="tel"
                  name="emergencyContactPhone"
                  required
                  placeholder="مثال: +2010... أو +2499..."
                  value={formData.emergencyContactPhone}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 3: البيانات الأكاديمية بكلية العلوم */}
          {/* ========================================================================= */}
          <div className="bg-[#112233] border border-slate-700/50 rounded-3xl p-6 sm:p-10 shadow-2xl w-full">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-700/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">القسم الثالث: البيانات الأكاديمية بالكلية</h2>
                  <p className="text-xs text-slate-400">التخصص، المستوى الدراسي، ورقم الهوية أو الجواز</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-900 text-amber-400 border border-slate-700">
                3 / 4
              </span>
            </div>

            {/* Grid Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">

              {/* Department */}
              <div className="md:col-span-2">
                <label className={labelClass}>
                  القسم العلمي / التخصص الأكاديمي <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className={`${inputClass} border-amber-500/60 text-amber-300 font-semibold appearance-none cursor-pointer`}
                  >
                    {CAIRO_UNIV_DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept} className="bg-[#112233] text-white font-normal">
                        {dept}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute left-3.5 top-1/2 -translate-y-1/2 mt-1 w-4 h-4 text-amber-400 pointer-events-none" />
                </div>
              </div>

              {/* Academic Level */}
              <div>
                <label className={labelClass}>
                  الفرقة / المستوى الدراسي <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <select
                    name="academicLevel"
                    value={formData.academicLevel}
                    onChange={handleChange}
                    className={`${inputClass} appearance-none cursor-pointer`}
                  >
                    {ACADEMIC_LEVELS.map((lvl) => (
                      <option key={lvl} value={lvl} className="bg-[#112233] text-white">
                        {lvl}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute left-3.5 top-1/2 -translate-y-1/2 mt-1 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Passport / National ID */}
              <div>
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

          {/* ========================================================================= */}
          {/* SECTION 4: رفع إثبات الشخصية */}
          {/* ========================================================================= */}
          <div className="bg-[#112233] border border-slate-700/50 rounded-3xl p-6 sm:p-10 shadow-2xl w-full">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-700/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">القسم الرابع: وثيقة إثبات الشخصية</h2>
                  <p className="text-xs text-slate-400">إرفاق صورة ضوئية واضحة من جواز السفر أو البطاقة الجامعية</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-900 text-amber-400 border border-slate-700">
                4 / 4
              </span>
            </div>

            {/* Upload Zone */}
            <div className="w-full">
              <label className={labelClass}>
                صورة إثبات الهوية (جواز السفر / البطاقة الوطنية / بطاقة الكلية)
              </label>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`w-full relative border-2 border-dashed rounded-2xl p-6 sm:p-10 text-center transition-all mt-2 ${
                  isDragging
                    ? 'border-amber-400 bg-amber-500/15'
                    : 'border-slate-700 bg-[#060b13] hover:border-amber-500/60'
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
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
                      <Upload className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm sm:text-base font-bold text-white">
                        اسحب الملف وأفلته هنا، أو <span className="text-amber-400 underline underline-offset-4">تصفح من جهازك</span>
                      </p>
                      <p className="text-xs text-slate-400">
                        الصيغ المعتمدة: JPG, PNG, WEBP (الحد الأقصى للحجم: 5 ميجابايت)
                      </p>
                    </div>
                  </label>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative group">
                      <img
                        src={idPreview}
                        alt="معاينة إثبات الهوية"
                        className="max-h-52 max-w-full rounded-xl border border-emerald-500/50 shadow-2xl object-contain bg-black/60 p-1"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="absolute -top-3 -right-3 bg-red-600 hover:bg-red-500 text-white p-2 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95"
                        title="إلغاء وحذف الصورة"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-full shadow-inner">
                      <CheckCircle size={15} />
                      <span>{fileName || 'تم تحميل ومعاينة صورة الهوية بنجاح للاعتماد'}</span>
                    </div>

                    <label
                      htmlFor="idUpload"
                      className="text-xs text-slate-400 hover:text-amber-400 underline underline-offset-4 cursor-pointer transition-colors"
                    >
                      تغيير أو اختيار ملف آخر
                    </label>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* SUBMIT ACTION */}
          {/* ========================================================================= */}
          <div className="pt-2 space-y-5 text-center w-full">
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed bg-[#112233] p-3.5 rounded-xl border border-slate-700/50">
              <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>
                بالنقر على "إرسال استمارة التسجيل المركزي"، أقر بأن كافة البيانات المدخلة صحيحة ومطابقة لوثائقي الرسمية بكلية العلوم جامعة القاهرة.
              </span>
            </div>

            <div className="flex justify-center w-full">
              <button
                type="submit"
                disabled={loading || isSuccess}
                className="w-full sm:w-2/3 md:w-1/2 py-4 px-8 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-base sm:text-lg rounded-xl shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] cursor-pointer inline-flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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

        {/* Footer Login Link */}
        <div className="w-full text-center mt-10 pt-6 border-t border-slate-800 text-xs sm:text-sm text-slate-400">
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