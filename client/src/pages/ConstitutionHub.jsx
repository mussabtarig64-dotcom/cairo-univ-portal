import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  Scale,
  FileText,
  BookOpen,
  FileCheck2,
  Download,
  CheckCircle,
  Clock,
  ShieldAlert,
  ChevronRight,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import AdminHubCMSModal from '../components/AdminHubCMSModal';
import { fetchHubContent, deleteHubContent } from '../utils/cmsApi';

const DEFAULT_ARTICLES = [
  { _id: 'art-1', num: 'المادة (1)', badge: 'المادة (1)', title: 'الاسم والمقر والتبعية', description: 'تسمى هذه الهيئة "رابطة الطلاب السودانيين بكلية العلوم - جامعة القاهرة"، ومقرها الرئيسي كلية العلوم، الجيزة، جمهورية مصر العربية.', section: 'constitution' },
  { _id: 'art-2', num: 'المادة (2)', badge: 'المادة (2)', title: 'الأهداف والغايات العامة', description: 'رعاية مصالح الطلاب السودانيين الأكاديمية والثقافية والاجتماعية والرياضية، وتعميق أواصر الأخوة، وتسهيل اندماجهم في البيئة الجامعية المصرية.', section: 'constitution' },
  { _id: 'art-3', num: 'المادة (3)', badge: 'المادة (3)', title: 'شروط العضوية وحقوق الأعضاء', description: 'يعد عضواً في الرابطة كل طالب سوداني مسجل رسمياً في كلية العلوم بجامعة القاهرة، ويتمتع بكافة الحقوق الأكاديمية والترشح والتصويت.', section: 'constitution' },
  { _id: 'art-4', num: 'المادة (4)', badge: 'المادة (4)', title: 'الجمعية العمومية والمكتب التنفيذي', description: 'الجمعية العمومية هي السلطة التشريعية والرقابية العليا، وتنتخب المكتب التنفيذي لقيادة وتسيير أعمال الرابطة لدورة مدتها عام أكاديمي واحد.', section: 'constitution' },
];

const DEFAULT_DECREES = [
  { _id: 'dec-1', num: 'قرار إداري رقم (08/2026)', badge: 'قرار (08/2026)', date: '15 فبراير 2026', title: 'تشكيل اللجنة العليا لتنظيم أسبوع العلوم والتراث', description: 'تشكيل اللجنة العليا لتنظيم أسبوع العلوم والتراث وتعيين مقرري اللجان الفرعية وإقرار الموازنة المخصصة.', section: 'decisions' },
  { _id: 'dec-2', num: 'قرار إداري رقم (07/2026)', badge: 'قرار (07/2026)', date: '5 فبراير 2026', title: 'اعتماد المنصة الرقمية الرسمية وقاعدة البيانات', description: 'اعتماد المنصة الرقمية الرسمية وقاعدة البيانات المركزية الموحدة لتسجيل وتوثيق الطلاب وإصدار البطاقات الذكية.', section: 'decisions' },
  { _id: 'dec-3', num: 'قرار إداري رقم (06/2026)', badge: 'قرار (06/2026)', date: '25 يناير 2026', title: 'إقرار حزمة التخفيضات الطبية والتكافلية', description: 'إقرار حزمة التخفيضات الطبية والتكافلية مع المراكز الصحية المتعاقدة لصالح الطلاب المسجلين بالمنصة.', section: 'decisions' },
];

const DEFAULT_REPORTS = [
  { _id: 'rep-1', title: 'تقرير الأداء الإداري والأنشطة النصف سنوي 2025/2026', date: 'يناير 2026', author: 'الأمانة العامة', size: '2.4 MB PDF', description: 'توثيق شامل لإنجازات اللجان وأعداد الطلاب المستفيدين من المبادرات والمكتبة الرقمية.', section: 'reports' },
  { _id: 'rep-2', title: 'التقرير المالي والحساب الختامي للمصروفات والمبادرات', date: 'ديسمبر 2025', author: 'أمانة المال والرقابة', size: '1.8 MB PDF', description: 'كشف مفصل بالإيرادات والمصروفات ودعم الحالات التكافلية والأنشطة الرياضية.', section: 'reports' },
  { _id: 'rep-3', title: 'تقرير تقييم الخدمات الأكاديمية ونتائج الاستبيان الطلابي', date: 'نوفمبر 2025', author: 'الأمانة الأكاديمية', size: '1.2 MB PDF', description: 'تحليل جودة الملازم ومجموعات التقوية ورضا الطلاب عن المنصة الأكاديمية.', section: 'reports' },
];

