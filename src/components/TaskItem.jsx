import React from 'react';
import { Circle, CheckCircle2, Star, Calendar, Clock, Pencil } from 'lucide-react';
import { format } from 'date-fns';

const TaskItem = ({ task, onToggleComplete, onToggleStar, onEdit }) => {
    const formattedDate = task.dueDate
        ? format(new Date(task.dueDate), 'MMM dd, yyyy')
        : null;

    const formattedTime = task.dueTime
        ? new Date(`2000-01-01T${task.dueTime}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        })
        : null;

    return (
        <div
            className={`
        group flex items-start gap-3 p-5 rounded-2xl
        glass hover:glass-strong
        border border-glass-border hover:border-white/20
        transition-all duration-300
        ${task.isCompleted ? 'opacity-60' : 'opacity-100'}
        transform hover:scale-[1.01] hover:shadow-glass
        animate-slide-up
      `}
        >
            {/* Complete button */}
            <button
                onClick={() => onToggleComplete(task.id)}
                className="flex-shrink-0 mt-0.5 transition-all duration-300 hover:scale-110"
                aria-label={task.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
            >
                {task.isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-accent-purple drop-shadow-glow" />
                ) : (
                    <Circle className="w-6 h-6 text-gray-500 hover:text-accent-purple" />
                )}
            </button>

            {/* Task content */}
            <div className="flex-1 min-w-0">
                <h3
                    className={`
            text-base font-medium mb-1 transition-all
            ${task.isCompleted
                            ? 'line-through text-gray-500'
                            : 'text-white'
                        }
          `}
                >
                    {task.title}
                </h3>

                {task.description && (
                    <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                        {task.description}
                    </p>
                )}

                {/* Date and time */}
                {(formattedDate || formattedTime) && (
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        {formattedDate && (
                            <div className="flex items-center gap-1.5 glass px-2.5 py-1 rounded-lg">
                                <Calendar className="w-3.5 h-3.5 text-accent-purple" />
                                <span>{formattedDate}</span>
                            </div>
                        )}
                        {formattedTime && (
                            <div className="flex items-center gap-1.5 glass px-2.5 py-1 rounded-lg">
                                <Clock className="w-3.5 h-3.5 text-accent-pink" />
                                <span>{formattedTime}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
                {/* Edit button */}
                <button
                    onClick={() => onEdit(task)}
                    className="flex-shrink-0 mt-0.5 text-gray-500 hover:text-accent-purple transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
                    aria-label="Edit task"
                >
                    <Pencil className="w-4 h-4" />
                </button>

                {/* Star button */}
                <button
                    onClick={() => onToggleStar(task.id)}
                    className="flex-shrink-0 mt-0.5 transition-all duration-300 hover:scale-110"
                    aria-label={task.isStarred ? 'Remove from starred' : 'Add to starred'}
                >
                    <Star
                        className={`w-5 h-5 ${task.isStarred
                            ? 'fill-yellow-400 text-yellow-400 drop-shadow-glow'
                            : 'text-gray-500 hover:text-yellow-400'
                            }`}
                    />
                </button>
            </div>
        </div>
    );
};

export default TaskItem;
