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

            <button
              onClick={() => setIsOpen(false)}
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

            {/* اقتراحات الأسئلة الشائعة السريعة */}
            {messages.length < 3 && kbQuestions.length > 0 && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 'bold', marginBottom: '6px' }}>
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
                        background: '#1e293b',
                        border: '1px solid #334155',
                        color: '#cbd5e1',
                        fontSize: '12px',
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

      {/* 2. زر التفعيل العائم Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="floating-ai-btn"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: '#0b1622',
          border: 'none',
          borderRadius: '30px',
          fontWeight: '900',
          cursor: 'pointer',
          boxShadow: '0 8px 25px rgba(245, 158, 11, 0.45)',
          transition: 'transform 0.2s ease',
        }}
      >
        <Bot size={18} />
        <span className="floating-ai-label">المستشار الذكي 🤖</span>
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

        /* Desktop Positioning */
        @media (min-width: 641px) {
          .floating-ai-container {
            bottom: 24px;
            left: 24px;
          }
          .floating-ai-btn {
            padding: 12px 18px;
            font-size: 13px;
          }
          .floating-ai-window {
            bottom: 65px;
            left: 0;
            width: 380px;
            height: 520px;
          }
        }

        /* Mobile Positioning: bottom-2 left-2 (8px), scale-75, z-index 20 */
        @media (max-width: 640px) {
          .floating-ai-container {
            bottom: 8px !important; /* bottom-2 */
            left: 8px !important;   /* left-2 */
            z-index: 20 !important; /* z-20 */
            transform: scale(0.75); /* scale-75 */
            transform-origin: bottom left;
          }
          .floating-ai-btn {
            padding: 8px 12px;
            font-size: 11px;
            box-shadow: 0 4px 15px rgba(245, 158, 11, 0.35);
          }
          .floating-ai-label {
            font-size: 11px;
          }
          .floating-ai-window {
            bottom: 50px;
            left: 0;
            width: calc(100vw - 20px);
            height: 440px;
            max-height: calc(100vh - 80px);
            z-index: 35 !important;
          }
        }
      `}</style>
    </div>
  );
}
