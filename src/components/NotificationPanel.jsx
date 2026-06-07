import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // ADDED
import { Bell, X, Star } from 'lucide-react';
import { useWorldCup } from '../context/WorldCupContext';

const NotificationPanel = ({ onClose }) => {
  const { teams: TEAMS, matches: MATCHES } = useWorldCup();
  const getTeamFromData = (id) => TEAMS.find(t => t.id === id.toLowerCase()) || { name: id };
  const [favMatches, setFavMatches] = useState([]);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('favTeams') || '[]');
    if (favs.length > 0) {
      const upcoming = MATCHES.filter(m => favs.includes(m.t1) || favs.includes(m.t2));
      setFavMatches(upcoming);
    }
  }, []);

  return (
    <div className="search-overlay" onClick={onClose} style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
      <motion.div 
        className="search-modal" 
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        style={{ maxWidth: '400px', marginLeft: 'auto', marginRight: '20px', marginTop: '80px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}><Bell size={18}/> Alerts</h3>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}><X size={24} /></button>
        </div>
        
        {favMatches.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)' }}>
            <Star size={32} style={{ marginBottom: '10px', color: 'var(--wc-yellow)' }} />
            <p style={{ fontWeight: 700 }}>No Alerts Yet</p>
            <p style={{ fontSize: '0.8rem', marginTop: '5px' }}>Follow your favorite teams to get match time alerts!</p>
          </div>
        ) : (
          <div className="search-results">
            <div className="search-category">Upcoming for Followed Teams</div>
            {favMatches.map(match => (
              <div key={match.id} className="search-result-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{getTeamFromData(match.t1).name} vs {getTeamFromData(match.t2).name}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--wc-blue)', fontWeight: 600 }}>
                  Group {match.group} • {new Date(match.dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default NotificationPanel;