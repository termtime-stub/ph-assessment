export const albumToTrack = (album: Album, isInLibrary: boolean): Track => {
  return {
    album,
    name: album.name,
    duration_ms: 1,
    artists: album.artists,
    id: album.id,
    isInLibrary,
    items: [],
  };
};
