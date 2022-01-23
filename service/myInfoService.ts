import { MyInfo, MyInfoServiceInput, MyInfoServiceResult } from "../types";
import axios from "axios";

export const myInfoService = async (
  accessToken: MyInfoServiceInput
): Promise<MyInfoServiceResult> => {
  try {
    const profile = await axios.get<MyInfo>("/member/profile", {
      headers: {
        Authorization: accessToken,
      },
      baseURL: process.env.BACKEND_URL,
    });
    const ret: MyInfoServiceResult = { isLogin: true, ...profile.data };
    return ret;
  } catch (e) {
    return {
      isLogin: false,
    };
  }
};
