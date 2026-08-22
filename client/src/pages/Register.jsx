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
  EyeOff
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
        studentId: passportOrNationalId.trim(),
        academicId: passportOrNationalId.trim(),
        passportOrNationalId: passportOrNationalId.trim(),
        nationalId: passportOrNationalId.trim(),
        idCardUrl: formData.idCardUrl || '',
        idDocument: formData.idCardUrl || '',
        nationalIdPhoto: formData.idCardUrl || '',
      };

      // استخدام نقطة نهاية معتمدة وموحدة مع مراعاة بيئة التشغيل
      const targetEndpoint = `${API_BASE}/auth/register`;
      let resData = null;

      try {
        const response = await axios.post(targetEndpoint, payload, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });
        resData = response.data;
      } catch (postErr) {
        // إذا حدث خطأ في المسار الرئيسي، يتم تجربة دالة AuthContext الاحتياطية
        const authRes = await register(payload);
        if (authRes && authRes.success) {
          resData = authRes;
        } else {
          throw postErr;
        }
      }

      if (resData && (resData.success || resData.user)) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/pending-approval');
        }, 1500);
      } else {
        setError(resData?.message || 'حدث خطأ أثناء إرسال الاستمارة.');
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
    <div
      className="register-page-container px-3 sm:px-4 pb-36"
      style={{
        maxWidth: '840px',
        margin: '20px auto 40px',
        paddingLeft: '14px',
        paddingRight: '14px',
        paddingBottom: '144px', // pb-36: مساحة سفلية مريحة جداً للتصفح ومنع تداخل الويدجت
        direction: 'rtl',
        boxSizing: 'border-box',
        overflowX: 'hidden',
      }}
    >
      {/* بطاقة الاستمارة الرئيسية */}
      <div
        style={{
          backgroundColor: '#0f172a',
          borderRadius: '24px',
          border: '1px solid #334155',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.55)',
          overflow: 'hidden',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* رأس الاستمارة الترحيبي */}
        <div
          style={{
            background: 'linear-gradient(135deg, #091a2f 0%, #0f2744 50%, #16365c 100%)',
            padding: '32px 20px',
            textAlign: 'center',
            borderBottom: '1px solid #334155',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid #f59e0b',
              padding: '6px 18px',
              borderRadius: '30px',
              color: '#fbbf24',
              fontSize: '13px',
              fontWeight: 'bold',
              marginBottom: '12px',
            }}
          >
            <GraduationCap size={16} />
            <span>كلية العلوم جامعة القاهرة - SSA</span>
          </div>

          <h1 style={{ color: '#ffffff', fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: '900', margin: '0 0 10px' }}>
            استمارة التسجيل المركزي واستبيان الطلاب
          </h1>

          <p style={{ color: '#cbd5e1', fontSize: '13.5px', maxWidth: '640px', margin: '0 auto', lineHeight: '1.7' }}>
            يرجى استيفاء البيانات بدقة لاعتماد القيد وإصدار بطاقة العضوية الرقمية (Digital ID) وتمكين الوصول لكافة خدمات الرابطة والمكتبة الأكاديمية.
          </p>
        </div>

        <div style={{ padding: '24px 18px' }} className="form-content-padding">
          {error && (
            <div
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid #ef4444',
                color: '#f87171',
                padding: '14px 18px',
                borderRadius: '12px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {isSuccess && (
            <div
              style={{
                backgroundColor: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid #22c55e',
                color: '#34d399',
                padding: '16px 20px',
                borderRadius: '12px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '15px',
                fontWeight: 'bold',
              }}
            >
              <CheckCircle size={20} />
              <span>تم إرسال استمارة التسجيل المركزي بنجاح! جاري تحويلك لصفحة حالة القيد...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* =========================================================================
                1. البيانات الشخصية وبيانات السكن بمصر
            ========================================================================= */}
            <div style={sectionBoxStyle}>
              <div style={sectionHeaderStyle}>
                <User size={18} color="#f59e0b" />
                <h3 style={sectionTitleStyle}>القسم الأول: البيانات الشخصية وبيانات السكن بمصر</h3>
              </div>

              {/* Grid: 1 column on xs/sm, 2 columns on md+ */}
              <div className="register-form-grid">
                {/* الاسم رباعي */}
                <div>
                  <label style={labelStyle}>الاسم رباعي كما في الجواز/الهوية: *</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="مثال: مصعب طارق محمد عثمان"
                    value={formData.fullName}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>

                {/* العمر */}
                <div>
                  <label style={labelStyle}>العمر / سنة الميلاد: *</label>
                  <input
                    type="number"
                    name="age"
                    min="16"
                    max="60"
                    required
                    placeholder="20"
                    value={formData.age}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>

                {/* البريد الإلكتروني */}
                <div>
                  <label style={labelStyle}>البريد الإلكتروني الأساسي: *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="student@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>

                {/* الهاتف المصري */}
                <div>
                  <label style={labelStyle}>رقم الهاتف المصري: *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="010XXXXXXXX"
                    value={formData.phone}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>

                {/* رقم الواتساب */}
                <div>
                  <label style={labelStyle}>رقم الواتساب (للتواصل والإشعارات): *</label>
                  <input
                    type="tel"
                    name="whatsapp"
                    required
                    placeholder="010XXXXXXXX أو +249..."
                    value={formData.whatsapp}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>

                {/* عنوان السكن بالتفصيل بمصر */}
                <div>
                  <label style={labelStyle}>مكان وعنوان السكن بالتفصيل بمصر: *</label>
                  <input
                    type="text"
                    name="cairoAddress"
                    required
                    placeholder="مثال: الجيزة - بين السرايات / الدقي / فيصل"
                    value={formData.cairoAddress}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>

                {/* كلمة المرور */}
                <div>
                  <label style={labelStyle}>كلمة المرور للحساب: *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      style={inputStyle}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '12px',
                        background: 'transparent',
                        border: 'none',
                        color: '#94a3b8',
                        cursor: 'pointer',
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* تأكيد كلمة المرور */}
                <div>
                  <label style={labelStyle}>تأكيد كلمة المرور: *</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* =========================================================================
                2. بيانات جهة الاتصال في حالات الطوارئ
            ========================================================================= */}
            <div style={sectionBoxStyle}>
              <div style={sectionHeaderStyle}>
                <HeartHandshake size={18} color="#f59e0b" />
                <h3 style={sectionTitleStyle}>القسم الثاني: بيانات جهة الاتصال في حالات الطوارئ</h3>
              </div>

              {/* Grid: 1 column on xs/sm, 2 columns on md+ */}
              <div className="register-form-grid">
                {/* اسم الشخص للطوارئ */}
                <div>
                  <label style={labelStyle}>اسم جهة الاتصال / ولي الأمر للطوارئ: *</label>
                  <input
                    type="text"
                    name="emergencyContactName"
                    required
                    placeholder="اسم القريب أو الصديق بمصر أو السودان"
                    value={formData.emergencyContactName}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>

                {/* صلة القرابة */}
                <div>
                  <label style={labelStyle}>صلة القرابة: *</label>
                  <select
                    name="emergencyContactRelation"
                    value={formData.emergencyContactRelation}
                    onChange={handleChange}
                    style={inputStyle}
                  >
                    <option value="الوالد / الوالدة" style={{ background: '#0f172a' }}>الوالد / الوالدة</option>
                    <option value="أخ / أخت" style={{ background: '#0f172a' }}>أخ / أخت</option>
                    <option value="عم / خال / قريب" style={{ background: '#0f172a' }}>عم / خال / قريب</option>
                    <option value="صديق / زميل سكن" style={{ background: '#0f172a' }}>صديق / زميل سكن</option>
                  </select>
                </div>

                {/* رقم هاتف الطوارئ */}
                <div className="md:col-span-2">
                  <label style={labelStyle}>رقم هاتف الطوارئ: *</label>
                  <input
                    type="tel"
                    name="emergencyContactPhone"
                    required
                    placeholder="رقم الهاتف مع رمز الدولة (مثال: +20... أو +249...)"
                    value={formData.emergencyContactPhone}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* =========================================================================
                3. البيانات الأكاديمية - كلية العلوم جامعة القاهرة
            ========================================================================= */}
            <div style={sectionBoxStyle}>
              <div style={sectionHeaderStyle}>
                <GraduationCap size={18} color="#f59e0b" />
                <h3 style={sectionTitleStyle}>القسم الثالث: البيانات الأكاديمية بكلية العلوم</h3>
              </div>

              {/* Grid: 1 column on xs/sm, 2 columns on md+ */}
              <div className="register-form-grid">
                {/* القسم العلمي / التخصص الأكاديمي */}
                <div>
                  <label style={labelStyle}>القسم العلمي / التخصص الأكاديمي: *</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    style={{ ...inputStyle, border: '1px solid rgba(245, 158, 11, 0.4)', color: '#fbbf24', fontWeight: 'bold' }}
                  >
                    {MAJOR_OPTIONS.map((major) => (
                      <option key={major} value={major} style={{ background: '#0f172a', color: '#ffffff' }}>
                        {major}
                      </option>
                    ))}
                  </select>
                </div>

                {/* الفرقة / المستوى الدراسي */}
                <div>
                  <label style={labelStyle}>الفرقة / المستوى الدراسي: *</label>
                  <select
                    name="academicLevel"
                    value={formData.academicLevel}
                    onChange={handleChange}
                    style={inputStyle}
                  >
                    {ACADEMIC_LEVELS.map((lvl) => (
                      <option key={lvl} value={lvl} style={{ background: '#0f172a', color: '#ffffff' }}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                </div>

                {/* رقم الهوية / جواز السفر / الرقم الوطني */}
                <div className="md:col-span-2">
                  <label style={labelStyle}>رقم الهوية / جواز السفر / الرقم الوطني: *</label>
                  <input
                    type="text"
                    name="passportOrNationalId"
                    required
                    placeholder="مثال: P01234567 أو الرقم الوطني"
                    value={formData.passportOrNationalId}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* =========================================================================
                4. رفع المرفقات والوثائق
            ========================================================================= */}
            <div style={sectionBoxStyle}>
              <div style={sectionHeaderStyle}>
                <CreditCard size={18} color="#f59e0b" />
                <h3 style={sectionTitleStyle}>القسم الرابع: رفع إثبات الشخصية / الهوية الجامعية</h3>
              </div>

              <div>
                <label style={labelStyle}>صورة إثبات الهوية (جواز السفر / البطاقة الوطنية / بطاقة الكلية):</label>
                <div
                  style={{
                    border: '2px dashed #334155',
                    borderRadius: '14px',
                    padding: '20px 14px',
                    textAlign: 'center',
                    backgroundColor: '#1e293b',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="file"
                    id="idUpload"
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="idUpload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <Upload size={28} color="#f59e0b" />
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#ffffff' }}>
                      انقر هنا لرفع صورة الوثيقة أو اسحب الملف
                    </span>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                      الصيغ المقبولة: JPG, PNG (الحد الأقصى: 5MB)
                    </span>
                  </label>

                  {idPreview && (
                    <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <img
                        src={idPreview}
                        alt="ID Preview"
                        style={{ maxWidth: '200px', maxHeight: '120px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #10b981' }}
                      />
                      <span style={{ fontSize: '12px', color: '#34d399', fontWeight: 'bold' }}>
                        ✓ تم تجهيز صورة الهوية للاعتماد
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* إقرار صحة البيانات وزر الإرسال */}
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <p style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '18px', lineHeight: '1.6' }}>
                بالنقر على "إرسال استمارة التسجيل المركزي"، أقر بأن جميع البيانات المدخلة صحيحة ومطابقة لوثائقي الرسمية بكلية العلوم جامعة القاهرة.
              </p>

              <button
                type="submit"
                disabled={loading || isSuccess}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: '#0b1622',
                  border: 'none',
                  padding: '14px 20px',
                  borderRadius: '12px',
                  fontSize: '15.5px',
                  fontWeight: '900',
                  cursor: loading || isSuccess ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 6px 20px rgba(245, 158, 11, 0.4)',
                  transition: 'transform 0.15s ease',
                }}
              >
                <UserPlus size={20} />
                <span>{loading ? 'جاري إرسال الاستمارة والاعتماد...' : 'إرسال استمارة التسجيل المركزي (Submit Registration)'}</span>
              </button>
            </div>
          </form>

          {/* تذييل رابط الدخول */}
          <div style={{ textAlign: 'center', marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #334155' }}>
            <span style={{ color: '#cbd5e1', fontSize: '14px' }}>لديك حساب مسجل بالفعل؟ </span>
            <Link
              to="/login"
              style={{
                color: '#fbbf24',
                fontWeight: 'bold',
                textDecoration: 'none',
                fontSize: '14px',
                marginRight: '6px',
              }}
            >
              تسجيل دخول الأعضاء
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .register-form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }

        @media (min-width: 768px) {
          .register-form-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .md\\:col-span-2 {
            grid-column: span 2 / span 2;
          }
        }

        @media (max-width: 640px) {
          .form-content-padding {
            padding: 18px 12px !important;
          }
        }
      `}</style>
    </div>
  );
}

const sectionBoxStyle = {
  backgroundColor: '#1e293b',
  borderRadius: '16px',
  border: '1px solid #334155',
  padding: '18px 16px',
};

const sectionHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '16px',
  borderBottom: '1px solid #334155',
  paddingBottom: '10px',
};

const sectionTitleStyle = {
  fontSize: '15px',
  fontWeight: 'bold',
  color: '#ffffff',
  margin: 0,
};

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: '600',
  color: '#cbd5e1',
  marginBottom: '8px',
};

const inputStyle = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: '10px',
  backgroundColor: '#0f172a',
  border: '1px solid #334155',
  color: '#ffffff',
  fontSize: '14px',
  outline: 'none',
  direction: 'rtl',
  textAlign: 'right',
  boxSizing: 'border-box',
};