import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { getMyInfo } from "../repo/myinfo";

const useAuth = () => {
  const router = useRouter();
  const myInfo = useQuery("myInfo", getMyInfo);
  useEffect(() => {
    if (!myInfo.data?.isLogin) {
      document.cookie = `redirectReason=Not Login; Path=/`;
      router.replace("/");
    }
  }, [myInfo, router]);
  return myInfo;
};

export { useAuth };
