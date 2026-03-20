// This helper translates user city names into real Airport Codes
export const getIataCode = (cityName) => {
  const cityMap = {
    // India
    "Mumbai": "BOM", "Delhi": "DEL", "Goa": "GOI", "Bangalore": "BLR", 
    "Jaipur": "JAI", "Kochi": "COK", "Varanasi": "VNS", "Manali": "KUU",
    
    // International
    "Dubai": "DXB", "New York": "JFK", "London": "LHR", "Paris": "CDG",
    "Tokyo": "NRT", "Sydney": "SYD", "Bali": "DPS", "Bangkok": "BKK",
    "Singapore": "SIN", "Maldives": "MLE", "Colombo": "CMB"
  };

  // Convert to title case to match our map, then return the code
  const formattedCity = cityName.trim().charAt(0).toUpperCase() + cityName.trim().slice(1).toLowerCase();
  return cityMap[formattedCity] || null;
};