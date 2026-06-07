import React, { useState, useEffect } from 'react'; // FIXED: Added useEffect to the import
import { motion } from 'framer-motion';
import { Trophy, RotateCcw } from 'lucide-react';
import { useWorldCup } from '../context/WorldCupContext';
import confetti from 'canvas-confetti';

// Helper to create empty rounds with unique objects
const createEmptyRound = (numMatches) => 
  Array.from({ length: numMatches }, () => ({ t1: 'TBD', t2: 'TBD', winner: null }));

const Bracket = () => {
  const { teams: TEAMS, loading } = useWorldCup();
  
  // Dynamically build the first round with real teams
  const buildInitialRounds = (teamsList) => {
    // 2026 World Cup has 48 teams, 1st knockout round is Round of 32
    const firstRoundTeams = teamsList.slice(0, 32); 
    const roundOf32 = [];
    
    for (let i = 0; i < 32; i += 2) {
      if (firstRoundTeams[i] && firstRoundTeams[i+1]) {
        roundOf32.push({
          t1: firstRoundTeams[i].id,
          t2: firstRoundTeams[i + 1].id,
          winner: null
        });
      }
    }

    return [
      { name: 'Round of 32', matches: roundOf32 },
      { name: 'Round of 16', matches: createEmptyRound(8) },
      { name: 'Quarter-Finals', matches: createEmptyRound(4) },
      { name: 'Semi-Finals', matches: createEmptyRound(2) },
      { name: 'Final', matches: createEmptyRound(1) }
    ];
  };

  const [bracket, setBracket] = useState([]);

  useEffect(() => {
    if (TEAMS.length > 0) {
      setBracket(buildInitialRounds(TEAMS));
    }
  }, [TEAMS]);

  if (loading || bracket.length === 0) return (
    <div className="page-header-matches" style={{height:'60vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
      Loading Bracket...
    </div>
  );

  const handleAdvance = (roundIdx, matchIdx, team) => {
    // If clicking the team that already won, do nothing
    if (bracket[roundIdx].matches[matchIdx].winner === team) return;

    const newBracket = JSON.parse(JSON.stringify(bracket));
    newBracket[roundIdx].matches[matchIdx].winner = team;

    // 🎉 CONFETTI LOGIC: If this is the Final match, fire confetti!
    if (roundIdx === bracket.length - 1) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#0055FF', '#FF2D55', '#00FF85', '#f3dd50'] // World Cup palette
      });
    }

    // Advance to next round
    if (roundIdx < bracket.length - 1) {
      const nextMatchIdx = Math.floor(matchIdx / 2);
      const isTopTeam = matchIdx % 2 === 0;
      
      if (isTopTeam) {
        newBracket[roundIdx + 1].matches[nextMatchIdx].t1 = team;
      } else {
        newBracket[roundIdx + 1].matches[nextMatchIdx].t2 = team;
      }
    }
    setBracket(newBracket);
  };

  const resetBracket = () => {
    setBracket(buildInitialRounds(TEAMS));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="page-header-matches" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="page-title">Bracket Predictor</h1>
          <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Click a team to advance them through the tournament.</p>
        </div>
        <button 
          onClick={resetBracket} 
          className="search-home-btn"
          style={{ marginTop: 0, maxWidth: '180px' }}
        >
          <RotateCcw size={16} /> Reset Bracket
        </button>
      </div>

      <div className="bracket-container">
        {bracket.map((round, rIdx) => (
          <div key={round.name} className="bracket-round">
            <h3 className="bracket-round-title">{round.name}</h3>
            <div className="bracket-matches">
              {round.matches.map((match, mIdx) => (
                <div key={mIdx} className="bracket-match">
                  <button 
                    className={`bracket-team ${match.winner === match.t1 ? 'winner' : ''}`}
                    onClick={() => match.t1 !== 'TBD' && handleAdvance(rIdx, mIdx, match.t1)}
                    disabled={match.t1 === 'TBD'}
                  >
                    {match.t1.toUpperCase()}
                  </button>
                  <div className="bracket-vs">VS</div>
                  <button 
                    className={`bracket-team ${match.winner === match.t2 ? 'winner' : ''}`}
                    onClick={() => match.t2 !== 'TBD' && handleAdvance(rIdx, mIdx, match.t2)}
                    disabled={match.t2 === 'TBD'}
                  >
                    {match.t2.toUpperCase()}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <div className="bracket-champion">
          <Trophy size={32} style={{ color: 'var(--wc-yellow)' }} />
          <h3>Champion</h3>
          <div className="bracket-champion-name">
            {bracket[bracket.length - 1].matches[0].winner ? bracket[bracket.length - 1].matches[0].winner.toUpperCase() : 'TBD'}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Bracket;