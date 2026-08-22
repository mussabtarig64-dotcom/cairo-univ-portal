import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, ArrowRight, ClockAlert, AlertCircle, ShieldX } from 'lucide-react';

export default function Login() {
  const { activeTheme } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pendingMessage, setPendingMessage] = useState('');
  const [rejectedMessage, setRejectedMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // حالة التدقيق المباشر والتنبيه باللون الأحمر (Real-time Validation)
  const [touched, setTouched] = useState({ email: false, password: false });

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isPasswordValid = password.trim().length >= 6;

  const emailError = touched.email && (!email.trim() ? 'البريد الإلكتروني مطلوب' : !isEmailValid ? 'صيغة البريد الإلكتروني غير صحيحة' : '');
  const passwordError = touched.password && (!password.trim() ? 'كلمة المرور مطلوبة' : !isPasswordValid ? 'كلمة المرور يجب أن لا تقل عن 6 أحرف' : '');

  const handleLogin = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (!isEmailValid || !isPasswordValid) {
      setError('يرجى تصحيح الحقول المطلوبة باللون الأحمر قبل المتابعة.');
      return;
    }

    setError('');
    setPendingMessage('');
    setRejectedMessage('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    setLoading(true);

    try {
      const res = await login(cleanEmail, cleanPassword);

      if (res && res.isRejected) {
        setRejectedMessage(res.message || 'تم رفض طلب تسجيلك بواسطة إدارة الرابطة. يرجى التواصل مع الإدارة لإعادة تفعيل الحساب.');
      } else if (res && (res.isPending || (res.user && (res.user.verificationStatus === 'pending' || res.user.status === 'pending') && res.user.verificationStatus !== 'verified' && res.user.status !== 'approved' && res.user.role !== 'admin'))) {
        setPendingMessage(res.message || 'طلبك قيد المراجعة والتدقيق بواسطة إدارة الرابطة');
        setTimeout(() => {
          navigate('/pending-approval');
        }, 1200);
      } else if (res && res.success && res.user) {
        if (res.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setError(res?.message || 'بيانات الدخول غير صحيحة، يرجى التأكد من البريد الإلكتروني وكلمة المرور.');
      }
    } catch (err) {
      setError('حدث خطأ في النظام أثناء تسجيل الدخول.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '40px auto', padding: '0 20px', paddingBottom: '60px', direction: 'rtl' }}>
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
            <LogIn size={26} />
          </div>
          <h1 style={{ color: activeTheme.textMain, fontSize: '22px', fontWeight: 'bold', margin: '0 0 8px' }}>
            دخول الأعضاء والإدارة
          </h1>
          <p style={{ color: activeTheme.textMuted, fontSize: '13px', margin: 0 }}>
            رابطة الطلاب السودانيين - كلية العلوم جامعة القاهرة
          </p>
        </div>

        {/* تنبيه الحساب المرفوض */}
        {rejectedMessage && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #ef4444',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '20px',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              boxShadow: '0 4px 15px rgba(239, 68, 68, 0.2)',
            }}
          >
            <ShieldX size={26} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
              <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>تم رفض الحساب ❌</div>
              {rejectedMessage}
            </div>
          </div>
        )}

        {/* تنبيه حالة الحساب المعلق */}
        {pendingMessage && (
          <div
            style={{
              background: 'rgba(234, 179, 8, 0.12)',
              border: '1px solid rgba(234, 179, 8, 0.35)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '20px',
              color: '#eab308',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
            }}
          >
            <ClockAlert size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>حساب الطالب قيد المراجعة حالياً ⏳</div>
              {pendingMessage}
            </div>
          </div>
        )}

        {/* رسالة الخطأ */}
        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: '12px',
              padding: '14px',
              marginBottom: '20px',
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

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', color: activeTheme.textMain, fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
              البريد الإلكتروني *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                style={inputStyle(activeTheme, !!emailError)}
              />
              <Mail size={16} color={emailError ? '#ef4444' : activeTheme.textMuted} style={iconStyle} />
            </div>
            {emailError && (
              <span style={{ color: '#f87171', fontSize: '11px', marginTop: '4px', display: 'block', fontWeight: 'bold' }}>
                ⚠️ {emailError}
              </span>
            )}
          </div>

          <div>
            <label style={{ display: 'block', color: activeTheme.textMain, fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
              كلمة المرور *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                style={inputStyle(activeTheme, !!passwordError)}
              />
              <Lock size={16} color={passwordError ? '#ef4444' : activeTheme.textMuted} style={iconStyle} />
            </div>
            {passwordError && (
              <span style={{ color: '#f87171', fontSize: '11px', marginTop: '4px', display: 'block', fontWeight: 'bold' }}>
                ⚠️ {passwordError}
              </span>
            )}
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
            <span>{loading ? 'جاري الدخول...' : 'تسجيل الدخول'}</span>
            <ArrowRight size={16} />
          </button>

          <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '13px', color: activeTheme.textMuted }}>
            طالب جديد ولم تسجل بعد؟{' '}
            <Link to="/register" style={{ color: activeTheme.accentLight, fontWeight: 'bold', textDecoration: 'none' }}>
              إنشاء حساب جديد
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputStyle = (theme, isError) => ({
  width: '100%',
  padding: '11px 40px 11px 14px',
  borderRadius: '10px',
  background: isError ? 'rgba(239, 68, 68, 0.08)' : 'rgba(0, 0, 0, 0.3)',
  border: isError ? '1px solid #ef4444' : `1px solid ${theme.border}`,
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