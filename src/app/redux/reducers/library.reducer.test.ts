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
} from "../../../services/Auth0Service";
import {SpotifyService} from "../../../services/SpotifyService";

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

const testSong1: Track = {
  album: testAlbum,
  artists: [testArtist],
  duration_ms: 50000,
  id: "1",
  isInLibrary: false,
  isNewRelease: false,
  items: [],
  name: "The test track",
};

const testSong2: Track = {
  album: testAlbum,
  artists: [testArtist],
  duration_ms: 30000,
  id: "2",
  isInLibrary: false,
  isNewRelease: false,
  items: [],
  name: "The test track #2",
};

const testSong3: Track = {
  album: testAlbum,
  artists: [testArtist],
  duration_ms: 35000,
  id: "3",
  isInLibrary: false,
  isNewRelease: false,
  items: [],
  name: "The test track #3",
};

describe("Library Reducer - ", () => {
  describe("saveSongAction", () => {
    let dispatch: any;
    let getState: () => unknown;

    beforeEach(() => {
      dispatch = jest.fn();
      getState = jest.fn();
    });

    it("should return the song list with the new song marked as added to the library", async () => {
      const songList = [testSong1, testSong2];
      const user: User = {};
      const songToAdd = testSong3;
      const initialState: RootState = {
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

      const action = saveSongAction({user, song: songToAdd});

      const result = await action(dispatch, getState, undefined);

      const actual = result.payload as LibraryPayload;

      const expected: Track[] = [
        {...testSong3, isInLibrary: true},
        ...songList,
      ];

      expect(actual.songs).toEqual(expected);
    });

    it("should return the song that was modified in the payload", async () => {
      const user: User = {};
      const songToAdd = testSong3;
      const initialState: RootState = {
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

      const action = saveSongAction({user, song: songToAdd});

      const result = await action(dispatch, getState, undefined);

      const actual = result.payload as LibraryPayload;

      expect(actual.modifiedSong).toEqual(songToAdd);
    });
  });

  describe("removeSongAction", () => {
    let dispatch: any;
    let getState: () => unknown;

    beforeEach(() => {
      dispatch = jest.fn();
      getState = jest.fn();
    });

    it("should return the song list with the new song marked as not added to the library", async () => {
      const songList: Track[] = [
        testSong1,
        testSong2,
        {...testSong3, isInLibrary: true},
      ];
      const user: User = {};
      const songToRemove = testSong3;
      const initialState: RootState = {
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

      const action = removeSongAction({user, song: songToRemove});

      const result = await action(dispatch, getState, undefined);

      const actual = result.payload as LibraryPayload;

      const expected: Track[] = [testSong1, testSong2, testSong3];

      expect(actual.songs).toEqual(expected);
    });

    it("should return the song that was modified in the payload", async () => {
      const songList = [testSong1, testSong2, testSong3];
      const user: User = {};
      const songToRemove = testSong3;
      const initialState: RootState = {
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

      const action = removeSongAction({user, song: songToRemove});

      const result = await action(dispatch, getState, undefined);

      const actual = result.payload as LibraryPayload;

      expect(actual.modifiedSong).toEqual(songToRemove);
    });

    it("should return current state if the song to be removed is not found in the library", async () => {
      const songList: Track[] = [testSong1, testSong2];
      const user: User = {};
      const songToRemove = testSong3;
      const initialState: RootState = {
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

      const action = removeSongAction({user, song: songToRemove});

      const result = await action(dispatch, getState, undefined);

      const actual = result.payload as LibraryPayload;

      const expected: Track[] = [testSong1, testSong2];

      expect(actual.songs).toEqual(expected);
    });
  });

  describe("searchSpotifyAction", () => {
    let dispatch: any;
    let getState: () => unknown;

    beforeEach(() => {
      dispatch = jest.fn();
      getState = jest.fn();
    });

    it("should add songs that do not exist in the library when searchSpotifyAction is fulfilled", async () => {
      const librarySongs = [testSong1];
      const user: User = {};

      const libraryReducerInitialState: LibraryState = {
        songs: librarySongs,
        loadingLibrary: false,
        loadingRemove: false,
      };

      const rootState: RootState = {
        library: libraryReducerInitialState,
        search: {
          loadingNewReleases: false,
          loadingSearch: false,
          newReleases: [],
          query: "test",
          results: [testSong2],
        },
      };

      getState = jest.fn(() => {
        return rootState;
      });

      const spotifyTokens: GetSpotifyTokenResponse = {
        spotifyRefreshToken: "spotifyRefreshToken",
        spotifyToken: "spotifyToken",
      };

      const spotifySearchResults: TracksResponse = {
        items: [testSong2],
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

      const action = searchSpotifyAction({query: "test", user});

      const actual = libraryReducer(
        libraryReducerInitialState,
        await action(dispatch, getState, undefined)
      );

      const expected: LibraryState = {
        ...libraryReducerInitialState,
        songs: [testSong2, testSong1],
      };

      expect(actual).toEqual(expected);

      auth0Spy.mockRestore();
      spotifySpy.mockRestore();
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
      };

      const spotifySearchResults: TracksResponse = {
        items: [testSong1],
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

    it("should add songs that do not exist in the library when getNewReleasesAction is fulfilled", async () => {
      const librarySongs = [testSong1];
      const user: User = {};

      const libraryReducerInitialState: LibraryState = {
        songs: librarySongs,
        loadingLibrary: false,
        loadingRemove: false,
      };

      const rootState: RootState = {
        library: libraryReducerInitialState,
        search: {
          loadingNewReleases: false,
          loadingSearch: false,
          newReleases: [testSong2],
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
      };

      const spotifySearchResults: TracksResponse = {
        items: [testSong2],
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
        .spyOn(SpotifyService, "getNewReleases")
        .mockResolvedValueOnce(spotifySearchResults);

      const action = getNewReleasesAction(user);

      const actual = libraryReducer(
        libraryReducerInitialState,
        await action(dispatch, getState, undefined)
      );

      const expected: LibraryState = {
        ...libraryReducerInitialState,
        songs: [testSong2, testSong1],
      };

      expect(actual).toEqual(expected);

      auth0Spy.mockRestore();
      spotifySpy.mockRestore();
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
      };

      const spotifySearchResults: TracksResponse = {
        items: [testSong1],
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