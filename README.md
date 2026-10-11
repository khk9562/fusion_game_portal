# 퓨전 게임 포털 (fusion_game_portal)

여러 미니 게임을 한 주소에서 고르고 바로 플레이하는 포털입니다.
게임 코드는 각 저장소에서 따로 개발하고 배포합니다. 이 저장소에는 포털 화면과 주소 연결 설정만 둡니다.

| 포털 경로 | 게임 | 저장소 | 게임 배포 주소 |
|---|---|---|---|
| `/games/turtle-rider/` | 거북 라이더 | [turtle-rider](https://github.com/khk9562/turtle-rider) | https://turtle-rider.vercel.app |
| `/games/cattetris/` | 냥스택 | [cattetris](https://github.com/khk9562/cattetris) | https://cattetris.vercel.app |
| `/games/philosophy/` | 당신이 철학과 학생이 된다면? | [WhatIfYouWereAPhilosophyStudent](https://github.com/khk9562/WhatIfYouWereAPhilosophyStudent) | https://what-if-you-were-a-philosophy-student.vercel.app |

## 동작 방식

```
사용자 ── 포털주소/                     → 이 저장소의 포털 화면
      └─ 포털주소/games/<slug>/...      → vercel.json rewrites → 각 게임의 Vercel 배포
```

- 포털과 게임은 각자 Vercel 프로젝트로 배포됩니다. 게임 저장소에 푸시하면 그 게임만 다시 배포되고, 포털은 손댈 필요가 없습니다.
- 사용자는 포털 주소 안에서 게임을 하게 됩니다. 각 게임의 원래 배포 주소로 직접 들어가도 그대로 동작합니다.
- 끝 슬래시 없는 주소(`/games/cattetris`)는 슬래시가 붙은 주소로 보냅니다. 게임이 상대 경로로 자산을 불러오기 때문입니다.

## 게임 쪽 조건

포털의 하위 경로(`/games/<slug>/`)에서도 동작하려면 게임이 **상대 경로**로 자산을 불러와야 합니다.

- Vite: `vite.config.ts`에 `base: './'`
- Create React App: `package.json`에 `"homepage": "."`
- 라우터를 쓰면 basename을 현재 주소에서 계산합니다(예: 철학과 게임의 `src/shared/basename.ts`).
- `/icons/...`처럼 `/`로 시작하는 경로를 쓰지 않습니다.

## 게임 추가하기

1. 게임 저장소를 Vercel에 Import해 배포 주소를 만듭니다.
2. `src/games.ts`에 게임 정보를 추가합니다.
3. `src/thumbnails/sprites.ts`에 썸네일 픽셀 아트를 추가합니다.
4. `vercel.json`에 redirect 1개와 rewrite 1개를 추가합니다.
5. `npm test`로 경로와 썸네일을 확인합니다.

## 개발

```bash
npm install
npm run dev     # 개발 서버. /games/* 요청은 vercel.json 규칙대로 각 게임 배포로 프록시
npm test        # vercel.json 경로 규칙, 썸네일 확인
npm run lint
npm run build   # dist/
```

## 배포 (Vercel)

1. vercel.com에서 이 저장소를 Import합니다(Vite 자동 인식, 출력 폴더 `dist`).
2. 각 게임 저장소도 각각 Import합니다. 배포 주소가 위 표와 다르면 `vercel.json`의 rewrites를 실제 주소로 고칩니다.
3. 이후 main에 푸시할 때마다 자동으로 배포됩니다.
