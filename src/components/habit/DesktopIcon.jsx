import React from 'react';

// Pixel-art style SVG icons for each desktop item
const ICONS = {
  newhabit: (
    <svg viewBox="0 0 32 32" width="40" height="40" style={{ imageRendering: 'pixelated' }}>
      <rect x="4" y="2" width="24" height="28" fill="#FFFFCC" stroke="#000" strokeWidth="1"/>
      <rect x="4" y="2" width="24" height="6" fill="#33FF00"/>
      <line x1="8" y1="12" x2="24" y2="12" stroke="#888" strokeWidth="1"/>
      <line x1="8" y1="16" x2="24" y2="16" stroke="#888" strokeWidth="1"/>
      <line x1="8" y1="20" x2="24" y2="20" stroke="#888" strokeWidth="1"/>
      <text x="16" y="26" textAnchor="middle" fontSize="10" fill="#33FF00" fontFamily="monospace">+</text>
    </svg>
  ),
  habits: (
    <svg viewBox="0 0 32 32" width="40" height="40" style={{ imageRendering: 'pixelated' }}>
      <rect x="3" y="2" width="26" height="28" fill="#FFFFCC" stroke="#000" strokeWidth="1"/>
      <rect x="3" y="2" width="26" height="5" fill="#0000AA"/>
      <text x="16" y="6" textAnchor="middle" fontSize="4" fill="#FFF" fontFamily="monospace">TXT</text>
      <rect x="7" y="10" width="4" height="4" fill="#33FF00" stroke="#000" strokeWidth="0.5"/>
      <line x1="14" y1="12" x2="26" y2="12" stroke="#333" strokeWidth="1"/>
      <rect x="7" y="16" width="4" height="4" fill="transparent" stroke="#000" strokeWidth="0.5"/>
      <line x1="14" y1="18" x2="26" y2="18" stroke="#333" strokeWidth="1"/>
      <rect x="7" y="22" width="4" height="4" fill="#33FF00" stroke="#000" strokeWidth="0.5"/>
      <line x1="14" y1="24" x2="26" y2="24" stroke="#333" strokeWidth="1"/>
    </svg>
  ),
  stats: (
    <svg viewBox="0 0 32 32" width="40" height="40" style={{ imageRendering: 'pixelated' }}>
      <rect x="2" y="2" width="28" height="28" fill="#1a1a2e" stroke="#808080" strokeWidth="1"/>
      <rect x="2" y="2" width="28" height="5" fill="#000080"/>
      <rect x="6" y="20" width="4" height="8" fill="#33FF00"/>
      <rect x="12" y="14" width="4" height="14" fill="#33FF00"/>
      <rect x="18" y="10" width="4" height="18" fill="#33FF00"/>
      <rect x="24" y="16" width="4" height="12" fill="#33FF00"/>
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 32 32" width="40" height="40" style={{ imageRendering: 'pixelated' }}>
      <rect x="2" y="2" width="28" height="28" fill="#C0C0C0" stroke="#000" strokeWidth="1"/>
      <rect x="2" y="2" width="28" height="5" fill="#000080"/>
      <circle cx="16" cy="18" r="6" fill="none" stroke="#333" strokeWidth="2"/>
      <circle cx="16" cy="18" r="2" fill="#333"/>
      <line x1="16" y1="10" x2="16" y2="12" stroke="#333" strokeWidth="2"/>
      <line x1="16" y1="24" x2="16" y2="26" stroke="#333" strokeWidth="2"/>
      <line x1="8" y1="18" x2="10" y2="18" stroke="#333" strokeWidth="2"/>
      <line x1="22" y1="18" x2="24" y2="18" stroke="#333" strokeWidth="2"/>
    </svg>
  ),
};

export default function DesktopIcon({ id, label, iconType, selected, onClick, onDoubleClick }) {
  return (
    <div
      className={`desktop-icon ${selected ? 'selected' : ''}`}
      onClick={(e) => { e.stopPropagation(); onClick?.(id); }}
      onDoubleClick={(e) => { e.stopPropagation(); onDoubleClick?.(id); }}
    >
      <div className="desktop-icon-img">
        {ICONS[iconType] || ICONS.habits}
      </div>
      <span className="desktop-icon-label">{label}</span>
    </div>
  );
}
