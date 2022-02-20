import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import moment from "moment";
import {AuthState, AuthPayload} from "../../../types/state";
import {RootState} from "../../store";
import {Auth0Service} from "../../../services/Auth0.service";
import {SpotifyService} from "../../../services/Spotify.service";
import {User} from "@auth0/auth0-react";

const initialState: AuthState = {
  shouldLogOut: false,
};

interface GetSpotifyTokenParams {
  user: User;
}

export const getSpotifyToken = createAsyncThunk(
  "auth/getSpotifyToken",
  async ({user}: GetSpotifyTokenParams, api) => {
    const state = api.getState() as RootState;

    const timeDiff = moment(state.auth.expireDate).diff(moment(), "s");

    const refreshTk = state.auth.refreshToken;

    let data: AuthPayload;

    if (refreshTk) {
      // If the token is about to expire or already expired, refresh token
      if (timeDiff < 60) {
        const newAccessToken = await SpotifyService.refreshSpotifyToken(
          refreshTk
        );

        // get a new refresh token for the new access token
        data = {
          spotifyToken: newAccessToken,
          expireDate: moment().add(1, "hour").toDate(),
        };
      } else {
        data = {
          spotifyToken: state.auth.spotifyToken,
          refreshToken: state.auth.refreshToken,
          expireDate: moment().add(1, "hour").toDate(),
        };
      }
    } else {
      // Token does not exist, get token from Auth0
      // This will happen when the app first starts
      const tkRes = await Auth0Service.getSpotifyToken(user);

      const {spotifyRefreshToken, spotifyToken} = tkRes;

      data = {
        spotifyToken,
        refreshToken: spotifyRefreshToken,
        expireDate: moment().add(1, "hour").toDate(),
      };
    }

    return data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutFromDispatch(state) {
      state.shouldLogOut = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSpotifyToken.pending, (state) => {
        state.error = undefined;
      })
      .addCase(getSpotifyToken.fulfilled, (state, action) => {
        state.error = undefined;

        const {refreshToken, spotifyToken, expireDate} = action.payload;

        state.refreshToken = refreshToken || state.refreshToken;
        state.spotifyToken = spotifyToken || state.spotifyToken;
        state.expireDate = expireDate || state.expireDate;
      });
  },
});

export const {logoutFromDispatch} = authSlice.actions;
export {initialState as authReducerInitialState};
export default authSlice.reducer;
