import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CreatePlaylist from './CreatePlaylist';

const CreatePlaylistWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const playlist = location.state?.playlist || null;

  const handleComplete = () => {
    navigate('/dashboard'); // Or wherever you want to go after submit
  };

  return <CreatePlaylist editPlaylistData={playlist} onComplete={handleComplete} />;
};

export default CreatePlaylistWrapper;
