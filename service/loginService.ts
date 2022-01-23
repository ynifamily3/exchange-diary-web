import axios from "axios";
import { Identity, LoginServiceResult } from "../types";
export const loginService = async (
  identity: Identity
): Promise<LoginServiceResult> => {
  const { id, password } = identity;
  try {
    const rst = await axios.post<LoginServiceResult>(
      "/member/login",
      {
        memberId: id,
        memberPassword: password,
      },
      { baseURL: process.env.BACKEND_URL }
    );
    return rst.data;
  } catch (e) {
    return null;
  }
};
