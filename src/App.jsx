
import './App.css';
import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext"
import { DataProvider } from './Context/DataContext';
import ReactLoading from 'react-loading';
const Home = lazy(() => import('./Pages/Home'));
const Dashboard = lazy(() => import('./Pages/Dashboard'));
const Payment = lazy(()=>import('./Payment/Payment'))
import 'bootstrap-icons/font/bootstrap-icons.css';
import Artist from './Component/Artist';
import Loading from './Component/Loading';
import DownloadSong from './Component/DownloadSong';
const Playlist = lazy(() => import('./Component/Playlist'));
const CreatePlaylistWrapper = lazy(() => import('./Component/CreatePlaylistWrapper'));
const ProtectedRoute = lazy(() => import('./Context/ProtectedRouter'));



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
						element: <CreatePlaylistWrapper />,
					},
					{
						path: "artist",
						element: <Artist />,
					},
					{
						path: "downloaded",
						element: <DownloadSong />,
					},
				]
			},
			
		],
	},
	]);
	

  return (
	<AuthProvider>
		<DataProvider>
		<Suspense fallback={
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                    <Loading />
                </div> 
        }>
			<RouterProvider router={router} />
		</Suspense>
		</DataProvider>
	</AuthProvider>
)
}

export default App
