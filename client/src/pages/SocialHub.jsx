import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
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
  PhoneCall,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import AdminHubCMSModal from '../components/AdminHubCMSModal';
import { fetchHubContent, deleteHubContent } from '../utils/cmsApi';

const DEFAULT_INITIATIVES = [
  {
    _id: 'soc-1',
    title: 'مبادرة الإسناد السكني للطلاب الجدد',
    badge: 'مبادرة مستمرة',
    category: 'إسكان ودعم',
    color: '#10b981',
    description: 'مساعدة الطلاب المستجدين والوافدين في تأمين سكن جامعي آمن ومناسب بالقرب من كليات جامعة القاهرة، وتوفير الدليل السكني.',
    impact: 'تم تسكين أكثر من 85 طالباً وطالبة هذا الفصل.',
    section: 'initiatives',
  },
  {
    _id: 'soc-2',
    title: 'صندوق التكافل الطبي والصحي',
    badge: 'خدمة عاجلة',
    category: 'رعاية صحية',
    color: '#3b82f6',
    description: 'توفير بطاقات خصم علاجية، وتنسيق الرعاية الصحية الطارئة مع المستشفيات والمراكز الطبية المعتمدة للطلاب السودانيين.',
    impact: 'تغطية خصومات طبية لـ 120+ حالة مرضية.',
    section: 'initiatives',
  },
  {
    _id: 'soc-3',
    title: 'مشروع الحقيبة الدراسية والكتب الجامعية',
    badge: 'أكاديمي اجتماعي',
    category: 'ملازم ومراجع',
    color: '#f59e0b',
    description: 'جمع وتدوير المراجع الأكاديمية والآلات الحاسبة وأدوات المعامل لتسليمها مجاناً للطلاب في بداية كل فصل دراسي.',
    impact: 'توزيع أكثر من 200 مرجع وملازم دراسية.',
    section: 'initiatives',
  },
  {
    _id: 'soc-4',
    title: 'إفطار رمضان السنوي والتجمع العائلي',
    badge: 'تراثي واجتماعي',
    category: 'مناسبات كبرى',
    color: '#8b5cf6',
    description: 'إقامة مائدة الإفطار الجماعي الكبرى لطلاب وأسر الجالية السودانية بالقاهرة لتعزيز روح الأخوة والألفة في الغربة.',
    impact: 'حضور أكثر من 450 طالباً وخريجاً سنوياً.',
    section: 'initiatives',
  },
];

const DEFAULT_VOLUNTEERS = [
  {
    _id: 'vol-1',
    title: 'لجنة استقبال الطلاب الجدد بمطار القاهرة والمواقف',
    name: 'لجنة استقبال الطلاب الجدد بمطار القاهرة والمواقف',
    description: 'الترحيب، التوجيه، وإجراءات الوصول والإقامة الأولى واستخراج بطاقات الاتصال المصرية.',
    members: '25 متطوعاً نشطاً',
    icon: '✈️',
    section: 'volunteer',
  },
  {
    _id: 'vol-2',
    title: 'فريق الدعم الميداني وحالات الطوارئ',
    name: 'فريق الدعم الميداني وحالات الطوارئ',
    description: 'التدخل السريع في الحالات الصحية والطارئة للطلاب على مدار 24 ساعة والتنسيق مع الأطباء.',
    members: '18 متطوعاً مسجلاً',
    icon: '🚑',
    section: 'volunteer',
  },
  {
    _id: 'vol-3',
    title: 'لجنة تنظيم الفعاليات والملتقيات الكبرى',
    name: 'لجنة تنظيم الفعاليات والملتقيات الكبرى',
    description: 'إدارة اللوجستيات، المسارح، البروتوكول، وتنظيم المعارض والمناسبات العلمية والثقافية.',
    members: '30 متطوعاً',
    icon: '🎪',
    section: 'volunteer',
  },
];

const DEFAULT_FAMILIES = [
  {
    _id: 'fam-1',
    title: 'أسرة النيلين الطلابية',
    name: 'أسرة النيلين الطلابية',
    scope: 'تجمع طلاب الخرطوم والوسط',
    description: 'ندوات فكرية، رحلات نيلية، وتكافل اجتماعي ومذاكرة جماعية.',
    lead: 'أحمد البدوي',
    author: 'أحمد البدوي',
    section: 'families',
  },
  {
    _id: 'fam-2',
    title: 'أسرة التاكا وسواكن',
    name: 'أسرة التاكا وسواكن',
    scope: 'تجمع طلاب الشرق والبحر الأحمر',
    description: 'معارض تراث البجا، دورات تدريبية، ولقاءات ثقافية تكافلية.',
    lead: 'إدريس محمد',
    author: 'إدريس محمد',
    section: 'families',
  },
  {
    _id: 'fam-3',
    title: 'أسرة كرمة والبركل',
    name: 'أسرة كرمة والبركل',
    scope: 'تجمع طلاب الشمالية ونهر النيل',
    description: 'توثيق التاريخ والحضارات القديمة والمذاكرة الجماعية لطلاب الأقسام.',
    lead: 'سيف الدين عثمان',
    author: 'سيف الدين عثمان',
    section: 'families',
  },
  {
    _id: 'fam-4',
    title: 'أسرة مرة والرمال الذهبية',
    name: 'أسرة مرة والرمال الذهبية',
    scope: 'تجمع طلاب كردفان ودارفور',
    description: 'أمسيات شعرية، بطولات رياضية، ومبادرات العون والمساندة الأخوية.',
    lead: 'منصور آدم',
    author: 'منصور آدم',
    section: 'families',
  },
];

