import React from 'react';
import './navbar.css';

const NavBar = () => {
  return (
    <div>
           <nav className="navbar">
        <div className="navbar-content">
          <div className="brand">
            <h1>Cerberus</h1>
          </div>
          <div className="user-section">
            <div className="welcome">
              <span className="welcome-text">Bem vindo,</span>
              <h2 className="user-name">João!</h2>
            </div>
            
          </div>
        </div>
      </nav>
    </div>
   
  );
};

export default NavBar;