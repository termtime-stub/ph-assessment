import axios from "axios";
import {albumToTrack} from "../utils";
import {Buffer} from "buffer";

export class SpotifyService {
  static getRefreshToken(accessToken: string): Promise<string> {
    return Promise.resolve("STUB");
  }
  static async search(
    q: string,
    token: string,
    refreshToken: string
  ): Promise<TracksResponse> {
    const endpoint = `https://api.spotify.com/v1/search?q=${q}&type=track`;

    let res = await axios.get<SearchResponse>(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.tracks;
  }

  static async getNewReleases(
    token: string,
    refreshToken: string
  ): Promise<NewReleasesResponseTranslated> {
    const endpoint = "https://api.spotify.com/v1/browse/new-releases";

    let res = await axios.get<NewReleasesResponse>(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      items: res.data.albums.items.map((s) => albumToTrack(s, false, true)),
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
}
