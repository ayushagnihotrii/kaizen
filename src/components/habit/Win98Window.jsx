import React, { useRef, useState, useCallback, useEffect } from 'react';
import Draggable from 'react-draggable';

export default function Win98Window({
  id,
  title,
  children,
  isActive,
  isMinimized,
  isMaximized,
  defaultPosition = { x: 100, y: 60 },
  defaultSize = { width: 480, height: 400 },
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  zIndex = 1,
}) {
  const nodeRef = useRef(null);
  const [size, setSize] = useState(defaultSize);
  const [preMaxSize, setPreMaxSize] = useState(null);
  const [preMaxPos, setPreMaxPos] = useState(null);
  const [position, setPosition] = useState(defaultPosition);
  const [animState, setAnimState] = useState('open'); // 'open' | 'visible' | 'minimizing' | 'restoring'
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartRef = useRef(null);

  const handleMaximize = useCallback(() => {
    if (isMaximized) {
      // Restore
      if (preMaxSize) setSize(preMaxSize);
      if (preMaxPos) setPosition(preMaxPos);
      onMaximize?.(id);
    } else {
      setPreMaxSize({ ...size });
      setPreMaxPos({ ...position });
      setPosition({ x: 0, y: 0 });
      setSize({ width: window.innerWidth, height: window.innerHeight - 40 });
      onMaximize?.(id);
    }
  }, [isMaximized, size, position, preMaxSize, preMaxPos, id, onMaximize]);

  const handleDrag = useCallback((e, data) => {
    setPosition({ x: data.x, y: data.y });
  }, []);

  // Handle minimize animation
  const handleMinimize = useCallback(() => {
    setAnimState('minimizing');
    setTimeout(() => {
      onMinimize?.(id);
    }, 200);
  }, [id, onMinimize]);

  // Handle restore animation
  useEffect(() => {
    if (!isMinimized && animState === 'minimizing') {
      setAnimState('restoring');
      setTimeout(() => setAnimState('visible'), 200);
    }
  }, [isMinimized]);

  // After open animation completes
  useEffect(() => {
    if (animState === 'open') {
      const timer = setTimeout(() => setAnimState('visible'), 150);
      return () => clearTimeout(timer);
    }
  }, []);

  // Resize handlers
  const handleResizeStart = useCallback((e, direction) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    resizeStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: size.width,
      startHeight: size.height,
      direction,
    };

    const handleResizeMove = (moveE) => {
      if (!resizeStartRef.current) return;
      const { startX, startY, startWidth, startHeight, direction: dir } = resizeStartRef.current;
      const dx = moveE.clientX - startX;
      const dy = moveE.clientY - startY;

      setSize((prev) => ({
        width: dir.includes('right') || dir.includes('corner')
          ? Math.max(300, startWidth + dx) : prev.width,
        height: dir.includes('bottom') || dir.includes('corner')
          ? Math.max(200, startHeight + dy) : prev.height,
      }));
    };

    const handleResizeEnd = () => {
      setIsResizing(false);
      resizeStartRef.current = null;
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };

    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  }, [size]);

  // Don't render if minimized (after animation)
  if (isMinimized && animState !== 'minimizing') return null;

  const animClass =
    animState === 'open' ? 'window-open' :
    animState === 'minimizing' ? 'window-minimizing' :
    animState === 'restoring' ? 'window-restoring' : '';

  const windowStyle = isMaximized
    ? {
        width: '100vw',
        height: 'calc(100vh - 40px)',
        zIndex,
      }
    : {
        width: size.width,
        height: size.height,
        zIndex,
      };

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".win98-titlebar"
      bounds="parent"
      position={isMaximized ? { x: 0, y: 0 } : position}
      onDrag={handleDrag}
      onStart={() => onFocus?.(id)}
      disabled={isMaximized || isResizing}
    >
      <div
        ref={nodeRef}
        className={`win98-window ${animClass}`}
        style={windowStyle}
        onMouseDown={() => onFocus?.(id)}
      >
        {/* Title Bar */}
        <div className={`win98-titlebar ${!isActive ? 'win98-titlebar-inactive' : ''}`}>
          <div className="win98-title-text" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 14 }}>📁</span>
            {title}
          </div>
          <div className="win98-title-buttons">
            <button
              className="win98-title-btn"
              onClick={(e) => { e.stopPropagation(); handleMinimize(); }}
              title="Minimize"
            >
              _
            </button>
            <button
              className="win98-title-btn"
              onClick={(e) => { e.stopPropagation(); handleMaximize(); }}
              title="Maximize"
            >
              □
            </button>
            <button
              className="win98-title-btn"
              onClick={(e) => { e.stopPropagation(); onClose?.(id); }}
              title="Close"
              style={{ fontWeight: 'bold' }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="win98-content">
          {children}
        </div>

        {/* Resize Handles (only when not maximized) */}
        {!isMaximized && (
          <>
            <div
              className="win98-resize-handle resize-right"
              onMouseDown={(e) => handleResizeStart(e, 'right')}
            />
            <div
              className="win98-resize-handle resize-bottom"
              onMouseDown={(e) => handleResizeStart(e, 'bottom')}
            />
            <div
              className="win98-resize-handle resize-corner"
              onMouseDown={(e) => handleResizeStart(e, 'corner')}
            />
            <div className="win98-resize-corner-indicator" />
          </>
        )}
      </div>
    </Draggable>
  );
}
