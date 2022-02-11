import {Theme} from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

import {makeStyles, createStyles} from "@mui/styles";
import {AddOrRemoveSongButton} from "../AddOrRemoveSongButton";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cardContainer: {
      backgroundColor: "#262626",
      margin: "3vw",
      height: "45vh",
      width: "18vw",
      boxShadow: "10px 10px 37px -8px rgba(0,0,0,0.75)",
      borderRadius: "10px",
      userSelect: "none",
      "&:hover": {
        backgroundColor: "#303030",
        transform: "scale(1.02)",
      },
    },
    cardImage: {
      borderRadius: "10px",
      objectFit: "cover",
      backgroundSize: "cover",
      boxShadow: "0px 0px 36px -8px rgba(0,0,0,0.75)",
    },
    cardTitle: {
      marginLeft: "8px",
      fontWeight: "bold",
      fontSize: theme.typography.subtitle1.fontSize!,
    },
    cardSubtitle: {
      marginLeft: "8px",
    },
    favoriteButtonContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    textContainer: {
      height: "10vh",
    },
  })
);

interface SongCardProps {
  song: Track;
}
export const SongCard = ({song}: SongCardProps) => {
  const styles = useStyles();
  return (
    <Card
      className={styles.cardContainer}
      sx={{transition: "all 0.2s ease-out"}}
      id={song.id}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          marginTop: 2,
          marginLeft: 2,
          marginRight: 2,
        }}
      >
        <CardMedia
          component="img"
          className={styles.cardImage}
          src={song.album?.images.length !== 0 ? song.album?.images[0].url : ""}
          alt={song.name}
        />
      </Box>
      <Box sx={{display: "flex", flexDirection: "column"}}>
        <CardContent>
          <Box className={styles.textContainer}>
            <Typography
              component="div"
              variant="h6"
              className={styles.cardTitle}
            >
              {song.name}
            </Typography>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              component="div"
              className={styles.cardSubtitle}
            >
              {song.artists.length !== 0 ? song.artists[0].name : ""}
            </Typography>
          </Box>
          <Box className={styles.favoriteButtonContainer}>
            <AddOrRemoveSongButton song={song} />
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
};
