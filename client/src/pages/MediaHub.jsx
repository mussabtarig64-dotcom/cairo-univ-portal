import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  Newspaper,
  FileText,
  Bell,
  Share2,
  Calendar,
  Eye,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Megaphone,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import AdminHubCMSModal from '../components/AdminHubCMSModal';
import { fetchHubContent, deleteHubContent } from '../utils/cmsApi';

const DEFAULT_NEWS = [
  {
    _id: 'n-1',
    title: 'رابطة الطلاب السودانيين تبحث مع إدارة كلية العلوم تسهيلات التسجيل والإرشاد الأكاديمي',
    date: '19 فبراير 2026',
    author: 'اللجنة الإعلامية',
    badge: 'خبر رئيسي',
    description: 'عقد وفد المكتب التنفيذي للرابطة اجتماعاً مع إدارة الكلية وشؤون الطلاب لمناقشة تسريع إجراءات تسجيل المقررات وتسهيل استخراج الإثباتات والشهادات القيدية للطلاب السودانيين.',
    section: 'news',
  },
  {
    _id: 'n-2',
    title: 'افتتاح التسجيل في بطولات الألعاب الذهنية ودوري خماسيات كرة القدم',
    date: '17 فبراير 2026',
    author: 'أمانة الإعلام والرياضة',
    badge: 'نشاط طلابي',
    description: 'أعلنت اللجنة الرياضية عن انطلاق مرحلة تسجيل الفرق المشاركة في دوري الكلية 2026 مع تخصيص جوائز كبرى للفرق الفائزة وأفضل الهدافين.',
    section: 'news',
  },
  {
    _id: 'n-3',
    title: 'تحديث منصة المكتبة الرقمية وإضافة أكثر من 500 ملزمة وامتحان سابق',
    date: '14 فبراير 2026',
    author: 'الأمانة الأكاديمية',
    badge: 'تطوير رقمي',
    description: 'إطلاق النسخة المحدثة من المكتبة الرقمية التفاعلية مع دعم محرك بحث ذكي وسرعة تحميل الملازم والكتب لجميع المستويات الدراسية.',
    section: 'news',
  },
];

const DEFAULT_STATEMENTS = [
  {
    _id: 'stmt-1',
    num: 'بيان رقم (04/2026)',
    badge: 'بيان رقم (04/2026)',
    title: 'بيان بشأن تمديد فترة سداد الرسوم الدراسية وتجديد الإقامات لطلاب العلوم',
    date: '12 فبراير 2026',
    author: 'المكتب التنفيذي للرابطة',
    description: 'تعلن رابطة الطلاب السودانيين بكلية العلوم جامعة القاهرة أنه بعد التنسيق مع الجهات المختصة، تم اعتماد مهلة إضافية لتوفيق أوضاع الطلاب الراغبين في سداد المصروفات وتجديد الإقامات دون أي غرامات تأخير.',
    section: 'statements',
  },
  {
    _id: 'stmt-2',
    num: 'بيان رقم (03/2026)',
    badge: 'بيان رقم (03/2026)',
    title: 'بيان تهنئة بمناسبة بدء الفصل الدراسي الثاني 2025/2026',
    date: '1 فبراير 2026',
    author: 'أمانة العلاقات العامة والإعلام',
    description: 'يتقدم المكتب التنفيذي بأطيب التهاني والتبريكات لجميع الزملاء والزميلات بمناسبة انطلاق الفصل الدراسي الجديد، متمنين للجميع فصلاً حافلاً بالتميز والدرجات الرفيعة.',
    section: 'statements',
  },
];

const DEFAULT_ANNOUNCEMENTS = [
  {
    _id: 'ann-1',
    title: 'تنبيه عاجل: مواعيد تسليم وثائق إثبات الهوية لاعتماد الحسابات في المنصة',
    date: 'مستمر حتى 1 مارس 2026',
    category: 'إعلان إداري',
    badge: 'إعلان إداري عاجل',
    urgent: true,
    description: 'يرجى من جميع الطلاب المستجدين رفع صورة جواز السفر أو البطاقة الجامعية عبر الملف الشخصي لتفعيل بطاقة العضوية الرقمية (Digital ID).',
    section: 'announcements',
  },
  {
    _id: 'ann-2',
    title: 'بدء مجموعات التقوية والمراجعات النهائية لمقررات الكيمياء العامة والفيزياء 101',
    date: 'كل يوم سبت وثلاثاء',
    category: 'أكاديمي',
    badge: 'أكاديمي',
    urgent: false,
    description: 'تنظم الأمانة الأكاديمية جلسات مراجعة مجانية يقدمها معيدون وطلاب متميزون من السنوات المتقدمة.',
    section: 'announcements',
  },
];

