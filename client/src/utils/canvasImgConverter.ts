export const imgDataTo3DArr = (data: Uint8ClampedArray, width: number) => {
  const pixels = [];
  const rows = [];

  const n = data.length;

  for (let i = 0; i < n; i += 4) {
    pixels.push([data[i + 3] / 255]);
  }

  const k = pixels.length;

  for (let j = 0; j < k; j += width) {
    rows.push(pixels.slice(j, j + width));
  }

  return rows;
};
