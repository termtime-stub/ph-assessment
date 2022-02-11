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
}
