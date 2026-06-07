import React from 'react';
import { NavLink } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <img src="/brand-2026.png" alt="2026" className="footer-logo" />
          <p className="footer-disclaimer">Official FIFA World Cup 2026™ Fan Hub. Not an official FIFA product.</p>
        </div>
        <div className="footer-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/matches">Matches</NavLink>
          <NavLink to="/teams">Teams</NavLink>
          <NavLink to="/bracket">Bracket</NavLink>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 FIFA World Cup Hub. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;