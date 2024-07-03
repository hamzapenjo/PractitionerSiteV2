import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PrivateRoute = ({ children, roles }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/" />;
  }

  const { type } = jwtDecode(token);
  if (!roles.includes(type)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
