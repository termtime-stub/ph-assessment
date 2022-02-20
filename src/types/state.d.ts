import {SerializedError} from "@reduxjs/toolkit";

interface BasePayload {
  error?: Error | string;
}

interface BaseState {
  error?: Error | SerializedError | string;
}

// Search Reducer
export interface SearchState extends BaseState {
  query: string;
  results: TrackWithAlbum[];
  newReleases: TrackWithAlbum[];
  loadingNewReleases: boolean;
  loadingSearch: boolean;
}

export interface SearchPayload extends BasePayload {
  results: TrackWithAlbum[];
  query?: string;
}

// Library Reducer
export interface LibraryState extends BaseState {
  songs: TrackWithAlbum[];
  loadingLibrary: boolean;
  loadingRemove: boolean;
}

export interface LibraryPayload extends BasePayload {
  songs?: TrackWithAlbum[];
  modifiedSong?: TrackWithAlbum;
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
