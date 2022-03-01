import type { NextApiRequest, NextApiResponse } from "next";
import { withAdvice } from "../../middleware";
import { myTeamsService } from "../../service/myTeamsService";

const myTeamsHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const decoded = await myTeamsService(req.cookies["accessToken"]);
  res.status(200).json(decoded);
};

export default withAdvice(myTeamsHandler);
