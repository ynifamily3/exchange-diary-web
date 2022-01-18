import type { NextApiRequest, NextApiResponse } from "next";

type RequestBody = {
  id: string;
  password: string;
};

type Response = {
  accessToken: string;
  refreshToken: string;
  nickname: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  if (req.method !== "POST") {
    res.status(500).end();
    return;
  }

  // get request body
  const { id, password } = req.body as RequestBody;
  console.log("login attempt", id, password);

  // set cookie
  res.setHeader("Set-Cookie", [
    `accessToken=${`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMTIiLCJuYW1lIjoiTWllbCIsImlhdCI6MTUxNjIzOTAyMn0.4pkDNatCQ71Afkv9MkrXyDaKfaDcdqrZOUNrP-qLcWI`};SameSite=Strict;Path=/;HttpOnly`,
    `refreshToken=${password};SameSite=Strict;Path=/;HttpOnly`,
  ]);

  // delay 2000ms
  await new Promise((resolve) => setTimeout(resolve, 2000));

  res.status(200).json({
    accessToken: "accessToken",
    refreshToken: "refreshToken",
    nickname: "미엘",
  });
}
