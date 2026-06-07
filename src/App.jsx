import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTopBtn from './components/ScrollToTopBtn';
import Home from './pages/Home';
import Matches from './pages/Matches';
import MatchDetail from './pages/MatchDetail';
import TeamDetails from './pages/TeamDetails';
import Teams from './pages/Teams';
import Bracket from './pages/Bracket';
import Venues from './pages/Venues';
import Profile from './pages/Profile'; // ADDED
import './index.css';
import './pages.css';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const PageWrap = ({ children }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
    {children}
  </motion.div>
);

function App() {
  useEffect(() => {
    const isDark = JSON.parse(localStorage.getItem('darkMode') || 'false');
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="container">
        <Navbar />
        <main className="main-content" style={{ minHeight: '80vh' }}>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<PageWrap><Home /></PageWrap>} />
              <Route path="/matches" element={<PageWrap><Matches /></PageWrap>} />
              <Route path="/match/:id" element={<PageWrap><MatchDetail /></PageWrap>} />
              <Route path="/teams" element={<PageWrap><Teams /></PageWrap>} />
              <Route path="/team/:id" element={<PageWrap><TeamDetails /></PageWrap>} />
              <Route path="/bracket" element={<PageWrap><Bracket /></PageWrap>} />
              <Route path="/venues" element={<PageWrap><Venues /></PageWrap>} />
              <Route path="/profile" element={<PageWrap><Profile /></PageWrap>} /> {/* ADDED */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
        <ScrollToTopBtn />
      </div>
    </BrowserRouter>
  );
}

export default App;