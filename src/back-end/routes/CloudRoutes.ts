import express from 'express';
import CloudController from '../controllers/CloudController.js';

const router = express.Router();

router.post('/cloud/upload', CloudController.uploadFiles);
router.get('/cloud/download', CloudController.downloadAllFiles);
router.get('/cloud/download/:fileId', CloudController.downloadFile);
router.post('/cloud/folder', CloudController.createFolder);
router.put('/cloud/move', CloudController.moveFile);
router.put('/cloud/rename', CloudController.renameFile);
router.delete('/cloud/:fileId', CloudController.deleteFile);
router.get('/cloud/files', CloudController.getAllFiles);
router.get('/cloud/owner/:ownerId/files/:parentId', CloudController.getFilesByParent);

export default router;
