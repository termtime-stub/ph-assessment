import {useAuth0} from "@auth0/auth0-react";
import {createTheme, ThemeProvider, CssBaseline} from "@mui/material";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {LoadingSpinner} from "../components/LoadingSpinner";
import {ProtectedRoute} from "../components/ProtectedRoute";
import {APP_ROUTES} from "../constants";
import {DashboardPage} from "./DashboardPage/DashboardPage";
import React from "react";
import {LibraryPage} from "./LibraryPage/LibraryPage";
import {NotFoundPage} from "./NotFoundPage/NotFoundPage";
import {useEffect} from "react";
import {useSnackbar} from "notistack";
import {useAppSelector, usePrevious} from "../app/hooks";
import {FireExtinguisherOutlined} from "@mui/icons-material";

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
    primary: {
      main: "#fff",
      light: "#fff",
      dark: "#fff",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minHeight: "100vh",
          background:
            "linear-gradient(180deg, rgba(32,17,95,1) 0%, rgba(18,18,18,1) 40%)",
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        enableColorOnDark: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: "#000",
        },
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
  const {enqueueSnackbar} = useSnackbar();
  const authError = useAppSelector((s) => s.auth.error);
  const libraryError = useAppSelector((s) => s.library.error);
  const searchError = useAppSelector((s) => s.search.error);

  const prevError = usePrevious({authError, libraryError, searchError});

  // Effect for error handling with snackbars
  useEffect(() => {
    // Get the error that just changed
    let newlyDispatchedError;
    if (prevError?.authError !== authError) {
      newlyDispatchedError = authError;
    } else if (prevError?.libraryError !== libraryError) {
      newlyDispatchedError = libraryError;
    } else if (prevError?.searchError !== searchError) {
      newlyDispatchedError = searchError;
    }

    if (newlyDispatchedError) {
      enqueueSnackbar(newlyDispatchedError.toString(), {
        variant: "error",
      });
    }
  }, [
    authError,
    searchError,
    enqueueSnackbar,
    libraryError,
    prevError?.authError,
    prevError?.libraryError,
    prevError?.searchError,
  ]);

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
            <Route
              path={APP_ROUTES.LIBRARY}
              element={
                <ProtectedRoute>
                  <LibraryPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </React.Fragment>
    </ThemeProvider>
  );
};

export default App;
