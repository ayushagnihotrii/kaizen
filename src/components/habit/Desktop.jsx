import React, { useState, useCallback, useEffect, useRef } from 'react';
import Win98Window from './Win98Window';
import DesktopIcon from './DesktopIcon';
import Taskbar from './Taskbar';
import StartMenu from './StartMenu';
import NewHabitWindow from './NewHabitWindow';
import HabitListWindow from './HabitListWindow';
import StatsWindow from './StatsWindow';
import SettingsWindow from './SettingsWindow';
import AboutWindow from './AboutWindow';
import TasksWindow from './TasksWindow';
import Win98ActivityWindow from './Win98ActivityWindow';
import TodaysTaskWindow from './TodaysTaskWindow';
import Win98Notifications from './Win98Notifications';
import TodaysTaskWidget from './TodaysTaskWidget';
import ContextMenu from './ContextMenu';
import BootScreen from './BootScreen';
import { useAuth } from '../../contexts/AuthContext';

// ── localStorage helpers ──────────────────────────
const STORAGE_KEY = 'habitTracker_habits';
const SETTINGS_KEY = 'habitTracker_settings';

const loadHabits = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveHabits = (habits) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
};

const loadSettings = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : defaultSettings();
  } catch {
    return defaultSettings();
  }
};

const saveSettings = (settings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

const defaultSettings = () => ({
  soundEnabled: false,
  scanlines: true,
  flicker: true,
  grain: true,
  vignette: true,
  wallpaper: '/bg.jpg',
});

// ── Window definitions ────────────────────────────
const WINDOW_DEFS = {
  newhabit: {
    title: 'NewHabit.exe',
    defaultPosition: { x: 180, y: 40 },
    defaultSize: { width: 440, height: 520 },
  },
  habits: {
    title: 'MyHabits.txt',
    defaultPosition: { x: 220, y: 30 },
    defaultSize: { width: 520, height: 480 },
  },
  stats: {
    title: 'Stats.exe',
    defaultPosition: { x: 260, y: 50 },
    defaultSize: { width: 500, height: 520 },
  },
  settings: {
    title: 'Settings.exe',
    defaultPosition: { x: 300, y: 40 },
    defaultSize: { width: 420, height: 500 },
  },
  about: {
    title: 'About - KAIZEN',
    defaultPosition: { x: 340, y: 80 },
    defaultSize: { width: 400, height: 440 },
  },
  tasks: {
    title: 'Tasks.exe',
    defaultPosition: { x: 200, y: 30 },
    defaultSize: { width: 520, height: 520 },
  },
  activity: {
    title: 'Activity.exe',
    defaultPosition: { x: 240, y: 50 },
    defaultSize: { width: 480, height: 500 },
  },
  todaystask: {
    title: 'TodaysTask.exe',
    defaultPosition: { x: 300, y: 40 },
    defaultSize: { width: 500, height: 520 },
  },
};

// Desktop icon definitions
const DESKTOP_ICONS = [
  { id: 'tasks', label: 'Tasks.exe', iconType: 'tasks' },
  { id: 'todaystask', label: 'TodaysTask.exe', iconType: 'todaystask' },
  { id: 'newhabit', label: 'NewHabit.exe', iconType: 'newhabit' },
  { id: 'habits', label: 'MyHabits.txt', iconType: 'habits' },
  { id: 'activity', label: 'Activity.exe', iconType: 'activity' },
  { id: 'stats', label: 'Stats.exe', iconType: 'stats' },
  { id: 'settings', label: 'Settings.exe', iconType: 'settings' },
];

// ── Sound effect helper ───────────────────────────
const playClickSound = (enabled) => {
  if (!enabled) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'square';
    osc.frequency.value = 800;
    gain.gain.value = 0.05;
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.stop(ctx.currentTime + 0.08);
  } catch {
    // Audio not available
  }
};

const playCompleteSound = (enabled) => {
  if (!enabled) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'square';
    osc.frequency.value = 523;
    gain.gain.value = 0.05;
    osc.start();
    osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
    osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.stop(ctx.currentTime + 0.35);
  } catch {
    // Audio not available
  }
};

