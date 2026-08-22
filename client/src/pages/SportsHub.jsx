import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
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
  Filter,
  PlusCircle,
  Edit,
  Trash2
} from 'lucide-react';
import AdminHubCMSModal from '../components/AdminHubCMSModal';
import { fetchHubContent, deleteHubContent } from '../utils/cmsApi';

const DEFAULT_TOURNAMENTS = [
  {
    _id: 't-1',
    title: 'دوري كلية العلوم للطلاب السودانيين (SSA League 2026)',
    category: 'كرة قدم (خماسيات)',
    status: 'جارية الآن',
    badge: 'جارية الآن',
    date: 'فبراير - إبريل 2026',
    venue: 'ملاعب الجامعة - الجيزة',
    description: 'البطولة الكبرى السنوية التي تجمع فرق الأقسام والتخصصات العلمية المختلفة للتنافس على درع الكلية.',
    prize: 'كأس البطولة + ميداليات ذهبية + جوائز عينية',
    section: 'tournaments',
  },
  {
    _id: 't-2',
    title: 'كأس الاستقلال والتلاحم الوطني',
    category: 'كرة قدم',
    status: 'قادمة قريباً',
    badge: 'قادمة قريباً',
    date: 'مايو 2026',
    venue: 'نادي النيل الرياضي',
    description: 'بطولة مجمعة بمشاركة وفود وروابط الكليات الأخرى بجامعة القاهرة.',
    prize: 'كأس الاستقلال والدرع التذكاري',
    section: 'tournaments',
  },
  {
    _id: 't-3',
    title: 'بطولة كلية العلوم للشطرنج السريع (SSA Chess Masters)',
    category: 'شطرنج',
    status: 'تسجيل مفتوح',
    badge: 'تسجيل مفتوح',
    date: 'مارس 2026',
    venue: 'قاعة الأنشطة الطلابية',
    description: 'منافسات الفكر والتكتيك بنظام الشطرنج السويسري الفردي لتحديد بطل الكلية.',
    prize: 'وسام العبقرية + ساعة شطرنج احترافية',
    section: 'tournaments',
  },
  {
    _id: 't-4',
    title: 'دوري تنس الطاولة والرياضات الفردية',
    category: 'تنس طاولة',
    status: 'قيد الإعداد',
    badge: 'قيد الإعداد',
    date: 'إبريل 2026',
    venue: 'صالة الألعاب الرياضية',
    description: 'تصفيات فردية وزوجية لطلاب وطالبات الكلية مع تحكيم رسمي معتمد.',
    prize: 'ميداليات التميز الفردي',
    section: 'tournaments',
  },
];

