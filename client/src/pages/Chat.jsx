import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  MessageSquare,
  Send,
  Sparkles,
  User,
  Clock,
  BookOpen,
  Compass,
  FileText,
  MapPin,
  Shield,
  HelpCircle,
  GraduationCap,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

let socket = null;
try {
  socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', { reconnectionAttempts: 3 });
} catch (e) {
  console.log('Socket init note:', e.message);
}

const AVAILABLE_ROOMS = [
  { id: 'general', name: '📢 غرفة الحوار والنقاش العام', desc: 'ملتقى عام لجميع طلاب الرابطة' },
  { id: 'freshmen', name: '🌟 ملتقى واستقبال الطلاب الجدد', desc: 'إرشادات ونصائح خاصة بالمستجدين' },
  { id: 'housing', name: '🏠 شؤون السكن والإقامة بمصر', desc: 'البحث عن سكن وتجديد الإقامات' },
  { id: 'cs', name: '💻 علوم الحاسب والمعلومات', desc: 'برمجة، خوارزميات، ومشاريع' },
  { id: 'chemistry', name: '🧪 الكيمياء والكيمياء الحيوية', desc: 'معامل، تفاعلات، ومذكرات' },
  { id: 'physics', name: '⚡ الفيزياء والرياضيات', desc: 'مسائل ونظريات علمية' },
  { id: 'biology', name: '🌿 علوم الحياة والأحياء المجهرية', desc: 'نبات، حيوان، وميكرو' },
];

const FRESHMEN_GUIDE = [
  {
    title: '🛂 1. إجراءات وتجديد الإقامة الدراسية بمصر',
    content: `
- **الخطوة الأولى**: استخراج إفادة قيد موجهة إلى مصلحة الجوازات والهجرة من إدارة شؤون الطلاب بكلية العلوم.
- **الخطوة الثانية**: التوجه إلى مجمع الجوازات المختص (مجمع الجيزة أو مجمع العباسية).
- **المستندات المطلوبة**: أصل وصور الجواز، صور شخصية، عقد إيجار موثق بالشهر العقاري، وإيصال سداد الرسوم.
- **نصيحة الرابطة**: ابدأ إجراءاتك قبل انتهاء التأشيرة أو الإقامة الحالية بـ 30 يوماً على الأقل.
    `,
  },
  {
    title: '🏠 2. أفضل أماكن السكن للطلاب بالقرب من جامعة القاهرة',
    content: `
- **الدقي والمهندسين**: الأقرب لبوابة الكلية (5 دقائق بالمواصلات أو محطة مترو جامعة القاهرة/الدقي)، خدمات ممتازة وأمان.
- **بين السرايات**: ملاصقة تماماً لسور كلية العلوم، توفر الوقت وتناسب الطلاب الراغبين في القرب الشديد من المعامل.
- **شارع فيصل والهرم**: خيار اقتصادي ومناسب جداً للطلاب، ومواصلات مباشرة إلى بوابة الجامعة.
    `,
  },
  {
    title: '📑 3. معادلة الشهادة السودانية والوثائق الرسمية',
    content: `
- توثيق الشهادة الثانوية من وزارة الخارجية والسفارة المصرية.
- التوجه إلى مكتب تنسيق الوافدين (موقع ادرس في مصر) لاستكمال القيد النهائي واستلام إفادة الترشيح.
- تقديم ملفك الورقي لشؤون طلاب كلية العلوم لاستلام الكارنيه الجامعي.
    `,
  },
  {
    title: '🏛️ 4. نظام الساعات المعتمدة وحساب المعدل التراكمي (GPA)',
    content: `
- تعتمد كلية العلوم نظام الساعات المعتمدة (Credit Hours).
- المستوى الأول (إعدادي): دراسة مقررات تأسيسية (كيمياء، فيزياء، رياضيات، أحياء أو حاسب) قبل التشعيب.
- احرص على حضور سكاشن المعامل أسبوعياً؛ لأن درجات العملي تمثل وزناً كبيراً في التقدير النهائي.
    `,
  },
];

