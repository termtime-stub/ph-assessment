import {Favorite, FavoriteBorder} from "@mui/icons-material";
import {Box, IconButton} from "@mui/material";

import {makeStyles, createStyles} from "@mui/styles";

interface AddOrRemoveSongButtonProps {
  song: Track;
}

export const AddOrRemoveSongButton = ({song}: AddOrRemoveSongButtonProps) => {
  if (song.isInLibrary) {
    return (
      <Box>
        <IconButton size="medium" color="error">
          <Favorite />
        </IconButton>
      </Box>
    );
  } else {
    return (
      <Box>
        <IconButton size="medium" color="secondary">
          <FavoriteBorder />
        </IconButton>
      </Box>
    );
  }
};
