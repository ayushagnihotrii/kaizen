import React from 'react';
import { Plus } from 'lucide-react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onToggleComplete, onToggleStar, onEdit, onOpenModal, currentView }) => {
    const viewTitle = currentView === 'starred' ? 'Starred Tasks' : 'My Tasks';

    return (
        <div className="flex-1 overflow-auto">
            <div className="max-w-4xl mx-auto p-6 md:p-8">
                {/* Header */}
                <div className="mb-8 animate-fade-in">
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-3 glow-text">
                        {viewTitle}
                    </h2>
                    <p className="text-gray-400 text-lg">
                        {tasks.length === 0
                            ? 'No tasks yet. Start by adding one below.'
                            : `${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'}`}
                    </p>
                </div>

                {/* Task list */}
                <div className="space-y-3 mb-8">
                    {tasks.map((task, index) => (
                        <div
                            key={task.id}
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <TaskItem
                                task={task}
                                onToggleComplete={onToggleComplete}
                                onToggleStar={onToggleStar}
                                onEdit={onEdit}
                            />
                        </div>
                    ))}
                </div>

                {/* Add task button */}
                <button
                    onClick={onOpenModal}
                    className="
            group flex items-center gap-3 px-6 py-4 rounded-2xl
            glass-strong hover:shadow-glow
            text-white font-medium text-lg
            transition-all duration-300
            border border-glass-border hover:border-accent-purple/50
            transform hover:scale-[1.02] active:scale-[0.98]
            relative overflow-hidden
          "
                >
                    {/* Button glow effect */}
                    <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-20 transition-opacity duration-300" />

                    <Plus className="w-6 h-6 text-accent-purple" />
                    <span className="relative z-10">Add Task</span>
                </button>
            </div>
        </div>
    );
};

export default TaskList;
