import React, { useCallback } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

export default function ScienceParticles() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <Particles
        id="science-particles"
        init={particlesInit}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'auto',
        }}
        options={{
          fullScreen: { enable: false, zIndex: 0 },
          background: {
            color: { value: 'transparent' },
          },
          fpsLimit: 60,
          interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: 'grab',
              },
              onClick: {
                enable: true,
                mode: 'push',
              },
              resize: true,
            },
            modes: {
              grab: {
                distance: 180,
                links: {
                  opacity: 0.65,
                  color: '#f59e0b',
                },
              },
              push: {
                quantity: 3,
              },
            },
          },
          particles: {
            color: {
              value: ['#f59e0b', '#38bdf8', '#34d399', '#fbbf24', '#818cf8'],
            },
            links: {
              color: '#38bdf8',
              distance: 140,
              enable: true,
              opacity: 0.22,
              width: 1.2,
            },
            move: {
              direction: 'none',
              enable: true,
              outModes: {
                default: 'bounce',
              },
              random: true,
              speed: 1.2,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 45,
            },
            opacity: {
              value: { min: 0.2, max: 0.7 },
              animation: {
                enable: true,
                speed: 0.8,
                minimumValue: 0.1,
                sync: false,
              },
            },
            shape: {
              type: 'circle',
            },
            size: {
              value: { min: 2, max: 4.5 },
            },
          },
          detectRetina: true,
        }}
      />
    </div>
  );
}
