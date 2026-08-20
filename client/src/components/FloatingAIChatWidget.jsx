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
  GraduationCap
} from 'lucide-react';

export default function FloatingAIChatWidget() {
  const { activeTheme } = useTheme();
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [kbQuestions, setKbQuestions] = useState([]);
  const chatScrollRef = useRef(null);

  const studentName = user?.fullName || user?.name || 'طالب كلية العلوم';

  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: `مرحباً بك يا دكتورنا **${studentName}**! 👋\nأنا المستشار الأكاديمي والرفيق الذكي لرابطة الطلاب السودانيين بكلية العلوم جامعة القاهرة.\nكيف يمكنني مساعدتك اليوم في الدراسة، المذكرات، السكن، أو إجراءات الإقامة؟`,
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  useEffect(() => {
    // جلب أهم الأسئلة من قاعدة المعرفة التي أضافتها الإدارة
    axios
      .get(`${API_BASE}/ai/knowledge`)
      .then((res) => {
        if (res.data && res.data.items) {
          setKbQuestions(res.data.items.slice(0, 5));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isOpen) {
      chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

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
    <div style={{ position: 'fixed', bottom: '24px', left: '24px', zIndex: 1000, direction: 'rtl' }}>
      
      {/* 1. نافذة الشات العائمة Floating Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: '70px',
            left: 0,
            width: '380px',
            maxWidth: 'calc(100vw - 32px)',
            height: '520px',
            maxHeight: 'calc(100vh - 100px)',
            backgroundColor: activeTheme.bgCard,
            border: `2px solid ${activeTheme.accent}`,
            borderRadius: '20px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.55)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'fadeInUp 0.3s ease-out',
          }}
        >
          {/* رأس الشات Header */}
          <div
            style={{
              padding: '14px 18px',
              background: `linear-gradient(135deg, ${activeTheme.primary} 0%, ${activeTheme.secondary} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#ffffff',
              borderBottom: `1px solid ${activeTheme.border}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid #fbbf24',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fbbf24',
                }}
              >
                <Bot size={20} />
              </div>

              <div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', lineHeight: '1.2' }}>
                  المستشار الأكاديمي الذكي 🤖
                </div>
                <div style={{ fontSize: '11px', color: activeTheme.accentLight }}>
                  قاعدة معرفة الرابطة - كلية العلوم
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(0,0,0,0.2)',
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

          {/* محتوى الرسائل Chat Body */}
          <div
            style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              background: activeTheme.bgDark,
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
                  backgroundColor: msg.sender === 'user' ? activeTheme.primary : activeTheme.bgCard,
                  border: `1px solid ${msg.sender === 'user' ? activeTheme.accent : activeTheme.border}`,
                  color: activeTheme.textMain,
                  fontSize: '13px',
                  lineHeight: '1.7',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  whiteSpace: 'pre-line',
                }}
              >
                {msg.text}
                <div style={{ fontSize: '9px', color: activeTheme.textMuted, marginTop: '4px', textAlign: 'left' }}>
                  {msg.time}
                </div>
              </div>
            ))}

            {/* اقتراحات الأسئلة الشائعة السريعة */}
            {messages.length < 3 && kbQuestions.length > 0 && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ fontSize: '11px', color: activeTheme.accentLight, fontWeight: 'bold', marginBottom: '6px' }}>
                  💡 أسئلة يمكنك الاستفسار عنها فوراً:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {kbQuestions.map((q) => (
                    <button
                      key={q._id}
                      onClick={() => handleSend(q.question)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${activeTheme.border}`,
                        color: activeTheme.textMain,
                        fontSize: '11px',
                        textAlign: 'right',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      {q.question}
                    </button>
                  ))}
                </div>
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
              borderTop: `1px solid ${activeTheme.border}`,
              backgroundColor: activeTheme.bgCard,
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
                background: 'rgba(0, 0, 0, 0.3)',
                border: `1px solid ${activeTheme.border}`,
                color: activeTheme.textMain,
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box',
                direction: 'rtl',
              }}
            />

            <button
              type="submit"
              disabled={loading || !inputMsg.trim()}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: `linear-gradient(135deg, ${activeTheme.accent} 0%, #d97706 100%)`,
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

      {/* 2. زر التفعيل العائم Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: `linear-gradient(135deg, ${activeTheme.accent} 0%, #d97706 100%)`,
          color: '#0b1622',
          border: 'none',
          padding: '12px 18px',
          borderRadius: '30px',
          fontWeight: '900',
          fontSize: '13px',
          cursor: 'pointer',
          boxShadow: '0 8px 25px rgba(245, 158, 11, 0.45)',
          transition: 'transform 0.2s ease',
        }}
      >
        <Bot size={20} />
        <span>المستشار الذكي 🤖</span>
      </button>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
