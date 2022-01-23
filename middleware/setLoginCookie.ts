import { NextApiResponse } from "next";
import { Tokens } from "../types";

export const setLoginCookie = (res: NextApiResponse, token: Tokens) => {
  const expires = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toUTCString();

  // set cookie (expires in 14 days)
  res.setHeader("Set-Cookie", [
    `accessToken=${token.accessToken};SameSite=Strict;Path=/;Expires=${expires};Max-Age=${expires};HttpOnly`,
    `refreshToken=${token.refreshToken};SameSite=Strict;Path=/;Expires=${expires};Max-Age=${expires};HttpOnly`,
  ]);
};
