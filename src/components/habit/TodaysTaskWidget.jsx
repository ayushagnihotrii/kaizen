import React from 'react';

export default function TodaysTaskWidget({
  firebaseTasks = [],
  tasksLoading = false,
  onToggleComplete,
  onOpenWindow,
}) {
  const today = new Date().toISOString().split('T')[0];
  const todaysTasks = firebaseTasks.filter((t) => t.dueDate === today);
  const completedCount = todaysTasks.filter((t) => t.isCompleted).length;
  const sortedTasks = [...todaysTasks].sort((a, b) => {
    if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
    if (a.dueTime && b.dueTime) return a.dueTime.localeCompare(b.dueTime);
    return 0;
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: 16,
        right: 20,
        width: 300,
        zIndex: 3,
        pointerEvents: 'auto',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div
        style={{
          fontSize: 28,
          fontWeight: 'bold',
          color: '#FF00FF',
          textShadow: '0 0 8px #FF00FF, 0 0 16px #FF00FF, 0 0 32px rgba(255,0,255,0.4)',
          marginBottom: 8,
          textTransform: 'uppercase',
          letterSpacing: 4,
          textAlign: 'right',
          cursor: 'pointer',
        }}
        onClick={() => onOpenWindow('todaystask')}
        title="Click to open TodaysTask.exe"
      >
        TODAYS TASK
      </div>

      {/* Tasks list widget */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.7)',
        border: '1px solid rgba(255, 0, 255, 0.3)',
        borderRadius: 2,
        padding: 10,
        backdropFilter: 'blur(4px)',
      }}>
        {/* Progress */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 13,
          marginBottom: 6,
          color: '#FF00FF',
        }}>
          <span>{completedCount}/{todaysTasks.length} done</span>
          <span>{todaysTasks.length > 0 ? Math.round((completedCount / todaysTasks.length) * 100) : 0}%</span>
        </div>
        <div style={{
          width: '100%',
          height: 4,
          background: '#1a0a1a',
          borderRadius: 2,
          marginBottom: 8,
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${todaysTasks.length > 0 ? Math.round((completedCount / todaysTasks.length) * 100) : 0}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #800080, #FF00FF)',
            transition: 'width 0.4s ease',
            boxShadow: '0 0 6px #FF00FF',
          }} />
        </div>

        {/* Task items */}
        {tasksLoading ? (
          <div style={{ color: '#FF00FF', fontSize: 14, textAlign: 'center', padding: 8 }}>
            ⏳ Loading...
          </div>
        ) : sortedTasks.length === 0 ? (
          <div style={{ color: '#804080', fontSize: 14, textAlign: 'center', padding: 12 }}>
            ✨ No tasks for today
          </div>
        ) : (
          <div className="widget-scroll" style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 280, overflowY: 'auto' }}>
            {sortedTasks.map((task) => (
              <div
                key={task.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '4px 6px',
                  background: task.isCompleted ? 'rgba(128,0,128,0.1)' : 'rgba(255,0,255,0.05)',
                  borderLeft: `2px solid ${task.isCompleted ? '#804080' : '#FF00FF'}`,
                  opacity: task.isCompleted ? 0.5 : 1,
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onClick={() => onToggleComplete(task.id)}
                title="Click to toggle complete"
              >
                <span style={{ fontSize: 14, flexShrink: 0 }}>
                  {task.isCompleted ? '✅' : '⬜'}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 15,
                    color: task.isCompleted ? '#804080' : '#FF00FF',
                    textDecoration: task.isCompleted ? 'line-through' : 'none',
                    textShadow: task.isCompleted ? 'none' : '0 0 4px rgba(255,0,255,0.3)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {task.title}
                  </div>
                </div>
                {task.dueTime && (
                  <span style={{ fontSize: 12, color: '#804080', flexShrink: 0 }}>
                    {new Date(`2000-01-01T${task.dueTime}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Open full window link */}
        <div
          className="widget-open-link"
          style={{
            marginTop: 8,
            textAlign: 'center',
            fontSize: 12,
            color: '#804080',
            cursor: 'pointer',
            transition: 'color 0.15s, text-shadow 0.15s',
          }}
          onClick={() => onOpenWindow('todaystask')}
          onMouseEnter={(e) => {
            e.target.style.color = '#FF00FF';
            e.target.style.textShadow = '0 0 6px rgba(255,0,255,0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = '#804080';
            e.target.style.textShadow = 'none';
          }}
        >
          ▸ Open TodaysTask.exe
        </div>
      </div>
    </div>
  );
}
