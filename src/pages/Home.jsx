import React, {useState,useContext, useEffect} from 'react';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import  AuthContext  from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Loading from '../components/ui/Loading';

const Home = () => {
	const { contextUser } = useContext(AuthContext);
	const navigate = useNavigate();
	const [state, setState] = useState(0);
  
	useEffect(() => {
		if (contextUser) {
		  navigate("/dashboard");
		}
	  }, [contextUser, navigate]);
	  
	if (contextUser === undefined) {
	return <Loading />;
	}
	
	if (contextUser) {
	return null; 
	}

	return (
	  <div className="home-page">
		<div className="home-intro">
		  {/* <h1 onClick={() => setState(0)}>TUNE<span>HUB</span></h1><br /> */}
		  	<img src="https://res.cloudinary.com/dvwcy1jab/image/upload/v1746169589/HummingBeatLogo_ebuiar.png" alt="" onClick={() => setState(0)}/>	
		  <p className='intro-text'>
			Your ultimate destination for streaming, discovering, and sharing music.
			Explore new artists, create playlists, and enjoy nonstop music anytime,
			anywhere! 🎵🔥
		  </p>
		  <div className="overlay-container">
			<div className="overlay">
			  <button onClick={() => setState(1)} className={state === 1 ? "active" : ""}>Login</button>
			  <button onClick={() => setState(2)} className={state === 2 ? "active" : ""}>Register</button>
			</div>
		  </div>
		</div>
  
		<div className="home-content">
			{state === 0 && <img src="https://res.cloudinary.com/dvwcy1jab/image/upload/v1740661126/musicband_vcf1bw.png" alt="logo" />}
			{state === 1 && <Login />}
			{state === 2 && <Register />}
		</div>
	  </div>
	);
  };
  

export default Home
