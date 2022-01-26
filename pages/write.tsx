import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import NextLink from "next/link";
import { css } from "@emotion/react";
import {
  dehydrate,
  QueryClient,
  useMutation,
  useQueries,
  useQuery,
} from "react-query";
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
  Menu,
  MenuButton,
  Spinner,
  Flex,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { MyInfoServiceResult, SignUpApiInput } from "../types";
import { postSignUp } from "../repo/signup";
import { useRouter } from "next/router";
import FontFaceObserver from "fontfaceobserver";
import { fontData, pretendardFont } from "../util/font";
import {
  ArrowForwardIcon,
  CheckIcon,
  ChevronDownIcon,
  CloseIcon,
  SmallCloseIcon,
} from "@chakra-ui/icons";
// import { Image, Layer, Stage } from "react-konva";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  // const queryClient = new QueryClient();
  // const isCSR = !req || (req.url && req.url.startsWith("/_next/data"));
  // if (!isCSR) {
  //   const { cookies } = req;
  //   await Promise.all([
  //     queryClient.prefetchQuery("myInfo", () =>
  //       myInfoService(cookies["accessToken"])
  //     ),
  //   ]);
  //   if (!queryClient.getQueryData<MyInfoServiceResult>("myInfo")?.isLogin) {
  //     res.setHeader("Set-Cookie", [`redirectReason=Not Login; Path=/`]);
  //     return {
  //       redirect: {
  //         destination: "/",
  //       },
  //       props: {},
  //     };
  //   }
  // }
  // return {
  //   props: {
  //     dehydratedState: dehydrate(queryClient),
  //   },
  // };
  return { props: {} };
};
const inLayData = ["diary.png"];

const Write: NextPage = () => {
  const toast = useToast();
  const router = useRouter();
  // const { data: myInfoData } = useQuery("myInfo", getMyInfo);

  const [fontTouched, setFontTouched] = useState(() =>
    Array.from({ length: fontData.length }, (_, i) => i === 0)
  );
  const [font, setFont] = useState(0);
  // control touched (한 번 선택된 폰트는 touched로 처리하여 다운로드 트리거)
  useEffect(() => {
    setFontTouched((prev) =>
      prev.map((touched, i) => (i === font ? true : touched))
    );
  }, [font]);
  const queries = useMemo(() => {
    return fontTouched.map((touched, i) => ({
      queryKey: ["font", i],
      queryFn: async () => {
        return await pretendardFont[i].load(null, 10 * 1000);
      },
      enabled: touched,
      staleTime: Infinity,
    }));
  }, [fontTouched]);
  const fontQueriesResult = useQueries(queries);
  const fontLoadingState = useMemo(
    () => fontQueriesResult.map((result) => result.isLoading),
    [fontQueriesResult]
  );
  const fontReadyState = useMemo(
    () => fontQueriesResult.map((result) => result.isSuccess),
    [fontQueriesResult]
  );
  const fontErrorState = useMemo(
    () => fontQueriesResult.map((result) => result.isError),
    [fontQueriesResult]
  );

  // login check
  // useEffect(() => {
  //   if (!myInfoData) return;
  //   if (!myInfoData.isLogin) {
  //     document.cookie = `redirectReason=Not Login; Path=/`;
  //     router.replace("/");
  //   }
  // }, [myInfoData, router]);

  // font load

  // if (!myInfoData?.isLogin) {
  //   return null;
  // }
  const [inlay, setInlay] = useState(0);
  // base64 image
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [content, setContent] = useState("");

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
          <Box alignSelf={"flex-start"}>
            <Menu autoSelect={false}>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                <Flex alignItems={"center"} gap={3}>
                  {fontData[font]}{" "}
                  {fontLoadingState[font] && <Spinner size="xs" />}
                  {fontReadyState[font] && <CheckIcon color={"blue.500"} />}
                  {fontErrorState[font] && <SmallCloseIcon color={"red.500"} />}
                </Flex>
              </MenuButton>
              <MenuList>
                {fontData.map((fontItem, i) => (
                  <MenuItem
                    icon={
                      fontItem === fontData[font] ? (
                        <ArrowForwardIcon />
                      ) : undefined
                    }
                    key={fontItem}
                    onClick={() => setFont(i)}
                  >
                    <Flex alignItems={"center"} gap={3}>
                      {fontItem} {fontLoadingState[i] && <Spinner size="xs" />}
                      {fontReadyState[i] && <CheckIcon color={"blue.500"} />}
                      {fontErrorState[i] && (
                        <SmallCloseIcon color={"red.500"} />
                      )}
                    </Flex>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Box>
          <Box>
            {/* <Stage width={500} height={500}>
              <Layer></Layer>
            </Stage> */}
          </Box>
        </VStack>
      </Container>
    </>
  );
};

export default Write;
