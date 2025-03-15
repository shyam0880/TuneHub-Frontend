import React ,{ useState, useEffect, useContext }from 'react';
import AuthContext from '../AutherContext/AuthContext';
import '../CSS/displaytable.css';

const CreatePlaylist = () => {
    const [popUp, setPopUp] = useState(false);
    const [playlistName, setPlaylistName] = useState("");
    const [playlistType, setPlaylistType] = useState(""); 
    // const [playlistImageLink, setPlaylistImageLink] = useState(""); 
    const [playlistImage, setPlaylistImage] = useState(null);
    const [selectedSongs, setSelectedSongs] = useState(new Map());
    const [playlistErrorMessage, setPlaylistErrorMessage] = useState("");
    const [ messageStatus, setMessageStatus] = useState(false);
    const { songs } = useContext(AuthContext);

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

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!playlistName.trim() || !playlistType.trim() || selectedSongs.size === 0 || !playlistImage) {
            alert("Please enter a playlist name, type, image link, and select at least one song.");
            return;
        }
    
        // const payload = {
        //     name: playlistName,
        //     type: playlistType,
        //     imgLink: playlistImageLink,
        //     songs: Array.from(selectedSongs.values()),
        // };

        const formData = new FormData();
        formData.append("name", playlistName);
        formData.append("type", playlistType);
        formData.append("image", playlistImage);
        formData.append("songs", JSON.stringify(Array.from(selectedSongs.values())));

    
    
        try {
            const response = await fetch("http://localhost:8080/addToPlaylist", {
                method: "POST",
                body: formData,
            });
    
            if (response.ok) {
                alert(await response.text());
                setPlaylistName("");
                setPlaylistType("");
                setPlaylistImage(null); 
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
    const handleImageChange = (event) => {
        setPlaylistImage(event.target.files[0]); // Store file in state
    };

    useEffect(()=>{
        setTimeout(()=>{
        setPlaylistErrorMessage(" ")
        },3000)
    },[playlistErrorMessage]);

  return (
    <div className="popular_song">
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
                <label className="imageClass" for="imageID">
                    <i class="up bi-upload"></i>
                    {playlistImage ? playlistName.name : "Upload Image"}
                </label>
                <input
                    type="file" 
                    accept="image/*"
                    name="imgLink"
                    class="input"
                    id="imageID"
                    // value={playlistImageLink}
                    onChange={handleImageChange}
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
    <div className="createplaylist">
      {selectedSongs.size>0 &&(<i class="bi bi-folder-plus" onClick={()=>setPopUp(true)}></i>)}
        
      </div>
    </div>
  )
}

export default CreatePlaylist
