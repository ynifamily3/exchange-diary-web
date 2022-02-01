import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const useDisposeRedirection = () => {
  const toast = useToast({ position: "top-right", isClosable: true });

  const [redirectReason, setRedirectReason] = useState<string>("");
  const defaultIsOpenLoginPopover = Boolean(redirectReason);

  useEffect(() => {
    // get cookie
    const cookies = document.cookie;

    // extract redirectReason from cookie
    const redirectReason =
      cookies
        .split(";")
        .find((cookie) => cookie.startsWith("redirectReason="))
        ?.split("=")[1] ?? "";

    // remove cookie
    document.cookie = "redirectReason=; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    setRedirectReason(redirectReason);
  }, []);

  useEffect(() => {
    if (!redirectReason) return;
    toast({
      title: redirectReason,
      description: `로그인이 필요합니다.`,
    });
  }, [redirectReason, toast]);

  return defaultIsOpenLoginPopover;
};

export default useDisposeRedirection;
