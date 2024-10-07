'use client';

import React, { useEffect, useRef, useState } from 'react';
import './style.css';
import CardsList from './components/CardsList'; // Adjust the path if needed
import './script'

const AppsLayout = ({ children }: { children: React.ReactNode }) => {
  const mainRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pageTitle, setPageTitle] = useState<string | null>(null);
  // const [setMenuOpen] = useState(false);
  const [MediapipeComponent, setMediapipeComponent] = useState<React.FC | null>(null); // For dynamic component
  // const [setControlsPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [showCamera, setShowCamera] = useState(false); // New state to control camera display

  const toggleFullscreen = () => {
    const elem = mainRef.current;

    if (elem && !document.fullscreenElement) {
      elem.requestFullscreen().then(() => {
        const iframe = elem.querySelector<HTMLIFrameElement>('.game iframe');
        if (iframe) {
          iframe.focus();
        }
      });
      setIsFullscreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen().then(() => {
        const iframe = elem?.querySelector<HTMLIFrameElement>('.game iframe');
        if (iframe) {
          iframe.focus();
        }
      });
      setIsFullscreen(false);
    }
  };

  // const toggleMenu = () => {
  //   setMenuOpen((prev) => {
  //     if (!prev) {
  //       const button = document.querySelector('.menu-btn');
  //       if (button) {
  //         const rect = button.getBoundingClientRect();
  //         setControlsPosition({
  //           top: rect.bottom + window.scrollY, // Position below the button
  //           left: rect.left + window.scrollX, // Align with the button
  //         });
  //       }
  //     }
  //     return !prev;
  //   });
  // };

  useEffect(() => {
    // Retrieve the page title and mediapipe path from sessionStorage
    const storedTitle = sessionStorage.getItem('pageTitle');
    const mediapipePath = sessionStorage.getItem('mediapipe');

    setPageTitle(storedTitle);

    if (mediapipePath) {
      // Dynamically import the component based on the path in sessionStorage
      import(/* @vite-ignore */ `${mediapipePath}`)
        .then((module) => {
          setMediapipeComponent(() => module.default);
          setShowCamera(true); // Show camera video output on load
        })
        .catch((error) => {
          console.error('Error loading mediapipe component:', error);
        });
    }
  }, []);

  // useEffect(() => {
  //   const handleJumpGesture = () => {
  //     const iframe = document.getElementById('gameIframe') as HTMLIFrameElement;
  //     if (iframe) {
  //       iframe.focus();
  //       const spaceEvent = new KeyboardEvent('keydown', {
  //         key: ' ',
  //         code: 'Space',
  //         keyCode: 32,
  //         bubbles: true,
  //       });
  //       iframe.contentWindow?.dispatchEvent(spaceEvent);
  //        console.log('jj')
  //     }
  //   };
  
  //   window.addEventListener('jumpGestureDetected', handleJumpGesture);
  
  //   return () => {
  //     window.removeEventListener('jumpGestureDetected', handleJumpGesture);
  //   };
  // }, []);
  

  return (
    <div className="container">
      <div className="main-wrapper">
        <div className="main-title">
          {pageTitle ? pageTitle : 'Default Title'} {/* Display the page title */}
        </div>

        <div className="main" ref={mainRef}>
          <div className="content-wrapper">
            {children}
          </div>

          <div className="horizontal-bar">

            <button
              className="fullscreen-btn"
              onClick={toggleFullscreen}
            >
              <i className={`uil ${isFullscreen ? 'uil-expand-arrows' : 'uil-focus'}`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Camera video output on page load */}
      {showCamera && MediapipeComponent && (
        <div className="camera-output">
          <MediapipeComponent /> {/* Render the full component for camera output */}
        </div>
      )}

      <div className="cards">
        <CardsList />
      </div>
    </div>
  );
};

export default AppsLayout;
