// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Cookies from "cookies";
import { NextApiRequest, NextApiResponse } from "next";

import { me } from "../../lib/spotify";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const cookies = new Cookies(req, res);
  const authToken = cookies.get("auth-token");
  

  try {
    const data = await me(authToken);
    
    if (data?.error?.status === 401) {
        res.redirect("/api/login");
    }

    return res.status(200).json(data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data.error);
    }
    return res.status(500).json({ message: "internal server error" });
  }
};
