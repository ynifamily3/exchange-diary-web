import axios from "axios";

export const postLogout = async () => {
  const res = await axios.post("/api/logout");
  return res.data;
};
