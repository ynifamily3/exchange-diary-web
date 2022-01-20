import type { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // remove accessToken Cookie
  res.setHeader("Set-Cookie", [`accessToken=;SameSite=Strict;Path=/;HttpOnly`]);
  res.status(204).end();
}
