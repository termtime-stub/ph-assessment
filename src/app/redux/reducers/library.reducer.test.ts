import {User} from "@auth0/auth0-react";
import libraryReducer, {
  removeSongAction,
  saveSongAction,
} from "./library.reducer";
import {LibraryPayload, LibraryState} from "../../../types/state";
import {RootState} from "../../store";
import {getNewReleasesAction, searchSpotifyAction} from "./search.reducer";

import {
  Auth0Service,
  GetSpotifyTokenResponse,
} from "../../../services/Auth0.service";
import {SpotifyService} from "../../../services/Spotify.service";
import * as AuthReducer from "./auth.reducer";
import {DataPersistenceService} from "../../../services/DataPersistenceService";

const testArtist: Artist = {
  id: "1",
  name: "testArtist",
  type: "test",
};

const testAlbum: Album = {
  album_type: "test",
  artists: [testArtist],
  external_urls: {
    spotify: "http://open.spotify.com",
  },
  id: "1",
  images: [],
  name: "The test album",
};

const testSong1: TrackWithAlbum = {
  album: testAlbum,
  artists: [testArtist],
  duration_ms: 50000,
  id: "1",
  isInLibrary: false,
  isNewRelease: false,
  name: "The test track",
  external_url: {},
  uri: "",
};

const testSong2: TrackWithAlbum = {
  album: testAlbum,
  artists: [testArtist],
  duration_ms: 30000,
  id: "2",
  isInLibrary: false,
  isNewRelease: false,
  name: "The test track #2",
  external_url: {},
  uri: "",
};

const testSong3: TrackWithAlbum = {
  album: testAlbum,
  artists: [testArtist],
  duration_ms: 35000,
  id: "3",
  isInLibrary: false,
  isNewRelease: false,
  name: "The test track #3",
  external_url: {},
  uri: "",
};

jest.mock("../../../services/Spotify.service");
jest.mock("axios");

