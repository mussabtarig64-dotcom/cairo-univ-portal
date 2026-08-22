import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  Award,
  GraduationCap,
  Sparkles,
  Heart,
  Trophy,
  Medal,
  Star,
  Users,
  CheckCircle2
} from 'lucide-react';

export default function AchievementsHub() {
  const { activeTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('honor');

  const tabs = [
    { id: 'honor', label: 'لوحة الشرف والمتفوقون', icon: GraduationCap, count: 'امتياز مع مرتبة الشرف' },
    { id: 'distinguished', label: 'المتميزون والباحثون', icon: Sparkles, count: 'جوائز وابتكارات' },
    { id: 'volunteers', label: 'فرسان التطوع', icon: Heart, count: 'عطاء مجتمعي' },
    { id: 'athletes', label: 'أبطال الرياضة', icon: Trophy, count: 'كؤوس وميداليات' },
  ];

  const topStudents = [
    { name: 'مصعب طارق', major: 'الكيمياء منفرد', gpa: '3.92 / 4.00 (امتياز)', year: 'المستوى الرابع', award: 'درع التفوق الأكاديمي لعام 2025' },
    { name: 'سارة عبد الرحمن', major: 'التكنولوجيا الحيوية', gpa: '3.88 / 4.00 (امتياز)', year: 'المستوى الثالث', award: 'وسام التميز في أبحاث الجينوم' },
    { name: 'محمد الفاتح', major: 'الفيزياء الحيوية', gpa: '3.85 / 4.00 (امتياز)', year: 'المستوى الرابع', award: 'جائزة الابتكار في الأجهزة الطبية' },
    { name: 'ريان صديق', major: 'مزدوج كيمياء / ميكرو', gpa: '3.82 / 4.00 (امتياز)', year: 'المستوى الثالث', award: 'درع التميز المخبري والبحثي' },
  ];

  const distinguished = [
    { name: 'فريق الطاقة الحيوية النظيفة', project: 'إنتاج الوقود الحيوي من الطحالب الدقيقة', achievement: 'المركز الأول في هاكاثون الابتكار الأخضر 2025' },
    { name: 'أحمد الصادق محمد', project: 'تطوير منصة SSA التعليمية الذكية', achievement: 'جائزة التميز في التحول الرقمي وخدمة الطلاب' },
    { name: 'إيناس عبد الله', project: 'بحث منشور في المؤتمر الدولي للفيزياء التطبيقية', achievement: 'أفضل ورقة بحثية لطلاب البكالوريوس' },
  ];

  const volunteers = [
    { name: 'لجنة استقبال الطلاب الجدد', impact: 'خدمة أكثر من 180 طالباً ومرافقتهم لإجراءات الكلية والسكن', badge: 'وسام العطاء الذهبي' },
    { name: 'فريق الصندوق التكافلي الطبي', impact: 'تغطية نفقات الرعاية الصحية والخصومات لـ 120 حالة', badge: 'درع الإنسانية' },
    { name: 'فريق تنظيم المعارض والمؤتمرات', impact: 'إدارة 12 فعالية أكاديمية وثقافية كبرى على مدار العام', badge: 'وسام الإنجاز الميداني' },
  ];

  const athletes = [
    { name: 'منتخب كلية العلوم (SSA FC)', achievement: 'بطل دوري خماسيات الجامعات المصرية للطلاب الوافدين 2025', icon: '🏆' },
    { name: 'عمر النور أحمد', achievement: 'الميدالية الذهبية في بطولة الشطرنج السريع للجامعات', icon: '🥇' },
    { name: 'ياسر محمد علي', achievement: 'أفضل لاعب وهداف بطولة الاستقلال لكرة القدم', icon: '⭐' },
  ];

  return (
    <div style={{ minHeight: '90vh', paddingBottom: '70px', direction: 'rtl' }}>
      {/* Hero */}
      <div
        style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #1c1917 0%, #292524 50%, #44403c 100%)',
          borderBottom: `2px solid ${activeTheme.accent}`,
          padding: '55px 20px 45px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
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
              marginBottom: '16px',
            }}
          >
            <Award size={16} />
            <span>لوحة الفخر والتكريم الأكاديمي والطلابي</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(28px, 5vw, 40px)',
              fontWeight: '900',
              color: '#ffffff',
              margin: '0 0 14px',
            }}
          >
            التكريم والإنجازات .. فخر كلية العلوم
          </h1>

          <p
            style={{
              maxWidth: '750px',
              margin: '0 auto 24px',
              fontSize: '15px',
              lineHeight: '1.8',
              color: 'rgba(255, 255, 255, 0.85)',
            }}
          >
            توثيق إنجازات الطلاب المتفوقين في الأقسام العلمية، والمبتكرين في البحث العلمي، وفرسان العمل التطوعي والإنساني، وأبطال المحافل الرياضية.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ maxWidth: '1200px', margin: '30px auto 0', padding: '0 20px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            backgroundColor: activeTheme.bgCard,
            padding: '8px',
            borderRadius: '18px',
            border: `1px solid ${activeTheme.border}`,
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: isSelected ? `2px solid ${activeTheme.accent}` : '2px solid transparent',
                  background: isSelected ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
                  color: isSelected ? activeTheme.accentLight : activeTheme.textMain,
                  cursor: 'pointer',
                  fontWeight: isSelected ? 'bold' : '600',
                  fontSize: '13px',
                  textAlign: 'right',
                }}
              >
                <Icon size={20} color={isSelected ? activeTheme.accent : activeTheme.textMuted} />
                <div>
                  <div>{tab.label}</div>
                  <div style={{ fontSize: '11px', color: activeTheme.textMuted, fontWeight: 'normal' }}>
                    {tab.count}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1200px', margin: '30px auto 0', padding: '0 20px' }}>
        {activeTab === 'honor' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {topStudents.map((st, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: activeTheme.bgCard,
                  borderRadius: '18px',
                  border: `1px solid ${activeTheme.border}`,
                  padding: '24px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '24px' }}>🎓</span>
                  <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>
                    {st.gpa}
                  </span>
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: activeTheme.textMain, margin: '0 0 6px' }}>
                  {st.name}
                </h3>
                <div style={{ fontSize: '13px', color: activeTheme.accentLight, fontWeight: 'bold', marginBottom: '6px' }}>
                  {st.major} ({st.year})
                </div>
                <div style={{ background: 'rgba(0,0,0,0.25)', padding: '10px 14px', borderRadius: '10px', fontSize: '12px', color: activeTheme.textMain }}>
                  🏅 {st.award}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'distinguished' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {distinguished.map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: activeTheme.bgCard,
                  borderRadius: '18px',
                  border: `1px solid ${activeTheme.border}`,
                  padding: '24px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                }}
              >
                <span style={{ fontSize: '28px', display: 'block', marginBottom: '10px' }}>💡</span>
                <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: activeTheme.textMain, margin: '0 0 6px' }}>
                  {item.name}
                </h3>
                <div style={{ fontSize: '13px', color: activeTheme.accentLight, fontWeight: 'bold', marginBottom: '10px' }}>
                  مشروع: {item.project}
                </div>
                <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid #10b981', padding: '10px 14px', borderRadius: '10px', fontSize: '12px', color: '#34d399', fontWeight: 'bold' }}>
                  ✨ {item.achievement}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'volunteers' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {volunteers.map((v, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: activeTheme.bgCard,
                  borderRadius: '18px',
                  border: `1px solid ${activeTheme.border}`,
                  padding: '24px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '28px' }}>🤝</span>
                  <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>
                    {v.badge}
                  </span>
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: activeTheme.textMain, margin: '0 0 10px' }}>
                  {v.name}
                </h3>
                <p style={{ fontSize: '13px', color: activeTheme.textMuted, lineHeight: '1.7', margin: 0 }}>
                  {v.impact}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'athletes' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {athletes.map((a, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: activeTheme.bgCard,
                  borderRadius: '18px',
                  border: `1px solid ${activeTheme.border}`,
                  padding: '24px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{a.icon}</div>
                <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: activeTheme.textMain, margin: '0 0 8px' }}>
                  {a.name}
                </h3>
                <p style={{ fontSize: '13px', color: activeTheme.accentLight, fontWeight: 'bold', margin: 0 }}>
                  {a.achievement}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
