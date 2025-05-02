import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

import { AuthProvider } from "./Context/AuthContext"
import { DataProvider } from './Context/DataContext';

const Home = lazy(() => import('./Pages/Home'));
const Dashboard = lazy(() => import('./Pages/Dashboard'));
const Payment = lazy(()=>import('./Payment/Payment'))
const Playlist = lazy(() => import('./Component/Playlist'));
const CreatePlaylistWrapper = lazy(() => import('./Component/CreatePlaylistWrapper'));
const ProtectedRoute = lazy(() => import('./Context/ProtectedRouter'));
const Artist = lazy(() => import('./Component/Artist'));
const DownloadSong = lazy(() => import('./Component/DownloadSong'));
const NotFoundPage = lazy(() => import('./Pages/NotFoundPage'));

import Loading from './Component/Loading';
import AlertMessage from '../src/Component/AlertMessage';
import ConfirmDialog from './Component/ConfirmDialog';


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
	{
		path: "*",
		element: <NotFoundPage/> 
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
			<AlertMessage />
			<ConfirmDialog />
		</Suspense>
		</DataProvider>
	</AuthProvider>
)
}

export default App
