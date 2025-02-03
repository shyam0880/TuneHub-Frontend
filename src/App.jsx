
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from "./AutherContext/AuthContext"
import Home from './Pages/Home';
import Dashboard from './Pages/Dashboard';
import 'bootstrap-icons/font/bootstrap-icons.css';



function App() {
	

  return (
	  <Router>
			<AuthProvider>
				<Routes>
				<Route path="/" element={<Home/>}/>
				<Route path="/Dashboard" element={<Dashboard/>}/>
				</Routes>
			</AuthProvider>
	</Router>
)
}

export default App
