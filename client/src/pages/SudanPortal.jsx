import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  MapPin,
  Palette,
  BookOpen,
  Award,
  Heart,
  Compass,
  Star,
  Users,
  Feather,
  Coffee,
  Globe,
  Share2,
  ChevronRight,
  Music,
  Flame,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import AdminHubCMSModal from '../components/AdminHubCMSModal';
import { fetchHubContent, deleteHubContent } from '../utils/cmsApi';

const DEFAULT_HERITAGE = [
  {
    _id: 'h-1',
    title: 'الكرم والضيافة والنفير',
    category: 'قيم اجتماعية',
    badge: 'رمز التلاحم',
    description: 'يمثل "النفير" و"الفزع" إحدى أسمى صور التكافل الاجتماعي في السودان، حيث يتداعى الجميع لمساندة الجار والمحتاج، إلى جانب صواني رمضان في الشوارع التي تعكس كرم الشعب السوداني الأصيل.',
    icon: '🤝',
    tags: ['النفير', 'إكرام الضيف', 'التكافل'],
    section: 'heritage',
  },
  {
    _id: 'h-2',
    title: 'الزي القومي السوداني',
    category: 'أزياء تراثية',
    badge: 'هوية وطنية',
    description: 'يتميز الزي القومي للرجل بالجلابية الفضفاضة والعمة والشال والمركوب الفاسي أو النمري، بينما تتألق المرأة السودانية بـ "الثوب السوداني" بألوانه وتطريزاته الفريدة كرمز للهيبة والجمال.',
    icon: '👘',
    tags: ['الثوب السوداني', 'الجلابية والعمة', 'المركوب'],
    section: 'heritage',
  },
  {
    _id: 'h-3',
    title: 'طقوس "الجبنة" والقهوة السودانية',
    category: 'طقوس شعبية',
    badge: 'أصالة وسرور',
    description: 'جلسة الجبنة السودانية ليست مجرد شرب قهوة، بل هي ملتقى اجتماعي عائلي تدق فيه حبوب البن مع الهيل والزنجبيل في "الفندق" وتقدم في أواني الفخار مع البخور السوداني الفواح.',
    icon: '☕',
    tags: ['الجبنة', 'البخور', 'جلسة السمر'],
    section: 'heritage',
  },
  {
    _id: 'h-4',
    title: 'المائدة والمأكولات التراثية',
    category: 'مطبخ سوداني',
    badge: 'نكهات أصيلة',
    description: 'تتنوع المائدة السودانية بأطباق تقليدية مميزة مثل العصيدة بالقيمة أو الويكة، القراصة مع دمعة الدجاج، الكسرة، الملاح بأنواعه، والشوربة السودانية مع المشروبات الشهيرة كالحلو-مر والكركديه والتبلدي.',
    icon: '🍲',
    tags: ['العصيدة', 'القراصة', 'الحلو-مر', 'التبلدي'],
    section: 'heritage',
  },
  {
    _id: 'h-5',
    title: 'العرس السوداني والجرتق',
    category: 'مناسبات وأفراح',
    badge: 'تاريخ ممتد',
    description: 'طقس الجرتق الفريد يعود لآلاف السنين في الحضارة الكوشية، حيث يرتدي العروسان الحرير الأحمر وعقد الحلب والفركة، مع رش اللبن وتمني الخير والبركة لحياتهما الجديدة.',
    icon: '👑',
    tags: ['الجرتق', 'الحناء', 'الضريرة'],
    section: 'heritage',
  },
  {
    _id: 'h-6',
    title: 'الحضارة الكوشية وأهرامات مروي',
    category: 'عمق تاريخي',
    badge: 'حضارة الآلاف',
    description: 'يضم السودان أكثر من 200 هرم تاريخي في البجراوية والنقعة والمصورات وكرمة، شواهد حية على عظمة ملوك كوش الذين حكموا وادي النيل وصنعوا فجراً للحضارة الإنسانية.',
    icon: '🏛️',
    tags: ['كوش', 'مروي', 'حضارة كرمة', 'نوباتيا'],
    section: 'heritage',
  },
];

