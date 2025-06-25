import React,{useEffect, useState, useContext} from 'react';
import '../../styles/AddSong.css';
import AuthContext from '../../context/AuthContext';

const AddMusic = ({ editingSong, setEditingSong, setPopUp }) => {
    const [musicFile, setMusicFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [selectedArtist, setSelectedArtist] = useState("");

    const [song, setSong] = useState({
        name: "",
        genre: "",
      });

    const { fetchSongs, apiUrl, setAlertData, artists} = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);

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
        setIsLoading(true); 
        if (!editingSong && (!musicFile || !imageFile)) {
          setAlertData({show: true, status: false, message:"Please upload both song and image files."});
          setIsLoading(false);
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
          ? `${apiUrl}/api/songs/${editingSong.id}`
          : `${apiUrl}/api/songs`;
          const method = editingSong ? 'PUT' : 'POST';
    
          const response = await fetch(url, {
            method,
            body: formData,
            credentials: "include",
          });
    
          const result = await response.text(); 
    
          if (response.ok) {
            setAlertData({show: true, status: true, message:result});
            setSong({ name: "", genre: ""}); 
            setMusicFile(null);
            setImageFile(null);
            setSelectedArtist("");
            fetchSongs();
            setPopUp(false);
            setEditingSong(null);
          } else {
            setAlertData({show: true, status: false, message:"Failed to add song"});
          }
        } catch (error) {
          setAlertData({show: true, status: false, message:"Error adding song"});
        } finally{
          setIsLoading(false);
        }
      };
    
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
        <select value={selectedArtist} onChange={(e) => setSelectedArtist(e.target.value)} required={!editingSong}>
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
        <i className="up bi-upload"></i>
        {musicFile ? musicFile.name : "Upload Song"}
      </label>
      <input type="file" id="songID" accept="audio/*" onChange={(e) => setMusicFile(e.target.files[0])} required={!editingSong} />
    </div>

    <div className="form-group">
      <label>Upload Image:</label>
      <label className="imageClass" for="imageID">
        <i className="up bi-upload"></i>
        {imageFile ? imageFile.name : "Upload Image"}
      </label>
      <input type="file" id="imageID" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} required={!editingSong} />
    </div>

    <button type="submit" className="btn btn-primary" disabled={isLoading}>
    {isLoading ? (
      <>
        {editingSong ? 'Updating...' : 'Submitting...'}
        <div className="loader" style={{ marginLeft: '8px' }}></div>
      </>
    ) : (
      editingSong ? 'Update Song' : 'Add Song'
    )}
    </button>
  </form>
  )
}

export default AddMusic
