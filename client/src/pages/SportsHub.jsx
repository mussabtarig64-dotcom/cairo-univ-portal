import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  Trophy,
  Users,
  Calendar,
  Award,
  Flame,
  Shield,
  Star,
  Activity,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Clock,
  MapPin,
  Search,
  Filter
} from 'lucide-react';

export default function SportsHub() {
  const { activeTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('tournaments');
  const [filterCategory, setFilterCategory] = useState('all');

  const tabs = [
    { id: 'tournaments', label: 'البطولات', icon: Trophy, count: '4 منافسات' },
    { id: 'teams', label: 'الفرق', icon: Users, count: '8 فرق علمية' },
    { id: 'results', label: 'النتائج والمباريات', icon: Calendar, count: 'مباشر وتاريخي' },
    { id: 'standings', label: 'الترتيب', icon: TrendingUp, count: 'جدول الدوري' },
    { id: 'scorers', label: 'الهدافين', icon: Flame, count: 'الحذاء الذهبي' },
    { id: 'halloffame', label: 'سجل الأبطال', icon: Award, count: 'لوحة الشرف' },
  ];

  // 1. بيانات البطولات
  const tournaments = [
    {
      id: 1,
      title: 'دوري كلية العلوم للطلاب السودانيين (SSA League 2026)',
      sport: 'كرة قدم (خماسيات)',
      status: 'جارية الآن',
      statusColor: '#10b981',
      date: 'فبراير - إبريل 2026',
      venue: 'ملاعب الجامعة - الجيزة',
      teamsCount: 8,
      desc: 'البطولة الكبرى السنوية التي تجمع فرق الأقسام والتخصصات العلمية المختلفة للتنافس على درع الكلية.',
      prize: 'كأس البطولة + ميداليات ذهبية + جوائز عينية',
    },
    {
      id: 2,
      title: 'كأس الاستقلال والتلاحم الوطني',
      sport: 'كرة قدم',
      status: 'قادمة قريباً',
      statusColor: '#f59e0b',
      date: 'مايو 2026',
      venue: 'نادي النيل الرياضي',
      teamsCount: 12,
      desc: 'بطولة مجمعة بمشاركة وفود وروابط الكليات الأخرى بجامعة القاهرة.',
      prize: 'كأس الاستقلال والدرع التذكاري',
    },
    {
      id: 3,
      title: 'بطولة كلية العلوم للشطرنج السريع (SSA Chess Masters)',
      sport: 'شطرنج',
      status: 'تسجيل مفتوح',
      statusColor: '#3b82f6',
      date: 'مارس 2026',
      venue: 'قاعة الأنشطة الطلابية',
      teamsCount: 24,
      desc: 'منافسات الفكر والتكتيك بنظام الشطرنج السويسري الفردي لتحديد بطل الكلية.',
      prize: 'وسام العبقرية + ساعة شطرنج احترافية',
    },
    {
      id: 4,
      title: 'دوري تنس الطاولة والرياضات الفردية',
      sport: 'تنس طاولة',
      status: 'قيد الإعداد',
      statusColor: '#8b5cf6',
      date: 'إبريل 2026',
      venue: 'صالة الألعاب الرياضية',
      teamsCount: 16,
      desc: 'تصفيات فردية وزوجية لطلاب وطالبات الكلية مع تحكيم رسمي معتمد.',
      prize: 'ميداليات التميز الفردي',
    },
  ];

  // 2. بيانات الفرق
  const teams = [
    {
      id: 'chem',
      name: 'فرسان الكيمياء (Chemistry FC)',
      major: 'قسم الكيمياء المنفرد والمزدوج',
      captain: 'مصعب طارق',
      color: '#eab308',
      rating: '⭐⭐⭐⭐⭐',
      matches: 5,
      points: 13,
      badge: '⚗️',
      players: ['مصعب طارق (C)', 'أحمد الهادي', 'سامي عثمان', 'محمد صلاح', 'عمر ياسين', 'خالد النور'],
    },
    {
      id: 'phys',
      name: 'صقور الفيزياء (Physics Eagles)',
      major: 'قسم الفيزياء والفيزياء الحيوية',
      captain: 'ياسر محمد علي',
      color: '#3b82f6',
      rating: '⭐⭐⭐⭐',
      matches: 5,
      points: 11,
      badge: '⚡',
      players: ['ياسر محمد (C)', 'إبراهيم النيل', 'عبد الله حسن', 'بدر الدين', 'مازن كمال', 'حسام علي'],
    },
    {
      id: 'biotech',
      name: 'أسود البيوتكنولوجي (Biotech Lions)',
      major: 'التكنولوجيا الحيوية والكيمياء الحيوية',
      captain: 'هيثم عبد الرحمن',
      color: '#10b981',
      rating: '⭐⭐⭐⭐⭐',
      matches: 5,
      points: 10,
      badge: '🧬',
      players: ['هيثم عبد الرحمن (C)', 'طارق محمود', 'معتز الطيب', 'عمار جعفر', 'أيمن سيف', 'وليد بشير'],
    },
    {
      id: 'geology',
      name: 'عمالقة الجيولوجيا (Geology Titans)',
      major: 'قسم الجيولوجيا والعلوم الأرضية',
      captain: 'نزار فضل الله',
      color: '#d97706',
      rating: '⭐⭐⭐⭐',
      matches: 5,
      points: 8,
      badge: '💎',
      players: ['نزار فضل (C)', 'سيف الدين', 'عثمان أحمد', 'موسى إدريس', 'جعفر هاشم', 'صالح يحيى'],
    },
    {
      id: 'micro',
      name: 'نمور الميكروبيولوجي (Micro Tigers)',
      major: 'مزدوج كيمياء / ميكرو',
      captain: 'فيصل النور',
      color: '#ec4899',
      rating: '⭐⭐⭐',
      matches: 5,
      points: 6,
      badge: '🔬',
      players: ['فيصل النور (C)', 'بشير عبد الله', 'عادل عوض', 'عصام مجذوب', 'فاروق ميرغني'],
    },
    {
      id: 'botany',
      name: 'أبطال النبات والبيئة (Botany Green)',
      major: 'مزدوج كيمياء / نبات وحيوان',
      captain: 'عمر صديق',
      color: '#22c55e',
      rating: '⭐⭐⭐',
      matches: 5,
      points: 4,
      badge: '🌿',
      players: ['عمر صديق (C)', 'حامد السر', 'عبد القيوم', 'منذر الزبير', 'أمجد توفيق'],
    },
  ];

  // 3. النتائج والمباريات
  const matches = [
    {
      round: 'الجولة الخامسة (مباشر / منتهية)',
      team1: 'فرسان الكيمياء',
      team2: 'صقور الفيزياء',
      score1: 3,
      score2: 2,
      date: 'الخميس، 18 فبراير 2026',
      motm: 'مصعب طارق (كيمياء)',
      status: 'انتهت',
    },
    {
      round: 'الجولة الخامسة',
      team1: 'أسود البيوتكنولوجي',
      team2: 'عمالقة الجيولوجيا',
      score1: 4,
      score2: 1,
      date: 'الخميس، 18 فبراير 2026',
      motm: 'طارق محمود (بيوتكنولوجي)',
      status: 'انتهت',
    },
    {
      round: 'الجولة السادسة (القادمة)',
      team1: 'فرسان الكيمياء',
      team2: 'أسود البيوتكنولوجي',
      score1: '-',
      score2: '-',
      date: 'الجمعة، 27 فبراير 2026 - 4:00 عصراً',
      motm: 'في انتظار صافرة البداية',
      status: 'مباراة قمة مرتقبة',
    },
    {
      round: 'الجولة السادسة (القادمة)',
      team1: 'صقور الفيزياء',
      team2: 'نمور الميكروبيولوجي',
      score1: '-',
      score2: '-',
      date: 'الجمعة، 27 فبراير 2026 - 5:30 عصراً',
      motm: 'في انتظار صافرة البداية',
      status: 'مباراة مرتقبة',
    },
  ];

  // 4. جدول الترتيب
  const standings = [
    { rank: 1, team: 'فرسان الكيمياء', played: 5, won: 4, draw: 1, lost: 0, gf: 15, ga: 6, gd: '+9', points: 13, form: ['W', 'W', 'D', 'W', 'W'] },
    { rank: 2, team: 'صقور الفيزياء', played: 5, won: 3, draw: 2, lost: 0, gf: 14, ga: 7, gd: '+7', points: 11, form: ['W', 'D', 'W', 'W', 'D'] },
    { rank: 3, team: 'أسود البيوتكنولوجي', played: 5, won: 3, draw: 1, lost: 1, gf: 13, ga: 8, gd: '+5', points: 10, form: ['W', 'L', 'W', 'W', 'D'] },
    { rank: 4, team: 'عمالقة الجيولوجيا', played: 5, won: 2, draw: 2, lost: 1, gf: 9, ga: 8, gd: '+1', points: 8, form: ['D', 'W', 'D', 'L', 'W'] },
    { rank: 5, team: 'نمور الميكروبيولوجي', played: 5, won: 2, draw: 0, lost: 3, gf: 8, ga: 12, gd: '-4', points: 6, form: ['L', 'W', 'L', 'W', 'L'] },
    { rank: 6, team: 'أبطال النبات والبيئة', played: 5, won: 1, draw: 1, lost: 3, gf: 6, ga: 13, gd: '-7', points: 4, form: ['L', 'L', 'W', 'D', 'L'] },
  ];

  // 5. قائمة الهدافين
  const topScorers = [
    { rank: 1, name: 'مصعب طارق', team: 'فرسان الكيمياء', goals: 8, assists: 5, matches: 5, avatar: '⚽' },
    { rank: 2, name: 'طارق محمود', team: 'أسود البيوتكنولوجي', goals: 6, assists: 3, matches: 5, avatar: '👟' },
    { rank: 3, name: 'ياسر محمد علي', team: 'صقور الفيزياء', goals: 5, assists: 4, matches: 5, avatar: '🎯' },
    { rank: 4, name: 'نزار فضل الله', team: 'عمالقة الجيولوجيا', goals: 4, assists: 2, matches: 4, avatar: '⚽' },
    { rank: 5, name: 'سامي عثمان', team: 'فرسان الكيمياء', goals: 4, assists: 6, matches: 5, avatar: '🎩' },
    { rank: 6, name: 'فيصل النور', team: 'نمور الميكروبيولوجي', goals: 3, assists: 1, matches: 5, avatar: '👟' },
  ];

  // 6. سجل الأبطال (Hall of Fame)
  const hallOfFame = [
    {
      year: '2025',
      tournament: 'دوري كلية العلوم السنوي',
      champion: 'فريق الكيمياء المتحد',
      runnerUp: 'صقور الفيزياء',
      bestPlayer: 'مصعب طارق',
      topScorer: 'عمر النور (9 أهداف)',
      bestKeeper: 'أحمد الهادي',
      badge: '🏆',
    },
    {
      year: '2024',
      tournament: 'كأس الاستقلال لخماسيات الكرة',
      champion: 'كتيبة البيوتكنولوجي',
      runnerUp: 'نجوم الجيولوجيا',
      bestPlayer: 'هيثم عبد الرحمن',
      topScorer: 'طارق محمود (7 أهداف)',
      bestKeeper: 'عمار جعفر',
      badge: '🥇',
    },
    {
      year: '2023',
      tournament: 'بطولة كلية العلوم الكبرى',
      champion: 'صقور الفيزياء',
      runnerUp: 'فرسان الكيمياء',
      bestPlayer: 'ياسر محمد',
      topScorer: 'ياسر محمد (8 أهداف)',
      bestKeeper: 'إبراهيم النيل',
      badge: '👑',
    },
    {
      year: '2022',
      tournament: 'دوري الصداقة والأخوة',
      champion: 'فريق الكيمياء',
      runnerUp: 'نجوم النبات والميكرو',
      bestPlayer: 'محمد صلاح عثمان',
      topScorer: 'محمد صلاح (10 أهداف)',
      bestKeeper: 'صالح يحيى',
      badge: '⭐',
    },
  ];

  return (
    <div style={{ minHeight: '90vh', paddingBottom: '70px', direction: 'rtl' }}>
      {/* 1. Hero Section الرياضي */}
      <div
        style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #091e3a 0%, #0d2b52 50%, #1e1b4b 100%)',
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
            <Trophy size={16} />
            <span>القطاع الرياضي - رابطة الطلاب السودانيين</span>
            <span>⚽</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(28px, 5vw, 40px)',
              fontWeight: '900',
              color: '#ffffff',
              margin: '0 0 14px',
              textShadow: '0 4px 20px rgba(0,0,0,0.6)',
            }}
          >
            المنظومة الرياضية ودوري كلية العلوم
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
            متابعة شاملة لبطولات كرة القدم، الشطرنج، وتنس الطاولة، مع تغطية حية للنتائج، جداول الترتيب، وإحصائيات الهدافين، وسجل الأبطال التاريخي لطلاب كلية العلوم.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '10px 18px', borderRadius: '12px', color: '#ffffff', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame size={16} color="#ef4444" />
              <span>دوري الموسم الحالي: <strong>SSA League 2026</strong></span>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '10px 18px', borderRadius: '12px', color: '#ffffff', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={16} color="#10b981" />
              <span>متصدر الترتيب: <strong>فرسان الكيمياء (13 نقطة)</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. تبويبات التنقل الستة الرياضية */}
      <div style={{ maxWidth: '1200px', margin: '30px auto 0', padding: '0 20px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '10px',
            backgroundColor: activeTheme.bgCard,
            padding: '8px',
            borderRadius: '18px',
            border: `1px solid ${activeTheme.border}`,
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
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
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: isSelected ? `2px solid ${activeTheme.accent}` : '2px solid transparent',
                  background: isSelected
                    ? `linear-gradient(135deg, ${activeTheme.primary}40, ${activeTheme.secondary}40)`
                    : 'transparent',
                  color: isSelected ? activeTheme.accentLight : activeTheme.textMain,
                  cursor: 'pointer',
                  fontWeight: isSelected ? 'bold' : '600',
                  fontSize: '13px',
                  transition: 'all 0.2s ease',
                  textAlign: 'right',
                }}
              >
                <Icon size={18} color={isSelected ? activeTheme.accent : activeTheme.textMuted} />
                <div>
                  <div>{tab.label}</div>
                  <div style={{ fontSize: '10px', color: activeTheme.textMuted, fontWeight: 'normal' }}>
                    {tab.count}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. محتوى التبويبات */}
      <div style={{ maxWidth: '1200px', margin: '30px auto 0', padding: '0 20px' }}>
        
        {/* 1. البطولات */}
        {activeTab === 'tournaments' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: activeTheme.textMain, margin: '0 0 4px' }}>
                  🏆 بطولات ومنافسات الموسم الأكاديمي
                </h2>
                <p style={{ color: activeTheme.textMuted, fontSize: '13px', margin: 0 }}>
                  المسابقات الرياضية الرسمية التي تنظمها اللجنة الرياضية بالرابطة.
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {tournaments.map((t) => (
                <div
                  key={t.id}
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
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span
                        style={{
                          backgroundColor: `${t.statusColor}20`,
                          color: t.statusColor,
                          border: `1px solid ${t.statusColor}`,
                          padding: '3px 10px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                        }}
                      >
                        {t.status}
                      </span>
                      <span style={{ fontSize: '12px', color: activeTheme.textMuted }}>{t.sport}</span>
                    </div>

                    <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: activeTheme.textMain, margin: '0 0 10px' }}>
                      {t.title}
                    </h3>
                    <p style={{ fontSize: '13px', color: activeTheme.textMuted, lineHeight: '1.7', margin: '0 0 16px' }}>
                      {t.desc}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: activeTheme.textMain, background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '12px', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={14} color={activeTheme.accent} />
                        <span><strong>الفترة:</strong> {t.date}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={14} color={activeTheme.accent} />
                        <span><strong>الملعب والموقع:</strong> {t.venue}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Trophy size={14} color="#f59e0b" />
                        <span><strong>الجوائز:</strong> {t.prize}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('results')}
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: `1px solid ${activeTheme.border}`,
                      color: activeTheme.accentLight,
                      padding: '10px',
                      borderRadius: '10px',
                      fontWeight: 'bold',
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>عرض النتائج والمباريات</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. الفرق */}
        {activeTab === 'teams' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: activeTheme.textMain, margin: '0 0 4px' }}>
                🛡️ الفرق الرياضية للأقسام العلمية
              </h2>
              <p style={{ color: activeTheme.textMuted, fontSize: '13px', margin: 0 }}>
                قوائم الفرق المشاركة وقادة الفرق واللاعبين المسجلين في دوري الكلية.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {teams.map((tm) => (
                <div
                  key={tm.id}
                  style={{
                    backgroundColor: activeTheme.bgCard,
                    borderRadius: '18px',
                    border: `1px solid ${activeTheme.border}`,
                    padding: '24px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <span style={{ fontSize: '32px' }}>{tm.badge}</span>
                    <span style={{ fontSize: '12px', color: activeTheme.accent }}>{tm.rating}</span>
                  </div>

                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: activeTheme.textMain, margin: '0 0 4px' }}>
                    {tm.name}
                  </h3>
                  <div style={{ fontSize: '12px', color: activeTheme.accentLight, fontWeight: 'bold', marginBottom: '12px' }}>
                    {tm.major}
                  </div>

                  <div style={{ fontSize: '13px', color: activeTheme.textMain, background: 'rgba(0,0,0,0.25)', padding: '10px 14px', borderRadius: '10px', marginBottom: '14px' }}>
                    <div>👑 <strong>كابتن الفريق:</strong> {tm.captain}</div>
                    <div style={{ marginTop: '4px', fontSize: '12px', color: activeTheme.textMuted }}>
                      المباريات الملعوبة: {tm.matches} | النقاط: {tm.points}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: activeTheme.textMuted, marginBottom: '8px' }}>
                      قائمة لاعبي الفريق:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {tm.players.map((p, pIdx) => (
                        <span
                          key={pIdx}
                          style={{
                            fontSize: '11px',
                            backgroundColor: 'rgba(255,255,255,0.06)',
                            color: activeTheme.textMain,
                            padding: '3px 8px',
                            borderRadius: '6px',
                          }}
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. النتائج والمباريات */}
        {activeTab === 'results' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: activeTheme.textMain, margin: '0 0 4px' }}>
                📅 جدول المباريات والنتائج المباشرة
              </h2>
              <p style={{ color: activeTheme.textMuted, fontSize: '13px', margin: 0 }}>
                نتائج الجولات السابقة ومواعيد المواجهات القادمة في دوري كلية العلوم.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {matches.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: activeTheme.bgCard,
                    borderRadius: '16px',
                    border: `1px solid ${activeTheme.border}`,
                    padding: '20px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '16px',
                    alignItems: 'center',
                    boxShadow: '0 6px 18px rgba(0,0,0,0.2)',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '11px', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '2px 8px', borderRadius: '6px', fontWeight: 'bold' }}>
                      {m.round}
                    </span>
                    <div style={{ fontSize: '12px', color: activeTheme.textMuted, marginTop: '6px' }}>
                      {m.date}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', fontSize: '16px', fontWeight: 'bold', color: activeTheme.textMain }}>
                    <span style={{ textAlign: 'left', minWidth: '110px' }}>{m.team1}</span>
                    <span style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '6px 14px', borderRadius: '10px', color: activeTheme.accentLight, fontSize: '18px', letterSpacing: '2px' }}>
                      {m.score1} : {m.score2}
                    </span>
                    <span style={{ textAlign: 'right', minWidth: '110px' }}>{m.team2}</span>
                  </div>

                  <div style={{ textAlign: 'left', fontSize: '12px' }}>
                    <div style={{ color: '#10b981', fontWeight: 'bold' }}>⭐ رجل المباراة: {m.motm}</div>
                    <div style={{ color: activeTheme.textMuted, marginTop: '2px' }}>الحالة: {m.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. جدول الترتيب */}
        {activeTab === 'standings' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: activeTheme.textMain, margin: '0 0 4px' }}>
                📊 جدول الترتيب العام لدوري الكلية 2026
              </h2>
              <p style={{ color: activeTheme.textMuted, fontSize: '13px', margin: 0 }}>
                ترتيب الفرق حسب النقاط وفارق الأهداف بعد نهاية مباريات الجولة الخامسة.
              </p>
            </div>

            <div
              style={{
                backgroundColor: activeTheme.bgCard,
                borderRadius: '18px',
                border: `1px solid ${activeTheme.border}`,
                overflowX: 'auto',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: 'rgba(0,0,0,0.3)', color: activeTheme.accentLight, borderBottom: `1px solid ${activeTheme.border}` }}>
                    <th style={{ padding: '14px 10px' }}>الترتيب</th>
                    <th style={{ padding: '14px 10px', textAlign: 'right' }}>الفريق</th>
                    <th style={{ padding: '14px 10px' }}>لعب</th>
                    <th style={{ padding: '14px 10px' }}>فوز</th>
                    <th style={{ padding: '14px 10px' }}>تعادل</th>
                    <th style={{ padding: '14px 10px' }}>خسارة</th>
                    <th style={{ padding: '14px 10px' }}>له</th>
                    <th style={{ padding: '14px 10px' }}>عليه</th>
                    <th style={{ padding: '14px 10px' }}>فارق</th>
                    <th style={{ padding: '14px 10px' }}>النقاط</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((st) => (
                    <tr
                      key={st.rank}
                      style={{
                        borderBottom: `1px solid ${activeTheme.border}`,
                        backgroundColor: st.rank === 1 ? 'rgba(245, 158, 11, 0.08)' : 'transparent',
                        fontWeight: st.rank <= 3 ? 'bold' : 'normal',
                      }}
                    >
                      <td style={{ padding: '14px 10px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            backgroundColor: st.rank === 1 ? '#f59e0b' : st.rank === 2 ? '#94a3b8' : st.rank === 3 ? '#b45309' : 'rgba(255,255,255,0.06)',
                            color: st.rank <= 3 ? '#000000' : activeTheme.textMain,
                            fontSize: '12px',
                            fontWeight: 'bold',
                          }}
                        >
                          {st.rank}
                        </span>
                      </td>
                      <td style={{ padding: '14px 10px', textAlign: 'right', color: activeTheme.textMain }}>
                        {st.team}
                      </td>
                      <td style={{ padding: '14px 10px' }}>{st.played}</td>
                      <td style={{ padding: '14px 10px', color: '#10b981' }}>{st.won}</td>
                      <td style={{ padding: '14px 10px', color: '#f59e0b' }}>{st.draw}</td>
                      <td style={{ padding: '14px 10px', color: '#ef4444' }}>{st.lost}</td>
                      <td style={{ padding: '14px 10px' }}>{st.gf}</td>
                      <td style={{ padding: '14px 10px' }}>{st.ga}</td>
                      <td style={{ padding: '14px 10px', color: activeTheme.accentLight }}>{st.gd}</td>
                      <td style={{ padding: '14px 10px', fontSize: '15px', color: '#fbbf24', fontWeight: 'bold' }}>
                        {st.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. قائمة الهدافين */}
        {activeTab === 'scorers' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: activeTheme.textMain, margin: '0 0 4px' }}>
                👟 سباق الحذاء الذهبي وقائمة الهدافين
              </h2>
              <p style={{ color: activeTheme.textMuted, fontSize: '13px', margin: 0 }}>
                إحصائيات الأهداف وصناعة اللعب للاعبي فرق كلية العلوم.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {topScorers.map((sc) => (
                <div
                  key={sc.rank}
                  style={{
                    backgroundColor: activeTheme.bgCard,
                    borderRadius: '16px',
                    border: `1px solid ${sc.rank === 1 ? activeTheme.accent : activeTheme.border}`,
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    boxShadow: '0 6px 18px rgba(0,0,0,0.2)',
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      backgroundColor: sc.rank === 1 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.06)',
                      border: sc.rank === 1 ? '1px solid #f59e0b' : `1px solid ${activeTheme.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                    }}
                  >
                    {sc.avatar}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: '15px', fontWeight: 'bold', color: activeTheme.textMain }}>
                        {sc.rank}. {sc.name}
                      </div>
                      <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#fbbf24' }}>
                        {sc.goals} ⚽
                      </span>
                    </div>

                    <div style={{ fontSize: '12px', color: activeTheme.accentLight, marginTop: '2px' }}>
                      {sc.team}
                    </div>

                    <div style={{ fontSize: '11px', color: activeTheme.textMuted, marginTop: '4px' }}>
                      صناعة الأهداف (Assists): {sc.assists} | المباريات: {sc.matches}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. سجل الأبطال (Hall of Fame) */}
        {activeTab === 'halloffame' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: activeTheme.textMain, margin: '0 0 4px' }}>
                👑 لوحة الشرف وسجل الأبطال التاريخي
              </h2>
              <p style={{ color: activeTheme.textMuted, fontSize: '13px', margin: 0 }}>
                توثيق البطولات السابقة، الكؤوس المحققة، وأبرز نجوم الرابطة الرياضيين عبر السنوات.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {hallOfFame.map((hf, idx) => (
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
                    <span style={{ fontSize: '32px' }}>{hf.badge}</span>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: activeTheme.accent }}>
                      موسم {hf.year}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: activeTheme.textMain, margin: '0 0 6px' }}>
                    {hf.tournament}
                  </h3>

                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '12px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '12px' }}>
                    <div style={{ color: '#fbbf24' }}>🥇 <strong>البطل المتوج:</strong> {hf.champion}</div>
                    <div style={{ color: activeTheme.textMuted }}>🥈 <strong>الوصيف:</strong> {hf.runnerUp}</div>
                    <div style={{ color: '#10b981' }}>⭐ <strong>أفضل لاعب:</strong> {hf.bestPlayer}</div>
                    <div style={{ color: activeTheme.accentLight }}>⚽ <strong>هداف البطولة:</strong> {hf.topScorer}</div>
                    <div style={{ color: activeTheme.textMain }}>🧤 <strong>القفاز الذهبي:</strong> {hf.bestKeeper}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
