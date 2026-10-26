const express = require('express');
const router = express.Router();
const KnowledgeBase = require('../models/KnowledgeBase');
const AdvisorPrompt = require('../models/AdvisorPrompt');
const AIConversation = require('../models/AIConversation');
const connectDB = require('../db');

// الأسئلة الأساسية لقاعدة المعرفة في حالة تهيئة السيرفر أو فراغ قاعدة البيانات
const DEFAULT_SEED_PROMPTS = [
  {
    prompt: 'ما هي شروط وإجراءات تجديد الإقامة الدراسية للطلاب السودانيين في مصر؟',
    question: 'ما هي شروط وإجراءات تجديد الإقامة الدراسية للطلاب السودانيين في مصر؟',
    answer: 'لتجديد الإقامة الدراسية: التوجه إلى شؤون الطلاب بكلية العلوم واستخراج إثبات قيد معتمد ومختوم موجه لمصلحة الجوازات والهجرة (مجمع الجيزة أو العباسية)، مع إحضار جواز السفر الأصلي وصور منه، عقد الإيجار موثق بالشهر العقاري، إيصال المصروفات، وصور شخصية.',
    category: 'residency',
    keywords: ['إقامة', 'جوازات', 'تجديد', 'فيزا', 'مجمع الجيزة', 'العباسية', 'جواز'],
    isActive: true,
  },
  {
    prompt: 'كيف يمكنني تسجيل المقررات ونظام الساعات المعتمدة في كلية العلوم؟',
    question: 'كيف يمكنني تسجيل المقررات ونظام الساعات المعتمدة في كلية العلوم؟',
    answer: 'يتم تسجيل المقررات بداية كل فصل دراسي عبر البوابة الإلكترونية أو مراجعة المرشد الأكاديمي للقسم. الحد الأدنى للعبء الدراسي هو 12 ساعة معتمدة والحد الأقصى 18 أو 21 ساعة معتمدة حسب معدل الطالب التراكمي (GPA).',
    category: 'academic',
    keywords: ['تسجيل', 'ساعات معتمدة', 'GPA', 'مقررات', 'مرشد أكاديمي', 'المعدل التراكمي'],
    isActive: true,
  },
  {
    prompt: 'ما هي أهم النصائح للتحضير لاختبارات العملي ومذكرات المعامل؟',
    question: 'ما هي أهم النصائح للتحضير لاختبارات العملي ومذكرات المعامل؟',
    answer: 'احرص على كتابة وتسليم تقارير التجارب أسبوعياً، مراجعة خطوات التجارب والنتائج المعملية، والتدرب على التعرف على العينات المعملية وقوانين الحسابات الكيميائية والفيزيائية قبل أسبوع الامتحان العملي، مع الالتزام بارتداء البالطو الأبيض ونظارات الأمان.',
    category: 'academic',
    keywords: ['معامل', 'امتحان عملي', 'تقارير', 'مذكرات', 'سكاشن', 'بالطو'],
    isActive: true,
  },
  {
    prompt: 'ما هي التخصصات والأقسام المتاحة بكلية العلوم جامعة القاهرة وشروط التشعيب؟',
    question: 'ما هي التخصصات والأقسام المتاحة بكلية العلوم جامعة القاهرة وشروط التشعيب؟',
    answer: 'تضم كلية العلوم أقساماً متنوعة تشمل: علوم الحاسب، الكيمياء منفرد، الكيمياء الحيوية، الفيزياء، الفيزياء الحيوية، الرياضيات، الإحصاء، علم النبات والميكروبيولوجي، علم الحيوان، الحشرات، الجيولوجيا، الجيوفيزياء، والتقنية الحيوية. يتم التشعيب بنهاية المستوى الأول بناءً على المعدل التراكمي ورغبة الطالب واجتياز متطلبات الشعبة.',
    category: 'academic',
    keywords: ['تشعيب', 'أقسام', 'حاسب', 'كيمياء', 'فيزياء', 'تخصصات', 'بيولوجي', 'جيولوجيا'],
    isActive: true,
  },
  {
    prompt: 'ما هي أفضل مناطق السكن القريبة من جامعة القاهرة للطلاب السودانيين؟',
    question: 'ما هي أفضل مناطق السكن القريبة من جامعة القاهرة للطلاب السودانيين؟',
    answer: 'أبرز مناطق سكن الطلاب بالقرب من جامعة القاهرة: بين السرايات (الأقرب لسور كلية العلوم ومعاملها)، الدقي والمهندسين (خدمات ممتازة وقريبة من مترو الدقي/جامعة القاهرة)، وفيصل والهرم (خيارات اقتصادية مع توفر مواصلات مباشرة لبوابة الكلية).',
    category: 'housing',
    keywords: ['سكن', 'شقة', 'إيجار', 'بين السرايات', 'الدقي', 'فيصل', 'الهرم'],
    isActive: true,
  },
];

