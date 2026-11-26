import type { Point } from "../../config/scene";

/**
 * CSS matrix3d that maps a w×h box onto four corners (TL, TR, BR, BL),
 * so flat artwork sits on slightly angled surfaces in the illustration
 * (picture frames, the poster, the monitor screen).
 */
export function quadTransform(w: number, h: number, [p0, p1, p2, p3]: Point[]) {
  const src = [
    [0, 0],
    [w, 0],
    [w, h],
    [0, h],
  ];
  const dst = [p0, p1, p2, p3];
  // Solve the 8 homography coefficients.
  const A: number[][] = [];
  const b: number[] = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = src[i];
    const [u, v] = dst[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]);
    b.push(u);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y]);
    b.push(v);
  }
  const [a, bb, c, d, e, f, g, hh] = solve(A, b);
  // Column-major matrix3d.
  return `matrix3d(${[a, d, 0, g, bb, e, 0, hh, 0, 0, 1, 0, c, f, 0, 1].map((n) => +n.toFixed(8)).join(",")})`;
}

function solve(A: number[][], b: number[]) {
  const n = b.length;
  const M = A.map((row, i) => [...row, b[i]]);
  for (let col = 0; col < n; col++) {
    let piv = col;
    for (let r = col + 1; r < n; r++) if (Math.abs(M[r][col]) > Math.abs(M[piv][col])) piv = r;
    [M[col], M[piv]] = [M[piv], M[col]];
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const k = M[r][col] / M[col][col];
      for (let c = col; c <= n; c++) M[r][c] -= k * M[col][c];
    }
  }
  return M.map((row, i) => row[n] / row[i]);
}

/** SVG path of a spur gear centred on (cx, cy). */
export function gearPath(cx: number, cy: number, teeth: number, rOuter: number, depth: number) {
  const rRoot = rOuter - depth;
  const step = (Math.PI * 2) / teeth;
  const pts: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    const at = (r: number, t: number) => `${(cx + r * Math.cos(a + t * step)).toFixed(2)},${(cy + r * Math.sin(a + t * step)).toFixed(2)}`;
    pts.push(at(rRoot, 0), at(rRoot, 0.12), at(rOuter, 0.26), at(rOuter, 0.5), at(rRoot, 0.64));
  }
  return `M${pts.join("L")}Z`;
}
