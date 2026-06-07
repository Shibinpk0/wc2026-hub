import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';
import { useWorldCup } from '../context/WorldCupContext';

const AIInsights = ({ teamA, teamB }) => {
  const { language } = useWorldCup();
  
  // useMemo ensures this only calculates ONCE per match, not on every re-render
  const probabilities = useMemo(() => {
    // Simple hash to make it random but consistent for the same two teams
    const seed = (teamA + teamB).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const probA = ((seed * 13) % 40) + 30; // Range: 30% to 70%
    const draw = 10;
    const probB = 100 - probA - draw;
    return { probA, draw, probB };
  }, [teamA, teamB]);

  return (
    <div className="ai-insight-card" style={{ marginTop: '12px', padding: '16px', background: 'rgba(0, 85, 255, 0.05)', borderRadius: '12px', border: '1px dashed var(--wc-blue)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--wc-blue)' }}>
        <Brain size={16} />
        <span style={{ fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
          {language === 'fa' ? 'پیش‌بینی هوش مصنوعی' : 'AI Win Probability'}
        </span>
      </div>

      <div style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '12px' }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${probabilities.probA}%` }} style={{ background: 'var(--wc-blue)' }} />
        <motion.div initial={{ width: 0 }} animate={{ width: `${probabilities.draw}%` }} style={{ background: 'var(--text-muted)', opacity: 0.3 }} />
        <motion.div initial={{ width: 0 }} animate={{ width: `${probabilities.probB}%` }} style={{ background: 'var(--wc-red)' }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700 }}>
        <span style={{ color: 'var(--wc-blue)' }}>{teamA}: {probabilities.probA}%</span>
        <span style={{ color: 'var(--text-muted)' }}>{language === 'fa' ? 'مساوی' : 'DRAW'}: {probabilities.draw}%</span>
        <span style={{ color: 'var(--wc-red)' }}>{teamB}: {probabilities.probB}%</span>
      </div>
    </div>
  );
};

export default AIInsights;