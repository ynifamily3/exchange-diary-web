import type { NextApiRequest, NextApiResponse } from "next";
export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Set-Cookie", [
    `accessToken=;SameSite=Strict;Path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;HttpOnly`,
    `refreshToken=;SameSite=Strict;Path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;HttpOnly`,
  ]);
  res.status(204).end();
}
