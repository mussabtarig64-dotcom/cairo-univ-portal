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

  const inputClass = "w-full block px-4 py-3 bg-[#060b13] border border-slate-700/60 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all duration-200 text-sm text-right mt-1.5";
  const labelClass = "block w-full text-right text-xs font-semibold text-slate-300";
  const cardClass = "bg-[#0d1522] border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-xl";

  return (
    <div className="min-h-screen w-full flex flex-col py-10 px-4 sm:px-6 lg:px-8 bg-[#090d16]" style={{ direction: 'rtl' }}>
      <div className="w-full max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center w-full mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-4">
            <Sparkles className="w-4 h-4" />
            <span>رابطة الطلاب السودانيين - كلية العلوم جامعة القاهرة</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            استمارة التسجيل المركزي
          </h1>
          <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            يرجى استيفاء البيانات بدقة لاعتماد القيد الأكاديمي وإصدار بطاقة العضوية الرقمية.
          </p>
        </div>

        {error && (
          <div className="mb-6 w-full p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 flex items-center gap-3 text-sm font-medium">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isSuccess && (
          <div className="mb-6 w-full p-4 bg-emerald-500/10 border border-emerald-500/50 rounded-xl text-emerald-400 flex items-center gap-3 text-sm font-medium">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span>تم استلام طلب التسجيل بنجاح! جاري التحويل...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-6">

          {/* Card 1 */}
          <div className={cardClass}>
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                <User className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white">البيانات الشخصية والسكن</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className={labelClass}>الاسم رباعي كما في الجواز / الهوية <span className="text-amber-400">*</span></label>
                <input type="text" name="fullName" required placeholder="مثال: مصعب طارق محمد عثمان" value={formData.fullName} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>العمر / سنة الميلاد <span className="text-amber-400">*</span></label>
                <input type="number" name="age" min="16" max="65" required placeholder="20" value={formData.age} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>البريد الإلكتروني <span className="text-amber-400">*</span></label>
                <input type="email" name="email" required placeholder="student@example.com" value={formData.email} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>رقم الهاتف المصري <span className="text-amber-400">*</span></label>
                <input type="tel" name="phone" required placeholder="010XXXXXXXX" value={formData.phone} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>رقم الواتساب <span className="text-amber-400">*</span></label>
                <input type="tel" name="whatsapp" required placeholder="010XXXXXXXX أو +249..." value={formData.whatsapp} onChange={handleChange} className={inputClass} />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>مكان وعنوان السكن بالتفصيل <span className="text-amber-400">*</span></label>
                <input type="text" name="cairoAddress" required placeholder="مثال: الجيزة - الدقي / فيصل" value={formData.cairoAddress} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>كلمة المرور <span className="text-amber-400">*</span></label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} name="password" required placeholder="••••••••" value={formData.password} onChange={handleChange} className={`${inputClass} pl-11`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400 p-1">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className={labelClass}>تأكيد كلمة المرور <span className="text-amber-400">*</span></label>
                <div className="relative">
                  <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" required placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} className={`${inputClass} pl-11`} />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400 p-1">
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className={cardClass}>
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white">بيانات الطوارئ</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className={labelClass}>اسم جهة الاتصال للطوارئ <span className="text-amber-400">*</span></label>
                <input type="text" name="emergencyContactName" required placeholder="اسم القريب أو الصديق" value={formData.emergencyContactName} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>صلة القرابة <span className="text-amber-400">*</span></label>
                <select name="emergencyContactRelation" value={formData.emergencyContactRelation} onChange={handleChange} className={inputClass}>
                  <option value="الوالد / الوالدة">الوالد / الوالدة</option>
                  <option value="أخ / أخت">أخ / أخت</option>
                  <option value="عم / خال / قريب">عم / خال / قريب</option>
                  <option value="صديق / زميل سكن">صديق / زميل سكن</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>رقم هاتف الطوارئ <span className="text-amber-400">*</span></label>
                <input type="tel" name="emergencyContactPhone" required placeholder="رقم الهاتف مع رمز الدولة" value={formData.emergencyContactPhone} onChange={handleChange} className={inputClass} />
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className={cardClass}>
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white">البيانات الأكاديمية بكلية العلوم</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className={labelClass}>القسم العلمي / التخصص <span className="text-amber-400">*</span></label>
                <select name="department" value={formData.department} onChange={handleChange} className={inputClass}>
                  {CAIRO_UNIV_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>المستوى الدراسي <span className="text-amber-400">*</span></label>
                <select name="academicLevel" value={formData.academicLevel} onChange={handleChange} className={inputClass}>
                  {ACADEMIC_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>رقم جواز السفر / الرقم الوطني <span className="text-amber-400">*</span></label>
                <input type="text" name="passportOrNationalId" required placeholder="مثال: P01234567" value={formData.passportOrNationalId} onChange={handleChange} className={inputClass} />
              </div>
            </div>
          </div>

          {/* Card 4 Upload */}
          <div className={cardClass}>
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                <CreditCard className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white">رفع إثبات الشخصية</h2>
            </div>

            <div
              onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
              className={`w-full relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${isDragging ? 'border-amber-400 bg-amber-500/5' : 'border-slate-700 bg-[#060b13]/50 hover:border-amber-500/50'
                }`}
            >
              <input type="file" id="idUpload" accept="image/*" onChange={handleFileUpload} className="hidden" />

              {!idPreview ? (
                <label htmlFor="idUpload" className="cursor-pointer flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-base font-bold text-white">اسحب الصورة وأفلتها هنا، أو <span className="text-amber-400 underline">تصفح</span></p>
                    <p className="text-xs text-slate-400">JPG, PNG, WEBP (الحد الأقصى: 5MB)</p>
                  </div>
                </label>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <img src={idPreview} alt="Preview" className="h-40 rounded-lg border border-emerald-500/50 object-contain bg-black/40" />
                    <button type="button" onClick={handleRemoveFile} className="absolute -top-3 -right-3 bg-red-500 text-white p-1.5 rounded-full hover:scale-110 transition-transform">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="text-sm text-emerald-400 font-semibold flex items-center gap-2"><CheckCircle size={16} /> تم إرفاق الصورة بنجاح</p>
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 pb-8">
            <button
              type="submit"
              disabled={loading || isSuccess}
              className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-lg rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <UserPlus className="w-6 h-6" />}
              <span>إرسال استمارة التسجيل</span>
            </button>
          </div>
        </form>

        <div className="text-center mt-4 text-sm text-slate-400">
          لديك حساب بالفعل؟ <Link to="/login" className="text-amber-400 font-bold hover:underline">تسجيل الدخول</Link>
        </div>

      </div>
    </div>
  );
}