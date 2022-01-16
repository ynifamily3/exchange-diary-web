import { Link, Text } from "@chakra-ui/react";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import NextLink from "next/link";
import { dehydrate, QueryClient, useQuery } from "react-query";
import { Weather } from "../components/Weather";
import { getPosts } from "../repo/posts";
import { weather } from "../repo/weather";

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const queryClient = new QueryClient();
  const isCSR = !req || (req.url && req.url.startsWith("/_next/data"));
  if (!isCSR) {
    await Promise.all([
      queryClient.prefetchQuery("posts", getPosts),
      queryClient.prefetchQuery("weather", weather),
    ]);
  }
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

const Hello = () => {
  const { data, isLoading } = useQuery("posts", getPosts);

  return (
    <div>
      <Head>
        <title>헬로우</title>
      </Head>
      <h1>헬로우 페이지 (데이터 페칭 테스트)</h1>
      {isLoading && <strong>로딩 중 (CSR ONLY)</strong>}
      <div>
        <code>{JSON.stringify(data)}</code>
      </div>
      <div>외부 컴포넌트</div>
      <Weather />
      <Text>
        <NextLink href="/" passHref>
          <Link>집으로...</Link>
        </NextLink>
      </Text>
    </div>
  );
};

export default Hello;
