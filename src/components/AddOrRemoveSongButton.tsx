import {Favorite, FavoriteBorder} from "@mui/icons-material";
import {Box, IconButton} from "@mui/material";
import {useAppDispatch} from "../app/hooks";
import {useAuth0} from "@auth0/auth0-react";
import {
  removeSongAction,
  saveSongAction,
} from "../app/redux/reducers/library.reducer";

interface AddOrRemoveSongButtonProps {
  song: Track;
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
        <IconButton size="medium" color="secondary" onClick={removeSong}>
          <Favorite />
        </IconButton>
      </Box>
    );
  } else {
    return (
      <Box>
        <IconButton size="medium" color="secondary" onClick={saveSong}>
          <FavoriteBorder />
        </IconButton>
      </Box>
    );
  }
};
