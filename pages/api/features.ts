import { getTracksFeatures } from "../../lib/spotify";
import Cookies from "cookies";
import { NextApiRequest, NextApiResponse } from "next";
import { PlaylistsResponse } from "../../lib/PlaylistsResponse";
import { ErrorResponse } from "../../utils";
import { AudioFeaturesResponse } from "../../lib/AudioFeaturesResponse";

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
  res: NextApiResponse<AudioFeaturesResponse | ErrorResponse>
) => {
  const cookies = new Cookies(req, res);
  const authToken = cookies.get("auth-token");

  try {
    const features = await getTracksFeatures(
      authToken,
      takeFirstIfArray(req.query.ids).split(",")
    );

    return res.status(200).json(features);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data.error);
    }
    return res.status(500).json({ message: "internal server error" });
  }
};
