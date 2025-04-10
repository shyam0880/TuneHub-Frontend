import React ,{ useState, useEffect, useContext }from 'react';
// import AuthContext from '../AutherContext/AuthContext';
import { Outlet, useNavigate } from 'react-router-dom';

const Playlist = ({ currSong, onSongSelect, checkPlay,setAlertMessage }) => {
  // const { setAlertMessage } = useContext(AuthContext);
  const [playlist, setPlayList] = useState([]);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [playlistSongs, setPlaylistSongs] = useState(); //used to store songs when extract by playlist id
  const [hidePlaylist, setHidePlaylist] = useState(true);
  const navigate = useNavigate();
  
  const fetchPlaylist =async()=>{
    try{
      const response = await fetch("http://localhost:8080/viewPlaylist");

      if(!response.ok){
        const errorMessage = await response.text();
				// throw new Error(errorMessage || "PlayList Load Failed");
        setAlertMessage(errorMessage || "PlayList Load Failed");
      }

      const data = await response.json();
      setPlayList(data);

    }
    catch(err){
      // alert(err);
      setAlertMessage(err.message);
    }
  };

  useEffect(()=>{
    fetchPlaylist();
  },[])

  const handleEdit = (playlist) => {
    navigate('/create-playlist', { state: { playlist } });
  };

  const fetchPlaylistById =async(id)=>{
    try{
      const respnse  = await fetch(`http://localhost:8080/users/${id}`);
      if(respnse.ok){
        const data = await respnse.json();
        setPlaylistSongs(data);
      }

    }
    catch(err){
      // alert(err);
      setAlertMessage(err.message);
    }

  }


  const handleSongPlaylist = (playlistId) => {
    const foundPlaylist = playlist.find((pl) => pl.id === playlistId);
    if (foundPlaylist) {
      setCurrentPlaylist(foundPlaylist);
      setHidePlaylist(false)
    } else {
      // alert('Playlist not found');
      setAlertMessage('Playlist not found');
    }
  };

   // ✅ NEW FUNCTION TO DELETE A PLAYLIST
   const handleDeletePlaylist = async (playlistId) => {
    try {
      const response = await fetch(`http://localhost:8080/deletePlaylist/${playlistId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setAlertMessage('Playlist deleted successfully');
        setHidePlaylist(true);
        fetchPlaylist();
      } else {
        setAlertMessage(await response.text());
      }
    } catch (err) {
      setAlertMessage('Failed to delete playlist');
    }
  };

   // ✅ NEW FUNCTION TO REMOVE SONG FROM A PLAYLIST
   const handleRemoveSong = async (playlistId, songId) => {
    try {
      const response = await fetch(`http://localhost:8080/playlist/${playlistId}/songs/${songId}`, {
        method: 'PUT'
      });
      if (response.ok) {
        setAlertMessage('Song removed from playlist');
        const updatedPlaylist = { ...currentPlaylist };
        updatedPlaylist.songs = updatedPlaylist.songs.filter(song => song.id !== songId);
        setCurrentPlaylist(updatedPlaylist);
      } else {
        setAlertMessage(await response.text());
      }
    } catch (err) {
      setAlertMessage('Error removing song');
    }
  };

  
  return (
    <div class="box">		
			<div className="popular_song">
          <div className="newupdate">
            <img src={hidePlaylist ?'../src/Image/grass.jpg':currentPlaylist.imgLink} alt='image'className='image'/>
            {/* <img src={hidePlaylist ?'https://shorturl.at/I8fN3':currentPlaylist.imgLink} alt='image'/> */}
            <div className="addplaylist">
              <div className="sideplay">
              <h2>{hidePlaylist ? "Playlist" : (currentPlaylist.name || "Playlist not found")}</h2>
                <h4>{hidePlaylist ? "On Repeat" : currentPlaylist.type || "Not set"}</h4>
              </div>
              <div className="picons">
              {!hidePlaylist&&(
                <>
                <i class="bi bi-arrow-left-circle" onClick={() => setHidePlaylist(true)}></i>
                <i class="bi bi-trash3" onClick={() => handleDeletePlaylist(currentPlaylist.id)}></i>
                </>
                )}
              <i className="bi bi-play-circle-fill"></i>
              </div>    
            </div>
			    </div>
          {hidePlaylist?(
          <div className="playlist_song" >
            {playlist.length>0?(
            playlist.map((play) => (
                <li key={play.id} className="songItem">
                  <div className="img_play">
                    <img src={play.imgLink} alt={play.name} />
                  </div>
                  <h5>
                    {play.name} <br />
                    <div className="subtitle">{play.type}</div>
                  </h5>
                  <i className="bi bi-list-ul" onClick={() => handleSongPlaylist(play.id)}></i>
                  {/* <i
                    className="bi bi-pencil-square"
                    title="Edit Playlist"
                    style={{ marginLeft: "10px", cursor: "pointer" }}
                    onClick={() => handleEdit(play)}></i> */}
                </li>
            )
              )):(
                <li className="noSong"></li>
              )
            }        
          </div>
          ):(
            <div className="playlist_song" >
                {/* {playlistSongs.length > 0 ? (    in case we extract song fetch by id */}
                {currentPlaylist.songs.length > 0 ? (
                  currentPlaylist.songs.map((song,index) => (
                    <li key={song.id} className="songItem">
                      <div className="img_play">
                        <img src={song.imgLink} alt={song.name} />
                      </div>
                      <h5>
                          {song.name}
                        <br/>
                        <div className="subtitle">{song.artist}</div>
                      </h5>
                        <i className={((currSong.id===song.id) && checkPlay)?("bi bi-pause-circle-fill"):("bi bi-play-circle-fill")} onClick={() =>onSongSelect(currentPlaylist.songs, index)}></i>
                        {/* <i class="bi bi-x-circle" onClick={() => handleRemoveSong(currentPlaylist.id, song.id)}></i> */}
                    </li>
                  ))
                ) : (
                  <li className="noSong"></li>
                )}

          </div>
          )}        
		  </div>
      <div className="createplaylist">
        <div className='Btn'  onClick={()=>navigate("create-playlist")} alt="Create Playlist">
          <div class="sign"><i class="bi bi-plus"></i></div>
          <div class="text">Create</div>
        </div>
      </div>
		</div>
  )
}

export default Playlist
