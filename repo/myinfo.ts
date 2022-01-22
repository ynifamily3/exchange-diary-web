import axios from "axios";
import { MyInfoApiResult } from "../types";
export const getMyInfo = async (): Promise<MyInfoApiResult> => {
  const res = await axios.get("/api/myinfo");
  return res.data;
};
