import express from 'express';
import { suggestCities } from '../controllers/cityController.js';

const router = express.Router();

// The frontend will call: http://localhost:5000/api/cities/suggest?q=mumbai
router.get('/suggest', suggestCities);

export default router;