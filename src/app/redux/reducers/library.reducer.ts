import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {LibraryState, LibraryPayload} from "../../../types/state";

const initialState: LibraryState = {
  loadingLibrary: false,
  songs: [],
};

export const loadLibrary = createAsyncThunk("library/loadLibrary", async () => {
  const response: LibraryPayload = {
    songs: [],
  };
  // The value we return becomes the `fulfilled` action payload
  return await response;
});

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
      });
  },
});

export default librarySlice.reducer;
