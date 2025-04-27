import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../Context/AuthContext';
import '../CSS/displaytable.css';

const CreatePlaylist = ({ editPlaylistData = null, onComplete }) => {
  const [popUp, setPopUp] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [playlistType, setPlaylistType] = useState('');
  const [playlistImage, setPlaylistImage] = useState(null); 
  const [selectedSongs, setSelectedSongs] = useState(new Map());
  const { songs, setAlertData, apiUrl } = useContext(AuthContext);

  // 🌟 Pre-fill values if editing
  useEffect(() => {
    if (editPlaylistData) {
      setPlaylistName(editPlaylistData.name);
      setPlaylistType(editPlaylistData.type);
      const initialSongs = new Map();
      editPlaylistData.songs.forEach((song) => {
        initialSongs.set(song.id, song);
      });
      setSelectedSongs(initialSongs);
    }
  }, [editPlaylistData]);

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
    if (!playlistName.trim() || !playlistType.trim() || selectedSongs.size === 0) {
      setAlertData({ show: true, status: false, message:'Please fill out all required fields.'});
      return;
    }

    const formData = new FormData();
    formData.append('name', playlistName);
    formData.append('type', playlistType);
    formData.append('songs', JSON.stringify(Array.from(selectedSongs.keys()))); // send only IDs

    // Only append image if new file is selected (optional during update)
    if (playlistImage) {
      formData.append('image', playlistImage);
    }

    try {
      const endpoint = editPlaylistData
        ? `${apiUrl}/updatePlaylist/${editPlaylistData.id}`
        : `${apiUrl}/addToPlaylist`;

      const response = await fetch(endpoint, {
        method: editPlaylistData ? 'PUT' : 'POST',
        body: formData,
      });

      if (response.ok) {
        setAlertData({show: true, status: true, message:await response.text()});
        setPlaylistName('');
        setPlaylistType('');
        setPlaylistImage(null);
        setSelectedSongs(new Map());
        setAlertData({ show: true, status: true, message: editPlaylistData ? 'Playlist updated successfully' : 'Playlist added successfully'});
        if (onComplete) onComplete(); // callback if passed
      } else {
        setAlertData({ show: true, status: false, message: 'Failed to submit playlist.' });
      }
    } catch (error) {
      console.error('Error submitting playlist:', error);
      setAlertData({show: true, status: false, message:'Something went wrong!'});
    }
  };

  const handleImageChange = (event) => {
    setPlaylistImage(event.target.files[0]);
  };

  return (
    <div className="popular_song">
      <div className="playbox">
        <form onSubmit={handleSubmit}>
          {popUp && (
            <div className="inputdata">
              <div className="actualdata">
                <i className="bi bi-arrow-left-square" onClick={() => setPopUp(false)}></i>
                <label className="text">Playlist Name: </label>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter Playlist Name"
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                />
                <br />

                <label className="text">Playlist Type: </label>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter Playlist Type"
                  value={playlistType}
                  onChange={(e) => setPlaylistType(e.target.value)}
                />
                <br />

                <label className="text">Playlist Image: </label>
                <label className="imageClass" htmlFor="imageID">
                  <i className="up bi-upload"></i>
                  {playlistImage ? playlistImage.name : 'Upload Image'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="input"
                  id="imageID"
                  onChange={handleImageChange}
                />
                <br />

                <input type="submit" value={editPlaylistData ? 'UPDATE PLAYLIST' : 'ADD PLAYLIST'} />
                <br />
              </div>
            </div>
          )}

          <div className="playlistSongs">
            {songs.length > 0 ? (
              songs.map((song) => (
                <li key={song.id} className="songItem">
                  <label>
                    <input
                      type="checkbox"
                      name="songs"
                      className="checkbox"
                      value={song.id}
                      checked={selectedSongs.has(song.id)}
                      onChange={() => handleCheckboxChange(song)}
                    />
                    <div className="checkmark"></div>
                  </label>
                  <div className={`img_play ${selectedSongs.has(song.id) ? 'img_shadow' : ''}`}>
                    <img src={song.imgLink} alt={song.name} />
                  </div>
                  <h5>
                    {song.name}
                    <br />
                    <div className="subtitle">{song.artist}</div>
                  </h5>
                </li>
              ))
            ) : (
              <li className="noSong">No songs available</li>
            )}
          </div>
        </form>
      </div>
      <div className="createplaylist">
        {selectedSongs.size > 0 && <i className="bi bi-folder-plus" onClick={() => setPopUp(true)}></i>}
      </div>
    </div>
  );
};

export default CreatePlaylist;
