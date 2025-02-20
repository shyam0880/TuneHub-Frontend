import { Navigate, Outlet } from "react-router-dom";
import AuthContext from '../AutherContext/AuthContext';
import React ,{ useContext }from 'react';

const ProtectedRoute = () => {
    const { contextUser } = useContext(AuthContext); 
    if (contextUser === undefined) {
        return <div>Loading...</div>; // ✅ Prevent redirecting too soon
      }
    
      return contextUser ? <Outlet /> : <Navigate to="/" replace />;
    };

export default ProtectedRoute;
