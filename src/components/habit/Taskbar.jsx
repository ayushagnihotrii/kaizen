import React, { useState, useEffect, useRef } from 'react';

function MiniCalendar({ onClose }) {
  const [viewDate, setViewDate] = useState(new Date());
  const today = new Date();

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const dayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const monthName = viewDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  const cells = [];
  // Previous month trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, otherMonth: true });
  }
  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    cells.push({ day: d, isToday });
  }
  // Next month leading days
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, otherMonth: true });
  }

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 9989 }} onClick={onClose} />
      <div className="taskbar-calendar">
        <div className="taskbar-calendar-header">
          <button
            className="bevel-button"
            style={{ padding: '0 6px', fontSize: 14, minWidth: 'auto', height: 24 }}
            onClick={() => setViewDate(new Date(year, month - 1, 1))}
          >◀</button>
          <span>{monthName}</span>
          <button
            className="bevel-button"
            style={{ padding: '0 6px', fontSize: 14, minWidth: 'auto', height: 24 }}
            onClick={() => setViewDate(new Date(year, month + 1, 1))}
          >▶</button>
        </div>
        <div className="taskbar-calendar-grid">
          {dayLabels.map((dl) => (
            <div key={dl} className="taskbar-calendar-day-label">{dl}</div>
          ))}
          {cells.map((cell, i) => (
            <div
              key={i}
              className={`taskbar-calendar-day${cell.isToday ? ' today' : ''}${cell.otherMonth ? ' other-month' : ''}`}
            >
              {cell.day}
            </div>
          ))}
        </div>
        <div style={{
          marginTop: 8,
          textAlign: 'center',
          fontSize: 13,
          color: '#39FF14',
          textShadow: '0 0 4px rgba(0,255,65,0.3)',
          borderTop: '1px solid #1a2a1a',
          paddingTop: 8,
        }}>
          {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>
    </>
  );
}

export default function Taskbar({ windows, activeWindowId, onWindowClick, onStartClick, startMenuOpen, notificationBell }) {
  const [time, setTime] = useState('');
  const [calendarOpen, setCalendarOpen] = useState(false);
  const clockRef = useRef(null);

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
            <span style={{ fontSize: 20 }}>📁</span> {win.title}
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, position: 'relative' }}>
        {notificationBell}
        <div
          ref={clockRef}
          className="taskbar-clock"
          style={{ cursor: 'pointer' }}
          onClick={(e) => { e.stopPropagation(); setCalendarOpen(!calendarOpen); }}
          title="Click to open calendar"
        >
          {time}
        </div>
        {calendarOpen && (
          <MiniCalendar onClose={() => setCalendarOpen(false)} />
        )}
      </div>
    </div>
  );
}
