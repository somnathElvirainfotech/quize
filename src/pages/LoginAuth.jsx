import TokenHelper from "../pages/TokenHelper";
import { Navigate, useLocation } from "react-router-dom";
import React from "react";

export const LoginAuth = ({ children }) => {
  const token = TokenHelper.getToken();
  const location = useLocation();
  if (!token) {
    return <Navigate to="/" state={{ path: location.pathname }} />;
  }

  return children;
};

