import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Spinner from '../component/Loader/Spinner';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <Spinner></Spinner>
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
