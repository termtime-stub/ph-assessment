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
  Grid,
} from "@mui/material";

import {APP_ROUTES} from "../../constants/index";
import {makeStyles, createStyles} from "@mui/styles";
import {NavBar} from "../../components/NavBar";
import {NewReleases} from "../../components/NewReleases/NewReleases";
import {SearchResults} from "../../components/SearchResults.tsx/SearchResults";
import {useAppSelector} from "../../app/hooks";
import {SongCard} from "../../components/NewReleases/SongCard";

const useStyles = makeStyles((theme: Theme) => createStyles({}));

export const LibraryPage = () => {
  const {results} = useAppSelector((state) => state.search);

  return (
    <Box>
      <NavBar />
      <Grid container columns={{xs: 4, sm: 8, md: 12, lg: 12}}>
        {results.map((s) => (
          <Grid item xs={6} sm={4} md={4} lg={3}>
            <SongCard song={s} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
