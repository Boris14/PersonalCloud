import express from 'express';
import SharedWithController from '../controllers/SharedWithController.js';

const router = express.Router();

router.post('/shared', SharedWithController.share);
router.delete('/shared/:shareId', SharedWithController.stopSharing);

export default router;