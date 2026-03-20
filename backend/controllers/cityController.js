import axios from 'axios';

export const suggestCities = async (req, res) => {
  try {
    const query = req.query.q;
    
    // Only search if the user has typed at least 2 letters
    if (!query || query.length < 2) {
      return res.status(200).json({ success: true, cities: [] });
    }

    // MAKE A LIVE INTERNET CALL TO OPENSTREETMAP API
    // We strictly limit the search to India using 'countrycodes=in'
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&countrycodes=in&format=json&addressdetails=1&limit=10`;
    
    const response = await axios.get(url, {
      headers: {
        // Nominatim requires a User-Agent header for their free tier
        'User-Agent': 'TourestTravelApp/1.0' 
      }
    });

    // Parse the live data and extract clean city names
    let cityNames = response.data.map(place => {
      // Try to get the most accurate city/town name from the address details
      if (place.address) {
        return place.address.city || place.address.town || place.address.state_district || place.name;
      }
      return place.name;
    });

    // Remove duplicates from the list (e.g., if it finds two areas in "Mumbai")
    cityNames = [...new Set(cityNames)];

    // Send the live Indian cities back to the React frontend
    res.status(200).json({ success: true, cities: cityNames.slice(0, 8) });

  } catch (error) {
    console.error("Live City Suggestion Error:", error.message);
    res.status(500).json({ success: false, message: "Error fetching live cities." });
  }
};