import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  MapPin,
  Phone,
  Mail,
  Send,
  Clock,
  Globe,
  CheckCircle,
  MessageSquare,
  Sparkles,
  Building,
  Navigation
} from 'lucide-react';
import SocialLinks from '../components/SocialLinks';

export default function Contact() {
  const { activeTheme } = useTheme();

  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSentSuccess(true);
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    setTimeout(() => {
      setSentSuccess(false);
    }, 5000);
  };

  return (
    <div style={{ maxWidth: '1150px', margin: '24px auto', padding: '0 20px 80px', direction: 'rtl' }}>
      
      {/* 1. هيدر الاتصال والمقر */}
      <div
        style={{
          background: `linear-gradient(135deg, ${activeTheme.bgCard} 0%, rgba(11, 19, 43, 0.95) 100%)`,
          border: `1px solid ${activeTheme.border}`,
          borderRadius: '24px',
          padding: '36px 28px',
          marginBottom: '32px',
          boxShadow: '0 20px 45px rgba(0, 0, 0, 0.4)',
          textAlign: 'center',
          position: 'relative',
        }}
      >
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
            boxShadow: `0 8px 25px ${activeTheme.primary}50`,
          }}
        >
          <MapPin size={32} />
        </div>

        <h1 style={{ color: activeTheme.textMain, fontSize: '26px', fontWeight: '900', margin: '0 0 10px' }}>
          اتصل بنا ومقر رابطة الطلاب السودانيين
        </h1>
        <p style={{ color: activeTheme.accentLight, fontSize: '14px', margin: 0, fontWeight: 'bold' }}>
          كلية العلوم - جامعة القاهرة (SSA-FS-CU)
        </p>
        <p style={{ color: activeTheme.textMuted, fontSize: '13px', marginTop: '6px', maxWidth: '650px', margin: '8px auto 0' }}>
          يسعدنا تواصلكم الدائم معنا. يمكنك التواصل عبر الهاتف، المراسلة الفورية، أو زيارة مكتب الرابطة الرسمي بجامعة القاهرة.
        </p>
      </div>

      {/* 2. شبكة معلومات الاتصال والمواقع */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '24px', marginBottom: '36px' }}>
        
        {/* كارت بيانات التواصل والقنوات الرسمية */}
        <div
          style={{
            background: activeTheme.bgCard,
            border: `1px solid ${activeTheme.border}`,
            borderRadius: '20px',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
          }}
        >
          <h2 style={{ color: activeTheme.accentLight, fontSize: '18px', fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building size={20} />
            <span>قنوات التواصل المباشرة:</span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <MapPin size={20} color={activeTheme.accent} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ display: 'block', color: activeTheme.textMain }}>العنوان والمقر الرسمي:</strong>
                <span style={{ color: activeTheme.textMuted, fontSize: '13px', lineHeight: '1.6' }}>
                  مبنى كلية العلوم - جامعة القاهرة، شارع الجامعة، محافظة الجيزة، جمهورية مصر العربية.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <Phone size={20} color={activeTheme.accent} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ display: 'block', color: activeTheme.textMain }}>أرقام التواصل والاستفسارات:</strong>
                <span style={{ color: activeTheme.textMuted, fontSize: '13px', direction: 'ltr', display: 'block', textAlign: 'right' }}>
                  +20 101 234 5678 / +20 112 987 6543
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <Mail size={20} color={activeTheme.accent} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ display: 'block', color: activeTheme.textMain }}>البريد الإلكتروني الرسمي:</strong>
                <span style={{ color: activeTheme.textMuted, fontSize: '13px' }}>contact@ssa-fscu.org</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <Clock size={20} color={activeTheme.accent} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ display: 'block', color: activeTheme.textMain }}>ساعات العمل والتواجد بالمكتب:</strong>
                <span style={{ color: activeTheme.textMuted, fontSize: '13px' }}>
                  الأحد - الخميس (من 9:00 صباحاً حتى 4:00 مساءً)
                </span>
              </div>
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${activeTheme.border}`, paddingTop: '16px' }}>
            <h4 style={{ color: activeTheme.textMain, fontSize: '14px', fontWeight: 'bold', marginBottom: '12px' }}>
              صفحات التواصل الاجتماعي الموثقة:
            </h4>
            <SocialLinks variant="detailed" />
          </div>
        </div>

        {/* كارت خريطة الموقع التفاعلية Embedded Map */}
        <div
          style={{
            background: activeTheme.bgCard,
            border: `1px solid ${activeTheme.border}`,
            borderRadius: '20px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h2 style={{ color: activeTheme.accentLight, fontSize: '16px', fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Navigation size={18} />
              <span>موقع الكلية ومقر الرابطة على الخريطة</span>
            </h2>
            <span style={{ fontSize: '11px', color: activeTheme.textMuted, background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '6px' }}>
              جامعة القاهرة - الجيزة
            </span>
          </div>

          <div style={{ width: '100%', height: '320px', borderRadius: '14px', overflow: 'hidden', border: `1px solid ${activeTheme.border}` }}>
            <iframe
              title="موقع كلية العلوم جامعة القاهرة"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3454.2185217983637!2d31.2064972!3d30.0275811!2m3!1f0!1f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145846cd759c8d11%3A0x7d6ddc90c74b1263!2sFaculty%20of%20Science%2C%20Cairo%20University!5e0!3m2!1sen!2seg!4v1700000000000!5m2!1sen!2seg"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div style={{ marginTop: '14px', fontSize: '12px', color: activeTheme.textMuted, lineHeight: '1.6' }}>
            📍 <strong>كيفية الوصول:</strong> محطة مترو جامعة القاهرة (الخط الثاني)، الدخول من البوابة الرئيسية لجامعة القاهرة أو بوابة كلية العلوم المطلة على شارع الجامعة.
          </div>
        </div>
      </div>

      {/* 3. نموذج إرسال استفسار مباشر */}
      <div
        style={{
          background: activeTheme.bgCard,
          border: `1px solid ${activeTheme.border}`,
          borderRadius: '20px',
          padding: '32px 28px',
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3)',
        }}
      >
        <h2 style={{ color: activeTheme.textMain, fontSize: '20px', fontWeight: 'bold', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageSquare color={activeTheme.accentLight} size={22} />
          <span>إرسال رسالة أو استفسار مباشر للمكتب التنفيذي</span>
        </h2>
        <p style={{ color: activeTheme.textMuted, fontSize: '13px', margin: '0 0 24px' }}>
          اكتب تفاصيل استفسارك أو اقتراحك وسيتواصل معك أحد أعضاء المكتب التنفيذي عبر البريد أو الهاتف في أقرب وقت.
        </p>

        {sentSuccess && (
          <div
            style={{
              background: 'rgba(34, 197, 94, 0.15)',
              border: '1px solid #22c55e',
              color: '#22c55e',
              padding: '14px 20px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <CheckCircle size={20} />
            <span>تم إرسال رسالتك بنجاح! شكرًا لتواصلك مع رابطة الطلاب السودانيين.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', color: activeTheme.textMain, fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>الاسم الكامل *</label>
              <input
                type="text"
                required
                placeholder="الاسم الثلاثي أو الرباعي"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={inputStyle(activeTheme)}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: activeTheme.textMain, fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>البريد الإلكتروني *</label>
              <input
                type="email"
                required
                placeholder="example@gmail.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={inputStyle(activeTheme)}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: activeTheme.textMain, fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>رقم الهاتف للتواصل</label>
              <input
                type="tel"
                placeholder="01012345678"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                style={inputStyle(activeTheme)}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: activeTheme.textMain, fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>موضوع الرسالة *</label>
              <input
                type="text"
                required
                placeholder="مثال: استفسار عن الإقامة / مذكرات المعمل"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                style={inputStyle(activeTheme)}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', color: activeTheme.textMain, fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>نص الرسالة والاستفسار *</label>
            <textarea
              rows={4}
              required
              placeholder="اكتب رسالتك بالتفصيل هنا..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              style={inputStyle(activeTheme)}
            />
          </div>

          <button
            type="submit"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: `linear-gradient(135deg, ${activeTheme.accent} 0%, #d97706 100%)`,
              color: '#0b1622',
              border: 'none',
              padding: '14px 28px',
              borderRadius: '12px',
              fontWeight: '900',
              fontSize: '15px',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(245, 158, 11, 0.35)',
              width: 'fit-content',
            }}
          >
            <Send size={18} />
            <span>إرسال الرسالة الآن</span>
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = (theme) => ({
  width: '100%',
  padding: '11px 14px',
  borderRadius: '10px',
  background: 'rgba(0, 0, 0, 0.3)',
  border: `1px solid ${theme.border}`,
  color: theme.textMain,
  fontSize: '13px',
  outline: 'none',
  direction: 'rtl',
  boxSizing: 'border-box',
});
