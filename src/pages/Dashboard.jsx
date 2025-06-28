import React ,{ useRef, useState, useContext, useEffect, useMemo }from 'react';
import AuthContext from '../context/AuthContext';
import DataContext from '../context/DataContext';
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Playlist from '../components/features/Playlist';
import ProfileCard from '../components/ui/ProfileCard';
import AddMusic from '../components/forms/AddMusic';
import AddSongToPlaylist from '../components/forms/AddSongToPlaylist';


const Dashboard = () => {
	const { songs, setSongs, contextUser, addToRecent, recentSong ,greeting, setAlertData, openConfirmDialog, apiUrl, removeFromRecent, artists, fetchArtists } = useContext(AuthContext);
	const {
		currentSong,
		setCurrentSong,
		handlePlaylistSong,
		isPlaying,
    	setIsPlaying,
		songList, 
		setSongList,
		currentIndex, 
		setCurrentIndex,
		audio,
		togglePlay,
		downloadedSong,
		addSong,
		setDownloadedSong,
		handleDownload,
		removeFromDownload,
	} = useContext(DataContext);
	const navigate = useNavigate();
	const location = useLocation();
	const isChildRouteActive = !["/dashboard", "/dashboard/"].includes(location.pathname);


	useEffect(() => {
		if (!contextUser) {
			navigate("/");
			return;
		}
		else if (!contextUser?.premium && contextUser?.role === "USER") {
            if (location.pathname !== "/dashboard/payment") {
                navigate("/dashboard/payment");
            }
        }
	}, [contextUser, navigate, location.pathname]);
	  
	const [home,setHome]= useState(0);
    const [popUp, setPopUp] = useState(false);
	const [editingSong, setEditingSong] = useState(null);
    const popSongRef = useRef(null);
    const popSongRef1 = useRef(null);
	const artistRef = useRef(null);

	//serch songs list
	const [search,setSearch] = useState("");

    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(50);
    const audioRef = audio;
	const [prevId,setPrevId] = useState(0);
	const [showDelete,setShowDelete] = useState(false);
	const [showRemove,setShowRemove] = useState(false);

	const [playbackMode, setPlaybackMode] = useState("normal"); 

	const [isPanelOpen, setIsPanelOpen] = useState(true);
	const [openMenu, setOpenMenu] = useState(null);
	const [profileUpdate, setProfileUpdate] = useState(false);
	const [isSearchActive, setIsSearchActive] = useState(false); //for search view for small device
	const [sidebarResponsive, setSidebarResponsive] = useState(false);
	const [popupOpen, setPopupOpen] = useState(false); 
	const [addsongId, setAddSongId] = useState(null); 


	const togglePlaybackMode = () => {
		setPlaybackMode((prevMode) => {
			if (prevMode === "normal") return "autoPlay";
			if (prevMode === "autoPlay") return "repeat";
			return "normal";
		});
	};

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (!event.target.closest(".options-container")) {
				setShowDelete(false);
				setOpenMenu(null);
				setShowRemove(false);
			}
		};
		document.addEventListener("click", handleClickOutside);
		return () => document.removeEventListener("click", handleClickOutside);
	}, []);
	
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

	const handleDelete = async(id)=>{
		try{
			const response= await fetch(`${apiUrl}/api/songs/${id}`,{
			method:"DELETE",
			credentials: "include",	
			});
			
			if (!response.ok) {
				setAlertData({ show: true, status: false, message:"Song not deleted" });
            }
			setAlertData({show: true, status: true, message:await response.text()});
			removeFromRecent(id);
			removeFromDownload(id);

			setSongs((prevSongs) => prevSongs.filter(song => song.id !== id));
            setShowDelete(null);

		}
		catch(err){
			setAlertData({ show: true, status: false, message:err});
		}
	}

	const handleArtistDelete = async (id) => {
        try {
            const response = await fetch(`${apiUrl}/artists/${id}`, {
                method: "DELETE",
				credentials: "include",
            });
    
            if (response.ok) {
                setAlertData({ show: true, status: true, message: "Artist deleted successfully" });
                fetchArtists(); 
            } else {
                const errorData = await response.json();
                setAlertData({ show: true, status: false, message: errorData.message || "Unknown error" });
            }
        } catch (error) {
            setAlertData({ show: true, status: false, message: error.message });
        }
    
        setOpenMenu(null);
    };
            
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
        if (isNaN(time) || time === 0) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

	
	// //helps to play from search
	const handleSongClick = (song) => {
        setCurrentSong(song);
        setIsPlaying(true);
		addToRecent(song);
		togglePlay();
		setSongList([]); // Clear playlist selection
    	setCurrentIndex(1);	
    };


	// Navigate Forward
	const handleNext = () => {
		if (songList.length > 0) {
			const nextIndex = (currentIndex + 1) % songList.length;
			setCurrentSong(songList[nextIndex]);
			setCurrentIndex(nextIndex);
			addToRecent(songList[nextIndex]);
		}
	};


	// Navigate Backward
	const handlePrevious = () => {
		if (songList.length > 0 && currentIndex > 0) {
			const prevIndex = currentIndex - 1;
			setCurrentSong(songList[prevIndex]);
			setCurrentIndex(prevIndex);
			addToRecent(songList[prevIndex]);
		}
	};

	//filter song based on text
	const filterSongs = useMemo(() => {
	const trimmedSearch = search.trim().toLowerCase();
	if (trimmedSearch === "") return [];

	return songs.filter(song =>
		(song.name || "").toLowerCase().includes(trimmedSearch) ||
		(song.artist || "").toLowerCase().includes(trimmedSearch)
	);
	}, [search, songs]);


	

	const handleHome = (value) => {
        if(!isChildRouteActive){
	        setHome(value);
			}
		else{
			navigate("/dashboard");
			setHome(value);
		}
    };

	const togglePanel = () => {
		setIsPanelOpen(!isPanelOpen);
	};

	const isDownloaded = downloadedSong.some((s) => s.id === currentSong.id);

	const toggleDownload = () => {
	  if (isDownloaded) {
		// remove from download
		setDownloadedSong(prev => prev.filter(s => s.id !== currentSong.id));
	  } else {
		// add to download
		handleDownload(currentSong);
	  }
	}

	const handleEdit = (song) => {
		setEditingSong(song);     // Prefill form
		setPopUp(true);           // Open popup
	};
	
	const handleAddSongToPlaylist = (songId) => {
		setAddSongId(songId);
		setPopupOpen(true);    
	};

	const handleArtistSongs = (artistDetails) => {
        navigate('/dashboard/songs', { state: { artistDetails } });
    };


	// const likeSong = songs.filter((song) => song.likeSong === true);
	const handleDeleteClick = (id) => {
		openConfirmDialog("Are you sure you want to delete this song?", () => handleDelete(id));
	};

	const handleDeleteArtist = (id) => {
		openConfirmDialog("Are you sure you want to delete this artist?", () => handleArtistDelete(id));
	};

  return (
    <div className='app-layout'>
	<div className="sidebar-responsive">
		<div className='side-right'>
			<i onClick={() => setSidebarResponsive(prev => !prev)} className={`bi ${sidebarResponsive? 'bi-chevron-compact-left' : 'bi-chevron-compact-right'}`}></i>
		</div>
		<div className={`navbar ${sidebarResponsive? 'active' : ''}`}>
			<div className="navbar__link">
				<h4 onClick={()=>{handleHome(0)}}><i className={`bi bi-house ${home===0 && !isChildRouteActive?'active':''}`}></i></h4>
				<span>Home</span>
			</div>
			<div className="navbar__link">
				<h4 onClick={()=>{handleHome(1)}}><i className={`bi bi-collection ${home===1 && !isChildRouteActive?'active':''}`}></i></h4>
				<span>Library</span>
			</div>
			<div className="navbar__link">
				<h4 onClick={() => navigate("/dashboard/downloaded")}><i className={`bi bi-download ${(location.pathname==="/dashboard/downloaded")?"active":""}`}></i></h4>
				<span>Download</span>
			</div>
			{(!contextUser.premium && contextUser?.role !== "ADMIN") && (
			<div className="navbar__link">
				<h4 onClick={() => navigate("/dashboard/payment")}><i className={`bi bi-wallet ${(location.pathname==="/dashboard/payment")?"active":""}`}></i></h4>
				<span>Upgrade to Premium</span>
			</div>
			)}
			{contextUser?.role == "ADMIN"&&(
			<div className="navbar__link">
				<h4 onClick={() => navigate("/dashboard/artist")}><i className={`bi bi-people ${(location.pathname==="/dashboard/artist")?"active":""}`}></i></h4>
				<span>Artist</span>
			</div>
			)}
			{contextUser?.role == "ADMIN"&&(
			<div className="navbar__link">
				<h4 onClick={() => navigate("/dashboard/user-list")}><i className={`bi bi-person-circle ${(location.pathname==="/dashboard/user-list")?"active":""}`}></i></h4>
				<span>Users</span>
			</div>
			)}
			{contextUser?.role == "ADMIN"&&(
			<div className="navbar__link">
				<h4 onClick={() => navigate("/dashboard/songs")}><i className={`bi bi-file-music ${(location.pathname==="/dashboard/songs")?"active":""}`}></i></h4>
				<span>Songs</span>
			</div>
			)}
		</div>
	</div>
	<div className="sidebar">
		<nav className="sidebar-nav">
			<h4 className={(home===0 && !isChildRouteActive)?"active":""} onClick={()=>{handleHome(0)}}> Home</h4>
			<h4 className={(home===1 && !isChildRouteActive)?"active":""} onClick={()=>{handleHome(1)}}> My Library</h4>

			<br/>
			{contextUser?.role == "ADMIN"&&(
			<h4 className={(location.pathname==="/dashboard/artist")?"active":""} onClick={() => navigate("/dashboard/artist")}>Artist</h4>
			)}
			{contextUser?.role == "ADMIN"&&(
			<h4 className={(location.pathname==="/dashboard/user-list")?"active":""} onClick={() => navigate("/dashboard/user-list")}>Users</h4>
			)}
			{contextUser?.role == "ADMIN"&&(
			<h4 className={(location.pathname==="/dashboard/songs")?"active":""} onClick={() => navigate("/dashboard/songs")}>Songs</h4>
			)}
			<h4 className={(location.pathname==="/dashboard/downloaded")?"active":""} onClick={() => navigate("/dashboard/downloaded")}> Downloaded Song</h4>
			<h4> Recommendation</h4>
			{(!contextUser.premium && contextUser?.role !== "ADMIN") && (
			<h4 className={(location.pathname==="/dashboard/payment")?"active":""} onClick={() => navigate("/dashboard/payment")}>Upgrade to Premium</h4>
			)}
			{/* <h5 onClick={()=>handleLogout()}>Logout <i className="bi bi-box-arrow-right" ></i></h5> */}
		</nav>
	</div>

    {popUp&&(
	<div className="popup" >
        <div className="contant">
			<AddMusic
				editingSong={editingSong}
				setEditingSong={setEditingSong}
				setPopUp={setPopUp}
			/>
        </div>
    </div>)}

	{popupOpen && (
	<div className="popup">
		<div className="contant">
			<AddSongToPlaylist songId={addsongId} setPopUp={setPopupOpen} />
		</div>
	</div>
	)}

	{(contextUser.premium || contextUser.role === "ADMIN")&&(search.trim() !== "" && (
		<div className="song-search-result">
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
				<li className="noSong" style={{padding: "10px"}}>No matching songs found</li>
				)
			}	
	</div>))}

	<div key={home} className="main-content">
		<div className="topbar">
			<img className="img" src="https://res.cloudinary.com/dvwcy1jab/image/upload/v1746169589/HummingBeatLogo_ebuiar.png" alt="" onClick={() => window.location.reload()}/>	
            <h3>{contextUser ? `${greeting}, ${contextUser.username}` : "Loading..."}</h3>
			<div className={`search-bar ${isSearchActive ? "expanded" : ""}`}>
				<input
					type="text"
					value={search}
					placeholder="Search Music...."
					onChange={(e) => setSearch(e.target.value)}
					onFocus={() => setIsSearchActive(true)}
					onBlur={() => setIsSearchActive(false)}
				/>
				<i className="bi bi-search"></i>
			</div>
			<div className="user-status">
				<span className="status">
					{contextUser?.role === "ADMIN"?(
						<>
							<img src="https://res.cloudinary.com/dvwcy1jab/image/upload/v1744213378/Admin_cvnkzp.png" alt=""/> Admin
						</>
						):(
							contextUser.premium? (
								<>
								<img src="https://res.cloudinary.com/dvwcy1jab/image/upload/v1744213378/Premium_mb2xic.png" alt=""/> Premium
								</>
							):(
								"Basic"
							)
						)
							}
				</span>
			</div>
			<div className="user-profile" style={{cursor: 'pointer'}}>
				<img src={contextUser.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(contextUser.username)}&background=random&rounded=true`} alt="" onClick={()=>setProfileUpdate(!profileUpdate)}/>
				{profileUpdate&&(<ProfileCard contextUser={contextUser}/>)}
			</div>
		</div>
		
		{isChildRouteActive?(
			<div className="dashboard-box">
				<Outlet />
			</div>
		):(
			(home===0 && (contextUser.premium || contextUser?.role === "ADMIN"))?(
				<div  className='dashboard-box'>
					<div className="music-hero-section">
						<div className="hero-text">
							<h1>FEEL THE MUSIC</h1>
							<p>Power to change the mood</p>
							<div className="buttons">
							<button>PLAY</button>
							<button>FOLLOW</button>
							</div>
						</div>

						<div className="hero-image">
							<img src="https://shorturl.at/dVVuG" alt="" />
						</div>
					</div>

					<div className="section-song">
						<div className="section-header">
							<h4>Pick up where you left off</h4>
							<div className="scroll-buttons">
							<i className="bi bi-arrow-left-short" id="song_prev" onClick={() => scroll(popSongRef, -330)}></i>
							<i className="bi bi-arrow-right-short" id="song_next" onClick={() => scroll(popSongRef, +330)}></i>
							</div>
						</div>
						<div className="song-scroll-container" ref={popSongRef}>
						{recentSong.length>0?(
							recentSong.map((song,index) => (
									<li key={song.id} className="songItem">
									<div className="img_play">
										<img src={song.imgLink} alt={song.name} loading="lazy"/>
									</div>
									<h5>
										<span>{song.name}</span>
										<div className="subtitle">{song.artistName}</div>
									</h5>
									<div className="options">
									<i 
										className="bi bi-three-dots-vertical" 
										onClick={(e) =>{
											e.stopPropagation(); 
											setShowRemove(showDelete === song.id ? null : song.id);
										}
										}  
									></i>
										{showRemove === song.id && (
										<div className="options-menu">
											<button className="testButton" onClick={() => removeFromRecent(song.id)}>Remove</button>
									  	</div>
									)}
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
					<div className="section-song">
						<div className="section-header">
							<h4>Your Song</h4>
							<div className="scroll-buttons">
								<i className="bi bi-arrow-left-short" id="song_prev1"onClick={() => scroll(popSongRef1, -330)}></i>
								<i className="bi bi-arrow-right-short" id="song_next"onClick={() => scroll(popSongRef1, +330)}></i>
							</div>
						</div>
						<div className="song-scroll-container" ref={popSongRef1} >
							{/* {contextUser?.role === "ADMIN" &&(
								<li className="addSong" onClick={()=>{setPopUp(true); setEditingSong(null); }}>
									<i className="bi bi-plus-circle"></i>
								</li>
							)} */}
							{songs.length>0?(
							songs.map((song,index) => (
									<li key={song.id} className="songItem song-appear">
									<div className="img_play">
										<img src={song.imgLink} alt={song.name} loading="lazy"/>
									</div>
									<h5>
										<span>{song.name}</span>
										<div className="subtitle">{song.artistName}</div>
									</h5>
										<div className="options">
										<i 
											className="bi bi-three-dots-vertical" 
											onClick={(e) =>{
												e.stopPropagation(); 
												setShowDelete(showDelete === song.id ? null : song.id);
											}}  
										></i>
										{showDelete === song.id && (
										<div className="options-menu">
											{contextUser.role==="ADMIN"&&(
												<>
												<button className="testButton" onClick={() => handleDeleteClick(song.id)}>Delete</button>
												<button className="testButton" onClick={() => handleEdit(song)}>Edit</button>
												</>
											)}
											<button className="testButton" onClick={() => handleAddSongToPlaylist(song.id)}>Playlist +</button>
											<button className="testButton" onClick={() => handleDownload(song)}>Download</button>
									  	</div>
									)}
										<i className={`bi ${currentSong.id === song.id && isPlaying ? "bi-pause-circle-fill" : "bi-play-circle-fill"}`} 
											onClick={() => handlePlaylistSong(songs, index)}
										></i>
									</div>
									</li>
							)
								)):(
								<>
									<li className="noSong skeleton-card" ></li>
									<li className="noSong skeleton-card" style={{opacity:0.6}} ></li>
									<li className="noSong skeleton-card" style={{opacity:0.4}} ></li>
									<li className="noSong skeleton-card" style={{opacity:0.2}} ></li>
								</>
								)
							}
											
						</div>
					</div>
					<div className="section-artist">
						<div className="section-header">
							<h4>Popular Artist</h4>
							<div className="scroll-buttons">
								<i className="bi bi-arrow-left-short" id="artist_prev"  onClick={() => scroll(artistRef, -330)}></i>
								<i className="bi bi-arrow-right-short" id="artist_next" onClick={() => scroll(artistRef, 330)}></i>
							</div>
						</div>
						<ul className="artist-list" ref={artistRef}>
							{artists.length > 0 ? (
								artists.map((artist,index) => (
									<li key={artist.id} className="artist-item song-appear">
										<div className="artist-image">
											<img src={artist.image} alt={artist.name} loading="lazy" />
											<button className="play-btn" onClick={()=>handleArtistSongs(artist)}><i className="bi bi-play-fill"></i></button>
											{contextUser?.role == "ADMIN"&&(<div className="options-container">
												<button className="options-btn" 
													onClick={(e) => {
														e.stopPropagation(); 
														setOpenMenu(openMenu === artist.id ? null : artist.id);
													}}>
													☰
												</button>
												{openMenu === artist.id && (
													<div className="options-menu" onClick={(e) => e.stopPropagation()}>
														<button onClick={() => handleEdit(artist)}>Edit</button>
														<button onClick={() => handleDeleteArtist(artist.id)}>Delete</button>
													</div>
												)}
											</div>)}
										</div>
										<div className="artist-name">{artist.name}</div>
									</li>
								))
							) : (
								<li className="noArtist skeleton-card"></li>
							)}
						</ul>
					</div>
				</div>):
			(home===1 && (contextUser.premium || contextUser?.role === "ADMIN"))&&(
				<Playlist currSong={currentSong} onSongSelect={handlePlaylistSong} checkPlay={isPlaying} setAlertData={setAlertData}/>)
		)}
	</div>


	<div className={`master_play ${isPanelOpen ? "" : "closed"}`}>
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
		<div className="bicon">
			<i className="bi shuffle bi-music-note-beamed"></i>
			<i className="bi bi-skip-start-fill" onClick={() => handlePrevious()}></i>
			<i
			className={`bi ${isPlaying ? "bi-pause-fill" : "bi-play-fill"}`}
			id="masterPlay"
			onClick={togglePlay}
			style={{ cursor: "pointer" }}
			></i>
			<i className="bi bi-skip-end-fill" onClick={() => handleNext()}></i>
		</div>
		<span id="currentStart">{formatTime(currentTime)}</span>
		<div className="bar">
			<input
			type="range"
			id="seek"
			min="0"
			max="100"
			value={(currentTime / duration) * 100 || 0}
			onChange={handleSeek}
			/>
		</div>
		<span id="currentEnd">{formatTime(duration)}</span>
		<div className="vol">
			<i className="bi bi-volume-down-fill" id="vol_icon"></i>
			<input
			type="range"
			id="vol"
			min="0"
			max="100"
			value={volume}
			onChange={handleVolume}
			/>
		</div>
		<div className="bicon">
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

</div>
  )
}

export default Dashboard
