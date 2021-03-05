import {
  getPlaylists,
  getPlaylistTracks,
  getTracksFeatures,
} from "../../../lib/spotify";
import Cookies from "cookies";
import { NextApiRequest, NextApiResponse } from "next";
import { ErrorResponse } from "../../../utils";
import { TracksByPlaylistWithFeaturesResponse } from "../../../api";

const takeFirstIfArray = (value?: string | string[]) => {
  if (typeof value === "string") {
    return value;
  }

  return value?.length > 0 ? value[0] : null;
};

const takeStringIfNotEmpty = (value?: string) =>
  typeof value === "string" ? Number.parseInt(value) : undefined;

export default async (
  req: NextApiRequest,
  res: NextApiResponse<TracksByPlaylistWithFeaturesResponse | ErrorResponse>
) => {
  const cookies = new Cookies(req, res);
  const authToken = cookies.get("auth-token");

  try {
    const tracks = await getPlaylistTracks(
      authToken,
      takeFirstIfArray(req.query.id),
      {
        limit: takeStringIfNotEmpty(takeFirstIfArray(req.query.limit)),
        offset: takeStringIfNotEmpty(takeFirstIfArray(req.query.offset)),
      }
    );

    const itemsIds = tracks.items.map((item) => item.track.id);

    const features = await getTracksFeatures(authToken, itemsIds);

    const featuredItems = tracks.items.map((item, key) => ({
      track: item.track,
      features: features.audio_features[key]
    }));

    return res.status(200).json({ items: featuredItems });
  } catch (error) {
    if (error.response) {
      console.log(error.response.data.error);
      return res.status(error.response.status).json(error.response.data.error);
    }
    return res.status(500).json({ message: "internal server error" });
  }
};
