import {
  Box,
  Container,
  SimpleGrid,
  Skeleton,
  Text,
  Img,
  AspectRatio,
  Progress,
  Tooltip,
  Button,
} from "@chakra-ui/react";
import Head from "next/head";
import { GetServerSideProps, NextPage } from "next";
import GNB from "../components/GNB";
import { withAdviceSSR } from "../middleware";
import { useAuth } from "../hooks/useAuth";
import { useQuery } from "react-query";
import { getMyTeams } from "../repo/teams";

const getTeamsPageProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};
export const getServerSideProps = withAdviceSSR(getTeamsPageProps);

const Teams: NextPage = () => {
  useAuth();
  const myTeams = useQuery("myTeams", getMyTeams);

  return (
    <Container maxW="container.xl">
      <Head>
        <title>팀 - 교환일기</title>
      </Head>
      <GNB />
      {myTeams.isLoading && <Skeleton height="80px"></Skeleton>}
      {myTeams.isSuccess && (
        <SimpleGrid columns={[1, 2, 3, 4, 5]} spacing={4}>
          {myTeams.data.map((team) => (
            <Box
              key={team.teamId}
              boxShadow="xs"
              rounded="md"
              overflow="hidden"
            >
              <Img
                w="100%"
                h="150px"
                objectFit="cover"
                src={team.teamPhotoUrl ?? "/arona.png"}
                alt={team.teamName + "의 커버 이미지"}
                title={team.teamName + "의 커버 이미지"}
              />
              <Box p={2}>
                <Text fontSize="2xl">{team.teamName}</Text>
                <Progress
                  colorScheme="green"
                  size="sm"
                  value={
                    (team.numberOfTeamMemberWhoPassed /
                      team.numberOfTeamMember) *
                    100
                  }
                />
                <Tooltip
                  label={`오늘 ${team.teamName}팀에서 일기를 쓴 사람의 비율`}
                >
                  <Text fontSize="md" align={"right"}>
                    {team.numberOfTeamMemberWhoPassed} /{" "}
                    {team.numberOfTeamMember}
                  </Text>
                </Tooltip>

                <Text fontSize="sm">{team.teamPublicUrl}</Text>
              </Box>
            </Box>
          ))}
          <Button h="100%" boxShadow="xs" rounded="md" overflow="hidden">
            ~팀 생성~
          </Button>
        </SimpleGrid>
      )}
    </Container>
  );
};

export default Teams;
