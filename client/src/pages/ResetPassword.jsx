import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { Lock, KeyRound, CheckCircle2, AlertCircle, ArrowRight, Eye, EyeOff, ShieldCheck, Loader2 } from 'lucide-react';
import { API_BASE } from '../config/api';

export default function ResetPassword() {
  const { activeTheme } = useTheme();
  const { token: urlToken } = useParams();
  const navigate = useNavigate();

  const [token, setToken] = useState(urlToken || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (urlToken) {
      setToken(urlToken);
    }
  }, [urlToken]);

  // عد تنازلي للتحويل التلقائي لصفحة الدخول بعد النجاح
  useEffect(() => {
    let timer;
    if (success && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((c) => c - 1);
      }, 1000);
    } else if (success && countdown === 0) {
      navigate('/login');
    }
    return () => clearTimeout(timer);
  }, [success, countdown, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const cleanToken = token.trim();
    const cleanPassword = newPassword.trim();
    const cleanConfirm = confirmPassword.trim();

    if (!cleanToken) {
      setError('يرجى إدخال رمز أو توكن استعادة كلمة المرور.');
      return;
    }

    if (!cleanPassword || cleanPassword.length < 6) {
      setError('كلمة المرور يجب أن لا تقل عن 6 أحرف أو أرقام.');
      return;
    }

    if (cleanPassword !== cleanConfirm) {
      setError('كلمتا المرور غير متطابقتين. يرجى التأكد من تطابق كلمة المرور وتأكيدها.');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/auth/reset-password`, {
        token: cleanToken,
        newPassword: cleanPassword,
      });

      if (res.data && res.data.success) {
        setSuccess(res.data.message || 'تم إعادة تعيين كلمة المرور بنجاح!');
      } else {
        setError(res.data?.message || 'فشل إعادة تعيين كلمة المرور.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'رمز أو رابط الاستعادة غير صالح أو انتهت صلاحيته (المدة 30 دقيقة). يرجى طلب استعادة كلمة المرور مرة أخرى.'
      );
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
        {/* الرأس */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              border: `2px solid ${activeTheme.accent}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: '#0b1622',
              boxShadow: '0 6px 18px rgba(245, 158, 11, 0.35)',
            }}
          >
            <ShieldCheck size={32} />
          </div>
          <h1 style={{ color: activeTheme.textMain, fontSize: '22px', fontWeight: '900', margin: '0 0 6px' }}>
            تعيين كلمة مرور جديدة
          </h1>
          <p style={{ color: activeTheme.textMuted, fontSize: '13px', margin: 0, lineHeight: '1.6' }}>
            أدخل رمز التحقق وكلمة المرور الجديدة لاستعادة الدخول إلى حسابك الطلابي
          </p>
        </div>

        {/* تنبيه الخطأ */}
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
              lineHeight: '1.5',
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* تنبيه النجاح */}
        {success ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(34, 197, 94, 0.15)',
                border: '2px solid #22c55e',
                color: '#22c55e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <CheckCircle2 size={34} />
            </div>
            <h3 style={{ color: activeTheme.textMain, fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
              تم تغيير كلمة المرور بنجاح!
            </h3>
            <p style={{ color: activeTheme.textMuted, fontSize: '14px', lineHeight: '1.7', marginBottom: '20px' }}>
              {success}
            </p>
            <div style={{ fontSize: '13px', color: activeTheme.accentLight, fontWeight: 'bold', marginBottom: '20px' }}>
              سيتم تحويلك إلى صفحة تسجيل الدخول خلال {countdown} ثوانٍ...
            </div>
            <button
              onClick={() => navigate('/login')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#0b1622',
                border: 'none',
                padding: '12px 28px',
                borderRadius: '12px',
                fontWeight: 'bold',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              <span>تسجيل الدخول الآن</span>
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* رمز التحقق أو التوكن */}
            <div>
              <label style={{ display: 'block', color: activeTheme.textMain, fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
                رمز أو توكن التحقق (Token / Code) *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  placeholder="أدخل الرمز أو التوكن المستلم في البريد"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  style={inputStyle(activeTheme)}
                />
                <KeyRound size={16} color={activeTheme.textMuted} style={iconStyle} />
              </div>
            </div>

            {/* كلمة المرور الجديدة */}
            <div>
              <label style={{ display: 'block', color: activeTheme.textMain, fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
                كلمة المرور الجديدة *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="لا تقل عن 6 أحرف"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={inputStyle(activeTheme)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '12px',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: activeTheme.textMuted,
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <Lock size={16} color={activeTheme.textMuted} style={iconStyle} />
              </div>
            </div>

            {/* تأكيد كلمة المرور */}
            <div>
              <label style={{ display: 'block', color: activeTheme.textMain, fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
                تأكيد كلمة المرور الجديدة *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="أعد كتابة كلمة المرور"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={inputStyle(activeTheme)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '12px',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: activeTheme.textMuted,
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
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
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#0b1622',
                border: 'none',
                padding: '13px',
                borderRadius: '12px',
                fontWeight: 'bold',
                fontSize: '14px',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 6px 18px rgba(245, 158, 11, 0.35)',
                marginTop: '6px',
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>جاري حفظ كلمة المرور...</span>
                </>
              ) : (
                <>
                  <span>حفظ وتعيين كلمة المرور</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '13px', color: activeTheme.textMuted }}>
              تذكرت كلمة المرور؟{' '}
              <Link to="/login" style={{ color: activeTheme.accentLight, fontWeight: 'bold', textDecoration: 'none' }}>
                العودة لتسجيل الدخول
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
  padding: '11px 40px 11px 40px',
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

