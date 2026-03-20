// (Keep your existing Amadeus code here, but update the fallback logic)
export const fetchRealFlights = async (originCode, destCode, distance, date) => {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API

  // Flight duration: 800 km/h + 1 hour for takeoff/landing. Price: ~₹6 per km
  const durationHours = (distance / 800) + 1;
  const hours = Math.floor(durationHours);
  const mins = Math.round((durationHours - hours) * 60);
  
  const basePrice = Math.round((distance * 6) / 100) * 100; // Round to nearest 100

  return [
    { 
      type: "Flight", 
      provider: "Vistara Airways", 
      price: basePrice + 1200, 
      duration: `${hours}h ${mins}m`, 
      departureTime: "08:15 AM",
      class: "Economy"
    },
    { 
      type: "Flight", 
      provider: "IndiGo", 
      price: basePrice - 500, 
      duration: `${hours}h ${mins}m`, 
      departureTime: "02:40 PM",
      class: "Economy"
    },
    { 
      type: "Flight", 
      provider: "Air India", 
      price: basePrice + 4500, 
      duration: `${hours}h ${mins}m`, 
      departureTime: "07:00 PM",
      class: "Business"
    }
  ];
};