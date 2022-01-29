import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useQueries, useQuery } from "react-query";
import { getMyInfo } from "../repo/myinfo";
import {
  Box,
  Button,
  Container,
  Heading,
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
  Text,
} from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import { fontData, pretendardFont } from "../util/font";
import {
  ArrowForwardIcon,
  AttachmentIcon,
  CheckIcon,
  ChevronDownIcon,
  SmallCloseIcon,
} from "@chakra-ui/icons";
import dynamic from "next/dynamic";
import { canvasContext, CanvasData } from "../context/canvas";
import { withAdviceSSR } from "../middleware";
const DiaryCanvas = dynamic(() => import("../components/DiaryCanvas"), {
  ssr: false,
});

const getWritePageProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};

export const getServerSideProps = withAdviceSSR(getWritePageProps);

const inLayData = ["diary.png"];

const Write: NextPage = () => {
  const toast = useToast();
  const router = useRouter();
  const { data: myInfoData } = useQuery("myInfo", getMyInfo);
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
      enabled: myInfoData?.isLogin && touched,
      staleTime: Infinity,
    }));
  }, [fontTouched, myInfoData?.isLogin]);
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
  useEffect(() => {
    if (!myInfoData?.isLogin) {
      document.cookie = `redirectReason=Not Login; Path=/`;
      router.replace("/");
    }
  }, [myInfoData, router]);

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
          <Text>쓴 글이나 첨부한 이미지 드래그 가능합니다.</Text>
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
