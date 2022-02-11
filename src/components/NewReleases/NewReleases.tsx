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
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Card,
  Grid,
  Container,
} from "@mui/material";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import {makeStyles, createStyles} from "@mui/styles";
import {SongCard} from "./SongCard";
import {useAppDispatch, useAppSelector} from "../../app/hooks";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    carousel: {},
    sectionTitle: {
      marginTop: "25px",
      marginLeft: "50px",
    },
  })
);

export const NewReleases = () => {
  const styles = useStyles();
  const {results} = useAppSelector((state) => state.search);

  const responsive = {
    superLargeDesktop: {
      breakpoint: {max: 4000, min: 3000},
      items: 5,
      partialVisibilityGutter: 40,
    },
    desktop: {
      breakpoint: {max: 3000, min: 1024},
      items: 4,
      partialVisibilityGutter: 30,
    },
    tablet: {
      breakpoint: {max: 1024, min: 464},
      items: 2,
      partialVisibilityGutter: 20,
    },
    mobile: {
      breakpoint: {max: 464, min: 0},
      items: 1,
      partialVisibilityGutter: 10,
    },
  };

  return (
    <Box>
      <Typography variant="h3" className={styles.sectionTitle}>
        New Releases
      </Typography>
      <Carousel responsive={responsive} partialVisible={true}>
        {results.map((s) => (
          <Grid item>
            <SongCard song={s} />
          </Grid>
        ))}
      </Carousel>
    </Box>
  );
};
