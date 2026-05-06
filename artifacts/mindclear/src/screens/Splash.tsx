import { useEffect, useState } from 'react';

interface SplashProps {
  onDone: () => void;
}

export function Splash({ onDone }: SplashProps) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 1600);
    const doneTimer = setTimeout(() => onDone(), 2100);
    return () => { clearTimeout(fadeTimer); clearTimeout(doneTimer); };
  }, [onDone]);

  return (
    <div
      role="status"
      aria-label="MindClear loading"
      aria-live="polite"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(108,99,255,0.18) 0%, transparent 70%), var(--bg)',
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.5s ease',
        pointerEvents: fading ? 'none' : 'all',
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        animation: 'splashPulse 1.8s ease-in-out',
      }}>
        <div style={{
          width: '100px',
          height: '100px',
          background: '#13121e',
          borderRadius: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 0 1px rgba(108,99,255,0.25), 0 0 80px rgba(108,99,255,0.3), 0 12px 48px rgba(0,0,0,0.5)',
        }}>
          <img
            src="/logo.png"
            alt=""
            aria-hidden="true"
            style={{ width: '72px', height: '72px' }}
            draggable={false}
          />
        </div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '32px',
          fontWeight: 700,
          color: 'var(--text)',
          letterSpacing: '0.3px',
        }}>
          MindClear
        </div>
        <div style={{
          color: 'var(--text3)',
          fontSize: '14px',
          letterSpacing: '0.5px',
        }}>
          Your thoughts, organised instantly
        </div>
      </div>

      <div style={{
        position: 'absolute',
        bottom: '48px',
        display: 'flex',
        gap: '6px',
        alignItems: 'center',
      }}>
        {[0, 1, 2].map(i => (
          <div
            key={i}
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--accent)',
              opacity: 0.3 + i * 0.35,
              animation: `splashPulse ${0.9 + i * 0.15}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
