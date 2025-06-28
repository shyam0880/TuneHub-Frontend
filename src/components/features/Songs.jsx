import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import DataContext from '../../context/DataContext';

import AddMusic from '../forms/AddMusic';
import AddSongToPlaylist from '../forms/AddSongToPlaylist';

const Songs = ({artistDetails=null, onComplete}) => {
    const { apiUrl, contextUser, songs, openConfirmDialog ,fetchDashboardDetails, setAlertData } = useContext(AuthContext);
    const artistPresent= artistDetails===null? false : true;
    const { isPlaying,
            currentSong,
            handlePlaylistSong,
            removeFromDownload,
        } = useContext(DataContext);
    const [songsList,setSongsList] = useState(artistPresent? artistDetails.songs : songs);
    const [popupOpen, setPopupOpen] = useState(false); 
    const [popUp, setPopUp] = useState(false);
    const [showDelete,setShowDelete] = useState(false);
    const [addsongId, setAddSongId] = useState(null); 
	  const [editingSong, setEditingSong] = useState(null);

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
        

  	const handleDelete = async(id)=>{
		try{
			const response= await fetch(`${apiUrl}/api/songs/${id}`,{
			method:"DELETE",
			credentials: "include",	
			});
			
			if (!response.ok) {
				setAlertData({ show: true, status: false, message:"Song not deleted" });
      }
      fetchDashboardDetails();
			setAlertData({show: true, status: true, message:await response.text()});
			removeFromRecent(id);
			removeFromDownload(id);

			setSongsList((prevSongs) => prevSongs.filter(song => song.id !== id));
      setShowDelete(null);

		}
		catch(err){
			setAlertData({ show: true, status: false, message:err});
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

    const handleDeleteClick = (id) => {
		openConfirmDialog("Are you sure you want to delete this song?", () => handleDelete(id));
	};

   return (
    <div className="dashboard-box">
      <div className="section-song">
        {artistPresent&&(<div className="playlist-header" style={{height:'150px'}}>
          <img
            src={'https://res.cloudinary.com/dvwcy1jab/image/upload/v1740661173/grass_abv3mp.jpg'}
            alt="background"
            className="image"
          />
          <div className="addplaylist">
            <div className="sideplay">
              <h2>{artistPresent ?  artistDetails?.name : 'Artist' || 'Playlist not found'}</h2>
            </div>
            <div className="artistImage" style={{position:'absolute',right:'5%', bottom:'10%', width: '120px' ,height: '120px' }}>
              <img src= {artistDetails.image} alt='artist' style={{ borderRadius: '100%', opacity:'1'}} />
            </div>
          </div>
        </div>)}
        <ul className="playlist_song" style={{height:'auto'}}>
          {!artistPresent&&(contextUser?.role === 'ADMIN' && (
            <li className="addSong" onClick={() => { setPopUp(true); setEditingSong(null); }}>
              <i className="bi bi-plus-circle"></i>
            </li>
          ))}

          {songsList.length > 0 ? (
            songsList.map((song, index) => (
              <li key={song.id} className="songItem song-appear">
                <div className="img_play">
                  <img src={song.imgLink} alt={song.name} loading="lazy" />
                </div>
                <h5>
                  <span>{song.name}</span>
                  <div className="subtitle">{song.artistName}</div>
                </h5>
                <div className="options">
                  <i
                    className="bi bi-three-dots-vertical"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDelete(showDelete === song.id ? null : song.id);
                    }}
                  ></i>

                  {showDelete === song.id && (
                    <div className="options-menu">
                      {contextUser?.role === 'ADMIN' && (
                        <>
                          <button className="testButton" onClick={() => handleDeleteClick(song.id)}>Delete</button>
                          <button className="testButton" onClick={() => handleEdit(song)}>Edit</button>
                        </>
                      )}
                      <button className="testButton" onClick={() => handleAddSongToPlaylist(song.id)}>Playlist +</button>
                      <button className="testButton" onClick={() => handleDownload(song)}>Download</button>
                    </div>
                  )}

                  <i
                    className={`bi ${currentSong.id === song.id && isPlaying
                      ? 'bi-pause-circle-fill'
                      : 'bi-play-circle-fill'
                    }`}
                    onClick={() => handlePlaylistSong(songsList, index)}
                  ></i>
                </div>
              </li>
            ))
          ) : (
            <>
              <li className="noSong skeleton-card"></li>
              <li className="noSong skeleton-card" style={{ opacity: 0.6 }}></li>
              <li className="noSong skeleton-card" style={{ opacity: 0.4 }}></li>
            </>
          )}
        </ul>
      </div>

      {popUp && (
        <div className="popup">
          <div className="contant">
            <AddMusic
              editingSong={editingSong}
              setEditingSong={setEditingSong}
              setPopUp={setPopUp}
            />
          </div>
        </div>
      )}

      {popupOpen && (
        <div className="popup">
          <div className="contant">
            <AddSongToPlaylist songId={addsongId} setPopUp={setPopupOpen} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Songs;
