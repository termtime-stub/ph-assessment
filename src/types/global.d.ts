export {};

declare global {
  interface AxiosError {
    message: string;
    status: number;
  }

  //#region Auth0
  interface Identity {
    provider: string;
    access_token: string;
    isSocial: boolean;
    refresh_token: string;
    user_id: string;
  }
  interface Auth0UserResponse {
    identities: Identity[];
    last_login: string;
  }

  //#endregion

  //#region Spotify

  //#region API Models

  interface ExternalUrls {
    spotify?: string;
  }
  interface Artist {
    id: string;
    name: string;
    type: string;
  }
  interface URLImage {
    height: number;
    url: string;
  }
  interface Album {
    album_type: string;
    artists: Artist[];
    external_urls: ExternalUrls;
    id: string;
    images: URLImage[];
    name: string;
  }

  interface Track {
    artists: Artist[];
    name: string;
    id: string;
    isInLibrary: boolean;
    duration_ms: number;
    isNewRelease: boolean;
    external_url: ExternalUrls;
    uri: string;
  }

  interface AlbumWithTracks extends Album {
    tracks: AlbumWithTracksResponse;
  }

  interface TrackWithAlbum extends Track {
    album: Album;
  }
  //#endregion

  //#region Responses

  interface PaginationFields {
    href: string;
    limit: number;
    offset: number;
    next: number | null;
    previous: number | null;
    total: number;
  }
  interface AlbumWithTracksResponse extends PaginationFields {
    items: Track[];
  }

  interface AlbumsResponse extends PaginationFields {
    items: Album[];
  }

  interface NewReleasesResponse {
    albums: AlbumsResponse;
  }

  interface AlbumsWithTracksResponse {
    albums: AlbumWithTracks[];
  }

  interface NewReleasesResponseWithTracks extends PaginationFields {
    items: TrackWithAlbum[];
  }

  interface TracksWithAlbumResponse extends PaginationFields {
    items: TrackWithAlbum[];
  }

  interface SearchResponse {
    tracks: TracksWithAlbumResponse;
    error?: AxiosError;
  }

  interface RefreshTokenResponse {
    access_token: string;
  }

  interface CreatePlaylistResponse {
    external_urls: ExternalUrls;
    id: string;
  }

  interface AddTracksToPlaylistResponse {
    snapshot_id: string;
  }
  //#endregion

  //#endregion
}
