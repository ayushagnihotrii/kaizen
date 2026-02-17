import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function Win98Login() {
  const { login, loginAsGuest, error } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [bootStep, setBootStep] = useState(0);

  // Staggered boot-up animation
  useEffect(() => {
    const steps = [0, 1, 2, 3, 4];
    const timers = steps.map((step, i) =>
      setTimeout(() => setBootStep(step + 1), 200 + i * 350)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

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
        background: '#050505',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'VT323', ui-monospace, 'Courier New', monospace",
      }}
    >
      {/* Background image + grid */}
      <div className="desktop-bg" />
      <div className="crt-scanlines" />
      <div className="crt-flicker" />
      <div className="crt-grain" />
      <div className="crt-vignette" />

      {/* Login Window — dark hacker terminal */}
      <div
        className="window-open"
        style={{
          width: 440,
          maxWidth: 'calc(100vw - 32px)',
          position: 'relative',
          zIndex: 10,
          background: '#0a0d0a',
          border: '2px solid #2a2a2a',
          borderTop: '2px solid #3a3a3a',
          borderLeft: '2px solid #3a3a3a',
          borderBottom: '2px solid #111',
          borderRight: '2px solid #111',
          boxShadow: '4px 4px 0 rgba(0,0,0,0.7), 0 0 40px rgba(0,255,65,0.06), 0 0 80px rgba(0,255,65,0.03)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Title Bar — dark rich blue */}
        <div
          style={{
            background: 'linear-gradient(90deg, #000040, #001a6e, #002080)',
            color: '#fff',
            padding: '3px 6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 30,
            flexShrink: 0,
            borderBottom: '1px solid #00FF41',
            boxShadow: '0 1px 8px rgba(0,255,65,0.15)',
          }}
        >
          <div style={{
            fontSize: 16,
            fontWeight: 'bold',
            letterSpacing: 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            textShadow: '0 0 6px rgba(0,255,65,0.4)',
          }}>
            <span style={{ fontSize: 14 }}>🔐</span>
            Welcome to HABIT.SYS - Login
          </div>
          <div style={{ display: 'flex', gap: 2 }}>
            {['_', '□', '×'].map((ch, i) => (
              <button
                key={i}
                style={{
                  width: 20,
                  height: 20,
                  background: '#1a1a1a',
                  border: '1px solid #3a3a3a',
                  borderBottom: '1px solid #111',
                  borderRight: '1px solid #111',
                  color: i === 2 ? '#ff4444' : '#888',
                  fontSize: 12,
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontFamily: 'VT323, monospace',
                  padding: 0,
                }}
              >
                {ch}
              </button>
            ))}
          </div>
        </div>

        {/* Window Content — dark terminal body */}
        <div style={{ padding: 20, background: '#050d05' }}>

          {/* ── ASCII Logo ── */}
          <div
            style={{
              background: '#000',
              padding: '16px 12px 12px',
              marginBottom: 18,
              border: '1px solid #1a3a1a',
              boxShadow: 'inset 0 0 30px rgba(0,255,65,0.08), 0 0 12px rgba(0,255,65,0.05)',
              position: 'relative',
              overflow: 'hidden',
              textAlign: 'center',
            }}
          >
            {/* Scanline overlay inside logo box */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.03) 2px, rgba(0,255,65,0.03) 4px)',
              pointerEvents: 'none',
              zIndex: 1,
            }} />
            <pre style={{
              color: '#00FF41',
              fontSize: 13,
              lineHeight: 1.15,
              fontFamily: "'VT323', monospace",
              textShadow: '0 0 8px #00FF41, 0 0 20px rgba(0,255,65,0.4), 0 0 40px rgba(0,255,65,0.15)',
              margin: 0,
              position: 'relative',
              zIndex: 2,
              letterSpacing: 0.5,
            }}>
{` ██╗  ██╗ █████╗ ██████╗ ██╗████████╗
 ██║  ██║██╔══██╗██╔══██╗██║╚══██╔══╝
 ███████║███████║██████╔╝██║   ██║
 ██╔══██║██╔══██║██╔══██╗██║   ██║
 ██║  ██║██║  ██║██████╔╝██║   ██║
 ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚═╝   ╚═╝`}
            </pre>
            <div style={{
              color: '#39FF14',
              fontSize: 16,
              letterSpacing: 8,
              marginTop: 8,
              textShadow: '0 0 10px #39FF14, 0 0 25px rgba(57,255,20,0.4)',
              position: 'relative',
              zIndex: 2,
            }}>
              S Y S T E M &nbsp; v 2 . 0
            </div>
          </div>

          {/* ── Boot-up Status Terminal ── */}
          <div
            style={{
              background: '#000',
              padding: '14px 16px',
              marginBottom: 18,
              borderLeft: '3px solid #00FF41',
              border: '1px solid #1a2a1a',
              borderLeftWidth: 3,
              borderLeftColor: '#00FF41',
              boxShadow: 'inset 0 0 15px rgba(0,255,65,0.04)',
            }}
          >
            {[
              { text: 'HABIT.SYS v2.0 LOADED', delay: 1 },
              { text: 'CRT DISPLAY: ACTIVE', delay: 2 },
              { text: 'FIREBASE AUTH: READY', delay: 3 },
              { text: 'CLOUD SYNC: STANDBY', delay: 4 },
            ].map((line, i) => (
              <div
                key={i}
                style={{
                  fontSize: 16,
                  lineHeight: 1.8,
                  color: '#00FF41',
                  textShadow: '0 0 6px rgba(0,255,65,0.5), 0 0 12px rgba(0,255,65,0.2)',
                  opacity: bootStep > i ? 1 : 0,
                  transform: bootStep > i ? 'translateX(0)' : 'translateX(-8px)',
                  transition: 'opacity 0.3s, transform 0.3s',
                }}
              >
                <span style={{ color: '#1a8c00', marginRight: 6 }}>{'>'}</span>
                {line.text}
              </div>
            ))}
            <div
              style={{
                fontSize: 16,
                lineHeight: 1.8,
                marginTop: 6,
                color: '#39FF14',
                textShadow: '0 0 10px #39FF14, 0 0 25px rgba(57,255,20,0.3)',
                fontWeight: 'bold',
                opacity: bootStep > 4 ? 1 : 0,
                transition: 'opacity 0.4s',
              }}
            >
              <span style={{ color: '#1a8c00', marginRight: 6 }}>{'>'}</span>
              AUTHENTICATION REQUIRED...
              <span className="cursor-blink" />
            </div>
          </div>

          {/* ── Error Display ── */}
          {error && (
            <div
              style={{
                padding: '10px 14px',
                marginBottom: 14,
                background: 'rgba(255,0,0,0.08)',
                border: '1px solid #ff4444',
                color: '#ff6666',
                fontSize: 15,
                textShadow: '0 0 6px rgba(255,68,68,0.4)',
              }}
            >
              ⚠ SYSTEM ERROR: {error}
            </div>
          )}

          {/* ── Authentication Section ── */}
          <div
            style={{
              border: '1px solid #00FF41',
              padding: '16px 14px 14px',
              position: 'relative',
              background: 'rgba(0,255,65,0.02)',
              boxShadow: '0 0 10px rgba(0,255,65,0.04)',
            }}
          >
            {/* Group label */}
            <span style={{
              position: 'absolute',
              top: -9,
              left: 10,
              background: '#050d05',
              padding: '0 8px',
              fontSize: 14,
              color: '#39FF14',
              textTransform: 'uppercase',
              letterSpacing: 2,
              textShadow: '0 0 6px rgba(57,255,20,0.5)',
            }}>
              User Authentication
            </span>

            <p style={{
              fontSize: 15,
              marginBottom: 14,
              color: '#a0ffb0',
              textAlign: 'center',
              lineHeight: 1.5,
              textShadow: '0 0 4px rgba(160,255,176,0.2)',
            }}>
              Sign in with your Google account to sync
              <br />your habits & tasks across all devices.
            </p>

            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                width: '100%',
                padding: '12px 16px',
                fontSize: 20,
                fontFamily: "'VT323', monospace",
                background: isLoading ? '#0a1a0a' : '#111',
                color: '#00FF41',
                border: '2px solid #00FF41',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                textTransform: 'uppercase',
                letterSpacing: 1,
                textShadow: '0 0 8px rgba(0,255,65,0.5)',
                boxShadow: '0 0 8px rgba(0,255,65,0.15), inset 0 0 12px rgba(0,255,65,0.05)',
                transition: 'all 0.2s',
                opacity: isLoading ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.background = '#002a00';
                  e.target.style.borderColor = '#39FF14';
                  e.target.style.boxShadow = '0 0 16px rgba(0,255,65,0.3), inset 0 0 20px rgba(0,255,65,0.08)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#111';
                e.target.style.borderColor = '#00FF41';
                e.target.style.boxShadow = '0 0 8px rgba(0,255,65,0.15), inset 0 0 12px rgba(0,255,65,0.05)';
              }}
            >
              {isLoading ? (
                <>
                  <span style={{ animation: 'blink 0.5s step-end infinite' }}>⏳</span>
                  CONNECTING...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
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

          {/* ── OR Divider ── */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            margin: '14px 0',
          }}>
            <div style={{ flex: 1, height: 1, background: '#1a3a1a' }} />
            <span style={{ color: '#1a8c00', fontSize: 14, textTransform: 'uppercase', letterSpacing: 2 }}>or</span>
            <div style={{ flex: 1, height: 1, background: '#1a3a1a' }} />
          </div>

          {/* ── Guest Mode Button ── */}
          <button
            onClick={loginAsGuest}
            disabled={isLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              width: '100%',
              padding: '12px 16px',
              fontSize: 20,
              fontFamily: "'VT323', monospace",
              background: '#111',
              color: '#FF00FF',
              border: '2px solid #FF00FF',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: 1,
              textShadow: '0 0 8px rgba(255,0,255,0.5)',
              boxShadow: '0 0 8px rgba(255,0,255,0.15), inset 0 0 12px rgba(255,0,255,0.05)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#1a001a';
              e.target.style.borderColor = '#FF44FF';
              e.target.style.boxShadow = '0 0 16px rgba(255,0,255,0.3), inset 0 0 20px rgba(255,0,255,0.08)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#111';
              e.target.style.borderColor = '#FF00FF';
              e.target.style.boxShadow = '0 0 8px rgba(255,0,255,0.15), inset 0 0 12px rgba(255,0,255,0.05)';
            }}
          >
            👤 CONTINUE AS GUEST
          </button>

          <div style={{
            marginTop: 8,
            textAlign: 'center',
            fontSize: 13,
            color: '#804080',
          }}>
            ⚠ Guest data is stored locally and won't sync across devices
          </div>

          {/* ── Footer ── */}
          <div style={{
            marginTop: 16,
            textAlign: 'center',
            fontSize: 13,
            color: '#3a7a3a',
            lineHeight: 1.8,
          }}>
            <div style={{ textShadow: '0 0 4px rgba(0,255,65,0.2)' }}>
              🔒 Secured by Firebase Authentication
            </div>
            <div>
              ☁️ Tasks synced to cloud • Habits stored locally
            </div>
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