const DEFAULT_TEAMS = [
  {
    _id: 'tm-1',
    name: 'فرسان الكيمياء (Chemistry FC)',
    title: 'فرسان الكيمياء (Chemistry FC)',
    major: 'قسم الكيمياء المنفرد والمزدوج',
    category: 'قسم الكيمياء المنفرد والمزدوج',
    captain: 'مصعب طارق',
    author: 'مصعب طارق',
    rating: '⭐⭐⭐⭐⭐',
    matches: 5,
    points: 13,
    badge: '⚗️ متصدر الدوري',
    players: ['مصعب طارق (C)', 'أحمد الهادي', 'سامي عثمان', 'محمد صلاح', 'عمر ياسين', 'خالد النور'],
    section: 'teams',
  },
  {
    _id: 'tm-2',
    name: 'صقور الفيزياء (Physics Eagles)',
    title: 'صقور الفيزياء (Physics Eagles)',
    major: 'قسم الفيزياء والفيزياء الحيوية',
    category: 'قسم الفيزياء والفيزياء الحيوية',
    captain: 'ياسر محمد علي',
    author: 'ياسر محمد علي',
    rating: '⭐⭐⭐⭐',
    matches: 5,
    points: 11,
    badge: '⚡ وصيف الدوري',
    players: ['ياسر محمد (C)', 'إبراهيم النيل', 'عبد الله حسن', 'بدر الدين', 'مازن كمال', 'حسام علي'],
    section: 'teams',
  },
  {
    _id: 'tm-3',
    name: 'أسود البيوتكنولوجي (Biotech Lions)',
    title: 'أسود البيوتكنولوجي (Biotech Lions)',
    major: 'التكنولوجيا الحيوية والكيمياء الحيوية',
    category: 'التكنولوجيا الحيوية والكيمياء الحيوية',
    captain: 'هيثم عبد الرحمن',
    author: 'هيثم عبد الرحمن',
    rating: '⭐⭐⭐⭐⭐',
    matches: 5,
    points: 10,
    badge: '🧬 المركز الثالث',
    players: ['هيثم عبد الرحمن (C)', 'طارق محمود', 'معتز الطيب', 'عمار جعفر', 'أيمن سيف', 'وليد بشير'],
    section: 'teams',
  },
  {
    _id: 'tm-4',
    name: 'عمالقة الجيولوجيا (Geology Titans)',
    title: 'عمالقة الجيولوجيا (Geology Titans)',
    major: 'قسم الجيولوجيا والعلوم الأرضية',
    category: 'قسم الجيولوجيا والعلوم الأرضية',
    captain: 'نزار فضل الله',
    author: 'نزار فضل الله',
    rating: '⭐⭐⭐⭐',
    matches: 5,
    points: 8,
    badge: '💎 المركز الرابع',
    players: ['نزار فضل (C)', 'سيف الدين', 'عثمان أحمد', 'موسى إدريس', 'جعفر هاشم', 'صالح يحيى'],
    section: 'teams',
  },
];

const DEFAULT_MATCHES = [
  {
    _id: 'm-1',
    title: 'فرسان الكيمياء vs صقور الفيزياء',
    round: 'الجولة الخامسة (منتهية)',
    team1: 'فرسان الكيمياء',
    team2: 'صقور الفيزياء',
    score1: 3,
    score2: 2,
    date: 'الخميس، 18 فبراير 2026',
    motm: 'مصعب طارق (كيمياء)',
    status: 'انتهت',
    section: 'results',
  },
  {
    _id: 'm-2',
    title: 'أسود البيوتكنولوجي vs عمالقة الجيولوجيا',
    round: 'الجولة الخامسة',
    team1: 'أسود البيوتكنولوجي',
    team2: 'عمالقة الجيولوجيا',
    score1: 4,
    score2: 1,
    date: 'الخميس، 18 فبراير 2026',
    motm: 'طارق محمود (بيوتكنولوجي)',
    status: 'انتهت',
    section: 'results',
  },
  {
    _id: 'm-3',
    title: 'فرسان الكيمياء vs أسود البيوتكنولوجي (قمة الدوري)',
    round: 'الجولة السادسة (القادمة)',
    team1: 'فرسان الكيمياء',
    team2: 'أسود البيوتكنولوجي',
    score1: '-',
    score2: '-',
    date: 'الجمعة، 27 فبراير 2026 - 4:00 عصراً',
    motm: 'في انتظار صافرة البداية',
    status: 'مباراة قمة مرتقبة',
    section: 'results',
  },
];

const DEFAULT_STANDINGS = [
  { rank: 1, team: 'فرسان الكيمياء', played: 5, won: 4, draw: 1, lost: 0, gf: 15, ga: 6, gd: '+9', points: 13 },
  { rank: 2, team: 'صقور الفيزياء', played: 5, won: 3, draw: 2, lost: 0, gf: 14, ga: 7, gd: '+7', points: 11 },
  { rank: 3, team: 'أسود البيوتكنولوجي', played: 5, won: 3, draw: 1, lost: 1, gf: 13, ga: 8, gd: '+5', points: 10 },
  { rank: 4, team: 'عمالقة الجيولوجيا', played: 5, won: 2, draw: 2, lost: 1, gf: 9, ga: 8, gd: '+1', points: 8 },
  { rank: 5, team: 'نمور الميكروبيولوجي', played: 5, won: 2, draw: 0, lost: 3, gf: 8, ga: 12, gd: '-4', points: 6 },
  { rank: 6, team: 'أبطال النبات والبيئة', played: 5, won: 1, draw: 1, lost: 3, gf: 6, ga: 13, gd: '-7', points: 4 },
];

