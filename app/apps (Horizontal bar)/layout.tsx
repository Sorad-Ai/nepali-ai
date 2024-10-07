'use client';

import React, { useRef, useState } from 'react';
import './style.css';

const AppsLayout = ({ children }: { children: React.ReactNode }) => {
  const mainRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    const elem = mainRef.current;

    if (elem && !document.fullscreenElement) {
      elem.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="container">
      <div className="main" ref={mainRef}>
        <h1>Welcome to the Apps Page</h1>
        {children} {/* This will render the Dino game or other child content */}

        {/* Horizontal bar with fullscreen button */}
        <div className="horizontal-bar">
          <button
            className="fullscreen-btn"
            onClick={toggleFullscreen}
          >
            <i className={`uil ${isFullscreen ? 'uil-expand-arrows' : 'uil-focus'}`}></i>
          </button>
        </div>
      </div>

      <div className="cards">
        <h2>Cards</h2>
        {/* Your card elements here */}
      </div>
    </div>
  );
};

export default AppsLayout;
