export {};

declare global {
  // Auth0
  interface Identity {
    provider: string;
    access_token: string;
    isSocial: boolean;
    refresh_token: string;
    user_id: string;
  }
  interface Auth0UserResponse {
    identities: Identity[];
  }

  // Spotify

  interface RefreshTokenResponse {
    access_token: string;
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
    external_urls: {
      spotify?: string;
    };
    id: string;
    images: URLImage[];
    name: string;
  }
  interface Track {
    album: Album;
    items: Track[];
    artists: Artist[];
    name: string;
    id: string;
    isInLibrary: boolean;
    duration_ms: number;
    isNewRelease: boolean;
  }

  interface TracksResponse {
    href: string;
    limit: number;
    offset: number;
    previous: number | null;
    total: number;
    items: Track[];
  }

  interface NewReleasesResponse {
    albums: {
      items: Album[];
    };
    error?: AxiosError;
  }

  interface NewReleasesResponseTranslated {
    items: Track[];
    error?: AxiosError;
  }

  interface AxiosError {
    message: string;
    status: number;
  }
  interface SearchResponse {
    tracks: TracksResponse;
    error?: AxiosError;
  }
}
