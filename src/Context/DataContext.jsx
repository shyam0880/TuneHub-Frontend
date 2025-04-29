import { createContext, useState, useEffect, useMemo, useContext,useRef } from 'react';
import AuthContext from '../Context/AuthContext';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const { addToRecent } = useContext(AuthContext);

    
    const [currentSong, setCurrentSong] = useState({
        id: 0,
        artist: "Kafle",
        genre: "Hip-Hop",
        link: "https://github.com/shyam0880/Tunehub/raw/main/Songs%20File/Habibi.mp3",
        name: "Habibi",
        imgLink: "https://shorturl.at/7YPQR",
        likeSong: false,
    });

    const audio = useRef(new Audio(currentSong.link));
    const [isPlaying, setIsPlaying] = useState(false);
    const [songList, setSongList] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [downloadedSong,setDownloadedSong]=useState([]);
    const [isDownloadLoaded, setIsDownloadLoaded] = useState(false);


    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('currentsong'));
        if (stored) setCurrentSong(stored);
    }, []);

    useEffect(() => {
        localStorage.setItem("currentsong", JSON.stringify(currentSong));
    }
    , [currentSong]);

    const togglePlay = () => {
		if (isPlaying) {
			audio.current.pause();
		} else {
			audio.current.play();
		}
		setIsPlaying(!isPlaying);
	};

    const handlePlaylistSong = (songs, index) => {
        setSongList(songs);
        setCurrentIndex(index);
        setCurrentSong(songs[index]);
        setIsPlaying(true);
        addToRecent(songs[index]);
        togglePlay();
    };

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

    const removeFromDownload = (songId) => {
        setDownloadedSong((prevDownloadedSongs) => {
            const updatedDownloadedSongs = prevDownloadedSongs.filter(
                (downloaded) => downloaded.id !== songId
            );
            return updatedDownloadedSongs;
        });
    }


    useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('downloadedSong'));
    if (stored) setDownloadedSong(stored);
    setIsDownloadLoaded(true);
    }, []);

    useEffect(() => {
    if (isDownloadLoaded) {
        localStorage.setItem("downloadedSong", JSON.stringify(downloadedSong));
    }
    }, [downloadedSong, isDownloadLoaded]);

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
        removeFromDownload
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