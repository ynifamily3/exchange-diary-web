import axios from "axios";
import { SignUpServiceInput } from "./../../types/index";
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
  const { memberId, memberNickname, memberPassword } =
    req.body as SignUpServiceInput;

  // 회원가입 백엔드 API 호출
  try {
    await axios.post(
      "/sign",
      {
        memberId,
        memberNickname,
        memberPassword,
      },
      { baseURL: process.env.BACKEND_URL }
    );
  } catch (e) {
    res.status(500).end();
    return;
  }
  // TODO: 로그인 백엔드 API 호출

  // set cookie
  res.setHeader("Set-Cookie", [
    `accessToken=test;SameSite=Strict;Path=/;HttpOnly`,
  ]);

  res.status(204).end();
}
