import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import jsonwebtoken from "jsonwebtoken";
import path from "path";

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
  const configDirectory = path.resolve(process.cwd(), "config");
  const privateKey = fs.readFileSync(
    path.join(configDirectory, "private.key"),
    "utf8"
  );
  const token = jsonwebtoken.sign(
    {
      id,
      nickname: "닉:" + id,
    },
    privateKey,
    { algorithm: "HS256", expiresIn: "1h" }
  );

  // set cookie
  res.setHeader("Set-Cookie", [
    `accessToken=${token};SameSite=Strict;Path=/;HttpOnly`,
  ]);
  res.status(204).end();
}
