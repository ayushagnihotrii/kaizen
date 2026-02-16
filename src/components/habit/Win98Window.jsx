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

  // Don't render if minimized
  if (isMinimized) return null;

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
      disabled={isMaximized}
    >
      <div
        ref={nodeRef}
        className="win98-window window-open"
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
              onClick={(e) => { e.stopPropagation(); onMinimize?.(id); }}
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
      </div>
    </Draggable>
  );
}
