import Pixel from './Pixel';

function createPixelArrayFromImageData({ height, width, data }: ImageData) {
  const array = [];
  const valuesPerPixel = 4;
  for (let x = 0; x < width * valuesPerPixel; x += valuesPerPixel) {
    const offset = x * width;
    const col = [];
    for (let y = 0; y < height * valuesPerPixel; y += valuesPerPixel) {
      const [r, g, b, a] = data.slice(offset + y, offset + y + valuesPerPixel);
      col.push(new Pixel(r, g, b, a));
    }
    array.push(col);
  }
  return array;
}

export {
  createPixelArrayFromImageData
};
