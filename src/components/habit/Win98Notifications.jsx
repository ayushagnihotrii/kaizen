import React, { useState, useEffect } from 'react';
import { parseISO, differenceInMinutes } from 'date-fns';

export default function Win98Notifications({ tasks = [], onOpenWindow }) {
  const [isOpen, setIsOpen] = useState(false);
  const [upcomingTasks, setUpcomingTasks] = useState([]);

  useEffect(() => {
    const notifiedRef = new Set();
    const check = () => {
      const now = new Date();
      const upcoming = tasks.filter((task) => {
        if (task.isCompleted || !task.dueDate) return false;
        let taskDateTime;
        if (task.dueTime) {
          taskDateTime = parseISO(`${task.dueDate}T${task.dueTime}`);
        } else {
          taskDateTime = parseISO(`${task.dueDate}T23:59:59`);
        }
        const minutesUntilDue = differenceInMinutes(taskDateTime, now);
        return minutesUntilDue > 0 && minutesUntilDue <= 60;
      });
      setUpcomingTasks(upcoming);

      // Browser notifications at 60, 30, and 15 minute marks
      if ('Notification' in window && Notification.permission === 'granted' && upcoming.length > 0) {
        upcoming.forEach((task) => {
          const taskDateTime = task.dueTime
            ? parseISO(`${task.dueDate}T${task.dueTime}`)
            : parseISO(`${task.dueDate}T23:59:59`);
          const minutesLeft = differenceInMinutes(taskDateTime, now);

          const thresholds = [
            { min: 58, max: 62, label: '1 hour', key: `${task.id}-60` },
            { min: 28, max: 32, label: '30 minutes', key: `${task.id}-30` },
            { min: 13, max: 17, label: '15 minutes', key: `${task.id}-15` },
          ];

          thresholds.forEach(({ min, max, label, key }) => {
            if (minutesLeft >= min && minutesLeft <= max && !notifiedRef.has(key)) {
              notifiedRef.add(key);
              new Notification(`⏰ Task Due in ~${label}!`, {
                body: `"${task.title}" is due in ${minutesLeft} minutes`,
                tag: key,
              });
            }
          });
        });
      }
    };
    check();
    const interval = setInterval(check, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [tasks]);

  const requestPermission = async () => {
    if ('Notification' in window) {
      await Notification.requestPermission();
    }
  };

  const formatTimeRemaining = (task) => {
    const now = new Date();
    const taskDateTime = task.dueTime
      ? parseISO(`${task.dueDate}T${task.dueTime}`)
      : parseISO(`${task.dueDate}T23:59:59`);
    const minutesLeft = differenceInMinutes(taskDateTime, now);
    return minutesLeft < 60 ? `${minutesLeft}m left` : 'Due soon';
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Bell button */}
      <button
        className="bevel-button"
        style={{
          padding: '2px 6px',
          fontSize: 14,
          position: 'relative',
          height: 28,
          minWidth: 'auto',
        }}
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        title="Notifications"
      >
        🔔
        {upcomingTasks.length > 0 && (
          <span style={{
            position: 'absolute',
            top: -4,
            right: -4,
            background: '#FF0000',
            color: '#FFF',
            fontSize: 10,
            fontWeight: 'bold',
            borderRadius: '50%',
            width: 14,
            height: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'blink 1s step-end infinite',
          }}>
            {upcomingTasks.length}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 9989 }}
            onClick={() => setIsOpen(false)}
          />
          <div
            className="win98-window"
            style={{
              position: 'absolute',
              bottom: 32,
              right: 0,
              width: 280,
              maxHeight: 300,
              zIndex: 9992,
            }}
          >
            <div className="win98-titlebar" style={{ cursor: 'default' }}>
              <span className="win98-title-text">🔔 Notifications</span>
              <div className="win98-title-buttons">
                <button className="win98-title-btn" onClick={() => setIsOpen(false)}>×</button>
              </div>
            </div>
            <div className="win98-content" style={{ maxHeight: 250, overflowY: 'auto' }}>
              {'Notification' in window && Notification.permission !== 'granted' && (
                <div style={{
                  padding: 6,
                  marginBottom: 6,
                  background: '#0a1a0a',
                  border: '1px solid #1a2a1a',
                  fontSize: 12,
                }}>
                  <div>Enable browser notifications?</div>
                  <button
                    className="bevel-button"
                    style={{ fontSize: 12, padding: '1px 8px', marginTop: 4 }}
                    onClick={requestPermission}
                  >
                    ENABLE
                  </button>
                </div>
              )}

              {upcomingTasks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 16, color: '#1a8c00', fontSize: 14 }}>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>🔔</div>
                  <div>No upcoming tasks</div>
                  <div style={{ fontSize: 12 }}>Tasks due within 1 hour appear here</div>
                </div>
              ) : (
                upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    style={{
                      padding: 6,
                      borderBottom: '1px solid #1a2a1a',
                      fontSize: 14,
                    }}
                  >
                    <div style={{ fontWeight: 'bold' }}>⚠️ {task.title}</div>
                    {task.description && (
                      <div style={{
                        fontSize: 12,
                        color: '#1a8c00',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {task.description}
                      </div>
                    )}
                    <div style={{
                      marginTop: 4,
                      display: 'inline-block',
                      padding: '1px 6px',
                      background: '#FF0000',
                      color: '#FFF',
                      fontSize: 11,
                    }}>
                      ⏰ {formatTimeRemaining(task)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
