// 썸네일 픽셀 아트. 한 글자가 한 칸이고 '.'은 빈칸이다. 색 글자는 palette에 있어야 한다(routes.test.ts가 확인).
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
    background: '#2d5a3d',
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
    background: '#f6e7cf',
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
    background: '#3b3355',
  },
};
