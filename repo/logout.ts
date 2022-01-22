import axios from "axios";

export const postLogout = async () => {
  await axios.post("/api/logout");
};
