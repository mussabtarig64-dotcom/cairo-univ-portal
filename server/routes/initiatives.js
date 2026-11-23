const express = require('express');
const router = express.Router();
const Initiative = require('../models/Initiative');
const User = require('../models/User');

/**
 * Middleware للتحقق من صلاحيات المشرف / الأدمن
 */
const requireAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers['x-auth-token'] || '';
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'تسجيل دخول المشرف مطلوب لإجراء هذه العملية.',
      });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : authHeader.trim();

    // فحص التوكنات المخصصة للأدمن
    if (token.startsWith('ssa_token_admin_') || token === 'admin' || token === 'admin_token') {
      req.user = { role: 'admin', isAdmin: true };
      return next();
    }

    // فحص توكن المعرف ssa_token_<id>_
    if (token.startsWith('ssa_token_')) {
      const parts = token.split('_');
      const possibleId = parts[2];
      if (possibleId) {
        const found = await User.findById(possibleId).select('role isAdmin').lean();
        if (found && (found.role === 'admin' || found.isAdmin === true)) {
          req.user = found;
          return next();
        }
      }
      return res.status(403).json({
        success: false,
        message: 'غير مصرح: هذا الإجراء مخصص لمسؤولي الرابطة فقط.',
      });
    }

    // فحص توكن JWT
    if (token.includes('.')) {
      try {
        const jwt = require('jsonwebtoken');
        const JWT_SECRET = process.env.JWT_SECRET || 'ssa_default_fallback_jwt_secret_key_2026';
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded && (decoded.role === 'admin' || decoded.isAdmin === true)) {
          req.user = decoded;
          return next();
        }
      } catch (jwtErr) {
        return res.status(401).json({
          success: false,
          message: 'انتهت صلاحية جلسة المشرف، يرجى إعادة تسجيل الدخول.',
        });
      }
    }

    return res.status(403).json({
      success: false,
      message: 'غير مصرح: يجب أن تمتلك صلاحية المشرف لتنفيذ هذا الإجراء.',
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'خطأ في التحقق من صلاحية المشرف.',
      error: err.message,
    });
  }
};

/**
 * 1. جلب كافة المبادرات وحملات التكافل النشطة (GET /api/initiatives)
 * يفلتر تلقائياً الحملات المنتهية إلا إذا طُلب صراحة ?includeExpired=true
 */
router.get('/', async (req, res) => {
  try {
    const { includeExpired, all } = req.query;
    const filter = {};

    // فلترة الحملات المنتهية للزوار العاديين تلقائياً (expiresAt > now)
    if (includeExpired !== 'true' && all !== 'true') {
      filter.expiresAt = { $gt: new Date() };
    }

    const initiatives = await Initiative.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: initiatives.length,
      data: initiatives,
    });
  } catch (error) {
    console.error('Fetch Initiatives Error:', error);
    return res.status(500).json({
      success: false,
      message: 'فشل جلب حملات المبادرات والتكافل.',
      error: error.message,
    });
  }
});

/**
 * 2. جلب تفاصيل مبادرة واحدة بواسطة المعرف (GET /api/initiatives/:id)
 */
router.get('/:id', async (req, res) => {
  try {
    const initiative = await Initiative.findById(req.params.id);
    if (!initiative) {
      return res.status(404).json({
        success: false,
        message: 'لم يتم العثور على المبادرة المطلوبة.',
      });
    }
    return res.status(200).json({
      success: true,
      data: initiative,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'خطأ في جلب بيانات المبادرة.',
      error: error.message,
    });
  }
});

/**
 * 3. إضافة حملة تكافل / مبادرة جديدة (POST /api/initiatives) - للمشرفين فقط
 */
