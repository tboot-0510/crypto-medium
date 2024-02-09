import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";
import { logoutApiHandler } from "../api/loginApi";
import { useLocalStorage } from "@uidotdev/usehooks";

const Context = createContext(undefined);

export default function Auth({ children }) {
  const [user, setUser] = useLocalStorage("user", undefined);
  const [isAuthenticated, setIsAuthenticated] = useState(user != undefined);

  const { refetch: logoutCall } = useQuery({
    queryFn: () => logoutApiHandler(),
    queryKey: ["logout", user?._id],
    enabled: false,
    onSuccess() {
      setUser(undefined);
      setIsAuthenticated(false);
      //   clearLocalStorage();
    },
  });

  function logout() {
    logoutCall();
  }

  function handleUser(user) {
    setUser(user);
    setIsAuthenticated(true);
  }

  const contextValue = {
    user,
    isAuthenticated,
    logout,
    handleUser,
  };
  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}

export function useAuth() {
  return useContext(Context);
}
