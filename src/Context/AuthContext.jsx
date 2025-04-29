import { set } from '@cloudinary/url-gen/actions/variable';
import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [apiUrl] = useState('https://tunehub-backend-mhb4.onrender.com');
  const [contextUser, setContextUser] = useState(undefined);
  const [recentSong,setRecentSong]=useState([])
  const [songs, setSongs] = useState([]);
  const [alertData, setAlertData] = useState({
    show: false,
    status: true,
    message: "",
  });
  const [isRecentAdded, setIsRecentAdded] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [onConfirmAction, setOnConfirmAction] = useState(() => () => {});
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    const fetchUserAndSongs = async () => {
      const userData = JSON.parse(localStorage.getItem('userdata'));
      let finalUser = null;
      if (userData) {
        try {
          const response = await fetch(`${apiUrl}/user/${userData.id}`);
          if (response.ok) {
            const data = await response.json(); 
            finalUser = data;
          } else {
            finalUser = userData;
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          finalUser = userData;
        }
        setContextUser(finalUser);
        if (finalUser?.premium || finalUser?.role === 'admin') {
          fetchSongs();
        }
      } else {
        setContextUser(null);
      }
      
      const song = JSON.parse(localStorage.getItem('song'));
      if (song) setRecentSong(song);
  
      setIsRecentAdded(true);
     
    };
  
    fetchUserAndSongs();
  }, []);

  
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
      localStorage.setItem('song', JSON.stringify(recentSong));
  };

  const removeFromRecent = (songId) => {
    setRecentSong((prevRecentSongs) => {
      const updatedRecentSongs = prevRecentSongs.filter(
        (recent) => recent.id !== songId
      );
      return updatedRecentSongs;
    });
  }

  useEffect(() => {
    if(isRecentAdded) {
      localStorage.setItem('song', JSON.stringify(recentSong));
    }
  }, [recentSong, isRecentAdded]);


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
  

  const fetchSongs = async () => {
        try {
            const response = await fetch(`${apiUrl}/displayAllSongs`); 
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setSongs(data);
            setLoading(false);
            setAttempts(0); 
        } catch (err) {
            setAttempts(prev => prev + 1);
        } 
    };

    useEffect(() => {
      if (loading) {
        const interval = setInterval(() => {
          fetchSongs();
        }, 5000);  
  
        return () => clearInterval(interval); 
      }
    }, [loading]);
  
    useEffect(() => {
      if (attempts >= 5) {  
        setLoading(false);
        setAlertData({show: true, status: false, message:'Error fetching songs. Please try again later.'});
      }
    }, [attempts]);

  return (
    <AuthContext.Provider value={{ 
      contextUser, 
      setContextUser, 
      songs, setSongs ,
      addToRecent,
      recentSong, 
      login, 
      logout,  
      greeting: getGreeting() , 
      fetchSongs, 
      alertData,
      setAlertData,
      openConfirmDialog,
      cancelConfirmDialog,
      confirmOpen,
      confirmMessage,
      onConfirmAction,
      apiUrl,
      removeFromRecent
      }}>

      {children}
    </AuthContext.Provider>
  );
}

// Default export of the context
export default AuthContext;

// Named export for the provider
export { AuthProvider };