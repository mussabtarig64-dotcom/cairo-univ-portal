import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sphere, Trail, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Atom, Sparkles, Orbit, Zap, RefreshCw, Layers, ShieldCheck, Eye } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// 1. Quantum Nucleus (Proton and Neutron Cluster)
function Nucleus({ pulseSpeed = 1 }) {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime() * pulseSpeed;
      meshRef.current.rotation.y = t * 0.4;
      meshRef.current.rotation.x = t * 0.2;
      const scale = 1 + Math.sin(t * 3) * 0.05;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  // Cluster of protons (amber) & neutrons (cyan)
  const particles = useMemo(() => {
    const arr = [];
    const count = 12;
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const r = 0.45;
      arr.push({
        position: [
          r * Math.cos(theta) * Math.sin(phi),
          r * Math.sin(theta) * Math.sin(phi),
          r * Math.cos(phi),
        ],
        isProton: i % 2 === 0,
      });
    }
    return arr;
  }, []);

  return (
    <group ref={meshRef}>
      {/* Core Glow Center */}
      <Sphere args={[0.35, 32, 32]}>
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#d97706"
          emissiveIntensity={2.5}
          roughness={0.1}
          metalness={0.8}
        />
      </Sphere>

      {/* Nucleon Cluster */}
      {particles.map((p, idx) => (
        <Sphere key={idx} args={[0.18, 16, 16]} position={p.position}>
          <meshStandardMaterial
            color={p.isProton ? '#f59e0b' : '#38bdf8'}
            emissive={p.isProton ? '#b45309' : '#0284c7'}
            emissiveIntensity={1.8}
            roughness={0.2}
            metalness={0.5}
          />
        </Sphere>
      ))}

      {/* Point Light inside Nucleus */}
      <pointLight color="#f59e0b" intensity={3} distance={5} decay={2} />
      <pointLight color="#38bdf8" intensity={2} distance={4} decay={2} />
    </group>
  );
}

// 2. Electron in Elliptical Orbit with Trail
function Electron({ radiusX = 2.2, radiusY = 1.1, speed = 2, offset = 0, color = '#38bdf8' }) {
  const electronRef = useRef();

  useFrame(({ clock }) => {
    if (electronRef.current) {
      const t = clock.getElapsedTime() * speed + offset;
      const x = Math.cos(t) * radiusX;
      const z = Math.sin(t) * radiusY;
      electronRef.current.position.set(x, 0, z);
    }
  });

  return (
    <group>
      <Trail
        width={1.2}
        length={6}
        color={new THREE.Color(color)}
        attenuation={(t) => t * t}
      >
        <mesh ref={electronRef}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={3}
            roughness={0.1}
          />
          <pointLight color={color} intensity={1.5} distance={2} decay={2} />
        </mesh>
      </Trail>
    </group>
  );
}

// 3. Orbital Ring Structure
function OrbitalRing({ rotation = [0, 0, 0], radius = 2.2, color = '#38bdf8', speed = 2, offset = 0 }) {
  const ringRef = useRef();

  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.002;
    }
  });

  return (
    <group rotation={rotation} ref={ringRef}>
      {/* 3D Torus Ring */}
      <mesh>
        <torusGeometry args={[radius, 0.015, 16, 100]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          transparent
          opacity={0.4}
          roughness={0.3}
        />
      </mesh>

      {/* Active Electron on this orbit */}
      <Electron radiusX={radius} radiusY={radius} speed={speed} offset={offset} color={color} />
    </group>
  );
}

// 4. Outer Quantum Energy Shell (Abstract Tech Atmosphere)
function QuantumAura() {
  const auraRef = useRef();

  useFrame(({ clock }) => {
    if (auraRef.current) {
      auraRef.current.rotation.y = clock.getElapsedTime() * 0.05;
      auraRef.current.rotation.x = clock.getElapsedTime() * 0.03;
    }
  });

  return (
    <group ref={auraRef}>
      <mesh>
        <icosahedronGeometry args={[3.2, 1]} />
        <meshBasicMaterial
          color="#38bdf8"
          wireframe
          transparent
          opacity={0.08}
        />
      </mesh>
    </group>
  );
}

