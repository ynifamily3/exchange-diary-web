import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { dehydrate, QueryClient } from "react-query";
import { myInfoService } from "../service/myInfoService";
import { MyInfoServiceResult } from "../types";
import { refreshToken } from "./refreshToken";

const withAdvice = (
  handler: (req: NextApiRequest, res: NextApiResponse) => void
) => {
  return new Proxy(handler, {
    apply: async (target, thisArg, args: Parameters<typeof handler>) => {
      const [req, res] = args;
      const fnName = Reflect.get(handler, "name");
      // refresh token 의 경우
      const beforeRefreshTokenFns = [/^myInfo/];
      if (beforeRefreshTokenFns.some((regex) => regex.test(fnName))) {
        if (req.method !== "GET") {
          res.status(500).end();
          return;
        }
        await Reflect.apply(refreshToken, thisArg, args);
      }
      // end of refresh token

      return Reflect.apply(target, thisArg, args);
    },
  });
};
const withAdviceSSR = (handler: GetServerSideProps) => {
  return new Proxy(handler, {
    apply: async (target, thisArg, args: Parameters<typeof handler>) => {
      // TODO AccessToken 갱신
      // SSR접근일 경우 prefetch Query해야 함.
      const [{ req, res }] = args;
      const queryClient = new QueryClient();
      const fnName = Reflect.get(handler, "name");
      const isCSR = !req || (req.url && req.url.startsWith("/_next/data"));
      if (!isCSR) {
        const { cookies } = req;
        await Promise.all([
          queryClient.prefetchQuery("myInfo", () =>
            myInfoService(cookies["accessToken"])
          ),
        ]);

        // 비로그인 유저 튕김
        const checkLoginTarget = [/^getWritePage/];
        if (checkLoginTarget.some((regex) => regex.test(fnName))) {
          if (
            !queryClient.getQueryData<MyInfoServiceResult>("myInfo")?.isLogin
          ) {
            res.setHeader("Set-Cookie", [`redirectReason=Not Login; Path=/`]);
            return {
              redirect: {
                destination: "/",
              },
              props: {},
            };
          }
        }
        // end of 비로그인 유저 튕김
      }
      const preparedProps = { dehydratedState: dehydrate(queryClient) };
      const ret: { [key: string]: any } = await Reflect.apply(
        target,
        thisArg,
        args
      );
      ret.props = { ...ret.props, ...preparedProps };
      return ret;
    },
  });
};

export { withAdvice, withAdviceSSR };
