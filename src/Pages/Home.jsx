import React, {useState,useContext} from 'react';
import Login from './login';
import Register from './Register';
import  AuthContext  from "../AutherContext/AuthContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [state,setState] = useState(0);
	const navigate = useNavigate();
	const { contextUser } = useContext(AuthContext);


	if (contextUser) {
		navigate("/Dashboard"); 
	}

  return (
    <div className="home">
			<div className="home1">
				<h1 onClick={()=>setState(0)}>TUNE<span>HUB</span></h1><br/>
				<p>
					Your ultimate destination for streaming, discovering, and sharing music. <br/>
					Explore new artists, create playlists, and enjoy nonstop music anytime, <br/>
					anywhere! 🎵🔥
				</p>
				<div class="overlay-container">
					<div class="overlay">
					<button onClick={()=>setState(1)} className={state === 1 ? "active" : ""}>Login</button>
					<button onClick={()=>setState(2)} className={state === 2 ? "active" : ""} >Register</button>
					</div>
				</div>
			</div>

			<div className="home2">
				{state===0?<img src='../src/image/musicband.png'alt="logo" />: ''}
				{state===1?<Login/>: ''}
				{state===2?<Register/>: ''}
			</div>
	</div>
  )
}

export default Home
