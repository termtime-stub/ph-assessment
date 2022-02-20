import {Avatar, Grid} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import {makeStyles, createStyles} from "@mui/styles";

import moment from "moment";
import {AddOrRemoveSongButton} from "../AddOrRemoveSongButton";

interface SongListItemProps {
  song: TrackWithAlbum;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      borderRadius: 5,
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 5,
      paddingBottom: 5,
      display: "flex",
      flexDirection: "row",
      "&:hover": {
        backgroundColor: "#2f2c37",
      },
    },
    avatar: {
      width: 25,
    },
    text: {
      alignContent: "center",
      overflow: "hidden",
      textOverflow: "ellipsis",
      display: "-webkit-box",
      lineClamp: 2,
      boxOrient: "vertical",
    },
    gridItem: {
      flexDirection: "column",
      padding: 10,
      textOverflow: "ellipsis",
    },
  })
);

export const SongListItem = ({song}: SongListItemProps) => {
  const styles = useStyles();
  return (
    <Box
      className={styles.container}
      id={song.id}
      sx={{height: {xs: 100, md: 70}}}
    >
      <Grid container columns={7}>
        <Grid className={styles.gridItem} item xs={1}>
          <Avatar
            variant="square"
            src={song.album.images.length !== 0 ? song.album.images[0].url : ""}
          />
        </Grid>
        <Grid className={styles.gridItem} item xs={3} md={2}>
          <Typography variant="h6" className={styles.text}>
            {song.name}
          </Typography>
        </Grid>
        <Grid className={styles.gridItem} item xs={2}>
          <Typography variant="subtitle2" className={styles.text}>
            {song.album.name}
          </Typography>
        </Grid>
        <Grid
          className={styles.gridItem}
          item
          xs={1}
          sx={{display: {xs: "none", md: "flex"}}}
        >
          <Typography variant="subtitle2">
            {moment.utc(song.duration_ms).format("mm:ss")}
          </Typography>
        </Grid>
        <Grid className={styles.gridItem} item xs={1}>
          <AddOrRemoveSongButton song={song} />
        </Grid>
      </Grid>
    </Box>
  );
};
