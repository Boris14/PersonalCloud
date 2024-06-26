import express from 'express';
import FileController from '../controllers/FileController.js';

const router = express.Router();

router.get('/files/:fileId', FileController.getFileById);
router.delete('/files/:fileId', FileController.deleteFile); 
router.get('/files/owner/:ownerId', FileController.getFilesByOwner);
router.put('/files/move/:fileId', FileController.moveFile);
router.put('/files/rename/:fileId', FileController.renameFile);

export default router;