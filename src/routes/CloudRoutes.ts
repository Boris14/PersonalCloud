import express from 'express';
import CloudController from '../controllers/CloudController.js';

const router = express.Router();

router.post('/upload', CloudController.uploadFile);
router.post('/download', CloudController.downloadFile);
router.post('/remove', CloudController.removeFile);
router.get('/', CloudController.defaultPage);

export default router;
