import { Navigate, Outlet } from "react-router-dom";
import AuthContext from '../../context/AuthContext';
import Loading from '../ui/Loading';
import React ,{ useContext }from 'react';

const ProtectedRoute = () => {
    const { contextUser } = useContext(AuthContext); 
    if (contextUser === undefined) {
        return <Loading />; // ✅ Prevent redirecting too soon
      }
    
      return contextUser ? <Outlet /> : <Navigate to="/" replace />;
    };

export default ProtectedRoute;
