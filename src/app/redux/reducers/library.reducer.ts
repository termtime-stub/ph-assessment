import {User} from "@auth0/auth0-react";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {LibraryState, LibraryPayload} from "../../../types/state";
import {RootState} from "../../store";
import {getNewReleasesAction, searchSpotifyAction} from "./search.reducer";

const initialState: LibraryState = {
  loadingLibrary: false,
  songs: [],
  loadingRemove: false,
};

export const loadLibrary = createAsyncThunk("library/loadLibrary", async () => {
  const response: LibraryPayload = {
    songs: [],
  };

  return await response;
});

interface SaveSongProps {
  user: User;
  song: Track;
}

export const saveSongAction = createAsyncThunk(
  "library/saveSong",
  async ({user, song}: SaveSongProps, api) => {
    //TEMP save on redux

    const state = api.getState() as RootState;

    const newSongs: Track[] = [
      {...song, isInLibrary: true},
      ...state.library.songs,
    ];

    const response: LibraryPayload = {
      songs: newSongs,
      modifiedSong: song,
    };

    return await response;
  }
);

export const removeSongAction = createAsyncThunk(
  "library/removeSong",
  async ({user, song}: SaveSongProps, api) => {
    const state = api.getState() as RootState;

    const newSongs = [...state.library.songs];

    newSongs.splice(
      newSongs.findIndex((s) => s.id === song.id),
      1
    );

    const response: LibraryPayload = {
      songs: newSongs,
      modifiedSong: song,
    };

    return await response;
  }
);

const librarySlice = createSlice({
  name: "search",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadLibrary.pending, (state) => {
        state.loadingLibrary = true;
      })
      .addCase(loadLibrary.fulfilled, (state, action) => {
        state.songs = action.payload.songs!;
        state.loadingLibrary = false;
      })
      .addCase(loadLibrary.rejected, (state, action) => {
        state.loadingLibrary = false;
        state.error = action.error;
      })
      ///
      .addCase(removeSongAction.pending, (state) => {
        state.loadingRemove = true;
      })
      .addCase(removeSongAction.fulfilled, (state, action) => {
        state.songs = action.payload.songs!;
        state.loadingRemove = false;
      })
      .addCase(removeSongAction.rejected, (state, action) => {
        state.loadingRemove = false;
        state.error = action.error;
      })
      ///
      .addCase(saveSongAction.fulfilled, (state, action) => {
        state.songs = action.payload.songs!;
      })
      .addCase(saveSongAction.rejected, (state, action) => {
        state.error = action.error;
      })
      // Save songs gotten from search and new release to keep track of them
      .addCase(searchSpotifyAction.fulfilled, (state, action) => {
        const songsToAdd = action.payload.results.filter(
          (s) => state.songs.findIndex((s2) => s2.id === s.id) === -1
        );
        state.songs = [...songsToAdd, ...state.songs];
      })
      .addCase(getNewReleasesAction.fulfilled, (state, action) => {
        const songsToAdd = action.payload.results.filter(
          (s) => state.songs.findIndex((s2) => s2.id === s.id) === -1
        );

        state.songs = [...songsToAdd, ...state.songs];
      });
  },
});

export default librarySlice.reducer;
