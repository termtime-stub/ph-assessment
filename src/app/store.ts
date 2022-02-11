import {configureStore, ThunkAction, Action} from "@reduxjs/toolkit";
import libraryReducer from "./redux/reducers/library.reducer";
import searchReducer from "./redux/reducers/search.reducer";

export const store = configureStore({
  reducer: {
    search: searchReducer,
    library: libraryReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
