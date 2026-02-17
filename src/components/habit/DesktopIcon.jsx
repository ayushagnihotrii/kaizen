import React from 'react';

// Pixel-art style SVG icons for each desktop item
const ICONS = {
  tasks: (
    <svg viewBox="0 0 32 32" width="52" height="52" style={{ imageRendering: 'pixelated' }}>
      <rect x="3" y="2" width="26" height="28" fill="#0d1b2a" stroke="#33FF00" strokeWidth="1.5"/>
      <rect x="3" y="2" width="26" height="5" fill="#000080"/>
      <text x="16" y="6" textAnchor="middle" fontSize="4" fill="#39FF14" fontFamily="monospace" fontWeight="bold">TASKS</text>
      <rect x="7" y="10" width="4" height="4" fill="#39FF14" stroke="#39FF14" strokeWidth="0.5"/>
      <line x1="14" y1="12" x2="26" y2="12" stroke="#39FF14" strokeWidth="1.2"/>
      <rect x="7" y="16" width="4" height="4" fill="transparent" stroke="#39FF14" strokeWidth="0.8"/>
      <line x1="14" y1="18" x2="26" y2="18" stroke="#39FF14" strokeWidth="1.2"/>
      <rect x="7" y="22" width="4" height="4" fill="transparent" stroke="#39FF14" strokeWidth="0.8"/>
      <line x1="14" y1="24" x2="26" y2="24" stroke="#39FF14" strokeWidth="1.2"/>
    </svg>
  ),
  activity: (
    <svg viewBox="0 0 32 32" width="52" height="52" style={{ imageRendering: 'pixelated' }}>
      <rect x="2" y="2" width="28" height="28" fill="#0d1b2a" stroke="#39FF14" strokeWidth="1.5"/>
      <rect x="2" y="2" width="28" height="5" fill="#000080"/>
      <text x="16" y="6" textAnchor="middle" fontSize="4" fill="#39FF14" fontFamily="monospace" fontWeight="bold">CAL</text>
      <rect x="5" y="10" width="5" height="4" fill="#0a6600" stroke="#0d1b2a" strokeWidth="0.5"/>
      <rect x="11" y="10" width="5" height="4" fill="#1a8c00" stroke="#0d1b2a" strokeWidth="0.5"/>
      <rect x="17" y="10" width="5" height="4" fill="#39FF14" stroke="#0d1b2a" strokeWidth="0.5"/>
      <rect x="23" y="10" width="5" height="4" fill="#1a1a2e" stroke="#0d1b2a" strokeWidth="0.5"/>
      <rect x="5" y="15" width="5" height="4" fill="#1a1a2e" stroke="#0d1b2a" strokeWidth="0.5"/>
      <rect x="11" y="15" width="5" height="4" fill="#0a6600" stroke="#0d1b2a" strokeWidth="0.5"/>
      <rect x="17" y="15" width="5" height="4" fill="#26cc00" stroke="#0d1b2a" strokeWidth="0.5"/>
      <rect x="23" y="15" width="5" height="4" fill="#39FF14" stroke="#0d1b2a" strokeWidth="0.5"/>
      <rect x="5" y="20" width="5" height="4" fill="#1a8c00" stroke="#0d1b2a" strokeWidth="0.5"/>
      <rect x="11" y="20" width="5" height="4" fill="#39FF14" stroke="#0d1b2a" strokeWidth="0.5"/>
      <rect x="17" y="20" width="5" height="4" fill="#1a1a2e" stroke="#0d1b2a" strokeWidth="0.5"/>
      <rect x="23" y="20" width="5" height="4" fill="#0a6600" stroke="#0d1b2a" strokeWidth="0.5"/>
    </svg>
  ),
  newhabit: (
    <svg viewBox="0 0 32 32" width="52" height="52" style={{ imageRendering: 'pixelated' }}>
      <rect x="4" y="2" width="24" height="28" fill="#0d1b2a" stroke="#39FF14" strokeWidth="1.5"/>
      <rect x="4" y="2" width="24" height="6" fill="#00AA00"/>
      <line x1="8" y1="12" x2="24" y2="12" stroke="#1a4a1a" strokeWidth="1"/>
      <line x1="8" y1="16" x2="24" y2="16" stroke="#1a4a1a" strokeWidth="1"/>
      <line x1="8" y1="20" x2="24" y2="20" stroke="#1a4a1a" strokeWidth="1"/>
      <text x="16" y="27" textAnchor="middle" fontSize="12" fill="#39FF14" fontFamily="monospace" fontWeight="bold">+</text>
    </svg>
  ),
  habits: (
    <svg viewBox="0 0 32 32" width="52" height="52" style={{ imageRendering: 'pixelated' }}>
      <rect x="3" y="2" width="26" height="28" fill="#0d1b2a" stroke="#39FF14" strokeWidth="1.5"/>
      <rect x="3" y="2" width="26" height="5" fill="#0000CC"/>
      <text x="16" y="6" textAnchor="middle" fontSize="4" fill="#39FF14" fontFamily="monospace" fontWeight="bold">TXT</text>
      <rect x="7" y="10" width="4" height="4" fill="#39FF14" stroke="#1a4a1a" strokeWidth="0.5"/>
      <line x1="14" y1="12" x2="26" y2="12" stroke="#1a6a1a" strokeWidth="1.2"/>
      <rect x="7" y="16" width="4" height="4" fill="transparent" stroke="#1a6a1a" strokeWidth="0.8"/>
      <line x1="14" y1="18" x2="26" y2="18" stroke="#1a6a1a" strokeWidth="1.2"/>
      <rect x="7" y="22" width="4" height="4" fill="#39FF14" stroke="#1a4a1a" strokeWidth="0.5"/>
      <line x1="14" y1="24" x2="26" y2="24" stroke="#1a6a1a" strokeWidth="1.2"/>
    </svg>
  ),
  stats: (
    <svg viewBox="0 0 32 32" width="52" height="52" style={{ imageRendering: 'pixelated' }}>
      <rect x="2" y="2" width="28" height="28" fill="#0d1b2a" stroke="#39FF14" strokeWidth="1.5"/>
      <rect x="2" y="2" width="28" height="5" fill="#000080"/>
      <rect x="6" y="20" width="4" height="8" fill="#26cc00"/>
      <rect x="12" y="14" width="4" height="14" fill="#33FF00"/>
      <rect x="18" y="10" width="4" height="18" fill="#39FF14"/>
      <rect x="24" y="16" width="4" height="12" fill="#26cc00"/>
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 32 32" width="52" height="52" style={{ imageRendering: 'pixelated' }}>
      <rect x="2" y="2" width="28" height="28" fill="#0d1b2a" stroke="#39FF14" strokeWidth="1.5"/>
      <rect x="2" y="2" width="28" height="5" fill="#000080"/>
      <circle cx="16" cy="18" r="6" fill="none" stroke="#39FF14" strokeWidth="2"/>
      <circle cx="16" cy="18" r="2.5" fill="#39FF14"/>
      <line x1="16" y1="10" x2="16" y2="12" stroke="#39FF14" strokeWidth="2"/>
      <line x1="16" y1="24" x2="16" y2="26" stroke="#39FF14" strokeWidth="2"/>
      <line x1="8" y1="18" x2="10" y2="18" stroke="#39FF14" strokeWidth="2"/>
      <line x1="22" y1="18" x2="24" y2="18" stroke="#39FF14" strokeWidth="2"/>
    </svg>
  ),
  todaystask: (
    <svg viewBox="0 0 32 32" width="52" height="52" style={{ imageRendering: 'pixelated' }}>
      <rect x="2" y="2" width="28" height="28" fill="#1a0a2e" stroke="#FF44FF" strokeWidth="1.5"/>
      <rect x="2" y="2" width="28" height="5" fill="#990099"/>
      <text x="16" y="6" textAnchor="middle" fontSize="4" fill="#FF88FF" fontFamily="monospace" fontWeight="bold">TODAY</text>
      <rect x="6" y="10" width="4" height="4" fill="#FF44FF" stroke="#FF44FF" strokeWidth="0.5"/>
      <text x="8" y="13.5" textAnchor="middle" fontSize="4" fill="#1a0a2e" fontFamily="monospace" fontWeight="bold">✓</text>
      <line x1="13" y1="12" x2="26" y2="12" stroke="#FF44FF" strokeWidth="1.2"/>
      <rect x="6" y="16" width="4" height="4" fill="transparent" stroke="#FF44FF" strokeWidth="0.8"/>
      <line x1="13" y1="18" x2="26" y2="18" stroke="#FF44FF" strokeWidth="1.2"/>
      <rect x="6" y="22" width="4" height="4" fill="transparent" stroke="#FF44FF" strokeWidth="0.8"/>
      <line x1="13" y1="24" x2="26" y2="24" stroke="#FF44FF" strokeWidth="1.2"/>
    </svg>
  ),
};

export default function DesktopIcon({ id, label, iconType, selected, onClick, onDoubleClick }) {
  const lastTap = React.useRef(0);

  const handleClick = (e) => {
    e.stopPropagation();
    const now = Date.now();
    // Detect double-tap on touch / double-click on desktop
    if (now - lastTap.current < 400) {
      onDoubleClick?.(id);
      lastTap.current = 0;
    } else {
      // First tap/click — select. On mobile, also open after a brief selection.
      onClick?.(id);
      lastTap.current = now;
    }
  };

  return (
    <div
      className={`desktop-icon ${selected ? 'selected' : ''}`}
      onClick={handleClick}
      onDoubleClick={(e) => { e.stopPropagation(); onDoubleClick?.(id); }}
    >
      <div className="desktop-icon-img">
        {ICONS[iconType] || ICONS.habits}
      </div>
      <span className="desktop-icon-label">{label}</span>
    </div>
  );
}
