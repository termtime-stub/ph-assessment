import {User} from "@auth0/auth0-react";
import axios from "axios";

export interface GetSpotifyTokenResponse {
  spotifyToken: string;
  spotifyRefreshToken: string;
}

export class Auth0Service {
  static async getSpotifyToken(user: User): Promise<GetSpotifyTokenResponse> {
    const endpoint = `https://dev-kxznetwf.us.auth0.com/api/v2/users/${encodeURIComponent(
      user?.sub ?? ""
    )}`;

    const spotifyTokenRes = await axios.get<Auth0UserResponse>(endpoint, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_AUTH0_IDENTITY_MANAGER_TOKEN}`,
      },
    });

    const spotifyToken = spotifyTokenRes.data.identities[0].access_token;
    const spotifyRefreshToken =
      spotifyTokenRes.data.identities[0].refresh_token;

    return {
      spotifyToken,
      spotifyRefreshToken,
    };
  }
}
