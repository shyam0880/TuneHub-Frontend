import React ,{ useRef, useState, useContext, useEffect }from 'react';
import AuthContext from '../AutherContext/AuthContext';
import { useNavigate } from "react-router-dom";
import '../CSS/displaytable.css';

import AddMusic from '../Component/AddMusic';
import Playlist from '../Component/Playlist';


const Dashboard = () => {
	const { songs, setSongs, contextUser, addToRecent, recentSong ,greeting } = useContext(AuthContext);
	const navigate = useNavigate();
	const [home,setHome]= useState(0);
    const [popUp, setPopUp] = useState(false);
    const popSongRef = useRef(null);
    const popSongRef1 = useRef(null);
	const [songList, setSongList] = useState([]); 
  	const [currentIndex, setCurrentIndex] = useState(-1);

	//serch songs list
	const [search,setSearch] = useState("");
	
	
	if (!contextUser) {
	 navigate("/")  
	}

	

    const [currentSong, setCurrentSong] = useState({
        id: 0,
        artist: "Kafle",
        genre: "Hip-Hop",
        link: "https://github.com/shyam0880/Tunehub/raw/main/Songs%20File/Habibi.mp3",
        name: "Habibi",
        imgLink: "https://shorturl.at/7YPQR",
		likeSong: false,
    });

    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(50);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(new Audio(currentSong.link));
	const [prevId,setPrevId] = useState(0);
	const [showDelete,setShowDelete] = useState(false);

	const [playbackMode, setPlaybackMode] = useState("normal"); 
	// Modes: "normal", "autoPlay", "repeat"

	const togglePlaybackMode = () => {
		setPlaybackMode((prevMode) => {
			if (prevMode === "normal") return "autoPlay";
			if (prevMode === "autoPlay") return "repeat";
			return "normal";
		});
	};


	useEffect(() => {
		const audio = audioRef.current;
		audio.src = currentSong.link;
		audio.load();
		if (isPlaying) {
			audio.play();
		} else {
			if(prevId!=currentSong.id){

				togglePlay();
				setPrevId(currentSong.id);
			}
			else{
				setIsPlaying(false);

			}
		}
		setCurrentTime(0);

		const setAudioData = () => setDuration(audio.duration);
		const updateTime = () => setCurrentTime(audio.currentTime);
	
		audio.addEventListener("loadedmetadata", setAudioData);
		audio.addEventListener("timeupdate", updateTime); 
	
		return () => {
			audio.pause();
			audio.removeEventListener("loadedmetadata", setAudioData);
			audio.removeEventListener("timeupdate", updateTime);
		};
	}, [currentSong]);

	useEffect(() => {
		const audio = audioRef.current;
	
		const handleSongEnd = () => {
			if (playbackMode === "repeat") {
				audio.currentTime = 0;
				audio.play();
			} else if (playbackMode === "autoPlay") {
				handleNext(); // Move to the next song
			} else {
				setIsPlaying(false); // Stop playback
			}
		};
	
		audio.addEventListener("ended", handleSongEnd);
	
		return () => {
			audio.removeEventListener("ended", handleSongEnd);
		};
	}, [playbackMode]);

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

	const handleDelete = async(id)=>{
		try{
			const response= await fetch(`http://localhost:8080/deleteById/${id}`,{
			method:"DELETE",	
			});
			
			if (!response.ok) {
				throw new Error("Failed to fetch songs");
            }
			alert(await response.text());

			setSongs((prevSongs) => prevSongs.filter(song => song.id !== id));
            setShowDelete(null);

		}
		catch(err){
			alert(err);
		}
	}
            
    const scroll = (ref, distance) => {
        if (ref.current) {
            ref.current.scrollBy({ left: distance, behavior: "smooth" });
        }
    };

	const handleSeek = (e) => {
        const seekTime = (e.target.value / 100) * duration;
        audioRef.current.currentTime = seekTime;
        setCurrentTime(seekTime);
    };

	const handleVolume = (e) => {
        const volumeValue = e.target.value;
        audioRef.current.volume = volumeValue / 100;
        setVolume(volumeValue);
    };

	const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

	
	//helps to play from search
	const handleSongClick = (song) => {
        setCurrentSong(song);
        setIsPlaying(true);
		addToRecent(song);
		togglePlay();
		setSongList([]); // Clear playlist selection
    	setCurrentIndex(1);

		
    };

	const handlePlaylistSong = (songs, index) => {
		setSongList(songs);
		setCurrentIndex(index);
		setCurrentSong(songs[index]);
		setIsPlaying(true);
		addToRecent(songs[index]);
		togglePlay();
	};

	// Navigate Forward
	const handleNext = () => {
	if (songList.length > 0 && currentIndex < songList.length - 1) {
		const nextIndex = (currentIndex + 1);
		setCurrentSong(songList[nextIndex]);
		setCurrentIndex(nextIndex);
		addToRecent(songList[nextIndex]);
	}
	};


	// Navigate Backward
	const handlePrevious = () => {
	if (songList.length > 0 && currentIndex > 0) {
		const prevIndex = (currentIndex - 1);
		setCurrentSong(songList[prevIndex]);
		setCurrentIndex(prevIndex);
		addToRecent(songList[prevIndex]);
	}
	};

	//filter song based on text
	const filterSongs =
	search.trim()===""?[]:
	 songs.filter(song =>
		song.name.toLowerCase().includes(search.toLowerCase()) ||
		song.artist.toLowerCase().includes(search.toLowerCase())
	  );

    

  return (
    <header>
	<div class="menu_side">
		<h1>Tune<span>Hub</span></h1>
		<div class="playlist">
			<h4 className={home===0?"active":""} onClick={()=>{setHome(0)}}> Home</h4>
			<h4 className={home===1?"active":""} onClick={()=>{setHome(1)}}> My Liberary</h4>
			<br/>
			<h4> Like Song</h4>
			<h4> Recommendation</h4>
		</div>
		
	</div>
    {popUp&&(<div className="popup" >
        <div className="contant">
        <i class="bi bi-x-lg" onClick={()=>{setPopUp(false)}}></i>
            <AddMusic />
        </div>
    </div>)}



	<div class="song_side">
		<nav>
            <h3>{contextUser ? `${greeting}, ${contextUser.username}` : "Loading..."}</h3>
			<div class="search">
				<input type="text" value={search} placeholder="Search Music...." onChange={(e) => setSearch(e.target.value)} />
				<i class="bi bi-search"></i>
			</div>
			<div class="user">
				<img src="" alt=""/>
			</div>
		</nav>
	{home===0?(<div className='box'>
		{search.trim() !== "" && (<div class="menuSong">
			{filterSongs.length>0?(
				filterSongs.map((song,index) => (
						<li key={song.id} className="songItem">
						<div className="img_play">
							<img src={song.imgLink} alt="" />
						</div>
						<h5>
							{song.name} <br />
							<div className="subtitle">{song.artist}</div>
						</h5>
						<div className="options">
							<i className={((currentSong.id===song.id)&& isPlaying)?("bi bi-pause-circle-fill"):("bi bi-play-circle-fill")} onClick={() =>handleSongClick(song)}></i>
						</div>
						</li>
				)
					)):(
					<li className="noSong">No matching songs found</li>
					)
				}	
		</div>)}


		<div class="content">
			<h1>Alen walker fade</h1>
			<p>You are the sahadow to my light why did you fell us Another start you feel<br/> Away afraid our aim is out of sight wanna see us Alive</p>
			<div class="buttons">
				<button>PLAY</button>
				<button>FOLLOW</button>
			</div>
		</div>

		<div class="popular_song">
			<div class="h4">
				<h4>Pick where you left</h4>
				<div class="btn_s">
                <i class="bi bi-arrow-left-short" id="song_prev" onClick={() => scroll(popSongRef, -330)}></i>
				<i class="bi bi-arrow-right-short" id="song_next" onClick={() => scroll(popSongRef, +330)}></i>
				</div>
			</div>
			<div className="pop_song" ref={popSongRef}>
			{recentSong.length>0?(
				recentSong.map((song,index) => (
						<li key={song.id} className="songItem">
						<div className="img_play">
							<img src={song.imgLink} alt={song.name} />
						</div>
						<h5>
							{song.name} <br />
							<div className="subtitle">{song.artist}</div>
						</h5>
						<div className="options">
							<i className={((currentSong.id===song.id)&& isPlaying)?("bi bi-pause-circle-fill"):("bi bi-play-circle-fill")} onClick={() =>handlePlaylistSong(recentSong,index)}></i>
						</div>
						</li>
				)
					)):(
					<li className="noSong"></li>
					)
				}		
			</div>
		</div>
		<div class="popular_song">
			<div class="h4">
				<h4>Your Song</h4>
				<div class="btn_s">
					<i class="bi bi-arrow-left-short" id="song_prev1"onClick={() => scroll(popSongRef1, -330)}></i>
					<i class="bi bi-arrow-right-short" id="song_next"onClick={() => scroll(popSongRef1, +330)}></i>
				</div>
			</div>
			<div class="pop_song" ref={popSongRef1}>
                <li className="addSong" onClick={()=>{setPopUp(true)}}>
                    <i class="bi bi-plus-circle"></i>
                </li>
				{songs.length>0?(
				songs.map((song,index) => (
						<li key={song.id} className="songItem">
						<div className="img_play">
							<img src={song.imgLink} alt={song.name} />
						</div>
						<h5>
							{song.name} <br />
							<div className="subtitle">{song.artist}</div>
						</h5>
						<div className="options">
						<i 
                            className="bi bi-three-dots-vertical" 
                            onClick={() => setShowDelete(showDelete === song.id ? null : song.id)} 
                        ></i>
							{showDelete === song.id && (
                            <button className="testButton" onClick={() => handleDelete(song.id)}>
                                Delete
                            </button>
                        )}
							<i className={`bi ${currentSong.id === song.id && isPlaying ? "bi-pause-circle-fill" : "bi-play-circle-fill"}`} 
								onClick={() => handlePlaylistSong(songs, index)}
							></i>
						</div>
						</li>
				)
					)):(
					<li className="noSong"></li>
					)
				}
								
			</div>
		</div>
		<div class="popular_artist">
			<div class="h4">
				<h4>Popular Artist</h4>
				<div class="btn_s">
					<i class="bi bi-arrow-left-short" id="artist_prev"></i>
					<i class="bi bi-arrow-right-short" id="artist_next"></i>
				</div>
			</div>
			<div class="item">
				<li>
					<img src="../static/css/image/disk.jpg" alt=""/>
				</li>
				
			</div>
		</div>
		</div>):(" ")}
	{home===1?(
		<Playlist currSong={currentSong} onSongSelect={handlePlaylistSong} checkPlay={isPlaying}/>
	):("")}
	</div>



	<div className="master_play">
		<div className="wave" id="wave">
			<div className={`wave1 ${isPlaying ? "wave-play" : ""}`}></div>
			<div className={`wave1 ${isPlaying ? "wave-play" : ""}`}></div>
			<div className={`wave1 ${isPlaying ? "wave-play" : ""}`}></div>
		</div>
		<img src={currentSong.imgLink} alt={currentSong.name} id="poster_master_play" />
		<h5 id="title">
			{currentSong.name}
			<div className="subtitle">{currentSong.artist}</div>
		</h5>
		<div className="icon">
			<i className="bi shuffle bi-music-note-beamed"></i>
			<i className="bi bi-skip-start-fill"
			onClick={()=>handlePrevious()}
			></i>
			<i
				className={`bi ${isPlaying ? "bi-pause-fill" : "bi-play-fill"}`}
				id="masterPlay"
				onClick={togglePlay}
				style={{ cursor: "pointer" }}
			></i>
			<i className="bi bi-skip-end-fill"
			onClick={()=>handleNext()}
			></i>
		</div>
		<span id="currentStart">{formatTime(currentTime)}</span>
		<div className="bar">
			<input type="range" id="seek" min="0" max="100" value={(currentTime / duration) * 100 || 0} onChange={handleSeek} />
		</div>
		<span id="currentEnd">{formatTime(duration)}</span>
		<div className="vol">
			<i className="bi bi-volume-down-fill" id="vol_icon"></i>
			<input type="range" id="vol" min="0" max="100" value={volume} onChange={handleVolume} />
		</div>
		<div className="icon">
		<i
			className={
				playbackMode === "normal"
				? "bi bi-ban"
				: playbackMode === "autoPlay"
				? "bi bi-repeat"
				: "bi bi-repeat-1"
			}
			onClick={togglePlaybackMode}
			></i>
			<i
			className={isDownloaded ? "bi bi-cloud-check" : "bi bi-cloud-arrow-down"}
			onClick={toggleDownload}
			style={{
				cursor: "pointer",
				fontSize: "1.7rem",
				color: isDownloaded ? "green" : "gray",
				marginLeft: "10px"
			}}
			></i>
			<i className="bi bi-chevron-compact-right" onClick={togglePanel}></i>
		</div>
	</div>
	<div className={`masterMask ${isPanelOpen ? "" : "open"}`}>
		<div className="miniMusic">
			<i className="bi bi-chevron-compact-left" onClick={togglePanel}></i>
			<img src={currentSong.imgLink} alt={currentSong.name} className={`imgplay ${isPlaying ? "playing" : ""}`} />
			<span></span>
			<i
			className={`bi ${isPlaying ? "bi-pause-fill" : "bi-play-fill"}`}
			id="masterPlay"
			onClick={togglePlay}
			style={{ cursor: "pointer" }}
			></i>
		</div>
	</div>

</header>
  )
}

export default Dashboard
