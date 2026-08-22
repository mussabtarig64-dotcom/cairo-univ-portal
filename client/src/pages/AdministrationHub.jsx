import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Shield,
  FileCheck,
  Target,
  ChevronRight,
  Sparkles,
  Phone,
  Mail,
  UserCheck,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import AdminHubCMSModal from '../components/AdminHubCMSModal';
import { fetchHubContent, deleteHubContent } from '../utils/cmsApi';

const DEFAULT_BOARD = [
  {
    _id: 'b-1',
    title: 'رئيس الرابطة (المدير العام)',
    name: 'مصعب طارق',
    role: 'التمثيل الرسمي، إدارة السياسات العامة، والتنسيق مع عمادة الكلية وإدارة الوافدين.',
    email: 'president@ssa-cu.edu',
    badge: 'القيادة العليا',
    section: 'executive',
  },
  {
    _id: 'b-2',
    title: 'نائب رئيس الرابطة',
    name: 'عمر صديق',
    role: 'الإشراف المباشر على اللجان التنفيذية وتسيير الأعمال اليومية في غياب الرئيس.',
    email: 'vice-president@ssa-cu.edu',
    badge: 'إشراف تنفيذي',
    section: 'executive',
  },
  {
    _id: 'b-3',
    title: 'الأمين العام',
    name: 'ياسر محمد علي',
    role: 'توثيق المحاضر، ضبط السجلات الرسمية، ومتابعة تنفيذ القرارات الإدارية.',
    email: 'secretary@ssa-cu.edu',
    badge: 'شؤون إدارية',
    section: 'executive',
  },
  {
    _id: 'b-4',
    title: 'أمين المال والشؤون المالية',
    name: 'هيثم عبد الرحمن',
    role: 'إدارة الموازنة المالية، تحصيل الاشتراكات، والصرف على الأنشطة والمبادرات.',
    email: 'treasurer@ssa-cu.edu',
    badge: 'رقابة مالية',
    section: 'executive',
  },
];

const DEFAULT_COMMITTEES = [
  { _id: 'c-1', name: 'الأمانة الأكاديمية وشؤون الطلاب', title: 'الأمانة الأكاديمية وشؤون الطلاب', lead: 'د. سيف الدين (مشرف) + مصعب طارق', description: 'إدارة المكتبة الرقمية، بنك الامتحانات، المراجعات، ومتابعة قضايا التسجيل والنتائج.', section: 'committees' },
  { _id: 'c-2', name: 'أمانة العلاقات العامة والإعلام', title: 'أمانة العلاقات العامة والإعلام', lead: 'أحمد البدوي', description: 'إدارة المنصات الرسمية، التغطيات الصحفية، البيانات، والتواصل مع الروابط والجامعات.', section: 'committees' },
  { _id: 'c-3', name: 'أمانة النشاط الرياضي والبدني', title: 'أمانة النشاط الرياضي والبدني', lead: 'سامي عثمان', description: 'تنظيم الدوريات الرياضية، معسكرات التدريب، وإدارة الفرق والبطولات الجامعية.', section: 'committees' },
  { _id: 'c-4', name: 'أمانة الشؤون الاجتماعية والعمل الميداني', title: 'أمانة الشؤون الاجتماعية والعمل الميداني', lead: 'منصور آدم', description: 'رعاية الطلاب الجدد، ملف الإسكان، صندوق التكافل، والخدمات الصحية والإنسانية.', section: 'committees' },
  { _id: 'c-5', name: 'أمانة الثقافة والمواهب والتراث', title: 'أمانة الثقافة والمواهب والتراث', lead: 'روضة السر', description: 'تنظيم المعارض، الأسابيع الثقافية، الأمسيات الشعرية، وتوثيق التراث السوداني.', section: 'committees' },
];

