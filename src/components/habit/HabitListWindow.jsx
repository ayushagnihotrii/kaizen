import React from 'react';

const CATEGORY_COLORS = {
  health: '#33FF00',
  fitness: '#00CCFF',
  learning: '#FF9900',
  mindfulness: '#b040ff',
  productivity: '#FF4444',
  social: '#ff40b0',
  custom: '#FFFF00',
};

export default function HabitListWindow({ habits, onToggleHabit, onDeleteHabit }) {
  const today = new Date();
  const todayKey = today.toISOString().split('T')[0];
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).toUpperCase();

  const completedToday = habits.filter(
    (h) => h.completionHistory && h.completionHistory[todayKey]
  ).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Terminal-style header */}
      <div className="terminal-header" style={{ marginBottom: 8 }}>
        <div className="neon-text-dim" style={{ fontSize: 12 }}>
          ┌──────────────────────────────────────────┐
        </div>
        <div className="neon-text" style={{ fontSize: 14, padding: '2px 0' }}>
          │ 📅 {dateStr}
        </div>
        <div className="neon-text-dim" style={{ fontSize: 14, padding: '2px 0' }}>
          │ STATUS: {completedToday}/{habits.length} HABITS COMPLETED
        </div>
        <div className="neon-text-dim" style={{ fontSize: 12 }}>
          └──────────────────────────────────────────┘
        </div>
      </div>

      {/* Habit List */}
      {habits.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: 32,
          color: '#1a8c00',
          fontSize: 16,
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
          <div>NO HABITS FOUND</div>
          <div style={{ fontSize: 14, marginTop: 4 }}>
            Open NewHabit.exe to create one
          </div>
        </div>
      ) : (
        <div style={{ border: '1px solid #1a2a1a' }}>
          {/* List header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '4px 8px',
            background: '#0a1a0a',
            borderBottom: '1px solid #00FF41',
            fontSize: 12,
            fontWeight: 'bold',
            textTransform: 'uppercase',
            gap: 10,
            color: '#39FF14',
          }}>
            <span style={{ width: 24 }}>✓</span>
            <span style={{ flex: 1 }}>HABIT</span>
            <span style={{ width: 60, textAlign: 'center' }}>STREAK</span>
            <span style={{ width: 80, textAlign: 'center' }}>CATEGORY</span>
            <span style={{ width: 30 }}></span>
          </div>

          {/* Habit items */}
          {habits.map((habit) => {
            const isCompleted = habit.completionHistory && habit.completionHistory[todayKey];
            const catColor = CATEGORY_COLORS[habit.category] || '#33FF00';

            return (
              <div
                key={habit.id}
                className={`habit-item ${isCompleted ? 'completed-habit' : ''}`}
              >
                <input
                  type="checkbox"
                  className="win98-checkbox"
                  checked={!!isCompleted}
                  onChange={() => onToggleHabit(habit.id)}
                />
                <span
                  className="habit-name"
                  style={{
                    color: habit.color || '#00FF41',
                    textShadow: isCompleted ? 'none' : `0 0 4px ${habit.color || '#33FF00'}60`,
                  }}
                >
                  {habit.name}
                </span>
                <span className="habit-streak">
                  {habit.streak > 0 && (
                    <span style={{ fontSize: 14 }}>🔥</span>
                  )}
                  <span style={{ fontWeight: 'bold', minWidth: 20, textAlign: 'right' }}>
                    {habit.streak}
                  </span>
                </span>
                <span
                  className="category-badge"
                  style={{
                    borderColor: catColor,
                    color: catColor,
                    fontSize: 11,
                    padding: '0 4px',
                  }}
                >
                  {habit.category?.toUpperCase()}
                </span>
                <button
                  className="bevel-button"
                  style={{
                    padding: '1px 6px',
                    fontSize: 12,
                    color: '#FF4444',
                    minWidth: 'auto',
                  }}
                  onClick={() => onDeleteHabit(habit.id)}
                  title="Delete habit"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Progress bar */}
      {habits.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <div style={{ fontSize: 12, marginBottom: 4, textTransform: 'uppercase' }}>
            Today's Progress:
          </div>
          <div className="bevel-inset" style={{ height: 20, background: '#0a0a0a', position: 'relative' }}>
            <div
              style={{
                height: '100%',
                width: `${habits.length > 0 ? (completedToday / habits.length) * 100 : 0}%`,
                background: 'linear-gradient(90deg, #000080, #33FF00)',
                transition: 'width 0.3s',
              }}
            />
            <span style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              color: '#00FF41',
              fontWeight: 'bold',
              mixBlendMode: 'difference',
            }}>
              {habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
