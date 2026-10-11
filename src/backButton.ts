// 게임 화면에 띄우는 "포털로 돌아가기" 버튼. 빌드할 때 scripts/build-games.ts가 각 게임의 HTML에 넣는다.
// 게임 코드를 고치지 않아도 되고, 새 게임도 자동으로 버튼이 생긴다.
export type BackButtonPosition = 'top-center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

const MARKER = '<!-- fusion-game-portal:back-button -->';

const POSITION_CSS: Record<BackButtonPosition, string> = {
  'top-center': 'top:calc(env(safe-area-inset-top) + 8px);left:50%;transform:translateX(-50%)',
  'top-left': 'top:calc(env(safe-area-inset-top) + 8px);left:calc(env(safe-area-inset-left) + 8px)',
  'top-right': 'top:calc(env(safe-area-inset-top) + 8px);right:calc(env(safe-area-inset-right) + 8px)',
  'bottom-left': 'bottom:calc(env(safe-area-inset-bottom) + 8px);left:calc(env(safe-area-inset-left) + 8px)',
  'bottom-right': 'bottom:calc(env(safe-area-inset-bottom) + 8px);right:calc(env(safe-area-inset-right) + 8px)',
};

export function backButtonSnippet(position: BackButtonPosition = 'top-center') {
  return `${MARKER}
<style>
#fgp-back{position:fixed;z-index:2147483647;${POSITION_CSS[position]};display:inline-flex;align-items:center;gap:4px;height:30px;padding:0 12px 0 9px;border-radius:999px;background:rgba(20,21,26,.72);color:#fff;font:600 13px/1 -apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Noto Sans KR",sans-serif;letter-spacing:-.01em;text-decoration:none;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);box-shadow:0 4px 14px rgba(0,0,0,.22);opacity:.88;transition:opacity .15s;-webkit-tap-highlight-color:transparent;touch-action:manipulation}
#fgp-back:hover,#fgp-back:focus-visible{opacity:1}
#fgp-back:focus-visible{outline:2px solid #f2c14e;outline-offset:2px}
#fgp-back svg{width:14px;height:14px;flex:none}
@media print{#fgp-back{display:none}}
</style>
<a id="fgp-back" href="../../" aria-label="게임 포털로 돌아가기"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 3 5 8l5 5"/></svg>포털</a>
<script>(function(){var a=document.getElementById('fgp-back'),p=location.pathname,i=p.lastIndexOf('/games/');if(a&&i>=0)a.href=p.slice(0,i+1);})();</script>
`;
}

// </body> 바로 앞에 버튼을 넣는다. 이미 들어 있으면 그대로 둔다
export function injectBackButton(html: string, position?: BackButtonPosition) {
  if (html.includes(MARKER)) return html;
  const snippet = backButtonSnippet(position);
  const index = html.lastIndexOf('</body>');
  return index >= 0 ? html.slice(0, index) + snippet + html.slice(index) : html + snippet;
}
