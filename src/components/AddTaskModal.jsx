import React, { useState, useEffect } from 'react';
import { X, Calendar, FileText, Clock } from 'lucide-react';

const AddTaskModal = ({ isOpen, onClose, onAddTask, editTask = null }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [dueTime, setDueTime] = useState('');

    // Pre-populate form when editing
    useEffect(() => {
        if (editTask) {
            setTitle(editTask.title || '');
            setDescription(editTask.description || '');
            setDueDate(editTask.dueDate || '');
            setDueTime(editTask.dueTime || '');
        } else {
            setTitle('');
            setDescription('');
            setDueDate('');
            setDueTime('');
        }
    }, [editTask, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!title.trim()) {
            alert('Please enter a task title');
            return;
        }

        onAddTask({
            id: editTask?.id,
            title: title.trim(),
            description: description.trim(),
            dueDate: dueDate || null,
            dueTime: dueTime || null,
        });

        setTitle('');
        setDescription('');
        setDueDate('');
        setDueTime('');
        onClose();
    };

    const handleCancel = () => {
        setTitle('');
        setDescription('');
        setDueDate('');
        setDueTime('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-md"
                onClick={handleCancel}
            />

            {/* Modal */}
            <div
                className="
          relative glass-strong rounded-3xl shadow-glass-lg
          w-full max-w-lg p-8
          border border-glass-border
          transform transition-all duration-300
          animate-scale-in
        "
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-3xl font-display font-bold text-white glow-text">
                        {editTask ? 'Edit Task' : 'Add New Task'}
                    </h3>
                    <button
                        onClick={handleCancel}
                        className="text-gray-400 hover:text-white transition-all duration-300 p-2 hover:bg-white/5 rounded-lg hover:scale-110"
                        aria-label="Close"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Title Input */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                            <FileText className="w-4 h-4 text-accent-purple" />
                            Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="What needs to be done?"
                            className="
                w-full px-4 py-3 rounded-xl
                glass border border-glass-border
                text-white placeholder-gray-500
                focus:outline-none focus:border-accent-purple focus:shadow-glow
                transition-all duration-300
              "
                            autoFocus
                        />
                    </div>

                    {/* Description Input */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                            <FileText className="w-4 h-4 text-accent-purple" />
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add more details..."
                            rows="3"
                            className="
                w-full px-4 py-3 rounded-xl
                glass border border-glass-border
                text-white placeholder-gray-500
                focus:outline-none focus:border-accent-purple focus:shadow-glow
                transition-all duration-300
                resize-none
              "
                        />
                    </div>

                    {/* Date and Time Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Due Date */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                                <Calendar className="w-4 h-4 text-accent-purple" />
                                Due Date
                            </label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="
                  w-full px-4 py-3 rounded-xl
                  glass border border-glass-border
                  text-white
                  focus:outline-none focus:border-accent-purple focus:shadow-glow
                  transition-all duration-300
                "
                            />
                        </div>

                        {/* Due Time */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                                <Clock className="w-4 h-4 text-accent-pink" />
                                Due Time
                            </label>
                            <input
                                type="time"
                                value={dueTime}
                                onChange={(e) => setDueTime(e.target.value)}
                                className="
                  w-full px-4 py-3 rounded-xl
                  glass border border-glass-border
                  text-white
                  focus:outline-none focus:border-accent-pink focus:shadow-glow-accent
                  transition-all duration-300
                "
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="
                flex-1 px-6 py-3 rounded-xl
                glass border border-glass-border
                text-gray-300 hover:text-white
                font-medium
                transition-all duration-300
                hover:scale-[1.02] active:scale-[0.98]
              "
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="
                group flex-1 px-6 py-3 rounded-xl
                glass-strong border border-accent-purple/50
                text-white font-medium
                transition-all duration-300
                hover:shadow-glow
                hover:scale-[1.02] active:scale-[0.98]
                relative overflow-hidden
              "
                        >
                            <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                            <span className="relative z-10">
                                {editTask ? 'Save Changes' : 'Add Task'}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTaskModal;
