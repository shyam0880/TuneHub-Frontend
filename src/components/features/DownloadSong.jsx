import React,{useState, useContext} from 'react';
import "../../styles/DownloadSong.css";
import DataContext from '../../context/DataContext';
import AuthContext from '../../context/AuthContext';

const DownloadSong = () => {
  const { openConfirmDialog  } = useContext(AuthContext);
    const {
      downloadedSong,
      currentSong,
      handlePlaylistSong,
		  isPlaying,
      removeFromDownload,
    } = useContext(DataContext);

    const handleRemoveSong = (songId) => {
      openConfirmDialog("Are you sure you want to remove this song?", () => {removeFromDownload(songId)});
    };
    
      return (
        <div className="download-song">
          <h2 className="heading">Downloaded Songs</h2>
          <ul className="song-list">
            {downloadedSong.length > 0 ? (
              downloadedSong.map((song, index) => (
                <li key={song.id} className="song-item">
                  <span className="index">{index + 1}</span>
                  <div className="img-play">
                    <img src={song.imgLink} alt={song.name} />
                  </div>
                  <div className="song-info">
                    <h5>
                      <span>{song.name}</span>
                      <div className="subtitle">{song.artistName}</div>
                    </h5>
                  </div>
                  <div className="options">
                  <i className={`bi ${currentSong.id === song.id && isPlaying ? "bi-pause-circle-fill" : "bi-play-circle-fill"}`} 
											onClick={() => handlePlaylistSong(downloadedSong, index)}
										></i>
                    <i className="bi bi-x" onClick={()=>handleRemoveSong(song.id)}></i>
                  </div>
                </li>
              ))
            ) : (
              <li className="no-song">No Downloaded Song</li>
            )}
          </ul>
        </div>
      );
    };
export default DownloadSong
