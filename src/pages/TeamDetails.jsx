import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Trophy, Activity, Swords } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { formatToIST } from '../data';
import { useWorldCup } from '../context/WorldCupContext';
import MatchCountdown from '../components/MatchCountdown';

const TeamDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { teams: TEAMS, matches: MATCHES, loading, favTeams, toggleFavTeam } = useWorldCup(); // ADDED favTeams & toggleFavTeam
  
  const team = TEAMS.find(t => t.id === (id || 'bra').toLowerCase()) || TEAMS[0];
  const isFavorite = favTeams.includes(team?.id); // DERIVED from Context

  const getTeamFromData = (tid) => TEAMS.find(t => t.id === tid.toLowerCase()) || TEAMS[0];
  const teamMatches = MATCHES.filter(m => m.t1 === team?.id || m.t2 === team?.id);

  const getTeamStats = (teamId) => {
    if (!teamId) return [];
    const hash = teamId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return [
      { label: 'Attack', value: 65 + (hash % 25), color: 'var(--wc-green)' },
      { label: 'Defense', value: 65 + ((hash * 3) % 25), color: 'var(--wc-blue)' },
      { label: 'Experience', value: 65 + ((hash * 7) % 25), color: 'var(--wc-yellow)' },
      { label: 'Fitness', value: 65 + ((hash * 11) % 25), color: 'var(--wc-red)' }
    ];
  };

  if (loading) return <div className="page-header" style={{height:'60vh', display:'flex', alignItems:'center', justifyContent:'center'}}>Loading Team Details...</div>;
  if (!team) return <div className="page-header">Team not found</div>;

  // REMOVED old local useEffect and toggleFavorite logic. We just use toggleFavTeam from context now!

  const teamStats = getTeamStats(team.id);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="team-header-bg">
        <button onClick={() => navigate(-1)} className="back-btn"><ArrowLeft size={16} /> Back</button>
        <button onClick={() => toggleFavTeam(team.id)} className="back-btn fav-btn" style={{color: isFavorite ? 'var(--wc-yellow)' : 'white'}}>
          <Star size={16} fill={isFavorite ? 'var(--wc-yellow)' : 'transparent'} /> {isFavorite ? 'Following' : 'Follow'}
        </button>
      </div>

      <div className="team-logo-container">
        <img src={`https://flagcdn.com/w160/${team.flag}.png`} alt={team.name} className="team-logo-large" />
        <div>
          <h1 className="team-title uppercase">{team.name}</h1>
          <div className="flex gap-4">
            <div className="team-stat"><span className="team-stat-label">Group</span><span className="team-stat-val uppercase">{team.group}</span></div>
            <div className="team-stat"><span className="team-stat-label">Status</span><span className="team-stat-val" style={{ color: 'var(--wc-green)' }}>Qualified</span></div>
          </div>
        </div>
      </div>

      <div className="info-card-wide" style={{ marginBottom: '24px' }}>
        <h3 className="bento-header"><Swords size={16} style={{color:'var(--wc-blue)'}}/> Fixtures & Countdowns</h3>
        <div className="team-matches-list">
          {teamMatches.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No fixtures found.</p>}
          {teamMatches.map(match => {
            const opponent = getTeamFromData(match.t1 === team.id ? match.t2 : match.t1);
            const { time, date } = formatToIST(match.dateStr);
            return (
              <div key={match.id} className="team-match-item">
                <div className="tm-opponent">
                  <img src={`https://flagcdn.com/w40/${opponent.flag}.png`} alt={opponent.name} className="flag-icon-sm" />
                  <span className="font-bold uppercase">vs {opponent.name}</span>
                  <span className="badge-group" style={{ marginLeft: '8px' }}>Group {match.group}</span>
                </div>
                <div className="tm-time">
                  {match.type === 'live' ? <span className="badge-live"><span className="dot"></span>LIVE</span> : (
                    <>
                      <span className="text-xs font-bold" style={{color:'var(--text-muted)', display:'block', marginBottom:'4px'}}>{date} • {time} IST</span>
                      <MatchCountdown targetDate={match.dateStr} />
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="team-content-grid">
        <div className="info-card-wide">
          <h3 className="bento-header"><Trophy size={16} style={{color:'var(--wc-yellow)'}}/> Historical Performance</h3>
          <p className="overview-text">The {team.name} national football team brings unparalleled passion and skill to the ultimate football tournament. With a rich history in the World Cup, they are considered a formidable force in Group {team.group}.</p>
        </div>

        <div className="info-card-wide">
          <h3 className="bento-header"><Activity size={16} style={{color:'var(--wc-blue)'}}/> Team Performance Index</h3>
          <div className="stats-bars-vertical">
            {teamStats.map(stat => (
              <div key={stat.label} className="stat-bar-row">
                <div className="stat-bar-label">{stat.label}</div>
                <div className="stat-bar-track">
                  <motion.div className="stat-bar-fill" style={{ backgroundColor: stat.color }} initial={{ width: 0 }} animate={{ width: `${stat.value}%` }} transition={{ duration: 1, delay: 0.5 }}></motion.div>
                </div>
                <div className="stat-bar-val">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TeamDetails;