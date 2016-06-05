import { generateDitherPatterns } from '../src/utils';
import Pixel from '../src/Pixel';

describe('Pixel class', function() {
  it('should check equality based on rgba values', function() {
    const p1 = new Pixel([1, 2, 3, 255]);
    const p2 = new Pixel([1, 2, 3, 255]);
    const p3 = new Pixel([255, 255, 255, 255]);
    expect(p1.eq(p2)).toBe(true);
    expect(p1.eq(p3)).toBe(false);
  });
});

function equalPixels(a, b) {
  for (var x = 0; x < a.length; x++) {
    for (var y = 0; y < a[x].length; y++) {
      if (!a[x][y].eq(b[x][y])) return false;
    }
  }

  return true;
}

describe('Dithering matrix generation', function() {
  it('should output the correct intensity level matrixes given the source matrix', function() {
      const ditherMatrix = [
        [6, 8, 4],
        [1, 0, 3],
        [5, 2, 7],
      ];
      const output = generateDitherPatterns(ditherMatrix);
      const b = new Pixel([0, 0, 0, 255]);
      const w = new Pixel([255, 255, 255, 255]);

      const level0 = [[w, w, w], [w, w, w], [w, w, w]];
      const level5 = [[w, w, b], [b, b, b], [w, b, w]];
      const level9 = [[b, b, b], [b, b, b], [b, b, b]];

      expect(equalPixels(level0, output[0])).toBe(true);
      expect(equalPixels(level5, output[5])).toBe(true);
  });
});