// دالة تسوية وتجريد النصوص للمقارنة الدقيقة والصارمة (Text Normalization)
function normalizeText(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, '') // إزالة التشكيل وحركات الإعراب
    .replace(/ـ+/g, '') // إزالة التطويل والكشيدة
    .replace(/[أإآٱ]/g, 'ا') // توحيد الألفات
    .replace(/ة/g, 'ه') // توحيد التاء المربوطة والهاء
    .replace(/ى/g, 'ي') // توحيد الياء والألف المقصورة
    .replace(/ؤ/g, 'و') // توحيد همزة الواو
    .replace(/ئ/g, 'ي') // توحيد همزة الياء
    .replace(/[؟?!\.,:;؛\-_—()[\]{}"'\\/|+=*&^%$#@~`<>]/g, ' ') // إزالة علامات الترقيم
    .replace(/\s+/g, ' ') // دمج المسافات
    .trim();
}

// الكلمات التمهيدية الشائعة التي لا تمثل جوهر السؤال (Stop Words)
const STOP_WORDS = new Set([
  'ما', 'هي', 'هو', 'كيف', 'هل', 'من', 'في', 'على', 'عن', 'الي', 'إلى', 'مع', 'او', 'أو',
  'لو', 'سمحت', 'ممكن', 'اريد', 'أريد', 'عايز', 'عاوز', 'سؤال', 'بخصوص', 'تخبرني',
  'تقول', 'لي', 'يا', 'دكتور', 'مستشار', 'رابطة', 'كلية', 'العلوم', 'جامعة', 'القاهرة',
  'what', 'is', 'how', 'to', 'can', 'i', 'the', 'a', 'an', 'in', 'on', 'at', 'for'
]);

function extractKeywords(text) {
  const norm = normalizeText(text);
  return norm
    .split(' ')
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
}

// محرك البحث الصارم والمطابقة الحصرية داخل قاعدة المعرفة المدخلة من لوحة الإدارة
function findStrictMatchInKB(userQuery, kbItems) {
  if (!userQuery || !kbItems || kbItems.length === 0) return null;

  const normQuery = normalizeText(userQuery);
  if (!normQuery) return null;

  const queryKeywords = extractKeywords(userQuery);

  let bestMatch = null;
  let highestScore = 0;

  for (const item of kbItems) {
    const itemAnswer = item.answer?.trim();
    if (!itemAnswer) continue;

    const itemQuestion = item.question || item.prompt || '';
    const normItemQ = normalizeText(itemQuestion);
    if (!normItemQ) continue;

    // 1. تطابق تام 100% بين السؤال المدخل والسؤال في قاعدة المعرفة
    if (normQuery === normItemQ) {
      return item;
    }

    // 2. احتواء مباشر كامل للعبارة
    if (normQuery.length >= 8 && normItemQ.length >= 8) {
      if (normQuery.includes(normItemQ) || normItemQ.includes(normQuery)) {
        return item;
      }
    }

    // 3. مطابقة الكلمات الدلالية المسجلة في العنصر (Keywords)
    const itemKeywords = Array.isArray(item.keywords)
      ? item.keywords.map((k) => normalizeText(k)).filter(Boolean)
      : typeof item.keywords === 'string'
      ? item.keywords.split(',').map((k) => normalizeText(k)).filter(Boolean)
      : [];

    let keywordScore = 0;
    if (itemKeywords.length > 0) {
      let matchedCount = 0;
      for (const kw of itemKeywords) {
        if (kw && (normQuery.includes(kw) || kw.includes(normQuery))) {
          matchedCount++;
        }
      }
      if (matchedCount > 0) {
        keywordScore = matchedCount / itemKeywords.length;
      }
    }

    // 4. مطابقة الكلمات الجوهرية (Token Overlap)
    const itemTokens = extractKeywords(itemQuestion);
    if (itemTokens.length > 0 && queryKeywords.length > 0) {
      const matchCount = queryKeywords.filter((qToken) =>
        itemTokens.some((iToken) => iToken === qToken || iToken.includes(qToken) || qToken.includes(iToken))
      ).length;

      const tokenScore = matchCount / Math.max(itemTokens.length, queryKeywords.length);
      const combinedScore = Math.max(keywordScore, tokenScore);

      // عتبة تطابق صارمة لضمان حصرية الإجابة وعدم التخمين العشوائي
      if (combinedScore > highestScore && (tokenScore >= 0.55 || keywordScore >= 0.65)) {
        highestScore = combinedScore;
        bestMatch = item;
      }
    }
  }

  return bestMatch;
}

// 1. مسار جلب عناصر قاعدة المعرفة النشطة (Public Knowledge Base query)
router.get('/knowledge', async (req, res) => {
  try {
    await connectDB();
    const [kbItems, advisorPrompts] = await Promise.all([
      KnowledgeBase.find({ isActive: true }).sort({ createdAt: -1 }).lean(),
      AdvisorPrompt.find({ isActive: true }).sort({ createdAt: -1 }).lean(),
    ]);
    const items = [...(advisorPrompts || []), ...(kbItems || [])];
    const finalItems = items.length > 0 ? items : DEFAULT_SEED_PROMPTS;
    res.json({ success: true, count: finalItems.length, items: finalItems, prompts: finalItems });
  } catch (error) {
    console.error('Fetch KB Items Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب عناصر قاعدة المعرفة',
      error: error.message,
    });
  }
});

