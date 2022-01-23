import { setLoginCookie } from "./../../middleware/setLoginCookie";
import { LoginServiceInput } from "../../types";
import { loginService } from "./../../service/loginService";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(500).end();
    return;
  }

  // get request body
  const { id, password } = req.body as LoginServiceInput;

  const token = await loginService({ id, password });

  if (!token) {
    res.status(500).end();
    return;
  }
  setLoginCookie(res, token);
  res.status(204).end();
}
