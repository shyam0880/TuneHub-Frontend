import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [apiUrl] = useState('https://tunehub-backend-mhb4.onrender.com');
  const [contextUser, setContextUser] = useState(undefined);
  const [recentSong, setRecentSong] = useState(() => {
    try {
      const stored = localStorage.getItem('song');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Failed to parse recent songs from localStorage", e);
      return [];
    }
  });
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [alertData, setAlertData] = useState({
    show: false,
    status: true,
    message: "",
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [onConfirmAction, setOnConfirmAction] = useState(() => () => {});
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState(0);

  const handleShuffle = (songsArray) => {
    const shuffled = [...songsArray];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    let isMounted = true;

    const checkLocalUser = async () => {
      const storedUser = localStorage.getItem("userdata");
      if (!storedUser) {
        if (isMounted) setContextUser(null);
        return;
      }

      const userData = JSON.parse(storedUser);
      setContextUser(userData);

      try {
        const response = await fetch(`${apiUrl}/api/users/id/${userData.id}`, {
          credentials: "include",
        });
        if (response.ok) {
          const updatedUser = await response.json();
          setContextUser(updatedUser);
          localStorage.setItem("userdata", JSON.stringify(updatedUser));

          if (updatedUser.premium || updatedUser.role === "ADMIN") {
            setTimeout(() => fetchDashboardDetails(), 2000);
          }
        } else if ([401, 403].includes(response.status)) {
          logout();
        }
      } catch (error) {
        console.error("checkLocalUser failed:", error);
        logout();
      }
    };

    checkLocalUser();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${apiUrl}/api/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          console.warn("JWT expired or unauthorized. Logging out...");
          logout();
        }
      } catch (err) {
        console.error("Periodic auth check failed:", err);
        logout();
      }
    }, 5 * 60 * 1000); // every 5 minutes

    return () => clearInterval(interval);
  }, [apiUrl]);


  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const login = (userData) => {
    localStorage.setItem('userdata', JSON.stringify(userData));
    setContextUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("userdata");
    localStorage.removeItem("song");
    setContextUser(null);
  };

  const addToRecent = (song) => {
    setRecentSong((prevRecentSongs) => {
      const existingSongIndex = prevRecentSongs.findIndex(
        (recent) => recent.id === song.id
      );

      if (existingSongIndex !== -1) {
        const updatedRecentSongs = [...prevRecentSongs];
        updatedRecentSongs.splice(existingSongIndex, 1);
        updatedRecentSongs.unshift(song);
        return updatedRecentSongs.slice(0, 10);
      } else {
        return [song, ...prevRecentSongs].slice(0, 10);
      }
    });
  };

  const removeFromRecent = (songId) => {
    setRecentSong((prevRecentSongs) => {
      const updatedRecentSongs = prevRecentSongs.filter(
        (recent) => recent.id !== songId
      );
      return updatedRecentSongs;
    });
  };

  useEffect(() => {
    localStorage.setItem('song', JSON.stringify(recentSong));
  }, [recentSong]);

  const openConfirmDialog = (message, onConfirm) => {
    setConfirmMessage(message);
    setOnConfirmAction(() => () => {
      onConfirm();
      setConfirmOpen(false);
    });
    setConfirmOpen(true);
  };

  const cancelConfirmDialog = () => {
    setConfirmOpen(false);
  };


  const fetchDashboardDetails = async() =>{
    try{
       const response = await fetch(`${apiUrl}/api/songs/data`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setSongs(handleShuffle(data.songs));
      setArtists(data.artists)
      setAttempts(0);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching songs:", err);
      setAttempts(prev => prev + 1);
    }
  }

  const fetchArtists = async () => {
      try {
          const response = await fetch(`${apiUrl}/artists`, {
          credentials: "include",
          });
          if (!response.ok) throw new Error("Failed to fetch artists");
          const data = await response.json();
          setArtists(data);
      } catch (err) {
          setAlertData({ show: true, status: false, message: "Error fetching artists" });
      }
  };

  const fetchSongs = async () => {
    try {
          const response = await fetch(`${apiUrl}/api/songs`, {
          credentials: 'include',
          });
          if (!response.ok) throw new Error('Network response was not ok');
          const data = await response.json();
          setSongs(handleShuffle(data));
      } catch (err) {
          console.error('Error fetching songs:', err);
      }
    };

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        fetchDashboardDetails();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [loading]);

  useEffect(() => {
    if (attempts >= 5) {
      setLoading(false);
      setAlertData({ show: true, status: false, message: 'Error fetching songs. Please try again later.' });
    }
  }, [attempts]);

  return (
    <AuthContext.Provider value={{
      contextUser,
      setContextUser,
      songs,
      setSongs,
      addToRecent,
      recentSong,
      login,
      logout,
      greeting: getGreeting(),
      fetchDashboardDetails,
      alertData,
      setAlertData,
      openConfirmDialog,
      cancelConfirmDialog,
      confirmOpen,
      confirmMessage,
      onConfirmAction,
      apiUrl,
      removeFromRecent,
      artists,
      fetchArtists,
      fetchSongs
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
export { AuthProvider };
