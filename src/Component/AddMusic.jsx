import React,{useEffect, useState, useContext} from 'react';
import '../CSS/addsong.css';
import AuthContext from '../Context/AuthContext';

const AddMusic = ({ editingSong, setEditingSong, setPopUp }) => {
    const [errMessage,setErrMessage] = useState();
    const [ messageStatus, setMessageStatus] = useState(false);
    const [musicFile, setMusicFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [artists, setArtists] = useState([]);
    const [selectedArtist, setSelectedArtist] = useState("");

    const [song, setSong] = useState({
        name: "",
        genre: "",
      });

    const { fetchSongs } = useContext(AuthContext);

    useEffect(() => {
      const fetchArtists = async () => {
        try{
          const res = await fetch("http://localhost:8080/artists");
          const data = await res.json();
          setArtists(data);
        } catch (err){
          console.error("Error fetching artists:", err);

        }
      }
      fetchArtists();
    }, []);

    useEffect(() => {
      if (editingSong) {
        setSong({ name: editingSong.name, genre: editingSong.genre });
        setSelectedArtist(editingSong.artistId || '');
      }
    }, [editingSong]);


    const handleChange = (e) => {
      const {name,value} = e.target;
      setSong({
            ...song, 
            [name]: value,
          });
    };
    
      const handleSubmit = async (e) => {
        e.preventDefault(); 
        if (!musicFile || !imageFile) {
          setMessageStatus(false);
          setErrMessage("Please upload both song and image files.");
          return;
        }
        const formData = new FormData();
        formData.append("name", song.name);
        formData.append("genre", song.genre);
        if (musicFile) formData.append('songFile', musicFile);
        if (imageFile) formData.append('imageFile', imageFile);
        if (selectedArtist) formData.append("artistId", selectedArtist);

        try {
          const url = editingSong
          ? `http://localhost:8080/songupdate/${editingSong.id}`
          : 'http://localhost:8080/addSong';
          const method = editingSong ? 'PUT' : 'POST';
    
          const response = await fetch(url, {
            method,
            body: formData,
          });
    
          const result = await response.text(); 
    
          if (response.ok) {
            setMessageStatus(true);
            setErrMessage(result)
            setSong({ name: "", genre: ""}); 
            setMusicFile(null);
            setImageFile(null);
            setSelectedArtist("");
            fetchSongs();
            setPopUp(false);
            setEditingSong(null);
          } else {
            setMessageStatus(false);
            setErrMessage("Failed to add song: " + result);
          }
        } catch (error) {
          setMessageStatus(false);
          setErrMessage("Error: " + error.message);
        }
      };


      useEffect(() => {
        if (errMessage) {
          const timer = setTimeout(() => setErrMessage(""), 3000);
          return () => clearTimeout(timer);
        }
      }, [errMessage]);

    
  return (
    <form onSubmit={handleSubmit} className="song_form">
    <h3>{editingSong ? 'Edit Song' : 'Add Song'}</h3>

    <div className="form-group">
      <label>Song name:</label>
      <input type="text" name="name" value={song.name} onChange={handleChange} required />
    </div>

    <div className="form-group">
      <label>Song Genre:</label>
      <select name="genre" value={song.genre} onChange={handleChange} required>
        <optgroup label="Mainstream & Popular Genres">
          <option value="Pop">Pop</option>
          <option value="Rock">Rock</option>
          <option value="Hip Hop / Rap">Hip Hop / Rap</option>
          <option value="R&B / Soul">R&B / Soul</option>
          <option value="Electronic / EDM">Electronic / EDM</option>
        </optgroup>

        <optgroup label="Alternative & Indie">
          <option value="Alternative Rock">Alternative Rock</option>
          <option value="Indie Pop / Rock">Indie Pop / Rock</option>
          <option value="Lo-fi">Lo-fi</option>
        </optgroup>

        <optgroup label="Classical & Traditional">
          <option value="Classical">Classical</option>
          <option value="Opera">Opera</option>
          <option value="Folk">Folk</option>
        </optgroup>

        <optgroup label="Country & Regional">
          <option value="Country">Country</option>
          <option value="Bluegrass">Bluegrass</option>
          <option value="Latin">Latin</option>
          <option value="Afrobeat">Afrobeat</option>
        </optgroup>

        <optgroup label="High-Energy / Party Music">
          <option value="Reggae">Reggae</option>
          <option value="Dancehall">Dancehall</option>
          <option value="Disco / Funk">Disco / Funk</option>
          <option value="Trap">Trap</option>
        </optgroup>

        <optgroup label="Heavy & Extreme">
          <option value="Metal">Metal</option>
          <option value="Hard Rock">Hard Rock</option>
          <option value="Punk Rock">Punk Rock</option>
        </optgroup>

        <optgroup label="World & Experimental">
          <option value="K-pop">K-pop</option>
          <option value="J-pop">J-pop</option>
          <option value="Bollywood">Bollywood</option>
          <option value="Ambient">Ambient</option>
          <option value="Experimental">Experimental</option>
        </optgroup>
      </select>
    </div>


    <div className="form-group">
        <label>Select Artist:</label>
        <select value={selectedArtist} onChange={(e) => setSelectedArtist(e.target.value)} required>
          <option value="">Select artist</option>
          {artists.map((artist) => (
            <option key={artist.id} value={artist.id}>
              {artist.name}
            </option>
          ))}
        </select>
    </div>

    <div className="form-group">
      <label>Upload Song:</label>
      <label className="imageClass" for="songID">
        <i class="up bi-upload"></i>
        {musicFile ? musicFile.name : "Upload Song"}
      </label>
      <input type="file" id="songID" accept="audio/*" onChange={(e) => setMusicFile(e.target.files[0])} required />
    </div>

    <div className="form-group">
      <label>Upload Image:</label>
      <label className="imageClass" for="imageID">
        <i class="up bi-upload"></i>
        {imageFile ? imageFile.name : "Upload Image"}
      </label>
      <input type="file" id="imageID" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} required />
    </div>

    <button type="submit" className="btn btn-primary">{editingSong ? 'Update Song' : 'Add Song'}</button>
    {errMessage && <p style={{ color: messageStatus ? "green" : "red",fontSize: "20px" }}>{errMessage}</p>}
  </form>
  )
}

export default AddMusic
