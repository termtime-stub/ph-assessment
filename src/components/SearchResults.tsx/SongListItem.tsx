import {Avatar, Button, Grid, Theme} from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

import {makeStyles, createStyles} from "@mui/styles";

import moment from "moment";
import {AddOrRemoveSongButton} from "../AddOrRemoveSongButton";

interface SongListItemProps {
  song: SongMetadata;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 5,
      paddingBottom: 5,
      height: 70,
      display: "flex",
      flexDirection: "row",
      transitionDuration: "0.2s",
      "&:hover": {
        backgroundColor: "#2f2c37",
      },
    },
    avatar: {
      width: 25,
    },
    title: {
      display: "flex",
      alignContent: "center",
    },
  })
);

export const SongListItem = ({song}: SongListItemProps) => {
  const styles = useStyles();
  return (
    <Box className={styles.container}>
      <Grid container columns={7}>
        <Grid item xs={1}>
          <Avatar variant="square" src={song.album?.picture} />
        </Grid>
        <Grid item xs={2}>
          <Typography>{song.title}</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography>{song.album?.title}</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography>
            {moment.utc(song.duration).format("hh:mm:ss")}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <AddOrRemoveSongButton song={song} />
        </Grid>
      </Grid>
    </Box>
  );
};
