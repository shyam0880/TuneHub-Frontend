import { createContext, useState, useEffect, useMemo, useContext,useRef } from 'react';
import AuthContext from './AuthContext';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const { addToRecent } = useContext(AuthContext);

    const [currentSong, setCurrentSong] = useState({
        id: 0,
        artist: "Tunehub",
        genre: "Melody",
        link: "https://res.cloudinary.com/dvwcy1jab/video/upload/v1746026721/Welcome_to_TuneHub_your_ultimate_desti_wwfe5o.mp3",
        name: "Welcome to Tunehub",
        imgLink: "https://res.cloudinary.com/dvwcy1jab/image/upload/v1739204753/4f2eca63-aac2-46ed-919e-8179747f236a_tlrjd6.jpg",
        likeSong: false,
    });

    const audio = useRef(new Audio(currentSong.link));
    const [isPlaying, setIsPlaying] = useState(false);
    const [songList, setSongList] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [downloadedSong,setDownloadedSong]=useState([]);
    const [isDownloadLoaded, setIsDownloadLoaded] = useState(false);

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