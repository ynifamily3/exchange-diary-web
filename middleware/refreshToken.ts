import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
export const refreshToken = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const request = await axios.post(
      "/jwt",
      {
        refreshToken: req.cookies.refreshToken,
        accessToken: req.cookies.accessToken,
      },
      { baseURL: process.env.BACKEND_URL }
    );
    console.log("토큰 갱신 중...");
    const { accessToken, refreshToken } = request.data;

    const maxAge = 14 * 24 * 60 * 60;
    const expires = new Date(Date.now() + maxAge).toUTCString();
    const isProd = process.env.NODE_ENV === "production";
    res.setHeader("Set-Cookie", [
      `accessToken=${accessToken};SameSite=Strict;Path=/;Expires=${expires};Max-Age=${maxAge};HttpOnly${
        isProd ? ";Secure" : ""
      }`,
      `refreshToken=${refreshToken};SameSite=Strict;Path=/;Expires=${expires};Max-Age=${maxAge};HttpOnly${
        isProd ? ";Secure" : ""
      }`,
    ]);
  } catch (e) {
    console.warn("리프레시 토큰 실패..!!", e);
  }
};
