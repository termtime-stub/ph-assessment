import axios from "axios";

interface ErrorResponse {
  error: {message: string; statusCode: number};
}
export class SpotifyService {
  async search(q: string, token: string, refreshToken: string) {
    const endpoint = `https://api.spotify.com/v1/search?q=${q}&type=track`;
    console.log({spotifyToken: token});
    console.log({endpoint});

    let res = await axios.get<SearchResponse>(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      validateStatus: (status) => true,
    });
    console.log(res);
    if (
      res.data.error &&
      res.data.error.message === "The access token expired"
    ) {
      console.log("lets go");
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
      console.log(refreshRes);
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
    console.log({spotifyToken: token});
    console.log({endpoint});

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
      console.log(refreshRes);
      const newTk = refreshRes.data;

      res = await axios.get<SearchResponse>(endpoint, {
        headers: {
          Authorization: `Bearer ${newTk}`,
        },
      });
    }

    console.log(res);

    if (res) {
      return res.data.tracks;
    }
  }
}
