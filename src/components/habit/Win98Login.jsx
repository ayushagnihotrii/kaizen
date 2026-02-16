import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function Win98Login() {
  const { login, error } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await login();
    } catch (err) {
      console.error('Failed to login:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'VT323', ui-monospace, 'Courier New', monospace",
      }}
    >
      {/* Background grid */}
      <div className="desktop-bg" />
      <div className="crt-scanlines" />
      <div className="crt-flicker" />
      <div className="crt-grain" />
      <div className="crt-vignette" />

      {/* Login "Window" */}
      <div
        className="win98-window window-open"
        style={{
          width: 420,
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Title Bar */}
        <div className="win98-titlebar">
          <div className="win98-title-text" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 14 }}>🔐</span>
            Welcome to HABIT.SYS - Login
          </div>
          <div className="win98-title-buttons">
            <button className="win98-title-btn">_</button>
            <button className="win98-title-btn">□</button>
            <button className="win98-title-btn" style={{ fontWeight: 'bold' }}>×</button>
          </div>
        </div>

        {/* Content */}
        <div className="win98-content" style={{ padding: 16 }}>
          {/* ASCII Logo */}
          <div
            className="terminal-box"
            style={{
              textAlign: 'center',
              marginBottom: 16,
              fontSize: 14,
              lineHeight: 1.2,
            }}
          >
{`
 ██╗  ██╗ █████╗ ██████╗ ██╗████████╗
 ██║  ██║██╔══██╗██╔══██╗██║╚══██╔══╝
 ███████║███████║██████╔╝██║   ██║   
 ██╔══██║██╔══██║██╔══██╗██║   ██║   
 ██║  ██║██║  ██║██████╔╝██║   ██║   
 ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚═╝   ╚═╝   
          S Y S T E M  v2.0
`}
          </div>

          {/* Boot-up text */}
          <div
            className="terminal-box"
            style={{ marginBottom: 16, fontSize: 14, lineHeight: 1.5 }}
          >
            <div className="neon-text-dim">{'>'} HABIT.SYS v2.0 LOADED</div>
            <div className="neon-text-dim">{'>'} CRT DISPLAY: ACTIVE</div>
            <div className="neon-text-dim">{'>'} FIREBASE AUTH: READY</div>
            <div className="neon-text-dim">{'>'} CLOUD SYNC: STANDBY</div>
            <div className="neon-text" style={{ marginTop: 8 }}>
              {'>'} AUTHENTICATION REQUIRED...
              <span className="cursor-blink" />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              className="bevel-inset"
              style={{
                padding: 8,
                marginBottom: 12,
                background: '#FFFFCC',
                color: '#FF0000',
                fontSize: 14,
              }}
            >
              ⚠️ ERROR: {error}
            </div>
          )}

          {/* Google Sign In - Win98 style */}
          <div className="win98-groupbox">
            <span className="win98-groupbox-label">User Authentication</span>
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <p style={{ fontSize: 14, marginBottom: 12, color: '#000' }}>
                Sign in with your Google account to sync your habits & tasks across all devices.
              </p>
              <button
                className="bevel-button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  width: '100%',
                  padding: '8px 16px',
                  fontSize: 18,
                }}
              >
                {isLoading ? (
                  <>
                    <span style={{ animation: 'blink 0.5s step-end infinite' }}>⏳</span>
                    SIGNING IN...
                  </>
                ) : (
                  <>
                    {/* Google Icon */}
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    CONTINUE WITH GOOGLE
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Footer info */}
          <div style={{
            marginTop: 12,
            textAlign: 'center',
            fontSize: 12,
            color: '#808080',
          }}>
            <div>🔒 Secured by Firebase Authentication</div>
            <div style={{ marginTop: 4 }}>☁️ Tasks synced to cloud • Habits stored locally</div>
          </div>
        </div>
      </div>

      {/* Fake taskbar at bottom */}
      <div className="win98-taskbar" style={{ zIndex: 5 }}>
        <button className="bevel-button start-button" disabled>
          <div className="start-logo" />
          <span>Start</span>
        </button>
        <div style={{ flex: 1 }} />
        <div className="taskbar-clock">
          {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
        </div>
      </div>
    </div>
  );
}
