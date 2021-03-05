import { getTopTracks } from "../../lib/spotify";
import Cookies from "cookies";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const cookies = new Cookies(req, res);
  const authToken = cookies.get("auth-token");
  try {
    const response = await getTopTracks(authToken);

    if (response.status !== 200) {
      throw new Error("Seerver error occured");
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(err.status).send({ message: err.message });
  }
};
