import React,{useEffect, useState, useContext} from 'react';
import '../CSS/addsong.css';
import AuthContext from '../AutherContext/AuthContext';

const AddMusic = () => {
    const [errMessage,setErrMessage] = useState();
    const [ messageStatus, setMessageStatus] = useState(false);
    const [musicFile, setMusicFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);
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

    const uploadToCloudinary = async (file, resourceType) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "musicData_preset"); 
      formData.append("cloud_name", "dvwcy1jab"); 
    
        try {
          const response = await fetch(`https://api.cloudinary.com/v1_1/dvwcy1jab/${resourceType}/upload`,
            {
              method: "POST",
              body: formData,
            }
          );
    
          const data = await response.json();
          console.log(data);
          return data.secure_url;
        } catch (error) {
          console.error("Upload failed:", error);
          return null;
        }
      };
    
      // Handle File Upload
      const handleUpload = async () => {
        if (!musicFile || !imageFile) {
          setMessageStatus(false);
          setErrMessage("Please select both music and image files before uploading.");
          return;
        }
    
        setErrMessage("Uploading files...");
    
        const uploadedMusicUrl = await uploadToCloudinary(musicFile, "video");
        const uploadedImageUrl = await uploadToCloudinary(imageFile, "image");
    
        if (uploadedMusicUrl && uploadedImageUrl) {
          setMessageStatus(true);
          setErrMessage("Files uploaded successfully!");
          return { link: uploadedMusicUrl, imgLink: uploadedImageUrl };
        } else {
          setMessageStatus(false);
          setErrMessage("File upload failed. Try again.");
          return null;
        }
      };
    
    
      const handleSubmit = async (e) => {
        e.preventDefault(); 

        let songData = { ...song };

        if (!song.link || !song.imgLink) {  
          const uploadedData = await handleUpload();  

          if (!uploadedData) return;

          songData.link = uploadedData.link;
          songData.imgLink = uploadedData.imgLink;
        } 

        try {
          const response = await fetch("http://localhost:8080/addSong", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(songData),
          });
    
          const result = await response.text(); 
    
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


      useEffect(() => {
        if (errMessage) {
          const timer = setTimeout(() => setErrMessage(""), 3000);
          return () => clearTimeout(timer);
        }
      }, [errMessage]);

    
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
      <label className="imageClass" for="songID">
        <i class="up bi-upload"></i>
        {musicFile ? musicFile.name : "Upload Song"}
      </label>
      <input type="file" id="songID" accept="audio/*" onChange={(e) => setMusicFile(e.target.files[0])} required />
    </div>

    <div className="form-group">
      <label>Image:</label>
      <label className="imageClass" for="imageID">
        <i class="up bi-upload"></i>
        {imageFile ? imageFile.name : "Upload Image"}
      </label>
      <input type="file" id="imageID" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} required />
    </div>

    <button type="submit" className="btn btn-primary">ADD SONG</button>
    {errMessage && <p style={{ color: messageStatus ? "green" : "red",fontSize: "20px" }}>{errMessage}</p>}
  </form>
  )
}

export default AddMusic
