import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema({
  airline: String,
  type: String,
  price: Number,
  logo: String,
  outTime: String,
  outArrive: String,
  retTime: String,
  retArrive: String
});

const hotelSchema = new mongoose.Schema({
  name: String,
  stars: Number,
  area: String,
  pricePerNight: Number,
  img: String
});

const itinerarySchema = new mongoose.Schema({
  day: Number,
  title: String,
  desc: String
});

const packageSchema = new mongoose.Schema({
  cityId: { type: String, required: true, unique: true },
  title: String,
  destination: String,
  category: String,
  rating: Number,
  duration: String,
  nights: Number,
  pax: String,
  basePrice: Number,
  img: String,
  inclusions: [String],
  exclusions: [String],
  flights: [flightSchema],
  hotels: [hotelSchema],
  itinerary: [itinerarySchema]
});

export default mongoose.model('Package', packageSchema);