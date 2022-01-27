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
  IconButton,
  HStack,
  Tooltip,
} from "@chakra-ui/react";
import { createContext, useEffect, useMemo, useRef, useState } from "react";
import { MyInfoServiceResult, SignUpApiInput } from "../types";
import { postSignUp } from "../repo/signup";
import { useRouter } from "next/router";
import FontFaceObserver from "fontfaceobserver";
import { fontData, pretendardFont } from "../util/font";
import {
  ArrowForwardIcon,
  AttachmentIcon,
  CheckIcon,
  ChevronDownIcon,
  CloseIcon,
  SmallCloseIcon,
} from "@chakra-ui/icons";
import dynamic from "next/dynamic";
import { canvasContext, CanvasData } from "../context/canvas";
const DiaryCanvas = dynamic(() => import("../components/DiaryCanvas"), {
  ssr: false,
});

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
  // blob url로 만들어진 image
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [content, setContent] = useState("");

  const canvasData = useMemo<CanvasData>(() => {
    return {
      fontLoaded: fontReadyState[font],
      font: fontData[font],
      text: content,
      imageUrl: attachedImage,
      inlayImageUrl: inLayData[inlay],
    };
  }, [attachedImage, content, font, fontReadyState, inlay]);

  const fileRef = useRef<HTMLInputElement>(null);
  useEffect(() => {}, [attachedImage]);

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
          <input
            type="file"
            ref={fileRef}
            onChange={(e) => {
              // get file
              const file = e.target.files?.[0];
              if (!file) return;
              // remove previous url
              attachedImage && URL.revokeObjectURL(attachedImage);
              const url = URL.createObjectURL(file);
              setAttachedImage(url);
            }}
            style={{ display: "none" }}
          />
          <HStack spacing={4}>
            <Textarea
              placeholder="일기 내용"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Tooltip label="이미지 첨부" placement="bottom">
              <IconButton
                aria-label="Search database"
                icon={<AttachmentIcon />}
                onClick={() => {
                  fileRef.current?.click();
                }}
              />
            </Tooltip>
          </HStack>
          <Box>
            <canvasContext.Provider value={canvasData}>
              <DiaryCanvas />
            </canvasContext.Provider>
          </Box>
        </VStack>
      </Container>
    </>
  );
};

export default Write;
