import {useAuth0} from "@auth0/auth0-react";
import {LoadingSpinner} from "./LoadingSpinner";
import React, {useEffect} from "react";

interface ProtectedRouteProps {
  children: JSX.Element;
}
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({children}) => {
  const {isAuthenticated, isLoading, loginWithRedirect} = useAuth0();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const redirectUri = process.env.REACT_APP_LOGIN_REDIRECT;

      loginWithRedirect({
        redirectUri,
        connection_scope:
          "playlist-modify-private playlist-read-collaborative playlist-read-private playlist-modify-public",
      });
    }
  }, [isAuthenticated, isLoading, loginWithRedirect]);

  return isLoading ? <LoadingSpinner /> : isAuthenticated ? children : <></>;
};
