// Atom Types
export type Identity = {
  id: string;
  password: string;
};

export type MyInfo = {
  id: string;
  nickname: string;
};
export type AccessToken = string;

export type JWT<Payload> = Payload & {
  iat: number;
  exp: number;
};

export type JWTMyinfoPayload = MyInfo;

// Provided to Service Functions input & result
export type LoginServiceInput = Identity;
export type LoginServiceResult = AccessToken;
export type MyInfoServiceInput = AccessToken;
export type MyInfoServiceResult =
  | ({
      isLogin: true;
    } & MyInfo)
  | {
      isLogin: false;
    };

// API payload & result
export type LoginApiInput = Identity;
export type LoginApiResult = void;
export type MyInfoApiResult = MyInfoServiceResult;
