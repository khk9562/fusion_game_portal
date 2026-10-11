# 퓨전 게임 포털 - Claude Code 규칙

## 커밋 컨벤션
- `FEAT:` 새 기능, `FIX:` 버그 수정, `DOCS:` 문서만 수정
- 각 기능/수정은 개별 커밋으로 분리할 것

## 구조 규칙
- 게임 코드는 이 저장소에 커밋하지 않는다. 배포할 때 `scripts/build-games.ts`가 각 게임 저장소를 `.games/`에 받아 빌드하고 `dist/games/<slug>/`에 넣는다
- 게임 화면의 "← 포털" 버튼은 빌드 때 `src/backButton.ts`가 각 게임 HTML에 넣는다. 게임 코드에는 넣지 않는다
- 게임 목록과 빌드 방법은 `src/games.ts`, 썸네일은 `src/thumbnails/sprites.ts`에만 둔다
- 포털과 게임 모두 상대 경로로 자산을 불러온다. 포털은 GitHub Pages 하위 경로(`/fusion_game_portal/`)에 올라간다
- 배포는 `.github/workflows/deploy-pages.yml`이 gh-pages 브랜치로 한다. 게임은 `game-updates.json`의 맨 위 커밋으로 빌드한다
- 게임 업데이트 기록(`game-updates.json`, `GAME_UPDATES.md`)은 `record-game-update.yml`이 쓴다. `GAME_UPDATES.md`는 직접 고치지 않는다
- 워크플로 원본은 `docs/workflows/`. `.github/workflows/`는 Claude 세션 권한으로 푸시할 수 없으므로 원본을 고치고 사용자에게 반영을 요청한다
- 변경 후 `npm run lint`, `npm test`, `npm run build`가 모두 통과해야 한다. 게임 빌드에 영향을 주는 변경이면 `npm run build:all`도 확인한다

## 스타일 규칙
- 모바일 우선. 절대 크기(px) 대신 rem, %, dvh
- CSS Modules 사용(`.module.css`). 색은 `src/global.css`의 `--color-*` 변수를 쓴다
- 반경은 `--radius`(2px) 하나만 쓴다
