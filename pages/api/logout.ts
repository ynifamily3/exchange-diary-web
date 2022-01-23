import type { NextApiRequest, NextApiResponse } from "next";
export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Set-Cookie", [
    `accessToken=;SameSite=Strict;Path=/;HttpOnly`,
    `refreshToken=;SameSite=Strict;Path=/;HttpOnly`,
  ]);
  res.status(204).end();
}