const DEFAULT_STATES = [
  {
    _id: 'st-1',
    name: 'ولاية الخرطوم',
    title: 'ولاية الخرطوم',
    capital: 'الخرطوم',
    region: 'الوسط',
    landmark: 'مقرن النيلين الأبيض والأزرق ومتحف السودان القومي',
    description: 'العاصمة السياسية والاقتصادية وملتقى النيلين الخالدين ومركز الجامعات والصروح العلمية.',
    section: 'states',
  },
  {
    _id: 'st-2',
    name: 'ولاية الجزيرة',
    title: 'ولاية الجزيرة',
    capital: 'ود مدني',
    region: 'الوسط',
    landmark: 'مشروع الجزيرة الزراعي وأكبر شبكة ري انسيابي',
    description: 'سلة غذاء السودان وعاصمة الفن والجمال وموطن أكبر مشروع زراعي ذو إدارة موحدة.',
    section: 'states',
  },
  {
    _id: 'st-3',
    name: 'ولاية البحر الأحمر',
    title: 'ولاية البحر الأحمر',
    capital: 'بورتسودان',
    region: 'الشرق',
    landmark: 'ميناء بورتسودان، عروس البحر الأحمر، وجزيرة سواكن التاريخية',
    description: 'بوابة السودان البحرية على العالم، وموطن الشعب المرجانية الساحرة وتاريخ عثمان دقنة العريق.',
    section: 'states',
  },
  {
    _id: 'st-4',
    name: 'ولاية كسلا',
    title: 'ولاية كسلا',
    capital: 'كسلا',
    region: 'الشرق',
    landmark: 'جبال التوتيل، نهر القاش، وبساتين السواقي الخضراء',
    description: 'مدينة الجمال الساحر وقصائد العشاق، ورمز التنوع الثقافي في شرق السودان.',
    section: 'states',
  },
  {
    _id: 'st-5',
    name: 'الولاية الشمالية',
    title: 'الولاية الشمالية',
    capital: 'دنقلا',
    region: 'الشمال',
    landmark: 'أهرامات كرمة، جبل البركل، ومعابد صلب والزورات',
    description: 'مهد الحضارة النوبية والكوشية العظيمة، وموطن النخيل والآثار الإنسانية الخالدة.',
    section: 'states',
  },
  {
    _id: 'st-6',
    name: 'ولاية نهر النيل',
    title: 'ولاية نهر النيل',
    capital: 'الدامر',
    region: 'الشمال',
    landmark: 'أهرامات البجراوية (مروي)، شلال السبلوقة، ومصانع الأسمنت',
    description: 'موطن الحضارة المروية العريقة وصناعة الحديد القديمة ومعلم التاريخ والحداثة.',
    section: 'states',
  },
  {
    _id: 'st-7',
    name: 'ولاية شمال كردفان',
    title: 'ولاية شمال كردفان',
    capital: 'الأبيض',
    region: 'الغرب / كردفان',
    landmark: 'سوق الصمغ العربي وبورصة المحاصيل الزراعية',
    description: 'عروس الرمال وعاصمة الصمغ العربي، المشهورة برياضة المصارعة والفروسية وشجر التبلدي.',
    section: 'states',
  },
  {
    _id: 'st-8',
    name: 'ولاية شمال دارفور',
    title: 'ولاية شمال دارفور',
    capital: 'الفاشر',
    region: 'الغرب / دارفور',
    landmark: 'قصر السلطان علي دينار وواحة عين سيرة',
    description: 'عاصمة سلاطين الفور وكسوة الكعبة التاريخية، وموطن الكرم والإرث الثقافي العريق.',
    section: 'states',
  },
];

