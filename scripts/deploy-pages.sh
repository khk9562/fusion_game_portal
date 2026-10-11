#!/usr/bin/env bash
# 포털과 게임을 모두 빌드(build:all)해 dist/를 gh-pages 브랜치에 올린다. GitHub Pages 소스가 gh-pages 브랜치(/ 루트)일 때 쓴다.
# 평소에는 .github/workflows/deploy-pages.yml이 자동으로 배포한다. 이 스크립트는 로컬에서 직접 배포할 때 쓴다.
set -euo pipefail

root="$(git rev-parse --show-toplevel)"
cd "$root"
rev="$(git rev-parse --short HEAD)"

npm run build:all

tmp="$(mktemp -d)"
trap 'git worktree remove --force "$tmp" >/dev/null 2>&1 || true' EXIT

if git ls-remote --exit-code --heads origin gh-pages >/dev/null 2>&1; then
  git fetch -q origin gh-pages:refs/remotes/origin/gh-pages
  git worktree add -q -B gh-pages "$tmp" origin/gh-pages
else
  git worktree add -q --detach "$tmp"
  git -C "$tmp" checkout -q --orphan gh-pages
fi

git -C "$tmp" rm -rfq --ignore-unmatch .
git -C "$tmp" clean -fdxq
cp -R dist/. "$tmp/"
# Jekyll 처리를 끄지 않으면 밑줄로 시작하는 파일이 빠질 수 있다
touch "$tmp/.nojekyll"
git -C "$tmp" add -A
if git -C "$tmp" diff --cached --quiet; then
  echo "바뀐 내용이 없습니다."
  exit 0
fi
git -C "$tmp" commit -qm "DEPLOY: main ${rev} 빌드 결과"
git -C "$tmp" push -q origin gh-pages
echo "gh-pages에 배포했습니다 (main ${rev})."
