import {useAuth0} from "@auth0/auth0-react";
import {Typography, Box, Theme, Grid, CircularProgress} from "@mui/material";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import {makeStyles, createStyles} from "@mui/styles";
import {SongCard} from "./SongCard";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {useEffect} from "react";
import {getNewReleasesAction} from "../../app/redux/reducers/search.reducer";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    carousel: {},
    placeholderSpace: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      height: "50vh",
    },
  })
);

export const NewReleases = () => {
  const styles = useStyles();
  const {newReleases, loadingNewReleases} = useAppSelector(
    (state) => state.search
  );
  const {user} = useAuth0();
  const dispatch = useAppDispatch();

  const responsive = {
    superLargeDesktop: {
      breakpoint: {max: 4000, min: 3000},
      items: 5,
      partialVisibilityGutter: 40,
    },
    desktop: {
      breakpoint: {max: 3000, min: 1400},
      items: 4,
      partialVisibilityGutter: 30,
    },
    tablet: {
      breakpoint: {max: 1400, min: 1024},
      items: 3,
      partialVisibilityGutter: 20,
    },
    middleTablet: {
      breakpoint: {max: 1024, min: 838},
      items: 2,
      partialVisibilityGutter: 20,
    },
    mobile: {
      breakpoint: {max: 464, min: 0},
      items: 1,
      partialVisibilityGutter: 10,
    },
  };

  useEffect(() => {
    if (user) {
      dispatch(getNewReleasesAction(user));
    }
  }, [dispatch, user]);

  return (
    <Box>
      {loadingNewReleases ? (
        <Box className={styles.placeholderSpace}>
          <CircularProgress color="secondary" />
        </Box>
      ) : (
        <Box>
          <Box
            sx={{
              marginTop: "25px",
              marginLeft: {
                xs: "20px",
                md: "50px",
              },
            }}
          >
            <Typography variant="h3" sx={{sm: {fontSize: 12}}}>
              New Releases
            </Typography>
          </Box>
          <Carousel responsive={responsive} partialVisible={true}>
            {newReleases
              .filter((s) => s.isNewRelease)
              .map((s) => (
                <Grid item key={s.id}>
                  <SongCard song={s} />
                </Grid>
              ))}
          </Carousel>
        </Box>
      )}
    </Box>
  );
};
