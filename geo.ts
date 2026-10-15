import type { GeoPoint } from './types'

const EARTH_RADIUS_KM = 6371
const KM_PER_DEGREE_LAT = 111.32

const toRad = (deg: number) => (deg * Math.PI) / 180

export function haversineKm(a: GeoPoint, b: GeoPoint) {
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h))
}

export function offsetPoint(origin: GeoPoint, northKm: number, eastKm: number): GeoPoint {
  return {
    lat: origin.lat + northKm / KM_PER_DEGREE_LAT,
    lng: origin.lng + eastKm / (KM_PER_DEGREE_LAT * Math.cos(toRad(origin.lat))),
  }
}

// Bounding box for a radius query. Firestore can't do radial queries natively,
// so the backend will range-query on a geohash/lat bound, then refine with haversineKm.
export function boundingBox(center: GeoPoint, radiusKm: number) {
  const dLat = radiusKm / KM_PER_DEGREE_LAT
  const dLng = radiusKm / (KM_PER_DEGREE_LAT * Math.cos(toRad(center.lat)))
  return {
    minLat: center.lat - dLat,
    maxLat: center.lat + dLat,
    minLng: center.lng - dLng,
    maxLng: center.lng + dLng,
  }
}
