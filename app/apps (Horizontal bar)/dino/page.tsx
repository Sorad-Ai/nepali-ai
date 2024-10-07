import React from 'react';

const DinoPage = () => {
  return (
    <div className="game" style={{ width: '100%', height: 'auto' }}>
      <iframe
        src="https://chromedino.com/"
        frameBorder="0"
        scrolling="no"
        width="100%"
        height="270px"
        loading="lazy"
      ></iframe>
    </div>
  );
};

export default DinoPage;
