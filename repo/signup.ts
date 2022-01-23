import { SignUpApiInput, SignUpApiResult } from "./../types/index";
import axios from "axios";

export const postSignUp = async (
  signUpApiInput: SignUpApiInput
): Promise<SignUpApiResult> => {
  await axios.post("/api/signup", signUpApiInput);
};
