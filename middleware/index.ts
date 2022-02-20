import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { dehydrate, QueryClient } from "react-query";
import { myInfoService } from "../service/myInfoService";
import { MyInfoServiceResult } from "../types";
import refreshTokenAspect from "./aspect/refreshTokenAspect";
import { refreshToken } from "./refreshToken";

const withAdvice = (
  handler: (req: NextApiRequest, res: NextApiResponse) => void
) => {
  return new Proxy(handler, {
    apply: async (target, thisArg, args: Parameters<typeof handler>) => {
      const fnName = Reflect.get(handler, "name");
      await refreshTokenAspect(fnName, refreshToken, thisArg, args);
      return Reflect.apply(target, thisArg, args);
    },
  });
};
const withAdviceSSR = (handler: GetServerSideProps) => {
  return new Proxy(handler, {
    apply: async (target, thisArg, args: Parameters<typeof handler>) => {
      const [{ req, res }] = args;
      const queryClient = new QueryClient();
      const fnName = Reflect.get(handler, "name");
      const { cookies } = req;

      const prefetches: [string, () => Promise<unknown>][] = [
        ["myInfo", () => myInfoService(cookies["accessToken"])],
      ];

      // 그룹스
      [/^getGroupsPage/].some((regex) => regex.test(fnName)) &&
        prefetches.push(["myGroups", () => Promise.resolve([9999])]);

      await Promise.all(
        prefetches.map((arg) =>
          queryClient.prefetchQuery.apply(queryClient, arg)
        )
      );

      // 비로그인 유저 튕김
      const checkLoginTarget = [/^getWritePage/, /^getGroupsPage/];
      if (checkLoginTarget.some((regex) => regex.test(fnName))) {
        if (!queryClient.getQueryData<MyInfoServiceResult>("myInfo")?.isLogin) {
          return {
            redirect: {
              destination: "/?redirectReason=NotLogin",
            },
            props: {},
          };
        }
      }
      // end of 비로그인 유저 튕김
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