// 5. Complete Atom Model Scene
function AtomScene({ speedMultiplier = 1 }) {
  return (
    <Float speed={1.5} rotationIntensity={0.6} floatIntensity={0.8}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} color="#38bdf8" />

      {/* Nucleus Core */}
      <Nucleus pulseSpeed={speedMultiplier} />

      {/* 3 Orbit Planes (rotated at distinct scientific angles) */}
      <OrbitalRing
        rotation={[Math.PI / 3, Math.PI / 4, 0]}
        radius={2.3}
        color="#38bdf8"
        speed={2.2 * speedMultiplier}
        offset={0}
      />
      <OrbitalRing
        rotation={[-Math.PI / 3, Math.PI / 3, 0]}
        radius={2.3}
        color="#f59e0b"
        speed={1.9 * speedMultiplier}
        offset={Math.PI / 2}
      />
      <OrbitalRing
        rotation={[0, Math.PI / 2, Math.PI / 4]}
        radius={2.3}
        color="#10b981"
        speed={2.5 * speedMultiplier}
        offset={Math.PI}
      />
      <OrbitalRing
        rotation={[Math.PI / 2, 0, -Math.PI / 6]}
        radius={2.5}
        color="#a855f7"
        speed={1.6 * speedMultiplier}
        offset={Math.PI * 1.5}
      />

      {/* Outer Quantum Field */}
      <QuantumAura />
    </Float>
  );
}

