const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const KnowledgeBase = require('../models/KnowledgeBase');

const groqApiKey = process.env.GROQ_API_KEY || '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';
let groq = null;
try {
  groq = new Groq({ apiKey: groqApiKey });
} catch (e) {
  console.log('Groq init note:', e.message);
}

const SUPPORTED_MODELS = [
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
  'mixtral-8x7b-32768',
  'gemma2-9b-it',
  'openai/gpt-oss-120b',
  'qwen/qwen3.6-27b',
];

// مسار جلب عناصر قاعدة المعرفة النشطة للطلاب (Public Knowledge Base query)
router.get('/knowledge', async (req, res) => {
  try {
    const items = await KnowledgeBase.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, count: items.length, items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ في جلب عناصر قاعدة المعرفة' });
  }
});

router.post('/chat', async (req, res) => {
  try {
    const { messages, studentName, department, academicLevel } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ reply: 'عذراً، تنسيق الطلب غير صحيح.' });
    }

    const lastMessage = messages[messages.length - 1]?.text || '';
    const name = studentName || 'طالب كلية العلوم';
    const dept = department || 'العلوم العامة';
    const level = academicLevel || 'المرحلة الجامعية';

    // جلب المواضيع المعرفة من قبل الإدارة في MongoDB
    let kbContextText = '';
    try {
      const activeKBItems = await KnowledgeBase.find({ isActive: true }).limit(50);
      if (activeKBItems && activeKBItems.length > 0) {
        kbContextText = activeKBItems
          .map((item, idx) => `[Topic ${idx + 1} - Category: ${item.category}]\nQ: ${item.question}\nA: ${item.answer}`)
          .join('\n\n');
      }
    } catch (kbErr) {
      console.log('KB fetch note:', kbErr.message);
    }

    // كشف ما إذا كانت الرسالة باللغة الإنجليزية
    const isEnglish = /[a-zA-Z]{3,}/.test(lastMessage) && !/[\u0600-\u06FF]/.test(lastMessage);

    const systemPrompt = `
You are the official "Academic Advisor & Intelligent Companion" (المستشار الأكاديمي والرفيق الذكي) for the Sudanese Students Association at the Faculty of Science, Cairo University (رابطة الطلاب السودانيين - كلية العلوم جامعة القاهرة | SSA-FS-CU).

Student Profile:
- Name: ${name}
- Department/Major: ${dept}
- Academic Level: ${level}

Admin Curated Knowledge Base (Official Q&A Ground Truth from MongoDB):
${kbContextText || 'No custom KB topics added yet.'}

Guidelines:
1. Always address the student personally by their name ("${name}").
2. Prioritize answering using the official Admin Curated Knowledge Base provided above whenever relevant.
3. Language Adaptation:
   - If the student speaks/asks in English, respond in fluent, professional, and helpful English.
   - If the student speaks/asks in Arabic, respond in eloquent, warm, and supportive Arabic infused with polite and brotherly Sudanese warmth (e.g., "أهلاً بيك يا دكتورنا ${name}", "أبشر بالخير", "ولا تشيل هم").
4. Specialization: You possess deep knowledge of Faculty of Science, Cairo University (Departments: Computer Science, Chemistry, Biochemistry, Physics, Biophysics, Mathematics, Statistics, Botany & Microbiology, Zoology, Entomology, Geology, Geophysics, Biotechnology, Astronomy).
5. Academic & Practical Advice: Provide comprehensive guidance on course registration, Credit Hours system, GPA calculation, laboratory reports, exam preparation, Cairo residency renewal procedures (Giza/Abbassia immigration offices), student housing in Cairo/Giza (Dokki, Faisal, Bein El-Sarayat), and Association activities.
6. Formatting: Use elegant Markdown (headings, bullet points, code blocks for programming, clear math/science formulas).
`;, respond in eloquent, warm, and supportive Arabic infused with polite and brotherly Sudanese warmth (e.g., "أهلاً بيك يا دكتورنا ${name}", "أبشر بالخير", "ولا تشيل هم").
3. Specialization: You possess deep knowledge of Faculty of Science, Cairo University (Departments: Computer Science, Chemistry, Biochemistry, Physics, Biophysics, Mathematics, Statistics, Botany & Microbiology, Zoology, Entomology, Geology, Geophysics, Biotechnology, Astronomy).
4. Academic & Practical Advice: Provide comprehensive guidance on course registration, Credit Hours system, GPA calculation, laboratory reports, exam preparation, Cairo residency renewal procedures (Giza/Abbassia immigration offices), student housing in Cairo/Giza (Dokki, Faisal, Bein El-Sarayat), and Association activities.
5. Formatting: Use elegant Markdown (headings, bullet points, code blocks for programming, clear math/science formulas).
6. Remember previous conversation context and build upon it smoothly.
`;

    // 1. محاولة استخدام نماذج Groq المتوفرة
    if (groq) {
      for (const modelName of SUPPORTED_MODELS) {
        try {
          const formattedMessages = [
            { role: 'system', content: systemPrompt },
            ...messages.map((msg) => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.text,
            })),
          ];

          const completion = await groq.chat.completions.create({
            messages: formattedMessages,
            model: modelName,
            temperature: 0.7,
            max_tokens: 1500,
          });

          const reply = completion.choices[0]?.message?.content;
          if (reply && reply.trim().length > 0) {
            return res.json({ reply });
          }
        } catch (modelErr) {
          console.log(`Model ${modelName} attempt note:`, modelErr.message);
          // تجربة النموذج التالي
        }
      }
    }

    // 2. محرك الردود الذكي التفاعلي في حالة انقطاع السحابة
    let dynamicReply = '';

    if (isEnglish) {
      dynamicReply = `Hello **${name}**! 👋\n\nWelcome to your AI Academic Advisor for the Faculty of Science, Cairo University (SSA-FS-CU).\n\n`;

      if (/residency|visa|passport|immigration/i.test(lastMessage)) {
        dynamicReply += `### 🛂 Student Residency & Visa Guide for Cairo University:\n` +
          `1. **Enrollment Certificate**: Obtain an official student enrollment proof from the Student Affairs Office at the Faculty of Science directed to the Immigration Authority.\n` +
          `2. **Immigration Office**: Submit your documents at the Giza or Abbassia Passport & Immigration Complex.\n` +
          `3. **Required Documents**: Original passport + copies, recent personal photos with white background, notarized apartment lease contract, and tuition fee receipt.\n` +
          `4. **Tip**: Always start renewal at least 30 days before expiration. The Association team is always here to support you! ✨`;
      } else if (/housing|apartment|rent|stay|accommodation/i.test(lastMessage)) {
        dynamicReply += `### 🏠 Recommended Student Housing Areas Near Cairo University:\n` +
          `- **Dokki & Mohandessin**: 5-10 minutes from the faculty gate/metro, safe, full of amenities and quiet study spots.\n` +
          `- **Bein El-Sarayat**: Right next to the Faculty of Science campus and science laboratories.\n` +
          `- **Faisal & Haram**: Budget-friendly student apartments with direct transportation to Cairo University main gate.\n` +
          `💡 *You can also find Sudanese student roommates via our live chat room!*`;
      } else if (/cs|computer|programming|python|code|algorithm/i.test(lastMessage)) {
        dynamicReply += `### 💻 Computer Science Department & Study Track:\n` +
          `- **Core Subjects**: Data Structures, Algorithms, Object-Oriented Programming (C++/Java/Python), Database Systems, and Operating Systems.\n` +
          `- **Advice for ${name}**: Focus heavily on practical lab assignments and algorithmic problem-solving on platforms like LeetCode and Codeforces.\n` +
          `- **Faculty Labs**: High-performance computer labs are available on the 3rd floor of the Mathematics & CS building.`;
      } else if (/chemistry|chem|lab|organic|reaction/i.test(lastMessage)) {
        dynamicReply += `### 🧪 Chemistry Department & Laboratory Guidelines:\n` +
          `- **Key Areas**: Organic Chemistry, Inorganic, Physical, and Analytical Chemistry.\n` +
          `- **Lab Safety**: Always wear your white lab coat and safety goggles in physical & organic chemistry labs.\n` +
          `- **Lab Reports**: Submit your weekly volumetric & qualitative analysis reports on time to secure full practical marks.`;
      } else if (/gpa|credit|hour|exam|grade/i.test(lastMessage)) {
        dynamicReply += `### 📊 Credit Hours System & GPA Guide:\n` +
          `- **GPA Scale**: From 0.0 to 4.0 (A+ = 4.0, A = 3.7, B+ = 3.3, B = 3.0, C+ = 2.7, C = 2.4).\n` +
          `- **Passing Grade**: C (2.0) is the minimum satisfactory standard for major subjects.\n` +
          `- **Course Load**: Typically 14 to 18 credit hours per regular semester depending on your previous semester GPA.`;
      } else {
        dynamicReply += `I received your question: *"${lastMessage}"*.\n\nAs your Academic Advisor in the **${dept}** department (${level}), I am here to help you excel in your lectures, lab exams, coursework, and daily life in Cairo.\n\nFeel free to ask any specific question about your syllabus, problem sets, or university procedures! ✨`;
      }
    } else {
      dynamicReply = `أهلاً وسهلاً بيك يا دكتورنا **${name}** في رحاب كلية العلوم جامعة القاهرة! 🌿🇸🇩\n\n`;

      if (/إقامة|جواز|فيزا|تجديد|سفر|مجمع/.test(lastMessage)) {
        dynamicReply += `### 🛂 دليل استخراج وتجديد الإقامة الدراسية للطلاب السودانيين بمصر:\n` +
          `1. **إفادة القيد الأكاديمي**: استخرج إفادة قيد رسمية موجهة لمصلحة الجوازات من إدارة شؤون الطلاب بكلية العلوم.\n` +
          `2. **مقر التقديم**: التوجه إلى مجمع الجوازات المختص (مجمع الجيزة أو مجمع العباسية).\n` +
          `3. **المستندات المطلوبة**:\n` +
          `   - أصل جواز السفر وصور واضحة منه.\n` +
          `   - صور شخصية حديثة بخلفية بيضاء.\n` +
          `   - عقد إيجار سكن موثق بالشهر العقاري أو إيصال مرافق.\n` +
          `   - إيصال سداد المصروفات الدراسية الجامعية.\n` +
          `4. **نصيحة الرابطة لك يا ${name}**: ابدأ إجراءات التجديد قبل انتهاء إقامتك بـ 30 يوماً على الأقل. ولا تشيل هم، فريق شؤون الطلاب بالرابطة جاهز لمرافقتك! ✨`;
      } else if (/سكن|شقة|إيجار|منطقة|عايز أسكن|غرفة/.test(lastMessage)) {
        dynamicReply += `### 🏠 دليل السكن للطلاب السودانيين بالقرب من جامعة القاهرة:\n` +
          `- **الدقي والمهندسين**: الأقرب لبوابة الكلية (5-10 دقائق بالمواصلات أو مترو جامعة القاهرة/الدقي)، خدمات ممتازة وأمان.\n` +
          `- **بين السرايات**: ملاصقة تماماً لسور كلية العلوم، توفر الوقت وتناسبك إذا كنت تقضي أوقاتاً طويلة بالمعامل.\n` +
          `- **شارع فيصل والهرم**: خيار اقتصادي ومناسب جداً للطلاب، ومواصلات مباشرة إلى بوابة الجامعة.\n` +
          `💡 *إذا كنت تبحث عن زملاء سكن من الطلاب السودانيين، يمكنك التواصل عبر غرفة الدردشة بالمنصة!*`;
      } else if (/حاسب|برمجة|بايثون|كود|خوارزميات|كمبيوتر/.test(lastMessage)) {
        dynamicReply += `### 💻 إرشادات قسم علوم الحاسب والمعلومات:\n` +
          `- **المقررات الأساسية**: هياكل البيانات (Data Structures)، الخوارزميات، البرمجة كائنية التوجه (OOP)، وقواعد البيانات.\n` +
          `- **نصيحة أكاديمية لك يا ${name}**: ركز على التطبيق العملي المستمر وبناء مشاريع برمجية حقيقية بجانب المقررات النظرية.\n` +
          `- معامل الحاسب متاحة في الدور الثالث بمبنى الرياضيات وعلوم الحاسب بالكلية.`;
      } else if (/كيمياء|معمل|عضوية|تفاعلات|سكشن|تقارير/.test(lastMessage)) {
        dynamicReply += `### 🧪 إرشادات قسم الكيمياء والمعامل:\n` +
          `- **الفروع الرئيسية**: الكيمياء العضوية، الكيمياء غير العضوية، الكيمياء الفيزيائية، والتحليلية.\n` +
          `- **السلامة المعملية**: ارتداء البالطو الأبيض ونظارة الأمان إلزامي في جميع معامل الكيمياء.\n` +
          `- **تقارير السكاشن**: احرص على تسليم تقارير التجارب أسبوعياً لأخذ الدرجات العملية كاملة.`;
      } else if (/معدل|ساعات|gpa|امتحانات|درجات|تسجيل/.test(lastMessage)) {
        dynamicReply += `### 📊 نظام الساعات المعتمدة وحساب المعدل التراكمي (GPA):\n` +
          `- **مقياس المعدل**: من 0.0 إلى 4.0 (A+ = 4.0, A = 3.7, B+ = 3.3, B = 3.0, C+ = 2.7, C = 2.4).\n` +
          `- **العبء الدراسي**: يمكنك تسجيل بين 14 إلى 18 ساعة معتمدة في الفصل الدراسي العادي بناءً على معدلك السابق.\n` +
          `- **نصيحة**: ركز على المقررات ذات الساعات المعتمدة الأعلى لأنها تؤثر بشكل أكبر على رفع الـ GPA.`;
      } else {
        dynamicReply += `أهلاً بيك يا دكتورنا ${name}! قرأت سؤالك بخصوص: *"${lastMessage}"*.\n\nبصفتي مستشارك الأكاديمي في تخصص **${dept}** (${level})، أنا معاك خطوة بخطوة لمساعدتك في المذاكرة، فهم المسائل العلمية، متابعة جداول الامتحانات والمعامل، وأي استفسار تريده في القاهرة.\n\nأبشر بالخير، اسألني بالتفصيل عن أي مادة أو مسألة ويسعدني توضيحها لك فوراً! ✨`;
      }
    }

    return res.json({ reply: dynamicReply });
  } catch (error) {
    console.error('AI Route Error:', error);
    return res.json({
      reply: 'أهلاً بك يا زميلنا العزيز في كلية العلوم! 🌿\nفريق الرابطة الأكاديمي دائماً في عونك. يمكنك إعادة إرسال سؤالك وسأجيبك فوراً.',
    });
  }
});

module.exports = router;