import React from 'react';

export default function StatsWindow({ habits }) {
  const todayKey = new Date().toISOString().split('T')[0];

  // Calculate stats
  const totalHabits = habits.length;
  const completedToday = habits.filter(
    (h) => h.completionHistory?.[todayKey]
  ).length;
  const completionPct = totalHabits > 0
    ? Math.round((completedToday / totalHabits) * 100)
    : 0;
  const longestStreak = habits.reduce((max, h) => Math.max(max, h.streak || 0), 0);
  const totalCompletions = habits.reduce((sum, h) => {
    return sum + Object.values(h.completionHistory || {}).filter(Boolean).length;
  }, 0);
  const avgStreak = totalHabits > 0
    ? (habits.reduce((sum, h) => sum + (h.streak || 0), 0) / totalHabits).toFixed(1)
    : 0;

  // Build ASCII bar chart for last 7 days
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase().slice(0, 3);
    const count = habits.filter((h) => h.completionHistory?.[key]).length;
    last7Days.push({ key, dayLabel, count });
  }

  const maxCount = Math.max(...last7Days.map((d) => d.count), 1);
  const chartHeight = 8;

  // Build bar chart as lines
  const buildBarChart = () => {
    const lines = [];
    for (let row = chartHeight; row >= 1; row--) {
      const threshold = (row / chartHeight) * maxCount;
      let line = `  ${String(Math.ceil(threshold)).padStart(2)} │`;
      for (const day of last7Days) {
        if (day.count >= threshold) {
          line += ' ██';
        } else {
          line += '   ';
        }
      }
      lines.push(line);
    }
    // X-axis
    lines.push('     └' + '───'.repeat(last7Days.length) + '─');
    lines.push('      ' + last7Days.map((d) => d.dayLabel).join(' '));
    return lines.join('\n');
  };

  // Per-habit streaks chart
  const buildStreakChart = () => {
    if (habits.length === 0) return '  No habits to display';
    const maxNameLen = Math.min(12, Math.max(...habits.map((h) => h.name.length)));
    return habits.map((h) => {
      const name = h.name.slice(0, maxNameLen).padEnd(maxNameLen);
      const barLen = Math.min(20, h.streak || 0);
      const bar = '█'.repeat(barLen) + '░'.repeat(20 - barLen);
      return `  ${name} │${bar}│ ${h.streak}`;
    }).join('\n');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Terminal header */}
      <div className="terminal-header">
        <span className="neon-text-dim">C:\HABITS\&gt; </span>
        <span className="neon-text">STATS.EXE --verbose</span>
      </div>

      {/* Summary stats */}
      <div className="terminal-box">
{`╔══════════════════════════════════════╗
║     HABIT TRACKER STATISTICS         ║
╠══════════════════════════════════════╣
║                                      ║
║  TOTAL HABITS:      ${String(totalHabits).padStart(4)}             ║
║  COMPLETED TODAY:   ${String(completedToday).padStart(4)}             ║
║  COMPLETION RATE:   ${String(completionPct).padStart(3)}%             ║
║  LONGEST STREAK:    ${String(longestStreak).padStart(4)} 🔥          ║
║  AVERAGE STREAK:    ${String(avgStreak).padStart(4)}             ║
║  TOTAL COMPLETIONS: ${String(totalCompletions).padStart(4)}             ║
║                                      ║
╚══════════════════════════════════════╝`}
      </div>

      {/* 7-day chart */}
      <div className="win98-groupbox">
        <span className="win98-groupbox-label">7-Day Activity</span>
        <div className="terminal-box" style={{ fontSize: 14, lineHeight: 1.3 }}>
{`  COMPLETIONS (LAST 7 DAYS)
  ─────────────────────────
${buildBarChart()}`}
        </div>
      </div>

      {/* Per-habit streaks */}
      <div className="win98-groupbox">
        <span className="win98-groupbox-label">Streak Breakdown</span>
        <div className="terminal-box" style={{ fontSize: 14, lineHeight: 1.3 }}>
{`  CURRENT STREAKS
  ─────────────────────────────────────
${buildStreakChart()}`}
        </div>
      </div>
    </div>
  );
}
