import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users } from 'lucide-react';
import { useWorldCup } from '../context/WorldCupContext';

const Venues = () => {
  const { stadiums, loading } = useWorldCup();

  // Map API stadiums to UI format if needed, though they are already quite clean
  const mappedVenues = stadiums.map(s => ({
    id: s.id,
    name: s.fifa_name || s.name_en,
    city: s.city_en,
    country: s.country_en,
    flag: s.country_en === 'United States' ? 'us' : (s.country_en === 'Canada' ? 'ca' : 'mx'),
    capacity: s.capacity.toLocaleString(),
    image: `https://source.unsplash.com/featured/?stadium,${s.city_en.replace(/ /g, '')}` // Dynamic image fallback
  }));

  if (loading) return <div className="page-header-matches" style={{height:'60vh', display:'flex', alignItems:'center', justifyContent:'center'}}>Loading Venues...</div>;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="page-header-matches">
        <h1 className="page-title">Host Nations & Venues</h1>
        <p style={{ color: 'var(--text-muted)', fontWeight: 600, maxWidth: '600px', marginBottom: '24px' }}>
          For the first time, the tournament will be hosted across three nations: USA, Canada, and Mexico.
        </p>
      </div>

      <div className="venues-grid">
        {mappedVenues.map(venue => (
          <motion.div 
            key={venue.id} 
            className="venue-card"
            whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(0, 85, 255, 0.15)' }}
          >
            <div className="venue-img-wrapper">
              <img src={venue.image} alt={venue.name} className="venue-img" />
              <div className="venue-country-badge">
                <img src={`https://flagcdn.com/w20/${venue.flag}.png`} alt={venue.country} className="flag-icon-sm" style={{ marginRight: '6px' }} />
                {venue.country}
              </div>
            </div>
            <div className="venue-info">
              <h3 className="venue-name">{venue.name}</h3>
              <div className="venue-meta">
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--wc-blue)', fontWeight: 700, fontSize: '0.9rem' }}>
                  <MapPin size={14} /> {venue.city}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.8rem' }}>
                  <Users size={14} /> {venue.capacity}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Venues;