import {
  Badge,
  Button,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  Portal,
  useDisclosure,
} from "@chakra-ui/react";
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
  const { data: myInfoData } = useQuery("myInfo", getMyInfo, {
    suspense: true,
  });
  const logoutMutation = useMutation(postLogout, {
    onSuccess: () => {
      queryClient.invalidateQueries("myInfo");
    },
  });

  const firstFieldRef = useRef<HTMLInputElement>(null);

  const isLogin = myInfoData!.isLogin;
  const nickname = myInfoData?.isLogin && myInfoData.memberNickname;

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (!isLogin) {
    return (
      <>
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
          <Portal>
            <PopoverContent p={5}>
              <PopoverArrow />
              <LoginForm firstFieldRef={firstFieldRef} onCancel={onClose} />
            </PopoverContent>
          </Portal>
        </Popover>
        <NextLink href="/signup" passHref>
          <Button as="a">회원가입</Button>
        </NextLink>
      </>
    );
  }

  return (
    <>
      <Badge colorScheme="green">{nickname}</Badge>
      <Button onClick={handleLogout} isLoading={logoutMutation.isLoading}>
        로그아웃
      </Button>
    </>
  );
};

export default GNB;