const DEFAULT_TALENTS = [
  {
    _id: 'tl-1',
    name: 'مصعب طارق',
    title: 'مصعب طارق - ابتكار منصة SSA الذكية',
    major: 'الكيمياء منفرد - المستوى الرابع',
    category: 'البرمجة والتحول الرقمي',
    talent: 'تطوير النظم الرقمية والذكاء الاصطناعي',
    description: 'تصميم وبناء البوابة المركزية المتكاملة لطلاب كلية العلوم جامعة القاهرة وتطوير بطاقة العضوية الرقمية.',
    badge: 'ابتكار تقني متميز',
    icon: '💻',
    section: 'talents',
  },
  {
    _id: 'tl-2',
    name: 'سارة عبد الرحمن',
    title: 'سارة عبد الرحمن - أبحاث التكنولوجيا الحيوية',
    major: 'التكنولوجيا الحيوية - المستوى الثالث',
    category: 'البحث العلمي والابتكار',
    talent: 'البحث العلمي وهندسة الجينات',
    description: 'ورقة بحثية متقدمة في تطوير المحاصيل المقاومة للجفاف باستخدام تقنيات التعديل الجيني الحديثة.',
    badge: 'تميز بحثي معتمد',
    icon: '🧬',
    section: 'talents',
  },
  {
    _id: 'tl-3',
    name: 'أحمد الصادق محمد',
    title: 'أحمد الصادق محمد - التصميم الجرافيكي والهوية البصرية',
    major: 'الفيزياء منفرد - المستوى الثاني',
    category: 'الفنون الرقمية والتصميم',
    talent: 'التصميم الجرافيكي وصناعة الهوية البصرية',
    description: 'إخراج كافة التصاميم البصرية، الشعارات، والمطبوعات الرسمية للمؤتمرات وأسابيع العلوم التراثية.',
    badge: 'إبداع بصري',
    icon: '🎨',
    section: 'talents',
  },
];

const DEFAULT_ARTS = [
  {
    _id: 'art-1',
    title: 'شعر: "سوداني الجوة وجداني بريدو"',
    author: 'الشاعر د. عبد الواحد عبد الله',
    category: 'شعر وطني فصيح',
    description: 'قصيدة خالدة تجسد ألوان الطيف السوداني وعشق تراب الوطن الممتد من حلفا إلى نيمولي.',
    excerpt: 'سوداني الجوة وجداني بريدو .. أنا بالروح والدم بفديهو وعيدو',
    badge: 'شعر وأدب خالد',
    section: 'arts',
  },
  {
    _id: 'art-2',
    title: 'موسيقى: السلم الخماسي وأصالة الإيقاع السوداني',
    author: 'توثيق الأمانة الثقافية',
    category: 'تراث موسيقي',
    description: 'دراسة مبسطة لتميز الموسيقى السودانية واعتمادها السلم الخماسي الإفريقي الأصيل وتمازج إيقاعات المردوم والتم تم والكولتيلي.',
    badge: 'هوية نغمية',
    section: 'arts',
  },
  {
    _id: 'art-3',
    title: 'الرواية السودانية: من "موسم الهجرة للشمال" إلى المعاصرة',
    author: 'عبقري الرواية العربية الطيب صالح',
    category: 'سرد وروائي',
    description: 'إسهام الأدباء السودانيين في العالمية وتصوير البيئة والريف السوداني بكل صدق وتفرد إنساني.',
    badge: 'أدب عالمي',
    section: 'arts',
  },
];

