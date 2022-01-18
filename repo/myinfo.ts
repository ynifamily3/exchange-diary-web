import axios from "axios";
interface MyInfo {
  isLogin: boolean;
  nickname?: string;
}

export const getMyInfo = async (): Promise<MyInfo> => {
  const res = await axios.get<MyInfo>("/api/myinfo");
  return res.data;
};
