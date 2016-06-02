const canvas = document.getElementById('canvas');
canvas.width = 500;
canvas.height = 500;
const ctx = canvas.getContext('2d');

const ditherMatrix = [
  [6, 8, 4],
  [1, 0, 3],
  [5, 2, 7],
];

class ImageData {
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

  getPixel(x, y) {
    if (x >= this.width || y >= this.height) return null;

    const rowOffset = y * this.VALS_PER_PIXEL * this.width;
    const start = rowOffset + (x * this.VALS_PER_PIXEL);
    return this.data.slice(start, start + this.VALS_PER_PIXEL);
  }
}

const image = new ImageData('abe-grayscale.jpg');

image.ready.then(() => {
  console.log('ready', image.data);
  debugger
}, (e) => console.error(`Failed to load ${e.target.src}`));