export default function SudanPortal() {
  const { activeTheme } = useTheme();
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('heritage');
  const [selectedState, setSelectedState] = useState(null);

  // Dynamic Content State
  const [heritageItems, setHeritageItems] = useState(DEFAULT_HERITAGE);
  const [statesList, setStatesList] = useState(DEFAULT_STATES);
  const [talentsList, setTalentsList] = useState(DEFAULT_TALENTS);
  const [artsList, setArtsList] = useState(DEFAULT_ARTS);

  // Admin CMS Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [notification, setNotification] = useState('');

  const tabs = [
    { id: 'heritage', label: 'التراث والتقاليد', icon: Coffee, count: 'عادات وأصالة' },
    { id: 'states', label: 'ولايات السودان', icon: Compass, count: '18 ولاية' },
    { id: 'talents', label: 'مواهب وإبداعات', icon: Flame, count: 'طاقات شبابية' },
    { id: 'arts', label: 'الأدب والفنون', icon: Feather, count: 'شعر وموسيقى' },
  ];

  // Fetch Live CMS Items from MongoDB
  useEffect(() => {
    async function loadDynamic() {
      const dynamicItems = await fetchHubContent('sudan');
      if (dynamicItems && dynamicItems.length > 0) {
        const dynamicHeritage = dynamicItems.filter((i) => i.section === 'heritage');
        const dynamicStates = dynamicItems.filter((i) => i.section === 'states');
        const dynamicTalents = dynamicItems.filter((i) => i.section === 'talents');
        const dynamicArts = dynamicItems.filter((i) => i.section === 'arts');

        if (dynamicHeritage.length > 0) {
          const ids = new Set(dynamicHeritage.map((d) => d._id));
          setHeritageItems([...dynamicHeritage, ...DEFAULT_HERITAGE.filter((d) => !ids.has(d._id))]);
        }
        if (dynamicStates.length > 0) {
          const ids = new Set(dynamicStates.map((d) => d._id));
          setStatesList([...dynamicStates, ...DEFAULT_STATES.filter((d) => !ids.has(d._id))]);
        }
        if (dynamicTalents.length > 0) {
          const ids = new Set(dynamicTalents.map((d) => d._id));
          setTalentsList([...dynamicTalents, ...DEFAULT_TALENTS.filter((d) => !ids.has(d._id))]);
        }
        if (dynamicArts.length > 0) {
          const ids = new Set(dynamicArts.map((d) => d._id));
          setArtsList([...dynamicArts, ...DEFAULT_ARTS.filter((d) => !ids.has(d._id))]);
        }
      }
    }
    loadDynamic();
  }, []);

  const handleSaved = (item, action) => {
    if (item.section === 'states') {
      setStatesList(action === 'create' ? [item, ...statesList] : statesList.map((s) => (s._id === item._id ? item : s)));
    } else if (item.section === 'talents') {
      setTalentsList(action === 'create' ? [item, ...talentsList] : talentsList.map((t) => (t._id === item._id ? item : t)));
    } else if (item.section === 'arts') {
      setArtsList(action === 'create' ? [item, ...artsList] : artsList.map((a) => (a._id === item._id ? item : a)));
    } else {
      setHeritageItems(action === 'create' ? [item, ...heritageItems] : heritageItems.map((h) => (h._id === item._id ? item : h)));
    }
    setNotification(action === 'create' ? 'تمت إضافة العنصر التراثي بنجاح إلى قاعدة البيانات!' : 'تم تحديث البيانات بنجاح!');
    setTimeout(() => setNotification(''), 4000);
  };

  const handleDeleteItem = async (id, section) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا المحتوى؟')) {
      try {
        if (!id.startsWith('h-') && !id.startsWith('st-') && !id.startsWith('tl-') && !id.startsWith('art-')) {
          await deleteHubContent(id);
        }
        if (section === 'states') {
          setStatesList(statesList.filter((s) => s._id !== id));
        } else if (section === 'talents') {
          setTalentsList(talentsList.filter((t) => t._id !== id));
        } else if (section === 'arts') {
          setArtsList(artsList.filter((a) => a._id !== id));
        } else {
          setHeritageItems(heritageItems.filter((h) => h._id !== id));
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
      
      {/* 1. Hero Section الثقافي والتراثي لسوداننا */}
      <div
        style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #091a13 0%, #0d281e 50%, #16382a 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '65px 20px 50px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          textAlign: 'center',
          overflow: 'hidden',
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
              marginBottom: '18px',
            }}
          >
            <Sparkles size={16} />
            <span>بوابة الأصالة والهوية الوطنية - رابطة الطلاب السودانيين</span>
            <span>🇸🇩</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(30px, 5.5vw, 44px)',
              fontWeight: '900',
              color: '#ffffff',
              margin: '0 0 16px',
              textShadow: '0 4px 20px rgba(0,0,0,0.7)',
            }}
          >
            سوداننا .. أرض الحضارات والجمال
          </h1>

          <p
            style={{
              maxWidth: '820px',
              margin: '0 auto 28px',
              fontSize: '16px',
              lineHeight: '1.85',
              color: '#cbd5e1',
            }}
          >
            نافذة ثقافية جامعة تُبرز ثراء التراث السوداني الأصيل، وتعرّف بولايات السودان وتنوعها الجغرافي والإنساني، وتحتفي بطاقات وإبداعات ومواهب طلاب كلية العلوم في الفنون والآداب والعلوم.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: '12px', color: '#ffffff', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🏛️</span>
              <strong>أكثر من 7,000 سنة حضارة كوشية ونوبية</strong>
            </div>
            <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: '12px', color: '#ffffff', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🌊</span>
              <strong>ملتقى النيل الأبيض والأزرق الخالد</strong>
            </div>
          </div>

          {/* Admin CMS Button */}
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
                  padding: '12px 26px',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  fontSize: '15px',
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(245, 158, 11, 0.4)',
                }}
              >
                <PlusCircle size={18} />
                <span>+ إضافة محتوى تراثي أو موهبة (Admin CMS)</span>
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

      {/* 2. Navigation Tabs لتبويبات سوداننا الأربعة */}
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
                  gap: '10px',
                  padding: '14px 18px',
                  borderRadius: '14px',
                  border: isSelected ? '2px solid #f59e0b' : '2px solid transparent',
                  background: isSelected ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                  color: isSelected ? '#fbbf24' : '#cbd5e1',
                  cursor: 'pointer',
                  fontWeight: isSelected ? 'bold' : '600',
                  fontSize: '14px',
                  transition: 'all 0.25s ease',
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

      {/* 3. Tab Contents */}
      <div style={{ maxWidth: '1200px', margin: '30px auto 0', padding: '0 20px' }}>
        
        {/* التبويب الأول: التراث */}
        {activeTab === 'heritage' && (
          <div>
            <div style={{ marginBottom: '22px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 6px' }}>
                🌾 التراث السوداني الأصيل والعادات العريقة
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '14px', margin: 0 }}>
                شواهد حية على قيم التكافل، والكرم الباذخ، والأزياء القومية، وطقوس الحياة الاجتماعية السودانية.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '22px' }}>
              {heritageItems.map((item) => (
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
                      <span style={{ fontSize: '32px' }}>{item.icon || '🌾'}</span>
                      <span
                        style={{
                          backgroundColor: 'rgba(245, 158, 11, 0.15)',
                          color: '#fbbf24',
                          border: '1px solid rgba(245, 158, 11, 0.3)',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          padding: '4px 12px',
                          borderRadius: '20px',
                        }}
                      >
                        {item.badge || item.category}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 10px' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '14px', lineHeight: '1.8', color: '#cbd5e1', margin: '0 0 16px' }}>
                      {item.description}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '14px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {(item.tags || [item.category]).map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          style={{
                            fontSize: '12px',
                            backgroundColor: 'rgba(255,255,255,0.06)',
                            color: '#38bdf8',
                            padding: '3px 8px',
                            borderRadius: '8px',
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {isAdmin && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
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
                          onClick={() => handleDeleteItem(item._id, 'heritage')}
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

        {/* التبويب الثاني: ولايات السودان */}
        {activeTab === 'states' && (
          <div>
            <div style={{ marginBottom: '22px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 6px' }}>
                🗺️ ولايات السودان .. فسيفساء الوطن الممتد
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '14px', margin: 0 }}>
                استكشف جغرافيا ومعالم ومميزات الولايات ومواقعها التاريخية والسياحية.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '22px' }}>
              {statesList.map((st) => (
                <div
                  key={st._id}
                  style={{
                    backgroundColor: '#0f172a',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '24px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>
                      {st.name || st.title}
                    </h3>
                    <span style={{ fontSize: '12px', backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '3px 10px', borderRadius: '12px', fontWeight: 'bold' }}>
                      إقليم {st.region || 'السودان'}
                    </span>
                  </div>

                  {st.capital && (
                    <div style={{ fontSize: '13px', color: '#fbbf24', fontWeight: 'bold', marginBottom: '10px' }}>
                      🏛️ الحاضرة: {st.capital}
                    </div>
                  )}

                  <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.7', margin: '0 0 14px' }}>
                    {st.description}
                  </p>

                  {st.landmark && (
                    <div style={{ background: 'rgba(0,0,0,0.25)', padding: '12px 14px', borderRadius: '12px', fontSize: '13px', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      📍 <strong>أبرز المعالم:</strong> {st.landmark}
                    </div>
                  )}

                  {isAdmin && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <button
                        onClick={() => {
                          setEditingItem(st);
                          setIsModalOpen(true);
                        }}
                        style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid #3b82f6', color: '#60a5fa', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(st._id, 'states')}
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

        {/* التبويب الثالث: مواهب وإبداعات */}
        {activeTab === 'talents' && (
          <div>
            <div style={{ marginBottom: '22px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 6px' }}>
                🌟 مواهب وطاقات طلاب كلية العلوم
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '14px', margin: 0 }}>
                منصة إبراز المبتكرين والمصممين والمبرمجين والباحثين من أبناء الرابطة.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '22px' }}>
              {talentsList.map((tl) => (
                <div
                  key={tl._id}
                  style={{
                    backgroundColor: '#0f172a',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '24px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '32px' }}>{tl.icon || '💡'}</span>
                    <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                      {tl.badge || tl.category}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 4px' }}>
                    {tl.name || tl.title}
                  </h3>
                  <div style={{ fontSize: '13px', color: '#38bdf8', fontWeight: 'bold', marginBottom: '12px' }}>
                    {tl.major || tl.subtitle}
                  </div>

                  <div style={{ background: 'rgba(0,0,0,0.25)', padding: '12px 14px', borderRadius: '12px', fontSize: '13px', color: '#ffffff', marginBottom: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    ✨ <strong>مجال الإبداع:</strong> {tl.talent || tl.category}
                  </div>

                  <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.7', margin: 0 }}>
                    {tl.description}
                  </p>

                  {isAdmin && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <button
                        onClick={() => {
                          setEditingItem(tl);
                          setIsModalOpen(true);
                        }}
                        style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid #3b82f6', color: '#60a5fa', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(tl._id, 'talents')}
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

        {/* التبويب الرابع: الأدب والفنون */}
        {activeTab === 'arts' && (
          <div>
            <div style={{ marginBottom: '22px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 6px' }}>
                ✍️ الأدب، الشعر، والفنون السودانية
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '14px', margin: 0 }}>
                ملتقى القصائد الوطنية، السرد الروائي، والتعريف بالسلم الخماسي والموسيقى السودانية.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '22px' }}>
              {artsList.map((art) => (
                <div
                  key={art._id}
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
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ fontSize: '12px', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '3px 10px', borderRadius: '10px', fontWeight: 'bold', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                        {art.badge || art.category}
                      </span>
                      <span style={{ fontSize: '13px', color: '#cbd5e1' }}>{art.author}</span>
                    </div>

                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 10px' }}>
                      {art.title}
                    </h3>

                    {art.excerpt && (
                      <div style={{ fontStyle: 'italic', color: '#38bdf8', background: 'rgba(0,0,0,0.3)', padding: '12px 14px', borderRadius: '10px', marginBottom: '12px', fontSize: '14px', borderRight: '3px solid #f59e0b' }}>
                        "{art.excerpt}"
                      </div>
                    )}

                    <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.8', margin: 0 }}>
                      {art.description}
                    </p>
                  </div>

                  {isAdmin && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
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
                        onClick={() => handleDeleteItem(art._id, 'arts')}
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

      </div>

      {/* Admin CMS Modal */}
      <AdminHubCMSModal
        hub="sudan"
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
