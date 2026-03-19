import express from 'express';
import { searchTransport } from '../controllers/transportcontroller.js';

const router = express.Router();

router.get('/search', searchTransport);

export default router;