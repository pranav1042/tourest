import express from 'express';
import Package from '../models/Package.js';

const router = express.Router();

// 1. GET ALL PACKAGES
router.get('/', async (req, res) => {
  try {
    const packages = await Package.find();
    res.json(packages);
  } catch (error) {
    console.error("Error fetching all packages:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// 2. GET SINGLE PACKAGE BY CITY ID
router.get('/:cityId', async (req, res) => {
  try {
    const cityPackage = await Package.findOne({ cityId: req.params.cityId.toUpperCase() });
    
    if (!cityPackage) {
      return res.status(404).json({ message: "Destination data not found." });
    }
    
    res.json(cityPackage);
  } catch (error) {
    console.error(`Error fetching package for ${req.params.cityId}:`, error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;