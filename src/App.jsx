
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./AutherContext/AuthContext"
import Home from './Pages/Home';
import Dashboard from './Pages/Dashboard';
import 'bootstrap-icons/font/bootstrap-icons.css';



function App() {
	const router = createBrowserRouter([
	  {
		path: "/",
		element: <Home />,
	  },
	  {
		path: "/Dashboard",
		element: <ProtectedRoute />,
		children: [
			{	
				path: "",
				element: <Dashboard />,				
				children: [
					{
						path: "Playlist",
						element: <Playlist />,
					},
					{
						path: "Payment",
						element: <Payment />,
					},
					{
						path: "createPlaylist",  
						element: <CreatePlaylist />,
					},
					{
						path: "likeSongs",
						// element: <LikeSong />,
					}
				]
			},
			
		],
	},
	]);
	

  return (
	<AuthProvider>
	</AuthProvider>
)
}

export default App
