import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  ChevronLeft,
  X,
  Briefcase,
  Compass,
  Search,
  FileCheck
} from 'lucide-react';

export const ACADEMIC_MAJORS_DATA = [
  {
    id: 'astronomy',
    title: 'قسم الفلك والأرصاد الجوية',
    titleEn: 'Astronomy & Meteorology Department',
    icon: '🔭',
    badge: 'علوم الفضاء والغلاف الجوي',
    color: '#6366f1',
    bgGlow: 'rgba(99, 102, 241, 0.2)',
    accentGradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    creditHours: '146 ساعة معتمدة',
    trackStart: 'مسار الفلك يبدأ من السنة الأولى (المستوى الأول - 38 ساعة معتمدة)',
    prerequisites: [
      'النجاح الصافي بدون أي مواد رسوب في السنة الأولى.',
      'معدل تراكمي (GPA) أعلى من 1.5 كشرط للتثبيت والاستمرار بالمسار.',
    ],
    keySubjects: [
      'علم الفلك العام والفيزياء الفلكية (Astronomy & Astrophysics)',
      'الرياضيات البحتة والتطبيقية (رياضة 1 ورياضة 2)',
      'الفيزياء العامة (General Physics)',
      'الكيمياء العامة (كيمياء 1 وكيمياء 2)',
      'البرمجة والخوارزميات العلمية بلغة بايثون (Python Programming)',
      'الأرصاد الجوية والديناميكا المناخية (Meteorology & Dynamics)'
    ],
    description: 'قسم نوعي متخصص يهدف إلى إعداد كوادر علمية رائدة في دراسة الأجرام السماوية، الظواهر الفلكية، علوم الفضاء، وتحليل الأرصاد الجوية والمناخية باستخدام أحدث تقنيات النمذجة الحاسوبية والبرمجة العلمية.',
    careerFields: [
      'المراصد الفلكية ومراكز علوم الفضاء والأبحاث الكونية.',
      'الهيئة العامة للأرصاد الجوية ومحطات التنبؤات المناخية والبيئية.',
      'وكالات الفضاء والأقمار الصناعية ومراكز الاستشعار عن بعد.',
      'تحليل البيانات العلمية والنمذجة الرياضية وبرمجة المحاكاة (Scientific Data Analysis).',
      'المؤسسات البحثية والجامعات والتدريس الأكاديمي.'
    ],
    highlights: [
      { label: 'إجمالي الساعات', value: '146 ساعة' },
      { label: 'سنة بدء المسار', value: 'المستوى الأول (38 ساعة)' },
      { label: 'شرط التثبيت', value: 'نجاح صافٍ + GPA > 1.5' },
      { label: 'لغة البرمجة', value: 'بايثون (Python)' }
    ]
  },
  {
    id: 'single-chemistry',
    title: 'قسم الكيمياء المنفرد',
    titleEn: 'Single Chemistry Department',
    icon: '🧪',
    badge: 'العلوم الكيميائية والبحثية',
    color: '#f59e0b',
    bgGlow: 'rgba(245, 158, 11, 0.2)',
    accentGradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    creditHours: '146 ساعة معتمدة',
    trackStart: 'يبدأ التخصص المتعمق والمتقدم من المستوى الثاني (السنة الثانية)',
    prerequisites: [
      'الحصول على تقدير "جيد" على الأقل في مقرر كيمياء 101 (ك101).',
      'الحصول على تقدير "جيد" على الأقل في مقرر كيمياء 102 (ك102).'
    ],
    keySubjects: [
      'الكيمياء العضوية وتشييد المركبات (Organic Chemistry)',
      'الكيمياء الفيزيائية والديناميكا الحرارية (Physical Chemistry)',
      'علم الإحصاء التطبيقي للكيميائيين (Applied Statistics for Chemists)',
      'علم البلورات والمتبلورات (Crystallography)',
      'الكيمياء غير العضوية والتحليلية (Inorganic & Analytical Chemistry)',
      'مشروع التخرج والبحث العلمي في الفصل الدراسي الثامن'
    ],
    description: 'يعد قسم الكيمياء المنفرد من أعرق وأشمل الأقسام بالكلية، حيث يركز على دراسة بنية المادة وتفاعلاتها الدقيقة، التخليق العضوي، التحاليل الطيفية، والتحضيرات الصناعية المتقدمة بما يؤهل الخريج لسوق العمل الصناعي والبحثي بكفاءة واقتدار.',
    careerFields: [
      'شركات ومصانع الأدوية والمستحضرات الطبية (البحث والتطوير R&D وضبط الجودة QC).',
      'معامل ومختبرات التحاليل الطبية والبيوكيميائية ومختبرات السموم والرقابة.',
      'صناعات البوليمرات والبلاستيك والبتروكيماويات والزيوت.',
      'صناعات الأصباغ، الدهانات، العطور، والمنظفات ومواد التجميل.',
      'الهيئات الرقابية مثل هيئة الدواء والرقابة على الصادرات والمواصفات والجودة.'
    ],
    highlights: [
      { label: 'إجمالي الساعات', value: '146 ساعة' },
      { label: 'شرط التشعيب', value: 'تقدير جيد في ك101 و ك102' },
      { label: 'سنة التخصص', value: 'المستوى الثاني' },
      { label: 'متطلب التخرج', value: 'مشروع بحثي (الفصل 8)' }
    ]
  },
  {
    id: 'single-physics',
    title: 'قسم الفيزياء المنفرد',
    titleEn: 'Single Physics Department',
    icon: '⚛️',
    badge: 'الفيزياء النظرية والتجريبية المتقدمة',
    color: '#0ea5e9',
    bgGlow: 'rgba(14, 165, 233, 0.2)',
    accentGradient: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
    creditHours: '146 ساعة معتمدة',
    trackStart: 'تخصص متعمق وبحثي يبدأ من المستوى الثاني (السنة الثانية)',
    prerequisites: [
      'الحصول على تقدير "جيد" على الأقل في مقرر فيزياء 101 (ف101).',
      'الحصول على تقدير "جيد" على الأقل في مقرر فيزياء 102 (ف102).'
    ],
    keySubjects: [
      'الفيزياء النووية والإشعاعية (Nuclear & Radiation Physics)',
      'ميكانيكا الكم والفيزياء الإحصائية (Quantum Mechanics)',
      'الفيزياء النظرية والكهرومغناطيسية (Theoretical Physics)',
      'فيزياء الجوامد والمواد المتقدمة والإلكترونيات (Solid State & Electronics)',
      'الفيزياء الطبية الحيوية والإشعاع العلاجي (Medical Physics)'
    ],
    description: 'قسم متقدم يركز على استكشاف أعمق قوانين الكون الطبيعية، من الجسيمات الأولية والذرة إلى النظم الفيزيائية الكبرى والإلكترونيات وتطبيقات الطاقة والفيزياء الطبية الحديثة.',
    careerFields: [
      'هيئة الطاقة الذرية ومراكز الأبحاث النووية والوقاية الإشعاعية.',
      'مراكز الأورام والمستشفيات التخصصية (أخصائي فيزياء طبية وتخطيط علاجي إشعاعي).',
      'مصلحة الطب الشرعي والمختبرات الجنائية والتحقيقات الفنية.',
      'قطاع البترول والتعدين والتنقيب الجيوفيزيائي ومعالجة البيانات الفيزيائية.',
      'شركات التكنولوجيا المتقدمة والاتصالات والإلكترونيات والطاقة المتجددة.'
    ],
    highlights: [
      { label: 'إجمالي الساعات', value: '146 ساعة' },
      { label: 'شرط التشعيب', value: 'تقدير جيد في ف101 و ف102' },
      { label: 'سنة التخصص', value: 'المستوى الثاني' },
      { label: 'أبرز المجالات', value: 'فيزياء طبية / طاقة ذرية / بترول' }
    ]
  },
  {
    id: 'biophysics',
    title: 'قسم الفيزياء الحيوية',
    titleEn: 'Biophysics Department',
    icon: '🧬',
    badge: 'تكامل العلوم الحيوية والفيزيائية',
    color: '#10b981',
    bgGlow: 'rgba(16, 185, 129, 0.2)',
    accentGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    creditHours: '146 ساعة معتمدة',
    trackStart: 'سنة أولى عامة تمهيدية، ثم الانطلاق في المقررات التخصصية',
    prerequisites: [
      'اجتياز السنة الأولى العامة بمعدل تأهيلي مناسب للقسم.',
      'شغف بالربط بين النظريات الفيزيائية والأنظمة والآليات البيولوجية.'
    ],
    keySubjects: [
      'الفيزياء الحيوية الخلوية والجزيئية (Cellular & Molecular Biophysics)',
      'الفيزياء الإشعاعية والتصوير الطبي التشخيصي (Medical Imaging & Radiography)',
      'الديناميكا الحرارية للأنظمة الحيوية (Biological Thermodynamics)',
      'الفسيولوجيا الكهربية والموجات الحيوية (Electrophysiology & Biosignals)',
      'الرياضيات والنمذجة الحيوية (Biomathematics & Biological Modeling)'
    ],
    description: 'تخصص فريد يجمع بتناغم عميق بين أربعة علوم أساسية: الفيزياء، البيولوجيا، الكيمياء، والرياضيات التطبيقية، لفهم آليات الحياة على المستوى الجزيئي والخلوي وتطوير حلول طبية وتقنية متقدمة للأجهزة التشخيصية والعلاجية.',
    careerFields: [
      'المستشفيات والمراكز الطبية الكبرى (أخصائي فيزياء طبية - رنين مغناطيسي MRI، وأشعة مقطعية CT).',
      'مراكز علاج الأورام بالأشعة والطب النووي (Radiation Oncology Labs).',
      'شركات الأجهزة والمعدات الطبية الحيوية (تطوير، معايرة، ودعم فني وتطبيقي).',
      'مراكز البحث العلمي والجامعات في مجالات النانو تكنولوجي الحيوي والبيولوجيا الجزيئية.'
    ],
    highlights: [
      { label: 'طبيعة التخصص', value: 'تكامل (فيزياء + بيولوجي + كيمياء + رياضة)' },
      { label: 'سنة التخصص', value: 'بعد السنة الأولى العامة' },
      { label: 'أهم الوظائف', value: 'فيزياء طبية / رنين مغناطيسي وأشعة' },
      { label: 'فرص البحث', value: 'عالية جداً دولياً ومحلياً' }
    ]
  },
  {
    id: 'animal-chemistry',
    title: 'قسم كيمياء الحيوان',
    titleEn: 'Animal Chemistry (Zoology & Chemistry)',
    icon: '🐾',
    badge: 'تخصص مزدوج (Double Major)',
    color: '#f43f5e',
    bgGlow: 'rgba(244, 63, 94, 0.2)',
    accentGradient: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
    creditHours: '146 ساعة معتمدة',
    trackStart: 'تخصص مزدوج متكامل يجمع علم الحيوان والعلوم الكيميائية',
    prerequisites: [
      'اجتياز مقرري الكيمياء ك101 وك102 بنجاح.',
      'اجتياز مقرري علم الحيوان ح101 وح102 بنجاح.'
    ],
    keySubjects: [
      'علم الحيوان العام والفقاريات واللافقاريات (Vertebrates & Invertebrates)',
      'علم الطفيليات والمناعة الطفيلية (Parasitology)',
      'العلوم الحيوية المتقدمة: علم وظائف الأعضاء (Physiology)، علم الخلية، وعلم الوراثة (Genetics)',
      'الكيمياء العضوية والتحليلية والحيوية (Organic, Analytical & Biochemistry)',
      'التشريح والأنسجة والأجنة (Histology & Embryology)'
    ],
    description: 'تخصص مزدوج يتيح للطالب إتقاناً واسعاً لعلوم الحيوان والبيولوجيا الوظيفية والوراثة بالتوازي مع أساس كيميائي متين، مما يفتح آفاقاً واسعة في الأبحاث الوراثية، بنوك الدم، ومراكز الإخصاب والحقن المجهري المتقدم.',
    careerFields: [
      'مراكز وأبحاث الوراثة والجينوم والخلايا الجذعية (Genetics & Stem Cells).',
      'بنوك الدم المركزية والمستشفيات العامة والخاصة.',
      'معاهد ومراكز الأورام وأبحاث السرطان والبيولوجيا التطبيقية.',
      'مراكز علاج العقم والإخصاب والحقن المجهري (IVF & Embryology Labs).',
      'معامل التحاليل الطبية والمختبرات البيطرية ومصانع المصول واللقاحات.'
    ],
    highlights: [
      { label: 'نوع التخصص', value: 'مزدوج (كيمياء + علم حيوان)' },
      { label: 'شروط القبول', value: 'اجتياز ك101/102 و ح101/102' },
      { label: 'المجالات الحيوية', value: 'وراثة / طفيليات / فسيولوجي' },
      { label: 'سوق العمل', value: 'حقن مجهري / بنوك دم / وراثة' }
    ]
  },
  {
    id: 'microbiology',
    title: 'قسم الميكروبيولوجي',
    titleEn: 'Microbiology Department',
    icon: '🧫',
    badge: 'علوم الكائنات الدقيقة والبيولوجيا الجزيئية',
    color: '#a855f7',
    bgGlow: 'rgba(168, 85, 247, 0.2)',
    accentGradient: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
    creditHours: '146 ساعة معتمدة',
    trackStart: 'تخصص متعمق في الأحياء الدقيقة وتقنيات التشخيص الجزيئي',
    prerequisites: [
      'اجتياز متطلبات شعبة العلوم البيولوجية والكيمياء التأسيسية.',
      'مهارات معملية دقيقة في التعامل مع المزارع البكتيرية والأوساط المعقمة.'
    ],
    keySubjects: [
      'علم البكتيريا العام والطبي (Bacteriology)',
      'علم الفيروسات والفطريات (Virology & Mycology)',
      'علم المناعة والأمصال المتقدم (Immunology & Serology)',
      'الوراثة الميكروبية وهندسة الجينات (Microbial Genetics)',
      'البيولوجيا الجزيئية وتقنيات تفاعل البوليميراز المتسلسل (Molecular Biology & PCR)',
      'الميكروبيولوجيا التطبيقية والصناعية (Applied & Industrial Microbiology)'
    ],
    description: 'يركز القسم على دراسة الكائنات الحية الدقيقة (البكتيريا، الفيروسات، الفطريات)، وآليات إمراضها وتشخيصها الدقيق، واستخداماتها الحيوية في صناعة المضادات الحيوية واللقاحات والمستحضرات الدوائية والغذائية.',
    careerFields: [
      'المستشفيات والمختبرات الطبية التخصصية (أخصائي ميكروبيولوجي ومكافحة العدوى Infection Control).',
      'شركات ومصانع الأدوية (إدارات مراقبة الجودة وضمان الجودة QC / QA والاختبارات الميكروبية).',
      'شركات ومصانع الأغذية والمشروبات (فحص السلامة الميكروبيولوجية وجودة التصنيع).',
      'شركات ومحطات تنقية المياه ومعالجة مياه الشرب والصرف الصحي.',
      'مراكز البحوث وإنتاج اللقاحات ومختبرات البيولوجيا الجزيئية وتقنيات PCR.'
    ],
    highlights: [
      { label: 'مجال الدراسة', value: 'بكتيريا / فيروسات / فطريات' },
      { label: 'تقنيات متقدمة', value: 'PCR / بيولوجيا جزيئية / مناعة' },
      { label: 'أبرز الوظائف', value: 'مكافحة عدوى / QC أدوية وأغذية' },
      { label: 'أهمية التخصص', value: 'رئيسي وحاسم في القطاع الصحي' }
    ]
  }
];

