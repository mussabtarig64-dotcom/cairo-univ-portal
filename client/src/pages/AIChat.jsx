import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  Bot,
  User,
  Send,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  BookOpen,
  Compass,
  HeartHandshake,
  HelpCircle,
  Volume2,
  Languages,
  GraduationCap
} from 'lucide-react';

const SUGGESTED_PROMPTS = [
  {
    icon: '🔬',
    title: 'نصائح المعامل والمذاكرة',
    prompt: 'أنا طالب بكلية العلوم جامعة القاهرة، كيف أنظم دراستي ومذاكرة المعامل وتقارير السكاشن؟',
  },
  {
    icon: '🛂',
    title: 'الإقامة الدراسية بمصر',
    prompt: 'ما هي خطوات وإجراءات تجديد الإقامة الدراسية للطلاب السودانيين في مجمع الجيزة ومصلحة الجوازات؟',
  },
  {
    icon: '💻',
    title: 'Computer Science Curriculum',
    prompt: 'Can you explain the major subjects and skills needed for the Computer Science department at Faculty of Science?',
  },
  {
    icon: '🧪',
    title: 'معايير التشعيب والتخصصات',
    prompt: 'ما هي معايير التشعيب واختيار التخصصات (كيمياء، حاسب، ميكرو، فيزياء) بكلية العلوم وما هي مجالات العمل لكل قسم؟',
  },
];

