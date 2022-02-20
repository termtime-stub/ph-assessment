import {User} from "@auth0/auth0-react";
import {FirebaseConnector} from "../app/providers/Firebase";

export class DataPersistenceService {
  /**
   * Gets all the songs in the library of a user.
   *
   * @param user
   * @returns
   */
  static async getLibraryFromFirestore(user: User): Promise<TrackWithAlbum[]> {
    const connector = await FirebaseConnector.getInstance();

    const queryRes = await connector.db
      .collection(`libraries/${user.sub}/songs`)
      .where("isInLibrary", "==", true)
      .get();

    return queryRes.docs.map((d) => d.data()) as TrackWithAlbum[];
  }

  /**
   * Used to update whether or not this song is added to the library
   *
   * @param track
   * @param user
   * @param newStatus
   * @returns
   */
  static async updateSongLibraryAddStatus(
    track: TrackWithAlbum,
    user: User,
    newStatus: boolean
  ): Promise<TrackWithAlbum> {
    const connector = await FirebaseConnector.getInstance();

    const updatedSong: TrackWithAlbum = {...track, isInLibrary: newStatus};

    await connector.db
      .collection(`libraries/${user.sub}/songs`)
      .doc(track.id)
      .update({isInLibrary: newStatus});

    return updatedSong;
  }

  /**
   * Called when it's the first time we favorite a song.
   *
   * Saves the track and marks it as added into the user's library
   * @param track
   * @param isFavorited
   */
  static async saveSongInFirestore(
    track: TrackWithAlbum,
    user: User
  ): Promise<TrackWithAlbum> {
    const connector = await FirebaseConnector.getInstance();

    const updatedSong: TrackWithAlbum = {...track, isInLibrary: true};

    await connector.db
      .collection(`libraries/${user.sub}/songs`)
      .doc(track.id)
      .set(updatedSong);

    return updatedSong;
  }
}
