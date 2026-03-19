import express from 'express';
import { searchTransport } from '../controllers/transport.controller.js';

const router = express.Router();

router.get('/search', searchTransport);

export default router;