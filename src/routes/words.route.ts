import express from 'express';
const router = express.Router();
import wordsController from '../controllers/words.controllers';

router.post('/add/word', wordsController.addWords);

export default router;
