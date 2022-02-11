import {useAuth0} from "@auth0/auth0-react";
import {useNavigate} from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Theme,
  Link,
  TextField,
} from "@mui/material";

import {APP_ROUTES} from "../../constants/index";
import {makeStyles, createStyles} from "@mui/styles";
import {NavBar} from "../../components/NavBar";
import {NewReleases} from "../../components/NewReleases";

const useStyles = makeStyles((theme: Theme) => createStyles({}));

export const DashboardPage = () => {
  const {logout, user} = useAuth0();
  const navigate = useNavigate();

  const styles = useStyles();

  return (
    <Box>
      <NavBar />
      <NewReleases />
      {/* <MoreSongs /> */}
    </Box>
  );
};
