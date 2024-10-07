import React from 'react';
import './style.css';

const AppsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container">
      <div className="main">
        <h1>Welcome to the Apps Page</h1>
        {children} {/* This will render the Dino game or other child content */}
      </div>

      <div className="cards">
        <h2>Cards</h2>
        <div className="card">
          <h3>Card Title 1</h3>
          <p>Card description goes here.</p>
        </div>
        <div className="card">
          <h3>Card Title 2</h3>
          <p>Card description goes here.</p>
        </div>
        <div className="card">
          <h3>Card Title 2</h3>
          <p>Card description goes here.</p>
        </div>
        <div className="card">
          <h3>Card Title 2</h3>
          <p>Card description goes here.</p>
        </div>
        <div className="card">
          <h3>Card Title 2</h3>
          <p>Card description goes here.</p>
        </div>
        <div className="card">
          <h3>Card Title 2</h3>
          <p>Card description goes here.</p>
        </div>
        <div className="card">
          <h3>Card Title 2</h3>
          <p>Card description goes here.</p>
        </div>
        <div className="card">
          <h3>Card Title 2</h3>
          <p>Card description goes here.</p>
        </div>
        <div className="card">
          <h3>Card Title 2</h3>
          <p>Card description goes here.</p>
        </div>
      </div>
    </div>
  );
};

export default AppsLayout;
