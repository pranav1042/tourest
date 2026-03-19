export const fetchLiveBuses = async (origin, dest, distance, date) => {
  await new Promise(resolve => setTimeout(resolve, 600)); // Simulate API delay

  // Average bus speed is ~50 km/h. Price is ~₹1.2 per km
  const durationHours = distance / 50;
  const hours = Math.floor(durationHours);
  const mins = Math.round((durationHours - hours) * 60);
  
  const basePrice = Math.round(distance * 1.2);

  return [
    { 
      type: "Bus", 
      provider: "IntrCity SmartBus", 
      price: basePrice + 300, 
      duration: `${hours}h ${mins}m`, 
      departureTime: "09:30 PM",
      class: "A/C Sleeper (2+1)"
    },
    { 
      type: "Bus", 
      provider: "Zingbus Premium", 
      price: basePrice + 500, 
      duration: `${hours}h ${mins}m`, 
      departureTime: "10:45 PM",
      class: "Volvo Multi-Axle A/C"
    }
  ];
};