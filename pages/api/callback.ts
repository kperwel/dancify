// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Cookies from 'cookies'

import { getAccessToken } from "../../lib/spotify";
import type { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const autorization = await getAccessToken(req.query.code);
  const cookies = new Cookies(req, res)
  cookies.set('auth-token', autorization.access_token);
  res.redirect('/');
};
