import type { NextApiRequest, NextApiResponse } from "next";
import { auth } from "../../middleware/auth";

type Response = {
  isLogin: boolean;
  nickname?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  if (req.method !== "GET") {
    res.status(500).end();
    return;
  }

  const decoded = auth(req, res);
  if (!decoded) {
    res.status(200).json({
      isLogin: false,
    });
    return;
  }

  res.status(200).json({
    isLogin: true,
    nickname: decoded.nickname,
  });
}
