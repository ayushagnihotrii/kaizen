import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { getTasks, addTask, updateTask, toggleComplete, toggleStar } from './services/taskService';
import Desktop from './components/habit/Desktop';
import Win98Login from './components/habit/Win98Login';
import './index.css';

function App() {
  const { currentUser, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);

  // Real-time tasks listener
  useEffect(() => {
    if (!currentUser) {
      setTasks([]);
      setTasksLoading(false);
      return;
    }

    setTasksLoading(true);

    const unsubscribe = getTasks(currentUser.uid, (fetchedTasks) => {
      setTasks(fetchedTasks);
      setTasksLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Add or edit task
  const handleAddTask = async (taskData) => {
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
    if (task) {
      try {
        await toggleComplete(taskId, !task.isCompleted);
      } catch (error) {
        console.error('Error toggling task completion:', error);
      }
    }
  };

  const handleToggleStar = async (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      try {
        await toggleStar(taskId, !task.isStarred);
      } catch (error) {
        console.error('Error toggling task star:', error);
      }
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
          <div className="neon-text" style={{ marginBottom: 8 }}>LOADING HABIT.SYS...</div>
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
