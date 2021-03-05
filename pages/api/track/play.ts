import {
  getPlaylists,
  getPlaylistTracks,
  getTracksFeatures,
  putPlay,
} from "../../../lib/spotify";
import Cookies from "cookies";
import { NextApiRequest, NextApiResponse } from "next";
import { ErrorResponse } from "../../../utils";
import { TracksByPlaylistWithFeaturesResponse } from "../../../api";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<null | ErrorResponse>
) => {
  const cookies = new Cookies(req, res);
  const authToken = cookies.get("auth-token");

  try {
    await putPlay(
      authToken,
      [req.body.id]
    );


    return res.status(200).json(null);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data.error);
    }
    return res.status(500).json({ message: "internal server error" });
  }
};
