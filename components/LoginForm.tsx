import { Button, ButtonGroup, Stack } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "react-query";
import useReplaceableToast from "../hooks/useReplaceableToast";
import { postLogin } from "../repo/login";
import TextInput from "./atom/TextInput";

const LoginForm = ({
  firstFieldRef,
  onCancel,
}: {
  firstFieldRef: React.RefObject<HTMLInputElement>;
  onCancel: () => void;
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation(postLogin);
  const toast = useReplaceableToast({ isClosable: true, position: "top-end" });

  const handleLogin = (id: string, password: string) => {
    mutation.mutate(
      { id, password },
      {
        onSuccess: () => {
          queryClient.invalidateQueries("myInfo");
          onCancel();
        },
        onError: () => {
          toast({
            id: "login-error",
            title: "로그인",
            description: "아이디 또는 비밀번호가 일치하지 않습니다.",
            status: "error",
            duration: 5 * 1000,
          });
        },
      }
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const id = formData.get("id") as string;
    const password = formData.get("password") as string;
    handleLogin(id, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={4}>
        <TextInput label="아이디" id="id" name="id" ref={firstFieldRef} />
        <TextInput
          label="비밀번호"
          id="password"
          name="password"
          type="password"
        />
        <ButtonGroup d="flex" justifyContent="flex-end">
          <Button onClick={onCancel}>취소</Button>
          <Button
            type="submit"
            isLoading={mutation.isLoading}
            colorScheme="twitter"
          >
            로그인
          </Button>
        </ButtonGroup>
      </Stack>
    </form>
  );
};
LoginForm.displayName = "LoginForm";

export default LoginForm;