export default function Chat() {
  const { activeTheme } = useTheme();
  const { user } = useAuth();

  const [currentRoom, setCurrentRoom] = useState('general');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [activeGuideIndex, setActiveGuideIndex] = useState(0);
  const [showGuide, setShowGuide] = useState(false);
  const chatScrollRef = useRef(null);

  useEffect(() => {
    if (socket) {
      socket.emit('join_room', currentRoom);

      const handleReceive = (data) => {
        if (data.room === currentRoom) {
          setMessages((prev) => [...prev, data]);
        }
      };

      socket.on('receive_message', handleReceive);
      return () => {
        socket.off('receive_message', handleReceive);
      };
    }
  }, [currentRoom]);

  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const senderName = user?.fullName || user?.name || 'طالب بكلية العلوم';
    const msgData = {
      room: currentRoom,
      sender: senderName,
      text: message.trim(),
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };

    if (socket && socket.connected) {
      socket.emit('send_message', msgData);
    }
    setMessages((prev) => [...prev, msgData]);
    setMessage('');
  };

  const activeRoomObj = AVAILABLE_ROOMS.find((r) => r.id === currentRoom);

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 120px)',
        backgroundColor: activeTheme.bgDark,
        padding: '24px 20px',
        color: activeTheme.textMain,
        direction: 'rtl',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* قسم دليل الطلاب المستجدين (قابلة للطي) */}
        <div
          style={{
            background: activeTheme.bgCard,
            border: `1px solid ${activeTheme.border}`,
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
          }}
        >
          <div
            onClick={() => setShowGuide(!showGuide)}
            style={{
              padding: '16px 20px',
              background: `linear-gradient(135deg, ${activeTheme.primary} 0%, ${activeTheme.secondary} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <GraduationCap size={22} color={activeTheme.accentLight} />
              <div>
                <strong style={{ color: '#ffffff', fontSize: '15px' }}>
                  دليل الطالب المستجد واستقبال الجدد (Freshmen Guide)
                </strong>
                <span style={{ fontSize: '12px', color: activeTheme.accentLight, display: 'block' }}>
                  اضغط هنا لعرض إجراءات الإقامة، السكن، المعادلة، ومعامل كلية العلوم
                </span>
              </div>
            </div>
            {showGuide ? <ChevronUp size={20} color="#fff" /> : <ChevronDown size={20} color="#fff" />}
          </div>

          {showGuide && (
            <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
              {FRESHMEN_GUIDE.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(0, 0, 0, 0.25)',
                    border: `1px solid ${activeTheme.border}`,
                    borderRadius: '12px',
                    padding: '16px',
                  }}
                >
                  <h4 style={{ color: activeTheme.accentLight, fontSize: '14px', margin: '0 0 10px', fontWeight: 'bold' }}>
                    {item.title}
                  </h4>
                  <div style={{ color: activeTheme.textMain, fontSize: '12px', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                    {item.content.trim()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* الشات المباشر وغرف المذاكرة */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {/* قائمة الغرف */}
          <div
            style={{
              backgroundColor: activeTheme.bgCard,
              border: `1px solid ${activeTheme.border}`,
              borderRadius: '16px',
              padding: '20px',
              height: 'fit-content',
            }}
          >
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', margin: '0 0 14px', color: activeTheme.accentLight, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} />
              <span>غرف المذاكرة والتواصل المباشر</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {AVAILABLE_ROOMS.map((room) => {
                const isCurrent = currentRoom === room.id;
                return (
                  <button
                    key={room.id}
                    onClick={() => {
                      setCurrentRoom(room.id);
                      setMessages([]);
                    }}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      textAlign: 'right',
                      backgroundColor: isCurrent ? activeTheme.primary : 'rgba(0, 0, 0, 0.25)',
                      border: `1px solid ${isCurrent ? activeTheme.accent : activeTheme.border}`,
                      color: isCurrent ? '#ffffff' : activeTheme.textMain,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ fontWeight: isCurrent ? 'bold' : '600', fontSize: '13px' }}>{room.name}</div>
                    <div style={{ fontSize: '11px', color: isCurrent ? 'rgba(255,255,255,0.8)' : activeTheme.textMuted, marginTop: '3px' }}>
                      {room.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* شاشة المحادثة الحية */}
          <div
            style={{
              gridColumn: 'span 2',
              backgroundColor: activeTheme.bgCard,
              border: `1px solid ${activeTheme.border}`,
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '540px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
            }}
          >
            {/* هيدر الغرفة */}
            <div
              style={{
                background: `linear-gradient(135deg, ${activeTheme.primary} 0%, ${activeTheme.secondary} 100%)`,
                padding: '16px 20px',
                borderBottom: `1px solid ${activeTheme.border}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>
                  {activeRoomObj?.name}
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: activeTheme.accentLight }}>
                  {activeRoomObj?.desc}
                </p>
              </div>
              <div style={{ fontSize: '12px', color: '#ffffff', background: 'rgba(0,0,0,0.25)', padding: '4px 10px', borderRadius: '8px' }}>
                المتحدث: <strong>{user?.fullName || user?.name || 'عضو الرابطة'}</strong>
              </div>
            </div>

            {/* سجل الرسائل */}
            <div
              style={{
                flex: 1,
                padding: '20px',
                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                maxHeight: '420px',
              }}
            >
              {messages.length === 0 ? (
                <div style={{ textAlign: 'center', color: activeTheme.textMuted, margin: 'auto', padding: '40px' }}>
                  <MessageSquare size={36} color={activeTheme.accentLight} style={{ marginBottom: '10px' }} />
                  <div style={{ fontWeight: 'bold', fontSize: '14px' }}>غرفة الدردشة والتواصل جاهزة</div>
                  <div style={{ fontSize: '12px', marginTop: '4px' }}>شارك زملاءك بطرح سؤال أو استفسار أو تبادل خبراتك!</div>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isMe = msg.sender === (user?.fullName || user?.name);
                  return (
                    <div
                      key={idx}
                      style={{
                        alignSelf: isMe ? 'flex-start' : 'flex-end',
                        maxWidth: '75%',
                      }}
                    >
                      <div style={{ fontSize: '11px', color: activeTheme.textMuted, marginBottom: '2px', textAlign: isMe ? 'right' : 'left' }}>
                        {msg.sender} • {msg.time}
                      </div>
                      <div
                        style={{
                          backgroundColor: isMe ? activeTheme.primary : activeTheme.bgCard,
                          border: `1px solid ${isMe ? activeTheme.accent : activeTheme.border}`,
                          color: '#ffffff',
                          padding: '10px 14px',
                          borderRadius: isMe ? '12px 2px 12px 12px' : '2px 12px 12px 12px',
                          fontSize: '13px',
                          lineHeight: '1.5',
                        }}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatScrollRef} />
            </div>

            {/* صندوق الإرسال */}
            <form
              onSubmit={sendMessage}
              style={{
                padding: '16px 20px',
                backgroundColor: activeTheme.bgCard,
                borderTop: `1px solid ${activeTheme.border}`,
                display: 'flex',
                gap: '10px',
              }}
            >
              <input
                type="text"
                placeholder="اكتب رسالتك أو استفسارك هنا..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  border: `1px solid ${activeTheme.border}`,
                  color: '#fff',
                  outline: 'none',
                  fontSize: '13px',
                  direction: 'rtl',
                }}
              />
              <button
                type="submit"
                disabled={!message.trim()}
                style={{
                  padding: '12px 22px',
                  borderRadius: '10px',
                  backgroundColor: activeTheme.primary,
                  border: `1px solid ${activeTheme.accent}`,
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  cursor: message.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  opacity: message.trim() ? 1 : 0.6,
                }}
              >
                <Send size={15} />
                <span>إرسال</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}