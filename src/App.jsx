import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { getTasks, addTask, updateTask, toggleComplete, toggleStar } from './services/taskService';
import Desktop from './components/habit/Desktop';
import Win98Login from './components/habit/Win98Login';
import './index.css';

const GUEST_TASKS_KEY = 'habitTracker_guestTasks';

const loadGuestTasks = () => {
  try {
    const raw = localStorage.getItem(GUEST_TASKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveGuestTasks = (tasks) => {
  localStorage.setItem(GUEST_TASKS_KEY, JSON.stringify(tasks));
};

function App() {
  const { currentUser, loading: authLoading, isGuest } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);

  // Real-time tasks listener (Firebase) or load from localStorage (Guest)
  useEffect(() => {
    if (!currentUser) {
      setTasks([]);
      setTasksLoading(false);
      return;
    }

    if (isGuest) {
      setTasks(loadGuestTasks());
      setTasksLoading(false);
      return;
    }

    setTasksLoading(true);

    const unsubscribe = getTasks(currentUser.uid, (fetchedTasks) => {
      setTasks(fetchedTasks);
      setTasksLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, isGuest]);

  // Save guest tasks whenever they change
  useEffect(() => {
    if (isGuest && currentUser) {
      saveGuestTasks(tasks);
    }
  }, [tasks, isGuest, currentUser]);

  // Add or edit task
  const handleAddTask = async (taskData) => {
    if (isGuest) {
      const newTask = {
        id: 'guest_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
        title: taskData.title,
        description: taskData.description || '',
        dueDate: taskData.dueDate || null,
        dueTime: taskData.dueTime || null,
        isCompleted: false,
        isStarred: false,
        createdAt: new Date().toISOString(),
      };
      setTasks((prev) => [newTask, ...prev]);
      return;
    }
    try {
      await addTask(currentUser.uid, {
        title: taskData.title,
        description: taskData.description,
        dueDate: taskData.dueDate,
        dueTime: taskData.dueTime,
      });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleEditTask = async (taskData) => {
    if (isGuest) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskData.id
            ? { ...t, title: taskData.title, description: taskData.description, dueDate: taskData.dueDate, dueTime: taskData.dueTime }
            : t
        )
      );
      return;
    }
    try {
      await updateTask(taskData.id, {
        title: taskData.title,
        description: taskData.description,
        dueDate: taskData.dueDate,
        dueTime: taskData.dueTime,
      });
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  const handleToggleComplete = async (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    if (isGuest) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, isCompleted: !t.isCompleted, completedAt: !t.isCompleted ? new Date().toISOString() : null } : t
        )
      );
      return;
    }
    try {
      await toggleComplete(taskId, !task.isCompleted);
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  const handleToggleStar = async (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    if (isGuest) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, isStarred: !t.isStarred } : t
        )
      );
      return;
    }
    try {
      await toggleStar(taskId, !task.isStarred);
    } catch (error) {
      console.error('Error toggling task star:', error);
    }
  };

  // Show login page if not authenticated
  if (!currentUser && !authLoading) {
    return <Win98Login />;
  }

  // Show loading only during auth check (not tasks - let Desktop handle that)
  if (authLoading) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'VT323', monospace",
      }}>
        <div className="desktop-bg" />
        <div className="crt-scanlines" />
        <div className="crt-grain" />
        <div className="terminal-box" style={{ fontSize: 18, padding: 24, textAlign: 'center' }}>
          <div className="neon-text" style={{ marginBottom: 8 }}>LOADING KAIZEN...</div>
          <div className="neon-text-dim">Connecting to Firebase...</div>
        </div>
      </div>
    );
  }

  return (
    <Desktop
      firebaseTasks={tasks}
      tasksLoading={tasksLoading}
      onAddTask={handleAddTask}
      onEditTask={handleEditTask}
      onToggleComplete={handleToggleComplete}
      onToggleStar={handleToggleStar}
    />
  );
}

export default App;
