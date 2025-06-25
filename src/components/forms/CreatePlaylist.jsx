import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../../context/AuthContext';

const CreatePlaylist = ({editPlaylistData=null, onComplete }) => {
  const { songs, setAlertData, apiUrl, contextUser } = useContext(AuthContext);
  const [popUp, setPopUp] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [playlistType, setPlaylistType] = useState('');
  const [playlistImage, setPlaylistImage] = useState(null); 
  const [selectedSongIds, setSelectedSongIds] = useState(new Set());
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    if (editPlaylistData) {
      setPlaylistName(editPlaylistData.name);
      setPlaylistType(editPlaylistData.type);

      if (Array.isArray(editPlaylistData.songIds)) {
        setSelectedSongIds(new Set(editPlaylistData.songIds));
      }
    }
  }, [editPlaylistData]);

  const handleCheckboxChange = (songId) => {
    setSelectedSongIds((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(songId)) {
        newSelected.delete(songId);
      } else {
        newSelected.add(songId);
      }
      return newSelected;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (!playlistName.trim() || !playlistType.trim() || selectedSongIds.size === 0) {
      setAlertData({ show: true, status: false, message:'Please fill out all required fields.'});
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('userId', contextUser.id); 
    formData.append('name', playlistName);
    formData.append('type', playlistType);
    formData.append('songs', JSON.stringify(Array.from(selectedSongIds))); // send only IDs

    // Only append image if new file is selected (optional during update)
    if (playlistImage) {
      formData.append('image', playlistImage);
    }
    try {
      const endpoint = editPlaylistData
        ? `${apiUrl}/api/playlists/updatePlaylist/${editPlaylistData.id}`
        : `${apiUrl}/api/playlists`;

      const response = await fetch(endpoint, {
        method: editPlaylistData ? 'PUT' : 'POST',
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        setAlertData({show: true, status: true, message:await response.text()});
        setPlaylistName('');
        setPlaylistType('');
        setPlaylistImage(null);
        setSelectedSongIds(new Set());
        setLoading(false);
        setAlertData({ show: true, status: true, message: editPlaylistData ? 'Playlist updated successfully' : 'Playlist added successfully'});
        if (onComplete) onComplete(); // callback if passed
      } else {
        setAlertData({ show: true, status: false, message: 'Failed to submit playlist.' });
        setLoading(false);
      }
    } catch (error) {
      console.error('Error submitting playlist:', error);
      setAlertData({show: true, status: false, message:'Something went wrong!'});
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (event) => {
    setPlaylistImage(event.target.files[0]);
  };

  return (
    <div className="section-song">
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
                  required
                />
                <br />

                <label className="text">Playlist Type: </label>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter Playlist Type"
                  value={playlistType}
                  onChange={(e) => setPlaylistType(e.target.value)}
                  required
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
                  required={!editPlaylistData}
                />
                <br />

                <button type="submit" disabled={loading}>
                {loading ? (
                    <>
                      {editPlaylistData ? 'Updating...' : 'Submitting...'}
                      <div className="loader" ></div>
                    </>
                  ) : (
                    editPlaylistData ? 'Update Playlist' : 'Add Playlist'
                  )}
                </button>
                <br />
              </div>
            </div>
          )}

          <div className="playlist_song">
            {songs.length > 0 ? (
              songs.map((song) => (
                <li key={song.id} className="songItem">
                  <label>
                    <input
                      type="checkbox"
                      name="songs"
                      className="checkbox"
                      value={song.id}
                      checked={selectedSongIds.has(song.id)}
                      onChange={() => handleCheckboxChange(song.id)}
                    />
                    <div className="checkmark"></div>
                  </label>
                  <div className={`img_play ${selectedSongIds.has(song.id) ? 'img_shadow' : ''}`}>
                    <img src={song.imgLink} alt={song.name} />
                  </div>
                  <h5>
                    {song.name}
                    <br />
                    <div className="subtitle">{song.artistName}</div>
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
        {selectedSongIds.size > 0 && <i className="bi bi-folder-plus" onClick={() => setPopUp(true)}></i>}
      </div>
    </div>
  );
};

export default CreatePlaylist;
