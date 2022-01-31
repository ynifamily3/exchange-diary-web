import { useToast, UseToastOptions } from "@chakra-ui/react";
import { useRef } from "react";
type ToastOptions = UseToastOptions | undefined;

const useReplaceableToast = (options: ToastOptions) => {
  const toast = useToast(options);
  const toastIdRef = useRef<number>(0);
  const replaceableToast = (options: ToastOptions) => {
    const id = (options?.id ?? "default") + String(toastIdRef.current++ % 20);
    const nextId = (options?.id ?? "default") + String(toastIdRef.current);
    toast.close(id);
    toast({ ...options, id: nextId });
  };
  return replaceableToast;
};

export default useReplaceableToast;
