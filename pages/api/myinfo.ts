import type { NextApiRequest, NextApiResponse } from "next";
import { myInfoService } from "../../service/myInfoService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(500).end();
    return;
  }

  const decoded = await myInfoService(req.cookies["accessToken"]);
  res.status(200).json(decoded);
}
