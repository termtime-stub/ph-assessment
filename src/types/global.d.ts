export {};

declare global {
  type CSSProperties = {
    [key: string]: React.CSSProperties;
  };

  interface SongMetadata {
    title: string;

    artist: string;
    id: string;
    isInLibrary: boolean;
    album: {
      picture: string;
      title: string;
    };
    duration: number;
  }

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

  interface SearchSpotifyActionParams {
    user: User;
    query: string;
  }

  // Spotify

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
    artists: Artist[];
    name: string;
    id: string;
    isInLibrary: boolean = false;
    duration_ms: number;
  }

  interface TracksResponse {
    href: string;
    limit: number;
    offset: number;
    previous: number | null;
    total: number;
    items: Track[];
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
