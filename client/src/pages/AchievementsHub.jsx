import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  Award,
  GraduationCap,
  Sparkles,
  Heart,
  Trophy,
  Medal,
  Star,
  Users,
  CheckCircle2,
  PlusCircle,
  Edit,
  Trash2
} from 'lucide-react';
import AdminHubCMSModal from '../components/AdminHubCMSModal';
import { fetchHubContent, deleteHubContent } from '../utils/cmsApi';

const DEFAULT_HONOR = [
  { _id: 'h-1', name: 'مصعب طارق', title: 'مصعب طارق', major: 'الكيمياء منفرد', gpa: '3.92 / 4.00 (امتياز)', year: 'المستوى الرابع', award: 'درع التفوق الأكاديمي لعام 2025', badge: 'امتياز مع مرتبة الشرف', section: 'honor' },
  { _id: 'h-2', name: 'سارة عبد الرحمن', title: 'سارة عبد الرحمن', major: 'التكنولوجيا الحيوية', gpa: '3.88 / 4.00 (امتياز)', year: 'المستوى الثالث', award: 'وسام التميز في أبحاث الجينوم', badge: 'أبحاث متقدمة', section: 'honor' },
  { _id: 'h-3', name: 'محمد الفاتح', title: 'محمد الفاتح', major: 'الفيزياء الحيوية', gpa: '3.85 / 4.00 (امتياز)', year: 'المستوى الرابع', award: 'جائزة الابتكار في الأجهزة الطبية', badge: 'ابتكار طبي', section: 'honor' },
  { _id: 'h-4', name: 'ريان صديق', title: 'ريان صديق', major: 'مزدوج كيمياء / ميكرو', gpa: '3.82 / 4.00 (امتياز)', year: 'المستوى الثالث', award: 'درع التميز المخبري والبحثي', badge: 'تميز مخبري', section: 'honor' },
];

const DEFAULT_DISTINGUISHED = [
  { _id: 'd-1', name: 'فريق الطاقة الحيوية النظيفة', title: 'فريق الطاقة الحيوية النظيفة', project: 'إنتاج الوقود الحيوي من الطحالب الدقيقة', achievement: 'المركز الأول في هاكاثون الابتكار الأخضر 2025', badge: 'هاكاثون الابتكار', section: 'distinguished' },
  { _id: 'd-2', name: 'أحمد الصادق محمد', title: 'أحمد الصادق محمد', project: 'تطوير منصة SSA التعليمية الذكية', achievement: 'جائزة التميز في التحول الرقمي وخدمة الطلاب', badge: 'تحول رقمي', section: 'distinguished' },
  { _id: 'd-3', name: 'إيناس عبد الله', title: 'إيناس عبد الله', project: 'بحث منشور في المؤتمر الدولي للفيزياء التطبيقية', achievement: 'أفضل ورقة بحثية لطلاب البكالوريوس', badge: 'نشر دولي', section: 'distinguished' },
];

const DEFAULT_VOLUNTEERS = [
  { _id: 'v-1', name: 'لجنة استقبال الطلاب الجدد', title: 'لجنة استقبال الطلاب الجدد', impact: 'خدمة أكثر من 180 طالباً ومرافقتهم لإجراءات الكلية والسكن', badge: 'وسام العطاء الذهبي', section: 'volunteers' },
  { _id: 'v-2', name: 'فريق الصندوق التكافلي الطبي', title: 'فريق الصندوق التكافلي الطبي', impact: 'تغطية نفقات الرعاية الصحية والخصومات لـ 120 حالة', badge: 'درع الإنسانية', section: 'volunteers' },
  { _id: 'v-3', name: 'فريق تنظيم المعارض والمؤتمرات', title: 'فريق تنظيم المعارض والمؤتمرات', impact: 'إدارة 12 فعالية أكاديمية وثقافية كبرى على مدار العام', badge: 'وسام الإنجاز الميداني', section: 'volunteers' },
];

const DEFAULT_ATHLETES = [
  { _id: 'a-1', name: 'منتخب كلية العلوم (SSA FC)', title: 'منتخب كلية العلوم (SSA FC)', achievement: 'بطل دوري خماسيات الجامعات المصرية للطلاب الوافدين 2025', icon: '🏆', badge: 'بطل الدوري', section: 'athletes' },
  { _id: 'a-2', name: 'عمر النور أحمد', title: 'عمر النور أحمد', achievement: 'الميدالية الذهبية في بطولة الشطرنج السريع للجامعات', icon: '🥇', badge: 'ذهبية الشطرنج', section: 'athletes' },
  { _id: 'a-3', name: 'ياسر محمد علي', title: 'ياسر محمد علي', achievement: 'أفضل لاعب وهداف بطولة الاستقلال لكرة القدم', icon: '⭐', badge: 'هداف البطولة', section: 'athletes' },
];

