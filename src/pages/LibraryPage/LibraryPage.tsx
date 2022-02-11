import {Box, Theme, Grid} from "@mui/material";

import {makeStyles, createStyles} from "@mui/styles";
import {NavBar} from "../../components/NavBar";
import {useAppSelector} from "../../app/hooks";
import {SongCard} from "../../components/NewReleases/SongCard";

const useStyles = makeStyles((theme: Theme) => createStyles({}));

export const LibraryPage = () => {
  const {songs} = useAppSelector((state) => state.library);

  return (
    <Box>
      <NavBar />
      <Grid container columns={{xs: 4, sm: 8, md: 12, lg: 12}}>
        {songs
          .filter((s) => s.isInLibrary)
          .map((s) => (
            <Grid item xs={6} sm={4} md={4} lg={3} key={s.id}>
              <SongCard song={s} />
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};
