import type { Sprite } from './sprites';

type Props = { sprite: Sprite; label: string };

// 픽셀 한 칸을 SVG rect 하나로 그린다. 같은 줄에서 같은 색이 이어지면 rect 하나로 합친다.
export function PixelArt({ sprite, label }: Props) {
  const width = sprite.rows[0].length;
  const height = sprite.rows.length;
  const rects: { x: number; y: number; w: number; color: string }[] = [];

  sprite.rows.forEach((row, y) => {
    let x = 0;
    while (x < width) {
      const ch = row[x];
      let w = 1;
      while (x + w < width && row[x + w] === ch) w += 1;
      if (ch !== '.') rects.push({ x, y, w, color: sprite.palette[ch] });
      x += w;
    }
  });

  return (
    <svg viewBox={`-2 -2 ${width + 4} ${height + 4}`} shapeRendering="crispEdges" role="img" aria-label={label}>
      {rects.map(({ x, y, w, color }) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={w} height={1} fill={color} />
      ))}
    </svg>
  );
}
