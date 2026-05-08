export function isInsideViewport(
  latitude: number,
  longitude: number,
  viewport: {
    north: number;
    south: number;
    east: number;
    west: number;
  }
): boolean {
  return (
    latitude <= viewport.north &&
    latitude >= viewport.south &&
    longitude <= viewport.east &&
    longitude >= viewport.west
  );
}