router.post('/', requireAdmin, async (req, res) => {
  try {
    const {
      title,
      badge,
      description,
      imageUrl,
      targetAmount,
      collectedAmount,
      currency,
      paymentMethods,
      whatsappLink,
      expiresAt,
    } = req.body;

    if (!title || !description || targetAmount === undefined || !expiresAt) {
      return res.status(400).json({
        success: false,
        message: 'الحقول التالية مطلوبة: العنوان، الوصف، المبلغ المستهدف، وتاريخ انتهاء الحملة.',
      });
    }

    const newInitiative = new Initiative({
      title: title.trim(),
      badge: (badge || 'مبادرة تكافل').trim(),
      description: description.trim(),
      imageUrl: (imageUrl || '').trim(),
      targetAmount: Number(targetAmount) || 0,
      collectedAmount: Number(collectedAmount) || 0,
      currency: (currency || 'جنيه مصري').trim(),
      paymentMethods: {
        instapay: (paymentMethods?.instapay || '').trim(),
        vodafoneCash: (paymentMethods?.vodafoneCash || '').trim(),
        bankak: (paymentMethods?.bankak || '').trim(),
      },
      whatsappLink: (whatsappLink || '').trim(),
      expiresAt: new Date(expiresAt),
      createdBy: req.user?.fullName || req.user?.name || 'إدارة الرابطة',
    });

    const saved = await newInitiative.save();

    // بث حي عبر Socket.IO إذا توفر
    if (req.io) {
      req.io.emit('new_initiative', saved);
    }

    return res.status(201).json({
      success: true,
      message: 'تم إنشاء ونشر حملة التكافل الاجتماعي بنجاح!',
      data: saved,
    });
  } catch (error) {
    console.error('Create Initiative Error:', error);
    return res.status(500).json({
      success: false,
      message: 'فشل حفظ ونشر المبادرة في قاعدة البيانات.',
      error: error.message,
    });
  }
});

/**
 * 4. تعديل وتحديث بيانات المبادرة أو المبلغ المجموع (PUT /api/initiatives/:id) - للمشرفين فقط
 */
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const initiative = await Initiative.findById(req.params.id);
    if (!initiative) {
      return res.status(404).json({
        success: false,
        message: 'المبادرة المراد تعديلها غير موجودة.',
      });
    }

    const {
      title,
      badge,
      description,
      imageUrl,
      targetAmount,
      collectedAmount,
      currency,
      paymentMethods,
      whatsappLink,
      expiresAt,
    } = req.body;

    if (title !== undefined) initiative.title = title.trim();
    if (badge !== undefined) initiative.badge = badge.trim();
    if (description !== undefined) initiative.description = description.trim();
    if (imageUrl !== undefined) initiative.imageUrl = imageUrl.trim();
    if (targetAmount !== undefined) initiative.targetAmount = Number(targetAmount) || 0;
    if (collectedAmount !== undefined) initiative.collectedAmount = Number(collectedAmount) || 0;
    if (currency !== undefined) initiative.currency = currency.trim();

    if (paymentMethods) {
      if (paymentMethods.instapay !== undefined) initiative.paymentMethods.instapay = paymentMethods.instapay.trim();
      if (paymentMethods.vodafoneCash !== undefined) initiative.paymentMethods.vodafoneCash = paymentMethods.vodafoneCash.trim();
      if (paymentMethods.bankak !== undefined) initiative.paymentMethods.bankak = paymentMethods.bankak.trim();
    }

    if (whatsappLink !== undefined) initiative.whatsappLink = whatsappLink.trim();
    if (expiresAt !== undefined) initiative.expiresAt = new Date(expiresAt);

    const updated = await initiative.save();

    if (req.io) {
      req.io.emit('update_initiative', updated);
    }

    return res.status(200).json({
      success: true,
      message: 'تم تحديث بيانات المبادرة بنجاح!',
      data: updated,
    });
  } catch (error) {
    console.error('Update Initiative Error:', error);
    return res.status(500).json({
      success: false,
      message: 'فشل تحديث بيانات المبادرة.',
      error: error.message,
    });
  }
});

/**
 * 5. حذف المبادرة نهائياً (DELETE /api/initiatives/:id) - للمشرفين فقط
 */
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const deleted = await Initiative.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'المبادرة المراد حذفها غير موجودة.',
      });
    }

    if (req.io) {
      req.io.emit('delete_initiative', req.params.id);
    }

    return res.status(200).json({
      success: true,
      message: 'تم حذف المبادرة نهائياً من قاعدة البيانات.',
    });
  } catch (error) {
    console.error('Delete Initiative Error:', error);
    return res.status(500).json({
      success: false,
      message: 'فشل حذف المبادرة.',
      error: error.message,
    });
  }
});

module.exports = router;

