
import './App.css';
import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./AutherContext/AuthContext"
import ReactLoading from 'react-loading';
const Home = lazy(() => import('./Pages/Home'));
const Dashboard = lazy(() => import('./Pages/Dashboard'));
const Payment = lazy(()=>import('./Payment/Payment'))
import 'bootstrap-icons/font/bootstrap-icons.css';
import Artist from './Component/Artist';
const Playlist = lazy(() => import('./Component/Playlist'));
const CreatePlaylist = lazy(() => import('./Component/CreatePlaylist'));
const ProtectedRoute = lazy(() => import('./AutherContext/ProtectedRouter'));



function App() {
	const router = createBrowserRouter([
	  {
		path: "/",
		element: <Home />,
	  },
	  {
		path: "/dashboard",
		element: <ProtectedRoute />,
		children: [
			{	
				path: "",
				element: <Dashboard />,				
				children: [
					{
						path: "playlist",
						element: <Playlist />,
					},
					{
						path: "payment",
						element: <Payment />,
					},
					{
						path: "create-playlist",  
						element: <CreatePlaylist />,
					},
					{
						path: "artist",
						element: <Artist />,
					}
				]
			},
			
		],
	},
	]);
	

  return (
	<AuthProvider>
		<Suspense fallback={
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                    <ReactLoading type="bubbles" color="#000" height={80} width={80} />
                </div>
        }>
			<RouterProvider router={router} />
		</Suspense>
	</AuthProvider>
)
}

export default App
