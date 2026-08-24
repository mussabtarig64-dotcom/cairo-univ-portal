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

  const inputStyleClass =
    'w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500';

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 flex justify-center items-center" style={{ direction: 'rtl' }}>
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl text-white">
        
        {/* Badge & Header */}
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-3">
            كلية العلوم جامعة القاهرة - SSA
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">استمارة التسجيل المركزي واستبيان الطلاب</h1>
          <p className="text-sm text-slate-400">يرجى استيفاء البيانات بدقة لاعتماد القيد وإصدار بطاقة العضوية الرقمية (Digital ID).</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/15 border border-red-500/40 rounded-xl text-red-300 flex items-center gap-3 text-sm font-medium">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isSuccess && (
          <div className="mb-6 p-4 bg-emerald-500/15 border border-emerald-500/40 rounded-xl text-emerald-300 flex items-center gap-3 text-sm font-medium">
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>تم استلام طلب التسجيل بنجاح! حسابك قيد المراجعة، جاري التحويل...</span>
          </div>
        )}

        {/* Form Sections inside dark cards */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* القسم الأول: البيانات الشخصية والسكن بمصر */}
          <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-amber-400 font-bold text-base">
              <User className="w-5 h-5" />
              <span>القسم الأول: البيانات الشخصية والسكن بمصر</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  الاسم رباعي كما في الجواز / الهوية: <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="مثال: مصعب طارق محمد عثمان"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={inputStyleClass}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
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
                  className={inputStyleClass}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  البريد الإلكتروني الأساسي: <span className="text-amber-400">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="student@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputStyleClass}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  رقم الهاتف المصري: <span className="text-amber-400">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="010XXXXXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  className={inputStyleClass}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  رقم الواتساب: <span className="text-amber-400">*</span>
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  required
                  placeholder="010XXXXXXXX أو +249..."
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className={inputStyleClass}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  مكان وعنوان السكن بالتفصيل بمصر: <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  name="cairoAddress"
                  required
                  placeholder="مثال: الجيزة - بين السرايات / الدقي / فيصل"
                  value={formData.cairoAddress}
                  onChange={handleChange}
                  className={inputStyleClass}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
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
                    className={`${inputStyleClass} pl-10`}
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

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  تأكيد كلمة المرور: <span className="text-amber-400">*</span>
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={inputStyleClass}
                />
              </div>
            </div>
          </div>

          {/* القسم الثاني: بيانات جهة الاتصال في حالات الطوارئ */}
          <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-amber-400 font-bold text-base">
              <HeartHandshake className="w-5 h-5" />
              <span>القسم الثاني: بيانات جهة الاتصال في حالات الطوارئ</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  اسم جهة الاتصال / ولي الأمر للطوارئ: <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  name="emergencyContactName"
                  required
                  placeholder="اسم القريب أو الصديق بمصر أو السودان"
                  value={formData.emergencyContactName}
                  onChange={handleChange}
                  className={inputStyleClass}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  صلة القرابة: <span className="text-amber-400">*</span>
                </label>
                <select
                  name="emergencyContactRelation"
                  value={formData.emergencyContactRelation}
                  onChange={handleChange}
                  className={`${inputStyleClass} cursor-pointer`}
                >
                  <option value="الوالد / الوالدة" className="bg-slate-900 text-white">الوالد / الوالدة</option>
                  <option value="أخ / أخت" className="bg-slate-900 text-white">أخ / أخت</option>
                  <option value="عم / خال / قريب" className="bg-slate-900 text-white">عم / خال / قريب</option>
                  <option value="صديق / زميل سكن" className="bg-slate-900 text-white">صديق / زميل سكن</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  رقم هاتف الطوارئ: <span className="text-amber-400">*</span>
                </label>
                <input
                  type="tel"
                  name="emergencyContactPhone"
                  required
                  placeholder="رقم الهاتف مع رمز الدولة (مثال: +20... أو +249...)"
                  value={formData.emergencyContactPhone}
                  onChange={handleChange}
                  className={inputStyleClass}
                />
              </div>
            </div>
          </div>

          {/* القسم الثالث: البيانات الأكاديمية بكلية العلوم */}
          <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-amber-400 font-bold text-base">
              <GraduationCap className="w-5 h-5" />
              <span>القسم الثالث: البيانات الأكاديمية بكلية العلوم</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  القسم العلمي / التخصص الأكاديمي: <span className="text-amber-400">*</span>
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className={`${inputStyleClass} border-amber-500/40 text-amber-300 font-bold cursor-pointer`}
                >
                  {CAIRO_UNIV_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept} className="bg-slate-900 text-white font-normal">
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  الفرقة / المستوى الدراسي: <span className="text-amber-400">*</span>
                </label>
                <select
                  name="academicLevel"
                  value={formData.academicLevel}
                  onChange={handleChange}
                  className={`${inputStyleClass} cursor-pointer`}
                >
                  {ACADEMIC_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl} className="bg-slate-900 text-white">
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  رقم جواز السفر / الرقم الوطني / بطاقة الكلية: <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  name="passportOrNationalId"
                  required
                  placeholder="مثال: P01234567 أو الرقم الوطني"
                  value={formData.passportOrNationalId}
                  onChange={handleChange}
                  className={inputStyleClass}
                />
              </div>
            </div>
          </div>

          {/* القسم الرابع: رفع إثبات الشخصية / الهوية الجامعية */}
          <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-amber-400 font-bold text-base">
              <CreditCard className="w-5 h-5" />
              <span>القسم الرابع: رفع إثبات الشخصية / الهوية الجامعية</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                صورة إثبات الهوية (جواز السفر / البطاقة الوطنية / بطاقة الكلية):
              </label>

              <div className="border-2 border-dashed border-slate-700 hover:border-amber-500/60 rounded-xl p-6 text-center bg-slate-900/60 transition-all cursor-pointer group">
                <input
                  type="file"
                  id="idUpload"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label htmlFor="idUpload" className="cursor-pointer flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-semibold text-white">
                    انقر هنا لرفع صورة الوثيقة أو اسحب الملف
                  </span>
                  <span className="text-xs text-slate-400">
                    الصيغ المقبولة: JPG, PNG, WEBP (الحد الأقصى: 5MB)
                  </span>
                </label>

                {idPreview && (
                  <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col items-center gap-2">
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

          {/* Submit Button & Declaration */}
          <div className="text-center pt-2 space-y-4">
            <p className="text-xs text-slate-400 leading-relaxed">
              بالنقر على "إرسال استمارة التسجيل المركزي"، أقر بأن جميع البيانات المدخلة صحيحة ومطابقة لوثائقي الرسمية بكلية العلوم جامعة القاهرة.
            </p>

            <button
              type="submit"
              disabled={loading || isSuccess}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-lg rounded-xl shadow-lg transition-all transform active:scale-[0.99] cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
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

        {/* Footer Login Link */}
        <div className="text-center mt-8 pt-6 border-t border-slate-800 text-sm text-slate-400">
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