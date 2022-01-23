import { SignUpServiceInput } from "./../../types/index";
import type { NextApiRequest, NextApiResponse } from "next";
import { signupService } from "../../service/signupService";
import { setLoginCookie } from "../../middleware/setLoginCookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(500).end();
    return;
  }

  // get request body
  const { memberId, memberNickname, memberPassword } =
    req.body as SignUpServiceInput;

  // refreshToken이랑 같이 받아야 함
  const token = await signupService({
    memberId,
    memberNickname,
    memberPassword,
  });

  if (!token) {
    res.status(500).end();
    return;
  }

  setLoginCookie(res, token);

  res.status(204).end();
}
