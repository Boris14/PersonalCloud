import express from 'express';
import CloudController from '../controllers/CloudController.js';

const router = express.Router();

router.post('/cloud/upload', CloudController.uploadFiles);
router.get('/cloud/download', CloudController.downloadAllFiles);
router.get('/cloud/download/:fileId', CloudController.downloadFile);
router.get('*', CloudController.defaultPage);

export default router;