// 2. مسار معالجة سؤال المستشار الأكاديمي (Strict Knowledge Base QA - No Random Answers)
router.post('/chat', async (req, res) => {
  try {
    await connectDB();
    const { messages, studentName, department, academicLevel } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ success: false, reply: 'عذراً، تنسيق السؤال غير صحيح.' });
    }

    const lastMessage = (messages[messages.length - 1]?.text || '').trim();
    if (!lastMessage) {
      return res.status(400).json({ success: false, reply: 'يرجى كتابة السؤال المطلوب.' });
    }

    const name = studentName || 'طالب كلية العلوم';
    const dept = department || 'العلوم العامة';
    const level = academicLevel || 'المرحلة الجامعية';

    // جلب جميع الأسئلة والأجوبة المدخلة من لوحة التحكم في قاعدة البيانات (Ground Truth)
    const [activePrompts, activeKBItems] = await Promise.all([
      AdvisorPrompt.find({ isActive: true }).lean(),
      KnowledgeBase.find({ isActive: true }).lean(),
    ]);

    let allKB = [...(activePrompts || []), ...(activeKBItems || [])];
    if (allKB.length === 0) {
      allKB = DEFAULT_SEED_PROMPTS;
    }

    // البحث الحصري داخل قاعدة المعرفة فقط
    const matchedItem = findStrictMatchInKB(lastMessage, allKB);

    const isEnglish = /[a-zA-Z]{3,}/.test(lastMessage) && !/[\u0600-\u06FF]/.test(lastMessage);

    let aiResponse = '';
    if (matchedItem && matchedItem.answer) {
      // إرجاع الإجابة المطابقة للسؤال حصراً كما تم إدخالها من لوحة التحكم
      aiResponse = matchedItem.answer.trim();
    } else {
      // الالتزام التام بعدم إعطاء إجابات عشوائية أو تكرار رسالة افتراضية
      if (isEnglish) {
        aiResponse = `Sorry, this specific question is not currently in the official Knowledge Base approved by the Association administration. Please check the available advisor topics or contact the Association administration directly for verified academic assistance.`;
      } else {
        aiResponse = `عذراً، هذا السؤال غير مدرج حالياً في قاعدة المعرفة المعتمدة من إدارة الرابطة. يُرجى مراجعة قائمة الأسئلة المتاحة في لوحة المستشار الأكاديمي، أو التواصل المباشر مع إدارة الرابطة للحصول على إجابة رسمية وموثقة.`;
      }
    }

    // حفظ المحادثة في قاعدة بيانات MongoDB Atlas لضمان سجل الطالب
    const resolvedEmail = (req.body.userEmail || req.body.email || '').toLowerCase().trim();
    const resolvedUserId = req.body.userId || '';

    if (resolvedEmail || resolvedUserId) {
      try {
        const query = resolvedEmail ? { userEmail: resolvedEmail } : { userId: resolvedUserId };
        let conversation = await AIConversation.findOne(query);
        if (!conversation) {
          conversation = new AIConversation({
            userId: resolvedUserId,
            userEmail: resolvedEmail,
            studentName: name,
            department: dept,
            academicLevel: level,
            messages: [],
          });
        }
        conversation.studentName = name;
        conversation.department = dept;
        conversation.academicLevel = level;

        const updatedHistory = [
          ...messages.map((m) => ({
            sender: m.sender === 'user' ? 'user' : 'ai',
            text: m.text,
            timestamp: m.timestamp || new Date(),
          })),
          {
            sender: 'ai',
            text: aiResponse,
            timestamp: new Date(),
          },
        ];

        conversation.messages = updatedHistory.slice(-100);
        conversation.lastInteraction = new Date();
        conversation.updatedAt = new Date();
        await conversation.save();
      } catch (convErr) {
        console.error('Save AI Conversation Error:', convErr.message);
      }
    }

    return res.json({
      success: true,
      reply: aiResponse,
      matched: !!matchedItem,
      category: matchedItem?.category || null,
    });
  } catch (error) {
    console.error('AI Route Error:', error.message);
    return res.status(500).json({
      success: false,
      reply: 'حدث خطأ أثناء معالجة السؤال في قاعدة المعرفة. يرجى إعادة المحاولة لاحقاً.',
      error: error.message,
    });
  }
});

