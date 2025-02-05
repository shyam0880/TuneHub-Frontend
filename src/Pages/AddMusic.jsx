import React,{useEffect, useState, useContext} from 'react';
import '../CSS/addsong.css';
import AuthContext from '../AutherContext/AuthContext';

const AddMusic = () => {
    const [errMessage,setErrMessage] = useState();
    const [ messageStatus, setMessageStatus] = useState(false);
    const [song, setSong] = useState({
        name: "",
        artist: "",
        genre: "",
        link: "",
        imgLink: "",
      });
      const { fetchSongs } = useContext(AuthContext);
    
      const handleChange = (e) => {
        const {name,value} = e.target;
        setSong({
             ...song, 
             [name]: value,
            });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        try {
          const response = await fetch("http://localhost:8080/addSong", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(song),
          });
    
          const result = await response.text(); // Get response from backend
    
          if (response.ok) {
            setMessageStatus(true);
            setErrMessage(result)
            setSong({ name: "", artist: "", genre: "", link: "", imgLink: "" }); 
            fetchSongs();
          } else {
            setMessageStatus(false);
            setErrMessage("Failed to add song: " + result);
          }
        } catch (error) {
          setMessageStatus(false);
          setErrMessage("Error: " + error.message);
        }
      };
      useEffect(()=>{
        setTimeout(()=>{
          setErrMessage(" ")
        },3000)

      },[errMessage]);

    
  return (
    <form onSubmit={handleSubmit} className="song_form">
    <h3>Add Song</h3>

    <div className="form-group">
      <label>Song name:</label>
      <input type="text" name="name" value={song.name} onChange={handleChange} required />
    </div>

    <div className="form-group">
      <label>Song Artist:</label>
      <input type="text" name="artist" value={song.artist} onChange={handleChange} required />
    </div>

    <div className="form-group">
      <label>Song Genre:</label>
      <input type="text" name="genre" value={song.genre} onChange={handleChange} required />
    </div>

    <div className="form-group">
      <label>Song Link:</label>
      <input type="text" name="link" value={song.link} onChange={handleChange} required />
    </div>

    <div className="form-group">
      <label>Image Link:</label>
      <input type="text" name="imgLink" value={song.imgLink} onChange={handleChange} required />
    </div>

    <button type="submit" className="btn btn-primary">ADD SONG</button>
    {errMessage && <p style={{ color: messageStatus ? "green" : "red",fontSize: "20px" }}>{errMessage}</p>}
  </form>
  )
}

export default AddMusic
