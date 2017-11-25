import DImage from './DImage';
import DitherMatrix from './DitherMatrix';
import Pixel from './Pixel';

const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

function lerp(value: number, sourceStart: number, sourceEnd: number, targetStart: number, targetEnd: number) {
  return (value - sourceStart) * (targetEnd - targetStart) /
    (sourceEnd - sourceStart) + targetStart;
}

function dither(image: DImage, matrix: DitherMatrix) {
  const size = matrix.getSize();
  const intensityLevels = matrix.getLevelCount();
  const ditheredImage = new DImage([[]]);
  ditheredImage.width = image.width;
  ditheredImage.height = image.height;

  for (let x = 0; x < Math.floor(image.width / size); x++) {
    for (let y = 0; y < Math.floor(image.height / size); y++) {
      const region = image.getRegion(x, y, size).averageBrightness();
      const intensity = Math.round(lerp(region, 0, 255, 0, intensityLevels));
      ditheredImage.setRegion(x, y, matrix.getLevel(intensity));
    }
  }

  canvas.width = image.width;
  canvas.height = image.height;
  return new ImageData(ditheredImage.toUint8ClampedArray(), image.width, image.height);
}

function average(imageData: Pixel[][]) {
  let sum = 0;
  for (let x = 0; x < imageData.length; x++) {
    for (let y = 0; y < imageData[x].length; y++) {
      sum += imageData[x][y].brightness();
    }
  }
  return sum / (imageData.length * imageData.length);
}

async function render() {
  const ditherMatrix = new DitherMatrix([
    [6, 8, 4],
    [1, 0, 3],
    [5, 2, 7],
  ]);

  const image = await DImage.createFromURL('abe-grayscale.jpg');
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.putImageData(new ImageData(image.toUint8ClampedArray(), image.width, image.height), 0, 0);
}

render();
