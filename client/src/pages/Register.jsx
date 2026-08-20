import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Phone,
  Hash,
  Lock,
  UserPlus,
  ArrowRight,
  ShieldCheck,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  Upload,
  FileText,
  CheckCircle,
  Eye,
  X,
  PhoneCall,
  GraduationCap
} from 'lucide-react';

const DEPARTMENTS = [
  'العلوم العامة (المستوى الأول)',
  'علوم الحاسب والمعلومات (Computer Science)',
  'الكيمياء المنفردة (Chemistry)',
  'الكيمياء الحيوية (Biochemistry)',
  'الكيمياء التطبيقية (Applied Chemistry)',
  'الفيزياء (Physics)',
  'الفيزياء الحيوية (Biophysics)',
  'الرياضيات البحتة والتطبيقية (Mathematics)',
  'الإحصاء وعلوم البيانات (Statistics)',
  'علم النبات والميكروبيولوجي (Botany & Microbiology)',
  'علم الحيوان وعلم الحشرات (Zoology & Entomology)',
  'التكنولوجيا الحيوية الجزيئية (Biotechnology)',
  'الجيولوجيا وعلوم الأرض (Geology)',
  'الجيوفيزياء (Geophysics)',
  'علوم الفلك والأرصاد (Astronomy)',
];

const ACADEMIC_YEARS = [
  'المستوى الأول (إعدادي علوم / الفرقة الأولى)',
  'المستوى الثاني (الفرقة الثانية)',
  'المستوى الثالث (الفرقة الثالثة)',
  'المستوى الرابع (الفرقة الرابعة - تخرج)',
  'مرحلة الدراسات العليا / تمهيدي ماجستير',
];

