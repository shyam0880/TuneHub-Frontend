import React ,{ useRef, useState, useEffect }from 'react';
import '../CSS/displaytable.css';

const MasterMusic = ({
  currentSong,
  isPlaying,
  setIsPlaying,
  handleNext,
  handlePrevious,
  togglePlay,
  formatTime,
  playbackMode,
  togglePlaybackMode,
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);
  const audioRef = useRef(new Audio(currentSong.link));
  const [prevId,setPrevId] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    audio.src = currentSong.link;
    audio.load();
    if (isPlaying) {
        audio.play();
    } else {
        if(prevId!=currentSong.id){

            togglePlay();
            setPrevId(currentSong.id);
        }
        else{
            setIsPlaying(false);

        }
    }
    setCurrentTime(0);

    const setAudioData = () => setDuration(audio.duration);
    const updateTime = () => setCurrentTime(audio.currentTime);
    const handleSongEnd = () => {
        if (playbackMode === "repeat") {
            audio.currentTime = 0;
            audio.play();
        } else if (playbackMode === "autoPlay") {
            handleNext(); // Move to the next song
        } else {
            setIsPlaying(false); // Stop playback
        }
    };

    audio.addEventListener("loadedmetadata", setAudioData);
    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("ended", handleSongEnd); 

    return () => {
        audio.pause();
        audio.removeEventListener("loadedmetadata", setAudioData);
        audio.removeEventListener("timeupdate", updateTime);
        audio.removeEventListener("ended", handleSongEnd);
    };
}, [currentSong, playbackMode]);

  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * duration;
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleVolume = (e) => {
    const volumeValue = e.target.value;
    audioRef.current.volume = volumeValue / 100;
    setVolume(volumeValue);
  };

  return (
    <div className="master_play">
      <div className="wave" id="wave">
        <div className={`wave1 ${isPlaying ? "wave-play" : ""}`}></div>
        <div className={`wave1 ${isPlaying ? "wave-play" : ""}`}></div>
        <div className={`wave1 ${isPlaying ? "wave-play" : ""}`}></div>
      </div>
      <img src={currentSong.imgLink} alt={currentSong.name} id="poster_master_play" />
      <h5 id="title">
        {currentSong.name}
        <div className="subtitle">{currentSong.artist}</div>
      </h5>
      <div className="icon">
        <i className="bi shuffle bi-music-note-beamed"></i>
        <i className="bi bi-skip-start-fill" onClick={handlePrevious}></i>
        <i
          className={`bi ${isPlaying ? "bi-pause-fill" : "bi-play-fill"}`}
          id="masterPlay"
          onClick={togglePlay}
          style={{ cursor: "pointer" }}
        ></i>
        <i className="bi bi-skip-end-fill" onClick={handleNext}></i>
      </div>
      <span id="currentStart">{formatTime(currentTime)}</span>
      <div className="bar">
        <input
          type="range"
          id="seek"
          min="0"
          max="100"
          value={(currentTime / duration) * 100 || 0}
          onChange={handleSeek}
        />
      </div>
      <span id="currentEnd">{formatTime(duration)}</span>
      <div className="vol">
        <i className="bi bi-volume-down-fill" id="vol_icon"></i>
        <input type="range" id="vol" min="0" max="100" value={volume} onChange={handleVolume} />
      </div>
      <div className="icon">
        <i
          className={
            playbackMode === "normal"
              ? "bi bi-repeat"
              : playbackMode === "autoPlay"
              ? "bi bi-skip-end"
              : "bi bi-repeat-1"
          }
          onClick={togglePlaybackMode}
        ></i>
      </div>
    </div>
  );
};

export default MasterMusic;