export default function ScienceAtom3D() {
  const { activeTheme } = useTheme?.() || {
    bgCard: '#09131f',
    border: 'rgba(56, 189, 248, 0.2)',
    primary: '#38bdf8',
    accent: '#f59e0b',
    textMain: '#ffffff',
    textMuted: '#94a3b8',
  };

  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [activeTab, setActiveTab] = useState('physics');

  const scienceFacts = {
    physics: {
      title: 'الفيزياء النووية والإشعاعية',
      dept: 'قسم الفيزياء',
      color: '#38bdf8',
      desc: 'دراسة استقرار النواة، ميكانيكا الكم، ومستويات الطاقة الذرية وتطبيقاتها الحديثة.',
    },
    chemistry: {
      title: 'الكيمياء الكمية والروابط',
      dept: 'قسم الكيمياء',
      color: '#f59e0b',
      desc: 'توزيع الإلكترونات في المدارات الجزيئية وسلوك التفاعلات والروابط الكيميائية.',
    },
    biotech: {
      title: 'البيوتكنولوجي والفيزياء الحيوية',
      dept: 'قسم الفيزياء الحيوية والتقنية الحيوية',
      color: '#10b981',
      desc: 'الارتباط الجزيئي، نمذجة الهياكل البروتينية، والشفرات الوراثية وتفاعلات الطاقة.',
    },
  };

  return (
    <section
      className="relative w-full max-w-7xl mx-auto my-12 px-4 sm:px-6 lg:px-8"
      dir="rtl"
    >
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(9, 19, 31, 0.95) 0%, rgba(15, 23, 42, 0.92) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '24px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), inset 0 0 30px rgba(56, 189, 248, 0.05)',
          position: 'relative',
          overflow: 'hidden',
        }}
        className="p-6 md:p-10"
      >
        {/* Glow backdrop decorative effect */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            right: '-60px',
            width: '280px',
            height: '280px',
            background: 'rgba(56, 189, 248, 0.15)',
            filter: 'blur(100px)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-60px',
            left: '-60px',
            width: '280px',
            height: '280px',
            background: 'rgba(245, 158, 11, 0.12)',
            filter: 'blur(100px)',
            pointerEvents: 'none',
          }}
        />

        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 border-b border-white/10 pb-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold mb-3">
              <Atom size={16} className="animate-spin text-sky-400" style={{ animationDuration: '8s' }} />
              <span>واحة العلوم التفاعلية ثلاثية الأبعاد (Interactive 3D Science Oasis)</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
              النموذج الذري والكمومي التفاعلي
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              استكشف ديناميكية المدارات الذرية والجسيمات الأولية التي تشكل جوهر العلوم الأساسية في كلية العلوم جامعة القاهرة.
            </p>
          </div>

          {/* Interactive Mode Tabs */}
          <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-white/10">
            {Object.entries(scienceFacts).map(([key, item]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === key
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Sparkles size={13} />
                <span>{item.dept}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3D Canvas Area & Interactive Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* 3D Atom Canvas */}
          <div
            className="lg:col-span-8 relative h-[380px] md:h-[460px] rounded-2xl overflow-hidden border border-sky-500/20 bg-slate-950/60 shadow-inner"
            style={{ touchAction: 'none' }}
          >
            <Suspense
              fallback={
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-sky-400">
                  <Atom size={36} className="animate-spin" />
                  <span className="text-xs font-bold text-slate-400">جاري تهيئة المجسم الذري...</span>
                </div>
              }
            >
              <Canvas
                camera={{ position: [0, 0, 6], fov: 50 }}
                gl={{ antialias: true, alpha: true }}
              >
                <AtomScene speedMultiplier={speedMultiplier} />
                <OrbitControls
                  enableZoom={false}
                  enablePan={false}
                  autoRotate
                  autoRotateSpeed={1.2 * speedMultiplier}
                  minPolarAngle={Math.PI / 4}
                  maxPolarAngle={(3 * Math.PI) / 4}
                />
              </Canvas>
            </Suspense>

            {/* Orbit Interaction Hint Badge */}
            <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[11px] text-slate-300 flex items-center gap-2 pointer-events-none">
              <Eye size={13} className="text-sky-400" />
              <span>اسحب لتدوير المجسم 360°</span>
            </div>

            {/* Speed Toggle Widget */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-xl border border-white/10">
              <button
                onClick={() => setSpeedMultiplier((p) => (p === 0.5 ? 1 : p === 1 ? 1.8 : 0.5))}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white/5 hover:bg-white/10 text-sky-400 flex items-center gap-1.5 transition-all"
                title="تغيير سرعة دوران الجسيمات"
              >
                <Zap size={13} />
                <span>سرعة الدوران: {speedMultiplier}x</span>
              </button>
            </div>
          </div>

          {/* Scientific Info & Quick Discovery Card */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div
              className="p-6 rounded-2xl border transition-all duration-300"
              style={{
                background: 'rgba(15, 23, 42, 0.75)',
                borderColor: scienceFacts[activeTab].color,
                boxShadow: `0 10px 30px ${scienceFacts[activeTab].color}15`,
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{
                    background: `${scienceFacts[activeTab].color}20`,
                    color: scienceFacts[activeTab].color,
                    border: `1px solid ${scienceFacts[activeTab].color}40`,
                  }}
                >
                  {scienceFacts[activeTab].dept}
                </span>
                <Orbit size={18} style={{ color: scienceFacts[activeTab].color }} />
              </div>

              <h3 className="text-lg font-bold text-white mb-2">
                {scienceFacts[activeTab].title}
              </h3>
              <p className="text-slate-300 text-xs leading-relaxed mb-4">
                {scienceFacts[activeTab].desc}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 text-[11px]">
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                  <div className="text-slate-400">النواة المركزية</div>
                  <div className="text-amber-400 font-bold mt-0.5">بروتونات + نيوترونات</div>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                  <div className="text-slate-400">المستويات الإلكترونية</div>
                  <div className="text-sky-400 font-bold mt-0.5">مدارات كمومية ثلاثية</div>
                </div>
              </div>
            </div>

            {/* Quick Pillars of Science Card */}
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-white/10">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300 mb-3">
                <Layers size={15} className="text-amber-400" />
                <span>أقسام العلوم الأساسية المترابطة:</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  <span>الفيزياء وعلوم الفضاء والمواد النانوية</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>الكيمياء البحتة، التطبيقية، والحيوية</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>البيولوجي، الجيولوجيا، والرياضيات التطبيقية</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
