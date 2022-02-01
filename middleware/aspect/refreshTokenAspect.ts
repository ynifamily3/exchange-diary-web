// joinPoint / pointCut -> 메서드 진입 지점
// target -> handler
// req, res
// refreshToken,
// thisArg,
// args

import { NextApiRequest, NextApiResponse } from "next";

// fnName
const refreshTokenAspect = async (
  fnName: string,
  refreshToken: (req: NextApiRequest, res: NextApiResponse) => void,
  thisArg: any,
  args: Parameters<typeof refreshToken>
) => {
  const beforeRefreshTokenFns = [/^myInfo/];
  if (beforeRefreshTokenFns.some((regex) => regex.test(fnName))) {
    await Reflect.apply(refreshToken, thisArg, args);
  }
};

export default refreshTokenAspect;
