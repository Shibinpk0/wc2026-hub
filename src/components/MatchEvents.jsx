import React from 'react';
import { CircleDot, AlertTriangle, ArrowRightLeft } from 'lucide-react';

// Standard football API event mapper
const getEventIcon = (type) => {
  switch (type?.toLowerCase()) {
    case 'goal':
    case 'penalty':
      return <CircleDot size={16} style={{ color: 'var(--wc-green)' }} />;
    case 'yellowcard':
      return <AlertTriangle size={16} style={{ color: 'var(--wc-yellow)' }} />;
    case 'redcard':
      return <AlertTriangle size={16} style={{ color: 'var(--wc-red)' }} />;
    case 'substitution':
      return <ArrowRightLeft size={16} style={{ color: 'var(--wc-blue)' }} />;
    default:
      return <CircleDot size={16} style={{ color: 'var(--text-muted)' }} />;
  }
};

const MatchEvents = ({ events = [], homeTeamId, awayTeamId }) => {
  if (!events || events.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        No events yet. Match is starting!
      </div>
    );
  }

  return (
    <div className="events-timeline">
      {events.map((event, index) => {
        const isHome = event.team?.id?.toLowerCase() === homeTeamId?.toLowerCase();
        
        return (
          <div key={index} className={`event-row ${isHome ? 'home-event' : 'away-event'}`}>
            <div className="event-minute">{event.time?.elapsed || event.minute}'</div>
            <div className="event-icon">{getEventIcon(event.type)}</div>
            <div className="event-details">
              <span className="event-player">{event.player?.name || 'Unknown Player'}</span>
              {event.detail && <span className="event-detail">{event.detail}</span>} {/* e.g., "Own Goal" or "Penalty" */}
              {event.assist?.name && <span className="event-assist">Assist: {event.assist.name}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MatchEvents;