describe("Library Reducer - ", () => {
  beforeAll(() => {
    jest.spyOn(AuthReducer, "getSpotifyTokenAction").mockImplementation(() => {
      return undefined as any;
    });
  });

  describe("saveSongAction", () => {
    let dispatch: any;
    let getState: () => unknown;

    beforeEach(() => {
      dispatch = jest.fn();
      getState = jest.fn();
    });

    it("should return the song that was modified in the payload", async () => {
      const user: User = {};
      const songToAdd = testSong3;
      const initialState: RootState = {
        auth: {
          refreshToken: "refreshTokenTest",
          spotifyToken: "spotifyTokenTest",
        },
        library: {
          songs: [],
          loadingLibrary: false,
          loadingRemove: false,
        },
        search: {
          loadingNewReleases: false,
          loadingSearch: false,
          newReleases: [],
          query: "",
          results: [],
        },
      };

      getState = jest.fn(() => {
        return initialState;
      });

      jest
        .spyOn(DataPersistenceService, "updateSongLibraryAddStatus")
        .mockResolvedValueOnce({
          ...songToAdd,
          isInLibrary: true,
        });

      jest
        .spyOn(DataPersistenceService, "saveSongInFirestore")
        .mockResolvedValueOnce({
          ...songToAdd,
          isInLibrary: true,
        });

      const action = saveSongAction({user, song: songToAdd});

      const result = await action(dispatch, getState, undefined);

      const actual = result.payload as LibraryPayload;

      expect(actual.modifiedSong!.id).toEqual(songToAdd.id);
    });
  });

  describe("removeSongAction", () => {
    let dispatch: any;
    let getState: () => unknown;

    beforeEach(() => {
      dispatch = jest.fn();
      getState = jest.fn();
    });

    it("should return the song that was removed in the payload", async () => {
      const songList = [testSong1, testSong2, testSong3];
      const user: User = {};
      const songToRemove = testSong3;
      const initialState: RootState = {
        auth: {
          refreshToken: "refreshTokenTest",
          spotifyToken: "spotifyTokenTest",
        },
        library: {
          songs: songList,
          loadingLibrary: false,
          loadingRemove: false,
        },
        search: {
          loadingNewReleases: false,
          loadingSearch: false,
          newReleases: [],
          query: "",
          results: [],
        },
      };

      getState = jest.fn(() => {
        return initialState;
      });

      jest
        .spyOn(DataPersistenceService, "updateSongLibraryAddStatus")
        .mockResolvedValueOnce({
          ...songToRemove,
          isInLibrary: false,
        });

      jest
        .spyOn(DataPersistenceService, "saveSongInFirestore")
        .mockResolvedValueOnce({
          ...songToRemove,
          isInLibrary: false,
        });

      const action = removeSongAction({user, song: songToRemove});

      const result = await action(dispatch, getState, undefined);

      const actual = result.payload as LibraryPayload;

      expect(actual.modifiedSong!.id).toEqual(songToRemove.id);
    });

    it("should return the song as removed if the song to be removed is not found in the library", async () => {
      const songList: TrackWithAlbum[] = [testSong1, testSong2];
      const user: User = {};
      const songToRemove = testSong3;
      const initialState: RootState = {
        auth: {
          refreshToken: "refreshTokenTest",
          spotifyToken: "spotifyTokenTest",
        },
        library: {
          songs: songList,
          loadingLibrary: false,
          loadingRemove: false,
        },
        search: {
          loadingNewReleases: false,
          loadingSearch: false,
          newReleases: [],
          query: "",
          results: [],
        },
      };

      getState = jest.fn(() => {
        return initialState;
      });

      jest
        .spyOn(DataPersistenceService, "updateSongLibraryAddStatus")
        .mockResolvedValueOnce({
          ...songToRemove,
          isInLibrary: false,
        });

      jest
        .spyOn(DataPersistenceService, "saveSongInFirestore")
        .mockResolvedValueOnce({
          ...songToRemove,
          isInLibrary: false,
        });

      const action = removeSongAction({user, song: songToRemove});

      const result = await action(dispatch, getState, undefined);

      const actual = result.payload as LibraryPayload;

      const expected: TrackWithAlbum = {...songToRemove, isInLibrary: false};

      expect(actual.modifiedSong).toEqual(expected);
    });
  });

  describe("searchSpotifyAction", () => {
    let dispatch: any;
    let getState: () => unknown;

    beforeEach(() => {
      dispatch = jest.fn();
      getState = jest.fn();
    });

    it("should not duplicate songs that already exist in the library when searchSpotifyAction is fulfilled", async () => {
      const librarySongs = [testSong1];
      const user: User = {};

      const libraryReducerInitialState: LibraryState = {
        songs: librarySongs,
        loadingLibrary: false,
        loadingRemove: false,
      };

      const rootState: RootState = {
        auth: {
          refreshToken: "refreshTokenTest",
          spotifyToken: "spotifyTokenTest",
        },
        library: libraryReducerInitialState,
        search: {
          loadingNewReleases: false,
          loadingSearch: false,
          newReleases: [],
          query: "test",
          results: [testSong1],
        },
      };

      getState = jest.fn(() => {
        return rootState;
      });

      const spotifyTokens: GetSpotifyTokenResponse = {
        spotifyRefreshToken: "spotifyRefreshToken",
        spotifyToken: "spotifyToken",
        expireDateMs: 1897007435000,
      };

      const spotifySearchResults: TracksWithAlbumResponse = {
        items: [testSong1],
        href: "test",
        next: null,
        limit: 100,
        offset: 0,
        previous: null,
        total: 1,
      };

      const auth0Spy = jest
        .spyOn(Auth0Service, "getSpotifyToken")
        .mockResolvedValue(spotifyTokens);

      const spotifySpy = jest
        .spyOn(SpotifyService, "search")
        .mockResolvedValueOnce(spotifySearchResults);

      const action = searchSpotifyAction({query: "test", user});

      const actual = libraryReducer(
        libraryReducerInitialState,
        await action(dispatch, getState, undefined)
      );

      const expected: LibraryState = {
        ...libraryReducerInitialState,
        songs: [testSong1],
      };

      expect(actual).toEqual(expected);

      auth0Spy.mockRestore();
      spotifySpy.mockRestore();
    });
  });

  describe("getNewReleasesAction", () => {
    let dispatch: any;
    let getState: () => unknown;

    beforeEach(() => {
      dispatch = jest.fn();
      getState = jest.fn();
    });

    it("should not duplicate songs that already exist in the library when getNewReleasesAction is fulfilled", async () => {
      const librarySongs = [testSong1];
      const user: User = {};

      const libraryReducerInitialState: LibraryState = {
        songs: librarySongs,
        loadingLibrary: false,
        loadingRemove: false,
      };

      const rootState: RootState = {
        auth: {
          refreshToken: "refreshTokenTest",
          spotifyToken: "spotifyTokenTest",
        },
        library: libraryReducerInitialState,
        search: {
          loadingNewReleases: false,
          loadingSearch: false,
          newReleases: [testSong1],
          query: "",
          results: [],
        },
      };

      getState = jest.fn(() => {
        return rootState;
      });

      const spotifyTokens: GetSpotifyTokenResponse = {
        spotifyRefreshToken: "spotifyRefreshToken",
        spotifyToken: "spotifyToken",
        expireDateMs: 1897007435000,
      };

      const spotifySearchResults: TracksWithAlbumResponse = {
        items: [testSong1],
        next: null,
        href: "test",
        limit: 100,
        offset: 0,
        previous: null,
        total: 1,
      };

      const auth0Spy = jest
        .spyOn(Auth0Service, "getSpotifyToken")
        .mockResolvedValue(spotifyTokens);

      const spotifySpy = jest
        .spyOn(SpotifyService, "search")
        .mockResolvedValueOnce(spotifySearchResults);

      const action = getNewReleasesAction(user);

      const actual = libraryReducer(
        libraryReducerInitialState,
        await action(dispatch, getState, undefined)
      );

      const expected: LibraryState = {
        ...libraryReducerInitialState,
        songs: [testSong1],
      };

      expect(actual).toEqual(expected);

      auth0Spy.mockRestore();
      spotifySpy.mockRestore();
    });
  });
});
