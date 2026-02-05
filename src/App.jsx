import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { getTasks, addTask, updateTask, toggleComplete, toggleStar } from './services/taskService';
import Sidebar from './components/Sidebar';
import TaskList from './components/TaskList';
import AddTaskModal from './components/AddTaskModal';
import NotificationBell from './components/NotificationBell';
import LoginPage from './components/LoginPage';
import ActivityHeatmap from './components/ActivityHeatmap';
import './index.css';

function App() {
  const { currentUser, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [currentView, setCurrentView] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [tasksLoading, setTasksLoading] = useState(true);

  // Real-time tasks listener
  useEffect(() => {
    if (!currentUser) {
      setTasks([]);
      setTasksLoading(false);
      return;
    }

    setTasksLoading(true);

    // Subscribe to real-time updates
    const unsubscribe = getTasks(currentUser.uid, (fetchedTasks) => {
      setTasks(fetchedTasks);
      setTasksLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [currentUser]);

  // Filter tasks based on current view
  const filteredTasks = currentView === 'starred'
    ? tasks.filter((task) => task.isStarred)
    : tasks;

  // Add or edit task
  const handleAddTask = async (taskData) => {
    try {
      if (taskData.id) {
        // Editing existing task
        await updateTask(taskData.id, {
          title: taskData.title,
          description: taskData.description,
          dueDate: taskData.dueDate,
          dueTime: taskData.dueTime,
        });
        setEditingTask(null);
      } else {
        // Adding new task
        await addTask(currentUser.uid, {
          title: taskData.title,
          description: taskData.description,
          dueDate: taskData.dueDate,
          dueTime: taskData.dueTime,
        });
      }
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Failed to save task. Please try again.');
    }
  };

  // Open edit modal
  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // Close modal and reset editing state
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  // Toggle task completion
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

  // Toggle task starred status
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
  if (!currentUser) {
    return <LoginPage />;
  }

  // Show loading spinner while checking auth or loading tasks
  if (authLoading || tasksLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-google-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dark min-h-screen bg-dark-bg flex">
      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="md:hidden bg-dark-surface border-b border-gray-700 p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-gray-300 hover:text-white transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-white">Tasks</h1>
          </div>
          <NotificationBell tasks={tasks} />
        </header>

        {/* Desktop header with notification bell */}
        <header className="hidden md:flex bg-dark-surface border-b border-gray-700 px-6 py-4 items-center justify-between">
          <h1 className="text-2xl font-semibold text-white">
            {currentView === 'activity' ? 'Activity' : 'My Tasks'}
          </h1>
          <NotificationBell tasks={tasks} />
        </header>

        {/* Main content area - conditionally render based on view */}
        {currentView === 'activity' ? (
          <div className="flex-1 overflow-y-auto p-6">
            <ActivityHeatmap tasks={tasks} />
          </div>
        ) : (
          <TaskList
            tasks={filteredTasks}
            onToggleComplete={handleToggleComplete}
            onToggleStar={handleToggleStar}
            onEdit={handleEditTask}
            onOpenModal={() => setIsModalOpen(true)}
            currentView={currentView}
          />
        )}
      </div>

      {/* Add/Edit task modal */}
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddTask={handleAddTask}
        editTask={editingTask}
      />
    </div>
  );
}

export default App;
