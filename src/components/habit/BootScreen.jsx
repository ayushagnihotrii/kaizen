import React, { useState, useEffect } from 'react';

const BOOT_LINES = [
  'KAIZEN BIOS v2.0 — HABIT SYSTEM',
  'Checking memory... OK',
  'Loading React Runtime...',
  'Initializing Firebase Auth...',
  'Connecting to Cloud Sync...',
  'Loading habits from localStorage...',
  'Mounting CRT Display Driver...',
  'Starting Desktop Environment...',
];

export default function BootScreen({ onComplete }) {
  const [currentLine, setCurrentLine] = useState(0);
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const lineTimers = BOOT_LINES.map((_, i) =>
      setTimeout(() => {
        setCurrentLine(i + 1);
        setProgress(Math.round(((i + 1) / BOOT_LINES.length) * 100));
      }, 200 + i * 250)
    );

    // Start fade out after all lines
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 200 + BOOT_LINES.length * 250 + 300);

    // Complete after fade
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 200 + BOOT_LINES.length * 250 + 800);

    return () => {
      lineTimers.forEach(clearTimeout);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`boot-screen ${fadeOut ? 'fade-out' : ''}`}>
      <div style={{ width: 420, maxWidth: 'calc(100vw - 32px)' }}>
        {/* Logo */}
        <div style={{
          textAlign: 'center',
          marginBottom: 32,
        }}>
          <div style={{
            fontSize: 32,
            color: '#39FF14',
            letterSpacing: 8,
            textShadow: '0 0 10px #39FF14, 0 0 25px rgba(57,255,20,0.4)',
            fontWeight: 'bold',
          }}>
            K A I Z E N
          </div>
          <div style={{
            fontSize: 16,
            color: '#1a8c00',
            letterSpacing: 4,
            marginTop: 4,
          }}>
            改善 SYSTEM v2.0
          </div>
        </div>

        {/* Boot lines */}
        <div style={{
          background: '#000',
          border: '1px solid #1a2a1a',
          padding: '12px 16px',
          marginBottom: 16,
          minHeight: 200,
        }}>
          {BOOT_LINES.slice(0, currentLine).map((line, i) => (
            <div
              key={i}
              className="boot-line"
              style={{
                opacity: 1,
                transform: 'translateX(0)',
              }}
            >
              <span style={{ color: '#1a8c00', marginRight: 6 }}>{'>'}</span>
              {line}
              {i === 0 && (
                <span style={{ color: '#39FF14', fontWeight: 'bold' }}> ■</span>
              )}
            </div>
          ))}
          {currentLine >= BOOT_LINES.length && (
            <div className="boot-line" style={{ color: '#39FF14', fontWeight: 'bold', marginTop: 8 }}>
              <span style={{ color: '#1a8c00', marginRight: 6 }}>{'>'}</span>
              SYSTEM READY
              <span className="cursor-blink" />
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="boot-progress">
          <div
            className="boot-progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div style={{
          textAlign: 'center',
          marginTop: 8,
          fontSize: 14,
          color: '#1a8c00',
        }}>
          Loading... {progress}%
        </div>
      </div>
    </div>
  );
}
