import express from 'express';
import FileController from '../controllers/FileController.js';

const router = express.Router();

router.post('/files', FileController.createFile);
router.get('/files/:fileId', FileController.getFileById);
router.get('/files/owner/:ownerId', FileController.getFilesByOwner);
router.put('/files/move/:fileId', FileController.moveFile);
router.put('/files/rename/:fileId', FileController.renameFile);
router.delete('/files/:fileId', FileController.deleteFile);

export default router;