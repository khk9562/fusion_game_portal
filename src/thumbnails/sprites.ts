// 썸네일 픽셀 아트. 한 글자가 한 칸이고 '.'은 빈칸이다. 색 글자는 palette에 있어야 한다(games.test.ts가 확인).
// background는 CSS background 값이다. 포털의 어두운 네온 배경과 어울리게 짙은 색에 가운데만 살짝 밝힌다.
export type Sprite = { rows: string[]; palette: Record<string, string>; background: string };

export const sprites: Record<string, Sprite> = {
  'turtle-rider': {
    rows: [
      '................',
      '.....kkkkk......',
      '...kkGGgGGkk....',
      '..kGGgGGGgGGk.ss',
      '.kGgGGGGGGGgGsks',
      '.kkkkkkkkkkkkss.',
      '..ss.......ss...',
      '................',
      'llllllllllllllll',
    ],
    palette: { k: '#1f2a1c', G: '#7cc46a', g: '#3f8a3a', s: '#e9c98b', l: '#f2f2f2' },
    background: 'radial-gradient(ellipse at 50% 45%, #0f4d46 0%, #0a1f36 72%)',
  },
  cattetris: {
    rows: [
      '.k...........k.',
      '.kk.........kk.',
      '.kpk.......kpk.',
      '.kppkkkkkkkppk.',
      '.koooooooooook.',
      '.kooeoooooeook.',
      '.kooeoooooeook.',
      '.kooooopoooook.',
      '.koooowwwooook.',
      '.kkoooooooookk.',
      '..kkkkkkkkkkk..',
      '...............',
      'bbb.ccc.bbb.ccc',
      'bbb.ccc.bbb.ccc',
    ],
    palette: { k: '#3a2a20', p: '#f4a7b9', o: '#f0a24a', e: '#2b1d14', w: '#fff4e6', b: '#8fb9e8', c: '#f2c14e' },
    background: 'radial-gradient(ellipse at 50% 45%, #4a1a63 0%, #170b33 72%)',
  },
  philosophy: {
    rows: [
      '.k.........k.',
      '.kk.......kk.',
      '.kbkkkkkkkbk.',
      '.kbbbbbbbbbk.',
      '.kwwwbbbwwwk.',
      '.kwewbbbwewk.',
      '.kwwwbybwwwk.',
      '.kbbbbybbbbk.',
      '.kbbtbtbtbbk.',
      '.kbbbtbtbbbk.',
      '..kbbbbbbbk..',
      '...kyk.kyk...',
      'rrrrrrrrrrrrr',
    ],
    palette: { k: '#2a2238', b: '#9b7653', w: '#f5efe0', e: '#1b1626', y: '#f2c14e', t: '#d8c3a0', r: '#5b4a3a' },
    background: 'radial-gradient(ellipse at 50% 45%, #23236b 0%, #0d0b2e 72%)',
  },
};
