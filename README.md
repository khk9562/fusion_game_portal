# 퓨전 게임 포털 (fusion_game_portal)

여러 미니 게임을 한 주소에서 고르고 바로 플레이하는 포털입니다.

- 주소: https://khk9562.github.io/fusion_game_portal/
- 업데이트 기록: [GAME_UPDATES.md](GAME_UPDATES.md)

| 포털 경로 | 게임 | 저장소 |
|---|---|---|
| `games/turtle-rider/` | 거북 라이더 | [turtle-rider](https://github.com/khk9562/turtle-rider) |
| `games/cattetris/` | 냥스택 | [cattetris](https://github.com/khk9562/cattetris) |
| `games/philosophy/` | 당신이 철학과 학생이 된다면? | [WhatIfYouWereAPhilosophyStudent](https://github.com/khk9562/WhatIfYouWereAPhilosophyStudent) |

## 배포 원리

게임 코드는 각자 저장소에만 있고, 이 저장소에는 게임 코드가 없습니다. 포털이 배포될 때마다 게임 저장소에서 코드를 받아와 함께 빌드해, 한 사이트(GitHub Pages)로 올립니다.

```
① 게임 저장소 main에 푸시
      │  notify-portal.yml (게임 저장소)
      ▼
② 포털에 "이 게임이 이 커밋으로 바뀌었다"고 알림
      │  record-game-update.yml (포털)
      ▼
③ 포털 main에 업데이트 기록 커밋
      game-updates.json  ← 게임별 커밋 기록(원본)
      GAME_UPDATES.md    ← 사람이 읽는 표
      │  deploy-pages.yml (포털)
      ▼
④ 빌드
      포털 화면 빌드 → dist/
      게임마다 기록된 맨 위 커밋을 받아 빌드 → dist/games/<slug>/
      게임 화면에 "← 포털" 버튼을 넣음
      │
      ▼
⑤ dist/를 gh-pages 브랜치에 올림 → GitHub Pages가 사이트 갱신
```

- **언제 배포되나**: 포털 `main`이 바뀔 때(③의 기록 포함)와 Actions 탭에서 **Run workflow**를 누를 때. 정기 배포는 없습니다.
- **어떤 버전이 배포되나**: `game-updates.json`에서 게임마다 맨 위에 있는 커밋입니다. 기록이 아직 없는 게임은 `main`으로 빌드합니다.
- **되돌리기**: `game-updates.json`에서 그 게임의 맨 위 항목을 지우고 커밋하면 바로 아래 커밋으로 다시 배포됩니다.
- **확인**: 배포된 사이트의 `games/versions.json`에 실제로 빌드한 커밋이 남습니다.
- **알림 권한**: 게임 저장소는 Secret `PORTAL_DISPATCH_TOKEN`(포털에 쓰기 권한이 있는 토큰)으로 포털에 알립니다.

## 새 게임 추가하기

**1. 게임 저장소 준비**
- 자산을 상대 경로로 불러오게 합니다. Vite는 `base: './'`, CRA는 `"homepage": "."`.
- `/icons/...`처럼 `/`로 시작하는 경로를 쓰지 않습니다. 라우터를 쓰면 basename을 현재 주소에서 계산합니다(예: 철학과 게임의 `src/shared/basename.ts`).
- `npm ci` → `npm run build`만으로 빌드되어야 합니다.

**2. 게임 저장소에 알림 설정**
- [`docs/workflows/notify-portal.yml`](docs/workflows/notify-portal.yml)을 그 저장소의 `.github/workflows/notify-portal.yml`로 그대로 추가합니다.
- 토큰을 새로 만들어 Secret으로 넣습니다.
  - 토큰: GitHub **Settings > Developer settings > Fine-grained tokens**. Repository access는 `fusion_game_portal`만, Permissions는 **Contents: Read and write**.
  - Secret: 게임 저장소 **Settings > Secrets and variables > Actions**에 이름 `PORTAL_DISPATCH_TOKEN`.

**3. 포털에 등록** (이 저장소)
- `src/games.ts`에 게임을 추가합니다. `slug`(포털 경로), `repo`, `outDir`(Vite는 `dist`, CRA는 `build`), 새로고침해도 열려야 하는 화면 경로가 있으면 `spaRoutes`.
- `src/thumbnails/sprites.ts`에 같은 `slug`로 썸네일 픽셀 아트를 추가합니다.
- 게임 화면에는 "← 포털" 버튼이 자동으로 들어갑니다(기본 위 가운데). 게임 버튼과 겹치면 `games.ts`의 `backButton`으로 자리를 바꿉니다(`top-left`, `top-right`, `bottom-left`, `bottom-right`).
- `npm test`, `npm run build:all`로 확인하고 `main`에 푸시합니다. 이 푸시로 포털이 배포됩니다.

**4. 확인**
- 게임 저장소에 아무 변경이나 푸시하면 `GAME_UPDATES.md`에 그 게임이 기록되고 다시 배포됩니다.

## 개발

```bash
npm install
npm run dev                       # 포털 화면만 개발
npm test && npm run lint
npm run build                     # 포털만 dist/에 빌드
npm run build:all                 # 포털 + 모든 게임(기록된 커밋, 게임 코드는 .games/에 받음)
GAMES_REF=main npm run build:all  # 기록과 상관없이 모든 게임을 최신 main으로
npm run preview                   # build:all 결과 미리 보기
```

## 참고

- GitHub Pages 설정: **Settings > Pages**에서 Source는 **Deploy from a branch**, Branch는 **gh-pages / (root)**.
- 워크플로 원본은 [`docs/workflows/`](docs/workflows/)에 있습니다. 워크플로를 고칠 때는 원본과 `.github/workflows/`의 파일을 함께 고칩니다.
- `GAME_UPDATES.md`는 `game-updates.json`에서 자동으로 만들어지므로 직접 고치지 않습니다.

## 라이선스

© 2026 StellaKHK. [MIT License](LICENSE)로 누구나 자유롭게 사용, 수정, 배포할 수 있습니다. 각 게임은 자기 저장소의 라이선스를 따릅니다.
