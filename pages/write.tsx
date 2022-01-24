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
import { MyInfoServiceResult, SignUpApiInput } from "../types";
import { postSignUp } from "../repo/signup";
import { useRouter } from "next/router";
import FontFaceObserver from "fontfaceobserver";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const queryClient = new QueryClient();
  const isCSR = !req || (req.url && req.url.startsWith("/_next/data"));
  if (!isCSR) {
    const { cookies } = req;
    await Promise.all([
      queryClient.prefetchQuery("myInfo", () =>
        myInfoService(cookies["accessToken"])
      ),
    ]);
    if (!queryClient.getQueryData<MyInfoServiceResult>("myInfo")?.isLogin) {
      res.setHeader("Set-Cookie", [`redirectReason=Not Login; Path=/`]);
      return {
        redirect: {
          destination: "/",
        },
        props: {},
      };
    }
  }
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

const pretendardFont = new FontFaceObserver("Pretendard");

const Write: NextPage = () => {
  const toast = useToast();
  const router = useRouter();
  const { data: myInfoData } = useQuery("myInfo", getMyInfo);
  const { data: pretendardFontData } = useQuery(
    ["font", "Pretendard"],
    async () => {
      await pretendardFont.load();
    },
    { enabled: myInfoData?.isLogin, staleTime: Infinity }
  );
  // login check
  useEffect(() => {
    if (!myInfoData) return;
    if (!myInfoData.isLogin) {
      document.cookie = `redirectReason=Not Login; Path=/`;
      router.replace("/");
    }
  }, [myInfoData, router]);

  // font load

  if (!myInfoData?.isLogin) {
    return null;
  }

  return (
    <>
      <Head>
        <title>일기 작성 - 교환일기</title>
      </Head>
      <Container maxW="container.xl">
        <VStack>
          <Heading paddingBlock={3} fontFamily={"Pretendard"}>
            일기 작성하기
          </Heading>
          <Spacer />
        </VStack>
      </Container>
    </>
  );
};

export default Write;
