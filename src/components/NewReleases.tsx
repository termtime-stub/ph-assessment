import {useAuth0} from "@auth0/auth0-react";
import {useNavigate} from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Theme,
  Link,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Card,
} from "@mui/material";

import {makeStyles, createStyles} from "@mui/styles";
import {SongCard} from "./SongCard";
import {useAppDispatch, useAppSelector} from "../app/hooks";

const useStyles = makeStyles((theme: Theme) => createStyles({}));

export const NewReleases = () => {
  //   const {newSongs} = useAppSelector((state) => state.songs);
  const newSongs: SongMetadata[] = [
    {
      title: "A head full of dreams",
      image:
        "https://upload.wikimedia.org/wikipedia/en/3/3d/Coldplay_-_A_Head_Full_of_Dreams.png",
      artist: "Coldplay",
      id: "1",
    },
  ];
  return (
    <Box>
      <Typography variant="h3">New Releases</Typography>
      <List>
        {newSongs.map((s) => (
          <ListItem disablePadding>
            <SongCard song={s} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
