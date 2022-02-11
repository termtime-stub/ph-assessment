import axios from "axios";
import {useAuth0, User} from "@auth0/auth0-react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Theme,
  TextField,
  InputBase,
  FormControl,
} from "@mui/material";

import {makeStyles, createStyles} from "@mui/styles";
import {APP_ROUTES} from "../constants/index";
import {SpotifyService} from "../services/SpotifyService";
import {AppDispatch} from "../app/store";
import {useAppDispatch} from "../app/hooks";
import {searchSpotifyAction} from "../app/redux/reducers/search.reducer";
import {useState} from "react";
import {Logout, Search} from "@mui/icons-material";
import {IconButton} from "@mui/material";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      width: 35,
      height: 35,
      margin: 10,
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
                ml: 5,
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
              sx={{p: "10px", mr: 5}}
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
          <Avatar src={user?.picture} className={styles.avatar} />
          <Typography variant="h6">{user?.nickname}</Typography>

          {renderMidNavbar()}
          {renderLinkNav()}
          <Box sx={{marginLeft: 5}}>
            <Button color="inherit" onClick={() => logout()}>
              <Logout sx={{marginRight: 1}} />
              Sign out
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
