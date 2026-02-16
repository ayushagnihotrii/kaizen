import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function TasksWindow({
  tasks,
  tasksLoading = false,
  onAddTask,
  onEditTask,
  onToggleComplete,
  onToggleStar,
  currentView,
  onSetView,
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');

  // Reset form when switching between add/edit
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setDescription(editingTask.description || '');
      setDueDate(editingTask.dueDate || '');
      setDueTime(editingTask.dueTime || '');
      setIsAdding(true);
    }
  }, [editingTask]);

  const filteredTasks = currentView === 'starred'
    ? tasks.filter((t) => t.isStarred)
    : tasks;

  const handleSubmit = () => {
    if (!title.trim()) return;
    if (editingTask) {
      onEditTask({
        id: editingTask.id,
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate || null,
        dueTime: dueTime || null,
      });
    } else {
      onAddTask({
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate || null,
        dueTime: dueTime || null,
      });
    }
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setDueTime('');
    setIsAdding(false);
    setEditingTask(null);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    try {
      return format(new Date(dateStr), 'MMM dd, yyyy');
    } catch {
      return dateStr;
    }
  };

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Terminal header */}
      <div className="terminal-header">
        <span className="neon-text-dim">C:\TASKS\&gt; </span>
        <span className="neon-text">
          {currentView === 'starred' ? 'STARRED_TASKS.EXE' : 'MY_TASKS.EXE'}
        </span>
        <span style={{ marginLeft: 8, fontSize: 12, color: '#808080' }}>
          [{filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}]
        </span>
      </div>

      {/* View tabs */}
      <div style={{ display: 'flex', gap: 4 }}>
        <button
          className={`bevel-button ${currentView === 'all' ? 'active-btn' : ''}`}
          style={{ fontSize: 14, padding: '2px 12px' }}
          onClick={() => onSetView('all')}
        >
          📋 ALL TASKS
        </button>
        <button
          className={`bevel-button ${currentView === 'starred' ? 'active-btn' : ''}`}
          style={{ fontSize: 14, padding: '2px 12px' }}
          onClick={() => onSetView('starred')}
        >
          ⭐ STARRED
        </button>
        <div style={{ flex: 1 }} />
        <button
          className="bevel-button"
          style={{ fontSize: 14, padding: '2px 12px' }}
          onClick={() => { resetForm(); setIsAdding(true); }}
        >
          ➕ NEW TASK
        </button>
      </div>

      {/* Add/Edit form */}
      {isAdding && (
        <div className="bevel-inset" style={{ padding: 10, background: '#d4d4d4' }}>
          <div style={{ fontSize: 13, fontWeight: 'bold', marginBottom: 6, textTransform: 'uppercase' }}>
            {editingTask ? '✏️ Edit Task' : '➕ New Task'}
          </div>

          <div style={{ marginBottom: 6 }}>
            <label style={{ fontSize: 13 }}>Title:</label>
            <input
              type="text"
              className="win98-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              autoFocus
            />
          </div>

          <div style={{ marginBottom: 6 }}>
            <label style={{ fontSize: 13 }}>Description:</label>
            <textarea
              className="win98-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
              rows={2}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 13 }}>📅 Due Date:</label>
              <input
                type="date"
                className="win98-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 13 }}>🕐 Due Time:</label>
              <input
                type="time"
                className="win98-input"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
            <button className="bevel-button" onClick={handleSubmit} disabled={!title.trim()}>
              {editingTask ? '💾 Save Changes' : '💾 Add Task'}
            </button>
            <button className="bevel-button" onClick={resetForm}>
              ❌ Cancel
            </button>
          </div>
        </div>
      )}

      {/* Task list */}
      {tasksLoading ? (
        <div style={{ textAlign: 'center', padding: 32, color: '#33FF00' }}>
          <div style={{ fontSize: 16, marginBottom: 8 }}>⏳ LOADING TASKS...</div>
          <div style={{ fontSize: 14, color: '#808080' }}>Syncing with Firebase...</div>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 32, color: '#808080' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
          <div>NO {currentView === 'starred' ? 'STARRED ' : ''}TASKS FOUND</div>
          <div style={{ fontSize: 14, marginTop: 4 }}>
            Click "NEW TASK" to create one
          </div>
        </div>
      ) : (
        <div style={{ border: '1px solid #808080' }}>
          {/* Header row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '3px 6px',
            background: '#d0d0d0',
            borderBottom: '1px solid #808080',
            fontSize: 12,
            fontWeight: 'bold',
            textTransform: 'uppercase',
            gap: 6,
          }}>
            <span style={{ width: 22 }}>✓</span>
            <span style={{ flex: 1 }}>TASK</span>
            <span style={{ width: 100, textAlign: 'center' }}>DUE</span>
            <span style={{ width: 22 }}>⭐</span>
            <span style={{ width: 22 }}>✏️</span>
          </div>

          {/* Task items */}
          {filteredTasks.map((task) => (
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
                  {task.title}
                </div>
                {task.description && (
                  <div style={{ fontSize: 13, color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {task.description}
                  </div>
                )}
                {(task.dueDate || task.dueTime) && (
                  <div style={{ display: 'flex', gap: 8, fontSize: 12, color: '#808080', marginTop: 2 }}>
                    {task.dueDate && <span>📅 {formatDate(task.dueDate)}</span>}
                    {task.dueTime && <span>🕐 {formatTime(task.dueTime)}</span>}
                  </div>
                )}
              </div>

              {/* Star */}
              <button
                className="bevel-button"
                style={{
                  padding: '1px 4px',
                  fontSize: 14,
                  minWidth: 'auto',
                  background: task.isStarred ? '#FFFF00' : undefined,
                }}
                onClick={() => onToggleStar(task.id)}
                title={task.isStarred ? 'Remove star' : 'Add star'}
              >
                {task.isStarred ? '★' : '☆'}
              </button>

              {/* Edit */}
              <button
                className="bevel-button"
                style={{ padding: '1px 4px', fontSize: 14, minWidth: 'auto' }}
                onClick={() => setEditingTask(task)}
                title="Edit task"
              >
                ✏️
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Status bar */}
      <div className="bevel-inset" style={{
        padding: '2px 6px',
        fontSize: 12,
        display: 'flex',
        justifyContent: 'space-between',
        color: '#000',
      }}>
        <span>
          {filteredTasks.filter((t) => t.isCompleted).length}/{filteredTasks.length} completed
        </span>
        <span>☁️ Synced with Firebase</span>
      </div>
    </div>
  );
}