export default function MediaHub() {
  const { activeTheme } = useTheme();
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('news');

  const [newsList, setNewsList] = useState(DEFAULT_NEWS);
  const [statements, setStatements] = useState(DEFAULT_STATEMENTS);
  const [announcements, setAnnouncements] = useState(DEFAULT_ANNOUNCEMENTS);

  // Admin CMS Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [notification, setNotification] = useState('');

  const tabs = [
    { id: 'news', label: 'الأخبار والأنشطة', icon: Newspaper, count: 'آخر المستجدات' },
    { id: 'statements', label: 'البيانات الرسمية', icon: FileText, count: 'المكتب التنفيذي' },
    { id: 'announcements', label: 'الإعلانات والتنبيهات', icon: Bell, count: 'إعلانات الطلاب' },
  ];

  useEffect(() => {
    async function loadDynamic() {
      const dynamicItems = await fetchHubContent('media');
      if (dynamicItems && dynamicItems.length > 0) {
        const dynamicNews = dynamicItems.filter((i) => i.section === 'news');
        const dynamicStmts = dynamicItems.filter((i) => i.section === 'statements');
        const dynamicAnns = dynamicItems.filter((i) => i.section === 'announcements');

        if (dynamicNews.length > 0) {
          const ids = new Set(dynamicNews.map((d) => d._id));
          setNewsList([...dynamicNews, ...DEFAULT_NEWS.filter((d) => !ids.has(d._id))]);
        }
        if (dynamicStmts.length > 0) {
          const ids = new Set(dynamicStmts.map((d) => d._id));
          setStatements([...dynamicStmts, ...DEFAULT_STATEMENTS.filter((d) => !ids.has(d._id))]);
        }
        if (dynamicAnns.length > 0) {
          const ids = new Set(dynamicAnns.map((d) => d._id));
          setAnnouncements([...dynamicAnns, ...DEFAULT_ANNOUNCEMENTS.filter((d) => !ids.has(d._id))]);
        }
      }
    }
    loadDynamic();
  }, []);

  const handleSaved = (item, action) => {
    if (item.section === 'statements') {
      setStatements(action === 'create' ? [item, ...statements] : statements.map((s) => (s._id === item._id ? item : s)));
    } else if (item.section === 'announcements') {
      setAnnouncements(action === 'create' ? [item, ...announcements] : announcements.map((a) => (a._id === item._id ? item : a)));
    } else {
      setNewsList(action === 'create' ? [item, ...newsList] : newsList.map((n) => (n._id === item._id ? item : n)));
    }
    setNotification(action === 'create' ? 'تم نشر المحتوى الإعلامي بنجاح!' : 'تم تحديث المحتوى الإعلامي بنجاح!');
    setTimeout(() => setNotification(''), 4000);
  };

  const handleDeleteItem = async (id, section) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا العنصر الإعلامي؟')) {
      try {
        if (!id.startsWith('n-') && !id.startsWith('stmt-') && !id.startsWith('ann-')) {
          await deleteHubContent(id);
        }
        if (section === 'statements') {
          setStatements(statements.filter((s) => s._id !== id));
        } else if (section === 'announcements') {
          setAnnouncements(announcements.filter((a) => a._id !== id));
        } else {
          setNewsList(newsList.filter((n) => n._id !== id));
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
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e1b4b 100%)',
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
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
              border: '1px solid #3b82f6',
              padding: '6px 20px',
              borderRadius: '30px',
              color: '#60a5fa',
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '16px',
            }}
          >
            <Megaphone size={16} />
            <span>المركز الإعلامي والمتحدث الرسمي للرابطة</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(28px, 5vw, 42px)',
              fontWeight: '900',
              color: '#ffffff',
              margin: '0 0 16px',
            }}
          >
            الأخبار، البيانات، والتغطيات الإعلامية
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
            المصدر الرسمي الموثوق لجميع أخبار وبيانات وقرارات رابطة الطلاب السودانيين بكلية العلوم - جامعة القاهرة.
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
                <span>+ إضافة خبر أو بيان رسمي (Admin CMS)</span>
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
        {activeTab === 'news' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {newsList.map((item) => (
              <div
                key={item._id}
                style={{
                  backgroundColor: '#0f172a',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '24px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                    {item.badge || item.category || 'خبر'}
                  </span>
                  <div style={{ fontSize: '13px', color: '#cbd5e1' }}>
                    {item.date} • {item.author}
                  </div>
                </div>
                <h3 style={{ fontSize: '19px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 12px' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.85', margin: '0 0 14px' }}>
                  {item.description}
                </p>

                {isAdmin && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '12px' }}>
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
                      onClick={() => handleDeleteItem(item._id, 'news')}
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

        {activeTab === 'statements' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {statements.map((stmt) => (
              <div
                key={stmt._id}
                style={{
                  backgroundColor: '#0f172a',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '24px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                    {stmt.badge || stmt.num || 'بيان رسمي'}
                  </span>
                  <div style={{ fontSize: '13px', color: '#cbd5e1' }}>
                    {stmt.date} • {stmt.author || 'المكتب التنفيذي'}
                  </div>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 12px' }}>
                  {stmt.title}
                </h3>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', fontSize: '14px', color: '#ffffff', lineHeight: '1.85', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  {stmt.description}
                </div>

                {isAdmin && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '12px', marginTop: '12px' }}>
                    <button
                      onClick={() => {
                        setEditingItem(stmt);
                        setIsModalOpen(true);
                      }}
                      style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid #3b82f6', color: '#60a5fa', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(stmt._id, 'statements')}
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

        {activeTab === 'announcements' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '22px' }}>
            {announcements.map((ann) => (
              <div
                key={ann._id}
                style={{
                  backgroundColor: '#0f172a',
                  borderRadius: '20px',
                  border: ann.urgent ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '24px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ backgroundColor: ann.urgent ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.06)', color: ann.urgent ? '#fbbf24' : '#cbd5e1', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                    {ann.badge || ann.category || 'تنبيه'}
                  </span>
                  <span style={{ fontSize: '12px', color: '#cbd5e1' }}>{ann.date}</span>
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 10px' }}>
                  {ann.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.7', margin: 0 }}>
                  {ann.description}
                </p>

                {isAdmin && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '12px', marginTop: '14px' }}>
                    <button
                      onClick={() => {
                        setEditingItem(ann);
                        setIsModalOpen(true);
                      }}
                      style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid #3b82f6', color: '#60a5fa', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(ann._id, 'announcements')}
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
        hub="media"
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