export default function SocialHub() {
  const { activeTheme } = useTheme();
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('initiatives');

  const [initiatives, setInitiatives] = useState(DEFAULT_INITIATIVES);
  const [volunteerTeams, setVolunteerTeams] = useState(DEFAULT_VOLUNTEERS);
  const [studentFamilies, setStudentFamilies] = useState(DEFAULT_FAMILIES);

  // Admin CMS Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [notification, setNotification] = useState('');

  const tabs = [
    { id: 'initiatives', label: 'المبادرات المجتمعية', icon: HeartHandshake, desc: 'حملات التكافل والدعم' },
    { id: 'volunteer', label: 'التطوع والخدمة العامة', icon: HandHeart, desc: 'لجان العمل الميداني' },
    { id: 'support', label: 'دعم ومساندة الطلاب', icon: HelpCircle, desc: 'السكن، الإعانات، الإرشاد' },
    { id: 'families', label: 'نظام الأسر الطلابية', icon: Home, desc: 'أسر الأقسام والولايات' },
  ];

  // Fetch Live Data from MongoDB
  useEffect(() => {
    async function loadDynamic() {
      const dynamicItems = await fetchHubContent('social');
      if (dynamicItems && dynamicItems.length > 0) {
        const dynamicInits = dynamicItems.filter((i) => i.section === 'initiatives');
        const dynamicVols = dynamicItems.filter((i) => i.section === 'volunteer');
        const dynamicFams = dynamicItems.filter((i) => i.section === 'families');

        if (dynamicInits.length > 0) {
          const ids = new Set(dynamicInits.map((d) => d._id));
          setInitiatives([...dynamicInits, ...DEFAULT_INITIATIVES.filter((d) => !ids.has(d._id))]);
        }
        if (dynamicVols.length > 0) {
          const ids = new Set(dynamicVols.map((d) => d._id));
          setVolunteerTeams([...dynamicVols, ...DEFAULT_VOLUNTEERS.filter((d) => !ids.has(d._id))]);
        }
        if (dynamicFams.length > 0) {
          const ids = new Set(dynamicFams.map((d) => d._id));
          setStudentFamilies([...dynamicFams, ...DEFAULT_FAMILIES.filter((d) => !ids.has(d._id))]);
        }
      }
    }
    loadDynamic();
  }, []);

  const handleSaved = (item, action) => {
    if (item.section === 'volunteer') {
      setVolunteerTeams(action === 'create' ? [item, ...volunteerTeams] : volunteerTeams.map((v) => (v._id === item._id ? item : v)));
    } else if (item.section === 'families') {
      setStudentFamilies(action === 'create' ? [item, ...studentFamilies] : studentFamilies.map((f) => (f._id === item._id ? item : f)));
    } else {
      setInitiatives(action === 'create' ? [item, ...initiatives] : initiatives.map((i) => (i._id === item._id ? item : i)));
    }
    setNotification(action === 'create' ? 'تمت إضافة المبادرة بنجاح!' : 'تم تحديث البيانات بنجاح!');
    setTimeout(() => setNotification(''), 4000);
  };

  const handleDeleteItem = async (id, section) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا العنصر؟')) {
      try {
        if (!id.startsWith('soc-') && !id.startsWith('vol-') && !id.startsWith('fam-')) {
          await deleteHubContent(id);
        }
        if (section === 'volunteer') {
          setVolunteerTeams(volunteerTeams.filter((v) => v._id !== id));
        } else if (section === 'families') {
          setStudentFamilies(studentFamilies.filter((f) => f._id !== id));
        } else {
          setInitiatives(initiatives.filter((i) => i._id !== id));
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
          background: 'linear-gradient(135deg, #062b25 0%, #0d4439 50%, #1a332d 100%)',
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
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid #10b981',
              padding: '6px 20px',
              borderRadius: '30px',
              color: '#34d399',
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '16px',
            }}
          >
            <HeartHandshake size={16} />
            <span>قطاع الشؤون الاجتماعية والعمل التطوعي</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(28px, 5vw, 42px)',
              fontWeight: '900',
              color: '#ffffff',
              margin: '0 0 16px',
            }}
          >
            الملتقى الاجتماعي ونظام الأسر والمبادرات
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
            تجسيد قيم التكافل والإخاء بين الطلاب السودانيين بكلية العلوم، عبر إطلاق المبادرات الإنسانية، وتنظيم العمل التطوعي، وبناء شبكة دعم طلابي وأسري متكاملة في مصر.
          </p>

          {/* Admin CMS Trigger */}
          {isAdmin && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
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
                <span>+ إضافة مبادرة أو أسرة جديدة (Admin CMS)</span>
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
                  padding: '12px 16px',
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '22px' }}>
            {initiatives.map((item) => (
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
                  <span
                    style={{
                      backgroundColor: 'rgba(16, 185, 129, 0.15)',
                      color: '#34d399',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      display: 'inline-block',
                      marginBottom: '12px',
                    }}
                  >
                    {item.badge || item.category}
                  </span>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 10px' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.7', margin: '0 0 14px' }}>
                    {item.description}
                  </p>
                </div>
                <div>
                  {item.impact && (
                    <div style={{ background: 'rgba(0,0,0,0.25)', padding: '12px 14px', borderRadius: '12px', fontSize: '13px', color: '#fbbf24', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      ✨ <strong>الأثر المحقق:</strong> {item.impact}
                    </div>
                  )}

                  {isAdmin && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setIsModalOpen(true);
                        }}
                        style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid #3b82f6', color: '#60a5fa', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item._id, 'initiatives')}
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
        )}

        {activeTab === 'volunteer' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '22px' }}>
            {volunteerTeams.map((team) => (
              <div
                key={team._id}
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
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>{team.icon || '🤝'}</div>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 8px' }}>
                    {team.name || team.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.7', margin: '0 0 14px' }}>
                    {team.description}
                  </p>
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#34d399', fontWeight: 'bold', background: 'rgba(0,0,0,0.25)', padding: '10px 14px', borderRadius: '10px' }}>
                    👥 قوة الفريق: {team.members || '20 متطوعاً'}
                  </div>

                  {isAdmin && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <button
                        onClick={() => {
                          setEditingItem(team);
                          setIsModalOpen(true);
                        }}
                        style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid #3b82f6', color: '#60a5fa', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(team._id, 'volunteer')}
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
        )}

        {activeTab === 'support' && (
          <div
            style={{
              backgroundColor: '#0f172a',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '30px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            }}
          >
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff', marginBottom: '18px' }}>
              خدمات الدعم والإرشاد الطلابي العاجل
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <h4 style={{ color: '#fbbf24', margin: '0 0 8px', fontSize: '16px' }}>🏢 السكن الجامعي والمغتربين</h4>
                <p style={{ color: '#cbd5e1', fontSize: '13px', lineHeight: '1.7', margin: 0 }}>
                  توفير قوائم الشقق الطلابية المعتمدة والتنسيق مع وكلاء الإسكان لتخفيض التأمين ورسوم الإيجار.
                </p>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <h4 style={{ color: '#38bdf8', margin: '0 0 8px', fontSize: '16px' }}>📜 الإجراءات القنصلية والإقامات</h4>
                <p style={{ color: '#cbd5e1', fontSize: '13px', lineHeight: '1.7', margin: 0 }}>
                  إرشادات استخراج إقامة الدراسة بمجمع التحرير والعباسية وتصديق الشهادات بالسفارة السودانية بالقاهرة.
                </p>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <h4 style={{ color: '#34d399', margin: '0 0 8px', fontSize: '16px' }}>🤝 الإرشاد النفسي والأكاديمي</h4>
                <p style={{ color: '#cbd5e1', fontSize: '13px', lineHeight: '1.7', margin: 0 }}>
                  جلسات استشارية مع أساتذة وخريجين لمساعدة الطلاب في التغلب على ضغوط الدراسة والغربة.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'families' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '22px' }}>
            {studentFamilies.map((fam) => (
              <div
                key={fam._id}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <Home size={22} color="#f59e0b" />
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>
                      {fam.name || fam.title}
                    </h3>
                  </div>
                  {fam.scope && (
                    <div style={{ fontSize: '13px', color: '#38bdf8', fontWeight: 'bold', marginBottom: '10px' }}>
                      النطاق: {fam.scope}
                    </div>
                  )}
                  <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.7', margin: '0 0 14px' }}>
                    {fam.description}
                  </p>
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#ffffff', background: 'rgba(0,0,0,0.25)', padding: '10px 14px', borderRadius: '10px' }}>
                    👤 <strong>مسؤول الأسرة:</strong> {fam.lead || fam.author || 'إدارة الرابطة'}
                  </div>

                  {isAdmin && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <button
                        onClick={() => {
                          setEditingItem(fam);
                          setIsModalOpen(true);
                        }}
                        style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid #3b82f6', color: '#60a5fa', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(fam._id, 'families')}
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
        )}
      </div>

      {/* Admin CMS Modal */}
      <AdminHubCMSModal
        hub="social"
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
