import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Volume2, VolumeX, Sparkles, Moon, Sun, Wind, RefreshCw, Eye } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

/**
 * 3D Relaxing Water Fountain Canvas (Zen Student Oasis)
 * Lightweight, hardware-accelerated 3D projection engine with realistic water physics,
 * glowing point light illumination, and interactive orbit controls.
 */
function Fountain3DCanvas({ isNightMode = true }) {
  const canvasRef = useRef(null);
  const rotationRef = useRef({ x: 0.35, y: 0 });
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // 1. Water Particles System (80 Parabolic Ballistic Droplets)
    const particleCount = 85;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.4 + Math.random() * 0.9;
      particles.push({
        x: 0,
        y: -1.2, // Spout height
        z: 0,
        vx: Math.cos(angle) * speed * 0.8,
        vy: 2.4 + Math.random() * 1.4, // Upward initial velocity
        vz: Math.sin(angle) * speed * 0.8,
        life: Math.random() * 2.0,
        maxLife: 1.8 + Math.random() * 0.8,
        size: 2.2 + Math.random() * 2.5,
        alpha: 0.8 + Math.random() * 0.2,
      });
    }

    // 2. 3D 3D Object Hierarchy: Fountain Basins, Pedestal, Spout, Ripples
    const createCylinderRings = (radius, y, segments = 28) => {
      const pts = [];
      for (let i = 0; i < segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        pts.push({
          x: Math.cos(theta) * radius,
          y: y,
          z: Math.sin(theta) * radius,
        });
      }
      return pts;
    };

    const tiers = [
      // Base Basin
      { radius: 2.2, y: 1.1, thickness: 0.35, color: isNightMode ? '#1e293b' : '#475569', type: 'basin' },
      { radius: 2.05, y: 0.95, thickness: 0.05, color: isNightMode ? '#0284c7' : '#38bdf8', type: 'water' },
      // Pedestal
      { radius: 0.45, y: 0.35, thickness: 0.65, color: isNightMode ? '#334155' : '#64748b', type: 'pedestal' },
      // Upper Basin
      { radius: 1.15, y: -0.35, thickness: 0.28, color: isNightMode ? '#1e293b' : '#475569', type: 'basin' },
      { radius: 1.05, y: -0.48, thickness: 0.05, color: isNightMode ? '#0284c7' : '#38bdf8', type: 'water' },
      // Central Spout Pillar
      { radius: 0.22, y: -0.9, thickness: 0.45, color: isNightMode ? '#0ea5e9' : '#0284c7', type: 'spout' },
    ];

    let time = 0;

    // 3. 3D Perspective Projection Function
    const project = (p, rotX, rotY, scale = 75) => {
      // Rotate Y
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const x1 = p.x * cosY + p.z * sinY;
      const z1 = -p.x * sinY + p.z * cosY;

      // Rotate X
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const y2 = p.y * cosX - z1 * sinX;
      const z2 = p.y * sinX + z1 * cosX;

      const cameraDistance = 7.5;
      const distance = cameraDistance + z2;
      const fov = 450;
      const f = distance > 0.1 ? fov / distance : 0;

      return {
        x: width / 2 + x1 * f,
        y: height / 2 + y2 * f,
        z: z2,
        scale: f / 60,
      };
    };

    // 4. Render Loop
    const render = () => {
      time += 0.02;

      // Auto-rotation when not dragging
      if (!isDraggingRef.current) {
        rotationRef.current.y += 0.007;
      }

      ctx.clearRect(0, 0, width, height);

      const rotX = rotationRef.current.x;
      const rotY = rotationRef.current.y;

      // Glowing Ambient Fountain Core Light
      const glowPoint = project({ x: 0, y: -1.2, z: 0 }, rotX, rotY);
      const glowPulse = Math.sin(time * 3) * 15 + 65;
      const glowGrad = ctx.createRadialGradient(
        glowPoint.x,
        glowPoint.y,
        5,
        glowPoint.x,
        glowPoint.y,
        glowPulse * glowPoint.scale
      );
      glowGrad.addColorStop(0, isNightMode ? 'rgba(56, 189, 248, 0.55)' : 'rgba(14, 165, 233, 0.45)');
      glowGrad.addColorStop(0.5, isNightMode ? 'rgba(2, 132, 199, 0.2)' : 'rgba(56, 189, 248, 0.15)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(glowPoint.x, glowPoint.y, glowPulse * glowPoint.scale, 0, Math.PI * 2);
      ctx.fill();

      // Draw Tiered Basins and Structures (Sorted by Depth)
      tiers.forEach((tier) => {
        const topPts = createCylinderRings(tier.radius, tier.y, 32);
        const botPts = createCylinderRings(tier.radius * 0.92, tier.y + tier.thickness, 32);

        const projTop = topPts.map((pt) => project(pt, rotX, rotY));
        const projBot = botPts.map((pt) => project(pt, rotX, rotY));

        // Draw Cylinder Body
        ctx.beginPath();
        ctx.moveTo(projTop[0].x, projTop[0].y);
        for (let i = 1; i < projTop.length; i++) {
          ctx.lineTo(projTop[i].x, projTop[i].y);
        }
        ctx.closePath();

        if (tier.type === 'water') {
          ctx.fillStyle = isNightMode ? 'rgba(2, 132, 199, 0.85)' : 'rgba(56, 189, 248, 0.85)';
          ctx.fill();
          ctx.strokeStyle = isNightMode ? 'rgba(56, 189, 248, 0.7)' : 'rgba(255, 255, 255, 0.8)';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Concentric animated water ripples
          const rippleRadius = (tier.radius * (0.4 + (Math.sin(time * 2) * 0.1 + 0.1))) * (width / 750);
          const centerProj = project({ x: 0, y: tier.y, z: 0 }, rotX, rotY);
          ctx.beginPath();
          ctx.ellipse(centerProj.x, centerProj.y, rippleRadius * 28, rippleRadius * 14 * Math.sin(rotX), 0, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 1;
          ctx.stroke();
        } else {
          ctx.fillStyle = tier.color;
          ctx.fill();
          ctx.strokeStyle = isNightMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.15)';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        // Draw depth side profile
        ctx.beginPath();
        for (let i = 0; i < projTop.length; i++) {
          const next = (i + 1) % projTop.length;
          if (projTop[i].z < 0) {
            ctx.moveTo(projTop[i].x, projTop[i].y);
            ctx.lineTo(projTop[next].x, projTop[next].y);
            ctx.lineTo(projBot[next].x, projBot[next].y);
            ctx.lineTo(projBot[i].x, projBot[i].y);
          }
        }
        ctx.fillStyle = isNightMode ? 'rgba(15, 23, 42, 0.75)' : 'rgba(51, 65, 85, 0.6)';
        ctx.fill();
      });

      // 5. Update and Render Water Droplets
      const gravity = 4.2;
      const dt = 0.016;

      particles.forEach((p) => {
        p.life += dt;
        if (p.life >= p.maxLife || p.y > 1.0) {
          p.life = 0;
          p.x = (Math.random() - 0.5) * 0.06;
          p.y = -1.25;
          p.z = (Math.random() - 0.5) * 0.06;

          const angle = Math.random() * Math.PI * 2;
          const spread = 0.45 + Math.random() * 0.95;
          p.vx = Math.cos(angle) * spread;
          p.vy = - (2.2 + Math.random() * 1.5); // shoot upwards in inverted coordinate system
          p.vz = Math.sin(angle) * spread;
        } else {
          p.vy += gravity * dt;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.z += p.vz * dt;
        }

        const proj = project(p, rotX, rotY);
        const radius = Math.max(1, p.size * proj.scale);

        // Glowing water droplet
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = isNightMode ? 'rgba(125, 211, 252, 0.9)' : 'rgba(2, 132, 199, 0.85)';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Top Crystal Spout Nozzle Light
      const spoutProj = project({ x: 0, y: -1.25, z: 0 }, rotX, rotY);
      ctx.beginPath();
      ctx.arc(spoutProj.x, spoutProj.y, 6 * spoutProj.scale, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // 6. Interactive Drag & Touch Orbit Listeners
    const handleMouseDown = (e) => {
      isDraggingRef.current = true;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };

      rotationRef.current.y += dx * 0.008;
      rotationRef.current.x = Math.max(0.15, Math.min(0.75, rotationRef.current.x + dy * 0.005));
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchMove = (e) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - lastMousePosRef.current.x;
      const dy = e.touches[0].clientY - lastMousePosRef.current.y;
      lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

      rotationRef.current.y += dx * 0.008;
      rotationRef.current.x = Math.max(0.15, Math.min(0.75, rotationRef.current.x + dy * 0.005));
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isNightMode]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        cursor: 'grab',
        touchAction: 'none',
      }}
    />
  );
}

/**
 * Fallback Loader
 */
function FountainLoader() {
  return (
    <div
      style={{
        width: '100%',
        height: '340px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle, rgba(14, 165, 233, 0.1) 0%, rgba(11, 19, 43, 0.5) 100%)',
        borderRadius: '20px',
        color: '#38bdf8',
        gap: '12px',
      }}
    >
      <div
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          border: '3px solid rgba(56, 189, 248, 0.2)',
          borderTopColor: '#38bdf8',
          animation: 'spin 1s linear infinite',
        }}
      />
      <div style={{ fontSize: '13px', fontWeight: 'bold' }}>
        جاري تهيئة واحة الهدوء والنافورة الذكية...
      </div>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/**
 * Main Zen 3D Water Fountain Component
 */
export default function RelaxingFountain3D() {
  const { activeTheme } = useTheme();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isNightMode, setIsNightMode] = useState(true);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const audioCtxRef = useRef(null);

  const quotes = [
    '🌿 "استرخِ لدقيقة، خذ نفساً عميقاً، واستعد طاقتك الإيجابية لمواصلة التفوق الأكاديمي."',
    '💧 "الهدوء النفسي والتركيز يصنعان أعظم الإنجازات والدرجات العالية."',
    '✨ "كل خطوة في دراستك تقربك من مستقبلك المشرق.. استمتع بالرحلة."',
    '🌊 "العلم نهر متدفق، والراحة الذهنية هي التي تصفي فكرك لتنهل منه بإبداع."',
  ];

  // Synthesized Calm Water Stream Sound using Web Audio API (Zero external network dependencies)
  const toggleWaterAudio = () => {
    try {
      if (isPlayingAudio) {
        if (audioCtxRef.current) {
          audioCtxRef.current.close();
          audioCtxRef.current = null;
        }
        setIsPlayingAudio(false);
      } else {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        // Pink noise buffer for soothing natural water stream
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
          b6 = white * 0.115926;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        // Lowpass filter for water warmth
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 620;

        // Modulating LFO for bubbling gentle rhythm
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.45;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 160;
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.01, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + 1.2);

        whiteNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        whiteNoise.start();
        setIsPlayingAudio(true);
      }
    } catch (e) {
      console.warn('AudioContext error:', e);
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <section
      style={{
        maxWidth: '1200px',
        margin: '50px auto 30px',
        padding: '0 20px',
        direction: 'rtl',
      }}
    >
      <div
        style={{
          background: isNightMode
            ? 'linear-gradient(135deg, rgba(11, 19, 43, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)'
            : 'linear-gradient(135deg, rgba(240, 249, 255, 0.95) 0%, rgba(224, 242, 254, 0.95) 100%)',
          border: `1px solid ${isNightMode ? 'rgba(56, 189, 248, 0.25)' : 'rgba(14, 165, 233, 0.3)'}`,
          borderRadius: '24px',
          padding: '28px 24px',
          boxShadow: isNightMode
            ? '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 35px rgba(56, 189, 248, 0.12)'
            : '0 15px 35px rgba(14, 165, 233, 0.15)',
          overflow: 'hidden',
          position: 'relative',
          transition: 'all 0.4s ease',
        }}
      >
        {/* Header and Controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '20px',
            borderBottom: `1px solid ${isNightMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
            paddingBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)',
              }}
            >
              <Wind size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2
                  style={{
                    fontSize: '20px',
                    fontWeight: '900',
                    margin: 0,
                    color: isNightMode ? '#ffffff' : '#0f172a',
                  }}
                >
                  واحة الهدوء والنافورة الذكية (Zen Student Oasis)
                </h2>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 'bold',
                    padding: '3px 8px',
                    borderRadius: '8px',
                    background: 'rgba(56, 189, 248, 0.18)',
                    color: '#38bdf8',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                  }}
                >
                  3D Interactive
                </span>
              </div>
              <p
                style={{
                  fontSize: '13px',
                  color: isNightMode ? '#94a3b8' : '#64748b',
                  margin: '4px 0 0',
                }}
              >
                مساحة تفاعلية مريحة للأعصاب لتقليل التوتر واستعادة النشاط والتركيز أثناء المذاكرة 🧘‍♂️
              </p>
            </div>
          </div>

          {/* Interactive Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* Audio Toggle */}
            <button
              onClick={toggleWaterAudio}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                background: isPlayingAudio
                  ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)'
                  : isNightMode
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 0, 0, 0.05)',
                color: isPlayingAudio ? '#ffffff' : isNightMode ? '#cbd5e1' : '#334155',
                border: isPlayingAudio
                  ? '1px solid #38bdf8'
                  : `1px solid ${isNightMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)'}`,
                boxShadow: isPlayingAudio ? '0 0 16px rgba(56, 189, 248, 0.4)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              {isPlayingAudio ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span>{isPlayingAudio ? 'صوت المياه (يعمل)' : 'تفعيل خرير المياه 🎧'}</span>
            </button>

            {/* Lighting Mode Toggle */}
            <button
              onClick={() => setIsNightMode(!isNightMode)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                background: isNightMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
                color: isNightMode ? '#fbbf24' : '#0284c7',
                border: `1px solid ${isNightMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)'}`,
                transition: 'all 0.2s',
              }}
            >
              {isNightMode ? <Moon size={16} /> : <Sun size={16} />}
              <span>{isNightMode ? 'الإضاءة الليلية' : 'الإضاءة النهارية'}</span>
            </button>

            {/* Change Quote Button */}
            <button
              onClick={() => setQuoteIndex((prev) => (prev + 1) % quotes.length)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                cursor: 'pointer',
                background: isNightMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
                color: isNightMode ? '#94a3b8' : '#64748b',
                border: `1px solid ${isNightMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)'}`,
              }}
              title="تغيير العبارة التحفيزية"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {/* 3D Canvas Canvas Container */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '340px',
            borderRadius: '18px',
            overflow: 'hidden',
            background: isNightMode
              ? 'radial-gradient(circle at center, #0c1938 0%, #050b18 100%)'
              : 'radial-gradient(circle at center, #e0f2fe 0%, #bae6fd 100%)',
            border: `1px solid ${isNightMode ? 'rgba(56, 189, 248, 0.15)' : 'rgba(14, 165, 233, 0.2)'}`,
          }}
        >
          <Suspense fallback={<FountainLoader />}>
            <Fountain3DCanvas isNightMode={isNightMode} />
          </Suspense>

          {/* Interactive Drag Hint */}
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '16px',
              background: 'rgba(0, 0, 0, 0.55)',
              backdropFilter: 'blur(8px)',
              padding: '5px 12px',
              borderRadius: '8px',
              fontSize: '11px',
              color: '#e2e8f0',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>🔄 يمكنك تدوير النافورة 3D بالسحب واللمس</span>
          </div>
        </div>

        {/* Motivational Zen Mindful Quote Banner */}
        <div
          style={{
            marginTop: '16px',
            background: isNightMode ? 'rgba(56, 189, 248, 0.08)' : 'rgba(14, 165, 233, 0.1)',
            border: `1px solid ${isNightMode ? 'rgba(56, 189, 248, 0.2)' : 'rgba(14, 165, 233, 0.25)'}`,
            borderRadius: '14px',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={18} color="#38bdf8" />
            <span
              style={{
                fontSize: '13px',
                fontWeight: '600',
                color: isNightMode ? '#e2e8f0' : '#0369a1',
                lineHeight: '1.6',
              }}
            >
              {quotes[quoteIndex]}
            </span>
          </div>
          <button
            onClick={() => setQuoteIndex((prev) => (prev + 1) % quotes.length)}
            style={{
              background: 'none',
              border: 'none',
              color: '#38bdf8',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            عبارة أخرى ↺
          </button>
        </div>
      </div>
    </section>
  );
}
