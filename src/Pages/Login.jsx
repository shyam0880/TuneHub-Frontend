import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import  AuthContext  from "../AutherContext/AuthContext";


const Login = () => {
	const { login } = useContext(AuthContext);
	const [loginMessage,setLoginMessage] = useState("");
	const navigate = useNavigate();
	const [user,setUser] = useState({
		email:"",
		password:""
	});
 
	const handleData=(e)=>{
		const{ name, value} = e.target;
		setUser({
			...user,
			[name]: value,
		})
	}

	const handleLogin=async(e)=>{
		e.preventDefault();
		try{
			const response = await fetch('http://localhost:8080/signin', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(user),
				});

				if (!response.ok) {
					const errorMessage = await response.text(); // Read error message from server
					throw new Error(errorMessage || "Login failed");
				}

				const data = await response.json(); 
				login(data);
				alert(`Login successful! Welcome ${data.username}`); 
				navigate("/Dashboard");

		} catch (err) {
		setLoginMessage(err.message); 
		}

	}

  return (
    <div className="container" >
			<div className="form_container">
				<form  onSubmit={handleLogin} >
					<h1 className="form__title">Login</h1>
					<div className="form__input-group">
						<input 
						type="text"	name="email" 
						onChange={handleData}
						value={user.email}
						id="username"  
						placeholder="Enter your Email" 
						required/>
					</div>
					<div className="form__input-group">
						<input type="password" 
						name="password" 
						onChange={handleData}
						value={user.password}
						id="pass" 
						placeholder="Enter your Password" 
						required/>
					</div>
					<div className="submit_btn">
						<button type="submit" >Submit</button>
					</div>
				</form>
				{loginMessage && <p style={{color:"red"}}>{loginMessage}</p>}
			</div>
		</div>
  )
}

export default Login
