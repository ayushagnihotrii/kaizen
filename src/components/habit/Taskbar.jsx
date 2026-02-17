import React, { useState, useEffect } from 'react';

export default function Taskbar({ windows, activeWindowId, onWindowClick, onStartClick, startMenuOpen, notificationBell }) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="win98-taskbar">
      {/* Start Button */}
      <button
        className={`bevel-button start-button ${startMenuOpen ? 'active-btn' : ''}`}
        onClick={onStartClick}
      >
        <div className="start-logo" />
        <span>Start</span>
      </button>

      {/* Vertical divider */}
      <div style={{
        width: 1,
        height: 28,
        background: '#1a2a1a',
        margin: '0 2px',
      }} />

      {/* Open Window Buttons */}
      <div className="taskbar-windows">
        {windows.map((win) => (
          <button
            key={win.id}
            className={`bevel-button taskbar-window-btn ${win.id === activeWindowId ? 'active-btn' : ''}`}
            onClick={() => onWindowClick(win.id)}
            title={win.title}
          >
            📁 {win.title}
          </button>
        ))}
      </div>

      {/* System Tray / Clock */}
      <div style={{
        width: 1,
        height: 28,
        background: '#1a2a1a',
        margin: '0 2px',
      }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {notificationBell}
        <div className="taskbar-clock">
          {time}
        </div>
      </div>
    </div>
  );
}
