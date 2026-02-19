import React, { useState } from 'react';

const WALLPAPERS = [
  { url: '/bg.jpg', label: 'Default' },
  { url: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1920&q=80', label: 'Dark Waves' },
  { url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80', label: 'Earth Night' },
  { url: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=1920&q=80', label: 'Galaxy' },
  { url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80', label: 'Starry Night' },
  { url: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1920&q=80', label: 'Neon City' },
];

export default function SettingsWindow({ settings, onUpdateSettings, onExport, onImport, onClearData }) {
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [customWallpaperUrl, setCustomWallpaperUrl] = useState('');

  const handleImportClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          onImport(data);
        } catch {
          alert('ERROR: Invalid JSON file');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Terminal header */}
      <div className="terminal-header">
        <span className="neon-text-dim">C:\HABITS\&gt; </span>
        <span className="neon-text">SETTINGS.EXE</span>
      </div>

      {/* Sound Effects */}
      <div className="win98-groupbox">
        <span className="win98-groupbox-label">Sound Effects</span>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <input
            type="checkbox"
            className="win98-checkbox"
            checked={settings.soundEnabled}
            onChange={(e) => onUpdateSettings({ ...settings, soundEnabled: e.target.checked })}
          />
          <span>Enable sound effects</span>
        </label>
      </div>

      {/* CRT Effects */}
      <div className="win98-groupbox">
        <span className="win98-groupbox-label">Display</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input
              type="checkbox"
              className="win98-checkbox"
              checked={settings.scanlines}
              onChange={(e) => onUpdateSettings({ ...settings, scanlines: e.target.checked })}
            />
            <span>CRT Scanlines</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input
              type="checkbox"
              className="win98-checkbox"
              checked={settings.flicker}
              onChange={(e) => onUpdateSettings({ ...settings, flicker: e.target.checked })}
            />
            <span>Screen Flicker</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input
              type="checkbox"
              className="win98-checkbox"
              checked={settings.grain}
              onChange={(e) => onUpdateSettings({ ...settings, grain: e.target.checked })}
            />
            <span>Film Grain</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input
              type="checkbox"
              className="win98-checkbox"
              checked={settings.vignette}
              onChange={(e) => onUpdateSettings({ ...settings, vignette: e.target.checked })}
            />
            <span>CRT Vignette</span>
          </label>
        </div>
      </div>

      {/* Wallpaper */}
      <div className="win98-groupbox">
        <span className="win98-groupbox-label">Wallpaper</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 8 }}>
          {WALLPAPERS.map((wp) => (
            <div
              key={wp.url}
              onClick={() => onUpdateSettings({ ...settings, wallpaper: wp.url })}
              style={{
                cursor: 'pointer',
                border: settings.wallpaper === wp.url ? '2px solid #00FF41' : '2px solid #2a2a2a',
                boxShadow: settings.wallpaper === wp.url ? '0 0 8px rgba(0,255,65,0.4)' : 'none',
                overflow: 'hidden',
                position: 'relative',
                height: 64,
                background: '#000',
                transition: 'border-color 0.15s, box-shadow 0.15s, transform 0.1s',
              }}
              onMouseEnter={(e) => {
                if (settings.wallpaper !== wp.url) {
                  e.currentTarget.style.borderColor = '#1a8c00';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (settings.wallpaper !== wp.url) {
                  e.currentTarget.style.borderColor = '#2a2a2a';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              <img
                src={wp.url}
                alt={wp.label}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: 0.8,
                  imageRendering: 'auto',
                }}
                loading="lazy"
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'rgba(0,0,0,0.7)',
                fontSize: 11,
                padding: '1px 4px',
                textAlign: 'center',
                color: settings.wallpaper === wp.url ? '#00FF41' : '#888',
              }}>
                {wp.label}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <input
            type="text"
            className="win98-input"
            placeholder="Custom URL..."
            value={customWallpaperUrl}
            onChange={(e) => setCustomWallpaperUrl(e.target.value)}
            style={{ flex: 1, fontSize: 13 }}
          />
          <button
            className="bevel-button"
            style={{ fontSize: 13, padding: '2px 8px' }}
            onClick={() => {
              if (customWallpaperUrl.trim()) {
                onUpdateSettings({ ...settings, wallpaper: customWallpaperUrl.trim() });
              }
            }}
          >
            SET
          </button>
        </div>
      </div>

      {/* Data Management */}
      <div className="win98-groupbox">
        <span className="win98-groupbox-label">Data Management</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="bevel-button" onClick={onExport} style={{ flex: 1 }}>
              💾 Export Data
            </button>
            <button className="bevel-button" onClick={handleImportClick} style={{ flex: 1 }}>
              📂 Import Data
            </button>
          </div>

          {!showConfirmClear ? (
            <button
              className="bevel-button"
              onClick={() => setShowConfirmClear(true)}
              style={{ color: '#FF4444' }}
            >
              🗑️ Clear All Data
            </button>
          ) : (
            <div className="bevel-inset" style={{ padding: 8 }}>
              <div style={{ marginBottom: 6, fontWeight: 'bold', color: '#FF4444', textShadow: '0 0 4px rgba(255,68,68,0.4)' }}>
                ⚠️ ARE YOU SURE? THIS CANNOT BE UNDONE!
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="bevel-button" onClick={() => { onClearData(); setShowConfirmClear(false); }}
                  style={{ color: '#FF4444' }}>
                  YES, DELETE ALL
                </button>
                <button className="bevel-button" onClick={() => setShowConfirmClear(false)}>
                  CANCEL
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="win98-groupbox">
        <span className="win98-groupbox-label">Keyboard Shortcuts</span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px', fontSize: 14 }}>
          <span style={{ color: '#39FF14' }}>Esc</span><span>Close active window</span>
          <span style={{ color: '#39FF14' }}>⌘/Ctrl + N</span><span>New Habit</span>
          <span style={{ color: '#39FF14' }}>⌘/Ctrl + T</span><span>Open Tasks</span>
          <span style={{ color: '#39FF14' }}>⌘/Ctrl + ,</span><span>Settings</span>
          <span style={{ color: '#39FF14' }}>Right-click</span><span>Context menu</span>
        </div>
      </div>

      {/* System Info */}
      <div className="terminal-box" style={{ fontSize: 14 }}>
{`SYSTEM INFO
───────────────────
OS:     KAIZEN 改善 v2.0
KERNEL: React ${React.version}
SHELL:  VT323 Terminal
MEM:    localStorage + Firebase`}
      </div>
    </div>
  );
}
