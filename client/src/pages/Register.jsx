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
  Info,
  Calendar,
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
    // 1. البيانات الشخصية وبيانات السكن بمصر
    fullName: '',
    age: '20',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    whatsapp: '',
    cairoAddress: '',

    // 2. بيانات جهة الاتصال في حالات الطوارئ
    emergencyContactName: '',
    emergencyContactRelation: 'الوالد / الوالدة',
    emergencyContactPhone: '',

    // 3. البيانات الأكاديمية بكلية العلوم
    department: 'الكيمياء (Chemistry)',
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
    <div className="w-full min-h-screen py-8 px-4 sm:px-6 lg:px-8 pb-36 text-white" style={{ direction: 'rtl' }}>
      {/* البطاقة الرئيسية الموحدة الحاوية */}
      <div className="max-w-3xl mx-auto my-10 p-6 sm:p-8 bg-[#111827]/90 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl text-white">
        
        {/* رأس الاستمارة والبادج */}
        <div className="text-center mb-8 pb-6 border-b border-slate-800">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500 text-amber-400 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold mb-3 shadow-inner">
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span>كلية العلوم جامعة القاهرة - SSA</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
            استمارة التسجيل المركزي واستبيان الطلاب
          </h1>

          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            يرجى استيفاء البيانات بدقة لاعتماد القيد وإصدار بطاقة العضوية الرقمية (Digital ID) وتمكين الوصول لكافة خدمات الرابطة والمكتبة الأكاديمية.
          </p>
        </div>

        {/* تنبيهات الخطأ والنجاح */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/15 border border-red-500/50 rounded-xl text-red-300 flex items-center gap-3 text-xs sm:text-sm font-medium">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isSuccess && (
          <div className="mb-6 p-4 bg-emerald-500/15 border border-emerald-500/50 rounded-xl text-emerald-300 flex items-center gap-3 text-xs sm:text-sm font-medium">
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>تم إرسال استمارة التسجيل المركزي بنجاح! جاري تحويلك لصفحة حالة القيد...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* =========================================================================
              القسم الأول: البيانات الشخصية وبيانات السكن بمصر
          ========================================================================= */}
          <div className="bg-[#1f2937]/50 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800 text-amber-400">
              <User className="w-5 h-5" />
              <h2 className="text-sm sm:text-base font-bold text-white">
                القسم الأول: البيانات الشخصية وبيانات السكن بمصر
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* الاسم رباعي */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  الاسم رباعي كما في الجواز / الهوية: <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="مثال: مصعب طارق محمد عثمان"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-[#1f2937] border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all"
                />
              </div>

              {/* العمر */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  العمر / سنة الميلاد: <span className="text-amber-400">*</span>
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
                  className="w-full px-4 py-2.5 rounded-lg bg-[#1f2937] border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all"
                />
              </div>

              {/* البريد الإلكتروني */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  البريد الإلكتروني الأساسي: <span className="text-amber-400">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="student@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-[#1f2937] border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all"
                />
              </div>

              {/* رقم الهاتف المصري */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  رقم الهاتف المصري: <span className="text-amber-400">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="010XXXXXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-[#1f2937] border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all"
                />
              </div>

              {/* رقم الواتساب */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  رقم الواتساب: <span className="text-amber-400">*</span>
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  required
                  placeholder="010XXXXXXXX أو +249..."
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-[#1f2937] border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all"
                />
              </div>

              {/* عنوان السكن بمصر */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  مكان وعنوان السكن بالتفصيل بمصر: <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  name="cairoAddress"
                  required
                  placeholder="مثال: الجيزة - بين السرايات / الدقي / فيصل"
                  value={formData.cairoAddress}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-[#1f2937] border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all"
                />
              </div>

              {/* كلمة المرور */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
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
                    className="w-full px-4 py-2.5 pl-10 rounded-lg bg-[#1f2937] border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* تأكيد كلمة المرور */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  تأكيد كلمة المرور: <span className="text-amber-400">*</span>
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-[#1f2937] border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* =========================================================================
              القسم الثاني: بيانات جهة الاتصال في حالات الطوارئ
          ========================================================================= */}
          <div className="bg-[#1f2937]/50 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800 text-amber-400">
              <HeartHandshake className="w-5 h-5" />
              <h2 className="text-sm sm:text-base font-bold text-white">
                القسم الثاني: بيانات جهة الاتصال في حالات الطوارئ
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* اسم جهة الاتصال */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  اسم جهة الاتصال / ولي الأمر للطوارئ: <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  name="emergencyContactName"
                  required
                  placeholder="اسم القريب أو الصديق بمصر أو السودان"
                  value={formData.emergencyContactName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-[#1f2937] border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all"
                />
              </div>

              {/* صلة القرابة */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  صلة القرابة: <span className="text-amber-400">*</span>
                </label>
                <select
                  name="emergencyContactRelation"
                  value={formData.emergencyContactRelation}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-[#1f2937] border border-slate-700 text-white text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all cursor-pointer"
                >
                  <option value="الوالد / الوالدة" className="bg-[#111827] text-white">الوالد / الوالدة</option>
                  <option value="أخ / أخت" className="bg-[#111827] text-white">أخ / أخت</option>
                  <option value="عم / خال / قريب" className="bg-[#111827] text-white">عم / خال / قريب</option>
                  <option value="صديق / زميل سكن" className="bg-[#111827] text-white">صديق / زميل سكن</option>
                </select>
              </div>

              {/* هاتف الطوارئ */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  رقم هاتف الطوارئ: <span className="text-amber-400">*</span>
                </label>
                <input
                  type="tel"
                  name="emergencyContactPhone"
                  required
                  placeholder="رقم الهاتف مع رمز الدولة (مثال: +20... أو +249...)"
                  value={formData.emergencyContactPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-[#1f2937] border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* =========================================================================
              القسم الثالث: البيانات الأكاديمية بكلية العلوم
          ========================================================================= */}
          <div className="bg-[#1f2937]/50 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800 text-amber-400">
              <GraduationCap className="w-5 h-5" />
              <h2 className="text-sm sm:text-base font-bold text-white">
                القسم الثالث: البيانات الأكاديمية بكلية العلوم
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* القسم العلمي والتخصص */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  القسم العلمي / التخصص الأكاديمي (كلية العلوم جامعة القاهرة): <span className="text-amber-400">*</span>
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-[#1f2937] border border-amber-500/50 text-amber-300 font-bold text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all cursor-pointer"
                >
                  {CAIRO_UNIV_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept} className="bg-[#111827] text-white font-normal">
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* الفرقة / المستوى الدراسي */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  الفرقة / المستوى الدراسي: <span className="text-amber-400">*</span>
                </label>
                <select
                  name="academicLevel"
                  value={formData.academicLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-[#1f2937] border border-slate-700 text-white text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all cursor-pointer"
                >
                  {ACADEMIC_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl} className="bg-[#111827] text-white">
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>

              {/* رقم الهوية / جواز السفر / الرقم الوطني */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  رقم جواز السفر / الرقم الوطني / بطاقة الكلية: <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  name="passportOrNationalId"
                  required
                  placeholder="مثال: P01234567 أو الرقم الوطني"
                  value={formData.passportOrNationalId}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-[#1f2937] border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* =========================================================================
              القسم الرابع: رفع إثبات الشخصية / الهوية الجامعية
          ========================================================================= */}
          <div className="bg-[#1f2937]/50 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800 text-amber-400">
              <CreditCard className="w-5 h-5" />
              <h2 className="text-sm sm:text-base font-bold text-white">
                القسم الرابع: رفع إثبات الشخصية / الهوية الجامعية
              </h2>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                صورة إثبات الهوية (جواز السفر / البطاقة الوطنية / بطاقة الكلية):
              </label>

              <div className="border-2 border-dashed border-slate-700 hover:border-amber-500/60 rounded-xl p-6 text-center bg-[#1f2937]/40 transition-all cursor-pointer group">
                <input
                  type="file"
                  id="idUpload"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label htmlFor="idUpload" className="cursor-pointer flex flex-col items-center gap-2.5">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-white">
                    انقر هنا لرفع صورة الوثيقة أو اسحب الملف
                  </span>
                  <span className="text-[11px] text-slate-400">
                    الصيغ المقبولة: JPG, PNG, WEBP (الحد الأقصى: 5MB)
                  </span>
                </label>

                {idPreview && (
                  <div className="mt-4 pt-4 border-t border-slate-700/60 flex flex-col items-center gap-2">
                    <img
                      src={idPreview}
                      alt="ID Preview"
                      className="max-w-[200px] max-h-[120px] object-contain rounded-lg border border-emerald-500/60 shadow-md"
                    />
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle size={14} /> تم تجهيز صورة الهوية للاعتماد
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* زر الإرسال والإقرار */}
          <div className="text-center pt-2 space-y-4">
            <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed max-w-lg mx-auto">
              بالنقر على "إرسال استمارة التسجيل المركزي"، أقر بأن جميع البيانات المدخلة صحيحة ومطابقة لوثائقي الرسمية بكلية العلوم جامعة القاهرة.
            </p>

            <button
              type="submit"
              disabled={loading || isSuccess}
              className="w-full sm:w-auto min-w-[280px] sm:min-w-[320px] px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-[0.98] text-slate-950 font-black text-sm sm:text-base rounded-xl shadow-lg shadow-amber-500/25 transition-all inline-flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>جاري إرسال الاستمارة والاعتماد...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>إرسال استمارة التسجيل المركزي (Submit)</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* تذييل رابط الدخول */}
        <div className="text-center mt-8 pt-6 border-t border-slate-800 text-xs sm:text-sm text-slate-400">
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