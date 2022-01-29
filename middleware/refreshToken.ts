import axios from "axios";
import jsonwebtoken from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

// 이걸 service로 분리해야 함...
export const refreshToken = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;
    const oldAccessToken = req.cookies.accessToken;
    if (!oldRefreshToken || !oldAccessToken) {
      throw new Error("refreshToken and accessToken are not found");
    }
    // access token 시간이 만료되었는지 확인
    const decodedAccessToken = jsonwebtoken.decode(
      oldAccessToken
    ) as jsonwebtoken.JwtPayload;
    if (!decodedAccessToken) {
      throw new Error("accessToken이 디코딩되지 않음.");
    }
    const now = new Date().getTime() / 1000;
    if (decodedAccessToken.exp && decodedAccessToken.exp > now) {
      return;
    }
    const request = await axios.post(
      "/jwt",
      {
        refreshToken: oldRefreshToken,
        accessToken: oldAccessToken,
      },
      { baseURL: process.env.BACKEND_URL }
    );
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
  } catch (e) {}
};
