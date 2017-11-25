export default class Pixel {
  public r: number;
  public g: number;
  public b: number;
  public a: number;

  constructor(r: number, g: number, b: number, a: number = 255) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  public toString() {
    return `Pixel[${this.values.join(',')}]`;
  }

  public brightness() {
    // TODO: use a better conversion
    return Math.max(this.r, this.g, this.b);
  }

  get values(): number[] {
    return [ this.r, this.g, this.b, this.a ];
  }

  public eq(pixel: Pixel) {
    return this.r === pixel.r &&
      this.g === pixel.g &&
      this.b === pixel.b &&
      this.a === pixel.a;
  }
}
