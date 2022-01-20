import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { useState } from "react";
import { ReactQueryDevtools } from "react-query/devtools";
import axios from "axios";

// axios baseURL 설정
const isServer = typeof window === "undefined";
axios.defaults.baseURL = isServer ? "http://localhost:3000" : "";

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 10 * 1000 },
        },
      })
  );
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </Hydrate>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default MyApp;
