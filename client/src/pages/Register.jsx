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
  Info,
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

  return (
    <div className="min-h-screen w-full bg-[#070b12] text-slate-100 flex flex-col justify-between relative overflow-hidden py-10 px-4 sm:px-6 lg:px-8 selection:bg-amber-500/30 selection:text-amber-200" style={{ direction: 'rtl' }}>
      {/* Background Decorative Gradient Orbs */}
      <div className="absolute -top-40 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -left-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl mx-auto relative z-10">

        {/* Top Header & Branding */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 border border-amber-500/30 text-amber-400 mb-4 shadow-lg shadow-amber-500/5 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>رابطة الطلاب السودانيين - كلية العلوم جامعة القاهرة</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-3">
            استمارة التسجيل المركزي واستبيان الطلاب
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            يرجى استيفاء البيانات الشخصية والأكاديمية بدقة لاعتماد القيد وإصدار بطاقة العضوية الرقمية (Digital ID) الخاصة بك.
          </p>

          {/* Quick Steps Visual Indicator */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-right">
              <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                1
              </div>
              <span className="text-[11px] font-medium text-slate-300 truncate">البيانات الشخصية</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-right">
              <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                2
              </div>
              <span className="text-[11px] font-medium text-slate-300 truncate">طوارئ السكن</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-right">
              <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                3
              </div>
              <span className="text-[11px] font-medium text-slate-300 truncate">القيد الأكاديمي</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-right">
              <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                4
              </div>
              <span className="text-[11px] font-medium text-slate-300 truncate">إثبات الهوية</span>
            </div>
          </div>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="mb-6 w-full p-4 bg-red-950/40 border border-red-500/40 rounded-2xl text-red-200 flex items-start sm:items-center gap-3.5 text-sm font-medium backdrop-blur-md shadow-lg shadow-red-950/30 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="p-1.5 bg-red-500/20 rounded-lg text-red-400 flex-shrink-0 mt-0.5 sm:mt-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <span className="leading-relaxed text-right flex-1">{error}</span>
          </div>
        )}

        {/* Global Success Banner */}
        {isSuccess && (
          <div className="mb-6 w-full p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl text-emerald-200 flex items-start sm:items-center gap-3.5 text-sm font-medium backdrop-blur-md shadow-lg shadow-emerald-950/30 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="p-1.5 bg-emerald-500/20 rounded-lg text-emerald-400 flex-shrink-0 mt-0.5 sm:mt-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className="text-right flex-1">
              تم استلام استمارة التسجيل بنجاح! حسابك قيد التدقيق والمراجعة، جاري توجيهك الآن...
            </span>
          </div>
        )}

        {/* Main Form Container */}
        <form onSubmit={handleSubmit} className="w-full space-y-6 sm:space-y-8">

          {/* ========================================================================= */}
          {/* SECTION 1: البيانات الشخصية وبيانات السكن بمصر */}
          {/* ========================================================================= */}
          <div className="w-full bg-[#0d1422]/90 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-5 sm:p-7 shadow-xl shadow-black/40 backdrop-blur-xl transition-all duration-300">
            
            {/* Card Header */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-inner">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white">القسم الأول: البيانات الشخصية والسكن</h2>
                  <p className="text-xs text-slate-400">معلومات الهوية الأساسية وعنوان الإقامة في جمهورية مصر العربية</p>
                </div>
              </div>
              <span className="hidden sm:inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-amber-400 border border-slate-700">
                1 / 4
              </span>
            </div>

            {/* 2-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">

              {/* Full Name */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-300 mb-2 text-right">
                  الاسم رباعي كما هو مدون في الجواز أو الهوية الرسمية <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="مثال: مصعب طارق محمد عثمان"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full block px-4 py-3 bg-[#060a12] border border-slate-700/70 focus:border-amber-500 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-sm transition-all duration-200 text-right"
                  />
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* Age */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 text-right">
                  العمر / سنة الميلاد <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="age"
                    min="16"
                    max="65"
                    required
                    placeholder="20"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full block px-4 py-3 bg-[#060a12] border border-slate-700/70 focus:border-amber-500 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-sm transition-all duration-200 text-right"
                  />
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 text-right">
                  البريد الإلكتروني الأساسي <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="student@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full block px-4 py-3 bg-[#060a12] border border-slate-700/70 focus:border-amber-500 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-sm transition-all duration-200 text-right"
                  />
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 text-right">
                  رقم الهاتف المصري <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="010XXXXXXXX"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full block px-4 py-3 bg-[#060a12] border border-slate-700/70 focus:border-amber-500 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-sm transition-all duration-200 text-right"
                  />
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 text-right">
                  رقم الواتساب للتواصل <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="whatsapp"
                    required
                    placeholder="010XXXXXXXX أو +249..."
                    value={formData.whatsapp}
                    onChange={handleChange}
                    className="w-full block px-4 py-3 bg-[#060a12] border border-slate-700/70 focus:border-amber-500 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-sm transition-all duration-200 text-right"
                  />
                  <MessageCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* Cairo Address */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-300 mb-2 text-right">
                  مكان وعنوان السكن بمصر بالتفصيل <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="cairoAddress"
                    required
                    placeholder="مثال: الجيزة - بين السرايات / الدقي / فيصل / مدينة نصر"
                    value={formData.cairoAddress}
                    onChange={handleChange}
                    className="w-full block px-4 py-3 bg-[#060a12] border border-slate-700/70 focus:border-amber-500 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-sm transition-all duration-200 text-right"
                  />
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 text-right">
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
                    className="w-full block pl-10 pr-4 py-3 bg-[#060a12] border border-slate-700/70 focus:border-amber-500 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-sm transition-all duration-200 text-right"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400 transition-colors p-1"
                    aria-label="تبديل إظهار كلمة المرور"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 text-right">
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
                    className="w-full block pl-10 pr-4 py-3 bg-[#060a12] border border-slate-700/70 focus:border-amber-500 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-sm transition-all duration-200 text-right"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400 transition-colors p-1"
                    aria-label="تبديل إظهار تأكيد كلمة المرور"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 2: بيانات جهة الاتصال في حالات الطوارئ */}
          {/* ========================================================================= */}
          <div className="w-full bg-[#0d1422]/90 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-5 sm:p-7 shadow-xl shadow-black/40 backdrop-blur-xl transition-all duration-300">
            
            {/* Card Header */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-inner">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white">القسم الثاني: بيانات الاتصال في حالات الطوارئ</h2>
                  <p className="text-xs text-slate-400">للتواصل مع الأهل أو الأقارب عند الحاجة الماسة أو الطوارئ الطبية</p>
                </div>
              </div>
              <span className="hidden sm:inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-amber-400 border border-slate-700">
                2 / 4
              </span>
            </div>

            {/* 2-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">

              {/* Emergency Contact Name */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 text-right">
                  اسم ولي الأمر / جهة الاتصال للطوارئ <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="emergencyContactName"
                    required
                    placeholder="اسم القريب أو الصديق بمصر أو السودان"
                    value={formData.emergencyContactName}
                    onChange={handleChange}
                    className="w-full block px-4 py-3 bg-[#060a12] border border-slate-700/70 focus:border-amber-500 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-sm transition-all duration-200 text-right"
                  />
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* Emergency Contact Relation */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 text-right">
                  صلة القرابة <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <select
                    name="emergencyContactRelation"
                    value={formData.emergencyContactRelation}
                    onChange={handleChange}
                    className="w-full block px-4 py-3 bg-[#060a12] border border-slate-700/70 focus:border-amber-500 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-sm transition-all duration-200 text-right appearance-none cursor-pointer"
                  >
                    <option value="الوالد / الوالدة" className="bg-[#0b1622] text-white">الوالد / الوالدة</option>
                    <option value="أخ / أخت" className="bg-[#0b1622] text-white">أخ / أخت</option>
                    <option value="عم / خال / قريب" className="bg-[#0b1622] text-white">عم / خال / قريب</option>
                    <option value="صديق / زميل سكن" className="bg-[#0b1622] text-white">صديق / زميل سكن</option>
                  </select>
                  <ChevronDown className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Emergency Contact Phone */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-300 mb-2 text-right">
                  رقم هاتف الطوارئ مع رمز الدولة <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="emergencyContactPhone"
                    required
                    placeholder="مثال: +2010... أو +2499..."
                    value={formData.emergencyContactPhone}
                    onChange={handleChange}
                    className="w-full block px-4 py-3 bg-[#060a12] border border-slate-700/70 focus:border-amber-500 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-sm transition-all duration-200 text-right"
                  />
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>

            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 3: البيانات الأكاديمية بكلية العلوم */}
          {/* ========================================================================= */}
          <div className="w-full bg-[#0d1422]/90 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-5 sm:p-7 shadow-xl shadow-black/40 backdrop-blur-xl transition-all duration-300">
            
            {/* Card Header */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-inner">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white">القسم الثالث: البيانات الأكاديمية بالكلية</h2>
                  <p className="text-xs text-slate-400">التخصص، المستوى الدراسي، ورقم الهوية أو الجواز</p>
                </div>
              </div>
              <span className="hidden sm:inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-amber-400 border border-slate-700">
                3 / 4
              </span>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">

              {/* Department */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-300 mb-2 text-right">
                  القسم العلمي / التخصص الأكاديمي <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full block px-4 py-3 bg-[#060a12] border border-amber-500/50 focus:border-amber-400 rounded-xl text-amber-300 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/25 text-sm transition-all duration-200 text-right appearance-none cursor-pointer"
                  >
                    {CAIRO_UNIV_DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept} className="bg-[#0b1622] text-white font-normal">
                        {dept}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400 pointer-events-none" />
                </div>
              </div>

              {/* Academic Level */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 text-right">
                  الفرقة / المستوى الدراسي <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <select
                    name="academicLevel"
                    value={formData.academicLevel}
                    onChange={handleChange}
                    className="w-full block px-4 py-3 bg-[#060a12] border border-slate-700/70 focus:border-amber-500 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-sm transition-all duration-200 text-right appearance-none cursor-pointer"
                  >
                    {ACADEMIC_LEVELS.map((lvl) => (
                      <option key={lvl} value={lvl} className="bg-[#0b1622] text-white">
                        {lvl}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Passport / National ID */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 text-right">
                  رقم جواز السفر / الرقم الوطني / بطاقة الكلية <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="passportOrNationalId"
                    required
                    placeholder="مثال: P01234567 أو الرقم الوطني"
                    value={formData.passportOrNationalId}
                    onChange={handleChange}
                    className="w-full block px-4 py-3 bg-[#060a12] border border-slate-700/70 focus:border-amber-500 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-sm transition-all duration-200 text-right"
                  />
                  <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>

            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 4: رفع إثبات الشخصية / الهوية الجامعية */}
          {/* ========================================================================= */}
          <div className="w-full bg-[#0d1422]/90 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-5 sm:p-7 shadow-xl shadow-black/40 backdrop-blur-xl transition-all duration-300">
            
            {/* Card Header */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-inner">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white">القسم الرابع: وثيقة إثبات الشخصية</h2>
                  <p className="text-xs text-slate-400">إرفاق صورة ضوئية واضحة من جواز السفر أو البطاقة الجامعية</p>
                </div>
              </div>
              <span className="hidden sm:inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-amber-400 border border-slate-700">
                4 / 4
              </span>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2.5 text-right">
                صورة إثبات الهوية (جواز السفر / البطاقة الوطنية / بطاقة الكلية)
              </label>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`w-full relative border-2 border-dashed rounded-2xl p-6 sm:p-10 text-center transition-all duration-300 ${
                  isDragging
                    ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
                    : 'border-slate-700/80 bg-[#060a12]/80 hover:border-amber-500/60 hover:bg-[#060a12]'
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
                  <label htmlFor="idUpload" className="cursor-pointer flex flex-col items-center gap-3.5">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/5 group-hover:scale-105 transition-transform duration-200">
                      <Upload className="w-8 h-8" />
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-sm sm:text-base font-bold text-white">
                        اسحب الملف وأفلته هنا، أو <span className="text-amber-400 underline underline-offset-4 hover:text-amber-300">تصفح من جهازك</span>
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
          {/* SUBMIT ACTION AREA */}
          {/* ========================================================================= */}
          <div className="pt-4 space-y-4 text-center w-full">
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed bg-slate-900/50 p-3 rounded-xl border border-slate-800">
              <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>
                بالنقر على "إرسال استمارة التسجيل المركزي"، أقر بأن كافة البيانات المدخلة صحيحة ومطابقة لوثائقي الرسمية بكلية العلوم جامعة القاهرة.
              </span>
            </div>

            <div className="flex justify-center w-full pt-2">
              <button
                type="submit"
                disabled={loading || isSuccess}
                className="w-full sm:w-2/3 md:w-1/2 py-4 px-8 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-base sm:text-lg rounded-2xl shadow-xl shadow-amber-500/20 hover:shadow-amber-500/35 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 active:scale-[0.99] cursor-pointer inline-flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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

        {/* Footer Login Redirection */}
        <div className="w-full text-center mt-10 pt-6 border-t border-slate-800/80 text-xs sm:text-sm text-slate-400">
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