import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {SearchPayload, SearchState} from "../../../types/state";
import {SpotifyService} from "../../../services/Spotify.service";
import {User} from "@auth0/auth0-react";
import {removeSongAction, saveSongAction} from "./library.reducer";
import {RootState} from "../../store";
import {logoutFromDispatch, getSpotifyTokenAction} from "./auth.reducer";
import {thunkErrorHandler} from "../../../utils";

const initialState: SearchState = {
  query: "",
  loadingSearch: false,
  results: [],
  loadingNewReleases: false,
  newReleases: [],
};

interface SearchSpotifyActionParams {
  user: User;
  query: string;
}

export const searchSpotifyAction = createAsyncThunk(
  "search/searchSpotify",
  async ({user, query}: SearchSpotifyActionParams, api) => {
    try {
      // Keep token updated
      await api.dispatch(getSpotifyTokenAction({user}));

      const {spotifyToken, refreshToken} = (api.getState() as RootState).auth;

      if (!spotifyToken || !refreshToken) {
        api.dispatch(logoutFromDispatch());
        throw Error("You are not signed in, please sign in again");
      }

      const res = await SpotifyService.search(query, spotifyToken);

      const state = api.getState() as RootState;
      const librarySongs = state.library.songs;

      const syncedItems = res?.items.map((s) =>
        syncUpdateFromSearch(s, librarySongs)
      );

      const response: SearchPayload = {
        results: syncedItems ?? [],
        query,
      };
      // The value we return becomes the `fulfilled` action payload
      return await response;
    } catch (error) {
      const e = error as Error;
      return thunkErrorHandler(e, api.rejectWithValue);
    }
  }
);

export const getNewReleasesAction = createAsyncThunk(
  "search/getNewReleases",
  async (user: User, api) => {
    try {
      await api.dispatch(getSpotifyTokenAction({user}));

      const {spotifyToken, refreshToken} = (api.getState() as RootState).auth;

      if (!spotifyToken || !refreshToken) {
        api.dispatch(logoutFromDispatch());
        throw Error("You are not signed in, please sign in again");
      }

      const res = await SpotifyService.getNewReleases(spotifyToken);

      const state = api.getState() as RootState;
      const librarySongs = state.library.songs;

      const syncedItems = res?.items.map((s) =>
        syncUpdateFromSearch(s, librarySongs)
      );

      const response: SearchPayload = {
        results: syncedItems ?? [],
      };

      return await response;
    } catch (error) {
      const e = error as Error;
      return thunkErrorHandler(e, api.rejectWithValue);
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchSpotifyAction.pending, (state) => {
        state.loadingSearch = true;
      })
      .addCase(searchSpotifyAction.fulfilled, (state, action) => {
        state.query = action.payload.query!;
        state.results = action.payload.results;
        state.loadingSearch = false;
      })
      .addCase(searchSpotifyAction.rejected, (state, action) => {
        state.loadingSearch = false;
        state.error = "Error getting search results.";
      })
      .addCase(getNewReleasesAction.pending, (state) => {
        state.loadingNewReleases = true;
      })
      .addCase(getNewReleasesAction.fulfilled, (state, action) => {
        state.newReleases = action.payload.results;

        state.loadingNewReleases = false;
      })
      .addCase(getNewReleasesAction.rejected, (state, action) => {
        state.error = "Could not get new releases.";
        state.loadingNewReleases = false;
      })
      //Save and remove song from library
      .addCase(removeSongAction.fulfilled, (state, action) => {
        syncUpdateFromLibrary(
          action.payload.modifiedSong!,
          state.newReleases,
          state.results,
          false
        );
      })
      .addCase(saveSongAction.fulfilled, (state, action) => {
        syncUpdateFromLibrary(
          action.payload.modifiedSong!,
          state.newReleases,
          state.results,
          true
        );
      });
  },
});

export const syncUpdateFromLibrary = (
  songToSearch: TrackWithAlbum,
  newReleases: TrackWithAlbum[],
  searchResults: TrackWithAlbum[],
  newLibraryState: boolean
) => {
  const indexInNewReleases = newReleases.findIndex(
    (s) => s.id === songToSearch.id
  );
  const indexInSearchResults = searchResults.findIndex(
    (s) => s.id === songToSearch.id
  );

  if (indexInNewReleases !== -1) {
    newReleases[indexInNewReleases] = {
      ...newReleases[indexInNewReleases],
      isInLibrary: newLibraryState,
    };
  }

  if (indexInSearchResults !== -1) {
    searchResults[indexInSearchResults] = {
      ...searchResults[indexInSearchResults],
      isInLibrary: newLibraryState,
    };
  }
};

export const syncUpdateFromSearch = (
  recentlyFetchedSong: TrackWithAlbum,
  librarySongs: TrackWithAlbum[]
) => {
  let syncedSong = {...recentlyFetchedSong};

  const indexInSongLibrary = librarySongs.findIndex(
    (s) => s.id === recentlyFetchedSong.id
  );

  if (indexInSongLibrary !== -1) {
    syncedSong = {
      ...syncedSong,
      isInLibrary: librarySongs[indexInSongLibrary].isInLibrary,
    };
  }

  return syncedSong;
};

export default searchSlice.reducer;
