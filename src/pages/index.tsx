import {useAuth0} from "@auth0/auth0-react";
import {createTheme, CssBaseline} from "@mui/material";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {LoadingSpinner} from "../components/LoadingSpinner";
import {ProtectedRoute} from "../components/ProtectedRoute";
import {APP_ROUTES} from "../constants";
import {DashboardPage} from "./DashboardPage/DashboardPage";
import React from "react";
import {ThemeProvider} from "@mui/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: "#201060",
      },
    },
    MuiTypography: {
      defaultProps: {
        fontFamily: "Helvetica",
      },
    },
  },
});

const App = () => {
  const {isLoading} = useAuth0();
  return (
    <ThemeProvider theme={theme}>
      <React.Fragment>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route
              path={APP_ROUTES.ROOT}
              element={
                isLoading ? (
                  <LoadingSpinner />
                ) : (
                  <Navigate to={APP_ROUTES.DASHBOARD} />
                )
              }
            />
            <Route
              path={APP_ROUTES.DASHBOARD}
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </React.Fragment>
    </ThemeProvider>
  );
};

export default App;
