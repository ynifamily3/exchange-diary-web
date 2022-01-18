import type { NextApiRequest, NextApiResponse } from "next";

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
  }

  res.status(200).json({
    isLogin: true,
    nickname: "미엘",
  });
}
