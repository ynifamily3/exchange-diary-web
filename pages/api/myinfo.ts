import type { NextApiRequest, NextApiResponse } from "next";
import { withAdvice } from "../../middleware";
import { myInfoService } from "../../service/myInfoService";

const myInfoHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const decoded = await myInfoService(req.cookies["accessToken"]);
  res.status(200).json(decoded);
};

export default withAdvice(myInfoHandler);
