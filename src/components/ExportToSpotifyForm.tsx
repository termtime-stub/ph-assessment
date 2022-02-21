import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import {useState, useCallback} from "react";

interface ExportToSpotifyFormProps {
  open: boolean;
  onClose: () => void;
  onCreatePlaylist: (playlistName: string) => void;
}
export const ExportToSpotifyForm = ({
  open,
  onClose,
  onCreatePlaylist,
}: ExportToSpotifyFormProps) => {
  const [playlistName, setPlaylistName] = useState("");

  const handleKeyPress = useCallback(
    (e) => {
      const ENTER = 13;

      if (e.keyCode === ENTER) {
        onCreatePlaylist(playlistName);
        setPlaylistName("");
      }
    },
    [onCreatePlaylist, playlistName]
  );

  return (
    <div>
      <Dialog open={open} onClose={onClose} onKeyUp={handleKeyPress}>
        <DialogTitle>Export library to Spotify</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can export this song library to a single spotify playlist.
            Please enter the name for the playlist
          </DialogContentText>
          <TextField
            margin="dense"
            id="name"
            autoFocus={true}
            label="Playlist name"
            // Disable autocomplete
            autoComplete="new-password"
            type="text"
            fullWidth
            variant="standard"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={() => onCreatePlaylist(playlistName)}>Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
