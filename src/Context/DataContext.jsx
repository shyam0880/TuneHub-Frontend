import { createContext, useState, useEffect, useMemo, useContext,useRef } from 'react';
import AuthContext from '../Context/AuthContext';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const { addToRecent } = useContext(AuthContext);

    
    // const [currentSong, setCurrentSong] = useState({
    //     id: 0,
    //     artist: "Kafle",
    //     genre: "Hip-Hop",
    //     link: "https://github.com/shyam0880/Tunehub/raw/main/Songs%20File/Habibi.mp3",
    //     name: "Habibi",
    //     imgLink: "https://shorturl.at/7YPQR",
    //     likeSong: false,
    // });
    const [currentSong, setCurrentSong] = useState({
        id: 0,
        artist: "Shyam",
        genre: "Hip-Hop",
        link: "../src/Image/Main jaha rahoo.mp3",
        name: "Main Jaha Rahu",
        imgLink: "../src/Image/meain jaha rahu.jpg",
        likeSong: false,
    });
    useEffect(() => {
        if (currentSong) {
            localStorage.setItem("currentsong", JSON.stringify(currentSong));
        }
    }, [currentSong]);


    const audio = useRef(new Audio(currentSong.link));
    const [isPlaying, setIsPlaying] = useState(false);
    const [songList, setSongList] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);


    // ✅ Define togglePlay function
    const togglePlay = () => {
		if (isPlaying) {
			audio.current.pause();
		} else {
			audio.current.play();
		}
		setIsPlaying(!isPlaying);
	};

    // ✅ Handle playlist song selection
    const handlePlaylistSong = (songs, index) => {
        setSongList(songs);
        setCurrentIndex(index);
        setCurrentSong(songs[index]);
        setIsPlaying(true);
        addToRecent(songs[index]);
        togglePlay();
    };

    // ✅ Function to add a song to downloads
    const addSong = (song) => {
        setDownloadedSong((prev) => [...prev, song]);
    };
      
    const handleDownload = (song) => {
        setDownloadedSong((prevDownloadedSongs) => {
          const existingSongIndex = prevDownloadedSongs.findIndex(
            (downloaded) => downloaded.id === song.id
          );
          
          if (existingSongIndex !== -1) {
            const updatedDownloadedSongs = [...prevDownloadedSongs];
            updatedDownloadedSongs.splice(existingSongIndex, 1);
            updatedDownloadedSongs.unshift(song);
            return updatedDownloadedSongs;
          } else {
            return [song, ...prevDownloadedSongs];
          }
        });
    }

    const [downloadedSong,setDownloadedSong]=useState([]);
    const [isDownloadLoaded, setIsDownloadLoaded] = useState(false);

// Load downloaded songs from localStorage on mount
    useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('downloadedSong'));
    if (stored) setDownloadedSong(stored);
    setIsDownloadLoaded(true);
    }, []);

    // Save to localStorage *only after* we loaded from it
    useEffect(() => {
    if (isDownloadLoaded) {
        localStorage.setItem("downloadedSong", JSON.stringify(downloadedSong));
    }
    }, [downloadedSong, isDownloadLoaded]);

    // Save currentSong to localStorage whenever it changes
    
    

    // ✅ Memoize the context data (include all necessary dependencies)
    const memoizedData = useMemo(() => ({
        currentSong,
        setCurrentSong,
        handlePlaylistSong,
        downloadedSong,
        setDownloadedSong,
        isPlaying,
        setIsPlaying,
        addSong,
        songList,
        setSongList,
        currentIndex,
        setCurrentIndex,
        audio,
        togglePlay,
        handleDownload,
    }), [
        currentSong,
        downloadedSong,
        isPlaying,
        songList,
        currentIndex,
    ]);

    return (
        <DataContext.Provider value={memoizedData}>
            {children}
        </DataContext.Provider>
    );
};

export default DataContext;