export default function AcademicMajorsGuide() {
  const [selectedMajor, setSelectedMajor] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');

  const filteredMajors = ACADEMIC_MAJORS_DATA.filter((major) => {
    if (!searchFilter.trim()) return true;
    const query = searchFilter.toLowerCase();
    return (
      major.title.toLowerCase().includes(query) ||
      major.titleEn.toLowerCase().includes(query) ||
      major.description.toLowerCase().includes(query) ||
      major.badge.toLowerCase().includes(query) ||
      major.careerFields.some((c) => c.toLowerCase().includes(query)) ||
      major.keySubjects.some((s) => s.toLowerCase().includes(query))
    );
  });

  return (
    <div style={{ direction: 'rtl', width: '100%' }}>
      {/* Intro Header Section */}
      <div
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(245, 158, 11, 0.12) 0%, rgba(15, 23, 42, 0.8) 70%)',
          borderRadius: '24px',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          padding: '28px 24px',
          marginBottom: '28px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 12px 36px rgba(0,0,0,0.35)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                padding: '4px 14px',
                borderRadius: '20px',
                color: '#fbbf24',
                fontSize: '12px',
                fontWeight: 'bold',
                marginBottom: '10px',
              }}
            >
              <Compass size={14} />
              <span>دليل التشعيب والتخصصات الأكاديمية</span>
            </div>
            <h2 style={{ fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: '900', color: '#ffffff', margin: '0 0 8px' }}>
              دليل التخصصات والأقسام العلمية (Academic Majors Guide)
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '14px', margin: 0, lineHeight: '1.7', maxWidth: '720px' }}>
              استكشف تفاصيل الأقسام الأكاديمية بكلية العلوم جامعة القاهرة: الساعات المعتمدة، شروط التشعيب والتثبيت، المواد والمقررات التأسيسية، ومجالات وسوق العمل لكل تخصص.
            </p>
          </div>

          {/* Search Filter */}
          <div style={{ position: 'relative', minWidth: '260px', width: '100%', maxWidth: '340px' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
              }}
            />
            <input
              type="text"
              placeholder="ابحث في التخصصات، المقررات، أو الوظائف..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 40px 11px 16px',
                borderRadius: '12px',
                background: 'rgba(11, 19, 38, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                color: '#ffffff',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#f59e0b';
                e.target.style.boxShadow = '0 0 16px rgba(245, 158, 11, 0.25)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.18)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>
      </div>

      {/* Grid of Interactive Major Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          marginBottom: '32px',
        }}
      >
        {filteredMajors.map((major) => (
          <div
            key={major.id}
            onClick={() => setSelectedMajor(major)}
            className="group"
            style={{
              backgroundColor: '#0f172a',
              borderRadius: '22px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
              transition: 'transform 0.25s cubic-bezier(0.34, 1.4, 0.64, 1), box-shadow 0.25s ease, border-color 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02) translateY(-4px)';
              e.currentTarget.style.borderColor = `${major.color}99`;
              e.currentTarget.style.boxShadow = `0 18px 40px -10px rgba(0, 0, 0, 0.7), 0 0 28px ${major.bgGlow}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1) translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.4)';
            }}
          >
            {/* Top Glowing Accent Strip */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: major.accentGradient,
              }}
            />

            <div>
              {/* Header with Icon & Hours Badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '16px',
                    backgroundColor: major.bgGlow,
                    border: `1px solid ${major.color}55`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    boxShadow: `0 4px 14px ${major.bgGlow}`,
                    transition: 'transform 0.25s ease',
                  }}
                >
                  {major.icon}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <span
                    style={{
                      background: major.bgGlow,
                      color: major.color,
                      border: `1px solid ${major.color}44`,
                      padding: '3px 10px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                    }}
                  >
                    {major.badge}
                  </span>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                    ⏳ {major.creditHours}
                  </span>
                </div>
              </div>

              {/* Title & English Subtitle */}
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '800',
                  color: '#ffffff',
                  margin: '0 0 4px',
                  lineHeight: '1.4',
                }}
              >
                {major.title}
              </h3>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '12px', fontFamily: 'monospace' }}>
                {major.titleEn}
              </div>

              {/* Short Preview Description */}
              <p
                style={{
                  color: '#cbd5e1',
                  fontSize: '13px',
                  lineHeight: '1.7',
                  margin: '0 0 16px',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {major.description}
              </p>

              {/* Key Quick Highlight Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                {major.highlights.slice(0, 2).map((hl, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '4px 8px',
                      fontSize: '11px',
                      color: '#e2e8f0',
                    }}
                  >
                    <span style={{ color: '#94a3b8' }}>{hl.label}:</span>{' '}
                    <strong style={{ color: '#fbbf24' }}>{hl.value}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Card Action Footer */}
            <div
              style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: '12px', color: major.color, fontWeight: 'bold' }}>
                المسار والمقررات وسوق العمل
              </span>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: major.bgGlow,
                  color: '#ffffff',
                  border: `1px solid ${major.color}66`,
                  padding: '6px 12px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  transition: 'all 0.2s ease',
                }}
              >
                <span>عرض التفاصيل</span>
                <ChevronLeft size={14} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMajors.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '40px 20px',
            background: '#0f172a',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#94a3b8',
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔍</div>
          <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#ffffff', marginBottom: '4px' }}>
            لم يتم العثور على تخصص يطابق بحثك
          </div>
          <div style={{ fontSize: '12px' }}>يرجى التحقق من الكلمة المفتاحية أو مسح حقل البحث.</div>
        </div>
      )}

      {/* Sleek Major Details Modal */}
      {selectedMajor && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            direction: 'rtl',
            animation: 'popInSuccess 0.25s ease-out',
          }}
          onClick={() => setSelectedMajor(null)}
        >
          <div
            style={{
              backgroundColor: '#0b1329',
              border: `2px solid ${selectedMajor.color}88`,
              borderRadius: '24px',
              width: '100%',
              maxWidth: '750px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: `0 25px 60px -12px rgba(0, 0, 0, 0.9), 0 0 35px ${selectedMajor.bgGlow}`,
              padding: '28px',
              color: '#ffffff',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                paddingBottom: '18px',
                marginBottom: '20px',
                gap: '14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '58px',
                    height: '58px',
                    borderRadius: '18px',
                    backgroundColor: selectedMajor.bgGlow,
                    border: `1px solid ${selectedMajor.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    boxShadow: `0 0 20px ${selectedMajor.bgGlow}`,
                    shrink: 0,
                  }}
                >
                  {selectedMajor.icon}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        background: selectedMajor.bgGlow,
                        color: selectedMajor.color,
                        border: `1px solid ${selectedMajor.color}55`,
                        padding: '2px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                      }}
                    >
                      {selectedMajor.badge}
                    </span>
                    <span
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        color: '#cbd5e1',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                      }}
                    >
                      ⏳ {selectedMajor.creditHours}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#ffffff', margin: '4px 0 2px' }}>
                    {selectedMajor.title}
                  </h2>
                  <div style={{ fontSize: '13px', color: '#94a3b8', fontFamily: 'monospace' }}>
                    {selectedMajor.titleEn}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedMajor(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#cbd5e1',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  shrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                  e.currentTarget.style.color = '#ef4444';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.color = '#cbd5e1';
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Highlights Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '10px',
                marginBottom: '22px',
              }}
            >
              {selectedMajor.highlights.map((hl, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(15, 23, 42, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '2px' }}>{hl.label}</div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: selectedMajor.color }}>
                    {hl.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Body Sections */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* 1. Overview */}
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 'bold', color: '#fbbf24', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={16} />
                  <span>نظرة عامة والتعريف بالتخصص:</span>
                </h4>
                <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.8', margin: 0, textAlign: 'justify' }}>
                  {selectedMajor.description}
                </p>
              </div>

              {/* 2. Track & Prerequisites */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '16px',
                }}
              >
                <h4 style={{ fontSize: '15px', fontWeight: 'bold', color: selectedMajor.color, margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileCheck size={16} />
                  <span>شروط التشعيب والتثبيت والمسار الدراسي:</span>
                </h4>
                <div style={{ fontSize: '13px', color: '#f8fafc', marginBottom: '10px', fontWeight: '600' }}>
                  📌 <strong>بداية المسار:</strong> {selectedMajor.trackStart}
                </div>
                <ul style={{ margin: 0, paddingRight: '20px', color: '#cbd5e1', fontSize: '13px', lineHeight: '1.8' }}>
                  {selectedMajor.prerequisites.map((req, idx) => (
                    <li key={idx} style={{ marginBottom: '4px' }}>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3. Key Subjects */}
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 'bold', color: '#38bdf8', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <BookOpen size={16} />
                  <span>أهم المقررات والمواد الدراسية:</span>
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '8px' }}>
                  {selectedMajor.keySubjects.map((sub, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(15, 23, 42, 0.8)',
                        border: '1px solid rgba(56, 189, 248, 0.25)',
                        borderRadius: '10px',
                        padding: '10px 12px',
                        fontSize: '13px',
                        color: '#f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span style={{ color: '#38bdf8' }}>✓</span>
                      <span>{sub}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Career Fields */}
              <div
                style={{
                  background: selectedMajor.bgGlow,
                  border: `1px solid ${selectedMajor.color}55`,
                  borderRadius: '16px',
                  padding: '18px',
                }}
              >
                <h4 style={{ fontSize: '15px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Briefcase size={16} />
                  <span>مجالات وفرص وسوق العمل لخريجي القسم:</span>
                </h4>
                <ul style={{ margin: 0, paddingRight: '20px', color: '#f8fafc', fontSize: '13px', lineHeight: '1.8' }}>
                  {selectedMajor.careerFields.map((field, idx) => (
                    <li key={idx} style={{ marginBottom: '6px' }}>
                      {field}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal Close Button */}
            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setSelectedMajor(null)}
                style={{
                  background: selectedMajor.accentGradient,
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: `0 4px 16px ${selectedMajor.bgGlow}`,
                }}
              >
                إغلاق الدليل
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
