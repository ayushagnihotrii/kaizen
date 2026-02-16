import React from 'react';

const MENU_ITEMS = [
  { id: 'newhabit', label: 'New Habit', icon: '📝' },
  { id: 'habits', label: 'View All Habits', icon: '📋' },
  { id: 'stats', label: 'Statistics', icon: '📊' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
  { id: 'divider1', divider: true },
  { id: 'about', label: 'About', icon: 'ℹ️' },
];

export default function StartMenu({ onItemClick, onClose }) {
  return (
    <>
      {/* Invisible overlay to close menu on click outside */}
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 9990 }}
        onClick={onClose}
      />
      <div className="start-menu">
        {/* Vertical sidebar */}
        <div className="start-menu-sidebar">
          <span className="start-menu-sidebar-text">HABIT SYSTEM v1.0</span>
        </div>

        {/* Menu items */}
        <div className="start-menu-items">
          {MENU_ITEMS.map((item) =>
            item.divider ? (
              <div key={item.id} className="start-menu-divider" />
            ) : (
              <div
                key={item.id}
                className="start-menu-item"
                onClick={() => {
                  onItemClick(item.id);
                  onClose();
                }}
              >
                <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}
