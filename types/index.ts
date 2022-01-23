// Atom Types
export type Identity = {
  id: string;
  password: string;
};

export type MyInfo = {
  id: string;
  nickname: string;
};

export type SignUpInput = {
  memberId: string;
  memberNickname: string;
  memberPassword: string;
};
export type AccessToken = string;
export type Tokens = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpireTime: string;
};

export type JWT<Payload> = Payload & {
  iat: number;
  exp: number;
};
export type JWTMyinfoPayload = MyInfo;

// Provided to Service Functions input & result
export type LoginServiceInput = Identity;
export type LoginServiceResult = Tokens | null;
export type MyInfoServiceInput = AccessToken;
export type MyInfoServiceResult =
  | ({
      isLogin: true;
    } & MyInfo)
  | {
      isLogin: false;
    };

export type SignUpServiceInput = SignUpInput;
export type SignUpServiceResult = LoginServiceResult;

// API payload & result
export type LoginApiInput = Identity;
export type LoginApiResult = void;

export type SignUpApiInput = SignUpInput;
export type SignUpApiResult = void;
export type MyInfoApiResult = MyInfoServiceResult;