// 3. مسار جلب سجل المحادثة المحفوظ في MongoDB للطالب
router.get('/history', async (req, res) => {
  try {
    await connectDB();
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    const email = (req.query.email || req.query.userEmail || '').toLowerCase().trim();
    const userId = req.query.userId || req.query.id || '';

    if (!email && !userId) {
      return res.json({ success: true, messages: [] });
    }

    const query = email ? { userEmail: email } : { userId };
    const conversation = await AIConversation.findOne(query);

    if (!conversation || !Array.isArray(conversation.messages)) {
      return res.json({ success: true, messages: [] });
    }

    res.json({
      success: true,
      messages: conversation.messages,
      lastInteraction: conversation.lastInteraction,
    });
  } catch (err) {
    console.error('Fetch AI History Error:', err.message);
    res.status(500).json({ success: false, message: 'فشل جلب سجل المحادثات من قاعدة البيانات', error: err.message });
  }
});

// 4. مسار مسح سجل المحادثة المحفوظ في MongoDB
router.delete('/history', async (req, res) => {
  try {
    await connectDB();
    const email = (req.query.email || req.query.userEmail || req.body?.email || req.body?.userEmail || '').toLowerCase().trim();
    const userId = req.query.userId || req.query.id || req.body?.userId || '';

    if (email || userId) {
      const query = email ? { userEmail: email } : { userId };
      await AIConversation.findOneAndDelete(query);
    }

    res.json({ success: true, message: 'تم مسح سجل المحادثة بنجاح من قاعدة البيانات' });
  } catch (err) {
    console.error('Clear AI History Error:', err.message);
    res.status(500).json({ success: false, message: 'فشل مسح المحادثة من قاعدة البيانات', error: err.message });
  }
});

// 5. مسار حفظ عنصر جديد في قاعدة المعرفة للمستشار الذكي (Knowledge Base Item Persistence)
router.post('/knowledge', async (req, res) => {
  try {
    await connectDB();
    const rawQuestion = req.body.question || req.body.prompt || req.body.title;
    const answer = req.body.answer || '';
    const category = req.body.category || 'general';
    const keywords = Array.isArray(req.body.keywords)
      ? req.body.keywords
      : (req.body.keywords || '').split(',').map((k) => k.trim()).filter(Boolean);

    if (!rawQuestion || !rawQuestion.trim()) {
      return res.status(400).json({ success: false, message: 'نص السؤال مطلوب ولا يمكن أن يكون فارغاً' });
    }

    const promptDoc = new AdvisorPrompt({
      prompt: rawQuestion.trim(),
      question: rawQuestion.trim(),
      answer: answer.trim(),
      category: category.trim(),
      keywords,
      isActive: true,
    });

    const saved = await promptDoc.save();

    res.status(201).json({
      success: true,
      message: 'تم حفظ السؤال بقاعدة المعرفة بنجاح',
      prompt: saved,
      item: saved,
      _id: saved._id,
      ...saved.toObject(),
    });
  } catch (err) {
    console.error('Save Knowledge Error:', err.message);
    res.status(500).json({ success: false, message: 'فشل حفظ المعرفة في قاعدة البيانات', error: err.message });
  }
});

module.exports = router;