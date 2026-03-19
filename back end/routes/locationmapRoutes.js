import express from 'express';
import { getAllLocations, addLocation } from '../controllers/locationController.js';

const router = express.Router();

// GET: Fetch all locations for the React Map
router.get('/', getAllLocations);

// POST: Add a new location to the database
router.post('/', addLocation);

export default router;