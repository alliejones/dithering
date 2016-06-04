const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

class DImage {
  canvas = null;
  ctx = null;
  width = null
  height = null;

  ready = null;

  constructor(imageSrc) {
    this.ready = new Promise((resolve, reject) => {
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');

      const image = new Image();
      image.onload = () => {
        this.width = this.canvas.width = image.width;
        this.height = this.canvas.height = image.height;

        this.ctx.drawImage(image, 0, 0);

        this.data = this.ctx.getImageData(0, 0, this.width, this.height).data;

        resolve();
      };

      image.onerror = reject;

      image.src = imageSrc;
    });
  }

  VALS_PER_PIXEL = 4;

  getIndex(x, y) {
    const rowOffset = y * this.VALS_PER_PIXEL * this.width;
    return rowOffset + (x * this.VALS_PER_PIXEL);
  }

  getPixel(x, y) {
    if (x >= this.width || y >= this.height) return null;

    const start = this.getIndex(x, y);
    return this.data.slice(start, start + this.VALS_PER_PIXEL);
  }

  setPixel(x, y, value) {
    if (x >= this.width || y >= this.height) return;

    const index = this.getIndex(x, y);
    this.data[index] = value;
  }

  /* TODO: have this return a new instance of DImage instead */
  getRegion(x, y, size) {
    const region = [];
    for (let dx = 0; dx < size; dx++) {
      const col = [];
      for (let dy = 0; dy < size; dy++) {
        col.push(this.getPixel(x + dx, y + dy));
      }
      region.push(col);
    }
    return region;
  }
}

// should be in DImage but ImageData being write-only makes things harder ...
function setRegion(data, x, y, values) {
  for (let dx = 0; dx < values.length; dx++) {
    for (let dy = 0; dy < values[dx].length; dy++) {
      data[x + dx][y + dy] = values[dx][dy];
    }
  }
}

function lerp(value, sourceStart, sourceEnd, targetStart, targetEnd) {
  return (value - sourceStart) * (targetEnd - targetStart) /
    (sourceEnd - sourceStart) + targetStart;
}

function getDitherPattern(intensity, matrix) {
  return matrix.map();
}

function dither(image, matrix) {
  const size = matrix.length;
  const intensityLevels = (size * size) - 1;
  const ditheredImageData = new Uint8ClampedArray();

  for (let x = 0; x < Math.floor(image.width / size); x++) {
    for (let y = 0; y < Math.floor(image.height / size); y++) {
      const intensity = Math.round(lerp(average(image.getRegion(x, y, size)),
        0, 255, 0, intensityLevels));
      setRegion(ditheredImageData, x, y, matrix[intensity]);
    }
  }

  canvas.width = image.width;
  canvas.height = image.height;
  const ditheredImage = ctx.createImageData
}

function average(imageData) {
  let sum = 0;
  for (let x = 0; x < imageData.length; x++) {
    for (let y = 0; y < imageData[x].length; y++) {
      sum += brightness(imageData[x][y]);
    }
  }
  return sum / (imageData.length * imageData.length);
}

function brightness(pixel) {
  // TODO: use a better conversion
  return Math.max(pixel[0], pixel[1], pixel[2]);
}

const ditherMatrix = [
  [6, 8, 4],
  [1, 0, 3],
  [5, 2, 7],
];

const image = new DImage('abe-grayscale.jpg');
image.ready.then(
  () => dither(image, ditherMatrix),
  (e) => console.error(`Failed to load ${e.target.src}`)
);