const DEFAULT_SCORERS = [
  { rank: 1, name: 'مصعب طارق', team: 'فرسان الكيمياء', goals: 8, assists: 5, matches: 5, avatar: '⚽' },
  { rank: 2, name: 'طارق محمود', team: 'أسود البيوتكنولوجي', goals: 6, assists: 3, matches: 5, avatar: '👟' },
  { rank: 3, name: 'ياسر محمد علي', team: 'صقور الفيزياء', goals: 5, assists: 4, matches: 5, avatar: '🎯' },
  { rank: 4, name: 'نزار فضل الله', team: 'عمالقة الجيولوجيا', goals: 4, assists: 2, matches: 4, avatar: '⚽' },
  { rank: 5, name: 'سامي عثمان', team: 'فرسان الكيمياء', goals: 4, assists: 6, matches: 5, avatar: '🎩' },
];

const DEFAULT_HALLOFFAME = [
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
];

export default function SportsHub() {
  const { activeTheme } = useTheme();
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('tournaments');

  // Dynamic state
  const [tournaments, setTournaments] = useState(DEFAULT_TOURNAMENTS);
  const [teams, setTeams] = useState(DEFAULT_TEAMS);
  const [matches, setMatches] = useState(DEFAULT_MATCHES);
  const [standings, setStandings] = useState(DEFAULT_STANDINGS);
  const [scorers, setScorers] = useState(DEFAULT_SCORERS);
  const [hallOfFame, setHallOfFame] = useState(DEFAULT_HALLOFFAME);

  // Admin CMS Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [notification, setNotification] = useState('');

  const tabs = [
    { id: 'tournaments', label: 'البطولات', icon: Trophy, count: '4 منافسات' },
    { id: 'teams', label: 'الفرق', icon: Users, count: '8 فرق علمية' },
    { id: 'results', label: 'النتائج والمباريات', icon: Calendar, count: 'مباشر وتاريخي' },
    { id: 'standings', label: 'الترتيب', icon: TrendingUp, count: 'جدول الدوري' },
    { id: 'scorers', label: 'الهدافين', icon: Flame, count: 'الحذاء الذهبي' },
    { id: 'halloffame', label: 'سجل الأبطال', icon: Award, count: 'لوحة الشرف' },
  ];

  // Fetch Live Data from MongoDB Atlas
  useEffect(() => {
    async function loadDynamic() {
      const dynamicItems = await fetchHubContent('sports');
      if (dynamicItems && dynamicItems.length > 0) {
        const dynamicTournaments = dynamicItems.filter((i) => i.section === 'tournaments');
        const dynamicTeams = dynamicItems.filter((i) => i.section === 'teams');
        const dynamicMatches = dynamicItems.filter((i) => i.section === 'results');

        if (dynamicTournaments.length > 0) {
          const ids = new Set(dynamicTournaments.map((d) => d._id));
          setTournaments([...dynamicTournaments, ...DEFAULT_TOURNAMENTS.filter((d) => !ids.has(d._id))]);
        }
        if (dynamicTeams.length > 0) {
          const ids = new Set(dynamicTeams.map((d) => d._id));
          setTeams([...dynamicTeams, ...DEFAULT_TEAMS.filter((d) => !ids.has(d._id))]);
        }
        if (dynamicMatches.length > 0) {
          const ids = new Set(dynamicMatches.map((d) => d._id));
          setMatches([...dynamicMatches, ...DEFAULT_MATCHES.filter((d) => !ids.has(d._id))]);
        }
      }
    }
    loadDynamic();
  }, []);

  const handleSaved = (item, action) => {
    if (item.section === 'teams') {
      setTeams(action === 'create' ? [item, ...teams] : teams.map((t) => (t._id === item._id ? item : t)));
    } else if (item.section === 'results') {
      setMatches(action === 'create' ? [item, ...matches] : matches.map((m) => (m._id === item._id ? item : m)));
    } else {
      setTournaments(action === 'create' ? [item, ...tournaments] : tournaments.map((t) => (t._id === item._id ? item : t)));
    }
    setNotification(action === 'create' ? 'تمت إضافة المحتوى بنجاح إلى قاعدة البيانات!' : 'تم تحديث المحتوى بنجاح!');
    setTimeout(() => setNotification(''), 4000);
  };

  const handleDeleteItem = async (id, type) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا العنصر الرياضي؟')) {
      try {
        if (!id.startsWith('t-') && !id.startsWith('tm-') && !id.startsWith('m-')) {
          await deleteHubContent(id);
        }
        if (type === 'teams') {
          setTeams(teams.filter((t) => t._id !== id));
        } else if (type === 'results') {
          setMatches(matches.filter((m) => m._id !== id));
        } else {
          setTournaments(tournaments.filter((t) => t._id !== id));
        }
        setNotification('تم حذف العنصر بنجاح.');
        setTimeout(() => setNotification(''), 4000);
      } catch (err) {
        alert('فشل الحذف: ' + err.message);
      }
    }
  };

  return (
    <div style={{ minHeight: '90vh', paddingBottom: '80px', direction: 'rtl' }}>
      
      {/* 1. Hero Section الرياضي */}
      <div
        style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #091e3a 0%, #0d2b52 50%, #1e1b4b 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '60px 20px 48px',
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
              padding: '6px 20px',
              borderRadius: '30px',
              color: '#fbbf24',
              fontSize: '14px',
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
              fontSize: 'clamp(28px, 5vw, 42px)',
              fontWeight: '900',
              color: '#ffffff',
              margin: '0 0 16px',
              textShadow: '0 4px 20px rgba(0,0,0,0.6)',
            }}
          >
            المنظومة الرياضية ودوري كلية العلوم
          </h1>

          <p
            style={{
              maxWidth: '780px',
              margin: '0 auto 26px',
              fontSize: '16px',
              lineHeight: '1.8',
              color: '#cbd5e1',
            }}
          >
            متابعة شاملة لبطولات كرة القدم، الشطرنج، وتنس الطاولة، مع تغطية حية للنتائج، جداول الترتيب، وإحصائيات الهدافين، وسجل الأبطال التاريخي لطلاب كلية العلوم.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '10px 20px', borderRadius: '12px', color: '#ffffff', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame size={16} color="#ef4444" />
              <span>دوري الموسم الحالي: <strong>SSA League 2026</strong></span>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '10px 20px', borderRadius: '12px', color: '#ffffff', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={16} color="#10b981" />
              <span>متصدر الترتيب: <strong>فرسان الكيمياء (13 نقطة)</strong></span>
            </div>
          </div>

          {/* Admin CMS Trigger */}
          {isAdmin && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '22px' }}>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setIsModalOpen(true);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: '#0b1622',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(245, 158, 11, 0.4)',
                }}
              >
                <PlusCircle size={18} />
                <span>+ إضافة بطولة أو نتيجة أو فريق (لوحة الإدارة)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {notification && (
        <div style={{ maxWidth: '1200px', margin: '20px auto 0', padding: '0 20px' }}>
          <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', border: '1px solid #22c55e', color: '#34d399', padding: '12px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 'bold' }}>
            <CheckCircle2 size={18} />
            <span>{notification}</span>
          </div>
        </div>
      )}

      {/* 2. تبويبات التنقل الستة الرياضية */}
      <div style={{ maxWidth: '1200px', margin: '30px auto 0', padding: '0 20px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '10px',
            backgroundColor: '#0f172a',
            padding: '8px',
            borderRadius: '18px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
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
                  border: isSelected ? '2px solid #f59e0b' : '2px solid transparent',
                  background: isSelected ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                  color: isSelected ? '#fbbf24' : '#cbd5e1',
                  cursor: 'pointer',
                  fontWeight: isSelected ? 'bold' : '600',
                  fontSize: '14px',
                  transition: 'all 0.2s ease',
                  textAlign: 'right',
                }}
              >
                <Icon size={18} color={isSelected ? '#f59e0b' : '#94a3b8'} />
                <div>
                  <div>{tab.label}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'normal' }}>
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
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 6px' }}>
                  🏆 بطولات ومنافسات الموسم الأكاديمي
                </h2>
                <p style={{ color: '#cbd5e1', fontSize: '14px', margin: 0 }}>
                  المسابقات الرياضية الرسمية التي تنظمها اللجنة الرياضية بالرابطة.
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '22px' }}>
              {tournaments.map((t) => (
                <div
                  key={t._id}
                  style={{
                    backgroundColor: '#0f172a',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <span
                        style={{
                          backgroundColor: 'rgba(16, 185, 129, 0.15)',
                          color: '#34d399',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                        }}
                      >
                        {t.badge || t.status}
                      </span>
                      <span style={{ fontSize: '13px', color: '#cbd5e1' }}>{t.category || t.sport}</span>
                    </div>

                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 10px' }}>
                      {t.title}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.7', margin: '0 0 16px' }}>
                      {t.description || t.desc}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#ffffff', background: 'rgba(0,0,0,0.25)', padding: '14px', borderRadius: '12px', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={15} color="#f59e0b" />
                        <span><strong>الفترة:</strong> {t.date}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={15} color="#38bdf8" />
                        <span><strong>الملعب والموقع:</strong> {t.venue}</span>
                      </div>
                      {t.prize && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Trophy size={15} color="#f59e0b" />
                          <span><strong>الجوائز:</strong> {t.prize}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '14px' }}>
                    <button
                      onClick={() => setActiveTab('results')}
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#fbbf24',
                        padding: '8px 16px',
                        borderRadius: '10px',
                        fontWeight: 'bold',
                        fontSize: '13px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span>عرض المباريات</span>
                      <ChevronRight size={16} />
                    </button>

                    {isAdmin && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          onClick={() => {
                            setEditingItem(t);
                            setIsModalOpen(true);
                          }}
                          title="تعديل"
                          style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid #3b82f6', color: '#60a5fa', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(t._id, 'tournaments')}
                          title="حذف"
                          style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#f87171', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. الفرق */}
        {activeTab === 'teams' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 6px' }}>
                🛡️ الفرق الرياضية للأقسام العلمية
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '14px', margin: 0 }}>
                قوائم الفرق المشاركة وقادة الفرق واللاعبين المسجلين في دوري الكلية.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '22px' }}>
              {teams.map((tm) => (
                <div
                  key={tm._id}
                  style={{
                    backgroundColor: '#0f172a',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '24px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <span style={{ fontSize: '28px' }}>{tm.badge?.includes('⚗️') ? '⚗️' : tm.badge?.includes('⚡') ? '⚡' : tm.badge?.includes('🧬') ? '🧬' : '🛡️'}</span>
                    <span style={{ fontSize: '12px', color: '#fbbf24', fontWeight: 'bold' }}>{tm.badge || tm.rating}</span>
                  </div>

                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 6px' }}>
                    {tm.name || tm.title}
                  </h3>
                  <div style={{ fontSize: '13px', color: '#38bdf8', fontWeight: 'bold', marginBottom: '12px' }}>
                    {tm.major || tm.category}
                  </div>

                  <div style={{ fontSize: '13px', color: '#ffffff', background: 'rgba(0,0,0,0.25)', padding: '12px 14px', borderRadius: '10px', marginBottom: '14px' }}>
                    <div>👑 <strong>كابتن الفريق:</strong> {tm.captain || tm.author}</div>
                    <div style={{ marginTop: '4px', fontSize: '12px', color: '#cbd5e1' }}>
                      المباريات: {tm.matches || 5} | النقاط: {tm.points || 10}
                    </div>
                  </div>

                  {tm.players && tm.players.length > 0 && (
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#cbd5e1', marginBottom: '8px' }}>
                        قائمة لاعبي الفريق:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {tm.players.map((p, pIdx) => (
                          <span
                            key={pIdx}
                            style={{
                              fontSize: '12px',
                              backgroundColor: 'rgba(255,255,255,0.08)',
                              color: '#ffffff',
                              padding: '4px 10px',
                              borderRadius: '8px',
                            }}
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {isAdmin && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <button
                        onClick={() => {
                          setEditingItem(tm);
                          setIsModalOpen(true);
                        }}
                        style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid #3b82f6', color: '#60a5fa', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(tm._id, 'teams')}
                        style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#f87171', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. النتائج والمباريات */}
        {activeTab === 'results' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 6px' }}>
                📅 جدول المباريات والنتائج المباشرة
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '14px', margin: 0 }}>
                نتائج الجولات السابقة ومواعيد المواجهات القادمة في دوري كلية العلوم.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {matches.map((m) => (
                <div
                  key={m._id}
                  style={{
                    backgroundColor: '#0f172a',
                    borderRadius: '18px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '22px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '16px',
                    alignItems: 'center',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '12px', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '3px 10px', borderRadius: '8px', fontWeight: 'bold' }}>
                      {m.round || m.category || 'دوري العلوم'}
                    </span>
                    <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '6px' }}>
                      {m.date}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', fontSize: '16px', fontWeight: 'bold', color: '#ffffff' }}>
                    <span style={{ textAlign: 'left', minWidth: '120px' }}>{m.team1 || m.title}</span>
                    <span style={{ backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '8px 16px', borderRadius: '10px', color: '#fbbf24', fontSize: '20px', letterSpacing: '2px' }}>
                      {m.score1 !== undefined ? m.score1 : '-'} : {m.score2 !== undefined ? m.score2 : '-'}
                    </span>
                    <span style={{ textAlign: 'right', minWidth: '120px' }}>{m.team2 || m.subtitle}</span>
                  </div>

                  <div style={{ textAlign: 'left', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ color: '#34d399', fontWeight: 'bold' }}>⭐ رجل المباراة: {m.motm || 'مصعب طارق'}</div>
                      <div style={{ color: '#cbd5e1', marginTop: '3px' }}>الحالة: {m.status}</div>
                    </div>
                    {isAdmin && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          onClick={() => {
                            setEditingItem(m);
                            setIsModalOpen(true);
                          }}
                          style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid #3b82f6', color: '#60a5fa', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(m._id, 'results')}
                          style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#f87171', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
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
              <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 6px' }}>
                📊 جدول الترتيب العام لدوري الكلية 2026
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '14px', margin: 0 }}>
                ترتيب الفرق حسب النقاط وفارق الأهداف بعد نهاية مباريات الجولة الخامسة.
              </p>
            </div>

            <div
              style={{
                backgroundColor: '#0f172a',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                overflowX: 'auto',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '14px' }}>
                <thead>
                  <tr style={{ backgroundColor: 'rgba(0,0,0,0.35)', color: '#fbbf24', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <th style={{ padding: '16px 12px' }}>الترتيب</th>
                    <th style={{ padding: '16px 12px', textAlign: 'right' }}>الفريق</th>
                    <th style={{ padding: '16px 12px' }}>لعب</th>
                    <th style={{ padding: '16px 12px' }}>فوز</th>
                    <th style={{ padding: '16px 12px' }}>تعادل</th>
                    <th style={{ padding: '16px 12px' }}>خسارة</th>
                    <th style={{ padding: '16px 12px' }}>له</th>
                    <th style={{ padding: '16px 12px' }}>عليه</th>
                    <th style={{ padding: '16px 12px' }}>فارق</th>
                    <th style={{ padding: '16px 12px' }}>النقاط</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((st) => (
                    <tr
                      key={st.rank}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                        backgroundColor: st.rank === 1 ? 'rgba(245, 158, 11, 0.08)' : 'transparent',
                        fontWeight: st.rank <= 3 ? 'bold' : 'normal',
                      }}
                    >
                      <td style={{ padding: '16px 12px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            backgroundColor: st.rank === 1 ? '#f59e0b' : st.rank === 2 ? '#94a3b8' : st.rank === 3 ? '#b45309' : 'rgba(255,255,255,0.08)',
                            color: st.rank <= 3 ? '#000000' : '#ffffff',
                            fontSize: '13px',
                            fontWeight: 'bold',
                          }}
                        >
                          {st.rank}
                        </span>
                      </td>
                      <td style={{ padding: '16px 12px', textAlign: 'right', color: '#ffffff' }}>
                        {st.team}
                      </td>
                      <td style={{ padding: '16px 12px', color: '#cbd5e1' }}>{st.played}</td>
                      <td style={{ padding: '16px 12px', color: '#34d399' }}>{st.won}</td>
                      <td style={{ padding: '16px 12px', color: '#fbbf24' }}>{st.draw}</td>
                      <td style={{ padding: '16px 12px', color: '#f87171' }}>{st.lost}</td>
                      <td style={{ padding: '16px 12px', color: '#cbd5e1' }}>{st.gf}</td>
                      <td style={{ padding: '16px 12px', color: '#cbd5e1' }}>{st.ga}</td>
                      <td style={{ padding: '16px 12px', color: '#38bdf8' }}>{st.gd}</td>
                      <td style={{ padding: '16px 12px', fontSize: '16px', color: '#fbbf24', fontWeight: 'bold' }}>
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
              <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 6px' }}>
                👟 سباق الحذاء الذهبي وقائمة الهدافين
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '14px', margin: 0 }}>
                إحصائيات الأهداف وصناعة اللعب للاعبي فرق كلية العلوم.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '18px' }}>
              {scorers.map((sc) => (
                <div
                  key={sc.rank}
                  style={{
                    backgroundColor: '#0f172a',
                    borderRadius: '18px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '22px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '14px',
                      backgroundColor: sc.rank === 1 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.06)',
                      border: sc.rank === 1 ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '22px',
                    }}
                  >
                    {sc.avatar}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#ffffff' }}>
                        {sc.rank}. {sc.name}
                      </div>
                      <span style={{ fontSize: '17px', fontWeight: 'bold', color: '#fbbf24' }}>
                        {sc.goals} ⚽
                      </span>
                    </div>

                    <div style={{ fontSize: '13px', color: '#38bdf8', marginTop: '2px', fontWeight: '600' }}>
                      {sc.team}
                    </div>

                    <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '4px' }}>
                      صناعة الأهداف: {sc.assists} | المباريات: {sc.matches}
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
              <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 6px' }}>
                👑 لوحة الشرف وسجل الأبطال التاريخي
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '14px', margin: 0 }}>
                توثيق البطولات السابقة، الكؤوس المحققة، وأبرز نجوم الرابطة الرياضيين عبر السنوات.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '22px' }}>
              {hallOfFame.map((hf, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#0f172a',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '24px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <span style={{ fontSize: '32px' }}>{hf.badge}</span>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#fbbf24' }}>
                      موسم {hf.year}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 8px' }}>
                    {hf.tournament}
                  </h3>

                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '12px', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                    <div style={{ color: '#fbbf24' }}>🥇 <strong>البطل المتوج:</strong> {hf.champion}</div>
                    <div style={{ color: '#cbd5e1' }}>🥈 <strong>الوصيف:</strong> {hf.runnerUp}</div>
                    <div style={{ color: '#34d399' }}>⭐ <strong>أفضل لاعب:</strong> {hf.bestPlayer}</div>
                    <div style={{ color: '#38bdf8' }}>⚽ <strong>هداف البطولة:</strong> {hf.topScorer}</div>
                    <div style={{ color: '#ffffff' }}>🧤 <strong>القفاز الذهبي:</strong> {hf.bestKeeper}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Admin CMS Modal */}
      <AdminHubCMSModal
        hub="sports"
        section={activeTab}
        sectionsList={tabs}
        editingItem={editingItem}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSaved={handleSaved}
      />
    </div>
  );
}
