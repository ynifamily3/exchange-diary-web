import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import NextLink from "next/link";
import { css } from "@emotion/react";
import { dehydrate, QueryClient, useMutation, useQuery } from "react-query";
import { myInfoService } from "../service/myInfoService";
import { getMyInfo } from "../repo/myinfo";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Heading,
  Input,
  Spacer,
  Textarea,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { SignUpApiInput } from "../types";
import { postSignUp } from "../repo/signup";

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const queryClient = new QueryClient();
  const isCSR = !req || (req.url && req.url.startsWith("/_next/data"));
  if (!isCSR) {
    const { cookies } = req;
    await Promise.all([
      queryClient.prefetchQuery("myInfo", () =>
        myInfoService(cookies["accessToken"])
      ),
    ]);
  }
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

const SignUp: NextPage = () => {
  const {} = useQuery("myInfo", getMyInfo);
  const { isLoading, mutate } = useMutation(postSignUp, {
    onSuccess: () => {
      console.log("선언부 onsuccess");
    },
  });
  const idInputRef = useRef<HTMLInputElement>(null);
  const agreeCheckboxRef = useRef<HTMLInputElement>(null);
  const [agreeChecked, setAgreeChecked] = useState(false);
  const toast = useToast();
  useEffect(() => {
    if (agreeChecked) {
      idInputRef.current?.focus();
      toast.closeAll();
    }
  }, [agreeChecked, toast]);

  const signUpAction = (signUpApiInput: SignUpApiInput) => {
    // 약관 동의 체크
    if (!agreeChecked) {
      toast({
        title: "회원가입",
        description: "약관에 동의해주세요.",
        status: "warning",
        duration: 5 * 1000,
        isClosable: true,
      });
      agreeCheckboxRef.current?.focus();
      return;
    }
    mutate(signUpApiInput, {
      onSuccess: () => {
        console.log("구현부 onsuccess");
      },
    });
    toast({
      title: "회원가입",
      description: "회원가입 돌연변이가 실행됨.",
      status: "success",
      duration: 3 * 1000,
      isClosable: true,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const sendData: SignUpApiInput = {
      memberId: "",
      memberNickname: "",
      memberPassword: "",
    };
    // get form data by name
    const formData = new FormData(e.target as HTMLFormElement);
    sendData["memberId"] = formData.get("memberId") as string;
    sendData["memberNickname"] = formData.get("memberNickname") as string;
    sendData["memberPassword"] = formData.get("memberPassword") as string;
    signUpAction(sendData);
  };

  return (
    <>
      <Head>
        <title>회원가입 - 교환일기</title>
      </Head>
      <Container maxW="container.xl">
        <VStack>
          <Heading paddingBlock={3}>회원가입</Heading>
          <Spacer />
          <Textarea
            readOnly
            defaultValue={`회원가입 약관.\n\n저희는 회원님의 개인정보를 중요하게 생각하기 때문에, 최소한의 정보만 수집하고 있습니다.`}
          />
          <Checkbox
            ref={agreeCheckboxRef}
            alignSelf={"flex-end"}
            isChecked={agreeChecked}
            onChange={() => setAgreeChecked(!agreeChecked)}
          >
            동의
          </Checkbox>
          <Container maxW="container.sm">
            <form onSubmit={handleSubmit}>
              <Box
                borderWidth={"1px"}
                borderRadius={"lg"}
                padding={4}
                display={"flex"}
                flexDirection={"column"}
                gap={4}
              >
                <Input placeholder="아이디" ref={idInputRef} name="memberId" />
                <Input placeholder="닉네임" name="memberNickname" />
                <Input
                  placeholder="비밀번호"
                  type="password"
                  name="memberPassword"
                />
                <Input
                  placeholder="비밀번호 확인"
                  type="password"
                  name="memberPasswordCheck"
                />
                <Button
                  type="submit"
                  variant={"ghost"}
                  alignSelf={"flex-end"}
                  isLoading={isLoading}
                >
                  가입하기
                </Button>
              </Box>
            </form>
          </Container>
        </VStack>
      </Container>
    </>
  );
};

export default SignUp;
