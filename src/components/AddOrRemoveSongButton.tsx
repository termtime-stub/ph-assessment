import {Favorite, FavoriteBorder} from "@mui/icons-material";
import {Box, IconButton, Tooltip, Typography} from "@mui/material";
import {useAppDispatch} from "../app/hooks";
import {useAuth0} from "@auth0/auth0-react";
import {
  removeSongAction,
  saveSongAction,
} from "../app/redux/reducers/library.reducer";

interface AddOrRemoveSongButtonProps {
  song: TrackWithAlbum;
}

export const AddOrRemoveSongButton = ({song}: AddOrRemoveSongButtonProps) => {
  const {user} = useAuth0();
  const dispatch = useAppDispatch();

  const saveSong = () => {
    if (user) {
      dispatch(saveSongAction({user, song}));
    }
  };

  const removeSong = () => {
    if (user) {
      dispatch(removeSongAction({user, song}));
    }
  };

  if (song.isInLibrary) {
    return (
      <Box>
        <Tooltip
          title={
            <Typography variant="body1">Remove from my library</Typography>
          }
        >
          <IconButton size="medium" color="secondary" onClick={removeSong}>
            <Favorite />
          </IconButton>
        </Tooltip>
      </Box>
    );
  } else {
    return (
      <Box>
        <Tooltip
          title={<Typography variant="body1">Add to my library</Typography>}
        >
          <IconButton size="medium" color="secondary" onClick={saveSong}>
            <FavoriteBorder />
          </IconButton>
        </Tooltip>
      </Box>
    );
  }
};
