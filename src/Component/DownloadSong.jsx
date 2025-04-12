import React,{useState, useContext} from 'react';
import "../CSS/DownloadSong.css";
import DataContext from '../Context/DataContext';

const DownloadSong = () => {
    const {
      downloadedSong,
      currentSong,
      handlePlaylistSong,
		  isPlaying,
    } = useContext(DataContext);

    
      return (
        <div className="dwnsng">
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
                      {song.name} <br />
                      <span className="subtitle">{song.artist}</span>
                    </h5>
                  </div>
                  <div className="options">
                  <i className={`bi ${currentSong.id === song.id && isPlaying ? "bi-pause-circle-fill" : "bi-play-circle-fill"}`} 
											onClick={() => handlePlaylistSong(downloadedSong, index)}
										></i>
                  </div>
                </li>
              ))
            ) : (
              <li className="no-song">No matching songs found</li>
            )}
          </ul>
        </div>
      );
    };
export default DownloadSong
