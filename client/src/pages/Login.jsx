import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, ArrowRight, ClockAlert, AlertCircle, ShieldX, KeyRound, CheckCircle2, X, Send, Loader2 } from 'lucide-react';
import { API_BASE } from '../config/api';

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

  // حالة نافذة استعادة كلمة المرور
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotError, setForgotError] = useState('');

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

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const cleanForgotEmail = forgotEmail.trim().toLowerCase();
    if (!cleanForgotEmail) {
      setForgotError('يرجى إدخال البريد الإلكتروني.');
      return;
    }

    setForgotLoading(true);
    setForgotError('');
    setForgotSuccess('');

    try {
      const res = await axios.post(`${API_BASE}/auth/forgot-password`, { email: cleanForgotEmail });
      if (res.data && res.data.success) {
        setForgotSuccess(res.data.message || 'تم إرسال رابط ورمز استعادة كلمة المرور إلى بريدك الإلكتروني بنجاح!');
      } else {
        setForgotError(res.data?.message || 'تعذر إرسال رابط الاستعادة.');
      }
    } catch (err) {
      setForgotError(err.response?.data?.message || 'لم يتم العثور على حساب مسجل بهذا البريد الإلكتروني.');
    } finally {
      setForgotLoading(false);
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

          {/* رابط استعادة كلمة المرور */}
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '-8px' }}>
            <button
              type="button"
              onClick={() => {
                setForgotEmail(email);
                setForgotError('');
                setForgotSuccess('');
                setShowForgotModal(true);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: activeTheme.accentLight,
                fontSize: '12px',
                cursor: 'pointer',
                padding: 0,
                fontWeight: '600',
                textDecoration: 'underline',
              }}
            >
              نسيت كلمة المرور؟
            </button>
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

      {/* نافذة استعادة كلمة المرور (Forgot Password Modal) */}
      {showForgotModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            backdropFilter: 'blur(5px)',
            direction: 'rtl',
          }}
          onClick={() => setShowForgotModal(false)}
        >
          <div
            style={{
              background: activeTheme.bgCard,
              border: `1px solid ${activeTheme.border}`,
              borderRadius: '24px',
              maxWidth: '480px',
              width: '100%',
              padding: '30px 24px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.65)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* رأس النافذة */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', borderBottom: `1px solid ${activeTheme.border}`, paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
                  <KeyRound size={20} />
                </div>
                <div>
                  <h3 style={{ color: activeTheme.textMain, fontSize: '17px', fontWeight: 'bold', margin: '0 0 2px' }}>
                    استعادة كلمة المرور
                  </h3>
                  <span style={{ fontSize: '11px', color: activeTheme.textMuted }}>
                    إرسال رابط إعادة التعيين والرمز إلى بريدك الإلكتروني
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                style={{ background: 'transparent', border: 'none', color: activeTheme.textMuted, cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {forgotSuccess ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.15)', border: '2px solid #22c55e', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <CheckCircle2 size={32} />
                </div>
                <h4 style={{ color: activeTheme.textMain, fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
                  تم إرسال بريد الاستعادة بنجاح!
                </h4>
                <p style={{ color: activeTheme.textMuted, fontSize: '13px', lineHeight: '1.7', marginBottom: '22px' }}>
                  {forgotSuccess}
                </p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotModal(false);
                      navigate('/reset-password');
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      color: '#0b1622',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '10px',
                      fontWeight: 'bold',
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    الانتقال لشاشة إدخال كلمة المرور الجديدة
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: activeTheme.textMain,
                      border: `1px solid ${activeTheme.border}`,
                      padding: '10px 18px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    إغلاق
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{ color: activeTheme.textMuted, fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
                  أدخل بريدك الإلكتروني المسجل في البوابة وسنقوم بإرسال رابط آمن مع رمز التحقق لإعادة تعيين كلمة المرور فوراً (صالح لمدة 30 دقيقة).
                </p>

                {forgotError && (
                  <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.35)', color: '#ef4444', padding: '10px 14px', borderRadius: '10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={16} style={{ flexShrink: 0 }} />
                    <span>{forgotError}</span>
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', color: activeTheme.textMain, fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
                    البريد الإلكتروني المسجل *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      required
                      placeholder="student@example.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      style={inputStyle(activeTheme, false)}
                    />
                    <Mail size={16} color={activeTheme.textMuted} style={iconStyle} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      color: '#0b1622',
                      border: 'none',
                      padding: '11px',
                      borderRadius: '10px',
                      fontWeight: 'bold',
                      fontSize: '13px',
                      cursor: forgotLoading ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {forgotLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>جاري الإرسال...</span>
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        <span>إرسال رابط الاستعادة</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: activeTheme.textMain,
                      border: `1px solid ${activeTheme.border}`,
                      padding: '11px 18px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
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