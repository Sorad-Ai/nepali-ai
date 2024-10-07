// /app/layout.tsx
import NavBar from './navBar/navPage'; 
import React from 'react';
import './globals.css'
import AdContainer from './Ad/page';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html>
      <head>
        <link
            rel="stylesheet"
            href="https://unicons.iconscout.com/release/v4.0.0/css/line.css"
          />
      </head>
      
      <body>
      <div>
      <NavBar />
      <main>
        {children}
        <AdContainer />
      </main>
      </div>
        

      </body>
    </html>
  );
};

export default Layout;
