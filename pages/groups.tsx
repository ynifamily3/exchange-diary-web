import { Container } from "@chakra-ui/react";
import { GetServerSideProps, NextPage } from "next";
import GNB from "../components/GNB";
import { withAdviceSSR } from "../middleware";

const getGroupsPageProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};
export const getServerSideProps = withAdviceSSR(getGroupsPageProps);

const Groups: NextPage = () => {
  return (
    <Container maxW="container.xl">
      <GNB />
      그룹스 페이지
    </Container>
  );
};

export default Groups;
