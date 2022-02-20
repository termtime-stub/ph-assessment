import {SerializedError} from "@reduxjs/toolkit";
import {ActionType} from "../app/redux/constants/actionTypes";

interface BasePayload {
  error?: Error | string;
}

interface BaseState {
  error?: Error | SerializedError | string;
}

// Search Reducer
export interface SearchState extends BaseState {
  query: string;
  results: Track[];
  newReleases: Track[];
  loadingNewReleases: boolean;
  loadingSearch: boolean;
}

export interface SearchPayload extends BasePayload {
  results: Track[];
  query?: string;
}

// Library Reducer
export interface LibraryState extends BaseState {
  songs: Track[];
  loadingLibrary: boolean;
  loadingRemove: boolean;
}

export interface LibraryPayload extends BasePayload {
  songs?: Track[];
  modifiedSong?: Track;
}

// Auth Reducer
export interface AuthState extends BaseState {
  spotifyToken?: string;
  refreshToken?: string;
  expireDateMs?: number;
  shouldLogOut?: boolean;
}

export interface AuthPayload extends BasePayload {
  spotifyToken?: string;
  refreshToken?: string;
  expireDateMs?: number;
}
