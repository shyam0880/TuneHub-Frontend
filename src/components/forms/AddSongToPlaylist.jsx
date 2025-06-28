import React, { useEffect, useState } from 'react';
import '../../styles/AddSongToPlaylist.css';
import AuthContext from '../../context/AuthContext';
import { useContext } from 'react';

const AddSongToPlaylist = ({ songId, setPopUp }) => {
  const { apiUrl, contextUser, setAlertData } = useContext(AuthContext);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!contextUser) return;
    const fetchPlaylists = async () => {
      try {
        const endpoint = contextUser.role === 'ADMIN'
        ? `${apiUrl}/api/playlists/admin`
        : `${apiUrl}/api/playlists/user/${contextUser.id}`;

        const response = await fetch(endpoint, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) setAlertData({show: true, status: false, message:'Failed to fetch playlists'});
        const data = await response.json();
        setPlaylists(data);
      } catch (error) {
        setAlertData({show: true, status: false, message:'Failed to load playlists.'});
      }
    };

    fetchPlaylists();
  }, []);

  const handleAddSong = async () => {
    console.log('Selected Playlist ID:', selectedPlaylistId);
    console.log('Song ID:', songId);
    if (!selectedPlaylistId) {
      setAlertData({show: true, status: false, message:'Please select a playlist.'});
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/playlists/${selectedPlaylistId}/songs/${songId}`, {
        method: 'PUT',
        credentials: "include",
      });

      const message = await response.text(); // FIXED

      if (!response.ok) {
        setAlertData({ show: true, status: false, message: message });
        setTimeout(() => setPopUp(false), 1000);
      } else {
        setAlertData({ show: true, status: true, message: message });
        setTimeout(() => setPopUp(false), 1000);
      }
    } catch (error) {
      setAlertData({show: true, status: false, message:'Failed to add song to playlist.'});
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="playlistBox">
      <div className="add-to-playlist-popup">
        <div className="popup-header">
          <h3>Select a Playlist</h3>
          <button className="close-btn" onClick={() => setPopUp(false)}><i className="bi bi-x-lg"></i></button>
        </div>

        <div className="playlist-list">
          {playlists.length>0?
          (playlists.map((playlist) => (
            <label key={playlist.id} className="playlist-item">
              <input
                type="radio"
                name="playlist"
                value={playlist.id}
                checked={selectedPlaylistId === playlist.id}
                onChange={() => setSelectedPlaylistId(playlist.id)}
              />
              <img src={playlist.imgLink} alt={playlist.name} className="playlist-img" />
              <div className="playlist-info">
                <strong>{playlist.name}</strong>
                <span>{playlist.type}</span>
              </div>
            </label>
          ))):(
            <label className="playlist-item" ><strong style={{margin: '20px 0'}}>Playlist Not Found</strong></label>
          )}
        </div>

        <button className="done-btn" onClick={handleAddSong} disabled={loading}>
          {loading ? 'Adding...' : 'Done'}
        </button>
      </div>
    </div>
  );
};

export default AddSongToPlaylist;
