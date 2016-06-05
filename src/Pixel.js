export default class Pixel {
  toString() {
    return `Pixel[${this.values.join(',')}]`;
  }

  constructor(values) {
    this.values = values;
  }

  brightness() {
    // TODO: use a better conversion
    return Math.max(this.values[0], this.values[1], this.values[2]);
  }

  eq(pixel) {
    return this.values[0] === pixel.values[0] &&
      this.values[1] === pixel.values[1] &&
      this.values[2] === pixel.values[2] &&
      this.values[3] === pixel.values[3];
  }
}
