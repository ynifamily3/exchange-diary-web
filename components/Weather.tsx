import { useQuery } from "react-query";
import { weather } from "../repo/weather";

export const Weather = () => {
  const { data, isLoading, isError } = useQuery("weather", weather);
  if (isLoading) {
    return <div>로딩 중...</div>;
  }
  if (isError) {
    return <div>에러 발생!</div>;
  }
  return (
    <div>
      <h1>오늘의 날씨</h1>
      <div>
        <code>{JSON.stringify(data)}</code>
      </div>
    </div>
  );
};
