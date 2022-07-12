export const imgDataTo3DArr = (data: Uint8ClampedArray, width: number) => {
  let row: number[][] = [];
  const rows: number[][][] = [];

  for (let i = 0, n = data.length; i < n; i += 4) {
    const pixelInRGBA = [data[i], data[i + 1], data[i + 2], data[i + 3]];

    if (row.length >= width) {
      rows.push(row);
      row = [];
    } else {
      row.push(pixelInRGBA);
    }
  }

  rows.push(row);

  return rows;
};
