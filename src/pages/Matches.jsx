import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { formatToIST } from '../data';
import { useWorldCup } from '../context/WorldCupContext';
import AIInsights from '../components/AIInsights';

const Matches = () => {
  const { teams: TEAMS, matches: MATCHES, standings: dynamicStandings, loading, language, getStadiumName } = useWorldCup();
  
  const getTeamFromData = (tid) => {
    const t = TEAMS.find(t => t.id === tid.toLowerCase()) || { id: tid, name: tid, name_fa: tid, flag: 'un' };
    return { ...t, displayName: language === 'fa' ? t.name_fa : t.name };
  };

  const [filter, setFilter] = useState('Upcoming');
  const tabs = ['Upcoming', 'Live', 'Finished', 'Standings'];
  
  const filteredMatches = MATCHES.filter(m => {
    if (filter === 'Live') return m.type === 'live';
    if (filter === 'Finished') return m.type === 'finished';
    if (filter === 'Upcoming') return m.type === 'upcoming';
    return false;
  });

  if (loading) return <div className="page-header-matches" style={{height:'60vh', display:'flex', alignItems:'center', justifyContent:'center'}}>Loading Match Center...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="page-header-matches">
        <h1 className="page-title">Match Center</h1>
        <div className="tabs">
          {tabs.map(tab => (
            <div key={tab} className={`tab ${filter === tab ? 'active' : ''}`} onClick={() => setFilter(tab)}>{tab}</div>
          ))}
        </div>
      </div>

      {filter !== 'Standings' ? (
        <div className="matches-grid">
          {filteredMatches.length === 0 && <div className="empty-state">No {filter.toLowerCase()} matches right now.</div>}
          {filteredMatches.map((match) => {
            const t1 = getTeamFromData(match.t1); const t2 = getTeamFromData(match.t2);
            const { time, date } = formatToIST(match.dateStr);
            const isLive = match.type === 'live';
            const isFinished = match.type === 'finished';

            return (
              <Link to={`/match/${match.id}`} key={match.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className={`match-card ${isLive ? 'card-live-border' : ''}`}>
                  <div className="mc-header">
                    <span className="badge-group">Group {match.group}</span>
                    {isLive && <span className="badge-live"><span className="dot"></span> Live</span>}
                    {isFinished && <span className="font-bold text-muted text-xs">FT</span>}
                    {!isLive && !isFinished && <span className="text-xs font-bold" style={{color:'var(--wc-blue)'}}>{time} IST</span>}
                  </div>
                  <div className="mc-body">
                    <div className="mc-team">
                      <img src={`https://flagcdn.com/w40/${t1.flag}.png`} alt={t1.displayName} className="flag-icon-sm" />
                      <span className="font-bold uppercase" title={t1.displayName}>{t1.id}</span>
                    </div>
                    <div className="mc-score">
                      {(isLive || isFinished) ? <b>{match.s1} - {match.s2}</b> : <span className="vs">VS</span>}
                    </div>
                    <div className="mc-team">
                      <img src={`https://flagcdn.com/w40/${t2.flag}.png`} alt={t2.displayName} className="flag-icon-sm" />
                      <span className="font-bold uppercase" title={t2.displayName}>{t2.id}</span>
                    </div>
                  </div>
                  {!isLive && !isFinished && <AIInsights teamA={t1.id.toUpperCase()} teamB={t2.id.toUpperCase()} />}
                  <div className="mc-footer">{date} • {getStadiumName(match.venue)}</div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="standings-grid">
          {Object.keys(dynamicStandings).sort().map(group => (
            <div key={group} className="standings-card">
              <h3 className="standings-group-title">Group {group}</h3>
              <table className="bento-table full-table">
                <thead><tr><th>#</th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>Pts</th></tr></thead>
                <tbody>
                  {dynamicStandings[group].map((team, index) => {
                    const td = getTeamFromData(team.id);
                    const gd = team.gf - team.ga;
                    return (
                      <tr key={team.id}>
                        <td>{index + 1}</td>
                        <td className="font-bold uppercase">
                          <img src={`https://flagcdn.com/w20/${td.flag}.png`} alt="" className="flag-icon-sm" style={{marginRight:'8px', verticalAlign:'middle'}}/> 
                          {td.id}
                        </td>
                        <td>{team.p}</td><td>{team.w}</td><td>{team.d}</td><td>{team.l}</td>
                        <td style={{ color: gd > 0 ? 'var(--wc-green)' : gd < 0 ? 'var(--wc-red)' : 'var(--text-muted)', fontWeight: 700 }}>{gd > 0 ? `+${gd}` : gd}</td>
                        <td style={{ color: 'var(--wc-blue)', fontWeight: 800 }}>{team.pts}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Matches;