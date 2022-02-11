import axios from "axios";
import {albumToTrack} from "../utils";

interface ErrorResponse {
  error: {message: string; statusCode: number};
}
export class SpotifyService {
  async search(q: string, token: string, refreshToken: string) {
    const endpoint = `https://api.spotify.com/v1/search?q=${q}&type=track`;

    let res = await axios.get<SearchResponse>(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      validateStatus: (status) => true,
    });
    if (
      res.data.error &&
      res.data.error.message === "The access token expired"
    ) {
      //refresh the token
      const refreshEndpoint = "https://api.spotify.com/v1/refresh";
      const refreshRes = await axios.post(
        refreshEndpoint,
        {
          refresh_token: refreshToken,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      const newTk = refreshRes.data;

      res = await axios.get<SearchResponse>(endpoint, {
        headers: {
          Authorization: `Bearer ${newTk}`,
        },
      });
    }

    if (res) {
      return res.data.tracks;
    }
  }

  async getNewReleases(token: string, refreshToken: string) {
    const endpoint = "https://api.spotify.com/v1/browse/new-releases";

    let res = await axios.get<NewReleasesResponse>(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      validateStatus: (status) => true,
    });

    if (
      res.data.error &&
      res.data.error.message === "The access token expired"
    ) {
      //refresh the token
      const refreshEndpoint = "https://api.spotify.com/v1/refresh";
      const refreshRes = await axios.post(
        refreshEndpoint,
        {
          refresh_token: refreshToken,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      const newTk = refreshRes.data;

      res = await axios.get<NewReleasesResponse>(endpoint, {
        headers: {
          Authorization: `Bearer ${newTk}`,
        },
      });
    }

    if (res) {
      return {
        ...res,
        items: res.data.albums.items.map((s) => albumToTrack(s, false)),
      };
    }
  }
}
