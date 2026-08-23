import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
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
  Shield,
  Upload,
  Calendar,
  CreditCard,
  FileText,
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
} from 'lucide-react';

export const MAJOR_OPTIONS = [
  'الكيمياء منفرد',
  'الفيزياء منفرد',
  'الفيزياء الحيوية',
  'مزدوج كيمياء / نبات',
  'مزدوج كيمياء / حشرات',
  'مزدوج كيمياء / جيولوجيا',
  'مزدوج كيمياء / فيزياء',
  'مزدوج كيمياء / ميكرو',
  'مزدوج كيمياء / حيوان',
  'التكنولوجيا الحيوية',
  'مزدوج الكيمياء الحيوية',
];

export const ACADEMIC_LEVELS = [
  'المستوى الأول (إعدادي علوم)',
  'المستوى الثاني',
  'المستوى الثالث',
  'المستوى الرابع (تخرج)',
  'الدراسات العليا / ماجستير ودكتوراه',
];

export default function Register() {
  const { activeTheme } = useTheme();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // 1. البيانات الشخصية وبيانات السكن
    fullName: '',
    age: '20',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    whatsapp: '',
    cairoAddress: '',

    // 2. جهة الاتصال في حالات الطوارئ
    emergencyContactName: '',
    emergencyContactRelation: 'الوالد / الوالدة',
    emergencyContactPhone: '',

    // 3. البيانات الأكاديمية
    department: 'الكيمياء منفرد',
    academicLevel: 'المستوى الأول (إعدادي علوم)',
    passportOrNationalId: '',

    // 4. المرفقات
    idCardUrl: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [idPreview, setIdPreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('حجم الصورة يجب ألا يتجاوز 5 ميجابايت.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdPreview(reader.result);
        setFormData((prev) => ({ ...prev, idCardUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
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
      setError('يرجى استكمال البيانات الإلزامية (الاسم الرباعي، البريد الإلكتروني، وكلمة المرور).');
      return;
    }

    if (password.length < 6) {
      setError('كلمة المرور يجب أن لا تقل عن 6 أحرف.');
      return;
    }

    if (password !== confirmPassword) {
      setError('كلمات المرور غير متطابقة.');
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

      // أولوية المسار القياسي الموحد /api/register
      try {
        const response = await axios.post('/api/register', payload, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });
        resData = response.data;
      } catch (primaryErr) {
        // تجربة مسار الـ auth والمسار التلقائي في حال البيئة المحلية
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
        }, 1200);
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

  return (
    <div className="w-full min-h-screen py-6 sm:py-10 px-3 sm:px-6 lg:px-8 pb-36 font-sans text-slate-100 flex flex-col items-center justify-start" style={{ direction: 'rtl' }}>
      <div className="w-full max-w-4xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden transition-all duration-300">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/80 p-6 sm:p-8 md:p-10 text-center border-b border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/40 px-4 py-1.5 rounded-full text-amber-400 text-xs sm:text-sm font-semibold mb-4 shadow-sm backdrop-blur-md">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>رابطة الطلاب السودانيين - كلية العلوم جامعة القاهرة (SSA-FS-CU)</span>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug mb-3">
              استمارة التسجيل المركزي واستبيان الطلاب
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              يرجى استيفاء البيانات بدقة لاعتماد القيد وإصدار بطاقة العضوية الرقمية (Digital ID) وتمكين الوصول لكافة خدمات الرابطة والمكتبة الأكاديمية.
            </p>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-4 sm:p-6 md:p-8 lg:p-10 space-y-6 sm:space-y-8">
          {/* Alerts */}
          {error && (
            <div className="bg-red-500/15 border border-red-500/40 text-red-300 px-4 py-3.5 rounded-xl flex items-center gap-3 text-xs sm:text-sm font-medium animate-fadeIn">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isSuccess && (
            <div className="bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 px-4 py-3.5 rounded-xl flex items-center gap-3 text-xs sm:text-sm font-medium animate-fadeIn">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>تم إرسال استمارة التسجيل المركزي بنجاح! جاري تحويلك لصفحة حالة القيد...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            
            {/* Section 1: Personal Info & Residence */}
            <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-colors hover:border-slate-600">
              <div className="flex items-center gap-2.5 pb-3.5 mb-4 sm:mb-6 border-b border-slate-700/60">
                <User className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <h2 className="text-sm sm:text-base md:text-lg font-bold text-white">
                  القسم الأول: البيانات الشخصية والسكن بمصر
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {/* Full Name */}
                <div className="sm:col-span-2 md:col-span-1">
                  <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5">
                    الاسم رباعي كما في الجواز/الهوية: <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="مثال: مصعب طارق محمد عثمان"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 sm:py-3 bg-slate-900/90 border border-slate-700 rounded-lg sm:rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all"
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5">
                    العمر / سنة الميلاد: <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="number"
                    name="age"
                    min="16"
                    max="60"
                    required
                    placeholder="20"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 sm:py-3 bg-slate-900/90 border border-slate-700 rounded-lg sm:rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5">
                    البريد الإلكتروني الأساسي: <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="student@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 sm:py-3 bg-slate-900/90 border border-slate-700 rounded-lg sm:rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5">
                    رقم الهاتف المصري: <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="010XXXXXXXX"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 sm:py-3 bg-slate-900/90 border border-slate-700 rounded-lg sm:rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all"
                  />
                </div>

                {/* Whatsapp */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5">
                    رقم الواتساب (للإشعارات والتواصل): <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    required
                    placeholder="010XXXXXXXX أو +249..."
                    value={formData.whatsapp}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 sm:py-3 bg-slate-900/90 border border-slate-700 rounded-lg sm:rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all"
                  />
                </div>

                {/* Cairo Address */}
                <div className="sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5">
                    مكان وعنوان السكن بالتفصيل بمصر: <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="cairoAddress"
                    required
                    placeholder="مثال: الجيزة - بين السرايات / الدقي / فيصل"
                    value={formData.cairoAddress}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 sm:py-3 bg-slate-900/90 border border-slate-700 rounded-lg sm:rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5">
                    كلمة المرور للحساب: <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 sm:py-3 pl-10 bg-slate-900/90 border border-slate-700 rounded-lg sm:rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5">
                    تأكيد كلمة المرور: <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 sm:py-3 bg-slate-900/90 border border-slate-700 rounded-lg sm:rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Emergency Contact */}
            <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-colors hover:border-slate-600">
              <div className="flex items-center gap-2.5 pb-3.5 mb-4 sm:mb-6 border-b border-slate-700/60">
                <HeartHandshake className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <h2 className="text-sm sm:text-base md:text-lg font-bold text-white">
                  القسم الثاني: بيانات جهة الاتصال في حالات الطوارئ
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {/* Emergency Contact Name */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5">
                    اسم جهة الاتصال / ولي الأمر للطوارئ: <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="emergencyContactName"
                    required
                    placeholder="اسم القريب أو الصديق بمصر أو السودان"
                    value={formData.emergencyContactName}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 sm:py-3 bg-slate-900/90 border border-slate-700 rounded-lg sm:rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all"
                  />
                </div>

                {/* Emergency Relation */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5">
                    صلة القرابة: <span className="text-amber-400">*</span>
                  </label>
                  <select
                    name="emergencyContactRelation"
                    value={formData.emergencyContactRelation}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 sm:py-3 bg-slate-900/90 border border-slate-700 rounded-lg sm:rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all cursor-pointer"
                  >
                    <option value="الوالد / الوالدة" className="bg-slate-900 text-white">الوالد / الوالدة</option>
                    <option value="أخ / أخت" className="bg-slate-900 text-white">أخ / أخت</option>
                    <option value="عم / خال / قريب" className="bg-slate-900 text-white">عم / خال / قريب</option>
                    <option value="صديق / زميل سكن" className="bg-slate-900 text-white">صديق / زميل سكن</option>
                  </select>
                </div>

                {/* Emergency Contact Phone */}
                <div className="sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5">
                    رقم هاتف الطوارئ: <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="emergencyContactPhone"
                    required
                    placeholder="رقم الهاتف مع رمز الدولة (مثال: +20... أو +249...)"
                    value={formData.emergencyContactPhone}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 sm:py-3 bg-slate-900/90 border border-slate-700 rounded-lg sm:rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Academic Information */}
            <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-colors hover:border-slate-600">
              <div className="flex items-center gap-2.5 pb-3.5 mb-4 sm:mb-6 border-b border-slate-700/60">
                <GraduationCap className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <h2 className="text-sm sm:text-base md:text-lg font-bold text-white">
                  القسم الثالث: البيانات الأكاديمية بكلية العلوم
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {/* Department */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5">
                    القسم العلمي / التخصص الأكاديمي: <span className="text-amber-400">*</span>
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 sm:py-3 bg-slate-900/90 border border-amber-500/40 rounded-lg sm:rounded-xl text-amber-300 font-semibold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all cursor-pointer"
                  >
                    {MAJOR_OPTIONS.map((major) => (
                      <option key={major} value={major} className="bg-slate-900 text-white">
                        {major}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Academic Level */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5">
                    الفرقة / المستوى الدراسي: <span className="text-amber-400">*</span>
                  </label>
                  <select
                    name="academicLevel"
                    value={formData.academicLevel}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 sm:py-3 bg-slate-900/90 border border-slate-700 rounded-lg sm:rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all cursor-pointer"
                  >
                    {ACADEMIC_LEVELS.map((lvl) => (
                      <option key={lvl} value={lvl} className="bg-slate-900 text-white">
                        {lvl}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Passport / National ID */}
                <div className="sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5">
                    رقم الهوية / جواز السفر / الرقم الوطني: <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="passportOrNationalId"
                    required
                    placeholder="مثال: P01234567 أو الرقم الوطني"
                    value={formData.passportOrNationalId}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 sm:py-3 bg-slate-900/90 border border-slate-700 rounded-lg sm:rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Document Upload */}
            <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-colors hover:border-slate-600">
              <div className="flex items-center gap-2.5 pb-3.5 mb-4 sm:mb-6 border-b border-slate-700/60">
                <CreditCard className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <h2 className="text-sm sm:text-base md:text-lg font-bold text-white">
                  القسم الرابع: رفع إثبات الشخصية / الهوية الجامعية
                </h2>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                  صورة إثبات الهوية (جواز السفر / البطاقة الوطنية / بطاقة الكلية):
                </label>
                <div className="border-2 border-dashed border-slate-700 hover:border-amber-500/50 rounded-xl sm:rounded-2xl p-6 text-center bg-slate-900/80 transition-all cursor-pointer group">
                  <input
                    type="file"
                    id="idUpload"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label htmlFor="idUpload" className="cursor-pointer flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-white">
                      انقر هنا لرفع صورة الوثيقة أو اسحب الملف
                    </span>
                    <span className="text-[11px] sm:text-xs text-slate-400">
                      الصيغ المقبولة: JPG, PNG, WEBP (الحد الأقصى: 5MB)
                    </span>
                  </label>

                  {idPreview && (
                    <div className="mt-4 pt-4 border-t border-slate-700/60 flex flex-col items-center gap-2 animate-fadeIn">
                      <img
                        src={idPreview}
                        alt="ID Preview"
                        className="max-w-[220px] max-h-[130px] object-contain rounded-lg border border-emerald-500/60 shadow-md"
                      />
                      <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle size={14} /> تم تجهيز صورة الهوية للاعتماد
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submission Declaration & Submit Button */}
            <div className="pt-2 text-center space-y-4">
              <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed max-w-xl mx-auto">
                بالنقر على "إرسال استمارة التسجيل المركزي"، أقر بأن جميع البيانات المدخلة صحيحة ومطابقة لوثائقي الرسمية بكلية العلوم جامعة القاهرة.
              </p>

              <button
                type="submit"
                disabled={loading || isSuccess}
                className="w-full sm:w-auto min-w-[280px] sm:min-w-[340px] px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-[0.98] text-slate-950 font-black text-sm sm:text-base rounded-xl shadow-lg shadow-amber-500/25 transition-all duration-200 inline-flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>جاري إرسال الاستمارة والاعتماد...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    <span>إرسال استمارة التسجيل المركزي (Submit Registration)</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer Login Link */}
          <div className="text-center pt-6 mt-6 border-t border-slate-800 text-xs sm:text-sm text-slate-400">
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
    </div>
  );
}