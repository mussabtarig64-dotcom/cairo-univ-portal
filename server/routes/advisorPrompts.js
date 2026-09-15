const express = require('express');
const router = express.Router();
const AdvisorPrompt = require('../models/AdvisorPrompt');

const DEFAULT_SEED_PROMPTS = [
  {
    prompt: 'ما هي شروط وإجراءات تجديد الإقامة الدراسية للطلاب السودانيين في مصر؟',
    question: 'ما هي شروط وإجراءات تجديد الإقامة الدراسية للطلاب السودانيين في مصر؟',
    answer: 'لتجديد الإقامة الدراسية: التوجه إلى شؤون الطلاب بكلية العلوم واستخراج إثبات قيد معتمد ومختوم موجه لمصلحة الجوازات والهجرة (مجمع الجيزة أو العباسية)، مع إحضار جواز السفر الأصلي، عقد الإيجار موثق بالشهر العقاري، وصور شخصية.',
    category: 'residency',
    keywords: ['إقامة', 'جوازات', 'تجديد', 'فيزا', 'مجمع الجيزة'],
    isActive: true,
  },
  {
    prompt: 'كيف يمكنني تسجيل المقررات ونظام الساعات المعتمدة في كلية العلوم؟',
    question: 'كيف يمكنني تسجيل المقررات ونظام الساعات المعتمدة في كلية العلوم؟',
    answer: 'يتم تسجيل المقررات بداية كل فصل دراسي عبر البوابة الإلكترونية أو مراجعة المرشد الأكاديمي للقسم. الحد الأدنى للعبء الدراسي هو 12 ساعة معتمدة والحد الأقصى 18 أو 21 ساعة معتمدة حسب معدل الطالب التراكمي (GPA).',
    category: 'academic',
    keywords: ['تسجيل', 'ساعات معتمدة', 'GPA', 'مقررات', 'مرشد أكاديمي'],
    isActive: true,
  },
  {
    prompt: 'ما هي أهم النصائح للتحضير لاختبارات العملي ومذكرات المعامل؟',
    question: 'ما هي أهم النصائح للتحضير لاختبارات العملي ومذكرات المعامل؟',
    answer: 'احرص على كتابة تقارير التجارب أسبوعياً، مراجعة خطوات التجارب والنتائج المعملية، والتدرب على التعرف على العينات المعملية وقوانين الحسابات الكيميائية والفيزيائية قبل أسبوع الامتحان العملي.',
    category: 'academic',
    keywords: ['معامل', 'امتحان عملي', 'تقارير', 'مذكرات'],
    isActive: true,
  },
  {
    prompt: 'ما هي التخصصات والأقسام المتاحة بكلية العلوم جامعة القاهرة وشروط التشعيب؟',
    question: 'ما هي التخصصات والأقسام المتاحة بكلية العلوم جامعة القاهرة وشروط التشعيب؟',
    answer: 'تضم كلية العلوم أقساماً متنوعة تشمل: علوم الحاسب، الكيمياء، الكيمياء الحيوية، الفيزياء، الفيزياء الحيوية، الرياضيات، الإحصاء، علم النبات والميكروبيولوجي، علم الحيوان، الحشرات، الجيولوجيا، الجيوفيزياء، والتقنية الحيوية. يتم التشعيب بنهاية المستوى الأول بناءً على المعدل التراكمي ورغبة الطالب.',
    category: 'academic',
    keywords: ['تشعيب', 'أقسام', 'حاسب', 'كيمياء', 'فيزياء', 'تخصصات'],
    isActive: true,
  },
];

// 1. GET /api/advisor-prompts - جلب جميع الأسئلة المقترحة وقاعدة معرفة المستشار الذكي
router.get('/', async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');

    let prompts = await AdvisorPrompt.find().sort({ createdAt: -1 });

    // إذا كانت قاعدة البيانات فارغة تماماً، ننشئ أسئلة تمهيدية أولية ونحفظها في MongoDB
    if (!prompts || prompts.length === 0) {
      try {
        prompts = await AdvisorPrompt.insertMany(DEFAULT_SEED_PROMPTS);
      } catch (seedErr) {
        console.warn('Seed advisor prompts warning:', seedErr.message);
        prompts = await AdvisorPrompt.find();
      }
    }

    res.status(200).json({
      success: true,
      count: prompts.length,
      prompts: prompts || [],
      items: prompts || [],
    });
  } catch (error) {
    console.error('Get Advisor Prompts Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'تعذر جلب أسئلة المستشار الذكي من قاعدة البيانات',
      error: error.message,
    });
  }
});

