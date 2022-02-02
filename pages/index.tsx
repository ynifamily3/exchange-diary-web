import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import NextLink from "next/link";
import { css } from "@emotion/react";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  IconButton,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import Image from "next/image";
import { withAdviceSSR } from "../middleware";
import GNB from "../components/GNB";

import useDisposeRedirection from "../hooks/useDisposeRedirection";
import { useEffect } from "react";
import nProgress from "nprogress";

const getIndexPageProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};
export const getServerSideProps = withAdviceSSR(getIndexPageProps);

const Home: NextPage = () => {
  const defaultIsOpenLoginPopover = useDisposeRedirection();

  return (
    <>
      <Head>
        <title>교환일기</title>
      </Head>
      <Container maxW="container.xl">
        <HStack>
          <Heading paddingBlock={3}>교환일기</Heading>
          <Spacer />
          <GNB defaultIsOpenLoginPopover={defaultIsOpenLoginPopover} />
        </HStack>
        <VStack
          as="article"
          paddingTop={3}
          paddingBottom={3}
          align={"flex-start"}
        >
          <Text as="p">
            교환일기 써보셨나요? 교환일기로 상대가 어떤 하루를 보냈는지 공유하는
            재미도 있고, 원한다면 상대에게 피드백을 줄 수 있고 나 또한
            마찬가지에요. 서로서로를 위하여 교환일기를 써 볼까요?
          </Text>
          <Text as="p">
            상대방의 하루가 궁금하세요 ? 그 날의 일기를 읽으려면 먼저 내가
            일기를 써야 해요 .
          </Text>

          <Text as="p">
            궁금하면 오늘 하루를 정리하면서 일기를 써 보는 건 어떨까요?
          </Text>
          <Text as="p">
            그룹 혹은 1 대 1 교환일기로 서로의 하루를 공유하세요 .
          </Text>
          <Text as="p">
            교환일기로 상대가 어떤 하루를 보냈는지 공유하는 재미도 있고,
            원한다면 상대에게 피드백을 줄 수 있고 나 또한 마찬가지에요.{" "}
          </Text>
          <Text as="p">
            그룹 혹은 1 대 1 이 아니여도 공개된 공간에 게시한 다른 사람들의
            하루를 읽을 수 있고 나도 공유할 수 있어요.
          </Text>
        </VStack>
        <VStack spacing={4} position={"relative"}>
          <Box>
            <NextLink href="/write" passHref>
              <Button as="a">시작하기</Button>
            </NextLink>
          </Box>
          <Box width="100%" overflow={"hidden"}>
            <IconButton
              aria-label="이전 일기"
              icon={<ArrowLeftIcon />}
              position={"absolute"}
              top={"50%"}
              css={css`
                transform: translateY(-50%);
              `}
              left={0}
              zIndex={1}
            />
            <Flex w="300%">
              <Flex justify={"center"} bg={"red.100"} w="inherit">
                <Image
                  loading="lazy"
                  src="/example1.png"
                  alt="교환일기 예시"
                  width="471px"
                  height="644px"
                />
              </Flex>
              <Flex justify={"center"} bg={"red.200"} w="inherit">
                <Image
                  loading="lazy"
                  src="/example1.png"
                  alt="교환일기 예시"
                  width="471px"
                  height="644px"
                />
              </Flex>
              <Flex justify={"center"} bg={"red.300"} w="inherit">
                <Image
                  loading="lazy"
                  src="/example1.png"
                  alt="교환일기 예시"
                  width="471px"
                  height="644px"
                />
              </Flex>
            </Flex>
            <IconButton
              aria-label="다음 일기"
              icon={<ArrowRightIcon />}
              position={"absolute"}
              top={"50%"}
              css={css`
                transform: translateY(-50%);
              `}
              right={0}
              zIndex={1}
            />
          </Box>
        </VStack>
      </Container>
    </>
  );
};

export default Home;
