import querystring from "querystring";
import { PlaylistsResponse } from "./PlaylistsResponse";
import axios from "axios";
import { TracksByPlaylistResponse } from "./TracksByPlaylistResponse";
import { AudioFeaturesResponse } from "./AudioFeaturesResponse";

const {
  SPOTIFY_CLIENT_ID: client_id,
  SPOTIFY_CLIENT_SECRET: client_secret,
  SPOTIFY_REDIRECT_URL: redirect_url,
  SPOTIFY_SCOPES: scopes,
} = process.env;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

export const getAccessToken = async (code) => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: querystring.stringify({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirect_url,
    }),
  });

  return response.json();
};

export const refreshToken = async (refresh_token) => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: querystring.stringify({
      grant_type: "refresh_token",
      refresh_token,
    }),
  });

  return response.json();
};

const TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks`;

export const getTopTracks = async (access_token) => {
  return fetch(TOP_TRACKS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

const AUTHORIZE_ENDPOINT = `https://accounts.spotify.com/authorize`;

export const login = (req, res) => {
  console.log(scopes);
  res.redirect(
    `${AUTHORIZE_ENDPOINT}?response_type=code&client_id=${client_id}&scope=${encodeURIComponent(
      scopes
    )}&redirect_uri=${encodeURIComponent(redirect_url)}`
  );
};

const ME_ENDPOINT = `https://api.spotify.com/v1/me`;

export const me = async (access_token) => {
  const reponse = await axios.get(ME_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  return reponse.data;
};

const PLAYLISTS_ENDPOINT = `https://api.spotify.com/v1/me/playlists`;

export const getPlaylists = async (
  access_token: string,
  limit?: number,
  offset?: number
): Promise<PlaylistsResponse> => {
  const url = new URL(PLAYLISTS_ENDPOINT);

  if (limit) {
    url.searchParams.set("limit", `${limit}`);
  }

  if (offset) {
    url.searchParams.set("offset", `${offset}`);
  }

  const response = await axios.get<PlaylistsResponse>(url.href, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  return response.data;
};

export const getPlaylistTracks = async (
  access_token: string,
  id: string,
  { limit, offset }: { limit?: number; offset?: number } = {}
): Promise<TracksByPlaylistResponse> => {
  const url = new URL(`https://api.spotify.com/v1/playlists/${id}/tracks`);

  if (limit) {
    url.searchParams.set("limit", `${limit}`);
  }

  if (offset) {
    url.searchParams.set("offset", `${offset}`);
  }

  if (id) {
    url.searchParams.set("id", `${id}`);
  }

  url.searchParams.set("fields", "items(track(id, name,album(images)))");

  const response = await axios.get<TracksByPlaylistResponse>(url.href, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  return response.data;
};

const GET_AUDIO_FEATURES_URL = "https://api.spotify.com/v1/audio-features";

export const getTracksFeatures = async (
  access_token: string,
  ids: Array<string>
) => {
  const url = new URL(GET_AUDIO_FEATURES_URL);
  url.searchParams.set("ids", ids.join(","));

  console.log(url.href);

  const response = await axios.get<AudioFeaturesResponse>(url.href, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  return response.data;
};

const PUT_PLAY_URL = "https://api.spotify.com/v1/me/player/play";

export const putPlay = async (
  access_token: string,
  ids: Array<string>
) => {
  const url = new URL(GET_AUDIO_FEATURES_URL);
  url.searchParams.set("ids", ids.join(","));

  console.log(url.href);

  const response = await axios.get<AudioFeaturesResponse>(url.href, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  return response.data;
};
