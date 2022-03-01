import axios from "axios";
import { MyTeamsApiResult } from "../types";
export const getMyTeams = async (): Promise<MyTeamsApiResult> => {
  const res = await axios.get("/api/myTeams");
  return res.data;
};
