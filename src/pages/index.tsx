import {useAuth0} from "@auth0/auth0-react";
import {createTheme, ThemeProvider, CssBaseline} from "@mui/material";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {LoadingSpinner} from "../components/LoadingSpinner";
import {ProtectedRoute} from "../components/ProtectedRoute";
import {APP_ROUTES} from "../constants";
import {DashboardPage} from "./DashboardPage/DashboardPage";
import React from "react";

const darkMode = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#201640",
    },
    secondary: {
      main: "#1fdf64",
      light: "#1fdf64",
      dark: "#1fdf64",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            "linear-gradient(180deg, rgba(32,17,95,1) 0%, rgba(18,18,18,1) 40%)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: "#201060",
      },
    },

    MuiTypography: {
      defaultProps: {
        fontFamily: "Helvetica",
      },
      styleOverrides: {
        // Header titles
        subtitle1: {
          color: "#a7a7a7",
          fontWeight: "bold",
        },
        //Song artist/album name & duration
        subtitle2: {
          color: "#a7a7a7",
        },
        //Song titles
        h6: {
          color: "#e6e6e6",
          fontSize: 16,
        },
      },
    },
  },
});

const App = () => {
  const {isLoading} = useAuth0();
  return (
    <ThemeProvider theme={darkMode}>
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
