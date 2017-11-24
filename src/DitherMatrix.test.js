import DitherMatrix from './DitherMatrix';
import Pixel from './Pixel';

describe('Dithering matrix generation', function() {
  it('should output the correct intensity level matrixes given the source matrix', function() {
    const ditherMatrix = [
      [6, 8, 4],
      [1, 0, 3],
      [5, 2, 7],
    ];
    const matrix = new DitherMatrix(ditherMatrix);
    const b = new Pixel(0, 0, 0, 255);
    const w = new Pixel(255, 255, 255, 255);
    
    const level0 = [[w, w, w], [w, w, w], [w, w, w]];
    const level5 = [[w, w, b], [b, b, b], [w, b, w]];
    const level9 = [[b, b, b], [b, b, b], [b, b, b]];
    
    expect(matrix.getLevel(0)).toEqual(level0);
    expect(matrix.getLevel(5)).toEqual(level5);
    expect(matrix.getLevel(9)).toEqual(level9);
  });
});
