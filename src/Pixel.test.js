import Pixel from './Pixel';

describe('Pixel class', function() {
  it('should check equality based on rgba values', function() {
    const p1 = new Pixel(1, 2, 3, 255);
    const p2 = new Pixel(1, 2, 3, 255);
    const p3 = new Pixel(255, 255, 255, 255);
    expect(p1.eq(p2)).toBe(true);
    expect(p1.eq(p3)).toBe(false);
  });
});
