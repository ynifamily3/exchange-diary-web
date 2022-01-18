import axios from "axios";
export interface Login {
  isLogin: boolean;
  nickname?: string;
}

export const postLogin = async ({
  id,
  password,
}: {
  id: string;
  password: string;
}): Promise<Login> => {
  const res = await axios.post<Login>("/api/login", {
    id,
    password,
  });
  return res.data;
};
