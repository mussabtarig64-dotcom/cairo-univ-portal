import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../config/api';
import {
  Bot,
  MessageSquare,
  X,
  Send,
  Sparkles,
  RefreshCw,
  HelpCircle,
  ChevronDown,
  User,
  GraduationCap,
  Trash2,
  Plus,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const STORAGE_MESSAGES_KEY = 'cairo_univ_smart_advisor_messages';
const STORAGE_DRAFT_KEY = 'cairo_univ_smart_advisor_draft';

export default function FloatingAIChatWidget() {
  const { activeTheme } = useTheme();
  const { user, isAdmin } = useAuth();
  const isUserAdmin = Boolean(isAdmin || user?.role === 'admin');

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [advisorPrompts, setAdvisorPrompts] = useState([]);
  const [showAddPrompt, setShowAddPrompt] = useState(false);
  const [newPromptText, setNewPromptText] = useState('');
  const [isAddingPrompt, setIsAddingPrompt] = useState(false);
  const [deletingPromptId, setDeletingPromptId] = useState(null);
  const [toast, setToast] = useState(null);
  const chatScrollRef = useRef(null);

  const studentName = user?.fullName || user?.name || 'طالب كلية العلوم';

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current));
    }, 4000);
  };

  const getDefaultMessage = () => ({
    sender: 'assistant',
    text: `مرحباً بك يا دكتورنا **${studentName}**! 👋\nأنا المستشار الأكاديمي والرفيق الذكي لرابطة الطلاب السودانيين بكلية العلوم جامعة القاهرة.\nكيف يمكنني مساعدتك اليوم في الدراسة، المذكرات، السكن، أو إجراءات الإقامة؟`,
    time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
  });

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_MESSAGES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading smart advisor messages from localStorage:', e);
    }
    return [getDefaultMessage()];
  });

  const [inputMsg, setInputMsg] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_DRAFT_KEY) || '';
    } catch {
      return '';
    }
  });

  // مزامنة سجل الرسائل مع localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_MESSAGES_KEY, JSON.stringify(messages));
    } catch (e) {
      console.error('Error saving smart advisor messages to localStorage:', e);
    }
  }, [messages]);

  // مزامنة مسودة الإدخال مع localStorage
  useEffect(() => {
    try {
      if (inputMsg) {
        localStorage.setItem(STORAGE_DRAFT_KEY, inputMsg);
      } else {
        localStorage.removeItem(STORAGE_DRAFT_KEY);
      }
    } catch (e) {
      console.error('Error saving draft to localStorage:', e);
    }
  }, [inputMsg]);

  // 1. جلب الأسئلة والمحفزات السريعة ديناميكياً من قاعدة بيانات MongoDB
  const fetchAdvisorPromptsLive = async () => {
    try {
      const res = await axios.get(`${API_BASE}/advisor-prompts`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
        params: {
          _t: Date.now(),
        },
      });
      const list = Array.isArray(res.data) ? res.data : (res.data?.prompts || res.data?.items || []);
      setAdvisorPrompts(list);
      return list;
    } catch (err) {
      console.error('Error fetching advisor prompts in widget:', err);
    }
    return null;
  };

  useEffect(() => {
    fetchAdvisorPromptsLive();

    const handleSyncEvent = (e) => {
      if (e.detail && Array.isArray(e.detail)) {
        setAdvisorPrompts(e.detail);
      } else {
        fetchAdvisorPromptsLive();
      }
    };

    window.addEventListener('advisor_prompts_updated', handleSyncEvent);
    return () => {
      window.removeEventListener('advisor_prompts_updated', handleSyncEvent);
    };
  }, []);

  // 2. منطق DB-First لإضافة سؤال سريع جديد (Admin Only)
  const handleAddPrompt = async (e) => {
    e?.preventDefault();
    const text = newPromptText.trim();
    if (!text || isAddingPrompt) return;

    try {
      setIsAddingPrompt(true);
      const res = await axios.post(`${API_BASE}/advisor-prompts`, {
        prompt: text,
      });

      const createdPrompt = res.data?.prompt || (res.data?._id ? res.data : null);
      if (createdPrompt) {
        setAdvisorPrompts((prev) => [createdPrompt, ...prev]);
        window.dispatchEvent(new CustomEvent('advisor_prompts_updated'));
        setNewPromptText('');
        setShowAddPrompt(false);
        showToast('تمت إضافة السؤال بنجاح وحفظه في قاعدة البيانات', 'success');
      } else {
        throw new Error(res.data?.message || 'تعذر حفظ السؤال');
      }
    } catch (err) {
      console.error('Failed to add advisor prompt:', err);
      showToast(err.response?.data?.message || 'فشل إضافة السؤال، يرجى المحاولة مرة أخرى', 'error');
    } finally {
      setIsAddingPrompt(false);
    }
  };

  // 3. منطق DB-First لحذف سؤال سريع من قاعدة البيانات (Admin Only)
  const handleDeletePrompt = async (e, promptId) => {
    e.stopPropagation();
    if (!promptId || deletingPromptId === promptId) return;

    try {
      setDeletingPromptId(promptId);
      const res = await axios.delete(`${API_BASE}/advisor-prompts/${promptId}`);

      if (res.status === 200) {
        setAdvisorPrompts((prev) => prev.filter((p) => (p._id || p.id) !== promptId));
        window.dispatchEvent(new CustomEvent('advisor_prompts_updated'));
        showToast('تم حذف السؤال بنجاح من قاعدة البيانات', 'success');
      } else {
        throw new Error(res.data?.message || 'تعذر حذف السؤال');
      }
    } catch (err) {
      console.error('Failed to delete advisor prompt:', err);
      showToast(err.response?.data?.message || 'فشل حذف السؤال من قاعدة البيانات', 'error');
    } finally {
      setDeletingPromptId(null);
    }
  };

  useEffect(() => {
    if (isOpen) {
      chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleClearChat = () => {
    if (window.confirm('هل تود مسح المحادثة وحذف كافة البيانات المحفوظة للمستشار الذكي؟')) {
      const resetMsg = [getDefaultMessage()];
      setMessages(resetMsg);
      setInputMsg('');
      try {
        localStorage.removeItem(STORAGE_MESSAGES_KEY);
        localStorage.removeItem(STORAGE_DRAFT_KEY);
      } catch (e) {
        console.error('Error clearing localStorage:', e);
      }
    }
  };

  const handleSend = async (textToSend) => {
    const query = textToSend || inputMsg;
    if (!query.trim()) return;

    const userMsg = {
      sender: 'user',
      text: query.trim(),
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMsg('');
    setLoading(true);

    try {
      const payload = {
        messages: [...messages, userMsg],
        studentName,
        department: user?.department || 'العلوم العامة',
        academicLevel: user?.academicYear || 'المستوى الأول',
      };

      const res = await axios.post(`${API_BASE}/ai/chat`, payload);

      if (res.data && res.data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'assistant',
            text: res.data.reply,
            time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        throw new Error('لم يتم استلام رد');
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'أبشر بالخير! يمكنك الاطلاع على قسم **المكتبة الأكاديمية** أو **الأسئلة الشائعة** بالمنصة للحصول على تفاصيل فورية، أو المحاولة لاحقاً.',
          time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="floating-ai-container" style={{ position: 'fixed', zIndex: 30, direction: 'rtl' }}>
      
      {/* 1. نافذة الشات العائمة Floating Chat Window */}
      {isOpen && (
        <div
          className="floating-ai-window"
          style={{
            position: 'absolute',
            backgroundColor: '#0f172a',
            border: '2px solid #f59e0b',
            borderRadius: '20px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.65)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'fadeInUp 0.3s ease-out',
            zIndex: 45,
          }}
        >
          {/* رأس الشات Header */}
          <div
            style={{
              padding: '14px 18px',
              background: 'linear-gradient(135deg, #091a2f 0%, #0f2744 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#ffffff',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(245, 158, 11, 0.2)',
                  border: '1px solid #f59e0b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fbbf24',
                }}
              >
                <Bot size={20} />
              </div>

              <div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', lineHeight: '1.2', color: '#ffffff' }}>
                  المستشار الأكاديمي الذكي 🤖
                </div>
                <div style={{ fontSize: '11px', color: '#fbbf24' }}>
                  كلية العلوم جامعة القاهرة
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={handleClearChat}
                title="مسح المحادثة وحذف البيانات"
                aria-label="مسح المحادثة وحذف البيانات"
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  color: '#fca5a5',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)';
                  e.currentTarget.style.color = '#ef4444';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                  e.currentTarget.style.color = '#fca5a5';
                }}
              >
                <Trash2 size={15} />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="إغلاق"
                aria-label="إغلاق"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: '#ffffff',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* تنبيهات العمليات والـ Toasts */}
          {toast && (
            <div
              style={{
                padding: '8px 14px',
                margin: '8px 12px 0',
                borderRadius: '8px',
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                backgroundColor: toast.type === 'success' ? 'rgba(16, 185, 129, 0.18)' : 'rgba(239, 68, 68, 0.18)',
                border: `1px solid ${toast.type === 'success' ? '#10b981' : '#ef4444'}`,
                color: toast.type === 'success' ? '#34d399' : '#fca5a5',
                zIndex: 50,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {toast.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                <span>{toast.message}</span>
              </div>
              <button
                type="button"
                onClick={() => setToast(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={12} />
              </button>
            </div>
          )}

          {/* محتوى الرسائل Chat Body */}
          <div
            style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              background: '#0a101d',
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-start' : 'flex-end',
                  maxWidth: '85%',
                  padding: '12px 14px',
                  borderRadius: msg.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  backgroundColor: msg.sender === 'user' ? '#1e293b' : '#0f172a',
                  border: `1px solid ${msg.sender === 'user' ? '#f59e0b' : '#334155'}`,
                  color: '#ffffff',
                  fontSize: '13px',
                  lineHeight: '1.7',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  whiteSpace: 'pre-line',
                }}
              >
                {msg.text}
                <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px', textAlign: 'left' }}>
                  {msg.time}
                </div>
              </div>
            ))}

            {/* اقتراحات الأسئلة الشائعة السريعة المقترنة بقاعدة البيانات */}
            {messages.length < 3 && (advisorPrompts.length > 0 || isUserAdmin) && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span>💡 أسئلة يمكنك الاستفسار عنها فوراً:</span>
                  </div>

                  {/* زر إضافة سؤال جديد متاح حصرياً للأدمن */}
                  {isUserAdmin && (
                    <button
                      type="button"
                      onClick={() => setShowAddPrompt(!showAddPrompt)}
                      title="إضافة سؤال جديد للأدمن"
                      style={{
                        background: showAddPrompt ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        border: `1px solid ${showAddPrompt ? 'rgba(239, 68, 68, 0.35)' : 'rgba(245, 158, 11, 0.35)'}`,
                        color: showAddPrompt ? '#fca5a5' : '#fbbf24',
                        borderRadius: '6px',
                        padding: '2px 8px',
                        fontSize: '11px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontWeight: 'bold',
                        transition: 'all 0.2s',
                      }}
                    >
                      {showAddPrompt ? <X size={12} /> : <Plus size={12} />}
                      <span>{showAddPrompt ? 'إلغاء' : 'إضافة سؤال'}</span>
                    </button>
                  )}
                </div>

                {/* نموذج إضافة سؤال جديد في قاعدة البيانات للأدمن */}
                {isUserAdmin && showAddPrompt && (
                  <form
                    onSubmit={handleAddPrompt}
                    style={{
                      marginBottom: '10px',
                      padding: '10px',
                      background: '#131e32',
                      border: '1px dashed #f59e0b',
                      borderRadius: '10px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <input
                      type="text"
                      placeholder="اكتب السؤال المقترح الجديد لحفظه بقاعدة البيانات..."
                      value={newPromptText}
                      onChange={(e) => setNewPromptText(e.target.value)}
                      disabled={isAddingPrompt}
                      autoFocus
                      style={{
                        padding: '8px 10px',
                        borderRadius: '6px',
                        background: '#0f172a',
                        border: '1px solid #334155',
                        color: '#ffffff',
                        fontSize: '12px',
                        outline: 'none',
                        direction: 'rtl',
                        textAlign: 'right',
                      }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                      <button
                        type="submit"
                        disabled={isAddingPrompt || !newPromptText.trim()}
                        style={{
                          padding: '5px 12px',
                          borderRadius: '6px',
                          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                          color: '#0b1622',
                          fontWeight: 'bold',
                          border: 'none',
                          fontSize: '11px',
                          cursor: isAddingPrompt || !newPromptText.trim() ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        {isAddingPrompt ? <RefreshCw size={12} className="animate-spin" /> : <Plus size={12} />}
                        <span>حفظ في قاعدة البيانات</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* قائمة فقاعات الأسئلة */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {advisorPrompts.map((q) => {
                    const promptId = q._id || q.id;
                    const promptText = q.prompt || q.question || q.text;
                    const isDeleting = deletingPromptId === promptId;

                    return (
                      <div
                        key={promptId || promptText}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          background: '#1e293b',
                          border: '1px solid #334155',
                          transition: 'all 0.2s',
                          opacity: isDeleting ? 0.4 : 1,
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => handleSend(promptText)}
                          disabled={isDeleting}
                          style={{
                            flex: 1,
                            background: 'transparent',
                            border: 'none',
                            color: '#cbd5e1',
                            fontSize: '12px',
                            textAlign: 'right',
                            cursor: 'pointer',
                            padding: 0,
                            lineHeight: '1.4',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#fbbf24')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
                        >
                          {promptText}
                        </button>

                        {/* زر الحذف متاح حصرياً للأدمن بشرط وجود معرف بالسيرفر */}
                        {isUserAdmin && promptId && (
                          <button
                            type="button"
                            onClick={(e) => handleDeletePrompt(e, promptId)}
                            disabled={isDeleting}
                            title="حذف هذا السؤال من قاعدة البيانات (أدمن)"
                            aria-label="حذف السؤال"
                            style={{
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid rgba(239, 68, 68, 0.25)',
                              color: '#f87171',
                              borderRadius: '5px',
                              width: '24px',
                              height: '24px',
                              cursor: isDeleting ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)';
                              e.currentTarget.style.color = '#ef4444';
                              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                              e.currentTarget.style.color = '#f87171';
                              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.25)';
                            }}
                          >
                            {isDeleting ? <RefreshCw size={11} className="animate-spin" /> : <Trash2 size={12} />}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* مؤشر جاري الكتابة والتفكير */}
            {loading && (
              <div
                style={{
                  alignSelf: 'flex-end',
                  maxWidth: '85%',
                  padding: '10px 14px',
                  borderRadius: '14px 14px 14px 2px',
                  backgroundColor: '#0f172a',
                  border: '1px solid rgba(245, 158, 11, 0.45)',
                  boxShadow: '0 4px 16px rgba(245, 158, 11, 0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  animation: 'popInSuccess 0.25s ease-out',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#f59e0b',
                      boxShadow: '0 0 8px rgba(245, 158, 11, 0.8)',
                      animation: 'pulseDot 1.2s infinite ease-in-out',
                      animationDelay: '0s',
                    }}
                  />
                  <div
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#f59e0b',
                      boxShadow: '0 0 8px rgba(245, 158, 11, 0.8)',
                      animation: 'pulseDot 1.2s infinite ease-in-out',
                      animationDelay: '0.2s',
                    }}
                  />
                  <div
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#f59e0b',
                      boxShadow: '0 0 8px rgba(245, 158, 11, 0.8)',
                      animation: 'pulseDot 1.2s infinite ease-in-out',
                      animationDelay: '0.4s',
                    }}
                  />
                </div>
                <span style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 'bold' }}>
                  المستشار الذكي يكتب الإجابة...
                </span>
              </div>
            )}

            <div ref={chatScrollRef} />
          </div>

          {/* حقل الإدخال Chat Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: '12px',
              borderTop: '1px solid #334155',
              backgroundColor: '#0f172a',
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              placeholder="اكتب سؤالك الأكاديمي هنا..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              disabled={loading}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '10px',
                background: '#1e293b',
                border: '1px solid #334155',
                color: '#ffffff',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box',
                direction: 'rtl',
                textAlign: 'right',
              }}
            />

            <button
              type="submit"
              disabled={loading || !inputMsg.trim()}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#0b1622',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: loading || !inputMsg.trim() ? 'not-allowed' : 'pointer',
                flexShrink: 0,
              }}
            >
              {loading ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </form>
        </div>
      )}

      {/* 2. زر التفعيل العائم Floating 3D Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="floating-ai-btn"
        title="المستشار الأكاديمي والرفيق الذكي (AI)"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '9px',
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)',
          color: '#0b1622',
          border: '1.5px solid rgba(255, 255, 255, 0.35)',
          borderRadius: '30px',
          fontWeight: '900',
          cursor: 'pointer',
          boxShadow: '0 10px 28px rgba(245, 158, 11, 0.5), 0 0 20px rgba(56, 189, 248, 0.3)',
          transformStyle: 'preserve-3d',
        }}
      >
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Bot size={19} />
          {/* Animated Glowing Pulse Orb */}
          <span
            style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '7px',
              height: '7px',
              backgroundColor: '#22c55e',
              borderRadius: '50%',
              boxShadow: '0 0 8px #22c55e',
              animation: 'pulseDot 1.6s infinite',
            }}
          />
        </div>
        <span className="floating-ai-label" style={{ letterSpacing: '0.3px' }}>المستشار الذكي 🤖</span>
      </button>

      <style>{`
        @keyframes float3DAdvisor {
          0% {
            transform: translateY(0px) rotate(0deg) translateZ(0px);
            box-shadow: 0 10px 28px rgba(245, 158, 11, 0.5), 0 0 20px rgba(56, 189, 248, 0.25);
          }
          25% {
            transform: translateY(-7px) rotate(2deg) translateZ(10px);
            box-shadow: 0 16px 36px rgba(245, 158, 11, 0.65), 0 0 30px rgba(56, 189, 248, 0.45);
          }
          50% {
            transform: translateY(-13px) rotate(0deg) translateZ(18px);
            box-shadow: 0 22px 45px rgba(245, 158, 11, 0.75), 0 0 40px rgba(245, 158, 11, 0.5);
          }
          75% {
            transform: translateY(-6px) rotate(-2deg) translateZ(10px);
            box-shadow: 0 16px 36px rgba(245, 158, 11, 0.65), 0 0 30px rgba(56, 189, 248, 0.45);
          }
          100% {
            transform: translateY(0px) rotate(0deg) translateZ(0px);
            box-shadow: 0 10px 28px rgba(245, 158, 11, 0.5), 0 0 20px rgba(56, 189, 248, 0.25);
          }
        }

        .floating-ai-btn {
          animation: float3DAdvisor 3.6s ease-in-out infinite;
          transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.28s ease !important;
        }

        .floating-ai-btn:hover {
          animation-play-state: paused;
          transform: scale(1.09) translateY(-6px) rotate(0deg) !important;
          box-shadow: 0 0 35px rgba(245, 158, 11, 0.9), 0 0 65px rgba(56, 189, 248, 0.6), inset 0 0 16px rgba(255, 255, 255, 0.4) !important;
          border-color: rgba(255, 255, 255, 0.8) !important;
        }

        @keyframes springPopIn {
          0% {
            opacity: 0;
            transform: scale(0.86) translateY(24px);
          }
          70% {
            opacity: 1;
            transform: scale(1.02) translateY(-4px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes pulseDot {
          0%, 80%, 100% {
            opacity: 0.3;
            transform: scale(0.75);
          }
          40% {
            opacity: 1;
            transform: scale(1.35);
          }
        }

        /* Desktop Positioning */
        @media (min-width: 641px) {
          .floating-ai-container {
            bottom: 24px;
            left: 24px;
          }
          .floating-ai-btn {
            padding: 13px 20px;
            font-size: 14px;
          }
          .floating-ai-window {
            bottom: 72px;
            left: 0;
            width: 390px;
            height: 530px;
            transform-origin: bottom left;
            animation: springPopIn 0.3s cubic-bezier(0.34, 1.4, 0.64, 1) forwards;
          }
        }

        /* Mobile Positioning: bottom-2 left-2 (8px), scale-75, z-index 20 */
        @media (max-width: 640px) {
          .floating-ai-container {
            bottom: 12px !important;
            left: 12px !important;
            z-index: 20 !important;
            transform-origin: bottom left;
          }
          .floating-ai-btn {
            padding: 9px 14px;
            font-size: 12px;
          }
          .floating-ai-label {
            font-size: 11px;
          }
          .floating-ai-window {
            bottom: 54px;
            left: 0;
            width: calc(100vw - 24px);
            height: 450px;
            max-height: calc(100vh - 80px);
            z-index: 35 !important;
            transform-origin: bottom left;
            animation: springPopIn 0.3s cubic-bezier(0.34, 1.4, 0.64, 1) forwards;
          }
        }
      `}</style>
    </div>
  );
}
