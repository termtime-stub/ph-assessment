import {User} from "@auth0/auth0-react";
import axios from "axios";
import moment from "moment";

export interface GetSpotifyTokenResponse {
  spotifyToken: string;
  spotifyRefreshToken: string;
  expireDateMs: number;
}

export class Auth0Service {
  /**
   * Gets the spotify token from the Auth0 identities list, the access token will not update unless login in again with the social provider.
   * @param user
   * @returns
   */
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

    const expireDateMs = moment(spotifyTokenRes.data.last_login)
      .add(1, "hour")
      .valueOf();

    return {
      spotifyToken,
      spotifyRefreshToken,
      expireDateMs,
    };
  }
}
