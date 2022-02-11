import {Avatar, Button, List, Theme} from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

import {makeStyles, createStyles} from "@mui/styles";
import {useAppSelector} from "../../app/hooks";
import {SearchResultHeader} from "./SearchResultHeader";
import {SongListItem} from "./SongListItem";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      marginLeft: 50,
      marginRight: 50,
    },
  })
);

export const SearchResults = () => {
  // const {searchResults} = useAppSelector((state)=> state.songs.search)
  const styles = useStyles();
  const searchResults: SongMetadata[] = [
    {
      title: "A head full of dreams",
      album: {
        picture:
          "https://upload.wikimedia.org/wikipedia/en/3/3d/Coldplay_-_A_Head_Full_of_Dreams.png",
        title: "A head full of dreams",
      },
      artist: "Coldplay",
      id: "1",
      isInLibrary: false,
      duration: 30000,
    },
    {
      title: "A head full of dreams",
      album: {
        picture:
          "https://upload.wikimedia.org/wikipedia/en/3/3d/Coldplay_-_A_Head_Full_of_Dreams.png",
        title: "A head full of dreams",
      },
      artist: "Coldplay",
      id: "1",
      isInLibrary: false,
      duration: 30000,
    },
    {
      title: "A head full of dreams",
      album: {
        picture:
          "https://upload.wikimedia.org/wikipedia/en/3/3d/Coldplay_-_A_Head_Full_of_Dreams.png",
        title: "A head full of dreams",
      },
      artist: "Coldplay",
      id: "1",
      isInLibrary: true,
      duration: 30000,
    },
    {
      title: "A head full of dreams",
      album: {
        picture:
          "https://upload.wikimedia.org/wikipedia/en/3/3d/Coldplay_-_A_Head_Full_of_Dreams.png",
        title: "A head full of dreams",
      },
      artist: "Coldplay",
      id: "1",
      isInLibrary: true,
      duration: 30000,
    },
    {
      title: "A head full of dreams",
      album: {
        picture:
          "https://upload.wikimedia.org/wikipedia/en/3/3d/Coldplay_-_A_Head_Full_of_Dreams.png",
        title: "A head full of dreams",
      },
      artist: "Coldplay",
      id: "1",
      isInLibrary: false,
      duration: 30000,
    },
    {
      title: "A head full of dreams",
      album: {
        picture:
          "https://upload.wikimedia.org/wikipedia/en/3/3d/Coldplay_-_A_Head_Full_of_Dreams.png",
        title: "A head full of dreams",
      },
      artist: "Coldplay",
      id: "1",
      isInLibrary: false,
      duration: 30000,
    },
  ];

  return (
    <Box className={styles.container}>
      <SearchResultHeader />
      <List>
        {searchResults.map((s) => (
          <SongListItem song={s} />
        ))}
      </List>
    </Box>
  );
};
