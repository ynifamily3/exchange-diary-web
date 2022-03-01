import { MyTeamsServiceResult } from "../types";

export const myTeamsService = async (
  accessToken: string
): Promise<MyTeamsServiceResult> => {
  // TODO: 백엔드 연결

  // 1초 ~ 3초 지연
  const delay = Math.floor(Math.random() * 3000) + 1000;
  await new Promise((resolve) => setTimeout(resolve, delay));

  return [
    {
      teamId: 1,
      teamName: "미엘",
      numberOfTeamMember: 10,
      numberOfTeamMemberWhoPassed: 3,
      teamPublicUrl: "xUd2cP",
      teamPhotoUrl: "https://picsum.photos/200/300",
    },
    {
      teamId: 2,
      teamName: "미정",
      numberOfTeamMember: 7,
      numberOfTeamMemberWhoPassed: 2,
      teamPublicUrl: "xxo3b1",
      teamPhotoUrl: null,
    },
    {
      teamId: 3,
      teamName: "복실",
      numberOfTeamMember: 3,
      numberOfTeamMemberWhoPassed: 1,
      teamPublicUrl: "pWx9zN",
      teamPhotoUrl: "https://picsum.photos/200/300?r=1",
    },
  ];
};
