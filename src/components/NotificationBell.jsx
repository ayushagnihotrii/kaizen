import React, { useState, useEffect } from 'react';
import { Bell, X, Clock, Calendar } from 'lucide-react';
import { format, parseISO, differenceInMinutes, isAfter, isBefore } from 'date-fns';

const NotificationBell = ({ tasks }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [upcomingTasks, setUpcomingTasks] = useState([]);
    const [hasPermission, setHasPermission] = useState(false);

    // Request notification permission on mount
    useEffect(() => {
        if ('Notification' in window && Notification.permission === 'granted') {
            setHasPermission(true);
        }
    }, []);

    // Check for upcoming tasks (due within 1 hour)
    useEffect(() => {
        const checkUpcomingTasks = () => {
            const now = new Date();
            const upcoming = tasks.filter((task) => {
                if (task.isCompleted || !task.dueDate) return false;

                // Combine date and time
                let taskDateTime;
                if (task.dueTime) {
                    taskDateTime = parseISO(`${task.dueDate}T${task.dueTime}`);
                } else {
                    // If no time, use end of day
                    taskDateTime = parseISO(`${task.dueDate}T23:59:59`);
                }

                const minutesUntilDue = differenceInMinutes(taskDateTime, now);

                // Task is upcoming if it's within 60 minutes and hasn't passed
                return minutesUntilDue > 0 && minutesUntilDue <= 60;
            });

            setUpcomingTasks(upcoming);

            // Send browser notification for new upcoming tasks
            if (hasPermission && upcoming.length > 0) {
                upcoming.forEach((task) => {
                    const taskDateTime = task.dueTime
                        ? parseISO(`${task.dueDate}T${task.dueTime}`)
                        : parseISO(`${task.dueDate}T23:59:59`);
                    const minutesLeft = differenceInMinutes(taskDateTime, now);

                    // Only notify if exactly around 60 minutes (with 1-minute tolerance)
                    if (minutesLeft >= 59 && minutesLeft <= 61) {
                        new Notification('Task Due Soon!', {
                            body: `"${task.title}" is due in ${minutesLeft} minutes`,
                            icon: '/favicon.ico',
                            tag: task.id, // Prevent duplicate notifications
                        });
                    }
                });
            }
        };

        // Check immediately
        checkUpcomingTasks();

        // Check every minute
        const interval = setInterval(checkUpcomingTasks, 60000);

        return () => clearInterval(interval);
    }, [tasks, hasPermission]);

    const requestNotificationPermission = async () => {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            setHasPermission(permission === 'granted');
        }
    };

    const formatTimeRemaining = (task) => {
        const now = new Date();
        const taskDateTime = task.dueTime
            ? parseISO(`${task.dueDate}T${task.dueTime}`)
            : parseISO(`${task.dueDate}T23:59:59`);
        const minutesLeft = differenceInMinutes(taskDateTime, now);

        if (minutesLeft < 60) {
            return `${minutesLeft} min left`;
        }
        return 'Due soon';
    };

    return (
        <div className="relative">
            {/* Bell Icon Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-dark-hover"
                aria-label="Notifications"
            >
                <Bell className="w-6 h-6" />
                {upcomingTasks.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                        {upcomingTasks.length}
                    </span>
                )}
            </button>

            {/* Notification Dropdown */}
            {isOpen && (
                <>
                    {/* Backdrop for mobile */}
                    <div
                        className="fixed inset-0 z-40 md:hidden"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown Panel */}
                    <div className="absolute right-0 mt-2 w-80 bg-dark-surface rounded-lg shadow-2xl border border-gray-700 z-50 max-h-96 overflow-hidden flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-700">
                            <h3 className="text-lg font-semibold text-white">
                                Notifications
                            </h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Notification Permission */}
                        {!hasPermission && (
                            <div className="p-4 bg-google-blue bg-opacity-10 border-b border-gray-700">
                                <p className="text-sm text-gray-300 mb-2">
                                    Enable browser notifications to get alerts
                                </p>
                                <button
                                    onClick={requestNotificationPermission}
                                    className="text-sm px-3 py-1.5 bg-google-blue text-white rounded-md hover:bg-opacity-90 transition-all"
                                >
                                    Enable Notifications
                                </button>
                            </div>
                        )}

                        {/* Notification List */}
                        <div className="overflow-y-auto flex-1">
                            {upcomingTasks.length === 0 ? (
                                <div className="p-8 text-center">
                                    <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                                    <p className="text-gray-400 text-sm">
                                        No upcoming tasks
                                    </p>
                                    <p className="text-gray-500 text-xs mt-1">
                                        Tasks due within 1 hour will appear here
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-700">
                                    {upcomingTasks.map((task) => {
                                        const taskDateTime = task.dueTime
                                            ? parseISO(`${task.dueDate}T${task.dueTime}`)
                                            : parseISO(`${task.dueDate}T23:59:59`);
                                        const formattedDate = format(taskDateTime, 'MMM dd, yyyy');
                                        const formattedTime = task.dueTime
                                            ? new Date(`2000-01-01T${task.dueTime}`).toLocaleTimeString('en-US', {
                                                hour: 'numeric',
                                                minute: '2-digit',
                                                hour12: true,
                                            })
                                            : 'End of day';

                                        return (
                                            <div
                                                key={task.id}
                                                className="p-4 hover:bg-dark-hover transition-colors"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="flex-shrink-0 mt-1">
                                                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-white font-medium text-sm mb-1">
                                                            {task.title}
                                                        </h4>
                                                        {task.description && (
                                                            <p className="text-gray-400 text-xs mb-2 line-clamp-1">
                                                                {task.description}
                                                            </p>
                                                        )}
                                                        <div className="flex items-center gap-3 text-xs text-gray-500">
                                                            <div className="flex items-center gap-1">
                                                                <Calendar className="w-3 h-3" />
                                                                <span>{formattedDate}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                <span>{formattedTime}</span>
                                                            </div>
                                                        </div>
                                                        <div className="mt-2">
                                                            <span className="inline-block px-2 py-1 bg-red-500 bg-opacity-20 text-red-400 text-xs font-medium rounded">
                                                                {formatTimeRemaining(task)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationBell;
