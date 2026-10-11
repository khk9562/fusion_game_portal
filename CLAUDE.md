# 퓨전 게임 포털 - Claude Code 규칙

## 커밋 컨벤션
- `FEAT:` 새 기능, `FIX:` 버그 수정, `DOCS:` 문서만 수정
- 각 기능/수정은 개별 커밋으로 분리할 것

## 구조 규칙
- 게임 코드는 이 저장소에 넣지 않는다. 게임은 각자 저장소와 Vercel 프로젝트에서 관리한다
- 게임 목록은 `src/games.ts`, 썸네일은 `src/thumbnails/sprites.ts`, 주소 연결은 `vercel.json` 하나에만 둔다
- `vercel.json`의 rewrite는 `/games/<slug>/(.*)` 형태로 쓴다. `:path*` 형태는 `/games/<slug>/`(끝 슬래시)와 맞지 않는다
- 변경 후 `npm run lint`, `npm test`, `npm run build`가 모두 통과해야 한다

## 스타일 규칙
- 모바일 우선. 절대 크기(px) 대신 rem, %, dvh
- CSS Modules 사용(`.module.css`). 색은 `src/global.css`의 `--color-*` 변수를 쓴다
- 반경은 `--radius`(2px) 하나만 쓴다