export default function Register() {
  const { activeTheme } = useTheme();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // البيانات الشخصية
    fullName: '',
    age: '',
    phone: '',
    whatsapp: '',
    cairoAddress: '',
    // بيانات الطوارئ
    emergencyContactName: '',
    emergencyContactRelation: 'الوالد / الوالدة',
    emergencyContactPhone: '',
    // البيانات الأكاديمية
    studentId: '',
    department: 'العلوم العامة (المستوى الأول)',
    academicYear: 'المستوى الأول (إعدادي علوم / الفرقة الأولى)',
    // وثيقة إثبات الهوية
    idDocument: '',
    // بيانات الحساب
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [idDocFileName, setIdDocFileName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // معالجة رفع وثيقة إثبات الهوية
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('حجم الملف كبير جداً! الحد الأقصى هو 5 ميجابايت.');
      return;
    }

    setIdDocFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, idDocument: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const [touched, setTouched] = useState({});

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const getFieldError = (field) => {
    if (!touched[field]) return '';
    switch (field) {
      case 'fullName':
        return !formData.fullName.trim() ? 'الاسم كامل مطلوب' : formData.fullName.trim().length < 3 ? 'يرجى إدخال اسم ثلاثي صحيح' : '';
      case 'age':
        return !formData.age ? 'العمر مطلوب' : (parseInt(formData.age, 10) < 16 || parseInt(formData.age, 10) > 60) ? 'العمر بين 16 و 60 سنة' : '';
      case 'phone':
        return !formData.phone.trim() ? 'رقم الهاتف المصري مطلوب' : formData.phone.trim().length < 10 ? 'رقم الهاتف يجب أن يتكون من 10 أرقام على الأقل' : '';
      case 'cairoAddress':
        return !formData.cairoAddress.trim() ? 'عنوان السكن بمصر مطلوب بالتفصيل' : formData.cairoAddress.trim().length < 5 ? 'ادخل العنوان بالتفصيل' : '';
      case 'studentId':
        return !formData.studentId.trim() ? 'الرقم الأكاديمي أو رقم القيد مطلوب' : '';
      case 'email':
        return !formData.email.trim() ? 'البريد الإلكتروني مطلوب' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()) ? 'صيغة البريد الإلكتروني غير صحيحة' : '';
      case 'password':
        return !formData.password ? 'كلمة المرور مطلوبة' : formData.password.length < 6 ? 'كلمة المرور 6 أحرف أو أرقام على الأقل' : '';
      case 'confirmPassword':
        return !formData.confirmPassword ? 'تأكيد كلمة المرور مطلوب' : formData.confirmPassword !== formData.password ? 'كلمات المرور غير متطابقة' : '';
      default:
        return '';
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // تفعيل حالة اللمس لجميع الحقول عند محاولة الإرسال
    const allFields = ['fullName', 'age', 'phone', 'cairoAddress', 'studentId', 'email', 'password', 'confirmPassword'];
    const touchedAll = {};
    allFields.forEach((f) => { touchedAll[f] = true; });
    setTouched(touchedAll);

    // التحقق من أن جميع الحقول صالحة
    const hasErrors = allFields.some((f) => !!getFieldError(f)) || !formData.idDocument;

    if (hasErrors) {
      if (!formData.idDocument) {
        setError('إثبات الهوية إلزامي! يرجى رفع صورة من (جواز السفر / الرقم الوطني / بطاقة الكلية).');
      } else {
        setError('يرجى مراجعة وتصحيح الحقول المحددة باللون الأحمر قبل إرسال الاستمارة.');
      }
      return;
    }

    setLoading(true);

    try {
      const surveyPayload = {
        fullName: formData.fullName.trim(),
        age: formData.age.trim(),
        phone: formData.phone.trim(),
        whatsapp: formData.whatsapp.trim() || formData.phone.trim(),
        cairoAddress: formData.cairoAddress.trim(),
        emergencyContactName: formData.emergencyContactName.trim(),
        emergencyContactRelation: formData.emergencyContactRelation,
        emergencyContactPhone: formData.emergencyContactPhone.trim(),
        studentId: formData.studentId.trim(),
        department: formData.department,
        academicLevel: formData.academicYear,
        academicYear: formData.academicYear,
        idDocument: formData.idDocument,
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: 'user',
        verificationStatus: 'pending',
      };

      const res = await register(surveyPayload);

      if (res && res.success) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(res?.message || 'حدث خطأ أثناء إرسال استمارة التسجيل.');
      }
    } catch (err) {
      setError('حدث خطأ في النظام أثناء إرسال البيانات. يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '850px', width: '100%', margin: '24px auto', padding: '0 16px', paddingBottom: '70px', direction: 'rtl', boxSizing: 'border-box' }}>
      <div
        className="register-card"
        style={{
          background: activeTheme.bgCard,
          border: `1px solid ${activeTheme.border}`,
          borderRadius: '24px',
          padding: '32px 24px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.45)',
          position: 'relative',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* هيدر الاستمارة */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${activeTheme.primary} 0%, ${activeTheme.secondary} 100%)`,
              border: `2px solid ${activeTheme.accent}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: '#ffffff',
              boxShadow: `0 8px 20px ${activeTheme.primary}50`,
            }}
          >
            <UserPlus size={30} />
          </div>

          <h1 style={{ color: activeTheme.textMain, fontSize: '22px', fontWeight: '900', margin: '0 0 8px' }}>
            استمارة التسجيل المركزي واستبيان الطلاب
          </h1>
          <p style={{ color: activeTheme.accentLight, fontSize: '13px', margin: 0, fontWeight: 'bold' }}>
            رابطة الطلاب السودانيين - كلية العلوم جامعة القاهرة (SSA-FS-CU)
          </p>
          <p style={{ color: activeTheme.textMuted, fontSize: '12px', marginTop: '4px' }}>
            يرجى ملء جميع البيانات بدقة ليتم تدقيق قيدك واعتماده من قبل هيئة شؤون الطلاب
          </p>
        </div>

        {/* رسالة النجاح */}
        {isSuccess ? (
          <div
            style={{
              background: 'rgba(34, 197, 94, 0.12)',
              border: '1px solid rgba(34, 197, 94, 0.4)',
              borderRadius: '16px',
              padding: '32px 24px',
              textAlign: 'center',
              color: '#22c55e',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <CheckCircle size={48} />
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>تم استلام استمارة التسجيل بنجاح!</h2>
            <p style={{ color: activeTheme.textMain, fontSize: '14px', maxWidth: '500px', lineHeight: '1.7', margin: 0 }}>
              تم إدراج بياناتك في طابور الانتظار <strong>(قيد المراجعة)</strong>. سيقوم مشرفو الرابطة بالتحقق من وثيقة الهوية واعتماد حسابك خلال دقائق.
            </p>
            <div style={{ fontSize: '12px', color: activeTheme.textMuted, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} />
              <span>جاري نقلك لصفحة تسجيل الدخول...</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', boxSizing: 'border-box' }}>
            {error && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#ef4444',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  wordBreak: 'break-word',
                }}
              >
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {/* 1. القسم الأول: البيانات الشخصية */}
            <div style={sectionStyle(activeTheme)}>
              <div style={sectionHeaderStyle(activeTheme)}>
                <User size={18} color={activeTheme.accentLight} />
                <span>1. البيانات الشخصية وبيانات السكن بمصر</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '16px' }}>
                {/* الاسم كامل */}
                <div>
                  <label style={labelStyle(activeTheme)}>الاسم كامل *</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="الاسم كامل"
                    value={formData.fullName}
                    onChange={handleChange}
                    onBlur={() => handleBlur('fullName')}
                    style={inputStyle(activeTheme, !!getFieldError('fullName'))}
                  />
                  {getFieldError('fullName') && (
                    <span style={errorTextStyle}>⚠️ {getFieldError('fullName')}</span>
                  )}
                </div>

                {/* العمر */}
                <div>
                  <label style={labelStyle(activeTheme)}>العمر (بالسنوات) *</label>
                  <input
                    type="number"
                    name="age"
                    required
                    min="16"
                    max="60"
                    placeholder="مثال: 20"
                    value={formData.age}
                    onChange={handleChange}
                    onBlur={() => handleBlur('age')}
                    style={inputStyle(activeTheme, !!getFieldError('age'))}
                  />
                  {getFieldError('age') && (
                    <span style={errorTextStyle}>⚠️ {getFieldError('age')}</span>
                  )}
                </div>

                {/* رقم الهاتف المصري */}
                <div>
                  <label style={labelStyle(activeTheme)}>رقم الهاتف المصري للتواصل *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="مثال: 01012345678"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={() => handleBlur('phone')}
                    style={inputStyle(activeTheme, !!getFieldError('phone'))}
                  />
                  {getFieldError('phone') && (
                    <span style={errorTextStyle}>⚠️ {getFieldError('phone')}</span>
                  )}
                </div>

                {/* رقم الواتساب */}
                <div>
                  <label style={labelStyle(activeTheme)}>رقم الواتساب (إذا كان مختلفاً)</label>
                  <input
                    type="tel"
                    name="whatsapp"
                    placeholder="مثال: +249... أو 010..."
                    value={formData.whatsapp}
                    onChange={handleChange}
                    style={inputStyle(activeTheme, false)}
                  />
                </div>
              </div>

              {/* عنوان السكن في مصر */}
              <div style={{ marginTop: '14px' }}>
                <label style={labelStyle(activeTheme)}>مكان وعنوان السكن الحالي في مصر بالتفصيل *</label>
                <input
                  type="text"
                  name="cairoAddress"
                  required
                  placeholder="مثال: محافظة الجيزة - الدقي - شارع التحرير بالقرب من محطة المترو"
                  value={formData.cairoAddress}
                  onChange={handleChange}
                  onBlur={() => handleBlur('cairoAddress')}
                  style={inputStyle(activeTheme, !!getFieldError('cairoAddress'))}
                />
                {getFieldError('cairoAddress') && (
                  <span style={errorTextStyle}>⚠️ {getFieldError('cairoAddress')}</span>
                )}
              </div>

              {/* بيانات اتصال الطوارئ */}
              <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: `1px dashed ${activeTheme.border}` }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: activeTheme.accentLight, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <PhoneCall size={15} />
                  <span>بيانات جهة الاتصال في حالات الطوارئ بمصر أو السودان:</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 190px), 1fr))', gap: '12px' }}>
                  <div>
                    <label style={labelStyle(activeTheme)}>اسم الشخص للطوارئ</label>
                    <input
                      type="text"
                      name="emergencyContactName"
                      placeholder="اسم ولي الأمر أو القريب..."
                      value={formData.emergencyContactName}
                      onChange={handleChange}
                      style={inputStyle(activeTheme, false)}
                    />
                  </div>
                  <div>
                    <label style={labelStyle(activeTheme)}>صلة القرابة</label>
                    <select
                      name="emergencyContactRelation"
                      value={formData.emergencyContactRelation}
                      onChange={handleChange}
                      style={inputStyle(activeTheme, false)}
                    >
                      <option value="الوالد / الوالدة">الوالد / الوالدة</option>
                      <option value="أخ / أخت">أخ / أخت</option>
                      <option value="عم / خال">عم / خال</option>
                      <option value="صديق / زميل سكن">صديق / زميل سكن</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle(activeTheme)}>رقم هاتف الطوارئ</label>
                    <input
                      type="tel"
                      name="emergencyContactPhone"
                      placeholder="رقم الهاتف للطوارئ..."
                      value={formData.emergencyContactPhone}
                      onChange={handleChange}
                      style={inputStyle(activeTheme, false)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. القسم الثاني: البيانات الأكاديمية */}
            <div style={sectionStyle(activeTheme)}>
              <div style={sectionHeaderStyle(activeTheme)}>
                <GraduationCap size={18} color={activeTheme.accentLight} />
                <span>2. البيانات الأكاديمية بكلية العلوم جامعة القاهرة</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '16px' }}>
                {/* الرقم الجامعي / القيد */}
                <div>
                  <label style={labelStyle(activeTheme)}>الرقم الأكاديمي / رقم القيد / الجلوس *</label>
                  <input
                    type="text"
                    name="studentId"
                    required
                    placeholder="مثال: 202410889"
                    value={formData.studentId}
                    onChange={handleChange}
                    onBlur={() => handleBlur('studentId')}
                    style={inputStyle(activeTheme, !!getFieldError('studentId'))}
                  />
                  {getFieldError('studentId') && (
                    <span style={errorTextStyle}>⚠️ {getFieldError('studentId')}</span>
                  )}
                </div>

                {/* القسم / التخصص */}
                <div>
                  <label style={labelStyle(activeTheme)}>القسم العلمي / التخصص *</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    style={inputStyle(activeTheme, false)}
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                {/* السنة الدراسية / المستوى */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle(activeTheme)}>السنة الدراسية / المستوى الأكاديمي *</label>
                  <select
                    name="academicYear"
                    value={formData.academicYear}
                    onChange={handleChange}
                    style={inputStyle(activeTheme, false)}
                  >
                    {ACADEMIC_YEARS.map((yr) => (
                      <option key={yr} value={yr}>
                        {yr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 3. القسم الثالث: إثبات الهوية الإلزامي */}
            <div style={sectionStyle(activeTheme)}>
              <div style={sectionHeaderStyle(activeTheme)}>
                <ShieldCheck size={18} color={activeTheme.accentLight} />
                <span>3. إثبات الهوية الإلزامي (Mandatory Identity Verification)</span>
              </div>

              <p style={{ color: activeTheme.textMuted, fontSize: '12px', margin: '0 0 14px', lineHeight: '1.6' }}>
                يلزم رفع صورة واضحة لوثيقة إثبات الهوية (جواز السفر، أو بطاقة الرقم الوطني السوداني، أو بطاقة الكلية / كارنيه الجامعة) لتدقيق الطلب واعتماد العضوية.
              </p>

              <div
                style={{
                  border: `2px dashed ${formData.idDocument ? '#22c55e' : '#f59e0b'}`,
                  borderRadius: '16px',
                  padding: '24px 16px',
                  textAlign: 'center',
                  background: 'rgba(0, 0, 0, 0.25)',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  maxWidth: '100%',
                  boxSizing: 'border-box',
                }}
              >
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  required={!formData.idDocument}
                  onChange={handleFileUpload}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer',
                  }}
                />

                {formData.idDocument ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', maxWidth: '100%' }}>
                    <CheckCircle size={36} color="#22c55e" />
                    <div style={{ color: '#22c55e', fontWeight: 'bold', fontSize: '14px', wordBreak: 'break-word' }}>
                      تم إرفاق الوثيقة بنجاح: {idDocFileName || 'مستند إثبات الهوية'}
                    </div>
                    {formData.idDocument.startsWith('data:image') && (
                      <img
                        src={formData.idDocument}
                        alt="معاينة الهوية"
                        style={{ maxHeight: '140px', maxWidth: '100%', borderRadius: '8px', border: `1px solid ${activeTheme.border}`, marginTop: '8px', objectFit: 'contain' }}
                      />
                    )}
                    <span style={{ fontSize: '11px', color: activeTheme.textMuted }}>اضغط لاختيار ملف آخر إذا أردت الاستبدال</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <Upload size={32} color={activeTheme.accentLight} />
                    <div style={{ color: activeTheme.textMain, fontWeight: 'bold', fontSize: '14px' }}>
                      اضغط هنا لرفع صورة جواز السفر أو بطاقة الهوية / الكلية *
                    </div>
                    <div style={{ color: activeTheme.textMuted, fontSize: '11px' }}>
                      يقبل الصور (JPG, PNG) وملفات PDF بحد أقصى 5MB
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 4. القسم الرابع: بيانات الحساب وكلمة المرور */}
            <div style={sectionStyle(activeTheme)}>
              <div style={sectionHeaderStyle(activeTheme)}>
                <Lock size={18} color={activeTheme.accentLight} />
                <span>4. بيانات تسجيل الدخول والأمان</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '16px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle(activeTheme)}>البريد الإلكتروني الشخصي *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="example@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={() => handleBlur('email')}
                    style={inputStyle(activeTheme, !!getFieldError('email'))}
                  />
                  {getFieldError('email') && (
                    <span style={errorTextStyle}>⚠️ {getFieldError('email')}</span>
                  )}
                </div>

                <div>
                  <label style={labelStyle(activeTheme)}>كلمة المرور (6 أحرف أو أرقام على الأقل) *</label>
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={() => handleBlur('password')}
                    style={inputStyle(activeTheme, !!getFieldError('password'))}
                  />
                  {getFieldError('password') && (
                    <span style={errorTextStyle}>⚠️ {getFieldError('password')}</span>
                  )}
                </div>

                <div>
                  <label style={labelStyle(activeTheme)}>تأكيد كلمة المرور *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={() => handleBlur('confirmPassword')}
                    style={inputStyle(activeTheme, !!getFieldError('confirmPassword'))}
                  />
                  {getFieldError('confirmPassword') && (
                    <span style={errorTextStyle}>⚠️ {getFieldError('confirmPassword')}</span>
                  )}
                </div>
              </div>
            </div>

            {/* زر الإرسال النهائي */}
            <button
              type="submit"
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                background: `linear-gradient(135deg, ${activeTheme.accent} 0%, #d97706 100%)`,
                color: '#0b1622',
                border: 'none',
                padding: '16px',
                borderRadius: '14px',
                fontWeight: '900',
                fontSize: '16px',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: `0 8px 25px rgba(245, 158, 11, 0.4)`,
                transition: 'all 0.2s ease',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              {loading ? (
                <span>جاري إرسال الاستمارة والتحقق...</span>
              ) : (
                <>
                  <span>إرسال استمارة التسجيل والاستبيان للإدارة</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>

            <div style={{ textAlign: 'center', fontSize: '13px', color: activeTheme.textMuted }}>
              لديك حساب معتمد بالفعل؟{' '}
              <Link to="/login" style={{ color: activeTheme.accentLight, fontWeight: 'bold', textDecoration: 'none' }}>
                تسجيل الدخول من هنا
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const sectionStyle = (theme) => ({
  background: 'rgba(0, 0, 0, 0.2)',
  border: `1px solid ${theme.border}`,
  borderRadius: '16px',
  padding: '20px',
});

const sectionHeaderStyle = (theme) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: theme.textMain,
  fontWeight: 'bold',
  fontSize: '15px',
  marginBottom: '16px',
  borderBottom: `1px solid ${theme.border}`,
  paddingBottom: '10px',
});

const labelStyle = (theme) => ({
  display: 'block',
  color: theme.textMain,
  fontSize: '12px',
  fontWeight: 'bold',
  marginBottom: '6px',
});

const inputStyle = (theme, isError) => ({
  width: '100%',
  padding: '11px 14px',
  borderRadius: '10px',
  background: isError ? 'rgba(239, 68, 68, 0.08)' : 'rgba(0, 0, 0, 0.35)',
  border: isError ? '1px solid #ef4444' : `1px solid ${theme.border}`,
  color: theme.textMain,
  outline: 'none',
  fontSize: '13px',
  boxSizing: 'border-box',
  direction: 'rtl',
  transition: 'all 0.2s ease',
});

const errorTextStyle = {
  color: '#f87171',
  fontSize: '11px',
  marginTop: '4px',
  display: 'block',
  fontWeight: 'bold',
};