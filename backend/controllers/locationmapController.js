const Location = require('../models/Location'); 

// Get all locations for the map
exports.getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching locations", error: error.message });
  }
};

// Add a new location (You can use this via Postman to add cities to your DB)
exports.addLocation = async (req, res) => {
  try {
    const newLocation = new Location(req.body);
    const savedLocation = await newLocation.save();
    res.status(201).json(savedLocation);
  } catch (error) {
    res.status(500).json({ message: "Error adding location", error: error.message });
  }
};