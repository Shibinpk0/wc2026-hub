import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Trophy, Clock, Swords, MapPin, Star, Search, Newspaper, Activity, X } from 'lucide-react';
import { useWorldCup } from '../context/WorldCupContext';
import SearchModal from '../components/SearchModal';
import MatchCountdown from '../components/MatchCountdown';
import Skeleton from '../components/Skeleton';

const Home = () => {
  const { teams: TEAMS, matches: MATCHES, standings: STANDINGS, loading: isLoading, error, refreshData, language, favTeams, toggleFavTeam } = useWorldCup();
  
  const getTeamFromData = (id) => {
    const t = TEAMS.find(t => t.id === id.toLowerCase()) || { id: 'TBD', name: 'TBD', name_fa: 'نامعلوم', flag: 'un' };
    return { ...t, displayName: language === 'fa' ? t.name_fa : t.name };
  };

  const liveMatch = MATCHES.find(m => m.type === 'live');
  const nextMatch = MATCHES.find(m => m.type === 'upcoming');
  const upcomingMatches = MATCHES.filter(m => m.type === 'upcoming').slice(0, 4);

  const [liveMinute, setLiveMinute] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    if (liveMatch) setLiveMinute(liveMatch.minute === 'FT' ? 90 : (parseInt(liveMatch.minute) || 0));
  }, [liveMatch]);

  useEffect(() => { 
    const t = setInterval(() => setLiveMinute(p => p >= 90 ? 90 : p + 1), 60000); 
    return () => clearInterval(t); 
  }, []);

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  useEffect(() => {
    const targetDate = new Date('2026-06-11T00:00:00Z').getTime();
    const interval = setInterval(() => {
      const diff = targetDate - new Date().getTime();
      if (diff > 0) {
        setTimeLeft({ 
          days: Math.floor(diff / (1000 * 60 * 60 * 24)), 
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)), 
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)), 
          seconds: Math.floor((diff % (1000 * 60)) / 1000) 
        });
      }
    }, 1000); 
    return () => clearInterval(interval);
  }, []);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, 100]);

  const favMatches = MATCHES.filter(m => favTeams.includes(m.t1) || favTeams.includes(m.t2));

  if (error) {
    return (
      <div className="home-2026" style={{ height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px' }}>
        <Activity size={64} style={{ color: 'var(--wc-red)', marginBottom: '24px' }} />
        <h2 className="hero-heading" style={{ fontSize: '2rem' }}>Connection Error</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '400px', marginBottom: '32px' }}>
          Unable to retrieve live World Cup data. Please check your connection.
        </p>
        <button onClick={refreshData} className="search-home-btn" style={{ maxWidth: '200px' }}>
          Retry Connection
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="home-2026">
        <div className="hero-bento" style={{ minHeight: '40vh' }}>
          <div className="hero-bento-content">
            <div className="hero-left-col">
              <Skeleton width="150px" height="30px" />
              <Skeleton width="60%" height="60px" style={{ marginBottom: '10px' }} />
              <Skeleton width="80%" height="60px" />
            </div>
          </div>
        </div>
        <div className="mesh-bg-wrapper">
          <div className="bento-grid">
            {[1,2,3,4].map(i => (
              <div key={i} className="bento-item" style={{ minHeight: '250px' }}>
                <Skeleton width="120px" height="20px" style={{ marginBottom: '20px' }} />
                <Skeleton height="80px" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-2026">
      <div className="hero-bento">
        <motion.div className="geo-shape geo-blue" style={{ y: y2 }} />
        <motion.div className="geo-shape geo-red" style={{ y: y2 }} />
        <motion.div className="geo-shape geo-yellow" style={{ y: y2 }} />
        
        <motion.div className="hero-bento-content" style={{ y: y1 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="hero-left-col">
            <div className="hero-badge">FIFA WORLD CUP 2026™</div>
            <h1 className="hero-heading">
              THE WORLD
              <br/>
              <span className="text-highlight">IS COMING.</span>
            </h1>
            
            <div className="bento-countdown">
              <div className="cd-block"><span className="cd-num">{timeLeft.days}</span><span className="cd-label">Days</span></div>
              <div className="cd-block"><span className="cd-num">{timeLeft.hours}</span><span className="cd-label">Hrs</span></div>
              <div className="cd-block"><span className="cd-num">{timeLeft.minutes}</span><span className="cd-label">Min</span></div>
              <div className="cd-block bg-yellow"><span className="cd-num">{timeLeft.seconds}</span><span className="cd-label">Sec</span></div>
            </div>

            <motion.button 
              className="search-home-btn" 
              onClick={() => setIsSearchOpen(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Search size={18} /> Search teams, matches, groups...
            </motion.button>
          </div>

          <div className="hero-right-col">
            <motion.div 
              className="hero-trophy-wrapper"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <img src="/trophy.png" alt="World Cup Trophy" className="hero-trophy-img" loading="lazy" />
            </motion.div>

            {nextMatch && (
              <motion.div 
                className="hero-next-match"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              >
                <div className="hnm-header"><Swords size={14} style={{color:'var(--wc-red)'}}/> Next Match</div>
                <div className="hnm-body">
                  <div className="hnm-team">
                    <img src={`https://flagcdn.com/w40/${getTeamFromData(nextMatch.t1).flag}.png`} alt={nextMatch.t1} className="flag-icon-sm" loading="lazy" />
                    <span className="font-bold uppercase">{nextMatch.t1}</span>
                  </div>
                  <div className="hnm-center"><span className="vs">VS</span></div>
                  <div className="hnm-team">
                    <img src={`https://flagcdn.com/w40/${getTeamFromData(nextMatch.t2).flag}.png`} alt={nextMatch.t2} className="flag-icon-sm" loading="lazy" />
                    <span className="font-bold uppercase">{nextMatch.t2}</span>
                  </div>
                </div>
                <div className="hnm-footer">
                  <MatchCountdown targetDate={nextMatch.dateStr} />
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      <div className="mesh-bg-wrapper">
        <div className="bento-grid">
          
          {favTeams.length > 0 && favMatches.length > 0 && (
            <motion.div className="bento-item bento-fav" whileTap={{ scale: 0.98 }}>
              <div className="bento-item-header"><Star size={18} /> My Feed</div>
              <div className="bento-item-body">
                {favMatches.map(m => (
                  <div key={m.id} className="bento-match-row" style={{ position: 'relative', paddingLeft: '8px', paddingRight: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <img src={`https://flagcdn.com/w20/${getTeamFromData(m.t1).flag}.png`} alt={m.t1} className="flag-icon-xs" loading="lazy" />
                      <span>{m.t1.toUpperCase()}</span>
                      <button onClick={() => toggleFavTeam(m.t1)} title={`Unfollow ${m.t1}`} className="unfeed-btn"><X size={12}/></button>
                    </div>
                    
                    <span className="vs-sm">vs</span>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <img src={`https://flagcdn.com/w20/${getTeamFromData(m.t2).flag}.png`} alt={m.t2} className="flag-icon-xs" loading="lazy" />
                      <span>{m.t2.toUpperCase()}</span>
                      <button onClick={() => toggleFavTeam(m.t2)} title={`Unfollow ${m.t2}`} className="unfeed-btn"><X size={12}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {liveMatch && (
            <motion.div className="bento-item bento-live" whileTap={{ scale: 0.98 }}>
              <div className="bento-item-header"><span className="live-dot"></span> Live Now</div>
              <div className="bento-item-body">
                <div className="live-score-board">
                  <div className="live-team">
                    <img src={`https://flagcdn.com/w40/${getTeamFromData(liveMatch.t1).flag}.png`} alt={liveMatch.t1} className="flag-icon-sm" loading="lazy" />
                    <span className="font-bold uppercase">{liveMatch.t1}</span>
                    <span className="live-score">{liveMatch.s1}</span>
                  </div>
                  <div className="live-team">
                    <img src={`https://flagcdn.com/w40/${getTeamFromData(liveMatch.t2).flag}.png`} alt={liveMatch.t2} className="flag-icon-sm" loading="lazy" />
                    <span className="font-bold uppercase">{liveMatch.t2}</span>
                    <span className="live-score">{liveMatch.s2}</span>
                  </div>
                </div>
                <div className="live-minute"><Clock size={14} /> {liveMinute}'</div>
              </div>
            </motion.div>
          )}

          <motion.div className="bento-item bento-upcoming" whileTap={{ scale: 0.98 }}>
            <div className="bento-item-header"><Clock size={18} /> Next Up</div>
            <div className="bento-item-body">
              {upcomingMatches.map(m => (
                <div key={m.id} className="bento-match-row">
                  <img src={`https://flagcdn.com/w20/${getTeamFromData(m.t1).flag}.png`} alt={m.t1} className="flag-icon-xs" loading="lazy" />
                  <span>{m.t1.toUpperCase()}</span>
                  <span className="vs-sm">vs</span>
                  <span>{m.t2.toUpperCase()}</span>
                  <img src={`https://flagcdn.com/w20/${getTeamFromData(m.t2).flag}.png`} alt={m.t2} className="flag-icon-xs" loading="lazy" />
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div className="bento-item bento-standings" whileTap={{ scale: 0.98 }}>
            <div className="bento-item-header"><Trophy size={18} /> My Groups</div>
            <div style={{ marginTop: '8px', width: '100%' }}>
              {(() => {
                const favGroups = {};
                Object.keys(STANDINGS).forEach(group => {
                  const groupTeams = STANDINGS[group];
                  if (groupTeams && groupTeams.some(team => favTeams.includes(team.id))) {
                    favGroups[group] = groupTeams;
                  }
                });

                if (Object.keys(favGroups).length === 0) {
                  return (
                    <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                      <Star size={24} style={{ marginBottom: '8px', opacity: 0.5 }} />
                      <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>No starred teams yet.</p>
                      <p style={{ fontSize: '0.75rem' }}>Search a team and click the Star to follow!</p>
                    </div>
                  );
                }

                return Object.keys(favGroups).sort().map(group => (
                  <div key={group} className="standings-card" style={{ marginBottom: '20px', border: 'none', boxShadow: 'none', padding: '0', background: 'transparent' }}>
                    <h3 className="standings-group-title">Group {group}</h3>
                    <table className="full-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Team</th>
                          <th>P</th>
                          <th>W</th>
                          <th>D</th>
                          <th>L</th>
                          <th>GD</th>
                          <th>Pts</th>
                        </tr>
                      </thead>
                      <tbody>
                        {favGroups[group].map((team, index) => {
                          const td = getTeamFromData(team.id);
                          const isFav = favTeams.includes(team.id);
                          const gd = (team.gf || 0) - (team.ga || 0);
                          
                          return (
                            <tr key={team.id} style={isFav ? { background: 'rgba(0, 85, 255, 0.05)' } : {}}>
                              <td>{index + 1}</td>
                              <td className="team-cell">
                                <img src={`https://flagcdn.com/w20/${td.flag}.png`} alt={team.id} className="flag-icon-xs" loading="lazy" />
                                <span style={{ fontWeight: isFav ? 900 : 600, color: isFav ? 'var(--wc-blue)' : 'inherit' }}>
                                  {td.id.toUpperCase()}
                                </span>
                                {isFav && <Star size={12} style={{ marginLeft: '4px', color: 'var(--wc-yellow)', fill: 'var(--wc-yellow)' }} />}
                              </td>
                              <td>{team.p || 0}</td>
                              <td>{team.w || 0}</td>
                              <td>{team.d || 0}</td>
                              <td>{team.l || 0}</td>
                              <td style={{ color: gd > 0 ? 'var(--wc-green)' : gd < 0 ? 'var(--wc-red)' : 'var(--text-muted)', fontWeight: 700 }}>
                                {gd > 0 ? `+${gd}` : gd}
                              </td>
                              <td style={{ color: 'var(--wc-blue)', fontWeight: 800 }}>{team.pts || 0}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ));
              })()}
            </div>
          </motion.div>

          <motion.div className="bento-item bento-news" whileTap={{ scale: 0.98 }}>
            <div className="bento-item-header"><Newspaper size={18} /> Latest News</div>
            <div className="bento-item-body">
              <div className="news-item"><span className="news-tag">Update</span>Squad announcements coming next week</div>
              <div className="news-item"><span className="news-tag">Tickets</span>Ticketing phase 2 starts soon</div>
              <div className="news-item"><span className="news-tag">Venues</span>Stadium preparations on schedule</div>
            </div>
          </motion.div>

          <motion.div className="bento-item bento-hosts" whileTap={{ scale: 0.98 }}>
            <div className="bento-item-header"><MapPin size={18} /> Host Nations</div>
            <div className="bento-item-body hosts-flags-container">
              <div className="host-flag-block">
                <img src="https://flagcdn.com/w80/us.png" alt="USA" className="host-flag-img" loading="lazy" /><span>USA</span>
              </div>
              <div className="host-flag-block">
                <img src="https://flagcdn.com/w80/ca.png" alt="Canada" className="host-flag-img" loading="lazy" /><span>Canada</span>
              </div>
              <div className="host-flag-block">
                <img src="https://flagcdn.com/w80/mx.png" alt="Mexico" className="host-flag-img" loading="lazy" /><span>Mexico</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {isSearchOpen && <SearchModal onClose={() => setIsSearchOpen(false)} />}
    </div>
  );
};

export default Home;