import React from 'react';

export default function AboutWindow() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'center' }}>
      {/* Logo */}
      <div style={{ padding: '16px 0' }}>
        <div className="about-logo">HABIT.SYS</div>
        <div style={{ fontSize: 14, color: '#808080', marginTop: 4 }}>
          VERSION 1.0.0 BUILD 98
        </div>
      </div>

      {/* Divider */}
      <div style={{
        height: 2,
        borderTop: '1px solid #808080',
        borderBottom: '1px solid #FFFFFF',
        margin: '0 20px',
      }} />

      {/* Info */}
      <div className="terminal-box" style={{ textAlign: 'left', fontSize: 14, lineHeight: 1.5 }}>
{`╔══════════════════════════════════════╗
║    HABIT TRACKER SYSTEM v1.0         ║
║                                      ║
║    Retro-Futuristic Habit Tracking   ║
║    with Windows 98 Aesthetics        ║
║                                      ║
║    Built with:                       ║
║    ├─ React.js                       ║
║    ├─ Tailwind CSS                   ║
║    ├─ react-draggable                ║
║    └─ localStorage API               ║
║                                      ║
║    © 2026 HABIT SYSTEM               ║
║    ALL RIGHTS RESERVED               ║
║                                      ║
║    "TRACK YOUR HABITS.               ║
║     BUILD YOUR FUTURE."              ║
║                                      ║
╚══════════════════════════════════════╝`}
      </div>

      <button className="bevel-button" style={{ alignSelf: 'center', minWidth: 100 }}>
        OK
      </button>
    </div>
  );
}
