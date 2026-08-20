import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
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
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import teamImg from '../assets/team.jpg';
import SocialLinks from '../components/SocialLinks';

export default function Home() {
  const { activeTheme } = useTheme();
  const { user, isAuthenticated, isAdmin } = useAuth();

  return (
    <div style={{ paddingBottom: '60px', direction: 'rtl' }}>
      
      {/* 1. قسم البانر والترحيب الرئيسي الفخم */}
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

      {/* 2. بوابات الغرف التفاعلية والخدمات الطلابية */}
      <section style={{ maxWidth: '1200px', margin: '40px auto 0', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ color: activeTheme.textMain, fontSize: '22px', fontWeight: 'bold', margin: '0 0 6px' }}>
            أقسام وغرف المنصة التفاعلية
          </h2>
          <p style={{ color: activeTheme.textMuted, fontSize: '13px', margin: 0 }}>
            خدمات متكاملة مخصصة لطلاب كلية العلوم جامعة القاهرة
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {/* غرفة المنشورات */}
          <Link
            to="/posts"
            style={featureCardStyle(activeTheme)}
          >
            <div style={{
              width: '46px', height: '46px', borderRadius: '12px',
              background: 'rgba(59, 130, 246, 0.15)', border: '1px solid #3b82f6',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa', marginBottom: '14px'
            }}>
              <MessageSquare size={22} />
            </div>
            <h3 style={{ color: activeTheme.textMain, fontSize: '16px', fontWeight: 'bold', margin: '0 0 8px' }}>
              غرفة المنشورات والملتقى الأكاديمي
            </h3>
            <p style={{ color: activeTheme.textMuted, fontSize: '13px', lineHeight: '1.6', margin: '0 0 14px' }}>
              مشاركة المذكرات ومستندات PDF، حلول تقارير المعامل، والتفاعل المباشر بين الطلاب.
            </p>
            <span style={{ color: '#60a5fa', fontSize: '12px', fontWeight: 'bold' }}>دخول الملتقى ←</span>
          </Link>

          {/* غرفة الذكاء الاصطناعي */}
          <Link
            to="/ai"
            style={featureCardStyle(activeTheme)}
          >
            <div style={{
              width: '46px', height: '46px', borderRadius: '12px',
              background: 'rgba(245, 158, 11, 0.15)', border: '1px solid #f59e0b',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24', marginBottom: '14px'
            }}>
              <Bot size={22} />
            </div>
            <h3 style={{ color: activeTheme.textMain, fontSize: '16px', fontWeight: 'bold', margin: '0 0 8px' }}>
              المستشار الأكاديمي والرفيق الذكي
            </h3>
            <p style={{ color: activeTheme.textMuted, fontSize: '13px', lineHeight: '1.6', margin: '0 0 14px' }}>
              شات بوت ذكي مدرب على مناهج كلية العلوم ولوائح الساعات المعتمدة وإجراءات الإقامة.
            </p>
            <span style={{ color: '#fbbf24', fontSize: '12px', fontWeight: 'bold' }}>استشارة الذكاء الاصطناعي ←</span>
          </Link>

          {/* غرف المذاكرة ودليل المستجدين */}
          <Link
            to="/chat"
            style={featureCardStyle(activeTheme)}
          >
            <div style={{
              width: '46px', height: '46px', borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399', marginBottom: '14px'
            }}>
              <Users size={22} />
            </div>
            <h3 style={{ color: activeTheme.textMain, fontSize: '16px', fontWeight: 'bold', margin: '0 0 8px' }}>
              غرف المذاكرة واستقبال الجدد
            </h3>
            <p style={{ color: activeTheme.textMuted, fontSize: '13px', lineHeight: '1.6', margin: '0 0 14px' }}>
              مساحات دراسية تخصصية بالأقسام + دليل شامل للمستجدين عن الإقامة والسكن والجامعة.
            </p>
            <span style={{ color: '#34d399', fontSize: '12px', fontWeight: 'bold' }}>انضمام للغرف والمحادثات ←</span>
          </Link>

          {/* استمارة التسجيل والاستبيان */}
          {!isAuthenticated ? (
            <Link
              to="/register"
              style={featureCardStyle(activeTheme)}
            >
              <div style={{
                width: '46px', height: '46px', borderRadius: '12px',
                background: 'rgba(168, 85, 247, 0.15)', border: '1px solid #a855f7',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc', marginBottom: '14px'
              }}>
                <GraduationCap size={22} />
              </div>
              <h3 style={{ color: activeTheme.textMain, fontSize: '16px', fontWeight: 'bold', margin: '0 0 8px' }}>
                استمارة التسجيل المركزي والاستبيان
              </h3>
              <p style={{ color: activeTheme.textMuted, fontSize: '13px', lineHeight: '1.6', margin: '0 0 14px' }}>
                تسجيل بيانات القيد والسكن ورفع إثبات الهوية للانضمام للسجل الرسمي للرابطة.
              </p>
              <span style={{ color: '#c084fc', fontSize: '12px', fontWeight: 'bold' }}>تعبئة الاستمارة الآن ←</span>
            </Link>
          ) : isAdmin ? (
            <Link
              to="/admin"
              style={featureCardStyle(activeTheme)}
            >
              <div style={{
                width: '46px', height: '46px', borderRadius: '12px',
                background: 'rgba(234, 179, 8, 0.2)', border: '1px solid #f59e0b',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24', marginBottom: '14px'
              }}>
                <ShieldCheck size={22} />
              </div>
              <h3 style={{ color: activeTheme.textMain, fontSize: '16px', fontWeight: 'bold', margin: '0 0 8px' }}>
                لوحة الإدارة والسجل المركزي
              </h3>
              <p style={{ color: activeTheme.textMuted, fontSize: '13px', lineHeight: '1.6', margin: '0 0 14px' }}>
                مراجعة استبيانات الطلاب، معاينة الهويات، تعيين الأدمنز، وتصدير ملفات CSV.
              </p>
              <span style={{ color: '#fbbf24', fontSize: '12px', fontWeight: 'bold' }}>فتح لوحة الإدارة ←</span>
            </Link>
          ) : null}
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