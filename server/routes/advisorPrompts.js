const express = require('express');
const router = express.Router();
const AdvisorPrompt = require('../models/AdvisorPrompt');

const DEFAULT_SEED_PROMPTS = [
  {
    prompt: 'ما هي شروط وإجراءات تجديد الإقامة الدراسية للطلاب السودانيين في مصر؟',
    category: 'residency',
  },
  {
    prompt: 'كيف يمكنني تسجيل المقررات ونظام الساعات المعتمدة في كلية العلوم؟',
    category: 'academic',
  },
  {
    prompt: 'ما هي أهم النصائح للتحضير لاختبارات العملي ومذكرات المعامل؟',
    category: 'academic',
  },
  {
    prompt: 'ما هي التخصصات والأقسام المتاحة بكلية العلوم جامعة القاهرة وشروط التشعيب؟',
    category: 'academic',
  },
];

// 1. GET /api/advisor-prompts - جلب جميع الأسئلة المقترحة للمستشار الذكي
router.get('/', async (req, res) => {
  try {
    let prompts = await AdvisorPrompt.find({ isActive: { $ne: false } }).sort({ createdAt: 1 });

    // إذا كانت قاعدة البيانات فارغة، ننشئ أسئلة تمهيدية أولية
    if (!prompts || prompts.length === 0) {
      try {
        prompts = await AdvisorPrompt.insertMany(DEFAULT_SEED_PROMPTS);
      } catch (seedErr) {
        console.warn('Seed advisor prompts warning:', seedErr.message);
        // في حال تعذر الإدراج المجمع نرجع التمهيدية ككائنات جاهزة
        prompts = await AdvisorPrompt.find({ isActive: { $ne: false } });
      }
    }

    res.status(200).json({
      success: true,
      prompts: prompts || [],
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

// 2. POST /api/advisor-prompts - إضافة سؤال سريع جديد وحفظه في قاعدة البيانات
router.post('/', async (req, res) => {
  try {
    const rawPrompt = req.body.prompt || req.body.text || req.body.question;
    const category = req.body.category || 'general';

    if (!rawPrompt || !rawPrompt.trim()) {
      return res.status(400).json({
        success: false,
        message: 'نص السؤال مطلوب ولا يمكن أن يكون فارغاً',
      });
    }

    const newPrompt = new AdvisorPrompt({
      prompt: rawPrompt.trim(),
      category: category.trim(),
      isActive: true,
    });

    await newPrompt.save();

    res.status(201).json({
      success: true,
      message: 'تم حفظ السؤال في قاعدة البيانات بنجاح',
      prompt: newPrompt,
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

// 3. DELETE /api/advisor-prompts/:id - حذف سؤال محدد من قاعدة البيانات
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
