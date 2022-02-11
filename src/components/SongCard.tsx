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
      sx={{display: "flex", flexDirection: "column"}}
      className={styles.cardContainer}
    >
      <Box>
        <CardMedia
          component="img"
          sx={{width: 225}}
          src={song.image}
          alt={song.title}
        />
      </Box>
      <Box sx={{display: "flex", flexDirection: "column"}}>
        <CardContent sx={{flex: "1 0 auto"}}>
          <Typography component="div" variant="h5">
            {song.title}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
          >
            {song.artist}
          </Typography>
          <Button>Save to library</Button>
        </CardContent>
      </Box>
    </Card>
  );
};
