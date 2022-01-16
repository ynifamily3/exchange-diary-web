import type { NextPage } from "next";
import Head from "next/head";
import NextLink from "next/link";
import { Link } from "@chakra-ui/react";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>교환일기</title>
      </Head>
      <h1>Hello, World</h1>

      <NextLink href="/hello" passHref shallow>
        <Link>헬로우로...</Link>
      </NextLink>
    </div>
  );
};

export default Home;
