import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [contextUser, setContextUser] = useState(null);
  const [recentSong,setRecentSong]=useState([])
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userdata'));
    if (userData) setContextUser(userData);

    const song = JSON.parse(localStorage.getItem('song'));
    if (song) setRecentSong(song);
    fetchSongs();

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
    localStorage.removeItem("user"); 
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
    }


  const fetchSongs = async () => {
        try {
            const response = await fetch("http://localhost:8080/displayAllSongs"); 
            if (!response.ok) {
                throw new Error("Failed to fetch songs");
            }
            const data = await response.json();
            setSongs(data);
        } catch (err) {
            alert(err);
        } 
    };

  return (
    <AuthContext.Provider value={{ contextUser,songs,addToRecent,recentSong, login, logout,  greeting: getGreeting() , fetchSongs}}>
      {children}
    </AuthContext.Provider>
  );
}

// Default export of the context
export default AuthContext;

// Named export for the provider
export { AuthProvider };