// 2. POST /api/advisor-prompts - إضافة سؤال جديد وحفظه في قاعدة البيانات
router.post('/', async (req, res) => {
  try {
    const rawQuestion = req.body.question || req.body.prompt || req.body.text;
    const answer = req.body.answer || '';
    const category = req.body.category || 'general';
    const keywords = Array.isArray(req.body.keywords)
      ? req.body.keywords
      : (req.body.keywords || '').split(',').map((k) => k.trim()).filter(Boolean);
    const isActive = req.body.isActive !== undefined ? req.body.isActive : true;

    if (!rawQuestion || !rawQuestion.trim()) {
      return res.status(400).json({
        success: false,
        message: 'نص السؤال مطلوب ولا يمكن أن يكون فارغاً',
      });
    }

    const newPrompt = new AdvisorPrompt({
      prompt: rawQuestion.trim(),
      question: rawQuestion.trim(),
      answer: answer.trim(),
      category: category.trim(),
      keywords,
      isActive,
    });

    await newPrompt.save();

    res.status(201).json({
      success: true,
      message: 'تم حفظ السؤال في قاعدة البيانات بنجاح',
      prompt: newPrompt,
      item: newPrompt,
    });
  } catch (error) {
    console.error('Create Advisor Prompt Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'فشل حفظ السؤال في قاعدة البيانات',
      error: error.message,
    });
  }
});

// 3. PUT /api/advisor-prompts/:id - تعديل سؤال موجود
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const rawQuestion = req.body.question || req.body.prompt || req.body.text;
    const answer = req.body.answer;
    const category = req.body.category;
    const keywords = req.body.keywords;
    const isActive = req.body.isActive;

    const updateData = { updatedAt: new Date() };
    if (rawQuestion) {
      updateData.prompt = rawQuestion.trim();
      updateData.question = rawQuestion.trim();
    }
    if (answer !== undefined) updateData.answer = answer.trim();
    if (category !== undefined) updateData.category = category.trim();
    if (keywords !== undefined) {
      updateData.keywords = Array.isArray(keywords)
        ? keywords
        : keywords.split(',').map((k) => k.trim()).filter(Boolean);
    }
    if (isActive !== undefined) updateData.isActive = isActive;

    const updated = await AdvisorPrompt.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'السؤال غير موجود' });
    }

    res.status(200).json({
      success: true,
      message: 'تم تحديث السؤال بنجاح',
      prompt: updated,
      item: updated,
    });
  } catch (error) {
    console.error('Update Advisor Prompt Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'فشل تحديث السؤال',
      error: error.message,
    });
  }
});

// 4. PATCH /api/advisor-prompts/:id/toggle - تغيير حالة التفعيل
router.patch('/:id/toggle', async (req, res) => {
  try {
    const item = await AdvisorPrompt.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'السؤال غير موجود' });
    }

    item.isActive = !item.isActive;
    item.updatedAt = new Date();
    await item.save();

    res.status(200).json({
      success: true,
      message: 'تم تغيير حالة التفعيل بنجاح',
      isActive: item.isActive,
      prompt: item,
      item,
    });
  } catch (error) {
    console.error('Toggle Advisor Prompt Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'فشل تغيير حالة التفعيل',
      error: error.message,
    });
  }
});

// 5. DELETE /api/advisor-prompts/:id - حذف سؤال محدد من قاعدة البيانات
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'معرف السؤال مطلوب للحذف',
      });
    }

    const deletedPrompt = await AdvisorPrompt.findByIdAndDelete(id);

    if (!deletedPrompt) {
      return res.status(404).json({
        success: false,
        message: 'السؤال المطلوب حذفه غير موجود أو تم حذفه مسبقاً',
      });
    }

    res.status(200).json({
      success: true,
      message: 'تم حذف السؤال من قاعدة البيانات بنجاح',
      id,
    });
  } catch (error) {
    console.error('Delete Advisor Prompt Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'فشل حذف السؤال من قاعدة البيانات',
      error: error.message,
    });
  }
});

module.exports = router;
