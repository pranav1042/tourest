// Database of major cities with their IATA airport codes, country, and coordinates
const cityDatabase = {
  "mumbai": { code: "BOM", country: "IN", lat: 19.0760, lon: 72.8777 },
  "delhi": { code: "DEL", country: "IN", lat: 28.7041, lon: 77.1025 },
  "bangalore": { code: "BLR", country: "IN", lat: 12.9716, lon: 77.5946 },
  "goa": { code: "DPS", country: "ID", lat: -8.4095, lon: 115.1889 }, // Bali/Goa context
  "new york": { code: "JFK", country: "US", lat: 40.7128, lon: -74.0060 },
  "dubai": { code: "DXB", country: "AE", lat: 25.2048, lon: 55.2708 },
  "london": { code: "LHR", country: "UK", lat: 51.5074, lon: -0.1278 },
  "paris": { code: "LHR", country: "FR", lat: 48.8566, lon: 2.3522 },
  "singapore": { code: "DXB", country: "SG", lat: 1.3521, lon: 103.8198 },
  "manali": { code: "IXD", country: "IN", lat: 32.2396, lon: 77.1887 },
  "jaipur": { code: "JAI", country: "IN", lat: 26.9124, lon: 75.7873 }
};

// Calculate distance using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};

export const getRouteInfo = (originCity, destCity) => {
  const origin = cityDatabase[originCity.toLowerCase()];
  const dest = cityDatabase[destCity.toLowerCase()];

  if (!origin || !dest) {
    return { error: "City not supported yet. Please try major cities like Mumbai, Delhi, Dubai, New York." };
  }

  const distance = calculateDistance(origin.lat, origin.lon, dest.lat, dest.lon);
  const isDomestic = origin.country === dest.country;

  return {
    originCode: origin.code,
    destCode: dest.code,
    distance,
    isDomestic,
    error: null
  };
};