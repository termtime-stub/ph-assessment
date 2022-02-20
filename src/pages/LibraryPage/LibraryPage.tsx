import {Box, Grid} from "@mui/material";
import {NavBar} from "../../components/NavBar";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {SongCard} from "../../components/NewReleases/SongCard";
import {useAuth0} from "@auth0/auth0-react";
import {useEffect} from "react";
import {getLibraryAction} from "../../app/redux/reducers/library.reducer";
import {LoadingSpinner} from "../../components/LoadingSpinner";

export const LibraryPage = () => {
  const {songs, loadingLibrary} = useAppSelector((state) => state.library);

  const {user} = useAuth0();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) {
      dispatch(getLibraryAction({user}));
    }
  }, [dispatch, user]);

  return (
    <Box>
      <NavBar />
      <Grid container columns={{xs: 4, sm: 8, md: 12, lg: 12}}>
        {loadingLibrary ? (
          <LoadingSpinner />
        ) : (
          songs
            .filter((s) => s.isInLibrary)
            .map((s) => (
              <Grid item xs={6} sm={4} md={4} lg={3} key={s.id}>
                <SongCard track={s} />
              </Grid>
            ))
        )}
      </Grid>
    </Box>
  );
};
