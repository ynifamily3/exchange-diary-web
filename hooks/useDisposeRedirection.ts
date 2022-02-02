import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useReplaceableToast from "./useReplaceableToast";

const useDisposeRedirection = () => {
  const toast = useReplaceableToast({
    position: "top-right",
    isClosable: true,
  });

  const [redirectReason, setRedirectReason] = useState<string>("");
  const defaultIsOpenLoginPopover = Boolean(redirectReason);
  const router = useRouter();

  useEffect(() => {
    const redirectReason = String(router.query.redirectReason);
    if (redirectReason === "NotLogin") {
      toast({
        title: redirectReason,
        description: `로그인이 필요합니다.`,
      });
      // remove query
      setRedirectReason("");
      router.replace("/");
    }
  }, [router, toast]);

  return defaultIsOpenLoginPopover;
};

export default useDisposeRedirection;
