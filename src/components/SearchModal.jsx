import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWorldCup } from '../context/WorldCupContext';

const SearchModal = ({ onClose }) => {
  const { teams: TEAMS, matches: MATCHES, favTeams, toggleFavTeam } = useWorldCup();
  const getTeamFromData = (id) => TEAMS.find(t => t.id === id.toLowerCase()) || { name: 'TBD' };
  
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const filteredTeams = TEAMS.filter(t => t.name.toLowerCase().includes(query.toLowerCase()) || t.id.toLowerCase().includes(query.toLowerCase()));
  const filteredMatches = MATCHES.filter(m => {
    const t1 = getTeamFromData(m.t1).name.toLowerCase();
    const t2 = getTeamFromData(m.t2).name.toLowerCase();
    return t1.includes(query.toLowerCase()) || t2.includes(query.toLowerCase());
  });

  const handleTeamClick = (id) => { navigate(`/team/${id}`); onClose(); };

  return (
    <div className="search-overlay" onClick={onClose}>
      <motion.div 
        className="search-modal" 
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: -20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.2rem' }}>Search Hub</h3>
          <button onClick={onClose} style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}><X size={24} /></button>
        </div>
        <input 
          ref={inputRef}
          type="text" 
          className="search-input-modal" 
          placeholder="Search teams, matches, groups..." 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
        />
        
        <div className="search-results">
          {query && filteredTeams.length > 0 && (
            <div className="search-category">Teams</div>
          )}
          {query && filteredTeams.slice(0, 5).map(team => {
            const isFav = favTeams.includes(team.id);
            return (
              <div key={team.id} className="search-result-item" onClick={() => handleTeamClick(team.id)}>
                <img src={`https://flagcdn.com/w20/${team.flag}.png`} alt={team.name} className="flag-icon-sm" />
                <span style={{ fontWeight: 600 }}>{team.name}</span>
                <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--bg-light)', padding: '2px 6px', borderRadius: '4px' }}>Group {team.group}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleFavTeam(team.id); }} 
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: isFav ? 'var(--wc-yellow)' : 'var(--text-muted)', marginLeft: '8px', transition: 'color 0.2s, transform 0.2s', transform: isFav ? 'scale(1.1)' : 'scale(1)' }}
                >
                  <Star size={16} fill={isFav ? 'var(--wc-yellow)' : 'transparent'} />
                </button>
              </div>
            );
          })}

          {query && filteredMatches.length > 0 && (
            <div className="search-category" style={{ marginTop: '16px' }}>Matches</div>
          )}
          {query && filteredMatches.slice(0, 3).map(match => (
            <div key={match.id} className="search-result-item">
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{getTeamFromData(match.t1).name} vs {getTeamFromData(match.t2).name}</span>
              <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--wc-blue)', fontWeight: 700, background: 'rgba(0, 85, 255, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>{match.type === 'live' ? 'LIVE' : match.group}</span>
            </div>
          ))}

          {query && filteredTeams.length === 0 && filteredMatches.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>No results found for "<b>{query}</b>"</div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SearchModal;