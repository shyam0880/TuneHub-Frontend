import React ,{ useState, useEffect, useContext }from 'react';
import AuthContext from '../AutherContext/AuthContext';

const Playlist = ({ currSong, onSongSelect, checkPlay }) => {
  const [playlist, setPlayList] = useState([]);
  const [addStatus,setAddStatus] = useState(true);
  const { contextUser, songs, greeting } = useContext(AuthContext);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistType, setPlaylistType] = useState(""); 
  const [playlistImageLink, setPlaylistImageLink] = useState(""); 
  const [selectedSongs, setSelectedSongs] = useState(new Map());
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [playlistSongs, setPlaylistSongs] = useState();
  const [hidePlaylist, setHidePlaylist] = useState(true);
  const [playlistErrorMessage, setPlaylistErrorMessage] = useState("");
  const [ messageStatus, setMessageStatus] = useState(false);
  const [popUp, setPopUp] = useState(false);
  

  const handleCheckboxChange = (song) => {
    setSelectedSongs((prevSelected) => {
      const newSelected = new Map(prevSelected);
      if (newSelected.has(song.id)) {
        newSelected.delete(song.id);
      } else {
        newSelected.set(song.id, song);
      }
      return newSelected;
    });
  };


  const fetchPlaylist =async()=>{
    try{
      const response = await fetch("http://localhost:8080/viewPlaylist");

      if(!response.ok){
        const errorMessage = await response.text();
				throw new Error(errorMessage || "PlayList Load Failed");
      }

      const data = await response.json();
      setPlayList(data);

    }
    catch(err){
      alert(err);
    }
  };



  useEffect(()=>{
    fetchPlaylist();
  },[])

  const fetchPlaylistById =async(id)=>{
    try{
      const respnse  = await fetch(`http://localhost:8080/users/${id}`);
      if(respnse.ok){
        const data = await respnse.json();
        setPlaylistSongs(data);
      }

    }
    catch(err){
      alert(err);
    }

  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!playlistName.trim() || !playlistType.trim() || selectedSongs.size === 0 || !playlistImageLink.trim()) {
      alert("Please enter a playlist name, type, image link, and select at least one song.");
      return;
    }

    const payload = {
      name: playlistName,
      type: playlistType,
      imgLink: playlistImageLink,
      songs: Array.from(selectedSongs.values()),
    };


    try {
      const response = await fetch("http://localhost:8080/addToPlaylist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload), 
      });

      if (response.ok) {
        alert(await response.text());
        setPlaylistName("");
        setPlaylistType("");
        setPlaylistImageLink(""); 
        setSelectedSongs(new Map());
        setMessageStatus(true);
        setPlaylistErrorMessage("Playlist Added successfully");
      } else {
        setMessageStatus(false);
        setPlaylistErrorMessage("Failed to add playlist.");
      }
    } catch (error) {
      console.error("Error submitting playlist:", error);
      alert("Something went wrong!");
    }
  };



  const handleSongPlaylist = (playlistId) => {
    const foundPlaylist = playlist.find((pl) => pl.id === playlistId);
    if (foundPlaylist) {
      setCurrentPlaylist(foundPlaylist);
      setHidePlaylist(false)
    } else {
      alert('Playlist not found');
    }
  };

  useEffect(()=>{
      setTimeout(()=>{
        setPlaylistErrorMessage(" ")
      },3000)
    },[playlistErrorMessage]);


  
  return (
    <div class="song_side">
			<nav>
      <h3>{contextUser ? `${greeting}, ${contextUser.username}` : "Loading..."}</h3>
        <div class="search">
          <input type="text" placeholder="Search Music...."/>
          <i class="bi bi-search"></i>
        </div>
        <div class="user">
          <img src="" alt=""/>
        </div>
			</nav>
			
			<div className="popular_song">
        {addStatus?(
          <>
          <div className="newupdate">
            <img src='../src/Image/grass.jpg' alt='image'/>
            <div className="addplaylist">
              <div className="sideplay">
              <h2>{hidePlaylist ? "Playlist" : (currentPlaylist.name || "Playlist not found")}</h2>
                <h4>{hidePlaylist ? "On Repeat" : currentPlaylist.type || "Not set"}</h4>
              </div>
              <div className="picons">
              {!hidePlaylist&&(<i class="bi bi-arrow-left-circle" onClick={() => setHidePlaylist(true)}></i>)}
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
                    </li>
                  ))
                ) : (
                  <li className="noSong"></li>
                )}

          </div>
          )}
          </>
        ):(
          <div className="playbox">
              <form onSubmit={handleSubmit}>
                {popUp&&(<div className="inputdata">
                  <div className="actualdata">
                  <i class="bi bi-arrow-left-square" onClick={()=>setPopUp(false)}></i>
                    <label class="text">Playlist Name: </label>
                        <input
                          type="text"
                          class="input"
                          name="name"
                          placeholder="Enter Playlist Name"
                          value={playlistName}
                          onChange={(e) => setPlaylistName(e.target.value)}
                        />
                        <br />

                        <label class="text">Playlist Type: </label>
                        <input
                          type="text"
                          name="type"
                          class="input"
                          placeholder="Enter Playlist type"
                          value={playlistType}
                          onChange={(e) => setPlaylistType(e.target.value)}
                        />
                        <br />

                        <label class="text">Playlist Image Link: </label>
                        <input
                          type="text"
                          name="imgLink"
                          class="input"
                          value={playlistImageLink}
                          onChange={(e) => setPlaylistImageLink(e.target.value)}
                          placeholder="Enter Image URL"
                        />
                        <br />
                      <input type="submit" value="ADD PLAYLIST"/>
                      <br/>
                      {playlistErrorMessage && <p style={{ color: messageStatus ? "green" : "red",fontSize: "20px" }}>{playlistErrorMessage}</p>}
                  </div>
                </div>)}
                
                <div className="playlistSongs">
                    {songs.length>0?
                    (songs.map((song) => (
                    <li key={song.id} className="songItem">
                      <label>
                        <input type="checkbox" 
                        name="songs"
                        className='checkbox' 
                        value={song.id}
                        checked={selectedSongs.has(song.id)}
                        onChange={() => handleCheckboxChange(song)}
                        />
                        <div class="checkmark"></div>
                      </label>
                      {/* <input 
                      type="checkbox"  
                      name="songs"
                      className='checkbox' 
                      value={song.id}
                      checked={selectedSongs.has(song.id)}
                      onChange={() => handleCheckboxChange(song)}
                      /> */}
                      <div className={`img_play ${selectedSongs.has(song.id) ? "img_shadow" : ""}`}>
                        <img src={song.imgLink} alt={song.name} />
                      </div>
                      <h5>
                        {song.name} <br />
                        <div className="subtitle">{song.artist}</div>
                      </h5>
                    </li>))
                    ):(
                      <li className="noSong"></li>
                    )
                    }
                </div>
              </form>
          </div>
        )}
		  </div>
      <div className="createplaylist">
      {selectedSongs.size>0 &&(<i class="bi bi-folder-plus" onClick={()=>setPopUp(true)}></i>)}
        <div className='Btn'  onClick={()=>setAddStatus(!addStatus)} alt="Create Playlist">
          <div class="sign"><i className={addStatus?"bi bi-plus":"bi-arrow-left-short"}></i></div>
          <div class="text">{addStatus?"Create":"Back"}</div>
        </div>
      </div>
		</div>
  )
}

export default Playlist