export default function AchievementsHub() {
  const { activeTheme } = useTheme();
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('honor');

  const [topStudents, setTopStudents] = useState(DEFAULT_HONOR);
  const [distinguished, setDistinguished] = useState(DEFAULT_DISTINGUISHED);
  const [volunteers, setVolunteers] = useState(DEFAULT_VOLUNTEERS);
  const [athletes, setAthletes] = useState(DEFAULT_ATHLETES);

  // Admin CMS Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [notification, setNotification] = useState('');

  const tabs = [
    { id: 'honor', label: 'لوحة الشرف والمتفوقون', icon: GraduationCap, count: 'امتياز مع مرتبة الشرف' },
    { id: 'distinguished', label: 'المتميزون والباحثون', icon: Sparkles, count: 'جوائز وابتكارات' },
    { id: 'volunteers', label: 'فرسان التطوع', icon: Heart, count: 'عطاء مجتمعي' },
    { id: 'athletes', label: 'أبطال الرياضة', icon: Trophy, count: 'كؤوس وميداليات' },
  ];

  useEffect(() => {
    async function loadDynamic() {
      const dynamicItems = await fetchHubContent('achievements');
      if (dynamicItems && dynamicItems.length > 0) {
        const dynamicHonor = dynamicItems.filter((i) => i.section === 'honor');
        const dynamicDist = dynamicItems.filter((i) => i.section === 'distinguished');
        const dynamicVols = dynamicItems.filter((i) => i.section === 'volunteers');
        const dynamicAth = dynamicItems.filter((i) => i.section === 'athletes');

        if (dynamicHonor.length > 0) {
          const ids = new Set(dynamicHonor.map((d) => d._id));
          setTopStudents([...dynamicHonor, ...DEFAULT_HONOR.filter((d) => !ids.has(d._id))]);
        }
        if (dynamicDist.length > 0) {
          const ids = new Set(dynamicDist.map((d) => d._id));
          setDistinguished([...dynamicDist, ...DEFAULT_DISTINGUISHED.filter((d) => !ids.has(d._id))]);
        }
        if (dynamicVols.length > 0) {
          const ids = new Set(dynamicVols.map((d) => d._id));
          setVolunteers([...dynamicVols, ...DEFAULT_VOLUNTEERS.filter((d) => !ids.has(d._id))]);
        }
        if (dynamicAth.length > 0) {
          const ids = new Set(dynamicAth.map((d) => d._id));
          setAthletes([...dynamicAth, ...DEFAULT_ATHLETES.filter((d) => !ids.has(d._id))]);
        }
      }
    }
    loadDynamic();
  }, []);

  const handleSaved = (item, action) => {
    if (item.section === 'distinguished') {
      setDistinguished(action === 'create' ? [item, ...distinguished] : distinguished.map((d) => (d._id === item._id ? item : d)));
    } else if (item.section === 'volunteers') {
      setVolunteers(action === 'create' ? [item, ...volunteers] : volunteers.map((v) => (v._id === item._id ? item : v)));
    } else if (item.section === 'athletes') {
      setAthletes(action === 'create' ? [item, ...athletes] : athletes.map((a) => (a._id === item._id ? item : a)));
    } else {
      setTopStudents(action === 'create' ? [item, ...topStudents] : topStudents.map((h) => (h._id === item._id ? item : h)));
    }
    setNotification(action === 'create' ? 'تمت إضافة التكريم بنجاح!' : 'تم تحديث البيانات بنجاح!');
    setTimeout(() => setNotification(''), 4000);
  };

  const handleDeleteItem = async (id, section) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا التكريم؟')) {
      try {
        if (!id.startsWith('h-') && !id.startsWith('d-') && !id.startsWith('v-') && !id.startsWith('a-')) {
          await deleteHubContent(id);
        }
        if (section === 'distinguished') {
          setDistinguished(distinguished.filter((d) => d._id !== id));
        } else if (section === 'volunteers') {
          setVolunteers(volunteers.filter((v) => v._id !== id));
        } else if (section === 'athletes') {
          setAthletes(athletes.filter((a) => a._id !== id));
        } else {
          setTopStudents(topStudents.filter((h) => h._id !== id));
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
      
      {/* Hero */}
      <div
        style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #1c1917 0%, #292524 50%, #44403c 100%)',
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
            <Award size={16} />
            <span>لوحة الفخر والتكريم الأكاديمي والطلابي</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(28px, 5vw, 42px)',
              fontWeight: '900',
              color: '#ffffff',
              margin: '0 0 16px',
            }}
          >
            التكريم والإنجازات .. فخر كلية العلوم
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
            توثيق إنجازات الطلاب المتفوقين في الأقسام العلمية، والمبتكرين في البحث العلمي، وفرسان العمل التطوعي والإنساني، وأبطال المحافل الرياضية.
          </p>

          {isAdmin && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
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
                <span>+ إضافة إنجاز أو تكريم جديد (Admin CMS)</span>
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

      {/* Tabs */}
      <div style={{ maxWidth: '1200px', margin: '30px auto 0', padding: '0 20px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            backgroundColor: '#0f172a',
            padding: '8px',
            borderRadius: '18px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
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
                  padding: '14px 18px',
                  borderRadius: '12px',
                  border: isSelected ? '2px solid #f59e0b' : '2px solid transparent',
                  background: isSelected ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                  color: isSelected ? '#fbbf24' : '#cbd5e1',
                  cursor: 'pointer',
                  fontWeight: isSelected ? 'bold' : '600',
                  fontSize: '14px',
                  textAlign: 'right',
                }}
              >
                <Icon size={20} color={isSelected ? '#f59e0b' : '#94a3b8'} />
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

      {/* Content */}
      <div style={{ maxWidth: '1200px', margin: '30px auto 0', padding: '0 20px' }}>
        {activeTab === 'honor' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '22px' }}>
            {topStudents.map((st) => (
              <div
                key={st._id}
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
                    <span style={{ fontSize: '28px' }}>🎓</span>
                    <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                      {st.gpa || st.badge || 'امتياز مع مرتبة الشرف'}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 6px' }}>
                    {st.name || st.title}
                  </h3>
                  <div style={{ fontSize: '13px', color: '#38bdf8', fontWeight: 'bold', marginBottom: '8px' }}>
                    {st.major || st.subtitle} {st.year && `(${st.year})`}
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.25)', padding: '12px 14px', borderRadius: '12px', fontSize: '13px', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    🏅 {st.award || st.description || 'درع التميز الأكاديمي'}
                  </div>
                </div>

                {isAdmin && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '12px', marginTop: '14px' }}>
                    <button
                      onClick={() => {
                        setEditingItem(st);
                        setIsModalOpen(true);
                      }}
                      style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid #3b82f6', color: '#60a5fa', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(st._id, 'honor')}
                      style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#f87171', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'distinguished' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '22px' }}>
            {distinguished.map((item) => (
              <div
                key={item._id}
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
                  <span style={{ fontSize: '30px', display: 'block', marginBottom: '10px' }}>💡</span>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 6px' }}>
                    {item.name || item.title}
                  </h3>
                  {item.project && (
                    <div style={{ fontSize: '13px', color: '#38bdf8', fontWeight: 'bold', marginBottom: '10px' }}>
                      مشروع: {item.project}
                    </div>
                  )}
                  <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', padding: '12px 14px', borderRadius: '12px', fontSize: '13px', color: '#34d399', fontWeight: 'bold' }}>
                    ✨ {item.achievement || item.description}
                  </div>
                </div>

                {isAdmin && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '12px', marginTop: '14px' }}>
                    <button
                      onClick={() => {
                        setEditingItem(item);
                        setIsModalOpen(true);
                      }}
                      style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid #3b82f6', color: '#60a5fa', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item._id, 'distinguished')}
                      style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#f87171', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'volunteers' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '22px' }}>
            {volunteers.map((v) => (
              <div
                key={v._id}
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
                    <span style={{ fontSize: '30px' }}>🤝</span>
                    <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                      {v.badge || 'وسام العطاء'}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 10px' }}>
                    {v.name || v.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.7', margin: 0 }}>
                    {v.impact || v.description}
                  </p>
                </div>

                {isAdmin && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '12px', marginTop: '14px' }}>
                    <button
                      onClick={() => {
                        setEditingItem(v);
                        setIsModalOpen(true);
                      }}
                      style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid #3b82f6', color: '#60a5fa', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(v._id, 'volunteers')}
                      style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#f87171', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'athletes' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '22px' }}>
            {athletes.map((a) => (
              <div
                key={a._id}
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
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>{a.icon || '🏆'}</div>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 8px' }}>
                    {a.name || a.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#38bdf8', fontWeight: 'bold', margin: 0 }}>
                    {a.achievement || a.description}
                  </p>
                </div>

                {isAdmin && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '12px', marginTop: '14px' }}>
                    <button
                      onClick={() => {
                        setEditingItem(a);
                        setIsModalOpen(true);
                      }}
                      style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid #3b82f6', color: '#60a5fa', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(a._id, 'athletes')}
                      style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#f87171', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Admin CMS Modal */}
      <AdminHubCMSModal
        hub="achievements"
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
