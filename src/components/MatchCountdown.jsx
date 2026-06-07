import React, { useState, useEffect } from 'react';

const MatchCountdown = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff <= 0) {
        setIsPast(true);
        clearInterval(interval);
      } else {
        setTimeLeft({
          d: Math.floor(diff / (1000 * 60 * 60 * 24)),
          h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          s: Math.floor((diff % (1000 * 60)) / 1000)
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (isPast) return <span style={{ color: 'var(--wc-green)', fontWeight: 700, fontSize: '0.8rem' }}>Match Started / Live</span>;

  return (
    <div className="match-countdown">
      {timeLeft.d > 0 && <div className="mc-cd-block"><span className="mc-cd-num">{timeLeft.d}d</span></div>}
      <div className="mc-cd-block"><span className="mc-cd-num">{String(timeLeft.h).padStart(2, '0')}h</span></div>
      <div className="mc-cd-block"><span className="mc-cd-num">{String(timeLeft.m).padStart(2, '0')}m</span></div>
      <div className="mc-cd-block sec"><span className="mc-cd-num">{String(timeLeft.s).padStart(2, '0')}s</span></div>
    </div>
  );
};

export default MatchCountdown;