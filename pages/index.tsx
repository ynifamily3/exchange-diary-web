import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import NextLink from "next/link";
import { css } from "@emotion/react";
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Skeleton,
  Spacer,
  Stack,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import Image from "next/image";
import React, { forwardRef, useEffect, useRef } from "react";
import {
  dehydrate,
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { getMyInfo } from "../repo/myinfo";
import { postLogin } from "../repo/login";
import { postLogout } from "../repo/logout";
import { myInfoService } from "../service/myInfoService";

type InputProps = React.ComponentProps<typeof Input>;

type TextInputProps = InputProps & {
  label: string;
  id: string;
};
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const queryClient = new QueryClient();
  const isCSR = !req || (req.url && req.url.startsWith("/_next/data"));
  if (!isCSR) {
    const cookies = req.cookies;
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

const TextInput = forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
  return (
    <FormControl>
      <FormLabel htmlFor={props.id}>{props.label}</FormLabel>
      <Input {...props} id={props.id} ref={ref} />
    </FormControl>
  );
});
TextInput.displayName = "TextInput"; // eslint error를 피할 수 있다.

const LoginForm = ({
  firstFieldRef,
  onCancel,
}: {
  firstFieldRef: React.RefObject<HTMLInputElement>;
  onCancel: () => void;
}) => {
  const toast = useToast({ isClosable: true, position: "top-end" });
  const queryClient = useQueryClient();
  const [idValue, setIdValue] = React.useState("");
  const [passwordValue, setPasswordValue] = React.useState("");
  const mutation = useMutation(postLogin, {
    onSuccess: () => {
      queryClient.invalidateQueries("myInfo");
      // close the popover
      onCancel();
    },
    onError: () => {
      // handle login Error
      toast({
        id: "login-error",
        title: "로그인",
        description: "아이디 또는 비밀번호가 일치하지 않습니다.",
        status: "error",
        duration: 5 * 1000,
      });
    },
    onSettled: () => {},
  });
  const isDisabled = !idValue || !passwordValue;
  const isLogining = mutation.isLoading;

  const handleLogin = () => {
    mutation.mutate({ id: idValue, password: passwordValue });
  };

  // handle enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (isLogining) return;
      if (isDisabled) return;
      handleLogin();
    }
  };

  return (
    <Stack spacing={4}>
      <TextInput
        label="아이디"
        id="id"
        ref={firstFieldRef}
        value={idValue}
        onChange={(e: any) => setIdValue(e.target.value)}
        disabled={isLogining}
        onKeyDown={handleKeyDown}
      />
      <TextInput
        label="비밀번호"
        id="password"
        type="password"
        value={passwordValue}
        onChange={(e: any) => setPasswordValue(e.target.value)}
        disabled={isLogining}
        onKeyDown={handleKeyDown}
      />
      <ButtonGroup d="flex" justifyContent="flex-end">
        <Button onClick={onCancel}>취소</Button>
        <Button
          isDisabled={isDisabled}
          colorScheme={"teal"}
          isLoading={isLogining}
          onClick={handleLogin}
        >
          로그인
        </Button>
      </ButtonGroup>
    </Stack>
  );
};
LoginForm.displayName = "LoginForm";

const Home: NextPage = () => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const toast = useToast();
  const queryClient = useQueryClient();
  const mutation = useMutation(postLogout, {
    onSuccess: () => {
      queryClient.invalidateQueries("myInfo");
    },
  });
  const { data, isFetching } = useQuery("myInfo", getMyInfo);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const isLogin = data && data.isLogin;
  const nickname = data && data.isLogin && data.nickname;
  const handleLogout = () => {
    mutation.mutate();
  };
  useEffect(() => {
    console.log("run effect");
    // get cookie
    const cookies = document.cookie;
    // extract redirectReason from cookie
    const redirectReason = cookies
      .split(";")
      .find((cookie) => cookie.startsWith("redirectReason="))
      ?.split("=")[1];
    // remove cookie
    document.cookie = "redirectReason=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    if (!redirectReason) return;
    toast({
      title: redirectReason,
      description: `로그인이 필요합니다.`,
    });
    onOpen();
    setTimeout(() => firstFieldRef.current?.focus(), 0); // 이상하게 수동으로 트리거 해 줘야 한다.
  }, [toast, onOpen]);
  return (
    <>
      <Head>
        <title>교환일기</title>
      </Head>
      <Container maxW="container.xl">
        <HStack>
          <Heading paddingBlock={3}>교환일기</Heading>
          <Spacer />
          {isFetching && <Skeleton width="30px" height="18px" />}
          {isLogin && <Badge colorScheme="green">{nickname}</Badge>}
          {!isLogin && (
            <Popover
              isOpen={isOpen}
              initialFocusRef={firstFieldRef}
              onOpen={onOpen}
              onClose={onClose}
              placement="bottom-end"
              /* 3rd party extension 상호작용 문제 등이 발생할 수 있음 ex) 1password */
              closeOnBlur={false}
            >
              <PopoverTrigger>
                <Button>로그인</Button>
              </PopoverTrigger>
              <Portal>
                <PopoverContent p={5}>
                  {/* <FocusLock> */}
                  <PopoverArrow />
                  <LoginForm firstFieldRef={firstFieldRef} onCancel={onClose} />
                  {/* </FocusLock> */}
                </PopoverContent>
              </Portal>
            </Popover>
          )}
          {isLogin && (
            <Button onClick={handleLogout} isLoading={mutation.isLoading}>
              로그아웃
            </Button>
          )}
          {!isLogin && (
            <NextLink href="/signup" passHref>
              <Button as="a">회원가입</Button>
            </NextLink>
          )}
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
            <NextLink href="/hello" passHref>
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
            <Flex
              w="300%"
              css={css`
                /* transform: translateX(${471 * 2}px); */
              `}
            >
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
