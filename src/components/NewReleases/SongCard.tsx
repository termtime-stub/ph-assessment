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
      boxShadow: "10px 10px 37px -8px rgba(0,0,0,0.75)",
      borderRadius: "10px",
      userSelect: "none",
      "&:hover": {
        backgroundColor: "#303030",
        transform: "scale(1.02)",
      },
    },
    cardImage: {
      marginLeft: 8,
      marginRight: 6,
      marginTop: 16,
      borderRadius: "10px",
      width: "16vw",
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
  })
);

interface SongCardProps {
  song: SongMetadata;
}
export const SongCard = ({song}: SongCardProps) => {
  const styles = useStyles();
  return (
    <Card
      className={styles.cardContainer}
      sx={{transition: "all 0.2s ease-out"}}
    >
      <Box sx={{display: "flex", flexDirection: "column"}}>
        <CardMedia
          component="img"
          className={styles.cardImage}
          src={song.album?.picture}
          alt={song.title}
        />
      </Box>
      <Box sx={{display: "flex", flexDirection: "column"}}>
        <CardContent>
          <Typography component="div" variant="h6" className={styles.cardTitle}>
            {song.title}
          </Typography>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            component="div"
            className={styles.cardSubtitle}
          >
            {song.artist}
          </Typography>
          <Box className={styles.favoriteButtonContainer}>
            <AddOrRemoveSongButton song={song} />
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
};
