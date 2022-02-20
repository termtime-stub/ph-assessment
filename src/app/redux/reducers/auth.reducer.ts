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

/**
 * Gets a new token if the specified `currentAccessToken` is soon to expire,
 * otherwise it gets returned.
 * @param timeDiffSeconds
 * @param refreshToken
 * @param currentAccessToken
 * @returns
 */
const getNewTokenIfExpired = async (
  timeDiffSeconds: number,
  refreshToken: string,
  currentAccessToken: string
): Promise<AuthPayload> => {
  if (timeDiffSeconds < 60) {
    const newAccessToken = await SpotifyService.refreshSpotifyToken(
      refreshToken
    );

    // get a new refresh token for the new access token
    return {
      spotifyToken: newAccessToken,
      expireDateMs: moment().add(1, "hour").valueOf(),
    };
  } else {
    return {
      spotifyToken: currentAccessToken,
      refreshToken: refreshToken,
    };
  }
};

export const getSpotifyToken = createAsyncThunk(
  "auth/getSpotifyToken",
  async ({user}: GetSpotifyTokenParams, api) => {
    const state = api.getState() as RootState;

    const timeDiff = moment(state.auth.expireDateMs).diff(moment(), "s");

    const refreshTk = state.auth.refreshToken;
    const currentAccessTk = state.auth.spotifyToken;

    if (refreshTk && currentAccessTk) {
      // If the token is about to expire or already expired, refresh token
      return getNewTokenIfExpired(timeDiff, refreshTk, currentAccessTk);
    } else {
      // Token does not exist, get token from Auth0
      // This will happen when the app first starts
      const tkRes = await Auth0Service.getSpotifyToken(user);

      const {spotifyRefreshToken, spotifyToken, expireDateMs} = tkRes;

      const auth0TokenTimeDiff = moment(expireDateMs).diff(moment(), "s");

      // Check if auth0's token is still valid, if not, refresh
      return getNewTokenIfExpired(
        auth0TokenTimeDiff,
        spotifyRefreshToken,
        spotifyToken
      );
    }
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

        const {refreshToken, spotifyToken, expireDateMs} = action.payload;

        state.refreshToken = refreshToken || state.refreshToken;
        state.spotifyToken = spotifyToken || state.spotifyToken;
        state.expireDateMs = expireDateMs || state.expireDateMs;
      });
  },
});

export const {logoutFromDispatch} = authSlice.actions;
export {initialState as authReducerInitialState};
export default authSlice.reducer;
