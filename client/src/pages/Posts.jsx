import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  Plus,
  Trash2,
  MessageSquare,
  Heart,
  Pin,
  CheckCircle2,
  Send,
  X,
  Upload,
  FileText,
  Download,
  Filter,
  Search,
  BookOpen,
  Share2,
  Sparkles
} from 'lucide-react';

import { API_BASE } from '../config/api';

const DEPARTMENTS_FILTER = [
  'الكل',
  'العلوم العامة',
  'علوم الحاسب والمعلومات',
  'الكيمياء والكيمياء الحيوية',
  'الفيزياء والبيوفيزياء',
  'الرياضيات والإحصاء',
  'النبات والميكروبيولوجي',
  'علم الحيوان',
  'الجيولوجيا والجيوفيزياء',
];

export default function Posts() {
  const { activeTheme } = useTheme();
  const { user, isAdmin } = useAuth();

  const [posts, setPosts] = useState([]);
  const [selectedDept, setSelectedDept] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // فورم إضافة منشور
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newDept, setNewDept] = useState('العلوم العامة');
  const [mediaType, setMediaType] = useState('none');
  const [mediaUrl, setMediaUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  // تعليق جديد تحت منشور محدد
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/posts`);
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setPosts(res.data);
        return;
      }
    } catch (e) {
      console.log('Posts API error, loading local posts:', e.message);
    }

    // المنشورات الافتراضية
    const saved = localStorage.getItem('ssa_community_posts');
    if (saved) {
      try {
        setPosts(JSON.parse(saved));
        return;
      } catch (e) {}
    }

    const defaultPosts = [
      {
        _id: '1',
        id: 1,
        author: 'المكتب التنفيذي للرابطة',
        authorRole: 'إدارة الرابطة',
        department: 'العلوم العامة',
        createdAt: new Date().toISOString(),
        title: '🌟 ترحيب بجميع الزملاء والطلاب الجدد للعام الجامعي 2025/2026',
        content:
          'ترحب رابطة الطلاب السودانيين بكلية العلوم جامعة القاهرة بجميع الطلاب والطالبات المستجدين والقدامى. يسعدنا تقديم كافة الخدمات الأكاديمية ومساعدتكم في كل ما يخص جداول المحاضرات والمعامل.',
        mediaType: 'none',
        mediaUrl: '',
        fileName: '',
        likes: 38,
        likedBy: [],
        isPinned: true,
        comments: [
          {
            author: 'أحمد عثمان',
            text: 'ألف شكر لإدارة الرابطة الموقرة على جهودكم المستمرة في خدمة الطلاب!',
            createdAt: new Date().toISOString(),
          },
        ],
      },
      {
        _id: '2',
        id: 2,
        author: 'اللجنة الأكاديمية - قسم الكيمياء',
        authorRole: 'طالب',
        department: 'الكيمياء والكيمياء الحيوية',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        title: '🧪 مذكرة وتجارب معمل الكيمياء العامة (General Chemistry Lab Notes)',
        content:
          'تم رفع مذكرة شاملة لتجارب الكيمياء العامة مع شرح أدوات المعمل ومعادلات التحليل الحجمي والنوعي لمساعدة طلاب المستوى الأول.',
        mediaType: 'pdf',
        mediaUrl: '#',
        fileName: 'General_Chemistry_Lab_Notes_SSA.pdf',
        likes: 22,
        likedBy: [],
        isPinned: false,
        comments: [],
      },
    ];

    setPosts(defaultPosts);
    localStorage.setItem('ssa_community_posts', JSON.stringify(defaultPosts));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    if (file.type === 'application/pdf') {
      setMediaType('pdf');
      const reader = new FileReader();
      reader.onloadend = () => setMediaUrl(reader.result);
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('image/')) {
      setMediaType('image');
      // ضغط وتصغير الصورة باستخدام Canvas لتفادي تجاوز حجم الطلب
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1200;
          let w = img.width;
          let h = img.height;
          if (w > h && w > maxDim) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else if (h > maxDim) {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          const compressed = canvas.toDataURL('image/jpeg', 0.75);
          setMediaUrl(compressed);
        };
        img.onerror = () => setMediaUrl(ev.target.result);
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('video/')) {
      setMediaType('video');
      const reader = new FileReader();
      reader.onloadend = () => setMediaUrl(reader.result);
      reader.readAsDataURL(file);
    } else {
      setMediaType('pdf');
      const reader = new FileReader();
      reader.onloadend = () => setMediaUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    const authorName = user?.fullName || user?.name || 'طالب بكلية العلوم';
    const authorEmail = user?.email || '';
    const authorRole = isAdmin ? 'إدارة الرابطة' : 'طالب';

    const newPostData = {
      title: newTitle || 'منشور أكاديمي',
      content: newContent,
      author: authorName,
      authorEmail: authorEmail,
      authorRole: authorRole,
      department: newDept,
      mediaType: mediaType,
      mediaUrl: mediaUrl,
      fileName: fileName,
      isPinned: isAdmin && isPinned,
      likes: 0,
      likedBy: [],
      comments: [],
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await axios.post(`${API_BASE}/posts`, newPostData);
      if (res.data?.post) {
        const updated = [res.data.post, ...posts];
        setPosts(updated);
        localStorage.setItem('ssa_community_posts', JSON.stringify(updated));
      }
    } catch (err) {
      const localPost = { ...newPostData, _id: `local_${Date.now()}`, id: Date.now() };
      const updated = [localPost, ...posts];
      setPosts(updated);
      localStorage.setItem('ssa_community_posts', JSON.stringify(updated));
    }

    setNewTitle('');
    setNewContent('');
    setMediaType('none');
    setMediaUrl('');
    setFileName('');
    setIsPinned(false);
    setShowAddModal(false);
  };

  const handleLike = async (postId) => {
    const userEmail = user?.email || 'guest';
    const updated = posts.map((p) => {
      const pId = p._id || p.id;
      if (pId === postId) {
        const alreadyLiked = p.likedBy?.includes(userEmail);
        const newLikes = alreadyLiked ? Math.max(0, p.likes - 1) : p.likes + 1;
        const newLikedBy = alreadyLiked
          ? (p.likedBy || []).filter((e) => e !== userEmail)
          : [...(p.likedBy || []), userEmail];

        return { ...p, likes: newLikes, likedBy: newLikedBy };
      }
      return p;
    });

    setPosts(updated);
    localStorage.setItem('ssa_community_posts', JSON.stringify(updated));

    try {
      await axios.post(`${API_BASE}/posts/${postId}/like`, { userEmail });
    } catch (e) {}
  };

  const handleAddComment = async (postId) => {
    if (!commentText.trim()) return;

    const authorName = user?.fullName || user?.name || 'عضو الرابطة';
    const authorEmail = user?.email || '';

    const newComment = {
      author: authorName,
      authorEmail: authorEmail,
      text: commentText.trim(),
      createdAt: new Date().toISOString(),
    };

    const updated = posts.map((p) => {
      if ((p._id || p.id) === postId) {
        return {
          ...p,
          comments: [...(p.comments || []), newComment],
        };
      }
      return p;
    });

    setPosts(updated);
    localStorage.setItem('ssa_community_posts', JSON.stringify(updated));
    setCommentText('');

    try {
      await axios.post(`${API_BASE}/posts/${postId}/comments`, newComment);
    } catch (e) {}
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('هل أنت متأكد من رغبتك في حذف هذا المنشور؟')) return;

    const updated = posts.filter((p) => (p._id || p.id) !== postId);
    setPosts(updated);
    localStorage.setItem('ssa_community_posts', JSON.stringify(updated));

    try {
      await axios.delete(`${API_BASE}/posts/${postId}`);
    } catch (e) {}
  };

  // تصفية المنشورات
  const filteredPosts = posts.filter((p) => {
    const matchDept = selectedDept === 'الكل' || p.department?.includes(selectedDept) || p.department === selectedDept;
    const matchSearch =
      searchQuery === '' ||
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.author?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDept && matchSearch;
  });

  return (
    <div style={{ maxWidth: '950px', margin: '30px auto', padding: '0 20px', paddingBottom: '70px', direction: 'rtl' }}>
      
      {/* هيدر الصفحة */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '10px',
              background: `linear-gradient(135deg, ${activeTheme.primary} 0%, ${activeTheme.secondary} 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
            }}>
              <BookOpen size={20} />
            </div>
            <h1 style={{ color: activeTheme.textMain, fontSize: '24px', fontWeight: '900', margin: 0 }}>
              غرفة المنشورات والملتقى الأكاديمي
            </h1>
          </div>
          <p style={{ color: activeTheme.textMuted, fontSize: '13px', margin: '4px 0 0' }}>
            تبادل المذكرات العلمية، مراجعة تقارير المعامل، والنقاش الأكاديمي بين طلاب كلية العلوم
          </p>
        </div>

        {/* زر نشر مشاركة جديدة */}
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: `linear-gradient(135deg, ${activeTheme.accent} 0%, #d97706 100%)`,
            color: '#0b1622',
            border: 'none',
            padding: '11px 20px',
            borderRadius: '12px',
            fontWeight: 'bold',
            fontSize: '14px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(245, 158, 11, 0.35)',
          }}
        >
          <Plus size={18} />
          <span>كتابة منشور / مشاركة مذكرة PDF</span>
        </button>
      </div>

      {/* شريط البحث وتصفية الأقسام */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="بحث في المنشورات والمذكرات الأكاديمية..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 42px 12px 16px',
              borderRadius: '12px',
              background: 'rgba(0, 0, 0, 0.25)',
              border: `1px solid ${activeTheme.border}`,
              color: activeTheme.textMain,
              fontSize: '13px',
              outline: 'none',
              boxSizing: 'border-box',
              direction: 'rtl',
            }}
          />
          <Search
            size={18}
            color={activeTheme.textMuted}
            style={{ position: 'absolute', top: '50%', right: '14px', transform: 'translateY(-50%)' }}
          />
        </div>

        {/* أزرار تصفية الأقسام */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
          {DEPARTMENTS_FILTER.map((dept) => {
            const isSelected = selectedDept === dept;
            return (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: isSelected ? 'bold' : '500',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: `1px solid ${isSelected ? activeTheme.accent : activeTheme.border}`,
                  background: isSelected ? activeTheme.primary : 'rgba(255, 255, 255, 0.04)',
                  color: isSelected ? '#ffffff' : activeTheme.textMuted,
                  transition: 'all 0.2s ease',
                }}
              >
                {dept}
              </button>
            );
          })}
        </div>
      </div>

      {/* قائمة المنشورات */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {filteredPosts.map((post) => {
          const postId = post._id || post.id;
          const userEmail = user?.email || '';
          const isLiked = post.likedBy?.includes(userEmail);
          const canDelete = isAdmin || (user && post.authorEmail === user.email);

          return (
            <div
              key={postId}
              style={{
                background: activeTheme.bgCard,
                border: `1px solid ${post.isPinned ? activeTheme.accent : activeTheme.border}`,
                borderRadius: '18px',
                padding: '22px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
                position: 'relative',
              }}
            >
              {/* شارة التثبيت */}
              {post.isPinned && (
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: '#fbbf24',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    background: 'rgba(245, 158, 11, 0.15)',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                  }}
                >
                  <Pin size={13} />
                  <span>إعلان مثبت</span>
                </div>
              )}

              {/* رأس المنشور */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${activeTheme.primary} 0%, ${activeTheme.secondary} 100%)`,
                      border: `2px solid ${activeTheme.accent}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontWeight: 'bold',
                      fontSize: '14px',
                    }}
                  >
                    SSA
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: activeTheme.textMain, fontWeight: 'bold', fontSize: '15px' }}>
                        {post.author}
                      </span>
                      {post.authorRole === 'إدارة الرابطة' && (
                        <CheckCircle2 size={15} color={activeTheme.accentLight} />
                      )}
                    </div>
                    <div style={{ color: activeTheme.textMuted, fontSize: '11px', display: 'flex', gap: '8px' }}>
                      <span>{new Date(post.createdAt).toLocaleDateString('ar-EG')}</span>
                      <span>•</span>
                      <span style={{ color: activeTheme.accentLight }}>{post.department}</span>
                    </div>
                  </div>
                </div>

                {canDelete && (
                  <button
                    onClick={() => handleDeletePost(postId)}
                    title="حذف المنشور"
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.25)',
                      color: '#ef4444',
                      padding: '6px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              {/* عنوان ومحتوى المنشور */}
              {post.title && (
                <h2 style={{ color: activeTheme.textMain, fontSize: '17px', fontWeight: 'bold', marginBottom: '8px' }}>
                  {post.title}
                </h2>
              )}

              <p style={{ color: activeTheme.textMain, fontSize: '14px', lineHeight: '1.8', whiteSpace: 'pre-line', margin: '0 0 16px' }}>
                {post.content}
              </p>

              {/* ميديا ومرفقات PDF */}
              {post.mediaType === 'pdf' && (
                <div
                  style={{
                    background: 'rgba(245, 158, 11, 0.08)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: '12px',
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileText size={28} color={activeTheme.accentLight} />
                    <div>
                      <div style={{ color: activeTheme.textMain, fontWeight: 'bold', fontSize: '13px' }}>
                        {post.fileName || 'مذكرة / ملخص دراسي PDF'}
                      </div>
                      <div style={{ color: activeTheme.textMuted, fontSize: '11px' }}>ملف مرفق للتحميل والمطالعة</div>
                    </div>
                  </div>

                  <a
                    href={post.mediaUrl || '#'}
                    download={post.fileName || 'SSA_Study_Note.pdf'}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: activeTheme.primary,
                      color: '#ffffff',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      border: `1px solid ${activeTheme.accent}`,
                    }}
                  >
                    <Download size={14} />
                    <span>تحميل المذكرة</span>
                  </a>
                </div>
              )}

              {post.mediaType === 'image' && post.mediaUrl && (
                <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '16px', border: `1px solid ${activeTheme.border}` }}>
                  <img src={post.mediaUrl} alt="مرفق المنشور" style={{ width: '100%', maxHeight: '420px', objectFit: 'cover' }} />
                </div>
              )}

              {/* شريط التفاعل (الإعجاب والتعليقات) */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  paddingTop: '12px',
                  borderTop: `1px solid ${activeTheme.border}`,
                }}
              >
                <button
                  onClick={() => handleLike(postId)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'transparent',
                    border: 'none',
                    color: isLiked ? '#ef4444' : activeTheme.textMuted,
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 'bold',
                  }}
                >
                  <Heart size={18} fill={isLiked ? '#ef4444' : 'none'} />
                  <span>{post.likes || 0} إعجاب</span>
                </button>

                <button
                  onClick={() => setActiveCommentPostId(activeCommentPostId === postId ? null : postId)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'transparent',
                    border: 'none',
                    color: activeCommentPostId === postId ? activeTheme.accentLight : activeTheme.textMuted,
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 'bold',
                  }}
                >
                  <MessageSquare size={18} />
                  <span>{post.comments?.length || 0} تعليق</span>
                </button>
              </div>

              {/* صندوق التعليقات */}
              {activeCommentPostId === postId && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: `1px dashed ${activeTheme.border}` }}>
                  {/* قائمة التعليقات السابقة */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                    {post.comments && post.comments.length > 0 ? (
                      post.comments.map((c, i) => (
                        <div
                          key={i}
                          style={{
                            background: 'rgba(0, 0, 0, 0.25)',
                            padding: '10px 14px',
                            borderRadius: '10px',
                            border: `1px solid ${activeTheme.border}`,
                          }}
                        >
                          <div style={{ color: activeTheme.accentLight, fontWeight: 'bold', fontSize: '12px', marginBottom: '3px' }}>
                            {c.author}
                          </div>
                          <div style={{ color: activeTheme.textMain, fontSize: '13px', lineHeight: '1.5' }}>
                            {c.text}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ fontSize: '12px', color: activeTheme.textMuted }}>لا توجد تعليقات بعد. كن أول من يعلق!</div>
                    )}
                  </div>

                  {/* إدخال تعليق جديد */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="اكتب تعليقك أو استفسارك هنا..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddComment(postId)}
                      style={{
                        flex: 1,
                        padding: '9px 14px',
                        borderRadius: '8px',
                        background: 'rgba(0, 0, 0, 0.3)',
                        border: `1px solid ${activeTheme.border}`,
                        color: activeTheme.textMain,
                        fontSize: '12px',
                        outline: 'none',
                      }}
                    />
                    <button
                      onClick={() => handleAddComment(postId)}
                      style={{
                        background: activeTheme.primary,
                        color: '#ffffff',
                        border: 'none',
                        padding: '9px 16px',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      تعليق
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* نافذة رفع منشور / مذكرة جديدة (Modal) */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            style={{
              background: activeTheme.bgCard,
              border: `1px solid ${activeTheme.border}`,
              borderRadius: '20px',
              width: '100%',
              maxWidth: '650px',
              padding: '28px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: `1px solid ${activeTheme.border}`, paddingBottom: '12px' }}>
              <h3 style={{ color: activeTheme.textMain, margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
                كتابة منشور / مشاركة مذكرة أكاديمية
              </h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: 'none', color: activeTheme.textMuted, cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', color: activeTheme.textMain, fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
                  عنوان المشاركة *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: مذكرة كيمياء عضوية / ملخص معادلات الفيزياء..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={inputModalStyle(activeTheme)}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: activeTheme.textMain, fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
                  القسم العلمي المستهدف
                </label>
                <select
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  style={inputModalStyle(activeTheme)}
                >
                  {DEPARTMENTS_FILTER.filter((d) => d !== 'الكل').map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', color: activeTheme.textMain, fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
                  نص وتفاصيل المنشور *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="اكتب شرحاً للمذكرة أو تفاصيل استفسارك الأكاديمي..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  style={inputModalStyle(activeTheme)}
                />
              </div>

              {/* إرفاق ملف PDF أو صورة */}
              <div>
                <label style={{ display: 'block', color: activeTheme.textMain, fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
                  إرفاق مذكرة PDF أو صورة من جهازك
                </label>
                <div
                  style={{
                    border: `2px dashed ${mediaUrl ? '#22c55e' : activeTheme.accent}`,
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                    background: 'rgba(0,0,0,0.2)',
                    position: 'relative',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="file"
                    accept="application/pdf,image/*,video/*"
                    onChange={handleFileUpload}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                  />
                  {fileName ? (
                    <div style={{ color: '#22c55e', fontWeight: 'bold', fontSize: '13px' }}>
                      تم اختيار الملف: {fileName}
                    </div>
                  ) : (
                    <>
                      <Upload size={28} color={activeTheme.accentLight} style={{ marginBottom: '6px' }} />
                      <div style={{ color: activeTheme.textMain, fontSize: '13px', fontWeight: 'bold' }}>
                        اضغط هنا لاختيار ملف PDF أو صورة
                      </div>
                    </>
                  )}
                </div>
              </div>

              {isAdmin && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    id="pinCheck"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                  />
                  <label htmlFor="pinCheck" style={{ color: activeTheme.textMain, fontSize: '13px', cursor: 'pointer' }}>
                    تثبيت المنشور في أعلى الملتقى الأكاديمي (خاص بالأدمن)
                  </label>
                </div>
              )}

              <button
                type="submit"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: `linear-gradient(135deg, ${activeTheme.accent} 0%, #d97706 100%)`,
                  color: '#0b1622',
                  border: 'none',
                  padding: '13px',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  cursor: 'pointer',
                  marginTop: '10px',
                }}
              >
                <Send size={16} />
                <span>نشر في الملتقى الآن</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const inputModalStyle = (theme) => ({
  width: '100%',
  padding: '10px 14px',
  borderRadius: '10px',
  background: 'rgba(0, 0, 0, 0.3)',
  border: `1px solid ${theme.border}`,
  color: theme.textMain,
  outline: 'none',
  fontSize: '13px',
  boxSizing: 'border-box',
  direction: 'rtl',
});