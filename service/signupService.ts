import { loginService } from "./loginService";
import { SignUpServiceInput, SignUpServiceResult } from "./../types/index";
import axios from "axios";
export const signupService = async (
  SignUpServiceInput: SignUpServiceInput
): Promise<SignUpServiceResult> => {
  const { memberId, memberNickname, memberPassword } = SignUpServiceInput;

  // 백엔드 회원가입 처리
  try {
    await axios.post(
      "/member/sign",
      {
        memberId,
        memberNickname,
        memberPassword,
      },
      { baseURL: process.env.BACKEND_URL }
    );
  } catch (e) {
    return null;
  }
  return await loginService({ id: memberId, password: memberPassword });
};
