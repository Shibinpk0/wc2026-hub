import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useWorldCup } from '../context/WorldCupContext';
import { formatToIST } from '../data';
import MatchCountdown from '../components/MatchCountdown';
import AIInsights from '../components/AIInsights';
import MatchEvents from '../components/MatchEvents'; // ADDED

const MatchDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { teams: TEAMS, matches: MATCHES, getStadiumName } = useWorldCup();
  const [matchEvents, setMatchEvents] = useState([]); // ADDED for events

  const match = MATCHES.find(m => m.id === parseInt(id));
  
  if (!match) return <div className="page-header-matches" style={{height:'60vh', display:'flex', alignItems:'center', justifyContent:'center'}}>Match not found</div>;

  const getTeamFromData = (tid) => TEAMS.find(t => t.id === tid.toLowerCase()) || { id: tid, name: tid, flag: 'un' };
  const t1 = getTeamFromData(match.t1);
  const t2 = getTeamFromData(match.t2);
  const { time, date } = formatToIST(match.dateStr);
  const isLive = match.type === 'live';
  const isFinished = match.type === 'finished';

  // FETCH MATCH EVENTS (If your API supports it)
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Replace '/api/get/events' with the actual endpoint your API uses for match events
        // Often it's something like /api/get/events?match_id=123
        const res = await fetch(`/api/get/events?match=${match.id}`); 
        const data = await res.json();
        if (data.events) setMatchEvents(data.events);
      } catch (error) {
        // console.warn("Events API not available or errored out", error);
        // If API fails, we just leave events empty. No crash.
      }
    };

    if (isLive || isFinished) {
      fetchEvents();
    }
  }, [match.id, isLive, isFinished]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <button onClick={() => navigate(-1)} className="back-btn" style={{ marginBottom: '24px', position: 'relative', color: 'var(--text-main)', background: 'var(--bg-light)' }}>
        <ArrowLeft size={16} /> Back to Matches
      </button>

      <div className="match-card" style={{ border: isLive ? '2px solid var(--wc-red)' : '1px solid var(--border-rgba)', maxWidth: '600px', margin: '0 auto' }}>
        <div className="mc-header">
          <span className="badge-group">Group {match.group}</span>
          {isLive && <span className="badge-live"><span className="dot"></span> Live</span>}
          {isFinished && <span className="font-bold text-muted text-xs">FT</span>}
          {!isLive && !isFinished && <span className="text-xs font-bold" style={{color:'var(--wc-blue)'}}>{time} IST</span>}
        </div>
        <div className="mc-body" style={{ margin: '32px 0' }}>
          <div className="mc-team" style={{ gap: '12px' }}>
            <img src={`https://flagcdn.com/w80/${t1.flag}.png`} alt={t1.name} className="flag-icon-lg" />
            <span className="font-bold uppercase" style={{ fontSize: '1.2rem' }}>{t1.id}</span>
          </div>
          <div className="mc-score" style={{ fontSize: '2.5rem' }}>
            {(isLive || isFinished) ? <b>{match.s1} - {match.s2}</b> : <span className="vs">VS</span>}
          </div>
          <div className="mc-team" style={{ gap: '12px' }}>
            <img src={`https://flagcdn.com/w80/${t2.flag}.png`} alt={t2.name} className="flag-icon-lg" />
            <span className="font-bold uppercase" style={{ fontSize: '1.2rem' }}>{t2.id}</span>
          </div>
        </div>

        {/* MATCH EVENTS TIMELINE */}
        {(isLive || isFinished) && (
          <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-rgba)', paddingTop: '16px' }}>
             <MatchEvents events={matchEvents} homeTeamId={match.t1} awayTeamId={match.t2} />
          </div>
        )}

        {!isLive && !isFinished && <AIInsights teamA={t1.id.toUpperCase()} teamB={t2.id.toUpperCase()} />}

        <div className="mc-footer" style={{ marginTop: '24px', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
          <span><MapPin size={14} style={{marginRight:'4px', verticalAlign:'middle'}} /> {getStadiumName(match.venue)}</span>
          <span>{date}</span>
          {!isFinished && <MatchCountdown targetDate={match.dateStr} />}
        </div>
      </div>
    </motion.div>
  );
};

export default MatchDetail;