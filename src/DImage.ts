import Pixel from './Pixel';
import { createPixelArrayFromImageData } from './utils';

export default class DImage {
  public static async createFromURL(imageSrc: string): Promise<DImage> {
    return new Promise<DImage>((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      const image = new Image();
      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

        const data = createPixelArrayFromImageData(
          ctx.getImageData(0, 0, image.width, image.height)
        );

        resolve(new DImage(data));
      };

      image.onerror = reject;

      image.src = imageSrc;
    });
  }

  private static readonly VALS_PER_PIXEL = 4;

  public width: number;
  public height: number;

  public data: Pixel[][];

  constructor(data: Pixel[][]) {
    this.data = data;
    this.width = data[0].length;
    this.height = data.length;
  }

  public getPixel(x: number, y: number) {
    return this.data[x][y];
  }

  public setPixel(x: number, y: number, value: Pixel) {
    this.data[x][y] = value;
  }

  public getRegion(x: number, y: number, size: number) {
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

  public setRegion(x: number, y: number, values: Pixel[][]) {
    for (let dx = 0; dx < values.length; dx++) {
      for (let dy = 0; dy < values[dx].length; dy++) {
        // TODO: should initialize data somewhere instead of doing this
        if (!this.data[x + dx]) {
          this.data[x + dx] = [];
        }
        this.data[x + dx][y + dy] = values[dx][dy];
      }
    }
  }

  public averageBrightness() {
    let sum = 0;
    for (let x = 0; x < this.data.length; x++) {
      for (let y = 0; y < this.data[x].length; y++) {
        sum += this.data[x][y].brightness();
      }
    }
    return sum / (this.data.length * this.data.length);
  }

  public toUint8ClampedArray() {
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
