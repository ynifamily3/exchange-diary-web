import {
  Badge,
  Button,
  Heading,
  HStack,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
  Spacer,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useColorMode } from "@chakra-ui/system";
import { FC, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getMyInfo } from "../repo/myinfo";
import LoginForm from "./LoginForm";
import NextLink from "next/link";
import { postLogout } from "../repo/logout";

interface GNBProps {
  defaultIsOpenLoginPopover?: boolean;
}

const GNB: FC<GNBProps> = ({ defaultIsOpenLoginPopover }) => {
  const queryClient = useQueryClient();
  const { onOpen, onClose, isOpen } = useDisclosure({
    defaultIsOpen: defaultIsOpenLoginPopover,
  });
  const { data: myInfoData, isFetching } = useQuery("myInfo", getMyInfo);
  const logoutMutation = useMutation(postLogout, {
    onSuccess: () => {
      queryClient.invalidateQueries("myInfo");
    },
  });

  const firstFieldRef = useRef<HTMLInputElement>(null);

  const isLogin = myInfoData?.isLogin;
  const nickname = myInfoData?.isLogin && myInfoData.memberNickname;

  const handleLogout = () => {
    logoutMutation.mutate();
  };
  const showSkeleton = isFetching && !isLogin;

  const { colorMode, toggleColorMode } = useColorMode();

  if (!isLogin) {
    return (
      <HStack>
        <NextLink href="/" passHref>
          <Heading as="a" paddingBlock={3}>
            교환일기
          </Heading>
        </NextLink>
        <Spacer />
        {!showSkeleton ? (
          <Popover
            isOpen={isOpen}
            initialFocusRef={firstFieldRef}
            onOpen={onOpen}
            onClose={onClose}
            placement="bottom-end"
            closeOnBlur={false}
          >
            <PopoverTrigger>
              <Button>로그인</Button>
            </PopoverTrigger>
            {/* <Portal>  ==> build된거 ssr hydrate 빈 <span/>이슈 */}
            <PopoverContent p={5}>
              <PopoverArrow />
              <LoginForm firstFieldRef={firstFieldRef} onCancel={onClose} />
            </PopoverContent>
            {/* </Portal> */}
          </Popover>
        ) : (
          <Skeleton width="150px" height="20px" />
        )}
        <NextLink href="/signup" passHref>
          <Button as="a">회원가입</Button>
        </NextLink>
        <Button onClick={toggleColorMode}>
          {colorMode === "light" ? "Dark" : "Light"}
        </Button>
      </HStack>
    );
  }

  return (
    <HStack>
      <NextLink href="/" passHref>
        <Heading as="a" paddingBlock={3}>
          교환일기
        </Heading>
      </NextLink>
      <Spacer />
      <Badge colorScheme="teal" fontSize={"0.8em"}>
        {nickname}
      </Badge>
      <Text fontSize={"0.8em"}>님, 안녕하세요!</Text>
      <Button
        variant="outline"
        onClick={handleLogout}
        isLoading={logoutMutation.isLoading}
      >
        로그아웃
      </Button>
      <NextLink href="/teams" passHref>
        <Button as="a" variant="solid" colorScheme={"teal"}>
          팀
        </Button>
      </NextLink>
      <Button onClick={toggleColorMode}>
        {colorMode === "light" ? "어둡게" : "밝게"}
      </Button>
    </HStack>
  );
};

export default GNB;
