import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import { Outlet, useNavigate } from 'react-router-dom';

const Playlist = ({ currSong, onSongSelect, checkPlay, setAlertData }) => {
  const { contextUser, openConfirmDialog, apiUrl } = useContext(AuthContext);
  const [playlists, setPlayList] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [playlistSongs, setPlaylistSongs] = useState([]);
  const [hidePlaylist, setHidePlaylist] = useState(true);
  const [titleStatus, setTitleStatus] = useState(2);
  const navigate = useNavigate();

  const fetchUserPlaylists = async (userId) => {
    try {
      const response = await fetch(`${apiUrl}/api/playlists/user/${userId}`,{
        credentials: "include",
      });
      const data = await response.json();
      setPlayList(data);
    } catch (err) {
      setAlertData({ show: true, status: false, message: 'Failed to load playlists' });
    }
  };

  const fetchAdminPlaylists = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/playlists/admin`,{
        credentials: "include",
      });
      const data = await res.json();
      setPlayList(data);
    } catch (err) {
      setAlertData({ show: true, status: false, message: 'Failed to load admin playlists' });
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/users`,{
        credentials: "include",
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setAlertData({ show: true, status: false, message: error.message });
    }
  };

  useEffect(() => {
    if (contextUser.role === 'ADMIN') {
      fetchAdminPlaylists();
      // fetchUsers();
      setTitleStatus(0);
    } else {
      fetchUserPlaylists(contextUser.id);
      setTitleStatus(2);
    }
  }, [contextUser]);

  const handleSelectUser = async (userId) => {
    if (!userId) return;
    fetchUserPlaylists(userId);
    setCurrentPlaylist(null);
    setHidePlaylist(true);
  };

  const handleEdit = (playlist) => {
    navigate('/dashboard/create-playlist', { state: { playlist } });
  };

  const fetchPlaylistById = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/api/songs/playlistId/${id}`,{
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (err) {
      setAlertData({ show: true, status: false, message: err.message });
    }
  };

  const handleSongPlaylist = async (playlist) => {
    const songs = await fetchPlaylistById(playlist.id);
    if (songs) {
      setCurrentPlaylist(playlist);
      setPlaylistSongs(songs);
      setHidePlaylist(false);
    } else {
      setAlertData({ show: true, status: false, message: 'Playlist not found' });
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    try {
      const response = await fetch(`${apiUrl}/api/playlists/${playlistId}`, {
        method: 'DELETE',
        credentials: "include",
      });
      const result = await response.text();
      if (!response.ok) {
        setAlertData({ show: true, status: false, message: result });
        return;
      }
      setAlertData({ show: true, status: true, message: result });
      setHidePlaylist(true);
      if (contextUser.role === 'ADMIN') {
        fetchAdminPlaylists();
      } else {
        fetchUserPlaylists(contextUser.id);
      }
    } catch (err) {
      setAlertData({ show: true, status: false, message: 'Failed to delete playlist' });
    }
  };

  const handleDeleteClick = (id) => {
    openConfirmDialog('Are you sure you want to delete this playlist?', () => handleDeletePlaylist(id));
  };

  const handleRemoveSong = async (playlistId, songId) => {
    try {
      const response = await fetch(`${apiUrl}/api/playlists/${playlistId}/songs/${songId}`, {
        method: 'DELETE',
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) {
        setAlertData({ show: true, status: false, message: data.message });
        return;
      }

      setAlertData({ show: true, status: true, message: data.message });
      setPlaylistSongs(prev => prev.filter(song => song.id !== songId));
    } catch (err) {
      setAlertData({ show: true, status: false, message: 'Error removing song' });
    }
  };

  const handleRemoveSongFromPlaylist = (playlistId, songId) => {
    openConfirmDialog('Are you sure you want to delete this song from the playlist?', () =>
      handleRemoveSong(playlistId, songId)
    );
  };

  const canEditPlaylist = (playlist) =>
    contextUser.role === 'ADMIN' || playlist.userId === contextUser.id;

  return (
    <div className="dashboard-box">
      <div className="section-song">
        <div className="playlist-header">
          <img
            src={
              hidePlaylist
                ? 'https://res.cloudinary.com/dvwcy1jab/image/upload/v1740661173/grass_abv3mp.jpg'
                : currentPlaylist?.imgLink
            }
            alt="playlist"
            className="image"
          />
          <div className="addplaylist">
            <div className="sideplay">
              <h2>{hidePlaylist ? 'Playlists' : currentPlaylist?.name || 'Playlist not found'}</h2>
              <h4>{hidePlaylist ? 'All Collections' : currentPlaylist?.type || 'Not set'}</h4>
            </div>
            <div className="picons">
              {!hidePlaylist && (
                <>
                  <i className="bi bi-arrow-left-circle" onClick={() => setHidePlaylist(true)}></i>
                  {canEditPlaylist(currentPlaylist) && (
                    <i className="bi bi-trash3" onClick={() => handleDeleteClick(currentPlaylist.id)}></i>
                  )}
                </>
              )}
              <i className="bi bi-play-circle-fill"></i>
            </div>
          </div>
        </div>

        <div className="selectUser" onClick={()=> fetchUsers()}>
          <label className={titleStatus === 0 ? 'active' : ''} style={{ marginRight: '10px', color: '#ccc', cursor: 'pointer' }} onClick={() => { fetchAdminPlaylists(), setTitleStatus(0) }}>All</label>
          {contextUser.role === 'ADMIN'? (
            <>
              <select id="userSelect" onChange={(e) => handleSelectUser(e.target.value)} onClick={() => setTitleStatus(1)}>
                <option value="">All Users</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </select>
            </>
          ):(
            <div style={{ marginLeft: '20px', display: 'flex', gap: '15px' }}>
              <label className={titleStatus === 2 ? 'active' : ''} style={{ color: '#ccc', cursor: 'pointer' }} onClick={() => { handleSelectUser(contextUser.id), setTitleStatus(2) }}>My Playlists</label>
            </div>
          )}
        </div>


        {hidePlaylist ? (
          <div className="playlist_song">
            {playlists.length > 0 ? (
              playlists.map((play) => (
                <li key={play.id} className="songItem">
                  <div className="img_play">
                    <img src={play.imgLink} alt={play.name} />
                  </div>
                  <h5>
                    <span>{play.name}</span>
                    <div className="subtitle">{play.type}</div>
                  </h5>
                  <div className="options">
                    {canEditPlaylist(play) && (
                      <i
                        className="bi bi-pencil-square"
                        title="Edit Playlist"
                        onClick={() => handleEdit(play)}
                      ></i>
                    )}
                    <i className="bi bi-list-ul" onClick={() => handleSongPlaylist(play)}></i>
                  </div>
                </li>
              ))
            ) : (
              <li className="noSong">No playlists</li>
            )}
          </div>
        ) : (
          <div className="playlist_song">
            {playlistSongs.length > 0 ? (
              playlistSongs.map((song, index) => (
                <li key={song.id} className="songItem">
                  <div className="img_play">
                    <img src={song.imgLink} alt={song.name} />
                  </div>
                  <h5>
                    <span>{song.name}</span>
                    <div className="subtitle">{song.artistName}</div>
                  </h5>
                  <div className="options">
                    {canEditPlaylist(currentPlaylist) && (
                      <i
                        className="bi bi-x-circle"
                        onClick={() => handleRemoveSongFromPlaylist(currentPlaylist.id, song.id)}
                      ></i>
                    )}
                    <i
                      className={
                        currSong.id === song.id && checkPlay
                          ? 'bi bi-pause-circle-fill'
                          : 'bi bi-play-circle-fill'
                      }
                      onClick={() => onSongSelect(playlistSongs, index)}
                    ></i>
                  </div>
                </li>
              ))
            ) : (
              <li className="noSong">No songs</li>
            )}
          </div>
        )}
      </div>

      {/* Create Playlist Button (only for user or ADMIN editing own playlist) */}
      {contextUser.role === 'ADMIN' || contextUser.role === 'USER' ? (
        <div className="createplaylist">
          <div className="Btn" onClick={() => navigate('/dashboard/create-playlist')}>
            <div className="sign">
              <i className="bi bi-plus"></i>
            </div>
            <div className="text">Create</div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Playlist;
