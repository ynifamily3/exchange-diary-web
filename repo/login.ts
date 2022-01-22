import { LoginApiResult } from "./../types/index";
import axios from "axios";
import { LoginApiInput } from "../types";
export const postLogin = async ({
  id,
  password,
}: LoginApiInput): Promise<LoginApiResult> => {
  await axios.post("/api/login", {
    id,
    password,
  });
};
