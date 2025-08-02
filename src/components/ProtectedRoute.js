// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn');
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;
