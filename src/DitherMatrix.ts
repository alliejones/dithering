import Pixel from './Pixel';

export default class DitherMatrix {
  private matrix: number[][];
  private levels: Pixel[][][];

  constructor(matrix: number[][]) {
    this.matrix = matrix;
    this.levels = this.generateLevels();
  }

  public getLevel(level: number): Pixel[][] {
    return this.levels[level];
  }

  public getLevels(): Pixel[][][] {
    return this.levels;
  }

  public getLevelCount(): number {
    return this.levels.length;
  }

  public getSize(): number {
    return this.matrix.length;
  }

  private generateLevels(): Pixel[][][] {
    const intensityLevels = this.matrix.length * this.matrix.length;
    const patterns = [];
    for (let i = 0; i <= intensityLevels; i++) {
      patterns.push(this.matrix.map((row) => {
        return row.map((v) => {
          if (v < i) {
            return new Pixel(0, 0, 0, 255);
          } else {
            return new Pixel(255, 255, 255, 255);
          }
        });
      }));
    }
    return patterns;
  }
}
