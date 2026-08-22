import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../config/api';
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

// دالة مساعدة لضغط وتصغير الصور على جانب المتصفح باستخدام Canvas لتفادي تجاوز 1MB وحدود HTTP 413
const compressImageFile = (file) => {
  return new Promise((resolve) => {
    if (!file) return resolve({ dataUrl: '', sizeKb: 0, originalName: '' });

    // إذا كان الملف غير صورة (مثلاً PDF)، نقرأه مباشرة
    if (!file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          dataUrl: reader.result,
          sizeKb: Math.round(file.size / 1024),
          originalName: file.name,
        });
      };
      reader.onerror = () => resolve({ dataUrl: '', sizeKb: 0, originalName: file.name });
      reader.readAsDataURL(file);
      return;
    }

    // ضغط وتصغير الصور باستخدام HTML5 Canvas
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxDimension = 1200; // أقصى بعد 1200 بكسل للحفاظ على الدقة العالية مع حجم صغير
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // تصدير بصيغة JPEG بجودة 0.75 (حجم بين 80KB و 300KB ممتاز جداً)
        let compressedBase64 = canvas.toDataURL('image/jpeg', 0.75);

        let sizeInBytes = Math.round((compressedBase64.length * 3) / 4);
        let sizeKb = Math.round(sizeInBytes / 1024);

        // إذا كان الحجم لا يزال أعلى من 800KB، نضغط بجودة أقل قليلاً لضمان أن يكون تحت 1MB
        if (sizeKb > 800) {
          compressedBase64 = canvas.toDataURL('image/jpeg', 0.55);
          sizeInBytes = Math.round((compressedBase64.length * 3) / 4);
          sizeKb = Math.round(sizeInBytes / 1024);
        }

        resolve({
          dataUrl: compressedBase64,
          sizeKb,
          originalName: file.name,
        });
      };
      img.onerror = () => {
        resolve({
          dataUrl: e.target.result,
          sizeKb: Math.round(file.size / 1024),
          originalName: file.name,
        });
      };
      img.src = e.target.result;
    };
    reader.onerror = () => resolve({ dataUrl: '', sizeKb: 0, originalName: file.name });
    reader.readAsDataURL(file);
  });
};

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
  const [idDocSizeKb, setIdDocSizeKb] = useState(0);
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // معالجة رفع وثيقة إثبات الهوية مع الضغط التلقائي السريع
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setIsCompressing(true);

    try {
      const result = await compressImageFile(file);
      setIdDocFileName(result.originalName);
      setIdDocSizeKb(result.sizeKb);
      setFormData((prev) => ({ ...prev, idDocument: result.dataUrl }));
    } catch (err) {
      console.error('Image compression error:', err);
      // استخدام قارئ الملفات المباشر كبديل آمن
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdDocFileName(file.name);
        setFormData((prev) => ({ ...prev, idDocument: reader.result }));
      };
      reader.readAsDataURL(file);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setIdDocFileName('');
    setIdDocSizeKb(0);
    setFormData((prev) => ({ ...prev, idDocument: '' }));
  };

  const [touched, setTouched] = useState({});

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const getFieldError = (field) => {
    if (!touched[field]) return '';
    switch (field) {
      case 'fullName':
        return !formData.fullName.trim() ? 'الاسم كامل مطلوب' : formData.fullName.trim().length < 2 ? 'يرجى إدخال اسم صحيح' : '';
      case 'age':
        return formData.age && (parseInt(formData.age, 10) < 15 || parseInt(formData.age, 10) > 80) ? 'العمر بين 15 و 80 سنة' : '';
      case 'phone':
        return !formData.phone.trim() ? 'رقم الهاتف مطلوب' : formData.phone.trim().length < 8 ? 'رقم الهاتف يجب أن يتكون من 8 أرقام على الأقل' : '';
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

    // تفعيل حالة اللمس للحقول الأساسية
    const criticalFields = ['fullName', 'phone', 'email', 'password', 'confirmPassword'];
    const touchedAll = {};
    criticalFields.forEach((f) => { touchedAll[f] = true; });
    setTouched(touchedAll);

    // التحقق من الحقول الأساسية فقط
    const hasCriticalErrors = criticalFields.some((f) => !!getFieldError(f));

    if (hasCriticalErrors) {
      setError('يرجى مراجعة وتصحيح الحقول المحددة باللون الأحمر.');
      return;
    }

    setLoading(true);

    try {
      const studentName = formData.fullName.trim() || 'طالب كلية العلوم';
      const studentEmail = formData.email.trim().toLowerCase() || `student_${Date.now()}@ssa-cu.edu`;
      const studentPhone = formData.phone.trim() || '01000000000';
      const studentAddress = formData.cairoAddress.trim() || 'القاهرة، مصر';
      const studentAge = formData.age.trim() || '20';
      const sId = formData.studentId.trim() || `SSA-${Math.floor(100000 + Math.random() * 900000)}`;

      const surveyPayload = {
        fullName: studentName,
        name: studentName,
        age: studentAge,
        phone: studentPhone,
        whatsapp: formData.whatsapp.trim() || studentPhone,
        cairoAddress: studentAddress,
        residence: studentAddress,
        emergencyContactName: formData.emergencyContactName.trim() || '',
        emergencyContactRelation: formData.emergencyContactRelation || 'الوالد / الوالدة',
        emergencyContactPhone: formData.emergencyContactPhone.trim() || '',
        studentId: sId,
        academicId: sId,
        department: formData.department || 'العلوم العامة (المستوى الأول)',
        academicLevel: formData.academicYear || 'المستوى الأول (إعدادي علوم / الفرقة الأولى)',
        academicYear: formData.academicYear || 'المستوى الأول (إعدادي علوم / الفرقة الأولى)',
        idDocument: formData.idDocument || '',
        idCardUrl: formData.idDocument || '',
        email: studentEmail,
        password: formData.password || 'SSA@Student2026',
        role: 'user',
        status: 'pending',
        verificationStatus: 'pending',
        isApproved: false,
      };

      // إرسال الطلب عبر دالة المصادقة المركزية
      let res = await register(surveyPayload);

      if (res && res.success) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(res?.message || 'حدث خطأ أثناء إرسال استمارة التسجيل.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setError(err?.response?.data?.error || err?.response?.data?.message || err?.message || 'حدث خطأ أثناء إرسال البيانات. يرجى المحاولة مرة أخرى.');
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
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>تم استلام بياناتك بنجاح!</h2>
            <p style={{ color: activeTheme.textMain, fontSize: '15px', maxWidth: '550px', lineHeight: '1.7', margin: 0, fontWeight: 'bold' }}>
              تم استلام بياناتك بنجاح، طلبك الآن قيد المراجعة والتدقيق بواسطة إدارة الرابطة.
            </p>
            <div style={{ fontSize: '13px', color: activeTheme.textMuted, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
              <Clock size={15} color="#eab308" />
              <span>جاري نقلك لصفحة الدخول والمتابعة...</span>
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

            {/* 3. القسم الثالث: إثبات الهوية */}
            <div style={sectionStyle(activeTheme)}>
              <div style={sectionHeaderStyle(activeTheme)}>
                <ShieldCheck size={18} color={activeTheme.accentLight} />
                <span>3. إثبات الهوية والتحقق الأكاديمي (اختياري / مستحسن)</span>
              </div>

              <p style={{ color: activeTheme.textMuted, fontSize: '12px', margin: '0 0 14px', lineHeight: '1.6' }}>
                يمكنك رفع صورة لوثيقة إثبات الهوية (جواز السفر، أو بطاقة الرقم الوطني، أو بطاقة الكلية / كارنيه الجامعة). يتم ضغط الصور تلقائياً في المتصفح لتسريع الإرسال وضمان حجم أقل من 1MB.
              </p>

              <div
                style={{
                  border: `2px dashed ${formData.idDocument ? '#22c55e' : activeTheme.border}`,
                  borderRadius: '16px',
                  padding: '24px 16px',
                  textAlign: 'center',
                  background: 'rgba(0, 0, 0, 0.25)',
                  position: 'relative',
                  cursor: isCompressing ? 'wait' : 'pointer',
                  transition: 'all 0.2s ease',
                  maxWidth: '100%',
                  boxSizing: 'border-box',
                }}
              >
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileUpload}
                  disabled={isCompressing}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: isCompressing ? 'wait' : 'pointer',
                    zIndex: 2,
                  }}
                />

                {isCompressing ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '28px', height: '28px', border: `3px solid ${activeTheme.accent}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    <span style={{ color: activeTheme.accentLight, fontSize: '13px', fontWeight: 'bold' }}>جاري ضغط وتحسين الصورة تلقائياً عبر المتصفح...</span>
                  </div>
                ) : formData.idDocument ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', maxWidth: '100%', position: 'relative', zIndex: 3 }}>
                    <CheckCircle size={36} color="#22c55e" />
                    <div style={{ color: '#22c55e', fontWeight: 'bold', fontSize: '14px', wordBreak: 'break-word' }}>
                      تم تجهيز وضغط الوثيقة بنجاح {idDocSizeKb > 0 ? `(${idDocSizeKb} KB)` : ''}
                    </div>
                    {idDocFileName && (
                      <div style={{ color: activeTheme.textMuted, fontSize: '12px' }}>
                        الملف: {idDocFileName}
                      </div>
                    )}
                    {formData.idDocument.startsWith('data:image') && (
                      <img
                        src={formData.idDocument}
                        alt="معاينة الهوية"
                        style={{ maxHeight: '140px', maxWidth: '100%', borderRadius: '8px', border: `1px solid ${activeTheme.border}`, marginTop: '8px', objectFit: 'contain' }}
                      />
                    )}
                    <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
                      <span style={{ fontSize: '11px', color: activeTheme.textMuted }}>اضغط لاختيار ملف آخر للاستبدال</span>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        style={{
                          background: 'rgba(239, 68, 68, 0.2)',
                          border: '1px solid rgba(239, 68, 68, 0.4)',
                          color: '#ef4444',
                          borderRadius: '6px',
                          padding: '2px 8px',
                          fontSize: '11px',
                          cursor: 'pointer',
                        }}
                      >
                        إزالة الملف
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <Upload size={32} color={activeTheme.accentLight} />
                    <div style={{ color: activeTheme.textMain, fontWeight: 'bold', fontSize: '14px' }}>
                      اضغط هنا لرفع صورة جواز السفر أو بطاقة الهوية / الكلية (اختياري)
                    </div>
                    <div style={{ color: activeTheme.textMuted, fontSize: '11px' }}>
                      يتم ضغط الصور تلقائياً لتكون أقل من 1MB لتفادي أخطاء الشبكة والرفع السريع
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