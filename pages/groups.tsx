import { Container } from "@chakra-ui/react";
import Head from "next/head";
import { GetServerSideProps, NextPage } from "next";
import GNB from "../components/GNB";
import { withAdviceSSR } from "../middleware";
import { useAuth } from "../hooks/useAuth";
import { useQuery } from "react-query";
import { getMyGroups } from "../repo/groups";

const getGroupsPageProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};
export const getServerSideProps = withAdviceSSR(getGroupsPageProps);

const Groups: NextPage = () => {
  useAuth();

  const myInfo = useQuery("myGroups", getMyGroups);

  return (
    <Container maxW="container.xl">
      <Head>
        <title>그룹스 - 교환일기</title>
      </Head>
      <GNB />
      그룹스 페이지
    </Container>
  );
};

export default Groups;
