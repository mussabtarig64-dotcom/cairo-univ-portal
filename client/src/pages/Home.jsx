import React, { useState } from 'react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../config/api';
import {
  Sparkles,
  Compass,
  HeartHandshake,
  BookOpen,
  ArrowLeft,
  MessageSquare,
  Bot,
  Users,
  GraduationCap,
  ShieldCheck,
  CheckCircle,
  FileText,
  Search,
  Clock,
  XCircle,
  HelpCircle,
  MapPin,
  QrCode
} from 'lucide-react';
import { Link } from 'react-router-dom';
import teamImg from '../assets/team.jpg';
import SocialLinks from '../components/SocialLinks';

export default function Home() {
  const { activeTheme } = useTheme();
  const { user, isAuthenticated, isAdmin } = useAuth();

  // حالة حقل الاستعلام المباشر عن حالة القيد Application Status Tracker
  const [trackerQuery, setTrackerQuery] = useState('');
  const [trackerResult, setTrackerResult] = useState(null);
  const [trackerLoading, setTrackerLoading] = useState(false);
  const [trackerError, setTrackerError] = useState('');

  const handleStatusCheck = async (e) => {
    e.preventDefault();
    if (!trackerQuery.trim()) return;

    setTrackerLoading(true);
    setTrackerError('');
    setTrackerResult(null);

    const queryStr = trackerQuery.trim();

    try {
      const res = await axios.get(`${API_BASE}/auth/status-check/${encodeURIComponent(queryStr)}`);
      if (res.data && res.data.found) {
        setTrackerResult(res.data);
      } else {
        fallbackCheckLocal(queryStr);
      }
    } catch (err) {
      fallbackCheckLocal(queryStr);
    } finally {
      setTrackerLoading(false);
    }
  };

  const fallbackCheckLocal = (queryStr) => {
    const clean = queryStr.toLowerCase();
    const pending = JSON.parse(localStorage.getItem('pending_users') || '[]');
    const approved = JSON.parse(localStorage.getItem('approved_users') || '[]');
    const rejected = JSON.parse(localStorage.getItem('rejected_users') || '[]');

    const foundApproved = approved.find(
      (u) =>
        u.studentId?.toLowerCase() === clean ||
        u.email?.toLowerCase() === clean ||
        u.phone === clean
    );
    if (foundApproved) {
      setTrackerResult({
        found: true,
        statusKey: 'approved',
        statusLabel: 'عضو معتمد ✅',
        isApproved: true,
        student: {
          fullName: foundApproved.fullName || foundApproved.name,
          studentId: foundApproved.studentId || 'SSA-STUDENT',
          department: foundApproved.department || 'كلية العلوم',
          academicYear: foundApproved.academicYear || 'المستوى الأول',
        },
      });
      return;
    }

    const foundPending = pending.find(
      (u) =>
        u.studentId?.toLowerCase() === clean ||
        u.email?.toLowerCase() === clean ||
        u.phone === clean
    );
    if (foundPending) {
      setTrackerResult({
        found: true,
        statusKey: 'pending',
        statusLabel: 'قيد المراجعة والاعتماد ⏳',
        isPending: true,
        student: {
          fullName: foundPending.fullName || foundPending.name,
          studentId: foundPending.studentId || 'SSA-STUDENT',
          department: foundPending.department || 'كلية العلوم',
          academicYear: foundPending.academicYear || 'المستوى الأول',
        },
      });
      return;
    }

    const foundRejected = rejected.find(
      (u) =>
        u.studentId?.toLowerCase() === clean ||
        u.email?.toLowerCase() === clean ||
        u.phone === clean
    );
    if (foundRejected) {
      setTrackerResult({
        found: true,
        statusKey: 'rejected',
        statusLabel: 'طلب مرفوض / مراجعة الإدارة ❌',
        isRejected: true,
        student: {
          fullName: foundRejected.fullName || foundRejected.name,
          studentId: foundRejected.studentId || 'SSA-STUDENT',
          department: foundRejected.department || 'كلية العلوم',
          academicYear: foundRejected.academicYear || 'المستوى الأول',
        },
      });
      return;
    }

    setTrackerError('لم يتم العثور على طالب بهذا الرقم الأكاديمي أو البيانات المدخلة في السجل.');
  };

  return (
    <div style={{ paddingBottom: '60px', direction: 'rtl' }}>
      
      {/* 1. قسم البانر والترحيب الرئيسي */}
      <section style={{ maxWidth: '1200px', margin: '24px auto', padding: '0 20px' }}>
        <div
          style={{
            background: `linear-gradient(135deg, ${activeTheme.bgCard} 0%, rgba(11, 19, 43, 0.95) 100%)`,
            border: `1px solid ${activeTheme.border}`,
            borderRadius: '24px',
            padding: '40px 30px',
            boxShadow: '0 20px 45px rgba(0, 0, 0, 0.45)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* تأثير توهج خلفي */}
          <div
            style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '260px',
              height: '260px',
              background: activeTheme.primary,
              filter: 'blur(110px)',
              opacity: 0.25,
              pointerEvents: 'none',
            }}
          />

          {/* شارة الهوية السودانية للرابطة */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <span
              style={{
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                color: '#fbbf24',
                padding: '6px 20px',
                borderRadius: '24px',
                fontSize: '13px',
                fontWeight: 'bold',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Sparkles size={16} />
              <span>رابطة الطلاب السودانيين - كلية العلوم جامعة القاهرة</span>
            </span>

            <h1
              style={{
                color: activeTheme.textMain,
                fontSize: '28px',
                fontWeight: '900',
                margin: '16px 0 10px',
                lineHeight: '1.4',
              }}
            >
              من السودان إلى القاهرة… نحمل الوطن، ونصنع المستقبل
            </h1>

            <div
              style={{
                width: '80px',
                height: '4px',
                background: `linear-gradient(90deg, ${activeTheme.accent} 0%, #d97706 100%)`,
                margin: '12px auto 0',
                borderRadius: '2px',
              }}
            />
          </div>

          {/* صورة المكتب التنفيذي للرابطة */}
          <div
            style={{
              maxWidth: '850px',
              margin: '0 auto 30px auto',
              borderRadius: '16px',
              overflow: 'hidden',
              border: `2px solid ${activeTheme.border}`,
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.5)',
            }}
          >
            <img
              src={teamImg}
              alt="المكتب التنفيذي لرابطة الطلاب السودانيين"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                objectFit: 'cover',
              }}
            />
          </div>

          {/* نص الرؤية والهوية */}
          <div
            style={{
              maxWidth: '880px',
              margin: '0 auto',
              color: activeTheme.textMain,
              fontSize: '15px',
              lineHeight: '2',
              textAlign: 'justify',
            }}
          >
            <p style={{ marginBottom: '14px' }}>
              من أرض النيل، حيث تتجذر الحكايات وتتناقل الأجيال الحكمة والتراث، بدأت رحلتنا. جئنا إلى القاهرة طلباً للعلم في رحاب كلية العلوم العريقة بجامعة القاهرة، نحمل معنا هوية السودان، وذكرياته، وقيمه، وطموحات أبنائه.
            </p>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRight: `4px solid ${activeTheme.accent}`,
                padding: '16px 20px',
                borderRadius: '0 12px 12px 0',
                margin: '20px 0',
                fontSize: '15px',
                fontWeight: '600',
                lineHeight: '1.8',
              }}
            >
              «اليد الواحدة ما بتصفّق»؛ لذلك كانت الرابطة مساحة تجمعنا، تسند الطالب، وتحافظ على هويته، وتفتح له أبواب المعرفة والتطوير والفرص العلمية والمعملية.
            </div>
          </div>

          {/* قيم الرابطة الثلاثية */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
              marginTop: '28px',
              paddingTop: '20px',
              borderTop: `1px solid ${activeTheme.border}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Compass size={24} color={activeTheme.accentLight} />
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '14px', color: activeTheme.textMain }}>الأصالة والهوية</div>
                <div style={{ fontSize: '12px', color: activeTheme.textMuted }}>نحفظ قيمنا وتراثنا السوداني الأصيل</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <HeartHandshake size={24} color={activeTheme.accentLight} />
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '14px', color: activeTheme.textMain }}>التكاتف والدعم</div>
                <div style={{ fontSize: '12px', color: activeTheme.textMuted }}>سند وعون لكل طالب في الغربة</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <BookOpen size={24} color={activeTheme.accentLight} />
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '14px', color: activeTheme.textMain }}>التميز الأكاديمي</div>
                <div style={{ fontSize: '12px', color: activeTheme.textMuted }}>مستقبل علمي مشرق في كلية العلوم</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. شريط الاستعلام المباشر عن حالة القيد (Application Status Tracker) */}
      <section style={{ maxWidth: '1200px', margin: '30px auto 0', padding: '0 20px' }}>
        <div
          style={{
            background: `linear-gradient(135deg, ${activeTheme.bgCard} 0%, rgba(17, 34, 51, 0.95) 100%)`,
            border: `1px solid ${activeTheme.accent}`,
            borderRadius: '20px',
            padding: '28px 24px',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '18px' }}>
            <h2 style={{ color: activeTheme.textMain, fontSize: '20px', fontWeight: 'bold', margin: '0 0 6px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Search size={22} color={activeTheme.accentLight} />
              <span>الاستعلام الفوري عن حالة التسجيل وتدقيق القيد</span>
            </h2>
            <p style={{ color: activeTheme.textMuted, fontSize: '13px', margin: 0 }}>
              أدخل رقمك الأكاديمي، البريد الإلكتروني، أو رقم الهاتف لمعرفة حالة اعتماد حسابك في الرابطة فوراً.
            </p>
          </div>

          <form onSubmit={handleStatusCheck} style={{ maxWidth: '650px', margin: '0 auto', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 300px', position: 'relative' }}>
              <input
                type="text"
                required
                placeholder="أدخل الرقم الأكاديمي (مثال: SSA-2025-889) أو البريد..."
                value={trackerQuery}
                onChange={(e) => setTrackerQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 42px 12px 16px',
                  borderRadius: '12px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: `1px solid ${activeTheme.border}`,
                  color: activeTheme.textMain,
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  direction: 'rtl',
                }}
              />
              <Search
                size={18}
                color={activeTheme.textMuted}
                style={{ position: 'absolute', top: '50%', right: '14px', transform: 'translateY(-50%)' }}
              />
            </div>

            <button
              type="submit"
              disabled={trackerLoading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: `linear-gradient(135deg, ${activeTheme.accent} 0%, #d97706 100%)`,
                color: '#0b1622',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: 'bold',
                fontSize: '14px',
                cursor: trackerLoading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 15px rgba(245, 158, 11, 0.35)',
              }}
            >
              <span>{trackerLoading ? 'جاري الاستعلام...' : 'استعلام الآن'}</span>
            </button>
          </form>

          {/* نتيجة الاستعلام */}
          {trackerResult && (
            <div
              style={{
                maxWidth: '650px',
                margin: '20px auto 0',
                padding: '18px 20px',
                borderRadius: '14px',
                background: trackerResult.isApproved
                  ? 'rgba(34, 197, 94, 0.12)'
                  : trackerResult.isRejected
                  ? 'rgba(239, 68, 68, 0.12)'
                  : 'rgba(245, 158, 11, 0.12)',
                border: `1px solid ${
                  trackerResult.isApproved
                    ? '#22c55e'
                    : trackerResult.isRejected
                    ? '#ef4444'
                    : '#f59e0b'
                }`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {trackerResult.isApproved ? (
                  <CheckCircle size={28} color="#22c55e" />
                ) : trackerResult.isRejected ? (
                  <XCircle size={28} color="#ef4444" />
                ) : (
                  <Clock size={28} color="#f59e0b" />
                )}
                <div>
                  <div style={{ color: activeTheme.textMain, fontWeight: 'bold', fontSize: '15px' }}>
                    {trackerResult.student?.fullName}
                  </div>
                  <div style={{ color: activeTheme.textMuted, fontSize: '12px', marginTop: '2px' }}>
                    الرقم الأكاديمي: <strong>{trackerResult.student?.studentId}</strong> • {trackerResult.student?.department}
                  </div>
                </div>
              </div>

              <div
                style={{
                  padding: '6px 14px',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  background: trackerResult.isApproved
                    ? '#22c55e'
                    : trackerResult.isRejected
                    ? '#ef4444'
                    : '#f59e0b',
                  color: trackerResult.isApproved || trackerResult.isRejected ? '#ffffff' : '#0b1622',
                }}
              >
                {trackerResult.statusLabel}
              </div>
            </div>
          )}

          {trackerError && (
            <div
              style={{
                maxWidth: '650px',
                margin: '16px auto 0',
                padding: '12px 18px',
                borderRadius: '12px',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid #ef4444',
                color: '#ef4444',
                fontSize: '13px',
                textAlign: 'center',
              }}
            >
              {trackerError}
            </div>
          )}
        </div>
      </section>

      {/* 3. بوابات الغرف التفاعلية والخدمات الطلابية الشاملة */}
      <section style={{ maxWidth: '1200px', margin: '40px auto 0', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ color: activeTheme.textMain, fontSize: '22px', fontWeight: 'bold', margin: '0 0 6px' }}>
            أقسام وغرف المنصة التفاعلية والخدمات الأكاديمية
          </h2>
          <p style={{ color: activeTheme.textMuted, fontSize: '13px', margin: 0 }}>
            خدمات متكاملة مخصصة لطلاب كلية العلوم جامعة القاهرة
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '20px' }}>
          
          {/* المكتبة الأكاديمية الرقمية */}
          <Link to="/library" style={featureCardStyle(activeTheme)}>
            <div style={{
              width: '46px', height: '46px', borderRadius: '12px',
              background: 'rgba(245, 158, 11, 0.15)', border: '1px solid #f59e0b',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24', marginBottom: '14px'
            }}>
              <BookOpen size={22} />
            </div>
            <h3 style={{ color: activeTheme.textMain, fontSize: '16px', fontWeight: 'bold', margin: '0 0 8px' }}>
              المكتبة الرقمية وأرشيف الامتحانات
            </h3>
            <p style={{ color: activeTheme.textMuted, fontSize: '13px', lineHeight: '1.6', margin: '0 0 14px' }}>
              تصفح وتنزيل مذكرات المعامل، ملخصات المواد، والامتحانات السابقة مقسمة بالأقسام.
            </p>
            <span style={{ color: '#fbbf24', fontSize: '12px', fontWeight: 'bold' }}>دخول المكتبة الرقمية ←</span>
          </Link>

          {/* البطاقة الرقمية */}
          <Link to="/digital-id" style={featureCardStyle(activeTheme)}>
            <div style={{
              width: '46px', height: '46px', borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399', marginBottom: '14px'
            }}>
              <QrCode size={22} />
            </div>
            <h3 style={{ color: activeTheme.textMain, fontSize: '16px', fontWeight: 'bold', margin: '0 0 8px' }}>
              بطاقة العضوية الرقمية (Digital ID)
            </h3>
            <p style={{ color: activeTheme.textMuted, fontSize: '13px', lineHeight: '1.6', margin: '0 0 14px' }}>
              عرض واستخراج كارت العضوية الرسمي المطبوع المزود بـ QR Code لإثبات القيد.
            </p>
            <span style={{ color: '#34d399', fontSize: '12px', fontWeight: 'bold' }}>عرض بطاقتي الرقمية ←</span>
          </Link>

          {/* الأسئلة الشائعة FAQ */}
          <Link to="/faq" style={featureCardStyle(activeTheme)}>
            <div style={{
              width: '46px', height: '46px', borderRadius: '12px',
              background: 'rgba(59, 130, 246, 0.15)', border: '1px solid #3b82f6',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa', marginBottom: '14px'
            }}>
              <HelpCircle size={22} />
            </div>
            <h3 style={{ color: activeTheme.textMain, fontSize: '16px', fontWeight: 'bold', margin: '0 0 8px' }}>
              الأسئلة الشائعة وتدقيق القيد
            </h3>
            <p style={{ color: activeTheme.textMuted, fontSize: '13px', lineHeight: '1.6', margin: '0 0 14px' }}>
              إرشادات تفصيلية عن الإقامة، السكن، المعادلة، ونظام الدراسة بكلية العلوم.
            </p>
            <span style={{ color: '#60a5fa', fontSize: '12px', fontWeight: 'bold' }}>استعراض الأسئلة والإرشادات ←</span>
          </Link>

          {/* اتصل بنا والمقر */}
          <Link to="/contact" style={featureCardStyle(activeTheme)}>
            <div style={{
              width: '46px', height: '46px', borderRadius: '12px',
              background: 'rgba(236, 72, 153, 0.15)', border: '1px solid #ec4899',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f472b6', marginBottom: '14px'
            }}>
              <MapPin size={22} />
            </div>
            <h3 style={{ color: activeTheme.textMain, fontSize: '16px', fontWeight: 'bold', margin: '0 0 8px' }}>
              اتصل بنا وخريطة المقر
            </h3>
            <p style={{ color: activeTheme.textMuted, fontSize: '13px', lineHeight: '1.6', margin: '0 0 14px' }}>
              أرقام التواصل الرسمية، قنوات المراسلة المباشرة، وخريطة الموقع بكلية العلوم.
            </p>
            <span style={{ color: '#f472b6', fontSize: '12px', fontWeight: 'bold' }}>موقع الرابطة والتواصل ←</span>
          </Link>

          {/* غرفة المنشورات */}
          <Link to="/posts" style={featureCardStyle(activeTheme)}>
            <div style={{
              width: '46px', height: '46px', borderRadius: '12px',
              background: 'rgba(99, 102, 241, 0.15)', border: '1px solid #6366f1',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8', marginBottom: '14px'
            }}>
              <MessageSquare size={22} />
            </div>
            <h3 style={{ color: activeTheme.textMain, fontSize: '16px', fontWeight: 'bold', margin: '0 0 8px' }}>
              الملتقى الأكاديمي والمنشورات
            </h3>
            <p style={{ color: activeTheme.textMuted, fontSize: '13px', lineHeight: '1.6', margin: '0 0 14px' }}>
              مشاركة المذكرات ومستندات PDF، حلول تقارير المعامل، والتفاعل المباشر بين الطلاب.
            </p>
            <span style={{ color: '#818cf8', fontSize: '12px', fontWeight: 'bold' }}>دخول الملتقى ←</span>
          </Link>

          {/* غرفة الذكاء الاصطناعي */}
          <Link to="/ai" style={featureCardStyle(activeTheme)}>
            <div style={{
              width: '46px', height: '46px', borderRadius: '12px',
              background: 'rgba(234, 179, 8, 0.15)', border: '1px solid #eab308',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fde047', marginBottom: '14px'
            }}>
              <Bot size={22} />
            </div>
            <h3 style={{ color: activeTheme.textMain, fontSize: '16px', fontWeight: 'bold', margin: '0 0 8px' }}>
              المستشار الأكاديمي والرفيق الذكي
            </h3>
            <p style={{ color: activeTheme.textMuted, fontSize: '13px', lineHeight: '1.6', margin: '0 0 14px' }}>
              شات بوت ذكي مدرب على مناهج كلية العلوم ولوائح الساعات المعتمدة وإجراءات الإقامة.
            </p>
            <span style={{ color: '#fde047', fontSize: '12px', fontWeight: 'bold' }}>استشارة الذكاء الاصطناعي ←</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

const featureCardStyle = (theme) => ({
  background: theme.bgCard,
  border: `1px solid ${theme.border}`,
  borderRadius: '18px',
  padding: '24px',
  textDecoration: 'none',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
  boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
});