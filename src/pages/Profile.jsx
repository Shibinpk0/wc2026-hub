import React from 'react';
import { motion } from 'framer-motion';
import { User, LogIn, LogOut, Moon, Sun, Languages, Star, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWorldCup } from '../context/WorldCupContext';

const Profile = () => {
  const { user, loginWithGoogle, logout, favTeams, toggleFavTeam, teams: TEAMS, darkMode, setDarkMode, language, setLanguage } = useWorldCup();
  const navigate = useNavigate();

  const getTeamFromData = (id) => TEAMS.find(t => t.id === id.toLowerCase()) || { id: id, name: id, flag: 'un' };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="profile-page">
      <div className="page-header-matches">
        <h1 className="page-title">Profile & Settings</h1>
      </div>

      {/* USER CARD */}
      <div className="profile-card">
        {user ? (
          <div className="profile-user-info">
            <img src={user.photoURL} alt="Avatar" className="profile-avatar" />
            <div>
              <h2 className="profile-name">{user.displayName}</h2>
              <p className="profile-email">{user.email}</p>
            </div>
            <button onClick={logout} className="profile-logout-btn">
              <LogOut size={16} /> Logout
            </button>
          </div>
        ) : (
          <div className="profile-login-prompt">
            <User size={48} style={{ color: 'var(--wc-blue)', marginBottom: '16px' }} />
            <h3 style={{ fontWeight: 800, marginBottom: '8px' }}>Sync Your Data</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px', maxWidth: '300px', textAlign: 'center' }}>
              Login with Google to save your favorite teams and access them from any device!
            </p>
            <button onClick={loginWithGoogle} className="search-home-btn" style={{ maxWidth: '250px', margin: '0 auto', background: 'var(--wc-blue)', color: 'white', border: 'none' }}>
              <LogIn size={18} /> Sign in with Google
            </button>
          </div>
        )}
      </div>

      {/* SETTINGS GRID */}
      <div className="profile-settings-grid">
        {/* PREFERENCES CARD */}
        <div className="info-card-wide">
          <h3 className="bento-header">Preferences</h3>
          
          <div className="setting-row">
            <div className="setting-info">
              <Moon size={18} style={{color: 'var(--wc-blue)'}}/>
              <div>
                <span className="setting-label">Dark Mode</span>
                <span className="setting-desc">Easier on the eyes at night</span>
              </div>
            </div>
            <button onClick={() => setDarkMode(!darkMode)} className="theme-toggle-btn" style={{ padding: '8px 16px', borderRadius: '30px', gap: '8px' }}>
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              {darkMode ? 'Light' : 'Dark'}
            </button>
          </div>

          <div className="setting-row">
            <div className="setting-info">
              <Languages size={18} style={{color: 'var(--wc-green)'}}/>
              <div>
                <span className="setting-label">Language</span>
                <span className="setting-desc">Switch between English & Farsi</span>
              </div>
            </div>
            <button onClick={() => setLanguage(prev => prev === 'en' ? 'fa' : 'en')} className="theme-toggle-btn" style={{ padding: '8px 16px', borderRadius: '30px', gap: '8px' }}>
              <Languages size={16} /> {language === 'en' ? 'فارسی' : 'English'}
            </button>
          </div>
        </div>

        {/* MY TEAMS CARD */}
        <div className="info-card-wide">
          <h3 className="bento-header"><Star size={16} style={{color: 'var(--wc-yellow)'}}/> My Teams</h3>
          {favTeams.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
              <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>No teams followed yet.</p>
              <button onClick={() => navigate('/teams')} className="search-home-btn" style={{ maxWidth: '200px', margin: '16px auto 0' }}>Browse Teams</button>
            </div>
          ) : (
            <div className="profile-teams-grid">
              {favTeams.map(teamId => {
                const team = getTeamFromData(teamId);
                return (
                  <div key={teamId} className="profile-team-card" onClick={() => navigate(`/team/${teamId}`)}>
                    <img src={`https://flagcdn.com/w40/${team.flag}.png`} alt={team.name} className="flag-icon-sm" />
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>{teamId}</span>
                    <button onClick={(e) => { e.stopPropagation(); toggleFavTeam(teamId); }} className="unfeed-btn" style={{ position: 'absolute', top: '6px', right: '6px' }}><X size={12}/></button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;