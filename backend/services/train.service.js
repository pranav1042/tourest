export const fetchLiveTrains = async (origin, dest, distance, date) => {
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay

  // Average train speed in India is ~70 km/h. Base price is ~₹1.8 per km
  const durationHours = distance / 70;
  const hours = Math.floor(durationHours);
  const mins = Math.round((durationHours - hours) * 60);
  
  const basePrice = Math.round(distance * 1.8);

  return [
    { 
      type: "Train", 
      provider: "Vande Bharat Express (Premium)", 
      price: basePrice + 800, 
      duration: `${Math.floor(hours * 0.8)}h ${mins}m`, // Vande Bharat is faster
      departureTime: "06:00 AM",
      class: "AC Chair Car"
    },
    { 
      type: "Train", 
      provider: "Rajdhani Express", 
      price: basePrice + 400, 
      duration: `${hours}h ${mins}m`, 
      departureTime: "04:30 PM",
      class: "3A AC"
    },
    { 
      type: "Train", 
      provider: "Duronto Superfast", 
      price: basePrice, 
      duration: `${hours + 1}h ${mins}m`, 
      departureTime: "10:15 PM",
      class: "Sleeper"
    }
  ];
};