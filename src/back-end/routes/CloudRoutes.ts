import express from 'express';
import CloudController from '../controllers/CloudController.js';

const router = express.Router();

router.post('/files/upload', CloudController.uploadFile);
router.post('/files/remove/:id', CloudController.removeFile);
router.get('/files/download/all', CloudController.downloadAllFiles);
router.get('/files/download/:id', CloudController.downloadFile);
router.get('*', CloudController.defaultPage);

export default router;
