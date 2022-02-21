import {User} from "@auth0/auth0-react";
import {DataPersistenceService} from "../../../services/DataPersistenceService";
import {LibraryPayload} from "../../../types/state";
import {RootState} from "../../store";
import {removeSongAction} from "./library.reducer";
import {SpotifyService} from "../../../services/Spotify.service";

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
  isInLibrary: true,
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
  isInLibrary: true,
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
  isInLibrary: true,
  isNewRelease: false,
  name: "The test track #3",
  external_url: {},
  uri: "",
};

describe("SearchReducer -", () => {
  let dispatch: any;
  let getState: () => unknown;

  beforeEach(() => {
    dispatch = jest.fn();
    getState = jest.fn();
  });
  describe("searchSpotifyAction -", () => {
    it("should sync the isLibraryState property from the tracks in the library if it exists there", async () => {
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

      jest
        .spyOn(SpotifyService, "search")
        .mockImplementationOnce(async (): Promise<TracksWithAlbumResponse> => {
          return Promise.resolve({
            href: "",
            items: [
              {...testSong1, isInLibrary: false},
              {...testSong2, isInLibrary: false},
              {...testSong3, isInLibrary: false},
            ],
            limit: 10,
            next: null,
            offset: 3,
            previous: null,
            total: 3,
          });
        });

      const action = removeSongAction({user, song: songToRemove});

      const result = await action(dispatch, getState, undefined);

      const actual = result.payload as LibraryPayload;

      expect(actual.modifiedSong!.id).toEqual(songToRemove.id);
    });
  });

  describe("getNewReleases -", () => {
    it("should sync the isLibraryState property from the tracks in the library if it exists there", async () => {
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

      jest
        .spyOn(SpotifyService, "getNewReleases")
        .mockImplementationOnce(
          async (): Promise<NewReleasesResponseWithTracks> => {
            return Promise.resolve({
              href: "",
              items: [
                {...testSong1, isNewRelease: true, isInLibrary: false},
                {...testSong2, isNewRelease: true, isInLibrary: false},
                {...testSong3, isNewRelease: true, isInLibrary: false},
              ],
              limit: 10,
              next: null,
              offset: 3,
              previous: null,
              total: 3,
            });
          }
        );

      const action = removeSongAction({user, song: songToRemove});

      const result = await action(dispatch, getState, undefined);

      const actual = result.payload as LibraryPayload;

      expect(actual.modifiedSong!.id).toEqual(songToRemove.id);
    });
  });
});
