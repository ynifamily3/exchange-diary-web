import { GetServerSideProps, NextPage } from "next";
import { withAdviceSSR } from "../middleware";

const getGroupsPageProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};
export const getServerSideProps = withAdviceSSR(getGroupsPageProps);

const Groups: NextPage = () => {
  return <div>그룹스 페이지</div>;
};

export default Groups;