const DEFAULT_PLANS = [
  { _id: 'p-1', title: 'مشروع التحول الرقمي الشامل (SSA Digital 2026)', progress: '90% منجز', badge: '90% منجز', description: 'إطلاق المنصة المركزية الذكية، بطاقة العضوية الرقمية، ونظام الحضور الذكي في الفعاليات.', section: 'plans' },
  { _id: 'p-2', title: 'توسيع بنك المراجع والمختبرات الافتراضية', progress: '75% منجز', badge: '75% منجز', description: 'توفير مذكرات مترجمة ومراجع معتمدة لكافة مواد المستويات الأربعة بكلية العلوم.', section: 'plans' },
  { _id: 'p-3', title: 'اتفاقيات الرعاية الصحية والخصومات العلاجية', progress: '85% منجز', badge: '85% منجز', description: 'توقيع مذكرات تفاهم مع 15 مركزاً طبياً ومعامل تحاليل لتقديم خصومات تصل إلى 40% للطلاب.', section: 'plans' },
];

export default function AdministrationHub() {
  const { activeTheme } = useTheme();
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('executive');

  const [executiveBoard, setExecutiveBoard] = useState(DEFAULT_BOARD);
  const [committees, setCommittees] = useState(DEFAULT_COMMITTEES);
  const [plans, setPlans] = useState(DEFAULT_PLANS);

  // Admin CMS Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [notification, setNotification] = useState('');

  const tabs = [
    { id: 'executive', label: 'المكتب التنفيذي', icon: Shield, desc: 'الهيئة الرئاسية والتنفيذية' },
    { id: 'committees', label: 'اللجان المتخصصة', icon: Users, desc: 'الأمانات ولجان العمل' },
    { id: 'mandates', label: 'الاختصاصات والمهام', icon: FileCheck, desc: 'التوصيف الإداري والوظيفي' },
    { id: 'plans', label: 'الخطط والمشاريع', icon: Target, desc: 'الخطة الاستراتيجية 2026' },
  ];

  useEffect(() => {
    async function loadDynamic() {
      const dynamicItems = await fetchHubContent('administration');
      if (dynamicItems && dynamicItems.length > 0) {
        const dynamicBoard = dynamicItems.filter((i) => i.section === 'executive');
        const dynamicComm = dynamicItems.filter((i) => i.section === 'committees');
        const dynamicPln = dynamicItems.filter((i) => i.section === 'plans');

        if (dynamicBoard.length > 0) {
          const ids = new Set(dynamicBoard.map((d) => d._id));
          setExecutiveBoard([...dynamicBoard, ...DEFAULT_BOARD.filter((d) => !ids.has(d._id))]);
        }
        if (dynamicComm.length > 0) {
          const ids = new Set(dynamicComm.map((d) => d._id));
          setCommittees([...dynamicComm, ...DEFAULT_COMMITTEES.filter((d) => !ids.has(d._id))]);
        }
        if (dynamicPln.length > 0) {
          const ids = new Set(dynamicPln.map((d) => d._id));
          setPlans([...dynamicPln, ...DEFAULT_PLANS.filter((d) => !ids.has(d._id))]);
        }
      }
    }
    loadDynamic();
  }, []);

  const handleSaved = (item, action) => {
    if (item.section === 'committees') {
      setCommittees(action === 'create' ? [item, ...committees] : committees.map((c) => (c._id === item._id ? item : c)));
    } else if (item.section === 'plans') {
      setPlans(action === 'create' ? [item, ...plans] : plans.map((p) => (p._id === item._id ? item : p)));
    } else {
      setExecutiveBoard(action === 'create' ? [item, ...executiveBoard] : executiveBoard.map((b) => (b._id === item._id ? item : b)));
    }
    setNotification(action === 'create' ? 'تمت إضافة البيانات الإدارية بنجاح!' : 'تم التحديث بنجاح!');
    setTimeout(() => setNotification(''), 4000);
  };

  const handleDeleteItem = async (id, section) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا المحتوى الإداري؟')) {
      try {
        if (!id.startsWith('b-') && !id.startsWith('c-') && !id.startsWith('p-')) {
          await deleteHubContent(id);
        }
        if (section === 'committees') {
          setCommittees(committees.filter((c) => c._id !== id));
        } else if (section === 'plans') {
          setPlans(plans.filter((p) => p._id !== id));
        } else {
          setExecutiveBoard(executiveBoard.filter((b) => b._id !== id));
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
          background: 'linear-gradient(135deg, #0b1e33 0%, #102a45 50%, #183b5d 100%)',
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
            <Shield size={16} />
            <span>الهيكل الإداري والمكتب التنفيذي للرابطة</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(28px, 5vw, 42px)',
              fontWeight: '900',
              color: '#ffffff',
              margin: '0 0 16px',
            }}
          >
            إدارة الرابطة، اللجان، والخطط الاستراتيجية
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
            التعريف بأعضاء المكتب التنفيذي، وتوزيع المهام والاختصاصات بين اللجان والأمانات المتخصصة، ومتابعة تنفيذ الخطط السنوية لخدمة الطلاب.
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
                <span>+ إضافة عضو مكتب تنفيذي أو خطة (Admin CMS)</span>
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
        {activeTab === 'executive' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '22px' }}>
            {executiveBoard.map((item) => (
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
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                      {item.badge || 'القيادة'}
                    </span>
                    <UserCheck size={20} color="#38bdf8" />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 4px' }}>
                    {item.name || item.title}
                  </h3>
                  <div style={{ fontSize: '13px', color: '#38bdf8', fontWeight: 'bold', marginBottom: '12px' }}>
                    {item.title || item.subtitle}
                  </div>
                  <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.7', margin: '0 0 14px' }}>
                    {item.role || item.description}
                  </p>
                  {item.email && (
                    <div style={{ fontSize: '12px', color: '#ffffff', background: 'rgba(0,0,0,0.25)', padding: '10px 12px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Mail size={14} color="#fbbf24" />
                      <span>{item.email}</span>
                    </div>
                  )}
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
                      onClick={() => handleDeleteItem(item._id, 'executive')}
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

        {activeTab === 'committees' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '22px' }}>
            {committees.map((com) => (
              <div
                key={com._id}
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
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 8px' }}>
                    {com.name || com.title}
                  </h3>
                  {com.lead && (
                    <div style={{ fontSize: '13px', color: '#38bdf8', fontWeight: 'bold', marginBottom: '12px' }}>
                      👑 مقرر اللجنة: {com.lead}
                    </div>
                  )}
                  <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.7', margin: 0 }}>
                    {com.description}
                  </p>
                </div>

                {isAdmin && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '12px', marginTop: '14px' }}>
                    <button
                      onClick={() => {
                        setEditingItem(com);
                        setIsModalOpen(true);
                      }}
                      style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid #3b82f6', color: '#60a5fa', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(com._id, 'committees')}
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

        {activeTab === 'mandates' && (
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
              المبادئ والاختصاصات العامة للعمل الإداري
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px', color: '#cbd5e1', lineHeight: '1.85' }}>
              <div>• <strong style={{ color: '#ffffff' }}>الشفافية والمساءلة:</strong> تخضع كافة القرارات والمصروفات المالية لتقارير دورية ترفع للجمعية العمومية.</div>
              <div>• <strong style={{ color: '#ffffff' }}>التمثيل الأكاديمي الشامل:</strong> ضمان وجود ممثلين لكافة الأقسام والتخصصات الـ 11 بالكلية في لجان الرابطة.</div>
              <div>• <strong style={{ color: '#ffffff' }}>التطوير المستمر:</strong> مواكبة أحدث التقنيات الرقمية لتسهيل وصول الخدمات لجميع الطلاب السودانيين.</div>
            </div>
          </div>
        )}

        {activeTab === 'plans' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {plans.map((p) => (
              <div
                key={p._id}
                style={{
                  backgroundColor: '#0f172a',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '24px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>
                    {p.title}
                  </h3>
                  <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                    {p.badge || p.progress || 'خطة نشطة'}
                  </span>
                </div>
                <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.7', margin: 0 }}>
                  {p.description}
                </p>

                {isAdmin && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '12px', marginTop: '14px' }}>
                    <button
                      onClick={() => {
                        setEditingItem(p);
                        setIsModalOpen(true);
                      }}
                      style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid #3b82f6', color: '#60a5fa', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(p._id, 'plans')}
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
        hub="administration"
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
