import {Box, Grid} from "@mui/material";
import {NavBar} from "../../components/NavBar";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {SongCard} from "../../components/NewReleases/SongCard";
import {useAuth0} from "@auth0/auth0-react";
import {useEffect, useState, useCallback} from "react";
import {getLibraryAction} from "../../app/redux/reducers/library.reducer";
import {LoadingSpinner} from "../../components/LoadingSpinner";
import {PlaylistAdd} from "@mui/icons-material";
import {PlaylistCreateFab} from "../../components/PlaylistCreateFab";
import {ExportToSpotifyForm} from "../../components/ExportToSpotifyForm";
import {SpotifyService} from "../../services/Spotify.service";
import {getSpotifyTokenAction} from "../../app/redux/reducers/auth.reducer";
import {useSnackbar} from "notistack";

export const LibraryPage = () => {
  const {songs, loadingLibrary} = useAppSelector((state) => state.library);
  const {spotifyToken} = useAppSelector((state) => state.auth);
  const [isSpotifyFormOpen, setIsSpotifyFormOpen] = useState(false);
  const {enqueueSnackbar} = useSnackbar();
  const [playlistName, setPlaylistName] = useState("");

  const {user} = useAuth0();
  const dispatch = useAppDispatch();

  const createPlaylist = useCallback(
    async (playlistName) => {
      try {
        if (user?.sub) {
          await dispatch(getSpotifyTokenAction({user}));

          const spotifyUID = user.sub?.substring(user.sub.lastIndexOf(":") + 1);

          const redirectUrl = await SpotifyService.createPlaylistAndAddTracks(
            songs,
            playlistName,
            spotifyUID,
            spotifyToken!
          );

          window.open(redirectUrl, "_blank");

          enqueueSnackbar("Playlist exported successfully!", {
            variant: "success",
          });

          setPlaylistName("");
          setIsSpotifyFormOpen(false);
        }
      } catch (error) {
        enqueueSnackbar("Playlist could not be saved.", {
          variant: "error",
        });
      }
    },
    [dispatch, enqueueSnackbar, songs, spotifyToken, user]
  );

  useEffect(() => {
    if (user) {
      dispatch(getLibraryAction({user}));
    }
  }, [dispatch, user]);

  return (
    <>
      <Box>
        <NavBar />
        <Grid container columns={{xs: 4, sm: 8, md: 12, lg: 12}}>
          {loadingLibrary ? (
            <LoadingSpinner />
          ) : (
            songs
              .filter((s) => s.isInLibrary)
              .map((s) => (
                <Grid item xs={6} sm={4} md={4} lg={3} key={s.id}>
                  <SongCard track={s} />
                </Grid>
              ))
          )}
        </Grid>
      </Box>
      <Box>
        <PlaylistCreateFab
          onClick={() => setIsSpotifyFormOpen(true)}
          icon={<PlaylistAdd />}
          tooltipText="Export to Spotify"
        />
      </Box>
      <ExportToSpotifyForm
        playlistName={playlistName}
        setPlaylistName={setPlaylistName}
        open={isSpotifyFormOpen}
        onClose={() => setIsSpotifyFormOpen(false)}
        onCreatePlaylist={createPlaylist}
      />
    </>
  );
};