// ── Calculate streak ──────────────────────────────
const calculateStreak = (completionHistory) => {
  if (!completionHistory) return 0;
  let streak = 0;
  const d = new Date();
  // Check today first
  const todayKey = d.toISOString().split('T')[0];
  if (!completionHistory[todayKey]) {
    // Check yesterday — if not completed, streak is 0
    d.setDate(d.getDate() - 1);
    const yesterdayKey = d.toISOString().split('T')[0];
    if (!completionHistory[yesterdayKey]) return 0;
  }
  // Count backwards
  const check = new Date();
  while (true) {
    const key = check.toISOString().split('T')[0];
    if (completionHistory[key]) {
      streak++;
      check.setDate(check.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
};

// ══════════════════════════════════════════════════
//  DESKTOP COMPONENT
// ══════════════════════════════════════════════════
export default function Desktop({
  firebaseTasks = [],
  tasksLoading = false,
  onAddTask,
  onEditTask,
  onToggleComplete,
  onToggleStar,
}) {
  const { currentUser, logout } = useAuth();
  const [tasksView, setTasksView] = useState('all');
  // ── State ──
  const [habits, setHabits] = useState(loadHabits);
  const [settings, setSettings] = useState(loadSettings);
  const [openWindows, setOpenWindows] = useState([]); // array of { id, minimized, maximized }
  const [activeWindowId, setActiveWindowId] = useState(null);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [nextZIndex, setNextZIndex] = useState(10);
  const [windowZIndices, setWindowZIndices] = useState({});
  const [contextMenu, setContextMenu] = useState(null); // { x, y, items }
  const [showBootScreen, setShowBootScreen] = useState(true);
  const desktopRef = useRef(null);

  // ── Persist habits ──
  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  // ── Persist settings ──
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Escape — close active window or context menu
      if (e.key === 'Escape') {
        if (contextMenu) {
          setContextMenu(null);
          return;
        }
        if (startMenuOpen) {
          setStartMenuOpen(false);
          return;
        }
        if (activeWindowId) {
          closeWindow(activeWindowId);
        }
      }
      // Ctrl+N — New Habit
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        openWindow('newhabit');
      }
      // Ctrl+T — Open Tasks
      if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        openWindow('tasks');
      }
      // Ctrl+, — Open Settings
      if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        openWindow('settings');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeWindowId, contextMenu, startMenuOpen]);

  // ── Open a window ──
  const openWindow = useCallback((windowId) => {
    playClickSound(settings.soundEnabled);
    setOpenWindows((prev) => {
      const existing = prev.find((w) => w.id === windowId);
      if (existing) {
        // If minimized, restore it
        return prev.map((w) =>
          w.id === windowId ? { ...w, minimized: false } : w
        );
      }
      return [...prev, { id: windowId, minimized: false, maximized: false }];
    });
    setActiveWindowId(windowId);
    setNextZIndex((z) => z + 1);
    setWindowZIndices((prev) => ({ ...prev, [windowId]: nextZIndex + 1 }));
    setStartMenuOpen(false);
  }, [settings.soundEnabled, nextZIndex]);

  // ── Close a window ──
  const closeWindow = useCallback((windowId) => {
    playClickSound(settings.soundEnabled);
    setOpenWindows((prev) => prev.filter((w) => w.id !== windowId));
    setActiveWindowId((prev) => {
      if (prev === windowId) {
        const remaining = openWindows.filter((w) => w.id !== windowId && !w.minimized);
        return remaining.length > 0 ? remaining[remaining.length - 1].id : null;
      }
      return prev;
    });
  }, [settings.soundEnabled, openWindows]);

  // ── Minimize a window ──
  const minimizeWindow = useCallback((windowId) => {
    playClickSound(settings.soundEnabled);
    setOpenWindows((prev) =>
      prev.map((w) => (w.id === windowId ? { ...w, minimized: true } : w))
    );
    setActiveWindowId((prev) => {
      if (prev === windowId) {
        const remaining = openWindows.filter((w) => w.id !== windowId && !w.minimized);
        return remaining.length > 0 ? remaining[remaining.length - 1].id : null;
      }
      return prev;
    });
  }, [settings.soundEnabled, openWindows]);

  // ── Maximize a window ──
  const maximizeWindow = useCallback((windowId) => {
    playClickSound(settings.soundEnabled);
    setOpenWindows((prev) =>
      prev.map((w) => (w.id === windowId ? { ...w, maximized: !w.maximized } : w))
    );
  }, [settings.soundEnabled]);

  // ── Focus a window ──
  const focusWindow = useCallback((windowId) => {
    setActiveWindowId(windowId);
    setNextZIndex((z) => z + 1);
    setWindowZIndices((prev) => ({ ...prev, [windowId]: nextZIndex + 1 }));
    // If minimized, restore
    setOpenWindows((prev) =>
      prev.map((w) => (w.id === windowId ? { ...w, minimized: false } : w))
    );
  }, [nextZIndex]);

  // ── Taskbar window click (toggle minimize) ──
  const handleTaskbarWindowClick = useCallback((windowId) => {
    playClickSound(settings.soundEnabled);
    const win = openWindows.find((w) => w.id === windowId);
    if (!win) return;
    if (activeWindowId === windowId && !win.minimized) {
      minimizeWindow(windowId);
    } else {
      focusWindow(windowId);
    }
  }, [settings.soundEnabled, openWindows, activeWindowId, minimizeWindow, focusWindow]);

  // ── Desktop click (deselect icons, close start menu) ──
  const handleDesktopClick = useCallback(() => {
    setSelectedIcon(null);
    setStartMenuOpen(false);
    setContextMenu(null);
  }, []);

  // ── Desktop right-click (context menu) ──
  const handleDesktopContextMenu = useCallback((e) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      items: [
        { icon: '📝', label: 'New Habit', shortcut: '⌘N', action: () => openWindow('newhabit') },
        { icon: '📋', label: 'Open Tasks', shortcut: '⌘T', action: () => openWindow('tasks') },
        { icon: '📈', label: 'Activity', action: () => openWindow('activity') },
        { divider: true },
        { icon: '📊', label: 'Statistics', action: () => openWindow('stats') },
        { icon: '⚙️', label: 'Settings', shortcut: '⌘,', action: () => openWindow('settings') },
        { divider: true },
        { icon: 'ℹ️', label: 'About KAIZEN', action: () => openWindow('about') },
      ],
    });
  }, [openWindow]);

  // ── Desktop icon right-click (context menu) ──
  const handleIconContextMenu = useCallback((e, iconId) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedIcon(iconId);
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      items: [
        { icon: '📂', label: 'Open', action: () => openWindow(iconId) },
        { divider: true },
        { icon: '📌', label: `Select "${DESKTOP_ICONS.find(i => i.id === iconId)?.label || iconId}"`, disabled: true },
      ],
    });
  }, [openWindow]);

  // ── Add habit ──
  const handleSaveHabit = useCallback((habitData) => {
    playCompleteSound(settings.soundEnabled);
    setHabits((prev) => [...prev, habitData]);
    closeWindow('newhabit');
    openWindow('habits');
  }, [settings.soundEnabled, closeWindow, openWindow]);

  // ── Toggle habit completion ──
  const handleToggleHabit = useCallback((habitId) => {
    const todayKey = new Date().toISOString().split('T')[0];
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const history = { ...h.completionHistory };
        const wasCompleted = history[todayKey];
        if (wasCompleted) {
          delete history[todayKey];
        } else {
          history[todayKey] = true;
          playCompleteSound(settings.soundEnabled);
        }
        const updated = { ...h, completionHistory: history };
        updated.streak = calculateStreak(updated.completionHistory);
        return updated;
      })
    );
  }, [settings.soundEnabled]);

  // ── Delete habit ──
  const handleDeleteHabit = useCallback((habitId) => {
    playClickSound(settings.soundEnabled);
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
  }, [settings.soundEnabled]);

  // ── Export data ──
  const handleExport = useCallback(() => {
    const data = { habits, settings, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habit-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [habits, settings]);

  // ── Import data ──
  const handleImport = useCallback((data) => {
    if (data.habits && Array.isArray(data.habits)) {
      setHabits(data.habits);
    }
    if (data.settings) {
      setSettings({ ...defaultSettings(), ...data.settings });
    }
  }, []);

  // ── Clear all data ──
  const handleClearData = useCallback(() => {
    setHabits([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // ── Update settings ──
  const handleUpdateSettings = useCallback((newSettings) => {
    setSettings(newSettings);
  }, []);

  // ── Start menu item click ──
  const handleStartMenuItem = useCallback((itemId) => {
    openWindow(itemId);
  }, [openWindow]);

  // ── Render window content ──
  const renderWindowContent = (windowId) => {
    switch (windowId) {
      case 'newhabit':
        return (
          <NewHabitWindow
            onSave={handleSaveHabit}
            onCancel={() => closeWindow('newhabit')}
          />
        );
      case 'habits':
        return (
          <HabitListWindow
            habits={habits}
            onToggleHabit={handleToggleHabit}
            onDeleteHabit={handleDeleteHabit}
          />
        );
      case 'stats':
        return <StatsWindow habits={habits} />;
      case 'settings':
        return (
          <SettingsWindow
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onExport={handleExport}
            onImport={handleImport}
            onClearData={handleClearData}
          />
        );
      case 'about':
        return <AboutWindow onClose={() => closeWindow('about')} />;
      case 'tasks':
        return (
          <TasksWindow
            tasks={firebaseTasks}
            tasksLoading={tasksLoading}
            onAddTask={onAddTask}
            onEditTask={onEditTask}
            onToggleComplete={onToggleComplete}
            onToggleStar={onToggleStar}
            currentView={tasksView}
            onSetView={setTasksView}
          />
        );
      case 'activity':
        return <Win98ActivityWindow tasks={firebaseTasks} />;
      case 'todaystask':
        return (
          <TodaysTaskWindow
            tasks={firebaseTasks}
            tasksLoading={tasksLoading}
            onToggleComplete={onToggleComplete}
            onToggleStar={onToggleStar}
            onOpenAllTasks={() => { openWindow('tasks'); }}
          />
        );
      default:
        return <div>Unknown window</div>;
    }
  };

  // Build taskbar window list
  const taskbarWindows = openWindows.map((w) => ({
    id: w.id,
    title: WINDOW_DEFS[w.id]?.title || w.id,
  }));

  return (
    <div
      ref={desktopRef}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0a0a0a',
        overflow: 'hidden',
        fontFamily: "'VT323', ui-monospace, 'Courier New', monospace",
      }}
      onClick={handleDesktopClick}
      onContextMenu={handleDesktopContextMenu}
    >
      {/* Boot Screen */}
      {showBootScreen && (
        <BootScreen onComplete={() => setShowBootScreen(false)} />
      )}

      {/* Background grid + wallpaper */}
      <div className="desktop-bg" style={{
        backgroundImage: `
          repeating-linear-gradient(90deg, transparent, transparent 59px, rgba(51,255,0,0.02) 59px, rgba(51,255,0,0.02) 60px),
          repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(51,255,0,0.02) 59px, rgba(51,255,0,0.02) 60px),
          linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)),
          url('${settings.wallpaper || '/bg.jpg'}')
        `,
      }} />

      {/* CRT effects */}
      {settings.scanlines && <div className="crt-scanlines" />}
      {settings.flicker && <div className="crt-flicker" />}
      {settings.grain && <div className="crt-grain" />}
      {settings.vignette && <div className="crt-vignette" />}

      {/* Desktop Icons */}
      <div
        className="desktop-icons-grid"
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          zIndex: 3,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {DESKTOP_ICONS.map((icon) => (
          <DesktopIcon
            key={icon.id}
            id={icon.id}
            label={icon.label}
            iconType={icon.iconType}
            selected={selectedIcon === icon.id}
            onClick={(id) => setSelectedIcon(id)}
            onDoubleClick={(id) => openWindow(id)}
            onContextMenu={(e) => handleIconContextMenu(e, icon.id)}
          />
        ))}
      </div>

      {/* Today's Tasks Desktop Widget */}
      <TodaysTaskWidget
        firebaseTasks={firebaseTasks}
        tasksLoading={tasksLoading}
        onToggleComplete={onToggleComplete}
        onOpenWindow={openWindow}
      />
      {/* Windows */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 40, zIndex: 2, pointerEvents: 'none' }}>
          {openWindows.map((win) => {
            const def = WINDOW_DEFS[win.id];
            if (!def) return null;
            return (
              <div key={win.id} style={{ pointerEvents: 'auto' }}>
                <Win98Window
                  id={win.id}
                  title={def.title}
                  isActive={activeWindowId === win.id}
                  isMinimized={win.minimized}
                  isMaximized={win.maximized}
                  defaultPosition={def.defaultPosition}
                  defaultSize={def.defaultSize}
                  zIndex={windowZIndices[win.id] || 1}
                  onFocus={focusWindow}
                  onClose={closeWindow}
                  onMinimize={minimizeWindow}
                  onMaximize={maximizeWindow}
                >
                  {renderWindowContent(win.id)}
                </Win98Window>
              </div>
            );
          })}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenu.items}
          onClose={() => setContextMenu(null)}
        />
      )}

      {/* Start Menu */}
      {startMenuOpen && (
        <StartMenu
          onItemClick={handleStartMenuItem}
          onClose={() => setStartMenuOpen(false)}
          currentUser={currentUser}
          onLogout={logout}
        />
      )}

      {/* Taskbar */}
      <Taskbar
        windows={taskbarWindows}
        activeWindowId={activeWindowId}
        onWindowClick={handleTaskbarWindowClick}
        onStartClick={() => setStartMenuOpen((prev) => !prev)}
        startMenuOpen={startMenuOpen}
        notificationBell={
          <Win98Notifications
            tasks={firebaseTasks}
            onOpenWindow={() => openWindow('tasks')}
          />
        }
      />
    </div>
  );
}
