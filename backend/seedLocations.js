import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Location from './models/Location.js';

// Load env variables
dotenv.config();

const locations = [
  // --- INDIA DESTINATIONS ---
  {
    city: "Goa",
    country: "India",
    img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
    description: "Sun, sand, and spices. The ultimate beach destination for relaxation and parties.",
    category: "Beaches",
    weather: "30°C Sunny",
    rating: 4.8,
    lat: 15.2993,
    lng: 74.1240,
    transportOptions: [
      { type: "Flight", provider: "Indigo", price: 4500, duration: "1h 15m", departureTime: "10:00 AM", rating: 4.5 },
      { type: "Train", provider: "Konkan Kanya Exp", price: 1200, duration: "11h 30m", departureTime: "11:00 PM", rating: 4.2 },
      { type: "Bus", provider: "VRL Travels A/C", price: 1500, duration: "14h 00m", departureTime: "09:00 PM", rating: 3.8 }
    ]
  },
  {
    city: "Manali",
    country: "India",
    img: "https://images.unsplash.com/photo-1605649487212-4d4b55be5246?auto=format&fit=crop&w=800&q=80",
    description: "A high-altitude Himalayan resort town famous for backpacking and honeymoons.",
    category: "Mountains",
    weather: "5°C Snow",
    rating: 4.7,
    lat: 32.2432,
    lng: 77.1892,
    transportOptions: [
      { type: "Bus", provider: "Himachal Volvo", price: 1800, duration: "12h 00m", departureTime: "07:00 PM", rating: 4.6 },
      { type: "Cab", provider: "Private Cab", price: 8000, duration: "9h 30m", departureTime: "Flexible", rating: 5.0 }
    ]
  },
  {
    city: "Jaipur",
    country: "India",
    img: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80",
    description: "The Pink City, known for its royal palaces, vibrant bazaars, and rich Rajputana history.",
    category: "Heritage",
    weather: "32°C Sunny",
    rating: 4.6,
    lat: 26.9124,
    lng: 75.7873,
    transportOptions: [
      { type: "Flight", provider: "SpiceJet", price: 3500, duration: "1h 00m", departureTime: "08:30 AM", rating: 4.1 },
      { type: "Train", provider: "Shatabdi Express", price: 900, duration: "4h 30m", departureTime: "06:00 AM", rating: 4.5 },
      { type: "Bus", provider: "RSRTC Volvo", price: 700, duration: "5h 00m", departureTime: "Every hour", rating: 4.0 }
    ]
  },
  {
    city: "Munnar",
    country: "India",
    img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
    description: "Endless tea gardens, misty hills, and exotic flora in God's Own Country.",
    category: "Mountains",
    weather: "18°C Misty",
    rating: 4.9,
    lat: 10.0889,
    lng: 77.0595,
    transportOptions: [
      { type: "Flight", provider: "Air India (to Kochi)", price: 5500, duration: "2h 30m", departureTime: "11:00 AM", rating: 4.4 },
      { type: "Cab", provider: "Kerala Taxis", price: 3000, duration: "3h 30m (from Kochi)", departureTime: "Flexible", rating: 4.7 }
    ]
  },
  {
    city: "Udaipur",
    country: "India",
    img: "https://images.unsplash.com/photo-1615836245337-f5b9b230bc18?auto=format&fit=crop&w=800&q=80",
    description: "The City of Lakes. A romantic destination with majestic island palaces.",
    category: "Heritage",
    weather: "28°C Clear",
    rating: 4.8,
    lat: 24.5854,
    lng: 73.7125,
    transportOptions: [
      { type: "Flight", provider: "Vistara", price: 4200, duration: "1h 20m", departureTime: "02:00 PM", rating: 4.6 },
      { type: "Train", provider: "Mewar Express", price: 1100, duration: "12h 00m", departureTime: "07:00 PM", rating: 4.3 },
      { type: "Bus", provider: "Gujarat Travels", price: 1200, duration: "10h 30m", departureTime: "08:30 PM", rating: 4.0 }
    ]
  },
  {
    city: "Varanasi",
    country: "India",
    img: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80",
    description: "India's spiritual capital. Experience ancient ghats, temples, and the sacred Ganges.",
    category: "Pilgrimage",
    weather: "33°C Sunny",
    rating: 4.7,
    lat: 25.3176,
    lng: 82.9739,
    transportOptions: [
      { type: "Flight", provider: "Indigo", price: 3800, duration: "1h 40m", departureTime: "09:15 AM", rating: 4.3 },
      { type: "Train", provider: "Vande Bharat Exp", price: 1800, duration: "8h 00m", departureTime: "06:00 AM", rating: 4.8 }
    ]
  },
  {
    city: "Andaman Islands",
    country: "India",
    img: "https://images.unsplash.com/photo-1588665518776-9d6c75c87a55?auto=format&fit=crop&w=800&q=80",
    description: "Pristine beaches, coral reefs, and incredible scuba diving adventures.",
    category: "Islands",
    weather: "29°C Tropical",
    rating: 4.9,
    lat: 11.7401,
    lng: 92.6586,
    transportOptions: [
      { type: "Flight", provider: "Go First", price: 8500, duration: "2h 15m", departureTime: "05:30 AM", rating: 4.2 },
      { type: "Ferry", provider: "Makruzz", price: 1500, duration: "1h 30m", departureTime: "08:00 AM", rating: 4.6 }
    ]
  },
  {
    city: "Leh Ladakh",
    country: "India",
    img: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80",
    description: "Stark mountainous landscapes, ancient Buddhist monasteries, and crystal-clear lakes.",
    category: "Mountains",
    weather: "12°C Cold",
    rating: 4.9,
    lat: 34.1526,
    lng: 77.5771,
    transportOptions: [
      { type: "Flight", provider: "Air India", price: 6500, duration: "1h 30m", departureTime: "06:45 AM", rating: 4.4 },
      { type: "Bike", provider: "Royal Enfield Rentals", price: 1500, duration: "Per Day", departureTime: "Flexible", rating: 4.8 }
    ]
  },
  {
    city: "Rishikesh",
    country: "India",
    img: "https://images.unsplash.com/photo-1580214619711-2e21b777a83d?auto=format&fit=crop&w=800&q=80",
    description: "The Yoga Capital of the World and a hub for thrilling river rafting.",
    category: "Adventure",
    weather: "25°C Clear",
    rating: 4.6,
    lat: 30.0869,
    lng: 78.2676,
    transportOptions: [
      { type: "Train", provider: "Jan Shatabdi", price: 600, duration: "5h 30m", departureTime: "03:20 PM", rating: 4.3 },
      { type: "Bus", provider: "UTC Scania", price: 800, duration: "6h 00m", departureTime: "10:30 PM", rating: 4.1 },
      { type: "Cab", provider: "MakeMyTrip Cabs", price: 3500, duration: "5h 00m", departureTime: "Flexible", rating: 4.5 }
    ]
  },
  {
    city: "Agra",
    country: "India",
    img: "https://images.unsplash.com/photo-1564507592208-027040441d6b?auto=format&fit=crop&w=800&q=80",
    description: "Home to the iconic Taj Mahal, a masterpiece of Mughal architecture.",
    category: "Heritage",
    weather: "34°C Sunny",
    rating: 4.5,
    lat: 27.1767,
    lng: 78.0081,
    transportOptions: [
      { type: "Train", provider: "Gatimaan Exp", price: 750, duration: "1h 40m", departureTime: "08:10 AM", rating: 4.7 },
      { type: "Bus", provider: "IntrCity SmartBus", price: 500, duration: "3h 30m", departureTime: "Hourly", rating: 4.0 }
    ]
  },

  // --- ASIA & MIDDLE EAST ---
  {
    city: "Dubai",
    country: "UAE",
    img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
    description: "A futuristic city of luxury shopping, ultramodern architecture, and lively nightlife.",
    category: "International",
    weather: "35°C Sunny",
    rating: 4.9,
    lat: 25.2048,
    lng: 55.2708,
    transportOptions: [
      { type: "Flight", provider: "Emirates", price: 22000, duration: "4h 00m", departureTime: "04:30 AM", rating: 4.9 },
      { type: "Flight", provider: "Air India", price: 16500, duration: "4h 15m", departureTime: "08:00 PM", rating: 4.0 }
    ]
  },
  {
    city: "Bali",
    country: "Indonesia",
    img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    description: "Lush rice terraces, ancient temples, and epic surf spots.",
    category: "International",
    weather: "28°C Tropical",
    rating: 4.8,
    lat: -8.4095,
    lng: 115.1889,
    transportOptions: [
      { type: "Flight", provider: "Singapore Airlines", price: 32000, duration: "9h 30m", departureTime: "11:45 PM", rating: 4.8 }
    ]
  },
  {
    city: "Tokyo",
    country: "Japan",
    img: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
    description: "A dazzling blend of neon-lit skyscrapers, historic temples, and incredible cuisine.",
    category: "International",
    weather: "19°C Rainy",
    rating: 4.9,
    lat: 35.6762,
    lng: 139.6503,
    transportOptions: [
      { type: "Flight", provider: "Japan Airlines", price: 55000, duration: "8h 45m", departureTime: "09:15 PM", rating: 4.9 },
      { type: "Train", provider: "Shinkansen", price: 9000, duration: "2h 30m (Local)", departureTime: "Every 15m", rating: 5.0 }
    ]
  },
  {
    city: "Kyoto",
    country: "Japan",
    img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    description: "Japan's cultural heart, famous for classical Buddhist temples, gardens, and geishas.",
    category: "International",
    weather: "17°C Cloudy",
    rating: 4.8,
    lat: 35.0116,
    lng: 135.7681,
    transportOptions: [
      { type: "Flight", provider: "ANA (to Osaka)", price: 54000, duration: "8h 30m", departureTime: "08:00 AM", rating: 4.8 },
      { type: "Train", provider: "JR Pass", price: 12000, duration: "Varies", departureTime: "Flexible", rating: 4.9 }
    ]
  },
  {
    city: "Singapore",
    country: "Singapore",
    img: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80",
    description: "A pristine island city-state known for Gardens by the Bay and diverse street food.",
    category: "International",
    weather: "31°C Humid",
    rating: 4.7,
    lat: 1.3521,
    lng: 103.8198,
    transportOptions: [
      { type: "Flight", provider: "Singapore Airlines", price: 21000, duration: "5h 30m", departureTime: "10:30 AM", rating: 4.9 }
    ]
  },
  {
    city: "Bangkok",
    country: "Thailand",
    img: "https://images.unsplash.com/photo-1583301286816-f4f05e1e8b25?auto=format&fit=crop&w=800&q=80",
    description: "Vibrant street life, ornate shrines, and epic night markets.",
    category: "International",
    weather: "33°C Sunny",
    rating: 4.6,
    lat: 13.7563,
    lng: 100.5018,
    transportOptions: [
      { type: "Flight", provider: "Thai Airways", price: 14500, duration: "4h 15m", departureTime: "01:00 PM", rating: 4.5 }
    ]
  },
  {
    city: "Phuket",
    country: "Thailand",
    img: "https://images.unsplash.com/photo-1584065261314-ec5d1b329dd2?auto=format&fit=crop&w=800&q=80",
    description: "Thailand's largest island, boasting rainforests and the stunning Phi Phi islands nearby.",
    category: "International",
    weather: "30°C Tropical",
    rating: 4.7,
    lat: 7.8804,
    lng: 98.3923,
    transportOptions: [
      { type: "Flight", provider: "AirAsia", price: 16000, duration: "5h 00m", departureTime: "07:30 AM", rating: 4.2 }
    ]
  },
  {
    city: "Maldives",
    country: "Maldives",
    img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80",
    description: "Luxury overwater bungalows, crystal clear lagoons, and spectacular marine life.",
    category: "Islands",
    weather: "29°C Clear",
    rating: 5.0,
    lat: 3.2028,
    lng: 73.2207,
    transportOptions: [
      { type: "Flight", provider: "Vistara", price: 24000, duration: "3h 45m", departureTime: "11:00 AM", rating: 4.6 },
      { type: "Seaplane", provider: "TMA", price: 15000, duration: "45m", departureTime: "Flexible", rating: 4.9 }
    ]
  },
  {
    city: "Colombo",
    country: "Sri Lanka",
    img: "https://images.unsplash.com/photo-1580975619550-60b6910ea521?auto=format&fit=crop&w=800&q=80",
    description: "A bustling coastal city with colonial architecture and spicy seafood.",
    category: "International",
    weather: "31°C Sunny",
    rating: 4.5,
    lat: 6.9271,
    lng: 79.8612,
    transportOptions: [
      { type: "Flight", provider: "SriLankan Airlines", price: 12000, duration: "2h 30m", departureTime: "02:15 PM", rating: 4.3 }
    ]
  },

  // --- EUROPE ---
  {
    city: "Paris",
    country: "France",
    img: "https://images.unsplash.com/photo-1502602868849-15a9f50e1074?auto=format&fit=crop&w=800&q=80",
    description: "The City of Light. Iconic landmarks like the Eiffel Tower and world-class art at the Louvre.",
    category: "International",
    weather: "18°C Cloudy",
    rating: 4.8,
    lat: 48.8566,
    lng: 2.3522,
    transportOptions: [
      { type: "Flight", provider: "Air France", price: 45000, duration: "9h 30m", departureTime: "10:00 AM", rating: 4.8 },
      { type: "Train", provider: "Eurostar", price: 8000, duration: "2h 15m (from London)", departureTime: "Hourly", rating: 4.7 }
    ]
  },
  {
    city: "Rome",
    country: "Italy",
    img: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80",
    description: "The Eternal City, where ancient ruins like the Colosseum meet vibrant street life.",
    category: "International",
    weather: "22°C Sunny",
    rating: 4.7,
    lat: 41.9028,
    lng: 12.4964,
    transportOptions: [
      { type: "Flight", provider: "ITA Airways", price: 42000, duration: "9h 00m", departureTime: "05:00 AM", rating: 4.5 },
      { type: "Train", provider: "Trenitalia", price: 4000, duration: "1h 30m (Local)", departureTime: "Frequent", rating: 4.6 }
    ]
  },
  {
    city: "Santorini",
    country: "Greece",
    img: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
    description: "Stunning whitewashed houses clinging to cliffs overlooking the azure Aegean Sea.",
    category: "Islands",
    weather: "25°C Clear",
    rating: 4.9,
    lat: 36.3932,
    lng: 25.4615,
    transportOptions: [
      { type: "Flight", provider: "Aegean Airlines", price: 55000, duration: "12h 30m (Connecting)", departureTime: "01:00 AM", rating: 4.4 },
      { type: "Ferry", provider: "Blue Star Ferries", price: 6000, duration: "5h 00m (from Athens)", departureTime: "07:30 AM", rating: 4.3 }
    ]
  },
  {
    city: "London",
    country: "UK",
    img: "https://images.unsplash.com/photo-1513635269975-5969336bc1ff?auto=format&fit=crop&w=800&q=80",
    description: "A historic, cosmopolitan hub famous for the Big Ben, red buses, and royal heritage.",
    category: "International",
    weather: "15°C Rainy",
    rating: 4.8,
    lat: 51.5074,
    lng: -0.1278,
    transportOptions: [
      { type: "Flight", provider: "British Airways", price: 48000, duration: "9h 45m", departureTime: "08:45 AM", rating: 4.6 }
    ]
  },
  {
    city: "Amsterdam",
    country: "Netherlands",
    img: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=800&q=80",
    description: "Known for its artistic heritage, elaborate canal system, and narrow houses.",
    category: "International",
    weather: "16°C Breezy",
    rating: 4.7,
    lat: 52.3676,
    lng: 4.9041,
    transportOptions: [
      { type: "Flight", provider: "KLM", price: 46000, duration: "10h 00m", departureTime: "02:00 PM", rating: 4.7 },
      { type: "Train", provider: "Thalys", price: 7000, duration: "3h 20m (from Paris)", departureTime: "Frequent", rating: 4.5 }
    ]
  },
  {
    city: "Zurich",
    country: "Switzerland",
    img: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80",
    description: "A global center for banking, situated at the north end of Lake Zurich with alpine views.",
    category: "Mountains",
    weather: "10°C Clear",
    rating: 4.9,
    lat: 47.3769,
    lng: 8.5417,
    transportOptions: [
      { type: "Flight", provider: "Swiss Air", price: 52000, duration: "9h 15m", departureTime: "11:30 PM", rating: 4.8 },
      { type: "Train", provider: "SBB", price: 4500, duration: "Local", departureTime: "Always", rating: 5.0 }
    ]
  },
  {
    city: "Barcelona",
    country: "Spain",
    img: "https://images.unsplash.com/photo-1583422409516-1500d05a0fc1?auto=format&fit=crop&w=800&q=80",
    description: "Famed for its unique Gaudi architecture, vibrant tapas scene, and Mediterranean beaches.",
    category: "International",
    weather: "24°C Sunny",
    rating: 4.7,
    lat: 41.3851,
    lng: 2.1734,
    transportOptions: [
      { type: "Flight", provider: "Qatar Airways", price: 43000, duration: "13h 00m (Connecting)", departureTime: "04:00 AM", rating: 4.5 },
      { type: "Train", provider: "Renfe", price: 5000, duration: "2h 30m (from Madrid)", departureTime: "Hourly", rating: 4.4 }
    ]
  },

  // --- AMERICAS & OCEANIA ---
  {
    city: "New York",
    country: "USA",
    img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80",
    description: "The Big Apple. Experience Times Square, Central Park, and the Statue of Liberty.",
    category: "International",
    weather: "22°C Clear",
    rating: 4.8,
    lat: 40.7128,
    lng: -74.0060,
    transportOptions: [
      { type: "Flight", provider: "United Airlines", price: 65000, duration: "15h 00m", departureTime: "11:00 PM", rating: 4.6 }
    ]
  },
  {
    city: "Banff",
    country: "Canada",
    img: "https://images.unsplash.com/photo-1517590214652-32b6951907cb?auto=format&fit=crop&w=800&q=80",
    description: "A breathtaking resort town in the Rockies, surrounded by peaks and glacial lakes.",
    category: "Mountains",
    weather: "8°C Cold",
    rating: 4.9,
    lat: 51.1784,
    lng: -115.5708,
    transportOptions: [
      { type: "Flight", provider: "Air Canada (to Calgary)", price: 72000, duration: "18h 00m", departureTime: "06:00 AM", rating: 4.5 },
      { type: "Bus", provider: "Brewster Express", price: 4500, duration: "1h 45m (from Calgary)", departureTime: "Scheduled", rating: 4.6 }
    ]
  },
  {
    city: "Queenstown",
    country: "New Zealand",
    img: "https://images.unsplash.com/photo-1589802829985-81a001b74f38?auto=format&fit=crop&w=800&q=80",
    description: "The Adventure Capital of the World, sitting on the shores of the South Island's Lake Wakatipu.",
    category: "Adventure",
    weather: "14°C Crisp",
    rating: 4.9,
    lat: -45.0312,
    lng: 168.6626,
    transportOptions: [
      { type: "Flight", provider: "Air New Zealand", price: 85000, duration: "16h 30m", departureTime: "09:00 PM", rating: 4.7 },
      { type: "Cab", provider: "Local Shuttles", price: 2000, duration: "Varies", departureTime: "On Demand", rating: 4.8 }
    ]
  },
  {
    city: "Sydney",
    country: "Australia",
    img: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80",
    description: "Famous for its sail-like Opera House, Harbour Bridge, and stunning Bondi Beach.",
    category: "International",
    weather: "26°C Sunny",
    rating: 4.7,
    lat: -33.8688,
    lng: 151.2093,
    transportOptions: [
      { type: "Flight", provider: "Qantas", price: 58000, duration: "12h 15m", departureTime: "08:30 PM", rating: 4.8 }
    ]
  },
  {
    city: "Rio de Janeiro",
    country: "Brazil",
    img: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=800&q=80",
    description: "Famed for its Copacabana and Ipanema beaches, and the Christ the Redeemer statue.",
    category: "International",
    weather: "30°C Tropical",
    rating: 4.6,
    lat: -22.9068,
    lng: -43.1729,
    transportOptions: [
      { type: "Flight", provider: "LATAM Airlines", price: 82000, duration: "20h 00m (Connecting)", departureTime: "02:00 AM", rating: 4.4 }
    ]
  }
];

const seedLocations = async () => {
  try {
    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/tours_and_travels";
    console.log(`⏳ Attempting to connect to: ${uri}`);
    
    // Connect to database
    await mongoose.connect(uri);
    console.log("🔌 Connected to MongoDB Successfully!");

    // 1. Clear old data
    await Location.deleteMany({});
    console.log("🧹 Cleared old locations from database");

    // 2. Prepare Data (Safely finding the cheapest transport option)
    const finalData = locations.map(loc => {
      const prices = loc.transportOptions.map(t => t.price);
      const cheapestOption = prices.length > 0 ? Math.min(...prices) : 0;
      
      return {
        ...loc,
        price: cheapestOption
      };
    });

    // 3. Insert Data
    await Location.insertMany(finalData);
    console.log(`✅ ${finalData.length} Locations Seeded Successfully!`);

    // Disconnect safely
    await mongoose.disconnect();
    console.log("👋 Disconnected from MongoDB");
    process.exit(0);

  } catch (err) {
    console.error("❌ Seeding Error:");
    console.error(err);
    process.exit(1);
  }
};

seedLocations();