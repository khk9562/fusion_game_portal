// 마지막으로 누른 게임을 기억해 카드에 표시한다. 저장소를 쓸 수 없는 환경(사생활 보호 모드 등)에서는 조용히 무시한다.
const KEY = 'fusion-game-portal:last-played';

export function readLastPlayed(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function saveLastPlayed(slug: string) {
  try {
    localStorage.setItem(KEY, slug);
  } catch {
    // 저장하지 못해도 게임 실행에는 영향이 없다
  }
}
