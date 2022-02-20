import axios from "axios";
import { MyGroupsApiResult } from "../types";
export const getMyGroups = async (): Promise<MyGroupsApiResult> => {
  return await Promise.resolve([]);
  // const res = await axios.get("/api/mygroups");
  // return res.data;
};
