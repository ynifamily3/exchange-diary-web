import {
  JWT,
  JWTMyinfoPayload,
  MyInfoServiceInput,
  MyInfoServiceResult,
} from "../types";
import jsonwebtoken from "jsonwebtoken";

export const myInfoService = async (
  accessToken: MyInfoServiceInput
): Promise<MyInfoServiceResult> => {
  const privateKey = process.env.JWT_KEY || "";
  try {
    // TODO 백엔드와 통신해서 결과 얻어오기
    const decoded = jsonwebtoken.verify(
      accessToken,
      privateKey
    ) as JWT<JWTMyinfoPayload>;
    const { id, nickname } = decoded;
    return {
      isLogin: true,
      id,
      nickname,
    };
  } catch (e) {
    return {
      isLogin: false,
    };
  }
};
