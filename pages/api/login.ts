import { NextApiRequest, NextApiResponse } from "next";
import { login as loginToSpotify } from "../../lib/spotify";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    return loginToSpotify(req, res)
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).end(error.message);
  }
}
