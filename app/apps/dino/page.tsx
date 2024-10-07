'use client';
import { useEffect } from 'react';

const DinoPage = () => {
  useEffect(() => {
    // Store the title variable in sessionStorage
    sessionStorage.setItem('pageTitle', 'Temple run Dino Game');
    sessionStorage.setItem('mediapipe', './components/controls/space/page.tsx');

  }, []);

  return (
      <div className="game" style={{ width: '100%', height: 'auto' }}>
        
        <iframe
          id="gameIframe"
          ref={(el) => {
            if (el) {
              window.gameIframe = el; // Store the iframe globally on the `window` object
            }
          }}
          src="/index.html"
          frameBorder="0"
          scrolling="no"
          width="100%"
          height="500px"
          // height="290px"
          loading="lazy"
        ></iframe>
      </div>
  );
};

export default DinoPage;
