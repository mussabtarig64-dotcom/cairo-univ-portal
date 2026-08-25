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
  AlertCircle,
  CheckCircle,
  GraduationCap,
  HeartHandshake,
  CreditCard,
  Upload,
  Eye,
  EyeOff,
  Loader2,
  Trash2,
  Sparkles,
  ShieldCheck,
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
    'w-full bg-transparent border border-slate-700 rounded-lg px-4 py-3 text-slate-200 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-right';
  const labelClass = 'block text-xs font-medium text-slate-400 mb-2 text-right';

  return (
    <div className="w-full min-h-screen bg-[#0a101d] flex flex-col items-center justify-start py-8 px-4 sm:px-6 md:px-10 lg:px-12 overflow-x-hidden" dir="rtl">
      <div className="w-full max-w-4xl mx-auto box-border">

        {/* Page Header */}
        <div className="text-center w-full mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-3">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>رابطة الطلاب السودانيين - كلية العلوم جامعة القاهرة</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
            استمارة التسجيل المركزي واستبيان الطلاب
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto px-2 leading-relaxed">
            يرجى استيفاء البيانات بدقة لاعتماد القيد الأكاديمي وإصدار بطاقة العضوية الرقمية.
          </p>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="mb-6 w-full p-4 bg-red-500/10 border border-red-500/40 rounded-xl text-red-300 flex items-center gap-3 text-sm font-medium">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span className="text-right flex-1">{error}</span>
          </div>
        )}

        {/* Global Success Banner */}
        {isSuccess && (
          <div className="mb-6 w-full p-4 bg-emerald-500/10 border border-emerald-500/40 rounded-xl text-emerald-300 flex items-center gap-3 text-sm font-medium">
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span className="text-right flex-1">
              تم استلام استمارة التسجيل بنجاح! حسابك قيد التدقيق والمراجعة، جاري توجيهك الآن...
            </span>
          </div>
        )}

        {/* Main Omni-Device Stacked Card */}
        <form onSubmit={handleSubmit} className="w-full">
          <div className="bg-[#0B1221] border border-slate-700/60 rounded-2xl p-5 sm:p-8 md:p-10 shadow-2xl flex flex-col gap-8 w-full mx-auto box-border">

            {/* Form Fields Section */}
            <div className="w-full space-y-6">

              {/* Section 1: البيانات الشخصية والسكن */}
              <div>
                <h2 className="text-amber-400 font-semibold text-base sm:text-lg border-b border-slate-800 pb-2 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-amber-400" />
                  <span>البيانات الشخصية والسكن بمصر</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
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

                  <div className="md:col-span-2">
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
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400 p-1 transition-colors"
                        aria-label="تبديل إظهار كلمة المرور"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

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
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400 p-1 transition-colors"
                        aria-label="تبديل إظهار تأكيد كلمة المرور"
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: بيانات جهة الاتصال للطوارئ */}
              <div>
                <h2 className="text-amber-400 font-semibold text-base sm:text-lg border-b border-slate-800 pb-2 mb-4 flex items-center gap-2">
                  <HeartHandshake className="w-5 h-5 text-amber-400" />
                  <span>بيانات جهة الاتصال في حالات الطوارئ</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <label className={labelClass}>
                      اسم ولي الأمر / جهة الاتصال <span className="text-amber-400">*</span>
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

                  <div>
                    <label className={labelClass}>
                      صلة القرابة <span className="text-amber-400">*</span>
                    </label>
                    <select
                      name="emergencyContactRelation"
                      value={formData.emergencyContactRelation}
                      onChange={handleChange}
                      className={`${inputClass} bg-[#0B1221] cursor-pointer`}
                    >
                      <option value="الوالد / الوالدة" className="bg-[#0B1221]">الوالد / الوالدة</option>
                      <option value="أخ / أخت" className="bg-[#0B1221]">أخ / أخت</option>
                      <option value="عم / خال / قريب" className="bg-[#0B1221]">عم / خال / قريب</option>
                      <option value="صديق / زميل سكن" className="bg-[#0B1221]">صديق / زميل سكن</option>
                    </select>
                  </div>

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

              {/* Section 3: البيانات الأكاديمية */}
              <div>
                <h2 className="text-amber-400 font-semibold text-base sm:text-lg border-b border-slate-800 pb-2 mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-amber-400" />
                  <span>البيانات الأكاديمية بكلية العلوم</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="md:col-span-2">
                    <label className={labelClass}>
                      القسم العلمي / التخصص الأكاديمي <span className="text-amber-400">*</span>
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className={`${inputClass} bg-[#0B1221] border-amber-500/50 text-amber-300 font-medium cursor-pointer`}
                    >
                      {CAIRO_UNIV_DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept} className="bg-[#0B1221] text-white">
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>
                      الفرقة / المستوى الدراسي <span className="text-amber-400">*</span>
                    </label>
                    <select
                      name="academicLevel"
                      value={formData.academicLevel}
                      onChange={handleChange}
                      className={`${inputClass} bg-[#0B1221] cursor-pointer`}
                    >
                      {ACADEMIC_LEVELS.map((lvl) => (
                        <option key={lvl} value={lvl} className="bg-[#0B1221] text-white">
                          {lvl}
                        </option>
                      ))}
                    </select>
                  </div>

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

            </div>

            {/* Divider */}
            <div className="border-t border-slate-800 my-1"></div>

            {/* Upload & Submit Section */}
            <div className="w-full flex flex-col gap-6">

              <div>
                <h2 className="text-amber-400 font-semibold text-base sm:text-lg border-b border-slate-800 pb-2 mb-3 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-400" />
                  <span>وثيقة إثبات الشخصية</span>
                </h2>

                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  يرجى إرفاق صورة ضوئية واضحة من جواز السفر، الرقم الوطني، أو بطاقة الكلية.
                </p>

                {/* Upload Box */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed border-amber-500/50 bg-amber-500/5 hover:bg-amber-500/10 rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center text-center cursor-pointer min-h-[180px] transition-all relative box-border ${isDragging ? 'border-amber-400 bg-amber-500/15 scale-[1.01]' : ''
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
                    <label htmlFor="idUpload" className="cursor-pointer flex flex-col items-center gap-3 w-full">
                      <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
                        <Upload className="w-6 h-6 text-amber-400" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs sm:text-sm font-bold text-white">
                          اسحب الملف هنا، أو <span className="text-amber-400 underline underline-offset-4">تصفح</span>
                        </p>
                        <p className="text-[10px] sm:text-[11px] text-slate-400">JPG, PNG, WEBP (الحد الأقصى: 5MB)</p>
                      </div>
                    </label>
                  ) : (
                    <div className="flex flex-col items-center gap-3 w-full">
                      <div className="relative">
                        <img
                          src={idPreview}
                          alt="معاينة إثبات الهوية"
                          className="h-32 sm:h-36 max-w-full rounded-lg border border-emerald-500/50 object-contain bg-black/50 p-1"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="absolute -top-2.5 -right-2.5 bg-red-600 hover:bg-red-500 text-white p-1.5 rounded-full shadow-md transition-transform hover:scale-110"
                          title="حذف الصورة"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                        <CheckCircle size={14} />
                        <span className="truncate max-w-[200px]">{fileName || 'تم إرفاق الصورة بنجاح'}</span>
                      </div>
                      <label
                        htmlFor="idUpload"
                        className="text-xs text-slate-400 hover:text-amber-400 underline cursor-pointer"
                      >
                        تغيير الصورة
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Action Area */}
              <div>
                <div className="flex items-start gap-2 p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-[11px] text-slate-400 leading-relaxed">
                  <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>
                    أقر بأن جميع البيانات المدخلة صحيحة ومطابقة لوثائقي الرسمية بكلية العلوم جامعة القاهرة.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading || isSuccess}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-900 font-bold text-base sm:text-lg rounded-xl py-3.5 sm:py-4 mt-5 shadow-lg shadow-amber-500/20 transition-all duration-200 flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-slate-900" />
                      <span>جاري الإرسال...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5 text-slate-900" />
                      <span>إرسال استمارة التسجيل</span>
                    </>
                  )}
                </button>

                <div className="text-center mt-4 text-xs text-slate-400">
                  لديك حساب مسجل بالفعل؟{' '}
                  <Link to="/login" className="text-amber-400 font-bold hover:underline underline-offset-4">
                    تسجيل الدخول
                  </Link>
                </div>
              </div>

            </div>

          </div>
        </form>

      </div>
    </div>
  );
}