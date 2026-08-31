const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// جلب جميع المنشورات
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ isPinned: -1, createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error('Fetch Posts Error:', err.message, err.stack);
    res.status(500).json({
      success: false,
      error: err.message,
      stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
    });
  }
});

// إنشاء منشور جديد
router.post('/', async (req, res) => {
  try {
    const {
      title,
      content,
      author,
      authorEmail,
      authorRole,
      department,
      mediaType,
      mediaUrl,
      fileName,
      isPinned,
    } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'محتوى المنشور مطلوب' });
    }

    const post = new Post({
      title: title || 'منشور أكاديمي',
      content,
      author: author || 'طالب بكلية العلوم',
      authorEmail: authorEmail || '',
      authorRole: authorRole || 'طالب',
      department: department || 'العلوم العامة',
      mediaType: mediaType || 'none',
      mediaUrl: mediaUrl || '',
      fileName: fileName || '',
      isPinned: !!isPinned,
    });

    await post.save();

    // إنشاء وبث إشعار للجميع
    try {
      const Notification = require('../models/Notification');
      const notif = new Notification({
        title: isPinned ? `📌 تنويه هام: ${title || 'منشور مثبت'}` : `📝 منشور جديد: ${title || 'مشاركة أكاديمية'}`,
        message: content.length > 120 ? `${content.substring(0, 117)}...` : content,
        type: isPinned ? 'urgent' : 'post',
        link: '/posts',
        sender: author || 'عضو الرابطة',
        senderRole: authorRole || 'student',
      });
      await notif.save();
      if (req.io) {
        req.io.emit('new_notification', notif);
      }
    } catch (notifErr) {
      console.error('Post Notification Broadcast error:', notifErr.message);
    }

    res.status(201).json({ message: 'تم نشر المنشور بنجاح', post });
  } catch (err) {
    console.error('Create Post Error:', err.message, err.stack);
    res.status(500).json({
      success: false,
      error: err.message,
      stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
    });
  }
});

// الإعجاب بمنشور
router.post('/:id/like', async (req, res) => {
  try {
    const { userEmail } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'المنشور غير موجود' });

    let isLiked = false;
    if (userEmail && post.likedBy.includes(userEmail)) {
      post.likedBy = post.likedBy.filter((e) => e !== userEmail);
      post.likes = Math.max(0, post.likes - 1);
    } else {
      if (userEmail) post.likedBy.push(userEmail);
      post.likes += 1;
      isLiked = true;
    }

    await post.save();
    res.json({ post, isLiked });
  } catch (err) {
    console.error('Like Post Error:', err.message, err.stack);
    res.status(500).json({
      success: false,
      error: err.message,
      stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
    });
  }
});

// إضافة تعليق على منشور
router.post('/:id/comments', async (req, res) => {
  try {
    const { author, authorEmail, text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'نص التعليق مطلوب' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'المنشور غير موجود' });

    post.comments.push({
      author: author || 'عضو الرابطة',
      authorEmail: authorEmail || '',
      text: text.trim(),
      createdAt: new Date(),
    });

    await post.save();
    res.status(201).json({ success: true, post });
  } catch (err) {
    console.error('Add Comment Error:', err.message, err.stack);
    res.status(500).json({
      success: false,
      error: err.message,
      stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
    });
  }
});

// حذف منشور
router.delete('/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'تم حذف المنشور بنجاح' });
  } catch (err) {
    console.error('Delete Post Error:', err.message, err.stack);
    res.status(500).json({
      success: false,
      error: err.message,
      stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
    });
  }
});

module.exports = router;