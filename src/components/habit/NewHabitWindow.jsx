import React, { useState } from 'react';

const CATEGORIES = [
  { value: 'health', label: 'HEALTH', color: '#33FF00' },
  { value: 'fitness', label: 'FITNESS', color: '#00CCFF' },
  { value: 'learning', label: 'LEARNING', color: '#FF9900' },
  { value: 'mindfulness', label: 'MINDFULNESS', color: '#b040ff' },
  { value: 'productivity', label: 'PRODUCTIVITY', color: '#FF4444' },
  { value: 'social', label: 'SOCIAL', color: '#ff40b0' },
  { value: 'custom', label: 'CUSTOM', color: '#FFFF00' },
];

const COLORS = [
  '#33FF00', '#00CCFF', '#FF9900', '#FF4444',
  '#b040ff', '#ff40b0', '#FFFF00', '#FFFFFF',
  '#00FF88', '#FF6600', '#4488FF', '#FF0066',
  '#88FF00', '#00FFCC', '#FF3388', '#CCFF00',
];

const FREQUENCIES = [
  { value: 'daily', label: 'DAILY' },
  { value: 'weekly', label: 'WEEKLY' },
  { value: 'custom', label: 'CUSTOM' },
];

export default function NewHabitWindow({ onSave, onCancel }) {
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [category, setCategory] = useState('health');
  const [color, setColor] = useState('#33FF00');
  const [customDays, setCustomDays] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSave({
      id: Date.now().toString(),
      name: name.trim(),
      frequency,
      category,
      color,
      customDays: frequency === 'custom' ? customDays : '',
      createdAt: new Date().toISOString(),
      completionHistory: {},
      streak: 0,
    });
    setName('');
    setFrequency('daily');
    setCategory('health');
    setColor('#33FF00');
    setCustomDays('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Terminal-style header */}
      <div className="terminal-header">
        <span className="neon-text-dim">C:\HABITS\&gt; </span>
        <span className="neon-text">NEW_HABIT.EXE</span>
        <span className="cursor-blink" style={{ marginLeft: 4 }}></span>
      </div>

      {/* Habit Name */}
      <div className="win98-groupbox">
        <span className="win98-groupbox-label">Habit Name</span>
        <input
          type="text"
          className="win98-input"
          placeholder="Enter habit name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={50}
          autoFocus
        />
      </div>

      {/* Frequency */}
      <div className="win98-groupbox">
        <span className="win98-groupbox-label">Frequency</span>
        <select
          className="win98-select"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
        >
          {FREQUENCIES.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
        {frequency === 'custom' && (
          <input
            type="text"
            className="win98-input"
            placeholder="e.g., Mon,Wed,Fri"
            value={customDays}
            onChange={(e) => setCustomDays(e.target.value)}
            style={{ marginTop: 6 }}
          />
        )}
      </div>

      {/* Category */}
      <div className="win98-groupbox">
        <span className="win98-groupbox-label">Category</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxHeight: 100, overflowY: 'auto' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              className="category-badge"
              style={{
                borderColor: cat.color,
                color: category === cat.value ? '#000' : cat.color,
                background: category === cat.value ? cat.color : 'transparent',
                cursor: 'pointer',
                fontSize: 14,
                padding: '3px 10px',
                transition: 'all 0.15s ease',
                boxShadow: category === cat.value ? `0 0 8px ${cat.color}60` : 'none',
                whiteSpace: 'nowrap',
              }}
              onClick={() => setCategory(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Color Picker */}
      <div className="win98-groupbox">
        <span className="win98-groupbox-label">Color</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 4 }}>
          {COLORS.map((c) => (
            <div
              key={c}
              className={`win98-color-swatch ${color === c ? 'selected' : ''}`}
              style={{
                background: c,
                width: '100%',
                height: 28,
                transition: 'transform 0.1s, box-shadow 0.15s',
              }}
              onClick={() => setColor(c)}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.15)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            />
          ))}
        </div>
        <div style={{
          marginTop: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <span>PREVIEW:</span>
          <span style={{
            color,
            textShadow: `0 0 4px ${color}, 0 0 8px ${color}`,
            fontSize: 18,
          }}>
            ■ {name || 'HABIT NAME'}
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
        <button
          className="bevel-button"
          onClick={handleSubmit}
          disabled={!name.trim()}
          style={{
            background: name.trim() ? '#0a2a0a' : undefined,
            borderColor: name.trim() ? '#33FF00' : undefined,
            boxShadow: name.trim() ? '0 0 8px rgba(51,255,0,0.3)' : undefined,
            fontWeight: 'bold',
            padding: '6px 20px',
          }}
        >
          💾 SAVE
        </button>
        <button
          className="bevel-button"
          onClick={onCancel}
          style={{ color: '#FF4444', borderColor: '#662222', padding: '6px 20px' }}
        >
          ❌ CANCEL
        </button>
      </div>
    </div>
  );
}
