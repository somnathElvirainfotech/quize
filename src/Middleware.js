import React from 'react';
import {useSelector} from 'react-redux';
import {Navigate, useLocation} from 'react-router-dom';

export const UserRequireAuth = ({children}) => {
  const {isAuthenticated, isAdmin} = useSelector (state => state.auth);

  const location = useLocation ();

  if (!isAuthenticated) {
    return <Navigate to="/" state={{path: location.pathname}} />;
  } else if (isAuthenticated && isAdmin) {
    return <Navigate to="/admin" state={{path: location.pathname}} />;
  } else {
    return children;
  }
};

export const RequireAuth = ({children}) => {
  const {isAuthenticated} = useSelector (state => state.auth);

  const location = useLocation ();

  if (!isAuthenticated) {
    return <Navigate to="/" state={{path: location.pathname}} />;
  } else {
    return children;
  }
};

export const WithOutAuth = ({children}) => {
  const {isAuthenticated} = useSelector (state => state.auth);

  const location = useLocation ();

  if (isAuthenticated) {
    return <Navigate to="/" state={{path: location.pathname}} />;
  }

  return children;
};