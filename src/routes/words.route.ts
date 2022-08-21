import express from 'express';
const router = express.Router();
import wordsController from '../controllers/words.controllers';

router.post('/add/word', wordsController.addWords);

router.delete('/remove/word', wordsController.removeWords);

export default router;
