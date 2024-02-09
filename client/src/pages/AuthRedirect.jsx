import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/Authentication";
import { useLocalStorage } from "@uidotdev/usehooks";
import { meApi } from "../api/loginApi";

const AuthRedirect = () => {
  const [err, setErr] = useState(undefined);
  const [query] = useSearchParams();
  const navigate = useNavigate();
  const [, setRefreshToken] = useLocalStorage("refresh_token", undefined);
  const [, setAccessToken] = useLocalStorage("access_token", undefined);
  const [, setUser] = useLocalStorage("user", undefined);
  const { handleUser } = useAuth();

  useEffect(() => {
    meApi()
      .then((res) => {
        if (!res.data.success) {
          setErr("Something unexpected happened");
          //   clearLocalStorage();
        }
        setAccessToken(query.get("access_token"));
        setRefreshToken(query.get("refresh_token"));
        setUser(res.data);
        handleUser(res.data);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        setErr("Something unexpected happened");
        localStorage.clear();
      });
  }, [handleUser, navigate, query, setAccessToken, setRefreshToken, setUser]);

  return (
    <div style={{ textAlign: "center", marginTop: "6vh" }}>
      {err ? err : "Redirecting ..."}
    </div>
  );
};

export default AuthRedirect;
