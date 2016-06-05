import Pixel from './Pixel';

export function generateDitherPatterns(matrix) {
  const intensityLevels = matrix.length * matrix.length;
  const patterns = [];
  for (let i = 0; i < intensityLevels; i++) {
    patterns.push(matrix.map(row => {
      return row.map(v => {
        if (v < i) return new Pixel([0, 0, 0, 255]);
        return new Pixel([255, 255, 255, 255]);
      });
    }));
  }
  return patterns;
}
