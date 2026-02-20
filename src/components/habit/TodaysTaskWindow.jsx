import React from 'react';
import { format } from 'date-fns';

export default function TodaysTaskWindow({
  tasks,
  tasksLoading = false,
  onToggleComplete,
  onToggleStar,
  onOpenAllTasks,
}) {
  const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"

  // Filter tasks whose dueDate matches today
  const todaysTasks = tasks.filter((t) => t.dueDate === today);
  const completedCount = todaysTasks.filter((t) => t.isCompleted).length;
  const pendingCount = todaysTasks.length - completedCount;

  const formatTime = (timeStr) => {
    if (!timeStr) return null;
    try {
      return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return timeStr;
    }
  };

  // Sort: incomplete first, then by time
  const sortedTasks = [...todaysTasks].sort((a, b) => {
    if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
    if (a.dueTime && b.dueTime) return a.dueTime.localeCompare(b.dueTime);
    if (a.dueTime) return -1;
    if (b.dueTime) return 1;
    return 0;
  });

  const progressPercent = todaysTasks.length > 0
    ? Math.round((completedCount / todaysTasks.length) * 100)
    : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Terminal header */}
      <div className="terminal-header">
        <span className="neon-text-dim">C:\TODAY\&gt; </span>
        <span className="neon-text">TODAYS_TASKS.EXE</span>
        <span style={{ marginLeft: 8, fontSize: 12, color: '#1a8c00' }}>
          [{format(new Date(), 'EEE, MMM dd yyyy')}]
        </span>
      </div>

      {/* Completion celebration */}
      {progressPercent === 100 && todaysTasks.length > 0 && (
        <div className="bevel-inset" style={{
          textAlign: 'center',
          padding: '8px 12px',
          background: '#0a2a0a',
          borderColor: '#33FF00',
          boxShadow: '0 0 12px rgba(51,255,0,0.15)',
        }}>
          <div style={{ fontSize: 20, marginBottom: 2 }}>🏆🎉✨</div>
          <div style={{ color: '#39FF14', fontWeight: 'bold', fontSize: 15, textShadow: '0 0 8px rgba(57,255,20,0.5)' }}>
            ALL TASKS COMPLETED!
          </div>
          <div style={{ color: '#1a8c00', fontSize: 13 }}>Outstanding work today, keep it up!</div>
        </div>
      )}

      {/* Progress bar */}
      <div className="bevel-inset" style={{ padding: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
          <span style={{ color: '#39FF14', fontWeight: 'bold' }}>📊 TODAY'S PROGRESS</span>
          <span style={{ color: '#33FF00' }}>{progressPercent}%</span>
        </div>
        <div style={{
          width: '100%',
          height: 16,
          background: '#0a1a0a',
          border: '2px inset #1a3a1a',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${progressPercent}%`,
            height: '100%',
            background: progressPercent === 100
              ? 'linear-gradient(90deg, #00FF41, #39FF14)'
              : 'linear-gradient(90deg, #0a4400, #33FF00)',
            transition: 'width 0.4s ease',
            boxShadow: progressPercent > 0 ? '0 0 8px #33FF00' : 'none',
          }} />
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            color: '#33FF00',
            fontWeight: 'bold',
            textShadow: '0 0 4px #000',
          }}>
            {completedCount}/{todaysTasks.length} COMPLETE
          </div>
        </div>
      </div>

      {/* Summary badges */}
      <div style={{ display: 'flex', gap: 6 }}>
        <div className="bevel-inset" style={{
          flex: 1,
          padding: '4px 8px',
          textAlign: 'center',
          fontSize: 13,
        }}>
          <span style={{ color: '#FFFF00' }}>⏳</span>{' '}
          <span style={{ color: '#33FF00', fontWeight: 'bold' }}>{pendingCount}</span>{' '}
          <span style={{ color: '#1a8c00' }}>Pending</span>
        </div>
        <div className="bevel-inset" style={{
          flex: 1,
          padding: '4px 8px',
          textAlign: 'center',
          fontSize: 13,
        }}>
          <span style={{ color: '#00FF41' }}>✅</span>{' '}
          <span style={{ color: '#33FF00', fontWeight: 'bold' }}>{completedCount}</span>{' '}
          <span style={{ color: '#1a8c00' }}>Done</span>
        </div>
        <div className="bevel-inset" style={{
          flex: 1,
          padding: '4px 8px',
          textAlign: 'center',
          fontSize: 13,
        }}>
          <span style={{ color: '#33FF00' }}>📋</span>{' '}
          <span style={{ color: '#33FF00', fontWeight: 'bold' }}>{todaysTasks.length}</span>{' '}
          <span style={{ color: '#1a8c00' }}>Total</span>
        </div>
      </div>

      {/* Task list */}
      {tasksLoading ? (
        <div style={{ textAlign: 'center', padding: 32, color: '#33FF00' }}>
          <div style={{ fontSize: 16, marginBottom: 8 }}>⏳ LOADING TASKS...</div>
          <div style={{ fontSize: 14, color: '#1a8c00' }}>Syncing with Firebase...</div>
        </div>
      ) : sortedTasks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 32, color: '#1a8c00' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
          <div style={{ color: '#33FF00', fontSize: 16, fontWeight: 'bold' }}>NO TASKS DUE TODAY</div>
          <div style={{ fontSize: 14, marginTop: 4 }}>
            You're all caught up! Add tasks with a due date of today in Tasks.exe
          </div>
        </div>
      ) : (
        <div style={{ border: '1px solid #1a2a1a' }}>
          {/* Header row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '3px 6px',
            background: '#0a1a0a',
            borderBottom: '1px solid #00FF41',
            fontSize: 12,
            fontWeight: 'bold',
            textTransform: 'uppercase',
            gap: 6,
            color: '#39FF14',
          }}>
            <span style={{ width: 22 }}>✓</span>
            <span style={{ flex: 1 }}>TASK</span>
            <span style={{ width: 60, textAlign: 'center' }}>TIME</span>
            <span style={{ width: 22 }}>⭐</span>
          </div>

          {/* Task items */}
          {sortedTasks.map((task) => (
            <div
              key={task.id}
              className="habit-item"
              style={{ opacity: task.isCompleted ? 0.5 : 1 }}
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                className="win98-checkbox"
                checked={!!task.isCompleted}
                onChange={() => onToggleComplete(task.id)}
              />

              {/* Task content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  textDecoration: task.isCompleted ? 'line-through' : 'none',
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>
                  {task.isCompleted ? '✅ ' : ''}{task.title}
                </div>
                {task.description && (
                  <div style={{
                    fontSize: 13,
                    color: '#1a8c00',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {task.description}
                  </div>
                )}
              </div>

              {/* Time */}
              <div style={{
                width: 70,
                textAlign: 'center',
                fontSize: 13,
                color: task.dueTime && !task.isCompleted && (() => {
                  const now = new Date();
                  const [h, m] = task.dueTime.split(':').map(Number);
                  return (now.getHours() > h || (now.getHours() === h && now.getMinutes() > m));
                })() ? '#FF4444' : '#33FF00',
              }}>
                {task.dueTime ? (
                  <span>
                    {!task.isCompleted && (() => {
                      const now = new Date();
                      const [h, m] = task.dueTime.split(':').map(Number);
                      return (now.getHours() > h || (now.getHours() === h && now.getMinutes() > m));
                    })() ? '⚠️' : '🕐'}{' '}
                    {formatTime(task.dueTime)}
                  </span>
                ) : (
                  <span style={{ color: '#1a3a1a' }}>—</span>
                )}
              </div>

              {/* Star */}
              <button
                className="bevel-button"
                style={{
                  padding: '1px 4px',
                  fontSize: 14,
                  minWidth: 'auto',
                  background: task.isStarred ? '#332200' : undefined,
                  borderColor: task.isStarred ? '#FFFF00' : undefined,
                  color: task.isStarred ? '#FFFF00' : undefined,
                }}
                onClick={() => onToggleStar(task.id)}
                title={task.isStarred ? 'Remove star' : 'Add star'}
              >
                {task.isStarred ? '★' : '☆'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <button
          className="bevel-button"
          style={{ fontSize: 14, padding: '2px 12px' }}
          onClick={onOpenAllTasks}
        >
          📋 OPEN ALL TASKS
        </button>
        <div style={{ flex: 1 }} />
        <div className="bevel-inset" style={{
          padding: '2px 8px',
          fontSize: 12,
          color: '#1a8c00',
        }}>
          {progressPercent === 100 && todaysTasks.length > 0
            ? '🏆 ALL DONE! Great work!'
            : `${pendingCount} task${pendingCount !== 1 ? 's' : ''} remaining`
          }
        </div>
      </div>
    </div>
  );
}
