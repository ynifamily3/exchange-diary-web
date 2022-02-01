import axios from "axios";
import jsonwebtoken from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

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
    const now = Math.floor(new Date().getTime());
    const exp = (decodedAccessToken.exp ?? 0) * 1000;
    const fifteenMinutes = 15 * 60 * 1000;

    // 만료시에서 15분 초과로 남으면 재발급 로직 실행하지 않음.
    if (exp - fifteenMinutes > now) {
      console.log("[jwt] 아직 갱신할 시간이 안 됨.");
      // return;
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
    res.setHeader(
      "Set-Cookie",
      [
        `accessToken=${accessToken};SameSite=Strict;Path=/;Expires=${expires};Max-Age=${maxAge};HttpOnly${
          isProd ? ";Secure" : ""
        }`,
      ].concat(
        refreshToken
          ? `refreshToken=${refreshToken};SameSite=Strict;Path=/;Expires=${expires};Max-Age=${maxAge};HttpOnly${
              isProd ? ";Secure" : ""
            }`
          : []
      )
    );
  } catch (e) {}
};
