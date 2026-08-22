import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  HeartHandshake,
  Users,
  HandHeart,
  Home,
  CheckCircle,
  Sparkles,
  ChevronRight,
  Shield,
  HelpCircle,
  PhoneCall
} from 'lucide-react';

export default function SocialHub() {
  const { activeTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('initiatives');

  const tabs = [
    { id: 'initiatives', label: 'المبادرات المجتمعية', icon: HeartHandshake, desc: 'حملات التكافل والدعم' },
    { id: 'volunteer', label: 'التطوع والخدمة العامة', icon: HandHeart, desc: 'لجان العمل الميداني' },
    { id: 'support', label: 'دعم ومساندة الطلاب', icon: HelpCircle, desc: 'السكن، الإعانات، الإرشاد' },
    { id: 'families', label: 'نظام الأسر الطلابية', icon: Home, desc: 'أسر الأقسام والولايات' },
  ];

  const initiatives = [
    {
      title: 'مبادرة الإسناد السكني للطلاب الجدد',
      badge: 'مبادرة مستمرة',
      color: '#10b981',
      desc: 'مساعدة الطلاب المستجدين والوافدين في تأمين سكن جامعي آمن ومناسب بالقرب من كليات جامعة القاهرة، وتوفير الدليل السكني.',
      impact: 'تم تسكين أكثر من 85 طالباً وطالبة هذا الفصل.',
    },
    {
      title: 'صندوق التكافل الطبي والصحي',
      badge: 'خدمة عاجلة',
      color: '#3b82f6',
      desc: 'توفير بطاقات خصم علاجية، وتنسيق الرعاية الصحية الطارئة مع المستشفيات والمراكز الطبية المعتمدة للطلاب السودانيين.',
      impact: 'تغطية خصومات طبية لـ 120+ حالة مرضية.',
    },
    {
      title: 'مشروع الحقيبة الدراسية والكتب الجامعية',
      badge: 'أكاديمي اجتماعي',
      color: '#f59e0b',
      desc: 'جمع وتدوير المراجع الأكاديمية والآلات الحاسبة وأدوات المعامل لتسليمها مجاناً للطلاب في بداية كل فصل دراسي.',
      impact: 'توزيع أكثر من 200 مرجع وملازم دراسية.',
    },
    {
      title: 'إفطار رمضان السنوي والتجمع العائلي',
      badge: 'تراثي واجتماعي',
      color: '#8b5cf6',
      desc: 'إقامة مائدة الإفطار الجماعي الكبرى لطلاب وأسر الجالية السودانية بالقاهرة لتعزيز روح الأخوة والألفة في الغربة.',
      impact: 'حضور أكثر من 450 طالباً وخريجاً سنوياً.',
    },
  ];

  const volunteerTeams = [
    {
      name: 'لجنة استقبال الطلاب الجدد بمطار القاهرة والمواقف',
      role: 'الترحيب، التوجيه، وإجراءات الوصول والإقامة الأولى',
      members: '25 متطوعاً نشطاً',
      icon: '✈️',
    },
    {
      name: 'فريق الدعم الميداني وحالات الطوارئ',
      role: 'التدخل السريع في الحالات الصحية والطارئة للطلاب على مدار 24 ساعة',
      members: '18 متطوعاً مسجلاً',
      icon: '🚑',
    },
    {
      name: 'لجنة تنظيم الفعاليات والملتقيات الكبرى',
      role: 'إدارة اللوجستيات، المسارح، البروتوكول، وتنظيم المعارض',
      members: '30 متطوعاً',
      icon: '🎪',
    },
  ];

  const studentFamilies = [
    {
      name: 'أسرة النيلين الطلابية',
      scope: 'تجمع طلاب الخرطوم والوسط',
      activities: 'ندوات فكرية، رحلات نيلية، وتكافل اجتماعي',
      lead: 'أحمد البدوي',
    },
    {
      name: 'أسرة التاكا وسواكن',
      scope: 'تجمع طلاب الشرق والبحر الأحمر',
      activities: 'معارض تراث البجا، دورات تدريبية، ولقاءات ثقافية',
      lead: 'إدريس محمد',
    },
    {
      name: 'أسرة كرمة والبركل',
      scope: 'تجمع طلاب الشمالية ونهر النيل',
      activities: 'توثيق التاريخ والحضارات القديمة والمذاكرة الجماعية',
      lead: 'سيف الدين عثمان',
    },
    {
      name: 'أسرة مرة والرمال الذهبية',
      scope: 'تجمع طلاب كردفان ودارفور',
      activities: 'أمسيات شعرية، بطولات رياضية، ومبادرات العون المشترك',
      lead: 'منصور آدم',
    },
  ];

  return (
    <div style={{ minHeight: '90vh', paddingBottom: '70px', direction: 'rtl' }}>
      {/* Hero */}
      <div
        style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #062b25 0%, #0d4439 50%, #1a332d 100%)',
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
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid #10b981',
              padding: '6px 18px',
              borderRadius: '30px',
              color: '#34d399',
              fontSize: '13px',
              fontWeight: 'bold',
              marginBottom: '16px',
            }}
          >
            <HeartHandshake size={16} />
            <span>قطاع الشؤون الاجتماعية والعمل التطوعي</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(28px, 5vw, 40px)',
              fontWeight: '900',
              color: '#ffffff',
              margin: '0 0 14px',
            }}
          >
            الملتقى الاجتماعي ونظام الأسر والمبادرات
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
            تجسيد قيم التكافل والإخاء بين الطلاب السودانيين بكلية العلوم، عبر إطلاق المبادرات الإنسانية، وتنظيم العمل التطوعي، وبناء شبكة دعم طلابي وأسري متكاملة في مصر.
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
                    {tab.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1200px', margin: '30px auto 0', padding: '0 20px' }}>
        {activeTab === 'initiatives' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {initiatives.map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: activeTheme.bgCard,
                  borderRadius: '18px',
                  border: `1px solid ${activeTheme.border}`,
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                }}
              >
                <div>
                  <span
                    style={{
                      backgroundColor: `${item.color}20`,
                      color: item.color,
                      border: `1px solid ${item.color}`,
                      padding: '3px 10px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      display: 'inline-block',
                      marginBottom: '12px',
                    }}
                  >
                    {item.badge}
                  </span>
                  <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: activeTheme.textMain, margin: '0 0 10px' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: activeTheme.textMuted, lineHeight: '1.7', margin: '0 0 14px' }}>
                    {item.desc}
                  </p>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.25)', padding: '10px 14px', borderRadius: '10px', fontSize: '12px', color: activeTheme.accentLight }}>
                  ✨ <strong>الأثر المحقق:</strong> {item.impact}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'volunteer' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {volunteerTeams.map((team, idx) => (
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
                <div style={{ fontSize: '30px', marginBottom: '12px' }}>{team.icon}</div>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: activeTheme.textMain, margin: '0 0 8px' }}>
                  {team.name}
                </h3>
                <p style={{ fontSize: '13px', color: activeTheme.textMuted, lineHeight: '1.7', margin: '0 0 12px' }}>
                  {team.role}
                </p>
                <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 'bold' }}>
                  👥 قوة الفريق: {team.members}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'support' && (
          <div
            style={{
              backgroundColor: activeTheme.bgCard,
              borderRadius: '20px',
              border: `1px solid ${activeTheme.border}`,
              padding: '30px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: activeTheme.textMain, marginBottom: '16px' }}>
              خدمات الدعم والإرشاد الطلابي العاجل
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '16px', borderRadius: '12px', border: `1px solid ${activeTheme.border}` }}>
                <h4 style={{ color: activeTheme.accentLight, margin: '0 0 8px', fontSize: '15px' }}>🏢 السكن الجامعي والمغتربين</h4>
                <p style={{ color: activeTheme.textMuted, fontSize: '12px', lineHeight: '1.7', margin: 0 }}>
                  توفير قوائم الشقق الطلابية المعتمدة والتنسيق مع وكلاء الإسكان لتخفيض التأمين ورسوم الإيجار.
                </p>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '16px', borderRadius: '12px', border: `1px solid ${activeTheme.border}` }}>
                <h4 style={{ color: activeTheme.accentLight, margin: '0 0 8px', fontSize: '15px' }}>📜 الإجراءات القنصلية والإقامات</h4>
                <p style={{ color: activeTheme.textMuted, fontSize: '12px', lineHeight: '1.7', margin: 0 }}>
                  إرشادات استخراج إقامة الدراسة بمجمع التحرير والعباسية وتصديق الشهادات بالسفارة السودانية بالقاهرة.
                </p>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '16px', borderRadius: '12px', border: `1px solid ${activeTheme.border}` }}>
                <h4 style={{ color: activeTheme.accentLight, margin: '0 0 8px', fontSize: '15px' }}>🤝 الإرشاد النفسي والأكاديمي</h4>
                <p style={{ color: activeTheme.textMuted, fontSize: '12px', lineHeight: '1.7', margin: 0 }}>
                  جلسات استشارية مع أساتذة وخريجين لمساعدة الطلاب في التغلب على ضغوط الدراسة والغربة.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'families' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {studentFamilies.map((fam, idx) => (
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <Home size={20} color={activeTheme.accent} />
                  <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: activeTheme.textMain, margin: 0 }}>
                    {fam.name}
                  </h3>
                </div>
                <div style={{ fontSize: '12px', color: activeTheme.accentLight, fontWeight: 'bold', marginBottom: '8px' }}>
                  النطاق: {fam.scope}
                </div>
                <p style={{ fontSize: '13px', color: activeTheme.textMuted, lineHeight: '1.7', margin: '0 0 12px' }}>
                  {fam.activities}
                </p>
                <div style={{ fontSize: '12px', color: activeTheme.textMain, background: 'rgba(0,0,0,0.25)', padding: '8px 12px', borderRadius: '8px' }}>
                  👤 مسؤول الأسرة: {fam.lead}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
