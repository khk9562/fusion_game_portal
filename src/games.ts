// 포털에 올라가는 게임 목록. 게임 코드는 각 저장소에서 따로 관리하고, 여기에는 보여 줄 정보만 둔다.
// slug는 포털 주소(/games/<slug>/)이며 vercel.json의 redirects/rewrites와 짝이 맞아야 한다(routes.test.ts가 확인).
export type Game = {
  slug: string;
  title: string;
  englishTitle: string;
  tagline: string;
  description: string;
  tags: string[];
  repo: string;
};

export const games: Game[] = [
  {
    slug: 'turtle-rider',
    title: '거북 라이더',
    englishTitle: 'TURTLE RIDER',
    tagline: '선을 그려 거북이를 골까지',
    description: '손가락으로 길을 그리면 픽셀 거북이가 그 위를 걷습니다. 박스를 모두 지나 제한 시간 안에 도착하세요.',
    tags: ['퍼즐', '드로잉'],
    repo: 'https://github.com/khk9562/turtle-rider',
  },
  {
    slug: 'cattetris',
    title: '냥스택',
    englishTitle: 'NYANG STACK',
    tagline: '고양이를 쌓고 뭉치면 팡',
    description: '떨어지는 고양이 블록을 쌓고, 같은 고양이를 뭉쳐 터뜨리는 블록 퍼즐입니다.',
    tags: ['블록 퍼즐', '아케이드'],
    repo: 'https://github.com/khk9562/cattetris',
  },
  {
    slug: 'philosophy',
    title: '당신이 철학과 학생이 된다면?',
    englishTitle: 'PHILOSOPHY STUDENT',
    tagline: '21세기 대한민국 철학과 생존기',
    description: '질문에 답하며 대한민국 대학의 철학과 학생이 되어 봅니다. 마지막에 나의 결과를 확인하세요.',
    tags: ['선택지', '테스트'],
    repo: 'https://github.com/khk9562/WhatIfYouWereAPhilosophyStudent',
  },
];

export const gamePath = (game: Game) => `/games/${game.slug}/`;
