import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { meApi } from "../api/loginApi";
import { loginUser } from "../store/slices/userSlice";

const AuthenticatedRoute = ({ children, fallback }) => {
  const dispatch = useDispatch();
  const [checking, setChecking] = useState(false);

  const { user } = useSelector((state) => ({
    user: state.user.informations.email,
  }));

  const checkAuthentication = () => {
    setChecking(true);
    try {
      meApi().then((resp) => {
        if (resp) {
          dispatch(loginUser(resp.data.user));
        }
      });
    } catch (error) {
      console.log("error not authenticate", error);
    } finally {
      setChecking(false);
    }
  };

  useEffect(checkAuthentication, [dispatch]);

  if (checking) {
    return <div>Loading...</div>;
  }

  if (!user && fallback) {
    return <>{fallback}</>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AuthenticatedRoute;
