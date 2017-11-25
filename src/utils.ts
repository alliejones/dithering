import Pixel from './Pixel';

/*
 * image[row][column] / image[y][x] (origin top left)
 * [
 *  [(0,0), (0,1), (0,2)],
 *  [(1,0), (1,1), (1,2)],
 *  [(2,0), (2,1), (2, 2)]
 * ]
 */

function createPixelArrayFromImageData({ height, width, data }: ImageData) {
  const valuesPerPixel = 4;
  const array = [];

  let currentRow = [];
  let currentValues = [];
  for (let pos = 0; pos < data.length; pos++) {
    currentValues.push(data[pos]);

    if (currentValues.length === 4) {
      const [r, g, b, a] = currentValues;
      currentRow.push(new Pixel(r, g, b, a));
      currentValues = [];
    }

    if (currentRow.length === width) {
      array.push(currentRow);
      currentRow = [];
    }
  }
  return array;
}

export {
  createPixelArrayFromImageData
};
