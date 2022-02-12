import {useAuth0} from "@auth0/auth0-react";
import {Link, useLocation} from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Theme,
  InputBase,
} from "@mui/material";

import {makeStyles, createStyles} from "@mui/styles";
import {APP_ROUTES} from "../constants/index";
import {useAppDispatch} from "../app/hooks";
import {searchSpotifyAction} from "../app/redux/reducers/search.reducer";
import {useState} from "react";
import {Logout, Search} from "@mui/icons-material";
import {IconButton} from "@mui/material";
import {LogoutMenu} from "./LogoutMenu";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      width: 35,
      height: 35,
    },
    searchContainer: {
      backgroundColor: "#fff",
      color: "black",
      borderRadius: "35px",
      alignSelf: "center",
      height: 35,
      display: "flex",
      flexGrow: 1,
      padding: 8,
    },
    searchInput: {
      fontFamily: "Helvetica",
      borderRadius: "50px",
      color: "#fff",
    },
    navbarContainer: {
      backgroundColor: "#000000",
    },
    username: {
      fontFamily: "Helvetica",
      color: "#9c9b9e",
    },
    libraryTextLink: {
      textDecoration: "none",
      textUnderlinePosition: "unset",
    },
    libraryText: {
      fontFamily: "Helvetica",
      color: "#a6a6a6",

      "&:hover": {
        color: "#ffffff",
      },
    },
    form: {
      display: "flex",
      flexDirection: "row",
    },
  })
);

export const NavBar = () => {
  const {logout, user} = useAuth0();
  const [query, onChange] = useState("");
  const location = useLocation();
  const dispatch = useAppDispatch();

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(searchSpotifyAction({user, query}));
  };

  const renderMidNavbar = () => {
    if (location.pathname === APP_ROUTES.DASHBOARD) {
      return (
        <Box component="div" sx={{flexGrow: 1}}>
          <form onSubmit={handleSearch} className={styles.form}>
            <InputBase
              value={query}
              onChange={(e) => onChange(e.target.value)}
              sx={{
                ml: {
                  xs: 1,
                  md: 5,
                },
                flex: 1,
                input: {
                  color: "black",
                  fontSize: 14,
                },
              }}
              className={styles.searchContainer}
              placeholder="Search on Spotify"
            />
            <IconButton
              type="submit"
              sx={{
                p: "10px",
                mr: {
                  xs: 1,
                  md: 5,
                },
              }}
              aria-label="search"
            >
              <Search />
            </IconButton>
          </form>
        </Box>
      );
    } else if (location.pathname === APP_ROUTES.LIBRARY) {
      return (
        <Box component="div" sx={{flexGrow: 1, textAlign: "center"}}>
          <Typography variant="h4">My Library</Typography>
        </Box>
      );
    }
  };

  const renderLinkNav = () => {
    if (location.pathname === APP_ROUTES.DASHBOARD) {
      return (
        <Link to={APP_ROUTES.LIBRARY} className={styles.libraryTextLink}>
          <Typography variant="h6" className={styles.libraryText}>
            My Library
          </Typography>
        </Link>
      );
    } else if (location.pathname === APP_ROUTES.LIBRARY) {
      return (
        <Link to={APP_ROUTES.DASHBOARD} className={styles.libraryTextLink}>
          <Typography variant="h6" className={styles.libraryText}>
            Search
          </Typography>
        </Link>
      );
    } else {
      return <></>;
    }
  };

  const styles = useStyles();
  return (
    <Box sx={{flexGrow: 1}}>
      <AppBar
        enableColorOnDark={true}
        position="static"
        color="inherit"
        className={styles.navbarContainer}
      >
        <Toolbar>
          <Avatar
            src={user?.picture}
            className={styles.avatar}
            sx={{margin: {xs: 0, md: "10px"}}}
          />
          <Typography variant="h6" sx={{display: {xs: "none", md: "flex"}}}>
            {user?.nickname}
          </Typography>

          {renderMidNavbar()}
          <Box
            sx={{
              display: {
                xs: "none",
                md: "flex",
              },
              flexDirection: "row",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              {renderLinkNav()}
            </Box>
            <Box
              sx={{
                marginLeft: {
                  xs: 0,
                  md: 5,
                },
              }}
            >
              <Button color="inherit" onClick={() => logout()}>
                <Logout
                  sx={{
                    marginRight: {
                      xs: 0,
                      md: 1,
                    },
                  }}
                />
                Sign out
              </Button>
            </Box>
          </Box>
          <Box sx={{display: {xs: "flex", md: "none"}}}>
            <LogoutMenu />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
