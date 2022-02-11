export {};

declare global {
  type CSSProperties = {
    [key: string]: React.CSSProperties;
  };

  interface SongMetadata {
    title: string;
    image: string;
    artist: string;
    id: string;
  }
}
