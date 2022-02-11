import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {SearchPayload, SearchState} from "../../../types/state";
import axios from "axios";
import {SpotifyService} from "../../../services/SpotifyService";
import {User} from "@auth0/auth0-react";

const initialState: SearchState = {
  query: "",
  loadingSearch: false,
  results: [],
  loadingNewReleases: false,
  newReleases: [],
};

export const searchSpotify = createAsyncThunk(
  "search/searchSpotify",
  async ({user, query}: SearchSpotifyActionParams) => {
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

    const response: SearchPayload = {
      results: res?.items ?? [],
      query,
    };
    // The value we return becomes the `fulfilled` action payload
    return await response;
  }
);

export const getNewReleases = createAsyncThunk(
  "search/getNewReleases",
  async (user: User) => {
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

    const response: SearchPayload = {
      results: res?.items ?? [],
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
      .addCase(searchSpotify.pending, (state) => {
        state.loadingSearch = true;
      })
      .addCase(searchSpotify.fulfilled, (state, action) => {
        state.query = action.payload.query!;
        state.results = action.payload.results;
      })
      .addCase(searchSpotify.rejected, (state, action) => {
        state.loadingSearch = false;
        state.error = action.error;
      })
      .addCase(getNewReleases.pending, (state) => {
        state.loadingNewReleases = true;
      })
      .addCase(getNewReleases.fulfilled, (state, action) => {
        state.newReleases = action.payload.results;
        state.loadingNewReleases = false;
      })
      .addCase(getNewReleases.rejected, (state, action) => {
        state.error = action.error;
        state.loadingNewReleases = false;
      });
  },
});

export default searchSlice.reducer;
