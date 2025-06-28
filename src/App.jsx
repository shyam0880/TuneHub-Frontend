import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

import { AuthProvider } from './context/AuthContext.jsx';
import { DataProvider } from './context/DataContext.jsx';

const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Payment = lazy(()=>import('./components/payment/Payment'))
const Playlist = lazy(() => import('./components/features/Playlist'));
const CreatePlaylistWrapper = lazy(() => import('./components/forms/CreatePlaylistWrapper'));
const ProtectedRoute = lazy(() => import('./components/auth/ProtectedRouter'));
const Artist = lazy(() => import('./components/features/Artist'));
const DownloadSong = lazy(() => import('./components/features/DownloadSong'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const UserList = lazy(() => import('./components/features/UserList'));

import Loading from './components/ui/Loading';
import AlertMessage from './components/ui/AlertMessage';
import ConfirmDialog from './components/ui/ConfirmDialog';
import ArtistMusicWrapper from './components/forms/ArtistMusicWrapper.jsx';


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
						element: <Suspense fallback={<Loading />}> <Playlist /></Suspense>,
					},
					{
						path: "payment",
						element: <Suspense fallback={<Loading />}><Payment /></Suspense>,
					},
					{
						path: "create-playlist",  
						element: <Suspense fallback={<Loading />}><CreatePlaylistWrapper /></Suspense>,
					},
					{
						path: "artist",
						element: <Suspense fallback={<Loading />}><Artist /></Suspense>,
					},
					{
						path: "downloaded", 
						element: <Suspense fallback={<Loading />}><DownloadSong /></Suspense>,
					},
					{
						path: "user-list",
						element: <Suspense fallback={<Loading />}><UserList /></Suspense>,
					},
					{
						path:"songs",
						element: <Suspense fallback={<Loading />}><ArtistMusicWrapper /></Suspense>,
					}
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
