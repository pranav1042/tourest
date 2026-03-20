// List of Indian cities that actually have commercial airports
const INDIAN_AIRPORTS = [
  "mumbai", "delhi", "bangalore", "bengaluru", "hyderabad", "ahmedabad", "chennai", 
  "kolkata", "surat", "pune", "jaipur", "lucknow", "kanpur", "nagpur", "indore", 
  "bhopal", "vadodara", "goa", "kochi", "patna", "chandigarh", "guwahati", 
  "bhubaneswar", "thiruvananthapuram", "amritsar", "varanasi", "rajkot", "srinagar"
];

// Cities that DO NOT have direct train access (mountain regions, islands, etc.)
const NO_TRAIN_CITIES = [
  "srinagar", "munnar", "gangtok", "leh", "ladakh", "andaman", "lakshadweep", "manali"
];

export const checkCityFacilities = (cityName) => {
  const city = cityName.toLowerCase();
  
  const hasAirport = INDIAN_AIRPORTS.some(airport => city.includes(airport));
  const hasTrain = !NO_TRAIN_CITIES.some(noTrain => city.includes(noTrain));
  const hasBus = true; // Assume everywhere has a bus

  return { hasAirport, hasTrain, hasBus };
};

// Calculate exact distance using GPS coordinates
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};