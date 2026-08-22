import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, UserPlus, ArrowRight, AlertCircle, CheckCircle, GraduationCap, Phone } from 'lucide-react';

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

export default function Register() {
  const { activeTheme } = useTheme();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'الكيمياء منفرد',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { name, email, phone, department, password, confirmPassword } = formData;

    if (!name.trim() || !email.trim() || !password || !department) {
      setError('يرجى ملء جميع الحقول المطلوبة واختيار التخصص.');
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
      const res = await register({
        name: name.trim(),
        fullName: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        department: department,
        password: password,
      });

      if (res && res.success) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setError(res?.message || 'حدث خطأ أثناء إنشاء الحساب.');
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'حدث خطأ في الاتصال بالخادم.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '520px', margin: '40px auto', padding: '0 20px', paddingBottom: '60px', direction: 'rtl' }}>
      <div
        style={{
          background: activeTheme.bgCard,
          border: `1px solid ${activeTheme.border}`,
          borderRadius: '24px',
          padding: '36px 28px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.45)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${activeTheme.primary} 0%, ${activeTheme.secondary} 100%)`,
              border: `2px solid ${activeTheme.accent}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: '#ffffff',
              boxShadow: `0 6px 18px ${activeTheme.primary}40`,
            }}
          >
            <UserPlus size={26} />
          </div>
          <h1 style={{ color: activeTheme.textMain, fontSize: '22px', fontWeight: 'bold', margin: '0 0 8px' }}>
            إنشاء حساب طالب جديد
          </h1>
          <p style={{ color: activeTheme.textMuted, fontSize: '13px', margin: 0 }}>
            رابطة الطلاب السودانيين - كلية العلوم جامعة القاهرة
          </p>
        </div>

        {isSuccess ? (
          <div
            style={{
              background: 'rgba(34, 197, 94, 0.12)',
              border: '1px solid rgba(34, 197, 94, 0.4)',
              borderRadius: '16px',
              padding: '24px 20px',
              textAlign: 'center',
              color: '#22c55e',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <CheckCircle size={44} />
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>تم إنشاء الحساب بنجاح!</h2>
            <p style={{ color: activeTheme.textMain, fontSize: '14px', margin: 0 }}>
              جاري تحويلك إلى صفحة تسجيل الدخول...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {error && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  borderRadius: '12px',
                  padding: '14px',
                  color: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '13px',
                }}
              >
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label style={{ display: 'block', color: activeTheme.textMain, fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
                الاسم بالكامل *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="مثال: مصطفى أحمد إبراهيم"
                  value={formData.name}
                  onChange={handleChange}
                  style={inputStyle(activeTheme)}
                />
                <User size={16} color={activeTheme.textMuted} style={iconStyle} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', color: activeTheme.textMain, fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
                البريد الإلكتروني *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="example@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  style={inputStyle(activeTheme)}
                />
                <Mail size={16} color={activeTheme.textMuted} style={iconStyle} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', color: activeTheme.textMain, fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
                رقم الهاتف / الواتساب (اختياري)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="tel"
                  name="phone"
                  placeholder="01xxxxxxxxx"
                  value={formData.phone}
                  onChange={handleChange}
                  style={inputStyle(activeTheme)}
                />
                <Phone size={16} color={activeTheme.textMuted} style={iconStyle} />
              </div>
            </div>

            {/* حقل التخصص والأقسام العلمية المحددة بدقة */}
            <div>
              <label style={{ display: 'block', color: activeTheme.textMain, fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
                القسم العلمي / التخصص الأكاديمي *
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  name="department"
                  required
                  value={formData.department}
                  onChange={handleChange}
                  style={{
                    ...inputStyle(activeTheme),
                    appearance: 'none',
                    cursor: 'pointer',
                    backgroundColor: activeTheme.isDark ? '#0f172a' : '#ffffff',
                  }}
                >
                  {MAJOR_OPTIONS.map((major) => (
                    <option key={major} value={major} style={{ background: activeTheme.isDark ? '#0f172a' : '#ffffff', color: activeTheme.isDark ? '#f1f5f9' : '#0f172a' }}>
                      {major}
                    </option>
                  ))}
                </select>
                <GraduationCap size={16} color={activeTheme.accentLight} style={iconStyle} />
              </div>
              <div style={{ fontSize: '11px', color: activeTheme.textMuted, marginTop: '4px' }}>
                اختر تخصصك العلمي المعتمد في كلية العلوم جامعة القاهرة.
              </div>
            </div>

            <div>
              <label style={{ display: 'block', color: activeTheme.textMain, fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
                كلمة المرور *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="•••••••• (6 أحرف على الأقل)"
                  value={formData.password}
                  onChange={handleChange}
                  style={inputStyle(activeTheme)}
                />
                <Lock size={16} color={activeTheme.textMuted} style={iconStyle} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', color: activeTheme.textMain, fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
                تأكيد كلمة المرور *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={inputStyle(activeTheme)}
                />
                <Lock size={16} color={activeTheme.textMuted} style={iconStyle} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: `linear-gradient(135deg, ${activeTheme.accent} 0%, #d97706 100%)`,
                color: '#0b1622',
                border: 'none',
                padding: '13px',
                borderRadius: '12px',
                fontWeight: 'bold',
                fontSize: '14px',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: `0 6px 18px rgba(245, 158, 11, 0.35)`,
                marginTop: '6px',
              }}
            >
              <span>{loading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}</span>
              <ArrowRight size={16} />
            </button>

            <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '13px', color: activeTheme.textMuted }}>
              لديك حساب بالفعل؟{' '}
              <Link to="/login" style={{ color: activeTheme.accentLight, fontWeight: 'bold', textDecoration: 'none' }}>
                تسجيل الدخول
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const inputStyle = (theme) => ({
  width: '100%',
  padding: '11px 40px 11px 14px',
  borderRadius: '10px',
  background: 'rgba(0, 0, 0, 0.3)',
  border: `1px solid ${theme.border}`,
  color: theme.textMain,
  outline: 'none',
  fontSize: '13px',
  boxSizing: 'border-box',
  direction: 'rtl',
  transition: 'all 0.2s ease',
});

const iconStyle = {
  position: 'absolute',
  top: '50%',
  right: '12px',
  transform: 'translateY(-50%)',
  pointerEvents: 'none',
};