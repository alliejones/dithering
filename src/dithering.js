import { generateDitherPatterns } from './utils';
import Pixel from './Pixel';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


const ditherMatrix = [
  [6, 8, 4],
  [1, 0, 3],
  [5, 2, 7],
];

const ditherPatterns = generateDitherPatterns(ditherMatrix);
console.log(ditherPatterns);

class DImage {
  width = null
  height = null;

  VALS_PER_PIXEL = 4;

  constructor(data) {
    if (data) {
      this.data = data;
      this.width = data.length;
      this.length = data[0].length;
    } else {
      this.data = [];
    }
  }

  loadFromURL(imageSrc) {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const image = new Image();
      image.onload = () => {
        this.width = canvas.width = image.width;
        this.height = canvas.height = image.height;

        ctx.drawImage(image, 0, 0);

        this.setDataFrom1DArray(ctx.getImageData(0, 0, this.width, this.height).data, this.width, this.height);

        resolve(this);
      };

      image.onerror = reject;

      image.src = imageSrc;
    });
  }

  setDataFrom1DArray(sourceData, width, height) {
    const data = [];
    for (let x = 0; x < width * this.VALS_PER_PIXEL; x += this.VALS_PER_PIXEL) {
      const offset = x * width;
      const col = [];
      for (let y = 0; y < height * this.VALS_PER_PIXEL; y += this.VALS_PER_PIXEL) {
        col.push(new Pixel(sourceData.slice(offset + y, offset + y + this.VALS_PER_PIXEL)));
      }
      data.push(col);
    }
    this.data = data;
  }

  getPixel(x, y) {
    return this.data[x][y];
  }

  setPixel(x, y, value) {
    this.data[x][y] = value;
  }

  getRegion(x, y, size) {
    const region = [];
    for (let dx = 0; dx < size; dx++) {
      const col = [];
      for (let dy = 0; dy < size; dy++) {
        col.push(this.getPixel(x + dx, y + dy));
      }
      region.push(col);
    }
    return new DImage(region);
  }

  setRegion(x, y, values) {
    for (let dx = 0; dx < values.length; dx++) {
      for (let dy = 0; dy < values[dx].length; dy++) {
        // TODO: should initialize data somewhere instead of doing this
        if (!this.data[x + dx]) this.data[x + dx] = [];
        this.data[x + dx][y + dy] = values[dx][dy];
      }
    }
  }

  averageBrightness() {
    let sum = 0;
    for (let x = 0; x < this.data.length; x++) {
      for (let y = 0; y < this.data[x].length; y++) {
        sum += this.data[x][y].brightness();
      }
    }
    return sum / (this.data.length * this.data.length);
  }

  toUint8ClampedArray() {
    const arr = [];
    for (let x = 0; x < this.data.length; x++) {
      for (let y = 0; y < this.data[x].length; y++) {
        const vals = this.data[x][y].values;
        arr.push(vals[0]);
        arr.push(vals[1]);
        arr.push(vals[2]);
        arr.push(vals[3]);
      }
    }
    return new Uint8ClampedArray(arr);
  }
}

function lerp(value, sourceStart, sourceEnd, targetStart, targetEnd) {
  return (value - sourceStart) * (targetEnd - targetStart) /
    (sourceEnd - sourceStart) + targetStart;
}

function dither(image, matrix) {
  const size = matrix.length;
  const intensityLevels = (size * size) - 1;
  const ditheredImage = new DImage();
  ditheredImage.width = image.width;
  ditheredImage.height = image.height;

  for (let x = 0; x < Math.floor(image.width / size); x++) {
    for (let y = 0; y < Math.floor(image.height / size); y++) {
      const region = image.getRegion(x, y, size).averageBrightness();
      const intensity = Math.round(lerp(region, 0, 255, 0, intensityLevels));
      ditheredImage.setRegion(x, y, ditherPatterns[intensity]);
    }
  }

  canvas.width = image.width;
  canvas.height = image.height;
  ctx.putImageData(new ImageData(ditheredImage.toUint8ClampedArray(), 168, 224), 0, 0);
}

function average(imageData) {
  let sum = 0;
  for (let x = 0; x < imageData.length; x++) {
    for (let y = 0; y < imageData[x].length; y++) {
      sum += imageData[x][y].brightness();
    }
  }
  return sum / (imageData.length * imageData.length);
}

const image = new DImage();
image.loadFromURL('abe-grayscale.jpg').then(
  () => dither(image, ditherMatrix),
  (e) => console.error(`Failed to load ${e.target.src}`)
);
