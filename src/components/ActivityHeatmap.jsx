import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ActivityHeatmap = ({ tasks = [] }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    // Get color intensity class based on task count
    const getIntensityClass = (count) => {
        if (count === 0) return 'bg-white/5';
        if (count === 1) return 'bg-primary/10';
        if (count <= 3) return 'bg-primary/30';
        if (count <= 5) return 'bg-primary/50';
        if (count <= 8) return 'bg-primary/70';
        if (count <= 10) return 'bg-primary/90';
        return 'bg-primary';
    };

    // Aggregate tasks by date
    const tasksByDate = useMemo(() => {
        const aggregated = {};

        tasks.forEach(task => {
            if (task.completed && task.completedAt) {
                // Convert Firestore timestamp to date string
                const date = task.completedAt.toDate ?
                    task.completedAt.toDate() :
                    new Date(task.completedAt);

                const dateKey = date.toISOString().split('T')[0];
                aggregated[dateKey] = (aggregated[dateKey] || 0) + 1;
            }
        });

        return aggregated;
    }, [tasks]);

    // Generate calendar grid for current month
    const calendarData = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // Get first and last day of month
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const daysInMonth = lastDay.getDate();
        const startDayOfWeek = firstDay.getDay(); // 0 = Sunday

        const grid = [];

        // Add empty cells for days before month starts
        for (let i = 0; i < startDayOfWeek; i++) {
            grid.push({ isEmpty: true });
        }

        // Add all days in month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateKey = date.toISOString().split('T')[0];
            const taskCount = tasksByDate[dateKey] || 0;

            grid.push({
                date: dateKey,
                day,
                taskCount,
                dayOfWeek: date.getDay(),
            });
        }

        return grid;
    }, [currentDate, tasksByDate]);

    // Navigate to previous month
    const goToPreviousMonth = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    // Navigate to next month
    const goToNextMonth = () => {
        const today = new Date();
        const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

        // Don't allow navigation beyond current month
        if (nextMonth <= today) {
            setCurrentDate(nextMonth);
        }
    };

    // Check if we can navigate to next month
    const canGoNext = () => {
        const today = new Date();
        const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        return nextMonth <= today;
    };

    // Format month and year for display
    const monthYear = currentDate.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    });

    // Calculate total tasks for the month
    const totalTasksThisMonth = calendarData.reduce((sum, day) =>
        sum + (day.taskCount || 0), 0
    );

    return (
        <div className="glass-panel p-8 rounded-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-playfair font-bold text-white mb-2">
                        Activity Overview
                    </h2>
                    <p className="text-white/60">
                        {totalTasksThisMonth} tasks completed in {monthYear}
                    </p>
                </div>

                {/* Month Navigation */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={goToPreviousMonth}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 
                                 transition-all duration-200 text-white/80 hover:text-white"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <span className="text-white font-medium min-w-[140px] text-center">
                        {monthYear}
                    </span>

                    <button
                        onClick={goToNextMonth}
                        disabled={!canGoNext()}
                        className={`p-2 rounded-lg transition-all duration-200
                                  ${canGoNext()
                                ? 'bg-white/5 hover:bg-white/10 text-white/80 hover:text-white'
                                : 'bg-white/5 text-white/20 cursor-not-allowed'}`}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Day of week labels */}
            <div className="grid grid-cols-7 gap-2 mb-3">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-xs text-white/40 font-medium">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 mb-6">
                {calendarData.map((cell, index) => {
                    if (cell.isEmpty) {
                        return <div key={`empty-${index}`} className="aspect-square" />;
                    }

                    const intensityClass = getIntensityClass(cell.taskCount);

                    return (
                        <div
                            key={cell.date}
                            className="relative group"
                        >
                            <div
                                className={`aspect-square rounded-lg ${intensityClass} 
                                          border border-white/10 transition-all duration-200
                                          hover:scale-110 hover:ring-2 hover:ring-primary/50
                                          flex items-center justify-center
                                          text-xs font-medium text-white/60`}
                            >
                                {cell.day}
                            </div>

                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                                          opacity-0 group-hover:opacity-100 pointer-events-none
                                          transition-opacity duration-200 z-10">
                                <div className="glass-panel px-3 py-2 rounded-lg whitespace-nowrap
                                              text-sm text-white shadow-xl">
                                    <div className="font-medium">
                                        {new Date(cell.date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </div>
                                    <div className="text-white/60">
                                        {cell.taskCount} {cell.taskCount === 1 ? 'task' : 'tasks'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between pt-6 border-t border-white/10">
                <span className="text-sm text-white/40">Less</span>
                <div className="flex items-center gap-1">
                    <div className="w-6 h-6 rounded bg-white/5 border border-white/10" />
                    <div className="w-6 h-6 rounded bg-primary/10 border border-white/10" />
                    <div className="w-6 h-6 rounded bg-primary/30 border border-white/10" />
                    <div className="w-6 h-6 rounded bg-primary/50 border border-white/10" />
                    <div className="w-6 h-6 rounded bg-primary/70 border border-white/10" />
                    <div className="w-6 h-6 rounded bg-primary/90 border border-white/10" />
                    <div className="w-6 h-6 rounded bg-primary border border-white/10" />
                </div>
                <span className="text-sm text-white/40">More</span>
            </div>
        </div>
    );
};

export default ActivityHeatmap;
