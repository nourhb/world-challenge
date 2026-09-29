import { haversineKm, parseCoordinateAnswer } from './geo';

describe('geo', () => {
  it('measures a short Tunis-to-coast hop', () => {
    const km = haversineKm(
      { latitude: 36.8065, longitude: 10.1815 },
      { latitude: 36.85, longitude: 10.3 },
    );
    expect(km).toBeGreaterThan(5);
    expect(km).toBeLessThan(50);
  });

  it('parses a map click', () => {
    expect(parseCoordinateAnswer('36.8, 10.18')).toEqual({
      latitude: 36.8,
      longitude: 10.18,
    });
    expect(parseCoordinateAnswer('Japan')).toBeNull();
  });
});