export default function AIChat() {
  const { activeTheme } = useTheme();
  const { user } = useAuth();

  const studentName = user?.fullName || user?.name || 'زميلنا العزيز';
  const studentDept = user?.department || 'كلية العلوم';
  const studentLevel = user?.academicLevel || user?.academicYear || 'المرحلة الجامعية';

  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `مرحباً بيك يا دكتورنا **${studentName}** في كلية العلوم جامعة القاهرة! 🌿🇸🇩\nأنا رفيقك ومستشارك الأكاديمي والذكي من **رابطة الطلاب السودانيين (SSA-FS-CU)**.\n\nمعاك خطوة بخطوة في استفسارات تخصصك (**${studentDept}**)، المعامل، نظام الساعات المعتمدة، الإقامة والسكن في القاهرة، أو أي دعم دراسي تحتاجه باللغتين العربية والإنجليزية.\n\nكيف أقدر أساعدك اليوم؟ أبشر بالخير!`,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const messageText = textToSend || prompt;
    if (!messageText.trim() || loading) return;

    const newMessages = [...messages, { sender: 'user', text: messageText.trim() }];
    setMessages(newMessages);
    setPrompt('');
    setLoading(true);

    try {
      const apiEndpoint = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/chat`;
      const res = await axios.post(apiEndpoint, {
        messages: newMessages,
        studentName: studentName,
        department: studentDept,
        academicLevel: studentLevel,
      });

      if (res.data && res.data.reply) {
        setMessages((prev) => [...prev, { sender: 'ai', text: res.data.reply }]);
      } else {
        throw new Error('No reply');
      }
    } catch (err) {
      console.error('AI Error:', err.message);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `يا هلا بيك يا ${studentName}! تلقيت استفسارك وسأكون معك دائماً للمساعدة في مواد ${studentDept}. يمكنك إعادة إرسال سؤالك وسأجيبك فوراً.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleClear = () => {
    if (window.confirm('هل تود بدء جلسة استشارية جديدة ومسح المحادثة السابقة؟')) {
      setMessages([
        {
          sender: 'ai',
          text: `أهلاً بك من جديد يا **${studentName}**! مستعد للإجابة على أي سؤال دراسي أو توجيه أكاديمي تحتاجه في ${studentDept} 🏛️`,
        },
      ]);
    }
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 120px)',
        backgroundColor: activeTheme.bgDark,
        display: 'flex',
        flexDirection: 'column',
        color: activeTheme.textMain,
        direction: 'rtl',
      }}
    >
      {/* هيدر الشات */}
      <div
        style={{
          background: activeTheme.bgCard,
          borderBottom: `1px solid ${activeTheme.border}`,
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: `linear-gradient(135deg, ${activeTheme.primary} 0%, ${activeTheme.secondary} 100%)`,
              border: `1px solid ${activeTheme.accent}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: `0 4px 14px ${activeTheme.primary}40`,
            }}
          >
            <Bot size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '800', margin: 0, color: activeTheme.textMain }}>
                المستشار الأكاديمي والرفيق الذكي (AI Advisor)
              </h2>
              <span
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#34d399',
                  fontSize: '11px',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                <span>عربي / English</span>
              </span>
            </div>
            <p style={{ fontSize: '12px', color: activeTheme.accentLight, margin: '2px 0 0' }}>
              الطالب: <strong>{studentName}</strong> | القسم: <strong>{studentDept}</strong>
            </p>
          </div>
        </div>

        <button
          onClick={handleClear}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255,255,255,0.06)',
            border: `1px solid ${activeTheme.border}`,
            color: activeTheme.textMuted,
            padding: '8px 14px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '12px',
            transition: 'all 0.2s',
          }}
        >
          <RefreshCw size={13} />
          <span>محادثة جديدة</span>
        </button>
      </div>

      {/* منطقة الرسائل */}
      <div
        style={{
          flex: 1,
          maxWidth: '1050px',
          width: '100%',
          margin: '0 auto',
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          overflowY: 'auto',
        }}
      >
        {/* بطاقات الاقتراحات السريعة */}
        {messages.length <= 1 && (
          <div style={{ marginBottom: '10px' }}>
            <div style={{ fontSize: '13px', color: activeTheme.textMuted, marginBottom: '12px', fontWeight: 'bold' }}>
              💡 مواضيع وأسئلة مقترحة لتبدأ بها:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '12px' }}>
              {SUGGESTED_PROMPTS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(item.prompt)}
                  style={{
                    background: activeTheme.bgCard,
                    border: `1px solid ${activeTheme.border}`,
                    borderRadius: '12px',
                    padding: '14px',
                    textAlign: 'right',
                    cursor: 'pointer',
                    color: activeTheme.textMain,
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  }}
                >
                  <div style={{ fontSize: '20px', marginBottom: '6px' }}>{item.icon}</div>
                  <div style={{ fontWeight: 'bold', fontSize: '13px', color: activeTheme.accentLight, marginBottom: '4px' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '11px', color: activeTheme.textMuted, lineHeight: '1.4' }}>
                    {item.prompt.substring(0, 65)}...
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* عرض سجل الرسائل */}
        {messages.map((msg, index) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={index}
              style={{
                display: 'flex',
                gap: '12px',
                flexDirection: isUser ? 'row-reverse' : 'row',
                alignItems: 'flex-start',
              }}
            >
              {/* الصورة الرمزية */}
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  background: isUser
                    ? `linear-gradient(135deg, ${activeTheme.accent} 0%, ${activeTheme.accentLight} 100%)`
                    : activeTheme.bgCard,
                  border: `1px solid ${isUser ? activeTheme.accent : activeTheme.border}`,
                  color: isUser ? '#0b1622' : activeTheme.accentLight,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                }}
              >
                {isUser ? <User size={18} /> : <Bot size={20} />}
              </div>

              {/* فقاعة الرسالة */}
              <div
                style={{
                  maxWidth: '85%',
                  position: 'relative',
                  borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                  background: isUser
                    ? `linear-gradient(135deg, ${activeTheme.primary} 0%, ${activeTheme.secondary} 100%)`
                    : activeTheme.bgCard,
                  border: `1px solid ${isUser ? activeTheme.accent : activeTheme.border}`,
                  color: '#ffffff',
                  padding: '16px 20px',
                  fontSize: '14px',
                  lineHeight: '1.7',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                }}
              >
                <div className="prose prose-invert" style={{ direction: 'rtl', textAlign: 'right' }}>
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>

                {!isUser && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      marginTop: '10px',
                      paddingTop: '8px',
                      borderTop: `1px solid ${activeTheme.border}`,
                    }}
                  >
                    <button
                      onClick={() => handleCopy(msg.text, index)}
                      title="نسخ الإجابة"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: copiedIndex === index ? '#10b981' : activeTheme.textMuted,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '11px',
                      }}
                    >
                      {copiedIndex === index ? <Check size={13} /> : <Copy size={13} />}
                      <span>{copiedIndex === index ? 'تم النسخ!' : 'نسخ الإجابة'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* مؤشر جاري الكتابة */}
        {loading && (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: activeTheme.bgCard,
                border: `1px solid ${activeTheme.border}`,
                color: activeTheme.accentLight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Bot size={20} />
            </div>
            <div
              style={{
                background: activeTheme.bgCard,
                border: `1px solid ${activeTheme.border}`,
                borderRadius: '16px',
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ fontSize: '13px', color: activeTheme.accentLight }}>
                المستشار الذكي يقوم بتحليل السؤال وصياغة الإجابة...
              </span>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: activeTheme.accent, animation: 'pulse 1s infinite' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* صندوق الإدخال السفلي */}
      <div
        style={{
          background: activeTheme.bgCard,
          borderTop: `1px solid ${activeTheme.border}`,
          padding: '16px 20px',
          position: 'sticky',
          bottom: 0,
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          style={{
            maxWidth: '1050px',
            margin: '0 auto',
            display: 'flex',
            gap: '10px',
            position: 'relative',
          }}
        >
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="اكتب سؤالك الأكاديمي بالعربية أو الإنجليزية (مثال: اشرح لي كيمياء المحاليل، أو سكن الطلاب، أو CS algorithms)..."
            disabled={loading}
            style={{
              flex: 1,
              padding: '14px 20px',
              borderRadius: '12px',
              backgroundColor: activeTheme.bgDark,
              border: `1px solid ${activeTheme.border}`,
              color: '#ffffff',
              fontSize: '14px',
              outline: 'none',
              direction: 'auto',
            }}
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            style={{
              padding: '14px 24px',
              borderRadius: '12px',
              backgroundColor: activeTheme.primary,
              border: `1px solid ${activeTheme.accent}`,
              color: '#ffffff',
              fontWeight: 'bold',
              fontSize: '14px',
              cursor: loading || !prompt.trim() ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: `0 4px 15px ${activeTheme.primary}40`,
              opacity: loading || !prompt.trim() ? 0.6 : 1,
            }}
          >
            <Send size={16} />
            <span>إرسال</span>
          </button>
        </form>
      </div>
    </div>
  );
}