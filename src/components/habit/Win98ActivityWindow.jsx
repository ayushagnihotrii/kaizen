import React, { useState, useMemo } from 'react';

export default function Win98ActivityWindow({ tasks = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getIntensityChar = (count) => {
    if (count === 0) return '░';
    if (count <= 2) return '▒';
    if (count <= 4) return '▓';
    return '█';
  };

  const getIntensityColor = (count) => {
    if (count === 0) return '#1a1a1a';
    if (count === 1) return '#0a4400';
    if (count <= 3) return '#1a8c00';
    if (count <= 5) return '#26cc00';
    return '#33FF00';
  };

  // Aggregate tasks by date
  const tasksByDate = useMemo(() => {
    const aggregated = {};
    tasks.forEach((task) => {
      if (task.isCompleted && task.completedAt) {
        const date = task.completedAt?.toDate
          ? task.completedAt.toDate()
          : new Date(task.completedAt);
        const dateKey = date.toISOString().split('T')[0];
        aggregated[dateKey] = (aggregated[dateKey] || 0) + 1;
      }
    });
    return aggregated;
  }, [tasks]);

  // Generate calendar grid
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const grid = [];
    for (let i = 0; i < startDayOfWeek; i++) {
      grid.push({ isEmpty: true });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateKey = date.toISOString().split('T')[0];
      const taskCount = tasksByDate[dateKey] || 0;
      grid.push({ date: dateKey, day, taskCount });
    }
    return grid;
  }, [currentDate, tasksByDate]);

  const goToPreviousMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    const today = new Date();
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    if (nextMonth <= today) setCurrentDate(nextMonth);
  };

  const canGoNext = () => {
    const today = new Date();
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    return nextMonth <= today;
  };

  const monthYear = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  }).toUpperCase();

  const totalThisMonth = calendarData.reduce((sum, d) => sum + (d.taskCount || 0), 0);
  const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Terminal header */}
      <div className="terminal-header">
        <span className="neon-text-dim">C:\TASKS\&gt; </span>
        <span className="neon-text">ACTIVITY.EXE</span>
      </div>

      {/* Month nav */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <button className="bevel-button" onClick={goToPreviousMonth} style={{ padding: '2px 10px' }}>
          ◀ PREV
        </button>
        <div style={{ fontWeight: 'bold', fontSize: 18, color: '#00FF41', textShadow: '0 0 6px rgba(0,255,65,0.4)' }}>
          📅 {monthYear}
        </div>
        <button
          className="bevel-button"
          onClick={goToNextMonth}
          disabled={!canGoNext()}
          style={{ padding: '2px 10px', opacity: canGoNext() ? 1 : 0.4 }}
        >
          NEXT ▶
        </button>
      </div>

      {/* Stats line */}
      <div className="terminal-box" style={{ fontSize: 14, padding: 8 }}>
        {'>'} {totalThisMonth} TASKS COMPLETED IN {monthYear}
      </div>

      {/* Day-of-week labels */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 3,
        textAlign: 'center',
        fontSize: 12,
        fontWeight: 'bold',
        color: '#1a8c00',
      }}>
        {DAYS.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 3,
      }}>
        {calendarData.map((cell, i) => {
          if (cell.isEmpty) {
            return <div key={`empty-${i}`} style={{ aspectRatio: '1' }} />;
          }

          const bgColor = getIntensityColor(cell.taskCount);
          const isToday = cell.date === new Date().toISOString().split('T')[0];

          return (
            <div
              key={cell.date}
              title={`${cell.date}: ${cell.taskCount} task${cell.taskCount !== 1 ? 's' : ''}`}
              style={{
                aspectRatio: '1',
                background: bgColor,
                border: isToday ? '2px solid #33FF00' : '1px solid #333',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'default',
                position: 'relative',
                boxShadow: cell.taskCount > 0 ? `0 0 4px ${bgColor}` : 'none',
              }}
            >
              <span style={{
                fontSize: 12,
                color: cell.taskCount > 0 ? '#fff' : '#333',
                fontWeight: isToday ? 'bold' : 'normal',
              }}>
                {cell.day}
              </span>
              {cell.taskCount > 0 && (
                <span style={{ fontSize: 10, color: '#33FF00' }}>
                  {getIntensityChar(cell.taskCount)}{cell.taskCount}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        fontSize: 12,
        color: '#1a8c00',
        borderTop: '1px solid #1a2a1a',
        paddingTop: 8,
      }}>
        <span>LESS</span>
        {[0, 1, 3, 5, 8].map((count) => (
          <div
            key={count}
            style={{
              width: 16,
              height: 16,
              background: getIntensityColor(count),
              border: '1px solid #2a2a2a',
            }}
          />
        ))}
        <span>MORE</span>
      </div>
    </div>
  );
}
