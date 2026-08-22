import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
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
  Flame
} from 'lucide-react';

export default function SudanPortal() {
  const { activeTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('heritage');
  const [selectedState, setSelectedState] = useState(null);

  const tabs = [
    { id: 'heritage', label: 'التراث والتقاليد', icon: Coffee, count: 'عادات وأصالة' },
    { id: 'states', label: 'ولايات السودان', icon: Compass, count: '18 ولاية' },
    { id: 'talents', label: 'مواهب وإبداعات', icon: Flame, count: 'طاقات شبابية' },
    { id: 'arts', label: 'الأدب والفنون', icon: Feather, count: 'شعر وموسيقى' },
  ];

  const heritageItems = [
    {
      title: 'الكرم والضيافة والنفير',
      category: 'قيم اجتماعية',
      badge: 'رمز التلاحم',
      description: 'يمثل "النفير" و"الفزع" إحدى أسمى صور التكافل الاجتماعي في السودان، حيث يتداعى الجميع لمساندة الجار والمحتاج، إلى جانب صواني رمضان في الشوارع التي تعكس كرم الشعب السوداني الأصيل.',
      icon: '🤝',
      tags: ['النفير', 'إكرام الضيف', 'التكافل'],
    },
    {
      title: 'الزي القومي السوداني',
      category: 'أزياء تراثية',
      badge: 'هوية وطنية',
      description: 'يتميز الزي القومي للرجل بالجلابية الفضفاضة والعمة والشال والمركوب الفاسي أو النمري، بينما تتألق المرأة السودانية بـ "الثوب السوداني" بألوانه وتطريزاته الفريدة كرمز للهيبة والجمال.',
      icon: '👘',
      tags: ['الثوب السوداني', 'الجلابية والعمة', 'المركوب'],
    },
    {
      title: 'طقوس "الجبنة" والقهوة السودانية',
      category: 'طقوس شعبية',
      badge: 'أصالة وسرور',
      description: 'جلسة الجبنة السودانية ليست مجرد شرب قهوة، بل هي ملتقى اجتماعي عائلي تدق فيه حبوب البن مع الهيل والزنجبيل في "الفندق" وتقدم في أواني الفخار مع البخور السوداني الفواح.',
      icon: '☕',
      tags: ['الجبنة', 'البخور', 'جلسة السمر'],
    },
    {
      title: 'المائدة والمأكولات التراثية',
      category: 'مطبخ سوداني',
      badge: 'نكهات أصيلة',
      description: 'تتنوع المائدة السودانية بأطباق تقليدية مميزة مثل العصيدة بالقيمة أو الويكة، القراصة مع دمعة الدجاج، الكسرة، الملاح بأنواعه، والشوربة السودانية مع المشروبات الشهيرة كالحلو-مر والكركديه والتبلدي.',
      icon: '🍲',
      tags: ['العصيدة', 'القراصة', 'الحلو-مر', 'التبلدي'],
    },
    {
      title: 'العرس السوداني والجرتق',
      category: 'مناسبات وأفراح',
      badge: 'تاريخ ممتد',
      description: 'طقس الجرتق الفريد يعود لآلاف السنين في الحضارة الكوشية، حيث يرتدي العروسان الحرير الأحمر وعقد الحلب والفركة، مع رش اللبن وتمني الخير والبركة لحياتهما الجديدة.',
      icon: '👑',
      tags: ['الجرتق', 'الحناء', 'الضريرة'],
    },
    {
      title: 'الحضارة الكوشية وأهرامات مروي',
      category: 'عمق تاريخي',
      badge: 'حضارة الآلاف',
      description: 'يضم السودان أكثر من 200 هرم تاريخي في البجراوية والنقعة والمصورات وكرمة، شواهد حية على عظمة ملوك كوش الذين حكموا وادي النيل وصنعوا فجراً للحضارة الإنسانية.',
      icon: '🏛️',
      tags: ['كوش', 'مروي', 'حضارة كرمة', 'نوباتيا'],
    },
  ];

  const statesData = [
    {
      name: 'ولاية الخرطوم',
      capital: 'الخرطوم',
      region: 'الوسط',
      landmark: 'مقرن النيلين الأبيض والأزرق ومتحف السودان القومي',
      desc: 'العاصمة السياسية والاقتصادية وملتقى النيلين الخالدين ومركز الجامعات والصروح العلمية.',
    },
    {
      name: 'ولاية الجزيرة',
      capital: 'ود مدني',
      region: 'الوسط',
      landmark: 'مشروع الجزيرة الزراعي وأكبر شبكة ري انسيابي',
      desc: 'سلة غذاء السودان وعاصمة الفن والجمال وموطن أكبر مشروع زراعي ذو إدارة موحدة.',
    },
    {
      name: 'ولاية البحر الأحمر',
      capital: 'بورتسودان',
      region: 'الشرق',
      landmark: 'ميناء بورتسودان، جزيرة سواكن التاريخية، وشعب سنقنيب المرجانية',
      desc: 'بوابة السودان البحرية على العالم، وتتميز بطبيعتها الساحلية وتراث البجا العريق.',
    },
    {
      name: 'ولاية نهر النيل',
      capital: 'الدامر',
      region: 'الشمال',
      landmark: 'أهرامات البجراوية ومروي ومصانع الأسمنت التاريخية',
      desc: 'أرض الحضارات الملكية ومروي القديمة ومقر العلم والزراعة النيلية الخصبة.',
    },
    {
      name: 'الولاية الشمالية',
      capital: 'دنقلا',
      region: 'الشمال',
      landmark: 'دفوفة كرمة، معبد صلب، وأهرامات نوري وجبل البركل',
      desc: 'مهد أقدم حضارات العالم ومنبع التاريخ الكوشي والنوبي والمناظر النيلية الخلابة.',
    },
    {
      name: 'ولاية كسلا',
      capital: 'كسلا',
      region: 'الشرق',
      landmark: 'جبال التاكا وتوتيل والقاش وبساتين السواقي الخضراء',
      desc: 'مدينة الجمال الساحر ومزارع الموز والمانجو وأصالة قبائل الشرق وعاداتهم الكريمة.',
    },
    {
      name: 'ولاية القضارف',
      capital: 'القضارف',
      region: 'الشرق',
      landmark: 'أسواق السمسم والمحاصيل الكبرى وبحيرة سد أعالي عطبرة وسيتيت',
      desc: 'عاصمة المحاصيل والحبوب الزيتية والمشاريع المطرية الضخمة والكرم الوافر.',
    },
    {
      name: 'ولاية سنار',
      capital: 'سنجة',
      region: 'الجنوب الشرقي',
      landmark: 'خزان سنار التاريخي وآثار السلطنة الزرقاء (مملكة سنار)',
      desc: 'أول دولة إسلامية موحدة في تاريخ السودان الحديث وحاضرة السدود والري التاريخي.',
    },
    {
      name: 'ولاية النيل الأبيض',
      capital: 'ربك',
      region: 'الوسط والجنوب',
      landmark: 'مصنع سكر كنانة ومحطة بحر أبيض وجزيرة أبا التاريخية',
      desc: 'موطن صناعة السكر وصيد الأسماك وثروة حيوانية هائلة على ضفاف النيل الأبيض.',
    },
    {
      name: 'ولاية النيل الأزرق',
      capital: 'الدمازين',
      region: 'الجنوب الشرقي',
      landmark: 'خزان الروصيرص، جبال الإنقسنا والغابات المدارية الغناء',
      desc: 'طبيعة استوائية غنية ومصادر طاقة كهرومائية وأراضٍ بكر وثروات معدنية وفيرة.',
    },
    {
      name: 'ولاية شمال كردفان',
      capital: 'الأبيض',
      region: 'الغرب',
      landmark: 'سوق الصمغ العربي، خور طقت، ورمال الأبيض الذهبية',
      desc: 'عروس الرمال وأكبر بورصة للصمغ العربي والمحاصيل والثروة الحيوانية في إفريقيا.',
    },
    {
      name: 'ولاية غرب كردفان',
      capital: 'الفولة',
      region: 'الغرب',
      landmark: 'حقول البترول الكبرى، بحيرة كيدي، وبساتين التبلدي',
      desc: 'شريان الطاقة والموارد النفطية وأشجار الهجليج والتبلدي العريقة ومجتمعات الرعاة الأصيلة.',
    },
    {
      name: 'ولاية جنوب كردفان',
      capital: 'كادقلي',
      region: 'الغرب',
      landmark: 'سلسلة جبال النوبة، وادي اللبن ومهرجانات الكُجور والسبر',
      desc: 'تنوع ثقافي وبيئي فريد في جبال النوبة الخضراء مع ثروات زراعية وطبيعية نادرة.',
    },
    {
      name: 'ولاية شمال دارفور',
      capital: 'الفاشر',
      region: 'الغرب',
      landmark: 'قصر السلطان علي دينار، واحة الملم وبحيرة فوهة البركان ميرا',
      desc: 'عاصمة سلطنة دارفور التاريخية ومحطة تجارة القوافل ودرب الأربعين الشهير.',
    },
    {
      name: 'ولاية جنوب دارفور',
      capital: 'نيالا',
      region: 'الغرب',
      landmark: 'جبل مرة البركاني، شلالات نيالا ووديان السافنا الخضراء',
      desc: 'نيالا البحير، مركز التجارة والإنتاج الحيواني ومناخ جبل مرة المعتدل الساحر.',
    },
    {
      name: 'ولاية غرب دارفور',
      capital: 'الجنينة',
      region: 'الغرب',
      landmark: 'وادي كجا، قلعة السلطان بحر الدين والحدود الإفريقية المفتوحة',
      desc: 'بوابة السودان الغربية على وسط وغرب إفريقيا وأرض الفواكه الاستوائية والفروسية.',
    },
    {
      name: 'ولاية وسط دارفور',
      capital: 'زالنجي',
      region: 'الغرب',
      landmark: 'قمة جبل مرة (كلة ديبة) والشلالات والينابيع المعدنية الدافئة',
      desc: 'جنة السودان الطبيعية وقمم جبل مرة التي تزرع التفاح والعنب والموالح على مدار العام.',
    },
    {
      name: 'ولاية شرق دارفور',
      capital: 'الضعين',
      region: 'الغرب',
      landmark: 'بحيرة أم بادر وغابات السافنا وسوق الإبل والمواشي الكبرى',
      desc: 'حاضرة الرعاة والفروسية وأكبر أسواق الماشية ومنتجات الفول السوداني والصمغ.',
    },
  ];

  const talents = [
    {
      title: 'الابتكار والبحث العلمي',
      name: 'مجموعة علماء الغد - كلية العلوم',
      field: 'أبحاث الكيمياء والفيزياء الحيوية',
      description: 'نخبة من طلابنا بالكلية يقودون أبحاثاً تطبيقية في تحلية المياه، تدوير المخلفات، وتطبيقات النانو تكنولوجي في الطاقة المتجددة.',
      icon: '🧪',
    },
    {
      title: 'البرمجة والذكاء الاصطناعي',
      name: 'فريق المطورين الشباب',
      field: 'علوم الحاسب والأنظمة الذكية',
      description: 'مشاريع مبتكرة في أتمتة الخدمات الجامعية ومنصات التعلم التفاعلي والحلول التقنية الموجهة لخدمة المجتمع السوداني.',
      icon: '💻',
    },
    {
      title: 'الفنون التشكيلية والخط العربي',
      name: 'معرض الإبداع السنوي',
      field: 'الفنون البصرية والتصميم',
      description: 'لوحات زيتية وجداريات تحاكي الحضارة السودانية والخط الكوفي والديواني بأنامل طلابنا الموهوبين.',
      icon: '🎨',
    },
    {
      title: 'التصوير وصناعة المحتوى',
      name: 'عدسة سودانية في القاهرة',
      field: 'الإعلام والتوثيق البصري',
      description: 'توثيق الحياة الطلابية، فعاليات الرابطة، والمعالم التراثية بأسلوب احترافي يربط الأجيال بجذورها الأصيلة.',
      icon: '📸',
    },
  ];

  const literatureArts = [
    {
      title: 'رواد الشعر والأدب الخالد',
      category: 'الشعر السوداني',
      items: [
        {
          poet: 'محمد الفيتوري (شاعر إفريقيا والعروبة)',
          quote: '«دنيا لا يملكها من يملكها.. أغنى أهليها سادتها الفقراء»',
          desc: 'أحد أعظم رواد شعر التفعيلة والتحرر الإفريقي والقومي.',
        },
        {
          poet: 'الهادي آدم',
          quote: '«أغداً ألقاك؟ يا خوف فؤادي من غدِ.. يا لشوقي واحتراقي في انتظار الموعدِ»',
          desc: 'الشاعر السوداني الفذ الذي غنت له كوكب الشرق أم كلثوم رائعته الخالدة.',
        },
        {
          poet: 'التجاني يوسف بشير',
          quote: '«يا نيل، هل شربت من دمي قطرة، أم روّت أحلامك قيثارتي؟»',
          desc: 'عبقري الشعر والروح الصوفية الفياضة وأمير شعراء التجديد في السودان.',
        },
        {
          poet: 'روضة الحاج',
          quote: '«في عينيك عنواني.. وفي كفيك أحلامي.. وفي قلبك أوطاني»',
          desc: 'صوت شعري نسائي سوداني بارز يحمل لواء القصيدة الفصحى والبيان الرفيع.',
        },
      ],
    },
    {
      title: 'الرواية وسرد الهوية',
      category: 'الأدب الروائي',
      items: [
        {
          poet: 'الطيب صالح (عبقري الرواية العربية)',
          quote: '«موسم الهجرة إلى الشمال - عرس الزين - دومة ود حامد»',
          desc: 'صنفت روايته "موسم الهجرة إلى الشمال" ضمن أفضل مئة رواية في التاريخ الإنساني.',
        },
        {
          poet: 'حمور زيادة & أمير تاج السر',
          quote: '«شوق الدرويش - صائد اليرقات - إيبولا 76»',
          desc: 'أصوات روائية سودانية معاصرة حازت على أرفع الجوائز الأدبية العربية والعالمية.',
        },
      ],
    },
    {
      title: 'السلم الخماسي والموسيقى السودانية',
      category: 'الموسيقى والتراث الغنائي',
      items: [
        {
          poet: 'الموسيقى الخماسية الأصيلة',
          quote: '«طرب الحقيبة، غناء الطنابير، وأوركسترا الإذاعة والتلفزيون»',
          desc: 'تتميز الموسيقى السودانية بالاعتماد على السلم الخماسي الدافئ الذي يمزج بين الإيقاعات الإفريقية العميقة والهارموني الشرقي.',
        },
      ],
    },
  ];

  return (
    <div style={{ minHeight: '90vh', paddingBottom: '70px', direction: 'rtl' }}>
      {/* 1. Hero Section الثقافي التراثي الفخم */}
      <div
        style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #0b1f14 0%, #132e1b 40%, #2e1a06 100%)',
          borderBottom: `2px solid ${activeTheme.accent}`,
          padding: '60px 20px 50px',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        }}
      >
        {/* زخارف وخلفيات هندسية تفاعلية */}
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            left: '-50px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-40px',
            right: '-40px',
            width: '350px',
            height: '350px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2, textAlign: 'center' }}>
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
            <span>🇸🇩</span>
            <span>بوابة الأصالة والهوية الوطنية</span>
            <span>✨</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(28px, 5vw, 42px)',
              fontWeight: '900',
              color: '#ffffff',
              margin: '0 0 14px',
              textShadow: '0 4px 20px rgba(0,0,0,0.6)',
              letterSpacing: '-0.5px',
            }}
          >
            سوداننا .. موطن الحضارة وملتقى النيلين
          </h1>

          <p
            style={{
              maxWidth: '780px',
              margin: '0 auto 26px',
              fontSize: '15px',
              lineHeight: '1.9',
              color: 'rgba(255, 255, 255, 0.85)',
            }}
          >
            واحة رقمية توثق عراقة التراث السوداني، وتستعرض تنوع الولايات الثقافي والجغرافي، وتحتفي بإبداعات ومواهب طلاب كلية العلوم - جامعة القاهرة، وتضيء على درر الأدب والفنون السودانية الخالدة.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div
              style={{
                backgroundColor: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.15)',
                padding: '10px 20px',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>🏛️</span>
              <strong>أكثر من 7,000 سنة حضارة كوشية ونوبية</strong>
            </div>
            <div
              style={{
                backgroundColor: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.15)',
                padding: '10px 20px',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>🌊</span>
              <strong>ملتقى النيل الأبيض والأزرق الخالد</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs لتبويبات سوداننا الأربعة */}
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
                  gap: '10px',
                  padding: '14px 18px',
                  borderRadius: '14px',
                  border: isSelected ? `2px solid ${activeTheme.accent}` : '2px solid transparent',
                  background: isSelected
                    ? `linear-gradient(135deg, ${activeTheme.primary}40, ${activeTheme.secondary}40)`
                    : 'transparent',
                  color: isSelected ? activeTheme.accentLight : activeTheme.textMain,
                  cursor: 'pointer',
                  fontWeight: isSelected ? 'bold' : '600',
                  fontSize: '14px',
                  transition: 'all 0.25s ease',
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

      {/* 3. Tab Contents */}
      <div style={{ maxWidth: '1200px', margin: '30px auto 0', padding: '0 20px' }}>
        
        {/* التبويب الأول: التراث */}
        {activeTab === 'heritage' && (
          <div>
            <div style={{ marginBottom: '22px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: activeTheme.textMain, margin: '0 0 6px' }}>
                🌾 التراث السوداني الأصيل والعادات العريقة
              </h2>
              <p style={{ color: activeTheme.textMuted, fontSize: '14px', margin: 0 }}>
                شواهد حية على قيم التكافل، والكرم الباذخ، والأزياء القومية، وطقوس الحياة الاجتماعية السودانية.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '20px',
              }}
            >
              {heritageItems.map((item, idx) => (
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
                    boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
                    transition: 'transform 0.2s ease, border-color 0.2s ease',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <span style={{ fontSize: '32px' }}>{item.icon}</span>
                      <span
                        style={{
                          backgroundColor: 'rgba(245, 158, 11, 0.15)',
                          color: '#fbbf24',
                          border: '1px solid #f59e0b',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          padding: '3px 10px',
                          borderRadius: '20px',
                        }}
                      >
                        {item.badge}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: activeTheme.textMain, margin: '0 0 10px' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '13px', lineHeight: '1.8', color: activeTheme.textMuted, margin: '0 0 16px' }}>
                      {item.description}
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', paddingTop: '12px', borderTop: `1px solid ${activeTheme.border}` }}>
                    {item.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        style={{
                          fontSize: '11px',
                          backgroundColor: 'rgba(255,255,255,0.06)',
                          color: activeTheme.accentLight,
                          padding: '2px 8px',
                          borderRadius: '8px',
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* التبويب الثاني: الولايات الـ 18 */}
        {activeTab === 'states' && (
          <div>
            <div style={{ marginBottom: '22px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: activeTheme.textMain, margin: '0 0 6px' }}>
                🗺️ ولايات السودان الـ 18 (تنوع جغرافي وثراء إنساني)
              </h2>
              <p style={{ color: activeTheme.textMuted, fontSize: '14px', margin: 0 }}>
                استكشف ولايات السودان من الشمال إلى الجنوب ومن الشرق إلى الغرب، وتعرف على عواصمها ومعالمها الأثرية والإنتاجية.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
                gap: '16px',
              }}
            >
              {statesData.map((st, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedState(st)}
                  style={{
                    backgroundColor: activeTheme.bgCard,
                    borderRadius: '16px',
                    border: `1px solid ${selectedState?.name === st.name ? activeTheme.accent : activeTheme.border}`,
                    padding: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 6px 18px rgba(0,0,0,0.2)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={18} color={activeTheme.accent} />
                      <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0, color: activeTheme.textMain }}>
                        {st.name}
                      </h3>
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(255,255,255,0.08)',
                        color: activeTheme.textMuted,
                      }}
                    >
                      إقليم {st.region}
                    </span>
                  </div>

                  <div style={{ fontSize: '12px', color: activeTheme.accentLight, fontWeight: 'bold', marginBottom: '8px' }}>
                    العاصمة: {st.capital}
                  </div>

                  <p style={{ fontSize: '12px', color: activeTheme.textMuted, lineHeight: '1.6', margin: '0 0 10px' }}>
                    {st.desc}
                  </p>

                  <div style={{ fontSize: '11px', color: activeTheme.textMain, background: 'rgba(0,0,0,0.2)', padding: '6px 10px', borderRadius: '8px' }}>
                    🌟 <strong>أبرز المعالم:</strong> {st.landmark}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* التبويب الثالث: المواهب والإبداعات */}
        {activeTab === 'talents' && (
          <div>
            <div style={{ marginBottom: '22px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: activeTheme.textMain, margin: '0 0 6px' }}>
                💡 طاقات ومواهب طلاب كلية العلوم - جامعة القاهرة
              </h2>
              <p style={{ color: activeTheme.textMuted, fontSize: '14px', margin: 0 }}>
                مساحة مخصصة للاحتفاء بإبداعات الطلاب السودانيين في شتى المجالات العلمية، والبرمجية، والفنية، والقيادية.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
              }}
            >
              {talents.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: activeTheme.bgCard,
                    borderRadius: '18px',
                    border: `1px solid ${activeTheme.border}`,
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>{item.icon}</div>
                  <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: activeTheme.textMain, margin: '0 0 4px' }}>
                    {item.title}
                  </h3>
                  <div style={{ fontSize: '13px', color: activeTheme.accentLight, fontWeight: 'bold', marginBottom: '6px' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold', marginBottom: '12px' }}>
                    📍 {item.field}
                  </div>
                  <p style={{ fontSize: '13px', lineHeight: '1.7', color: activeTheme.textMuted, margin: 0 }}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            {/* دعوة للمشاركة في نادي المواهب */}
            <div
              style={{
                marginTop: '30px',
                background: `linear-gradient(135deg, ${activeTheme.primary}30 0%, ${activeTheme.secondary}30 100%)`,
                border: `1px solid ${activeTheme.accent}`,
                borderRadius: '18px',
                padding: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: activeTheme.textMain, margin: '0 0 6px' }}>
                  هل لديك موهبة أو اختراع أو بحث علمي متميز؟
                </h3>
                <p style={{ color: activeTheme.textMuted, fontSize: '13px', margin: 0 }}>
                  تتيح رابطة الطلاب السودانيين توثيق ودعم مواهب أعضائها وعرضها في المعارض والملتقيات العلمية الكبرى.
                </p>
              </div>
              <a
                href="https://wa.me/201000000000"
                target="_blank"
                rel="noreferrer"
                style={{
                  background: `linear-gradient(135deg, ${activeTheme.accent} 0%, #d97706 100%)`,
                  color: '#0b1622',
                  padding: '10px 22px',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>تقديم موهبتك للرابطة</span>
                <ChevronRight size={16} />
              </a>
            </div>
          </div>
        )}

        {/* التبويب الرابع: الأدب والفنون */}
        {activeTab === 'arts' && (
          <div>
            <div style={{ marginBottom: '22px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: activeTheme.textMain, margin: '0 0 6px' }}>
                🖋️ الأدب، الشعر، وروائع الإبداع السوداني
              </h2>
              <p style={{ color: activeTheme.textMuted, fontSize: '14px', margin: 0 }}>
                رحلة في وجدان القصيدة السودانية الفصحى، وروائع الرواية العالمية، وسحر الإيقاع الخماسي.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {literatureArts.map((section, idx) => (
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(245, 158, 11, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: activeTheme.accent,
                      }}
                    >
                      <Feather size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: activeTheme.textMain, margin: 0 }}>
                        {section.title}
                      </h3>
                      <span style={{ fontSize: '12px', color: activeTheme.accentLight }}>
                        {section.category}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '16px',
                    }}
                  >
                    {section.items.map((item, iIdx) => (
                      <div
                        key={iIdx}
                        style={{
                          backgroundColor: 'rgba(0,0,0,0.25)',
                          borderRadius: '14px',
                          border: `1px solid ${activeTheme.border}`,
                          padding: '18px',
                        }}
                      >
                        <div style={{ fontSize: '15px', fontWeight: 'bold', color: activeTheme.textMain, marginBottom: '8px' }}>
                          {item.poet}
                        </div>
                        <div
                          style={{
                            fontSize: '13px',
                            fontStyle: 'italic',
                            color: activeTheme.accentLight,
                            marginBottom: '10px',
                            lineHeight: '1.6',
                            background: 'rgba(255,255,255,0.03)',
                            padding: '8px 12px',
                            borderRadius: '8px',
                          }}
                        >
                          {item.quote}
                        </div>
                        <p style={{ fontSize: '12px', color: activeTheme.textMuted, lineHeight: '1.7', margin: 0 }}>
                          {item.desc}
                        </p>
                      </div>
                    ))}
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
