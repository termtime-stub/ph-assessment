import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {SearchPayload, SearchState} from "../../../types/state";
import axios from "axios";
import {SpotifyService} from "../../../services/SpotifyService";
import {User} from "@auth0/auth0-react";
import {removeSongAction, saveSongAction} from "./library.reducer";
import {RootState} from "../../store";

const initialState: SearchState = {
  query: "",
  loadingSearch: false,
  results: [],
  loadingNewReleases: false,
  newReleases: [],
};

export const searchSpotifyAction = createAsyncThunk(
  "search/searchSpotify",
  async ({user, query}: SearchSpotifyActionParams, api) => {
    const endpoint = `https://dev-kxznetwf.us.auth0.com/api/v2/users/${encodeURIComponent(
      user?.sub ?? ""
    )}`;

    const spotifyTokenRes = await axios.get<Auth0UserResponse>(endpoint, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_AUTH0_IDENTITY_MANAGER_TOKEN}`,
      },
    });

    if (!spotifyTokenRes) {
      throw new Error("Could not get spotify token");
    }

    const spotifyToken = spotifyTokenRes.data.identities[0].access_token;
    const refreshToken = spotifyTokenRes.data.identities[0].refresh_token;

    const res = await new SpotifyService().search(
      query,
      spotifyToken,
      refreshToken
    );

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
  }
);

export const getNewReleasesAction = createAsyncThunk(
  "search/getNewReleases",
  async (user: User, api) => {
    const endpoint = `https://dev-kxznetwf.us.auth0.com/api/v2/users/${encodeURIComponent(
      user?.sub ?? ""
    )}`;

    const spotifyTokenRes = await axios.get<Auth0UserResponse>(endpoint, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_AUTH0_IDENTITY_MANAGER_TOKEN}`,
      },
    });

    if (!spotifyTokenRes) {
      throw new Error("Could not get spotify token");
    }

    const spotifyToken = spotifyTokenRes.data.identities[0].access_token;
    const refreshToken = spotifyTokenRes.data.identities[0].refresh_token;

    const res = await new SpotifyService().getNewReleases(
      spotifyToken,
      refreshToken
    );

    const state = api.getState() as RootState;
    const librarySongs = state.library.songs;

    const syncedItems = res?.items.map((s) =>
      syncUpdateFromSearch(s, librarySongs)
    );

    const response: SearchPayload = {
      results: syncedItems ?? [],
    };
    // The value we return becomes the `fulfilled` action payload
    return await response;
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
        state.error = action.error;
      })
      .addCase(getNewReleasesAction.pending, (state) => {
        state.loadingNewReleases = true;
      })
      .addCase(getNewReleasesAction.fulfilled, (state, action) => {
        state.newReleases = action.payload.results;

        state.loadingNewReleases = false;
      })
      .addCase(getNewReleasesAction.rejected, (state, action) => {
        state.error = action.error;
        state.loadingNewReleases = false;
      })
      //Save and remove song from library
      .addCase(removeSongAction.fulfilled, (state, action) => {
        syncUpdateFromLibrary(
          action.payload.modifiedSong!,
          state.newReleases,
          state.results,
          true
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
  songToSearch: Track,
  newReleases: Track[],
  searchResults: Track[],
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
  recentlyFetchedSong: Track,
  librarySongs: Track[]
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
