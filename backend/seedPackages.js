import mongoose from "mongoose";
import dotenv from "dotenv";
import Package from "./models/Package.js"; 

dotenv.config();

const unifiedPackages = [
  // --- CATEGORY: ROMANTIC ---
  {
    cityId: "PARIS", title: "Romantic Paris Getaway", destination: "Paris, France", category: "Romantic", rating: 4.9, duration: "5 Days, 4 Nights", nights: 4, pax: "Couple", basePrice: 45000,
    img: "https://images.unsplash.com/photo-1502602868849-15a9f50e1074?auto=format&fit=crop&w=1000",
    inclusions: ["Schengen Visa Assist", "Airport Transfers", "Eiffel Tower Dinner", "Seine Cruise"], exclusions: ["Lunch", "Shopping"],
    flights: [
      { airline: "Air France", type: "Direct", price: 65000, logo: "🇫🇷", outTime: "02:00 AM", outArrive: "08:30 AM", retTime: "10:00 PM", retArrive: "11:45 AM (+1)" },
      { airline: "Lufthansa", type: "1 Stop", price: 55000, logo: "🇩🇪", outTime: "04:00 AM", outArrive: "12:30 PM", retTime: "08:00 PM", retArrive: "09:45 AM (+1)" }
    ],
    hotels: [
      { name: "Pullman Paris Centre", stars: 4, area: "Bercy", pricePerNight: 16000, img: "https://images.unsplash.com/photo-1566073171639-4d9db53d6040?auto=format&fit=crop&w=300" },
      { name: "Shangri-La Paris", stars: 5, area: "Trocadéro", pricePerNight: 45000, img: "https://images.unsplash.com/photo-1542314831-c6a4d14d8c85?auto=format&fit=crop&w=300" }
    ],
    itinerary: [
      { day: 1, title: "Arrival in Paris", desc: "Private transfer to hotel. Evening free to explore the local cafes." },
      { day: 2, title: "Eiffel & River Cruise", desc: "Skip-the-line access to Eiffel Tower, followed by a romantic Seine River Cruise." },
      { day: 3, title: "Louvre Museum", desc: "Half-day guided tour of the Louvre. Evening Montmartre walking tour." },
      { day: 4, title: "Versailles Palace", desc: "Day trip to the Palace of Versailles and its stunning gardens." }
    ]
  },
  {
    cityId: "SANTORINI", title: "Santorini Sunset Retreat", destination: "Santorini, Greece", category: "Romantic", rating: 4.8, duration: "6 Days, 5 Nights", nights: 5, pax: "Couple", basePrice: 52000,
    img: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1000",
    inclusions: ["Ferry Tickets", "Catamaran Cruise", "Wine Tasting"], exclusions: ["City Tax"],
    flights: [
      { airline: "Qatar Airways", type: "1 Stop", price: 72000, logo: "🇶🇦", outTime: "03:30 AM", outArrive: "01:00 PM", retTime: "02:00 PM", retArrive: "04:30 AM (+1)" }
    ],
    hotels: [
      { name: "Grace Hotel", stars: 5, area: "Imerovigli", pricePerNight: 35000, img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=300" }
    ],
    itinerary: [
      { day: 1, title: "Welcome to Greece", desc: "Arrive in Santorini. Check into your cliffside villa." },
      { day: 2, title: "Oia Sunset", desc: "Explore the white-washed streets and watch the famous Oia sunset." },
      { day: 3, title: "Volcano Hot Springs", desc: "Private catamaran cruise to the volcanic hot springs." },
      { day: 4, title: "Wine Tasting", desc: "Tour 3 local wineries with traditional Greek tapas." },
      { day: 5, title: "Leisure Day", desc: "Relax by your private infinity pool." }
    ]
  },
  {
    cityId: "MALDIVES", title: "Maldivian Overwater Escape", destination: "Maldives", category: "Romantic", rating: 5.0, duration: "5 Days, 4 Nights", nights: 4, pax: "Couple", basePrice: 85000,
    img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1000",
    inclusions: ["Seaplane Transfer", "All-Inclusive Meals", "Snorkeling Gear"], exclusions: ["Spa Treatments"],
    flights: [
      { airline: "IndiGo", type: "Direct", price: 22000, logo: "✈️", outTime: "10:00 AM", outArrive: "12:30 PM", retTime: "01:30 PM", retArrive: "04:00 PM" }
    ],
    hotels: [
      { name: "Soneva Fushi", stars: 5, area: "Baa Atoll", pricePerNight: 65000, img: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=300" }
    ],
    itinerary: [
      { day: 1, title: "Touchdown Male", desc: "Take a scenic seaplane ride to your private island resort." },
      { day: 2, title: "Ocean Exploration", desc: "Guided house-reef snorkeling. Evening beachside dinner." },
      { day: 3, title: "Dolphin Cruise", desc: "Sunset cruise to spot spinner dolphins." },
      { day: 4, title: "Relaxation", desc: "Couples spa session and leisure time." }
    ]
  },

  // --- CATEGORY: ADVENTURE ---
  {
    cityId: "QUEENSTOWN", title: "Kiwi Adrenaline Rush", destination: "Queenstown, NZ", category: "Adventure", rating: 4.9, duration: "7 Days, 6 Nights", nights: 6, pax: "2 Adults", basePrice: 75000,
    img: "https://images.unsplash.com/photo-1589802829985-81a001b74f38?auto=format&fit=crop&w=1000",
    inclusions: ["Bungy Jump Ticket", "Milford Sound Cruise", "Shotover Jet"], exclusions: ["Visa Fees"],
    flights: [
      { airline: "Air New Zealand", type: "1 Stop", price: 88000, logo: "🇳🇿", outTime: "08:00 PM", outArrive: "02:00 PM (+1)", retTime: "04:00 PM", retArrive: "11:00 AM (+1)" }
    ],
    hotels: [
      { name: "Hilton Queenstown", stars: 5, area: "Kawarau Village", pricePerNight: 22000, img: "https://images.unsplash.com/photo-1566073171639-4d9db53d6040?auto=format&fit=crop&w=300" }
    ],
    itinerary: [
      { day: 1, title: "Kia Ora New Zealand", desc: "Arrive in Queenstown. Pick up your rental 4x4." },
      { day: 2, title: "Shotover Jet & Gondola", desc: "Extreme jet boat ride followed by Skyline Gondola." },
      { day: 3, title: "Kawarau Bridge Bungy", desc: "Take the leap at the world's first commercial bungy site." },
      { day: 4, title: "Milford Sound", desc: "Full day coach and scenic cruise through the fjords." },
      { day: 5, title: "Hiking Ben Lomond", desc: "Guided hike up Ben Lomond for panoramic views." },
      { day: 6, title: "Free Day", desc: "Optional skydiving or wine tasting in Gibbston Valley." }
    ]
  },
  {
    cityId: "COSTARICA", title: "Rainforest Expedition", destination: "Costa Rica", category: "Adventure", rating: 4.7, duration: "6 Days, 5 Nights", nights: 5, pax: "Family", basePrice: 62000,
    img: "https://images.unsplash.com/photo-1518182170546-076616fdfaaf?auto=format&fit=crop&w=1000",
    inclusions: ["Zipline Pass", "Volcano Tour", "Night Jungle Walk"], exclusions: ["Departure Tax"],
    flights: [
      { airline: "United Airlines", type: "2 Stops", price: 95000, logo: "🇺🇸", outTime: "01:00 AM", outArrive: "04:00 PM", retTime: "08:00 AM", retArrive: "10:00 PM (+1)" }
    ],
    hotels: [
      { name: "Arenal Springs Resort", stars: 4, area: "Arenal", pricePerNight: 18000, img: "https://images.unsplash.com/photo-1542314831-c6a4d14d8c85?auto=format&fit=crop&w=300" }
    ],
    itinerary: [
      { day: 1, title: "San Jose Arrival", desc: "Transfer to Arenal Volcano region." },
      { day: 2, title: "Canopy Ziplining", desc: "Soar through the rainforest canopy on 10 ziplines." },
      { day: 3, title: "Arenal Volcano Hike", desc: "Guided hike over ancient lava trails. Relax in hot springs." },
      { day: 4, title: "White Water Rafting", desc: "Class III and IV rapids on the Balsa River." },
      { day: 5, title: "Sloth Tour", desc: "Guided nature walk to spot sloths and toucans." }
    ]
  },
  {
    cityId: "TOKYO", title: "Neon Tokyo & Fuji", destination: "Tokyo, Japan", category: "Adventure", rating: 4.8, duration: "6 Days, 5 Nights", nights: 5, pax: "2 Adults", basePrice: 58000,
    img: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000",
    inclusions: ["JR Pass (7 Days)", "Fuji Tour", "Robot Restaurant"], exclusions: ["Meals"],
    flights: [
      { airline: "ANA", type: "Direct", price: 68000, logo: "🇯🇵", outTime: "08:00 PM", outArrive: "07:30 AM", retTime: "10:00 AM", retArrive: "04:30 PM" }
    ],
    hotels: [
      { name: "Shinjuku Granbell", stars: 4, area: "Shinjuku", pricePerNight: 15000, img: "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&w=300" }
    ],
    itinerary: [
      { day: 1, title: "Konnichiwa Tokyo", desc: "Land at Narita. Bullet train to Shinjuku." },
      { day: 2, title: "Shibuya & Harajuku", desc: "Cross Shibuya intersection. Evening go-karting in Akihabara." },
      { day: 3, title: "Mt. Fuji Explorer", desc: "Bus tour to Mt. Fuji 5th Station and Lake Kawaguchi." },
      { day: 4, title: "DisneySea", desc: "Full day pass to Tokyo DisneySea." },
      { day: 5, title: "Tech & Anime", desc: "Explore Akihabara. Farewell dinner at a Ninja themed restaurant." }
    ]
  },

  // --- CATEGORY: CULTURE ---
  {
    cityId: "RAJASTHAN", title: "Royal Rajasthan Heritage", destination: "Jaipur & Jaisalmer, India", category: "Culture", rating: 4.7, duration: "6 Days, 5 Nights", nights: 5, pax: "Family", basePrice: 40000,
    img: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1000",
    inclusions: ["AC Innova", "Camel Safari", "Folk Dance Show", "Fort Entries"], exclusions: ["Tips"],
    flights: [
      { airline: "Vistara", type: "Direct", price: 12000, logo: "🇮🇳", outTime: "06:00 AM", outArrive: "08:30 AM", retTime: "05:00 PM", retArrive: "07:30 PM" }
    ],
    hotels: [
      { name: "ITC Rajputana", stars: 5, area: "Jaipur", pricePerNight: 12000, img: "https://images.unsplash.com/photo-1541971875076-8f970d573be6?auto=format&fit=crop&w=300" },
      { name: "Suryagarh Camp", stars: 5, area: "Jaisalmer", pricePerNight: 18000, img: "https://images.unsplash.com/photo-1512626120412-faf41aba4b34?auto=format&fit=crop&w=300" }
    ],
    itinerary: [
      { day: 1, title: "Arrival in Jaipur", desc: "Pickup by Innova. Visit Chokhi Dhani Village." },
      { day: 2, title: "Pink City", desc: "Explore Amber Fort on elephant back. Visit Hawa Mahal." },
      { day: 3, title: "Travel to Jodhpur", desc: "Drive to Jodhpur. Visit Mehrangarh Fort." },
      { day: 4, title: "Jaisalmer Dunes", desc: "Drive to Jaisalmer. Evening camel safari in the Thar Desert." },
      { day: 5, title: "Golden Fort", desc: "Explore the living Jaisalmer Fort and Patwon Ki Haveli." }
    ]
  },
  {
    cityId: "ROME", title: "Gladiators & Empires", destination: "Rome, Italy", category: "Culture", rating: 4.9, duration: "5 Days, 4 Nights", nights: 4, pax: "Couple", basePrice: 55000,
    img: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1000",
    inclusions: ["Colosseum Skip-the-line", "Vatican Tour", "Pasta Making Class"], exclusions: ["City Tax"],
    flights: [
      { airline: "Emirates", type: "1 Stop", price: 62000, logo: "🇦🇪", outTime: "04:00 AM", outArrive: "01:30 PM", retTime: "03:00 PM", retArrive: "06:00 AM (+1)" }
    ],
    hotels: [
      { name: "Hotel Artemide", stars: 4, area: "Via Nazionale", pricePerNight: 20000, img: "https://images.unsplash.com/photo-1566073171639-4d9db53d6040?auto=format&fit=crop&w=300" }
    ],
    itinerary: [
      { day: 1, title: "Benvenuti a Roma", desc: "Check in. Toss a coin in the Trevi Fountain at night." },
      { day: 2, title: "Ancient Rome", desc: "Guided tour of the Colosseum, Roman Forum, and Palatine Hill." },
      { day: 3, title: "Vatican City", desc: "Morning tour of Vatican Museums, Sistine Chapel, and St. Peter's." },
      { day: 4, title: "Culinary Rome", desc: "Join a local chef for a traditional pasta and tiramisu making class." }
    ]
  },
  {
    cityId: "KYOTO", title: "Temples & Tea Houses", destination: "Kyoto, Japan", category: "Culture", rating: 4.8, duration: "6 Days, 5 Nights", nights: 5, pax: "2 Adults", basePrice: 60000,
    img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000",
    inclusions: ["Tea Ceremony", "Geisha District Tour", "Temple Passes"], exclusions: ["Lunch"],
    flights: [
      { airline: "Singapore Airlines", type: "1 Stop", price: 70000, logo: "🇸🇬", outTime: "11:00 PM", outArrive: "12:00 PM (+1)", retTime: "05:00 PM", retArrive: "11:30 PM" }
    ],
    hotels: [
      { name: "Kyoto Machiya (Ryokan)", stars: 4, area: "Gion", pricePerNight: 25000, img: "https://images.unsplash.com/photo-1542314831-c6a4d14d8c85?auto=format&fit=crop&w=300" }
    ],
    itinerary: [
      { day: 1, title: "Arrival in Kyoto", desc: "Check into your traditional Ryokan. Experience Kaiseki dinner." },
      { day: 2, title: "Golden Pavilion", desc: "Visit Kinkaku-ji and the Ryoan-ji Zen rock garden." },
      { day: 3, title: "Fushimi Inari", desc: "Early morning hike through the thousands of vermilion torii gates." },
      { day: 4, title: "Arashiyama Bamboo", desc: "Stroll through the majestic Arashiyama Bamboo Grove." },
      { day: 5, title: "Gion Culture", desc: "Traditional Japanese tea ceremony. Evening walk in the Geisha district." }
    ]
  },

  // --- CATEGORY: NATURE ---
  {
    cityId: "KERALA", title: "Kerala Backwater Bliss", destination: "Munnar & Alleppey", category: "Nature", rating: 4.8, duration: "5 Days, 4 Nights", nights: 4, pax: "Family", basePrice: 32000,
    img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000",
    inclusions: ["Private Houseboat", "Ayurvedic Massage", "Spice Plantation Tour"], exclusions: ["Camera Fees"],
    flights: [
      { airline: "Air India", type: "Direct", price: 15000, logo: "🇮🇳", outTime: "08:00 AM", outArrive: "10:30 AM", retTime: "02:00 PM", retArrive: "04:30 PM" }
    ],
    hotels: [
      { name: "Tea County Resort", stars: 4, area: "Munnar", pricePerNight: 7000, img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=300" },
      { name: "Premium AC Houseboat", stars: 4, area: "Alleppey", pricePerNight: 12000, img: "https://images.unsplash.com/photo-1512626120412-faf41aba4b34?auto=format&fit=crop&w=300" }
    ],
    itinerary: [
      { day: 1, title: "Arrival in Cochin", desc: "Drive to Munnar. Enroute visit Cheeyappara Waterfalls." },
      { day: 2, title: "Munnar Tea Gardens", desc: "Explore Eravikulam Park and local Tea Museum." },
      { day: 3, title: "Spice Trails", desc: "Visit Thekkady. Guided spice plantation tour and elephant ride." },
      { day: 4, title: "Houseboat Magic", desc: "Drive to Alleppey. Check into private houseboat for overnight backwater cruise." }
    ]
  },
  {
    cityId: "SWITZERLAND", title: "Swiss Alpine Grandeur", destination: "Zurich & Interlaken", category: "Nature", rating: 4.9, duration: "7 Days, 6 Nights", nights: 6, pax: "Couple", basePrice: 185000,
    img: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1000",
    inclusions: ["Swiss Travel Pass", "Mt. Titlis Cable Car", "Jungfraujoch Train"], exclusions: ["Meals"],
    flights: [
      { airline: "Swiss Air", type: "Direct", price: 65000, logo: "🇨🇭", outTime: "01:00 AM", outArrive: "06:30 AM", retTime: "10:00 PM", retArrive: "09:00 AM (+1)" }
    ],
    hotels: [
      { name: "Victoria-Jungfrau", stars: 5, area: "Interlaken", pricePerNight: 35000, img: "https://images.unsplash.com/photo-1551882547-ff40eb0d1e73?auto=format&fit=crop&w=300" }
    ],
    itinerary: [
      { day: 1, title: "Zurich Arrival", desc: "Train transfer to Interlaken using your Swiss Pass." },
      { day: 2, title: "Top of Europe", desc: "Cogwheel train journey up to Jungfraujoch." },
      { day: 3, title: "Mt. Titlis", desc: "Excursion to Mt. Titlis with the rotating Rotair cable car." },
      { day: 4, title: "Lake Lucerne", desc: "Scenic boat cruise on Lake Lucerne." },
      { day: 5, title: "Glacier Express", desc: "Board the famous panoramic train for breathtaking views." },
      { day: 6, title: "Zurich Walk", desc: "Return to Zurich. Enjoy a chocolate walking tour." }
    ]
  },
  {
    cityId: "BANFF", title: "Canadian Rockies", destination: "Banff, Canada", category: "Nature", rating: 4.8, duration: "6 Days, 5 Nights", nights: 5, pax: "Family", basePrice: 95000,
    img: "https://images.unsplash.com/photo-1517590214652-32b6951907cb?auto=format&fit=crop&w=1000",
    inclusions: ["National Park Pass", "Banff Gondola", "Lake Louise Canoe"], exclusions: ["Winter Gear"],
    flights: [
      { airline: "Air Canada", type: "1 Stop", price: 110000, logo: "🇨🇦", outTime: "11:30 PM", outArrive: "02:00 PM (+1)", retTime: "06:00 PM", retArrive: "08:00 PM (+1)" }
    ],
    hotels: [
      { name: "Fairmont Banff Springs", stars: 5, area: "Banff", pricePerNight: 40000, img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=300" }
    ],
    itinerary: [
      { day: 1, title: "Calgary to Banff", desc: "Arrive in Calgary, drive through the majestic Rockies to Banff." },
      { day: 2, title: "Banff Gondola", desc: "Ride to the top of Sulphur Mountain for 360-degree views." },
      { day: 3, title: "Lake Louise", desc: "Canoe on the turquoise waters of Lake Louise." },
      { day: 4, title: "Icefields Parkway", desc: "Drive the famous parkway and ride the Ice Explorer on Athabasca Glacier." },
      { day: 5, title: "Wildlife Tour", desc: "Guided evening safari to spot elk, bears, and moose." }
    ]
  },

  // --- CATEGORY: LUXURY ---
  {
    cityId: "DUBAI", title: "Dubai Extravagance", destination: "Dubai, UAE", category: "Luxury", rating: 5.0, duration: "5 Days, 4 Nights", nights: 4, pax: "Couple", basePrice: 120000,
    img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000",
    inclusions: ["Limousine Transfer", "Helicopter Tour", "Yacht Party"], exclusions: ["Personal Shopping"],
    flights: [
      { airline: "Emirates (Business)", type: "Direct", price: 110000, logo: "🇦🇪", outTime: "04:15 PM", outArrive: "06:30 PM", retTime: "09:00 AM", retArrive: "01:45 PM" }
    ],
    hotels: [
      { name: "Burj Al Arab Jumeirah", stars: 7, area: "Jumeirah Beach", pricePerNight: 95000, img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=300" }
    ],
    itinerary: [
      { day: 1, title: "VIP Welcome", desc: "Rolls Royce airport pickup. Check into your two-story suite." },
      { day: 2, title: "Helicopter Flight", desc: "15-minute aerial tour over The Palm and World Islands." },
      { day: 3, title: "Desert Glamping", desc: "Private vintage Land Rover safari with platinum dinner camp." },
      { day: 4, title: "Private Yacht", desc: "4-hour luxury yacht rental from Dubai Marina at sunset." }
    ]
  },
  {
    cityId: "BORABORA", title: "Polynesian Paradise", destination: "Bora Bora", category: "Luxury", rating: 5.0, duration: "7 Days, 6 Nights", nights: 6, pax: "Couple", basePrice: 250000,
    img: "https://images.unsplash.com/photo-1583037189850-1921bee23320?auto=format&fit=crop&w=1000",
    inclusions: ["Private Boat Transfer", "Butler Service", "Shark Feeding"], exclusions: ["Premium Alcohols"],
    flights: [
      { airline: "Air Tahiti Nui", type: "2 Stops", price: 160000, logo: "🇵🇫", outTime: "11:00 PM", outArrive: "09:00 AM (+2)", retTime: "11:00 PM", retArrive: "06:00 AM (+2)" }
    ],
    hotels: [
      { name: "Four Seasons Resort", stars: 5, area: "Motu Tehotu", pricePerNight: 120000, img: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=300" }
    ],
    itinerary: [
      { day: 1, title: "Tahiti to Bora Bora", desc: "Arrive via domestic flight, greeted with flower leis." },
      { day: 2, title: "Overwater Life", desc: "Breakfast delivered by traditional outrigger canoe to your bungalow." },
      { day: 3, title: "Lagoon Safari", desc: "Snorkel with stingrays and harmless blacktip reef sharks." },
      { day: 4, title: "Mt. Otemanu", desc: "Private 4x4 Jeep safari around the island's interior." },
      { day: 5, title: "Polynesian Spa", desc: "Couples massage using local Monoi oils." },
      { day: 6, title: "Sunset Sail", desc: "Private catamaran sail with champagne." }
    ]
  },
  {
    cityId: "MONACO", title: "Billionaire's Playground", destination: "Monte Carlo, Monaco", category: "Luxury", rating: 4.9, duration: "4 Days, 3 Nights", nights: 3, pax: "Couple", basePrice: 180000,
    img: "https://images.unsplash.com/photo-1541343831872-36c1e138cbce?auto=format&fit=crop&w=1000",
    inclusions: ["Casino Entry", "Supercar Rental", "Michelin Dinner"], exclusions: ["Casino Bets"],
    flights: [
      { airline: "Air France (Business)", type: "1 Stop", price: 145000, logo: "🇫🇷", outTime: "01:00 AM", outArrive: "09:00 AM", retTime: "12:00 PM", retArrive: "02:00 AM (+1)" }
    ],
    hotels: [
      { name: "Hotel de Paris Monte-Carlo", stars: 5, area: "Casino Square", pricePerNight: 85000, img: "https://images.unsplash.com/photo-1566073171639-4d9db53d6040?auto=format&fit=crop&w=300" }
    ],
    itinerary: [
      { day: 1, title: "Arrive in Style", desc: "Helicopter transfer from Nice Airport to Monaco." },
      { day: 2, title: "Formula 1 Track", desc: "Drive a Ferrari California around the famous F1 street circuit." },
      { day: 3, title: "Casino Royale", desc: "VIP table at Casino de Monte-Carlo, followed by a 3-star Michelin dinner." }
    ]
  }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/tours_and_travels");
    console.log("🔌 Connected to MongoDB");

    await Package.deleteMany({});
    console.log("🧹 Cleared old packages");

    await Package.insertMany(unifiedPackages);
    console.log(`✅ ${unifiedPackages.length} Highly Detailed Packages Seeded Successfully!`);

    process.exit();
  } catch (err) {
    console.error("❌ Seeding Error:", err);
    process.exit(1);
  }
};

seed();