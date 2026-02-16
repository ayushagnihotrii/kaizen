import React from 'react';

const MENU_ITEMS = [
  { id: 'tasks', label: 'Tasks', icon: '📋' },
  { id: 'activity', label: 'Activity', icon: '📈' },
  { id: 'divider0', divider: true },
  { id: 'newhabit', label: 'New Habit', icon: '📝' },
  { id: 'habits', label: 'View All Habits', icon: '✅' },
  { id: 'stats', label: 'Statistics', icon: '📊' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
  { id: 'divider1', divider: true },
  { id: 'about', label: 'About', icon: 'ℹ️' },
];

export default function StartMenu({ onItemClick, onClose, currentUser, onLogout }) {
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
          <span className="start-menu-sidebar-text">HABIT SYSTEM v2.0</span>
        </div>

        {/* Menu items */}
        <div className="start-menu-items">
          {/* User info section */}
          {currentUser && (
            <>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 12px',
                  borderBottom: '1px solid #808080',
                  marginBottom: 4,
                }}
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="User"
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 2,
                      border: '1px solid #808080',
                      imageRendering: 'pixelated',
                    }}
                  />
                ) : (
                  <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>👤</span>
                )}
                <div style={{ overflow: 'hidden' }}>
                  <div style={{
                    fontSize: 14,
                    color: '#fff',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: 140,
                  }}>
                    {currentUser.displayName || 'User'}
                  </div>
                  <div style={{
                    fontSize: 11,
                    color: '#808080',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: 140,
                  }}>
                    {currentUser.email}
                  </div>
                </div>
              </div>
            </>
          )}

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

          {/* Logout */}
          {onLogout && (
            <>
              <div className="start-menu-divider" />
              <div
                className="start-menu-item"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                style={{ color: '#ff6666' }}
              >
                <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>🔌</span>
                <span>Shut Down (Logout)</span>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
