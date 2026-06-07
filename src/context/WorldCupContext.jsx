import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, provider, db } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const WorldCupContext = createContext();

const extractFlagCode = (url) => {
  if (!url) return 'un';
  const filename = url.split('/').pop(); 
  return filename.replace('.png', '');    
};

export const WorldCupProvider = ({ children }) => {
  const [data, setData] = useState({
    teams: [],
    matches: [],
    standings: {},
    stadiums: [],
    loading: true,
    error: null,
  });

  const [language, setLanguage] = useState('en');
  const [user, setUser] = useState(null);
  const [favTeams, setFavTeams] = useState([]);
  
  // MOVED DARK MODE TO CONTEXT
  const [darkMode, setDarkMode] = useState(() => JSON.parse(localStorage.getItem('darkMode') || 'false'));

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // --- FIREBASE AUTH ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google Login Error:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  // --- FAVORITES SYNC (CLOUD vs LOCAL) ---
  useEffect(() => {
    const loadFavorites = async () => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().favTeams) {
          setFavTeams(userDoc.data().favTeams);
        } else {
          setFavTeams([]);
        }
      } else {
        const storedFavs = JSON.parse(localStorage.getItem('favTeams') || '[]');
        setFavTeams(storedFavs);
      }
    };
    loadFavorites();
  }, [user]);

  const toggleFavTeam = async (teamId) => {
    let updatedFavs;
    if (favTeams.includes(teamId)) {
      updatedFavs = favTeams.filter(id => id !== teamId);
    } else {
      updatedFavs = [...favTeams, teamId];
    }
    setFavTeams(updatedFavs);

    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { favTeams: updatedFavs }, { merge: true });
    } else {
      localStorage.setItem('favTeams', JSON.stringify(updatedFavs));
    }
  };

  // --- API DATA FETCHING ---
  const refreshData = async () => {
    try {
      const response = await fetch('/api/get/teams');
      const rawTeamsData = await response.json();
      
      const internalTeamsMap = {};
      const teams = (rawTeamsData.teams || []).map(t => {
        const teamObj = {
          id: (t.fifa_code || t.id || 'unk').toLowerCase(),
          name: t.name_en || 'Unknown',
          name_fa: t.name_fa || t.name_en || 'نامعلوم',
          flag: extractFlagCode(t.flag),
          group: t.groups || t.group || '?'
        };
        if (t.id) internalTeamsMap[t.id.toString()] = teamObj; 
        if (t.fifa_code) internalTeamsMap[t.fifa_code.toLowerCase()] = teamObj;
        return teamObj;
      });

      let matches = [];
      try {
        const gamesResponse = await fetch('/api/get/games');
        const gamesData = await gamesResponse.json();
        matches = (gamesData.games || []).map(game => {
          const t1 = internalTeamsMap[(game.home_team_id || '').toString()] || internalTeamsMap[(game.home_team_id || '').toLowerCase()];
          const t2 = internalTeamsMap[(game.away_team_id || '').toString()] || internalTeamsMap[(game.away_team_id || '').toLowerCase()];
          
          let dateStr = '';
          if (game.local_date) {
            const parts = game.local_date.split(' ');
            if (parts.length === 2) {
              const [month, day, year] = parts[0].split('/');
              dateStr = `${year}-${month}-${day}T${parts[1]}:00Z`;
            }
          }

          const isFinished = game.finished === 'TRUE' || game.finished === true;
          const isNotStarted = game.time_elapsed === 'notstarted' || !game.time_elapsed;

          return {
            id: parseInt(game.id) || Math.random(),
            t1: t1?.id || 'tbd',
            t2: t2?.id || 'tbd',
            s1: parseInt(game.home_score) || 0,
            s2: parseInt(game.away_score) || 0,
            dateStr: dateStr,
            venue: game.stadium_id || 'TBD',
            group: game.group || '?',
            type: isNotStarted ? 'upcoming' : (isFinished ? 'finished' : 'live'),
            minute: isNotStarted ? '0' : (isFinished ? 'FT' : (game.time_elapsed || '0')),
            home_name: game.home_team_name_en || 'TBD',
            home_name_fa: game.home_team_name_fa || '',
            away_name: game.away_team_name_en || 'TBD',
            away_name_fa: game.away_team_name_fa || ''
          };
        });
      } catch (e) {
        console.warn("Could not fetch/parse games:", e);
      }

      let standings = {};
      try {
        const groupsResponse = await fetch('/api/get/groups');
        const groupsData = await groupsResponse.json();
        (groupsData.groups || []).forEach(g => {
          const groupLetter = g.name || g.group || '?';
          standings[groupLetter] = (g.teams || []).map(t => {
            const matchedTeam = internalTeamsMap[(t.team_id || '').toString()];
            return {
              id: matchedTeam ? matchedTeam.id : ((t.team_id || 'unk').toString()).toLowerCase(),
              name_fa: matchedTeam ? matchedTeam.name_fa : '',
              p: parseInt(t.mp || t.p) || 0, 
              w: parseInt(t.w) || 0, 
              d: parseInt(t.d) || 0, 
              l: parseInt(t.l) || 0,
              gf: parseInt(t.gf) || 0, 
              ga: parseInt(t.ga) || 0, 
              pts: parseInt(t.pts) || 0
            };
          }).sort((a, b) => {
            if (b.pts !== a.pts) return b.pts - a.pts;
            const gdA = a.gf - a.ga;
            const gdB = b.gf - b.ga;
            if (gdB !== gdA) return gdB - gdA;
            return b.gf - a.gf;
          });
        });
      } catch (e) {
        console.warn("Could not fetch/parse groups:", e);
      }

      let stadiums = [];
      try {
        const stadiumsResponse = await fetch('/api/get/stadiums');
        const stadiumsData = await stadiumsResponse.json();
        stadiums = stadiumsData.stadiums || [];
      } catch (e) {
        console.warn("Could not fetch/parse stadiums:", e);
      }

      setData({
        teams,
        matches,
        standings,
        stadiums,
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error("Critical Error fetching World Cup data:", err);
      setData(prev => ({ ...prev, loading: false, error: err.message }));
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    if (data.loading || data.matches.length === 0) return; 
    const hasLiveMatch = data.matches.some(m => m.type === 'live');
    const refreshInterval = hasLiveMatch ? 15000 : 60000;
    const timeoutId = setTimeout(() => {
      refreshData();
    }, refreshInterval);
    return () => clearTimeout(timeoutId);
  }, [data.matches]);

  const getStadiumName = (stadiumId) => {
    if (!stadiumId || stadiumId === 'TBD') return 'TBD';
    const stadium = data.stadiums.find(s => s.id.toString() === stadiumId.toString());
    return stadium ? (stadium.fifa_name || stadium.name_en) : stadiumId;
  };

  return (
    <WorldCupContext.Provider value={{ 
      ...data, 
      language, 
      setLanguage, 
      refreshData, 
      getStadiumName,
      user,
      loginWithGoogle,
      logout,
      favTeams,
      toggleFavTeam,
      darkMode,
      setDarkMode
    }}>
      {children}
    </WorldCupContext.Provider>
  );
};

export const useWorldCup = () => {
  const context = useContext(WorldCupContext);
  if (!context) throw new Error('useWorldCup must be used within a WorldCupProvider');
  return context;
};