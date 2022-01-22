import jsonwebtoken from "jsonwebtoken";

type Identity = {
  id: string;
  password: string;
};
type AccessToken = string;

export const loginService = async (
  identity: Identity
): Promise<AccessToken> => {
  const { id, password } = identity;
  const privateKey = process.env.JWT_KEY || "";

  // TODO 백엔드와 통신해서 결과 얻어오기
  const accessToken = jsonwebtoken.sign(
    {
      id,
      nickname: `${id}의 닉네임`,
    },
    privateKey,
    { algorithm: "HS256", expiresIn: "1h" }
  );

  return accessToken;
};
