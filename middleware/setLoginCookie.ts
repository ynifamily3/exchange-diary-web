import { NextApiResponse } from "next";
import { Tokens } from "../types";

export const setLoginCookie = (res: NextApiResponse, token: Tokens) => {
  const maxAge = 14 * 24 * 60 * 60;
  const expires = new Date(Date.now() + maxAge).toUTCString();
  const isProd = process.env.NODE_ENV === "production";
  // set cookie (expires in 14 days)
  res.setHeader("Set-Cookie", [
    `accessToken=${
      token.accessToken
    };SameSite=Strict;Path=/;Expires=${expires};Max-Age=${maxAge};HttpOnly${
      isProd ? ";Secure" : ""
    }`,
    `refreshToken=${
      token.refreshToken
    };SameSite=Strict;Path=/;Expires=${expires};Max-Age=${maxAge};HttpOnly${
      isProd ? ";Secure" : ""
    }`,
  ]);
};
