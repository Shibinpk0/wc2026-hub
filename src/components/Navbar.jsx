import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Search, Home, Users, Swords, Bell, GitBranch, MapPin, User } from 'lucide-react';
import SearchModal from './SearchModal';
import NotificationPanel from './NotificationPanel';
import { useWorldCup } from '../context/WorldCupContext';

const Navbar = () => {
  const { user } = useWorldCup(); // Only need user here now for the avatar
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const closeMenus = () => { setIsMenuOpen(false); setIsSearchOpen(false); setIsNotifOpen(false); };

  return (
    <>
      <header className="navbar">
        <div className="nav-logo"><img src="/brand-2026.png" alt="WC 2026" /></div>
        
        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end onClick={closeMenus}>Home</NavLink>
          <NavLink to="/matches" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={closeMenus}>Matches</NavLink>
          <NavLink to="/teams" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={closeMenus}>Teams</NavLink>
          <NavLink to="/bracket" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={closeMenus}>
            <GitBranch size={14} style={{marginRight:'4px'}}/> Bracket
          </NavLink>
          <NavLink to="/venues" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={closeMenus}>
            <MapPin size={14} style={{marginRight:'4px'}}/> Venues
          </NavLink>
        </nav>

        <div className="nav-actions">
          {/* PROFILE LINK */}
          <NavLink to="/profile" className="nav-icon-btn" title="Profile & Settings" onClick={closeMenus}>
            {user ? (
              <img src={user.photoURL} alt="avatar" style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <User size={20} />
            )}
          </NavLink>

          <button className="nav-icon-btn" onClick={() => { setIsNotifOpen(false); setIsSearchOpen(true); }}><Search size={20}/></button>
          <button className="nav-icon-btn" onClick={() => { setIsSearchOpen(false); setIsNotifOpen(true); }}><Bell size={20}/></button>
          <button className="menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <div className={`mobile-menu-overlay ${isMenuOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' }}>
          <button onClick={closeMenus} className="theme-toggle-btn" style={{ padding: '12px' }}>
            <X size={28} />
          </button>
        </div>
        <nav className="mobile-nav-links">
          <NavLink to="/" onClick={closeMenus} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>Home</NavLink>
          <NavLink to="/matches" onClick={closeMenus} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>Matches</NavLink>
          <NavLink to="/teams" onClick={closeMenus} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>Teams</NavLink>
          <NavLink to="/bracket" onClick={closeMenus} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>Bracket</NavLink>
          <NavLink to="/venues" onClick={closeMenus} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>Venues</NavLink>
          <NavLink to="/profile" onClick={closeMenus} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>Profile</NavLink>
        </nav>
      </div>

      <nav className="mobile-bottom-nav">
        <NavLink to="/" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`} end>
          <Home size={22} /> <span>Home</span>
        </NavLink>
        <NavLink to="/matches" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
          <Swords size={22} /> <span>Matches</span>
        </NavLink>
        <NavLink to="/teams" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
          <Users size={22} /> <span>Teams</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
          <User size={22} /> <span>Profile</span>
        </NavLink>
      </nav>

      {isSearchOpen && <SearchModal onClose={closeMenus} />}
      {isNotifOpen && <NotificationPanel onClose={closeMenus} />}
    </>
  );
};

export default Navbar;