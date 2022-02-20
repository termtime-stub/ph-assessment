import {User} from "@auth0/auth0-react";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {LibraryState, LibraryPayload} from "../../../types/state";
import {RootState} from "../../store";
import {getNewReleasesAction, searchSpotifyAction} from "./search.reducer";
import {DataPersistenceService} from "../../../services/DataPersistenceService";

const initialState: LibraryState = {
  loadingLibrary: false,
  songs: [],
  loadingRemove: false,
};

export const loadLibrary = createAsyncThunk("library/loadLibrary", async () => {
  const response: LibraryPayload = {
    songs: [],
  };

  return response;
});

interface SaveSongProps {
  user: User;
  song: Track;
}

export const saveSongAction = createAsyncThunk(
  "library/saveSong",
  async ({user, song}: SaveSongProps, api) => {
    const state = api.getState() as RootState;

    const existingSongIndex = state.library.songs.findIndex(
      (s) => s.id === song.id
    );

    let modifiedSong;
    // let newLibrarySongState;

    if (existingSongIndex === -1) {
      // Song is new, add to firestore
      modifiedSong = await DataPersistenceService.saveSongInFirestore(
        song,
        user
      );
    } else {
      // Song already exists, update state in firestore
      modifiedSong = await DataPersistenceService.updateSongLibraryAddStatus(
        song,
        user,
        false
      );
    }

    const response: LibraryPayload = {
      modifiedSong,
    };

    return response;
  }
);

export const removeSongAction = createAsyncThunk(
  "library/removeSong",
  async ({user, song}: SaveSongProps, api) => {
    const state = api.getState() as RootState;
    const indexOfSong = state.library.songs.findIndex((s) => s.id === song.id);

    if (indexOfSong === -1) {
      // Song not found, send back current state.

      //TODO: get latest state of this song from firestore and send that one back instead, if that fails, then return error
      const response: LibraryPayload = {
        modifiedSong: song,
      };

      return response;
    }

    // Sync changes to firestore
    const modifiedSong =
      await DataPersistenceService.updateSongLibraryAddStatus(
        song,
        user,
        false
      );

    const response: LibraryPayload = {
      modifiedSong,
    };

    return await response;
  }
);

const librarySlice = createSlice({
  name: "library",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadLibrary.pending, (state) => {
        state.loadingLibrary = true;
        state.error = undefined;
      })
      .addCase(loadLibrary.fulfilled, (state, action) => {
        state.songs = action.payload.songs!;
        state.loadingLibrary = false;
      })
      .addCase(loadLibrary.rejected, (state, action) => {
        state.loadingLibrary = false;
        state.error =
          "Your library could not be loaded, please try again later.";
      })
      ///
      .addCase(removeSongAction.pending, (state) => {
        state.loadingRemove = true;
        state.error = undefined;
      })
      .addCase(removeSongAction.fulfilled, (state, action) => {
        const modifiedSong = action.payload.modifiedSong!;
        const indexOfSong = state.songs.findIndex(
          (s) => s.id === modifiedSong.id
        );

        let newSongState;
        if (indexOfSong === -1) {
          // If the action resulted in no changes, return same state
          newSongState = state.songs;
        } else {
          // Otherwise update the song in the library
          newSongState = [...state.songs];
          newSongState.splice(indexOfSong, 1, modifiedSong);
        }

        state.songs = newSongState;
        state.loadingRemove = false;
      })
      .addCase(removeSongAction.rejected, (state, action) => {
        state.loadingRemove = false;
        state.error =
          "Could not remove the song from your library, please try again later.";
      })
      ///
      .addCase(saveSongAction.fulfilled, (state, action) => {
        const modifiedSong = action.payload.modifiedSong!;

        const indexOfSong = state.songs.findIndex(
          (s) => s.id === modifiedSong.id
        );

        let newSongState;
        if (indexOfSong === -1) {
          // If the song was just added to the library, add it to the start of the library
          newSongState = [modifiedSong, ...state.songs];
        } else {
          // If the song already existed in the state, move it to the first position
          newSongState = [...state.songs];
          newSongState.splice(indexOfSong, 1);
          newSongState.unshift(modifiedSong);
        }

        state.songs = newSongState;
      })
      .addCase(saveSongAction.rejected, (state, action) => {
        state.error =
          "Could not add the song to your library, please try again later.";
      });
    // Save songs gotten from search and new release to keep track of them
    // .addCase(searchSpotifyAction.fulfilled, (state, action) => {
    //   const songsToAdd = action.payload.results.filter(
    //     (s) => state.songs.findIndex((s2) => s2.id === s.id) === -1
    //   );
    //   state.songs = [...songsToAdd, ...state.songs];
    // })
    // .addCase(getNewReleasesAction.fulfilled, (state, action) => {
    //   const songsToAdd = action.payload.results.filter(
    //     (s) => state.songs.findIndex((s2) => s2.id === s.id) === -1
    //   );

    //   state.songs = [...songsToAdd, ...state.songs];
    // });
  },
});

export default librarySlice.reducer;
