import type { NextApiRequest, NextApiResponse } from "next";
import { refreshToken } from "../../middleware/refreshToken";
import { myInfoService } from "../../service/myInfoService";

const myInfoHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.status(500).end();
    return;
  }

  const decoded = await myInfoService(req.cookies["accessToken"]);
  res.status(200).json(decoded);
};

const handler = new Proxy(myInfoHandler, {
  apply: async (
    target,
    thisArg,
    args: [req: NextApiRequest, res: NextApiResponse]
  ) => {
    const fnName = Reflect.get(myInfoHandler, "name");
    console.log("함수명:", fnName);
    const beforeRefreshTokenFns = [/^myInfo/];
    if (beforeRefreshTokenFns.some((regex) => regex.test(fnName))) {
      await Reflect.apply(refreshToken, thisArg, args);
    }
    return Reflect.apply(target, thisArg, args);
  },
});
export default handler;
