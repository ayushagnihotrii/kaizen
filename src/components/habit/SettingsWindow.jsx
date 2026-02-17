import React, { useState } from 'react';

export default function SettingsWindow({ settings, onUpdateSettings, onExport, onImport, onClearData }) {
  const [showConfirmClear, setShowConfirmClear] = useState(false);

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

      {/* System Info */}
      <div className="terminal-box" style={{ fontSize: 14 }}>
{`SYSTEM INFO
───────────────────
OS:     HABIT SYSTEM v1.0
KERNEL: React ${React.version}
SHELL:  VT323 Terminal
MEM:    localStorage`}
      </div>
    </div>
  );
}