const DEFAULT_MINUTES = [
  { _id: 'min-1', title: 'محضر اجتماع المكتب التنفيذي الدوري رقم (06)', date: '10 فبراير 2026', description: 'مناقشة خطة فعاليات شهر مارس، وتحديثات المكتبة الرقمية، وحصر الطلاب الجدد.', section: 'minutes' },
  { _id: 'min-2', title: 'محضر الاجتماع التنسيقي المشترك مع ممثلي الأقسام الـ 11', date: '28 يناير 2026', description: 'تنسيق جداول المراجعات ونماذج الامتحانات وحصر الاحتياجات المعملية لطلاب الكلية.', section: 'minutes' },
];

export default function ConstitutionHub() {
  const { activeTheme } = useTheme();
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('constitution');

  const [articles, setArticles] = useState(DEFAULT_ARTICLES);
  const [decrees, setDecrees] = useState(DEFAULT_DECREES);
  const [reports, setReports] = useState(DEFAULT_REPORTS);
  const [minutes, setMinutes] = useState(DEFAULT_MINUTES);

  // Admin CMS Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [notification, setNotification] = useState('');

  const tabs = [
    { id: 'constitution', label: 'الدستور واللوائح المنظمة', icon: Scale, count: 'البنود والمواد' },
    { id: 'decisions', label: 'القرارات والمراسيم', icon: FileCheck2, count: 'قرارات نافذة' },
    { id: 'reports', label: 'التقارير الإدارية والمالية', icon: BookOpen, count: 'تقارير الأداء' },
    { id: 'minutes', label: 'محاضر الاجتماعات', icon: FileText, count: 'أرشيف الجلسات' },
  ];

  useEffect(() => {
    async function loadDynamic() {
      const dynamicItems = await fetchHubContent('constitution');
      if (dynamicItems && dynamicItems.length > 0) {
        const dynamicArts = dynamicItems.filter((i) => i.section === 'constitution');
        const dynamicDecs = dynamicItems.filter((i) => i.section === 'decisions');
        const dynamicReps = dynamicItems.filter((i) => i.section === 'reports');
        const dynamicMins = dynamicItems.filter((i) => i.section === 'minutes');

        if (dynamicArts.length > 0) {
          const ids = new Set(dynamicArts.map((d) => d._id));
          setArticles([...dynamicArts, ...DEFAULT_ARTICLES.filter((d) => !ids.has(d._id))]);
        }
        if (dynamicDecs.length > 0) {
          const ids = new Set(dynamicDecs.map((d) => d._id));
          setDecrees([...dynamicDecs, ...DEFAULT_DECREES.filter((d) => !ids.has(d._id))]);
        }
        if (dynamicReps.length > 0) {
          const ids = new Set(dynamicReps.map((d) => d._id));
          setReports([...dynamicReps, ...DEFAULT_REPORTS.filter((d) => !ids.has(d._id))]);
        }
        if (dynamicMins.length > 0) {
          const ids = new Set(dynamicMins.map((d) => d._id));
          setMinutes([...dynamicMins, ...DEFAULT_MINUTES.filter((d) => !ids.has(d._id))]);
        }
      }
    }
    loadDynamic();
  }, []);

  const handleSaved = (item, action) => {
    if (item.section === 'decisions') {
      setDecrees(action === 'create' ? [item, ...decrees] : decrees.map((d) => (d._id === item._id ? item : d)));
    } else if (item.section === 'reports') {
      setReports(action === 'create' ? [item, ...reports] : reports.map((r) => (r._id === item._id ? item : r)));
    } else if (item.section === 'minutes') {
      setMinutes(action === 'create' ? [item, ...minutes] : minutes.map((m) => (m._id === item._id ? item : m)));
    } else {
      setArticles(action === 'create' ? [item, ...articles] : articles.map((a) => (a._id === item._id ? item : a)));
    }
    setNotification(action === 'create' ? 'تمت إضافة الوثيقة التنظيمية بنجاح!' : 'تم التحديث بنجاح!');
    setTimeout(() => setNotification(''), 4000);
  };

  const handleDeleteItem = async (id, section) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا البند أو التقرير؟')) {
      try {
        if (!id.startsWith('art-') && !id.startsWith('dec-') && !id.startsWith('rep-') && !id.startsWith('min-')) {
          await deleteHubContent(id);
        }
        if (section === 'decisions') {
          setDecrees(decrees.filter((d) => d._id !== id));
        } else if (section === 'reports') {
          setReports(reports.filter((r) => r._id !== id));
        } else if (section === 'minutes') {
          setMinutes(minutes.filter((m) => m._id !== id));
        } else {
          setArticles(articles.filter((a) => a._id !== id));
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
          background: 'linear-gradient(135deg, #1e1b4b 0%, #1e293b 50%, #0f172a 100%)',
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
            <Scale size={16} />
            <span>المرجعية الدستورية واللوائح والقرارات التنظيمية</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(28px, 5vw, 42px)',
              fontWeight: '900',
              color: '#ffffff',
              margin: '0 0 16px',
            }}
          >
            الدستور، اللوائح، والقرارات الإدارية
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
            المرجع القانوني والتنظيمي المعتمد لعمل رابطة الطلاب السودانيين بكلية العلوم جامعة القاهرة، متضمناً الدستور، المراسيم، ومحاضر الاجتماعات الرسمية.
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
                <span>+ إضافة مادة أو قرار أو محضر (Admin CMS)</span>
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
        {activeTab === 'constitution' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {articles.map((art) => (
              <div
                key={art._id}
                style={{
                  backgroundColor: '#0f172a',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '24px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '4px 12px', borderRadius: '10px', fontSize: '13px', fontWeight: 'bold' }}>
                      {art.badge || art.num || 'مادة دستورية'}
                    </span>
                    <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>
                      {art.title}
                    </h3>
                  </div>

                  {isAdmin && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        onClick={() => {
                          setEditingItem(art);
                          setIsModalOpen(true);
                        }}
                        style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid #3b82f6', color: '#60a5fa', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(art._id, 'constitution')}
                        style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#f87171', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
                <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.85', margin: 0 }}>
                  {art.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'decisions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {decrees.map((d) => (
              <div
                key={d._id}
                style={{
                  backgroundColor: '#0f172a',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '24px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                    {d.badge || d.num || 'قرار إداري'}
                  </span>
                  <span style={{ fontSize: '13px', color: '#cbd5e1' }}>{d.date}</span>
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 8px' }}>
                  {d.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.7', margin: 0 }}>
                  {d.description}
                </p>

                {isAdmin && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '12px', marginTop: '12px' }}>
                    <button
                      onClick={() => {
                        setEditingItem(d);
                        setIsModalOpen(true);
                      }}
                      style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid #3b82f6', color: '#60a5fa', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(d._id, 'decisions')}
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

        {activeTab === 'reports' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '22px' }}>
            {reports.map((rep) => (
              <div
                key={rep._id}
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
                  <div style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 'bold', marginBottom: '6px' }}>
                    {rep.author || 'الأمانة العامة'} • {rep.date}
                  </div>
                  <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 10px' }}>
                    {rep.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.7', margin: '0 0 14px' }}>
                    {rep.description}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>{rep.fileSize || rep.size || 'PDF'}</span>
                  <span style={{ fontSize: '13px', color: '#34d399', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle size={15} />
                    <span>معتمد رسمياً</span>
                  </span>

                  {isAdmin && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        onClick={() => {
                          setEditingItem(rep);
                          setIsModalOpen(true);
                        }}
                        style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid #3b82f6', color: '#60a5fa', padding: '6px 8px', borderRadius: '8px', cursor: 'pointer' }}
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(rep._id, 'reports')}
                        style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#f87171', padding: '6px 8px', borderRadius: '8px', cursor: 'pointer' }}
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

        {activeTab === 'minutes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {minutes.map((m) => (
              <div
                key={m._id}
                style={{
                  backgroundColor: '#0f172a',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '24px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>
                    {m.title}
                  </h3>
                  <span style={{ fontSize: '12px', color: '#cbd5e1' }}>{m.date}</span>
                </div>
                <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.7', margin: 0 }}>
                  <strong>جدول الأعمال والقرارات:</strong> {m.description || m.agenda}
                </p>

                {isAdmin && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '12px', marginTop: '12px' }}>
                    <button
                      onClick={() => {
                        setEditingItem(m);
                        setIsModalOpen(true);
                      }}
                      style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid #3b82f6', color: '#60a5fa', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(m._id, 'minutes')}
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
        hub="constitution"
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
