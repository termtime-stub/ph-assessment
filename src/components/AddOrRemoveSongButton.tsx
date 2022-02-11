import {Button} from "@mui/material";

interface AddOrRemoveSongButtonProps {
  song: SongMetadata;
}

export const AddOrRemoveSongButton = ({song}: AddOrRemoveSongButtonProps) => {
  if (song.isInLibrary) {
    return <Button color="error">Remove from library</Button>;
  } else {
    return <Button color="secondary">Save to library</Button>;
  }
};
