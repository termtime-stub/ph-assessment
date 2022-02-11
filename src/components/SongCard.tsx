import {Button, Theme} from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

import {makeStyles, createStyles} from "@mui/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cardContainer: {
      backgroundColor: "#262626",
      width: "18vw",
      // height: "400px",
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
      padding: "16px",
      borderRadius: "20px",
      height: "18vw",
      objectFit: "contain",
      backgroundSize: "contain",
    },
    cardTitle: {
      marginLeft: "8px",
      fontWeight: "bold",
      fontSize: theme.typography.subtitle1.fontSize!,
    },
    cardSubtitle: {
      marginLeft: "8px",
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
      <Box>
        <CardMedia
          component="img"
          className={styles.cardImage}
          src={song.image}
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
          {song.isInLibrary ? (
            <Button color="error">Remove from library</Button>
          ) : (
            <Button color="secondary">Save to library</Button>
          )}
        </CardContent>
      </Box>
    </Card>
  );
};
