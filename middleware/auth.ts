import jsonwebtoken from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

type Payload = {
  id: string;
  nickname: string;
};
type JWT<P> = P & {
  iat: number;
  exp: number;
};

export const auth = (
  req: NextApiRequest,
  res: NextApiResponse
): JWT<Payload> | null => {
  const configDirectory = path.resolve(process.cwd(), "config");
  const privateKey = process.env.JWT_KEY || "";
  // const privateKey = fs.readFileSync(
  //   path.join(configDirectory, "private.key"),
  //   "utf8"
  // ); // from cookie
  const token = req.cookies["accessToken"];
  if (!token) {
    return null;
  }
  try {
    const decoded = jsonwebtoken.verify(token, privateKey) as JWT<Payload>;
    return decoded;
  } catch (e) {
    return null;
  }
};
