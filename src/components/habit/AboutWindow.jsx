import React from 'react';

export default function AboutWindow() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'center' }}>
      {/* Logo */}
      <div style={{ padding: '16px 0' }}>
        <img
          src="/logo.jpg"
          alt="Kaizen"
          style={{
            width: 80,
            height: 80,
            borderRadius: 8,
            margin: '0 auto 8px',
            display: 'block',
            border: '2px solid #00FF41',
            boxShadow: '0 0 12px rgba(0,255,65,0.3)',
          }}
        />
        <div className="about-logo">KAIZEN 改善</div>
        <div style={{ fontSize: 14, color: '#1a8c00', marginTop: 4 }}>
          VERSION 2.0.0 BUILD 98
        </div>
      </div>

      {/* Divider */}
      <div style={{
        height: 1,
        background: '#1a2a1a',
        margin: '0 20px',
      }} />

      {/* Info */}
      <div className="terminal-box" style={{ textAlign: 'left', fontSize: 14, lineHeight: 1.5 }}>
{`╔══════════════════════════════════════╗
║    KAIZEN 改善 SYSTEM v2.0            ║
║                                      ║
║    Retro-Futuristic Habit &           ║
║    Task Tracking System              ║
║    with Windows 98 Aesthetics        ║
║                                      ║
║    Built with:                       ║
║    ├─ React.js + Vite                ║
║    ├─ Firebase Auth & Firestore      ║
║    ├─ Tailwind CSS                   ║
║    └─ react-draggable                ║
║                                      ║
║    © 2026 KAIZEN SYSTEM               ║
║    ALL RIGHTS RESERVED               ║
║                                      ║
║    "改善 - CONTINUOUS                  ║
║     IMPROVEMENT."                    ║
║                                      ║
╚══════════════════════════════════════╝`}
      </div>

      <button className="bevel-button" style={{ alignSelf: 'center', minWidth: 100 }}>
        OK
      </button>
    </div>
  );
}
