# 퓨전 게임 포털 (fusion_game_portal)

여러 미니 게임을 한 주소에서 고르고 바로 플레이하는 포털입니다.

- 주소: https://khk9562.github.io/fusion_game_portal/
- 게임 코드는 각 저장소에서 따로 관리합니다. 이 저장소에는 포털 화면과 "어느 저장소를 어떻게 빌드할지"만 둡니다.
- 게임을 따로 배포해 둘 필요가 없습니다. 포털을 배포할 때 각 게임 저장소의 최신 `main`을 내려받아 함께 빌드합니다.

| 포털 경로 | 게임 | 저장소 |
|---|---|---|
| `games/turtle-rider/` | 거북 라이더 | [turtle-rider](https://github.com/khk9562/turtle-rider) |
| `games/cattetris/` | 냥스택 | [cattetris](https://github.com/khk9562/cattetris) |
| `games/philosophy/` | 당신이 철학과 학생이 된다면? | [WhatIfYouWereAPhilosophyStudent](https://github.com/khk9562/WhatIfYouWereAPhilosophyStudent) |

## 동작 방식

```
GitHub Actions (deploy-pages.yml)
  1) 포털 빌드                     → dist/
  2) 게임 저장소마다 clone → npm ci → npm run build
                                   → dist/games/<slug>/
  3) dist/를 gh-pages 브랜치에 푸시 → GitHub Pages 배포
```

- 어떤 커밋으로 빌드했는지는 `games/versions.json`에 남습니다.
- 배포가 실행되는 때: 포털 `main` 푸시, Actions 탭에서 수동 실행, 매일 03:00(KST), 게임 저장소의 알림(아래).

### 게임을 고친 뒤 바로 포털에 반영하기
기본으로는 하루 한 번 자동 반영됩니다. 바로 반영하려면 둘 중 하나를 하면 됩니다.

1. 이 저장소의 **Actions > Deploy to GitHub Pages > Run workflow**를 누릅니다.
2. (자동) 게임 저장소에 아래 워크플로를 추가합니다. 게임 `main`에 푸시하면 포털이 다시 배포됩니다.
   - 이 저장소에 쓰기 권한이 있는 토큰(Fine-grained PAT, `fusion_game_portal`의 Contents: Read and write)을 만들고, 게임 저장소의 **Settings > Secrets and variables > Actions**에 `PORTAL_DISPATCH_TOKEN`으로 넣습니다.
   - 게임 저장소에 `.github/workflows/notify-portal.yml`:
     ```yaml
     name: Notify game portal
     on:
       push:
         branches: [main]
     jobs:
       notify:
         runs-on: ubuntu-latest
         steps:
           - run: |
               curl -sSf -X POST \
                 -H "Authorization: Bearer ${{ secrets.PORTAL_DISPATCH_TOKEN }}" \
                 -H "Accept: application/vnd.github+json" \
                 https://api.github.com/repos/khk9562/fusion_game_portal/dispatches \
                 -d '{"event_type":"game-updated"}'
     ```

## 게임 쪽 조건
포털의 하위 경로(`/fusion_game_portal/games/<slug>/`)에서 동작하려면 게임이 **상대 경로**로 자산을 불러와야 합니다.

- Vite: `vite.config.ts`에 `base: './'`
- Create React App: `package.json`에 `"homepage": "."`
- 라우터를 쓰면 basename을 현재 주소에서 계산합니다(예: 철학과 게임의 `src/shared/basename.ts`).
- 새로고침해도 열려야 하는 화면 경로는 `src/games.ts`의 `spaRoutes`에 적습니다. GitHub Pages는 `/select` 요청에 `select.html`을 내려주므로 빌드 때 `index.html`을 복사해 둡니다.
- `/icons/...`처럼 `/`로 시작하는 경로를 쓰지 않습니다.
- `npm ci`와 `npm run build`만으로 빌드되어야 합니다.

## 게임 추가하기
1. 게임이 위 조건을 지키는지 확인합니다.
2. `src/games.ts`에 게임 정보(저장소, 결과 폴더, 화면 경로)를 추가합니다.
3. `src/thumbnails/sprites.ts`에 썸네일 픽셀 아트를 추가합니다.
4. `npm test`와 `npm run build:all`로 확인합니다.

## 개발
```bash
npm install
npm run dev         # 포털 화면만 개발
npm test
npm run lint
npm run build       # 포털만 dist/에 빌드
npm run build:all   # 포털 + 게임 세 개 빌드(게임 코드는 .games/에 받음)
npm run preview     # build:all 결과 미리 보기
npm run deploy:pages  # 로컬에서 직접 gh-pages로 배포(평소에는 Actions가 자동 배포)
```

## GitHub Pages 설정
**Settings > Pages > Build and deployment**에서 Source가 **Deploy from a branch**, Branch가 **gh-pages / (root)**인지 확인합니다.
