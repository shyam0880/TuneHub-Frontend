import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Songs from '../features/Songs';

const ArtistMusicWrapper = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const artistDetails = location.state?.artistDetails;

    const handleComplete = () => {
        navigate('/dashboard/artist'); 
    };

  return <Songs artistDetails={artistDetails} onComplete={handleComplete} />;
};

export default ArtistMusicWrapper;
