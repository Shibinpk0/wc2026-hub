import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useWorldCup } from '../context/WorldCupContext';
import { Search } from 'lucide-react';

const Teams = () => {
  const { teams: TEAMS, loading, language } = useWorldCup();
  const [search, setSearch] = useState('');
  
  const groups = 'ABCDEFGHIJKL'.split('').reduce((acc, letter) => {
    acc[letter] = TEAMS.filter(t => 
      t.group === letter && 
      (t.name.toLowerCase().includes(search.toLowerCase()) || (t.name_fa && t.name_fa.includes(search)))
    );
    return acc;
  }, {});

  if (loading) return <div className="page-header" style={{height:'60vh', display:'flex', alignItems:'center', justifyContent:'center'}}>Loading Teams...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="teams-page">
      <div className="page-header flex flex-col md:flex-row justify-between items-end mb-8">
        <div>
          <h1 className="page-title">QUALIFIED<br />TEAMS</h1>
          <p className="text-muted subtitle">48 teams divided into 12 groups for the 2026 World Cup.</p>
        </div>
        <div className="search-bar">
          <Search size={18} color="#888" />
          <input 
            type="text" 
            placeholder="Search teams..." 
            className="search-input"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="teams-grid">
        {Object.keys(groups).map((g, index) => groups[g].length > 0 && (
          <motion.div 
            key={g} 
            className="group-card card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }} // Stagger effect
            whileHover={{ y: -5 }}
          >
            <div className="group-card-header">
              <h3 className="group-title">Group {g}</h3>
            </div>
            <div className="group-teams-list">
              {groups[g].map(team => (
                <Link to={`/team/${team.id}`} key={team.id} className="team-row">
                  <div className="team-row-left">
                    <img src={`https://flagcdn.com/w40/${team.flag}.png`} alt={team.name} className="flag-icon-sm" />
                    <span className="font-bold text-sm uppercase">{language === 'fa' ? team.name_fa : team.name}</span>
                  </div>
                  <span className="team-id-badge">{team.id.toUpperCase()}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      
      {Object.values(groups).every(g => g.length === 0) && (
        <div className="text-center text-muted font-bold py-16">
          No teams found matching "{search}"
        </div>
      )}
    </motion.div>
  );
};

export default Teams;