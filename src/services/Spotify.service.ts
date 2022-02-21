import axios from "axios";
import {Buffer} from "buffer";

export class SpotifyService {
  /**
   * Searches tracks with the specified query
   * @param query
   * @param accessToken
   * @returns
   */
  static async search(
    query: string,
    accessToken: string
  ): Promise<TracksWithAlbumResponse> {
    const endpoint = `https://api.spotify.com/v1/search?q=${query}&type=track`;

    let res = await axios.get<SearchResponse>(endpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res.data.tracks;
  }

  static async getTracksFromAlbums(
    albumsIds: string[],
    accessToken: string,
    maxSongsPerAlbum?: number
  ): Promise<TrackWithAlbum[]> {
    const endpoint = "https://api.spotify.com/v1/albums";
    // API only allows up to 20 comma-separated album ids
    const trimmedAlbums = albumsIds.slice(0, 20);
    let res = await axios.get<AlbumsWithTracksResponse>(endpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        ids: trimmedAlbums.join(","),
      },
    });

    // Tracks brought from this endpoint do not have album data.
    // Merge album data with track data and flatten to normalize.
    const tracksWithAlbum: TrackWithAlbum[] = res.data.albums
      .map((a) =>
        a.tracks.items.slice(0, maxSongsPerAlbum).map(
          (t): TrackWithAlbum => ({
            ...t,
            album: {
              album_type: a.album_type,
              artists: a.artists,
              external_urls: a.external_urls,
              id: a.id,
              images: a.images,
              name: a.name,
            },
          })
        )
      )
      .flat();

    return tracksWithAlbum;
  }

  /**
   * Gets new release albums
   * @param accessToken
   * @returns
   */
  static async getNewReleases(
    accessToken: string
  ): Promise<NewReleasesResponseWithTracks> {
    const endpoint = "https://api.spotify.com/v1/browse/new-releases";

    let res = await axios.get<NewReleasesResponse>(endpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const albumIds = res.data.albums.items.map((a) => a.id);

    const maxSongsPerAlbum = 2;

    const tracks = await this.getTracksFromAlbums(
      albumIds,
      accessToken,
      maxSongsPerAlbum
    );

    const {href, limit, next, offset, previous, total} = res.data.albums;

    return {
      href,
      limit,
      next,
      offset,
      previous,
      total,
      items: tracks.map((t) => ({...t, isNewRelease: true})),
    };
  }

  static async refreshSpotifyToken(refreshToken: string): Promise<string> {
    const refreshEndpoint = "https://accounts.spotify.com/api/token";

    const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
    const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;

    const authorizationTk = new Buffer(clientId + ":" + clientSecret).toString(
      "base64"
    );

    let refreshRes;

    const params = new URLSearchParams();
    params.append("grant_type", "refresh_token");
    params.append("refresh_token", refreshToken);

    refreshRes = await axios.post<RefreshTokenResponse>(
      refreshEndpoint,
      params,
      {
        headers: {
          Authorization: `Basic ${authorizationTk}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return refreshRes.data.access_token;
  }

  /**
   * Creates a new spotify playlist and adds the specified tracks.
   *
   * Returns the external redirect URL to take the user to the spotify playlist
   * @param tracks
   * @param playlistName
   * @param spotifyUserId
   * @param accessToken
   * @returns
   */
  static async createPlaylistAndAddTracks(
    tracks: TrackWithAlbum[],
    playlistName: string,
    spotifyUserId: string,
    accessToken: string
  ): Promise<string> {
    const createPlayListEndpoint = `https://api.spotify.com/v1/users/${spotifyUserId}/playlists`;

    const params = new URLSearchParams();
    params.append("name", playlistName);

    const createPlaylistRes = await axios.post<CreatePlaylistResponse>(
      createPlayListEndpoint,
      params,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // Once we have the playlist ID, add songs to it

    const playlistId = createPlaylistRes.data.id;

    this.addTracksToPlaylist(tracks, accessToken, playlistId);

    return createPlaylistRes.data.external_urls.spotify!;
  }

  static async addTracksToPlaylist(
    tracks: TrackWithAlbum[],
    accessToken: string,
    playlistId: string
  ): Promise<boolean> {
    const addTracksToPlaylistEndpoint = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

    // const params = new URLSearchParams();
    // params.append(
    //   "uris",
    //   tracks.map((t) => t.uri)
    // );

    axios.post<AddTracksToPlaylistResponse>(
      addTracksToPlaylistEndpoint,
      {
        uris: tracks.map((t) => t.uri),
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return true;
  }
}
