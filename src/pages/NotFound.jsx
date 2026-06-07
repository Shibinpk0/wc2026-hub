import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', textAlign: 'center' }}>
      <div style={{ fontSize: '6rem', fontWeight: 900, fontFamily: 'Outfit', color: 'var(--accent-red)', lineHeight: 1 }}>404</div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Outfit', margin: '16px 0 8px' }}>Oof! That's a Foul! 🟨</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>The page you're looking for is offside or doesn't exist.</p>
      <Link to="/" style={{ background: 'var(--primary-blue)', color: 'white', padding: '12px 24px', borderRadius: '30px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: 'var(--shadow-colored)' }}>
        <Home size={18} /> Return to Home
      </Link>
    </div>
  );
};

export default NotFound;