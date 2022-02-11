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
} from "@mui/material";

import {makeStyles, createStyles} from "@mui/styles";
import {APP_ROUTES} from "../constants/index";
import {SpotifyService} from "../services/SpotifyService";
import {AppDispatch} from "../app/store";
import {useAppDispatch} from "../app/hooks";
import {searchSpotify} from "../app/redux/reducers/search.reducer";
import {useState} from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      width: 35,
      height: 35,
      margin: 10,
    },
    searchContainer: {
      // backgroundColor: "#fff",
      borderRadius: "50px",
    },
    searchInput: {
      fontFamily: "Helvetica",
      borderRadius: "50px",
      color: "#fff",
    },
    navbarContainer: {
      backgroundColor: "#201640",
    },
    username: {
      fontFamily: "Helvetica",
      color: "#f8f8f8",
    },
    libraryText: {
      fontFamily: "Helvetica",
      color: "#b3b3b3",
      textDecoration: "none",
      "&:hover": {
        color: "#ffffff",
      },
      transitionDuration: "0.2s",
    },
  })
);

export const NavBar = () => {
  const {logout, user, getIdTokenClaims} = useAuth0();
  const [query, onChange] = useState("");
  const location = useLocation();
  const dispatch = useAppDispatch();

  const handleSearch = async () => {
    dispatch(searchSpotify({user, query}));
  };

  const renderMidNavbar = () => {
    if (location.pathname === APP_ROUTES.DASHBOARD) {
      return (
        <Box component="div" sx={{flexGrow: 1}}>
          <TextField
            value={query}
            onChange={(e) => onChange(e.target.value)}
            variant="outlined"
            inputProps={{
              className: styles.searchInput,
            }}
            className={styles.searchContainer}
            placeholder="Search songs"
          />
          <Button onClick={handleSearch}>Search</Button>
        </Box>
      );
    } else if (location.pathname === APP_ROUTES.LIBRARY) {
      <Box component="div" sx={{flexGrow: 1}}>
        <Typography>My Library</Typography>
      </Box>;
    }
  };

  const renderLinkNav = () => {
    if (location.pathname === APP_ROUTES.DASHBOARD) {
      return (
        <Link to={APP_ROUTES.LIBRARY}>
          <Typography variant="h6" className={styles.libraryText}>
            My Library
          </Typography>
        </Link>
      );
    } else if (location.pathname === APP_ROUTES.LIBRARY) {
      return (
        <Link to={APP_ROUTES.DASHBOARD}>
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
      <AppBar position="static" className={styles.navbarContainer}>
        <Toolbar>
          <Avatar src={user?.picture} className={styles.avatar} />
          <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
            {user?.nickname}
          </Typography>

          {renderMidNavbar()}
          {renderLinkNav()}
          <Button color="inherit" onClick={() => logout()}>
            Sign out
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
