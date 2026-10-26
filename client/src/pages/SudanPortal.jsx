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
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    landmark: 'مقرن النيلين الأبيض والأزرق، جزيرة توتي، ومتحف السودان القومي',
    description: 'العاصمة القومية وملتقى النيلين الخالدين في مشهد كوني نادر، المركز السياسي والأكاديمي وبوتقة التنوع الاجتماعي والثقافي السوداني.',
    section: 'states',
  },
  {
    _id: 'st-2',
    name: 'ولاية الجزيرة',
    title: 'ولاية الجزيرة',
    capital: 'ود مدني',
    region: 'الوسط',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    landmark: 'مشروع الجزيرة الزراعي التاريخي، قناطر سنار، ومسرح الجزيرة',
    description: 'سلة غذاء السودان وعاصمة الفن والنغم الأصيل، تضم أخصب السهول الطينية بين النيلين وأكبر مشروع زراعي ذو إدارة موحدة في العالم.',
    section: 'states',
  },
  {
    _id: 'st-3',
    name: 'ولاية البحر الأحمر',
    title: 'ولاية البحر الأحمر',
    capital: 'بورتسودان',
    region: 'الشرق',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    landmark: 'ميناء بورتسودان، جزيرة سواكن التاريخية، ومحمية سنقنيب المرجانية',
    description: 'ثغر السودان الباسم وبوابته البحرية العالمية، تمتاز بسواحلها المرجانية الخلابة، وموانئها الاستراتيجية، وثقافة قبائل البجا والهدندوة الضاربة في التاريخ.',
    section: 'states',
  },
  {
    _id: 'st-4',
    name: 'ولاية كسلا',
    title: 'ولاية كسلا',
    capital: 'كسلا',
    region: 'الشرق',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    landmark: 'جبال التوتيل، نهر القاش الموسمي، وبساتين السواقي الخضراء',
    description: 'واحة الشرق الفاتنة ذات الجبال الجرانيتية المهيبة وبساتين الموز والمانجو، تشتهر بضيافتها الكريمة، وطقس قهوة الجبنة المعبق، وتراث الهدندوة والبني عامر.',
    section: 'states',
  },
  {
    _id: 'st-5',
    name: 'ولاية القضارف',
    title: 'ولاية القضارف',
    capital: 'القضارف',
    region: 'الشرق',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80',
    landmark: 'صوامع الغلال الضخمة، غابات البطانة، وبورصة السمسم والذرة الكبرى',
    description: 'عاصمة الزراعة المطرية وأكبر سوق للسمسم والذرة في إفريقيا، وميدان البطانة ذو التاريخ الأدبي الزاخر في شعر الدوبيت وحداء الإبل ومسادير البادية.',
    section: 'states',
  },
  {
    _id: 'st-6',
    name: 'ولاية سنار',
    title: 'ولاية سنار',
    capital: 'سنجة (وحاضرتها التاريخية سنار)',
    region: 'الوسط والجنوب الشرقي',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    landmark: 'خزان سنار التاريخي، آثار عاصمة سلطنة الفونج (السلطنة الزرقاء)، ومحمية الدندر',
    description: 'مهد أول دولة إسلامية سودانية جامعة (سلطنة سنار 1504م)، موطن التمازج الإفريقي والعربي الخلاق، والمراعي الخصبة ومشاريع قصب السكر والبساتين النيلية.',
    section: 'states',
  },
  {
    _id: 'st-7',
    name: 'ولاية النيل الأبيض',
    title: 'ولاية النيل الأبيض',
    capital: 'ربك (وكبرى مدنها كوستي)',
    region: 'الوسط',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    landmark: 'مصانع سكر كنانة وعسلاية، جسر كوستي النهري، وجزيرة أبا التاريخية',
    description: 'شريان النقل والملاحة النهرية وقلب صناعة السكر القومية، تحتضن جزيرة أبا مهد الثورة المهدية، وتمتاز ببحيراتها العذبة ومراعيها الغنية بملايين الأنعام.',
    section: 'states',
  },
  {
    _id: 'st-8',
    name: 'ولاية النيل الأزرق',
    title: 'ولاية النيل الأزرق',
    capital: 'الدمازين',
    region: 'الجنوب الشرقي',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    landmark: 'سد وخزان الروصيرص الضخم، جبال الإنقسنا، وغابات الأبنوس والطلح',
    description: 'منبع الخير والطاقة الكهرومائية بروافد النيل الأزرق الهادر، تتميز بغاباتها الكثيفة وتنوعها الفلكلوري العريق وآلة الوازا الموسيقية التراثية المعبرة.',
    section: 'states',
  },
  {
    _id: 'st-9',
    name: 'الولاية الشمالية',
    title: 'الولاية الشمالية',
    capital: 'دنقلا',
    region: 'الشمال',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    landmark: 'جبل البركل المقدس، آثار حضارة كرمة (الدفوفة)، ومعابد صلب والزورات',
    description: 'مهد الحضارة الإنسانية والكوشية والنوبية التي شيدت الأهرامات قبل آلاف السنين، بلاد النخيل الباسق، التمور البركاوية، وتراث الطمبور والشعر النوبي الخالد.',
    section: 'states',
  },
  {
    _id: 'st-10',
    name: 'ولاية نهر النيل',
    title: 'ولاية نهر النيل',
    capital: 'الدامر',
    region: 'الشمال',
    image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=800&q=80',
    landmark: 'أهرامات البجراوية (مروي)، شلال السبلوقة السادس، وقلاع شندي التاريخية',
    description: 'عاصمة مملكة مروي ومصانع صهر الحديد القديمة، ومدينة الحديد والنار (عطبرة) معقل حركة العمال والسكك الحديدية، وتاريخ الدامر العلمي الفقهي والقرآني.',
    section: 'states',
  },
  {
    _id: 'st-11',
    name: 'ولاية شمال كردفان',
    title: 'ولاية شمال كردفان',
    capital: 'الأبيض',
    region: 'كردفان',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    landmark: 'سوق وبورصة الصمغ العربي العالمية، جبل الداير، وغابات التبلدي',
    description: 'عروس الرمال ومخزن الصمغ العربي الأول في العالم، تشتهر بالبادية والفروسية والمصارعة التراثية وأشجار التبلدي التاريخية التي تحتفظ بمياه الأمطار العذبة.',
    section: 'states',
  },
  {
    _id: 'st-12',
    name: 'ولاية جنوب كردفان',
    title: 'ولاية جنوب كردفان',
    capital: 'كادقلي',
    region: 'كردفان',
    image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
    landmark: 'جبال النوبة الشامخة، بحيرة الأبيض الطبيعية، وبساتين الفواكه الاستوائية',
    description: 'جنة الطبيعة الاستوائية والتنوع الثقافي البديع، موطن جبال النوبة ومهرجانات الكمبلا وحصاد الخير، وتتميز بالأمطار الغزيرة والأراضي الزراعية الخصبة.',
    section: 'states',
  },
  {
    _id: 'st-13',
    name: 'ولاية غرب كردفان',
    title: 'ولاية غرب كردفان',
    capital: 'الفولة',
    region: 'كردفان',
    image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80',
    landmark: 'بحيرة كيلك الطبيعية، حقول النفط الوطنية (هجليج وبليلة)، ومراعي المسيرية',
    description: 'حاضرة الثروة البترولية والحيوانية بالسودان، موطن بطون المسيرية ومسارات المراحيل السنوية، وبحيرات المياه العذبة الطبيعية ومزارع الفول السوداني.',
    section: 'states',
  },
  {
    _id: 'st-14',
    name: 'ولاية شمال دارفور',
    title: 'ولاية شمال دارفور',
    capital: 'الفاشر',
    region: 'دارفور',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    landmark: 'قصر السلطان علي دينار التاريخي، فوهة بركان جبل مرة، وواحة عين سيرة',
    description: 'الفاشر أبو زكريا، عاصمة سلاطين الفور ومحمل كسوة الكعبة المشرفة إلى الأراضي المقدسة، بوابة درب الأربعين التجاري وموطن الكرم والإرث الإنساني العريق.',
    section: 'states',
  },
  {
    _id: 'st-15',
    name: 'ولاية جنوب دارفور',
    title: 'ولاية جنوب دارفور',
    capital: 'نيالا',
    region: 'دارفور',
    image: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=800&q=80',
    landmark: 'جبل مرة وسلالاته المائية، حظيرة الردوم القومية، وسوق نيالا البحير الكبير',
    description: 'نيالا البحير، المركز الاقتصادي والتجاري الأول في غرب السودان، تحتضن مرتفعات جبل مرة بفاكهتها المتوسطية ومحمية الردوم الطبيعية ومزارع المحاصيل النقدية.',
    section: 'states',
  },
  {
    _id: 'st-16',
    name: 'ولاية غرب دارفور',
    title: 'ولاية غرب دارفور',
    capital: 'الجنينة',
    region: 'دارفور',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
    landmark: 'دار مساليت التاريخية، وادي كجا دائم الخضرة، وقصر السلطان بحر الدين',
    description: 'بوابة السودان الغربية نحو تشاد والعمق الإفريقي، أرض البساتين والخضرة على ضفاف وادي كجا، وعاصمة سلطنة المساليت الشهيرة بالفروسية والدفاع عن الأرض.',
    section: 'states',
  },
  {
    _id: 'st-17',
    name: 'ولاية وسط دارفور',
    title: 'ولاية وسط دارفور',
    capital: 'زالنجي',
    region: 'دارفور',
    image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80',
    landmark: 'شلالات قلول السياحية، قمة فوهة جبل مرة (دريدسة)، وبساتين الفواكه',
    description: 'سويسرا السودان لطقسها المعتدل والبارد طوال العام، موطن شلالات جبل مرة الأخاذة ومزارع الحمضيات والتفاح النادرة في إفريقيا وعسل النحل البري الصافي.',
    section: 'states',
  },
  {
    _id: 'st-18',
    name: 'ولاية شرق دارفور',
    title: 'ولاية شرق دارفور',
    capital: 'الضعين',
    region: 'دارفور',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80',
    landmark: 'غابات السافنا الغنية، بحيرة بقر المهاجرة، ومسارات حوض بحر العرب',
    description: 'حاضرة قبائل الرزيقات وأكبر مراكز الثروة الحيوانية والضأن الحمري في السودان، مركز إنتاج الصمغ والزراعة المطرية وتجارة الحدود الإقليمية المزدهرة.',
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
  const [isLoading, setIsLoading] = useState(true);

  // Admin CMS Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [notification, setNotification] = useState('');

  const tabs = [
    { id: 'heritage', label: 'التراث والتقاليد', icon: Coffee, count: 'عادات وأصالة' },
    { id: 'states', label: 'ولايات السودان', icon: Compass, count: '18 ولاية كاملة' },
    { id: 'talents', label: 'مواهب وإبداعات', icon: Flame, count: 'طاقات شبابية' },
    { id: 'arts', label: 'الأدب والفنون', icon: Feather, count: 'شعر وموسيقى' },
  ];

  // Fetch Live CMS Items purely from MongoDB
  const loadDynamic = async () => {
    try {
      setIsLoading(true);
      const dynamicItems = await fetchHubContent('sudan');
      if (dynamicItems && dynamicItems.length > 0) {
        const dynamicHeritage = dynamicItems.filter((i) => i.section === 'heritage' || !i.section);
        if (dynamicHeritage.length > 0) setHeritageItems(dynamicHeritage);

        const dynamicStates = dynamicItems.filter((i) => i.section === 'states');
        if (dynamicStates.length > 0) {
          // دمج الولايات المعدلة في CMS مع قائمة الـ 18 الأساسية لضمان عدم نقص أي ولاية
          const merged = DEFAULT_STATES.map((ds) => {
            const found = dynamicStates.find(
              (s) =>
                (s.name && (s.name.trim() === ds.name.trim() || s.name.includes(ds.capital))) ||
                (s.title && s.title.trim() === ds.title.trim())
            );
            return found ? { ...ds, ...found } : ds;
          });
          setStatesList(merged);
        } else {
          setStatesList(DEFAULT_STATES);
        }

        const dynamicTalents = dynamicItems.filter((i) => i.section === 'talents');
        if (dynamicTalents.length > 0) setTalentsList(dynamicTalents);

        const dynamicArts = dynamicItems.filter((i) => i.section === 'arts');
        if (dynamicArts.length > 0) setArtsList(dynamicArts);
      } else {
        setStatesList(DEFAULT_STATES);
      }
    } catch (err) {
      console.error('Failed to load sudan portal content:', err);
      setStatesList(DEFAULT_STATES);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDynamic();
  }, []);

  const handleSaved = (item, action) => {
    if (item.section === 'states') {
      setStatesList((prev) =>
        action === 'create'
          ? [item, ...prev]
          : prev.map((s) => ((s._id || s.id) === (item._id || item.id) ? item : s))
      );
    } else if (item.section === 'talents') {
      setTalentsList((prev) =>
        action === 'create'
          ? [item, ...prev]
          : prev.map((t) => ((t._id || t.id) === (item._id || item.id) ? item : t))
      );
    } else if (item.section === 'arts') {
      setArtsList((prev) =>
        action === 'create'
          ? [item, ...prev]
          : prev.map((a) => ((a._id || a.id) === (item._id || item.id) ? item : a))
      );
    } else {
      setHeritageItems((prev) =>
        action === 'create'
          ? [item, ...prev]
          : prev.map((h) => ((h._id || h.id) === (item._id || item.id) ? item : h))
      );
    }
    setNotification(
      action === 'create'
        ? 'تمت إضافة العنصر التراثي وحفظه في قاعدة البيانات بنجاح!'
        : 'تم تحديث البيانات بنجاح!'
    );
    setTimeout(() => setNotification(''), 4000);
  };

  const handleDeleteItem = async (id, section) => {
    if (!window.confirm('هل أنت متأكد من رغبتك في حذف هذا المحتوى نهائياً من قاعدة البيانات؟')) {
      return;
    }
    try {
      await deleteHubContent(id, 'sudan');
      if (section === 'states') {
        setStatesList((prev) => prev.filter((s) => (s._id || s.id) !== id));
      } else if (section === 'talents') {
        setTalentsList((prev) => prev.filter((t) => (t._id || t.id) !== id));
      } else if (section === 'arts') {
        setArtsList((prev) => prev.filter((a) => (a._id || a.id) !== id));
      } else {
        setHeritageItems((prev) => prev.filter((h) => (h._id || h.id) !== id));
      }
      setNotification('تم حذف العنصر بنجاح من قاعدة البيانات.');
      setTimeout(() => setNotification(''), 4000);
    } catch (err) {
      console.error('Delete sudan item error:', err);
      alert('فشل الحذف من قاعدة البيانات: ' + (err.message || 'حدث خطأ في الخادم'));
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

        {/* التبويب الثاني: ولايات السودان الـ 18 */}
        {activeTab === 'states' && (
          <div>
            <div
              style={{
                marginBottom: '26px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                padding: '18px 24px',
                borderRadius: '18px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#ffffff', margin: 0 }}>
                    🗺️ ولايات السودان الـ 18 .. فسيفساء الوطن الممتد
                  </h2>
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      color: '#0b1622',
                      fontSize: '12px',
                      fontWeight: '900',
                      padding: '3px 10px',
                      borderRadius: '20px',
                    }}
                  >
                    18 ولاية كاملة 🇸🇩
                  </span>
                </div>
                <p style={{ color: '#cbd5e1', fontSize: '14px', margin: 0, lineHeight: '1.6' }}>
                  دليل شامل وموثق يضم كافة ولايات السودان الـ 18 بتنوعها الجغرافي، ثرواتها الطبيعية، وإرثها الثقافي والتاريخي العريق.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', color: '#fbbf24', fontWeight: 'bold' }}>
                  إجمالي الولايات المعروضة: 18 / 18
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {statesList.map((st) => (
                <div
                  key={st._id}
                  style={{
                    backgroundColor: '#0f172a',
                    borderRadius: '22px',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    overflow: 'hidden',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 18px 36px rgba(0,0,0,0.5)';
                    e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.35)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                  }}
                >
                  {/* صورة الولاية المعبرة عن جغرافيتها ومعالمها */}
                  <div style={{ position: 'relative', height: '175px', overflow: 'hidden', backgroundColor: '#1e293b' }}>
                    <img
                      src={st.image || st.imageUrl || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'}
                      alt={st.name || st.title}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, #0f172a 5%, rgba(15, 23, 42, 0.4) 45%, transparent 100%)',
                      }}
                    />
                    
                    {/* شارة الإقليم الجغرافي */}
                    <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                      <span
                        style={{
                          fontSize: '11.5px',
                          backgroundColor: 'rgba(15, 23, 42, 0.85)',
                          backdropFilter: 'blur(8px)',
                          color: '#38bdf8',
                          border: '1px solid rgba(56, 189, 248, 0.4)',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontWeight: 'bold',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                        }}
                      >
                        إقليم {st.region || 'السودان'}
                      </span>
                    </div>

                    {/* اسم الولاية فوق الصورة */}
                    <div style={{ position: 'absolute', bottom: '10px', right: '16px', left: '16px' }}>
                      <h3
                        style={{
                          fontSize: '19px',
                          fontWeight: '900',
                          color: '#ffffff',
                          margin: 0,
                          textShadow: '0 2px 8px rgba(0,0,0,0.9)',
                        }}
                      >
                        {st.name || st.title}
                      </h3>
                    </div>
                  </div>

                  {/* جسم بطاقة الولاية */}
                  <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                    <div>
                      {st.capital && (
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '12.5px',
                            color: '#fbbf24',
                            fontWeight: 'bold',
                            backgroundColor: 'rgba(245, 158, 11, 0.1)',
                            border: '1px solid rgba(245, 158, 11, 0.25)',
                            padding: '4px 10px',
                            borderRadius: '10px',
                            marginBottom: '12px',
                          }}
                        >
                          <span>🏛️</span>
                          <span>الحاضرة: {st.capital}</span>
                        </div>
                      )}

                      {/* الوصف الثقافي والجغرافي */}
                      <p
                        style={{
                          fontSize: '13.5px',
                          color: '#cbd5e1',
                          lineHeight: '1.75',
                          margin: '0 0 14px',
                        }}
                      >
                        {st.description}
                      </p>

                      {/* أبرز المعالم السياحية والتاريخية */}
                      {st.landmark && (
                        <div
                          style={{
                            background: 'rgba(0, 0, 0, 0.35)',
                            padding: '11px 14px',
                            borderRadius: '12px',
                            fontSize: '12.5px',
                            color: '#f1f5f9',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            lineHeight: '1.6',
                          }}
                        >
                          <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>📍 أبرز المعالم: </span>
                          <span>{st.landmark}</span>
                        </div>
                      )}
                    </div>

                    {isAdmin && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          gap: '6px',
                          marginTop: '16px',
                          paddingTop: '12px',
                          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        <button
                          onClick={() => {
                            setEditingItem(st);
                            setIsModalOpen(true);
                          }}
                          title="تعديل بيانات الولاية"
                          style={{
                            background: 'rgba(59, 130, 246, 0.15)',
                            border: '1px solid #3b82f6',
                            color: '#60a5fa',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                          }}
                        >
                          <Edit size={14} />
                          <span>تعديل</span>
                        </button>
                        <button
                          onClick={() => handleDeleteItem(st._id, 'states')}
                          title="حذف الولاية من قاعدة البيانات"
                          style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            border: '1px solid #ef4444',
                            color: '#f87171',
                            padding: '6px 10px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                          }}
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
