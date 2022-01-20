import axios from "axios";

export interface MyInfo {
  isLogin: boolean;
  nickname?: string;
}

export const getMyInfo = async (injectedCookie?: string): Promise<MyInfo> => {
  const res = await axios.get<MyInfo>(
    "/api/myinfo",
    injectedCookie
      ? {
          headers: {
            Cookie: injectedCookie,
          },
        }
      : undefined
  );
  return res.data;
};
