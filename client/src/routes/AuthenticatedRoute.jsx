import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AuthenticatedRoute = ({ children, fallback }) => {
  const { user } = useSelector((state) => ({
    user: state.user.informations.email,
  }));

  if (!user && fallback) {
    return <>{fallback}</>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AuthenticatedRoute;
