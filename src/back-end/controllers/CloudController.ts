import { Request, Response } from 'express'; 
import fs from 'fs'; 
import path from 'path'; 
import CloudService from '../services/CloudService.js';
import UserController from './UserController.js';
import FileService from '../services/FileService.js';
import formidable from 'formidable';


class CloudController {
  static async getAllFiles(req: Request, res: Response): Promise<void> {
    try {
      const ownerId = req.params.ownerId || UserController.currentUser.id;
      const files = await CloudService.getAllFiles(ownerId);
      res.status(200).json(files);
    } catch (error) {
      console.error('Error getting files:', error);
      res.status(500).json({ error: 'Error getting files' });
    }
  }

 static async uploadFiles(req: Request, res: Response): Promise<void> {
    try {
      const form = formidable({ allowEmptyFiles: true, minFileSize: 0 });
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Upload Files Error' });
          return;
        }

        const parentId = fields.parentId || null;

        if (files.multipleFiles) {
          await CloudService.uploadFiles(files.multipleFiles, parentId);
        } else {
          res.status(500).json({ error: 'Upload Files Error' });
          return;
        }

        res.status(200).json({ message: 'Files uploaded successfully' });
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Upload Files Error' });
    }
  }

  static async downloadFile(req: Request, res: Response): Promise<void> { // Explicitly type req and res
    try {
      const fileId = req.params.fileId;
      const file = await CloudService.getCloudFileById(fileId);
      
      if (!file) {
        res.status(404).json({ error: 'File not found' });
        return;
      }

      const fileData = await fs.promises.readFile(CloudService.getCloudFilepath(file.id));

      // Determine the correct Content-Type based on file extension
      let contentType = 'application/octet-stream'; // default content type for unknown types
      const fileExtension = path.extname(file.filename).toLowerCase();

      switch (fileExtension) {
        case '.pdf':
          contentType = 'application/pdf';
          break;
        case '.jpg':
        case '.jpeg':
          contentType = 'image/jpeg';
          break;
        case '.png':
          contentType = 'image/png';
          break;
      }

      // Set the Content-Disposition header to force download with the correct filename
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);

      res.send(fileData);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Download File Error' });
    }
  }
  

  static async downloadAllFiles(req: Request, res: Response): Promise<void> {
    try {
      await CloudService.downloadAllFiles();
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Download All Files Error' });
      return;
    }
    res.redirect('/api');
  }

  static async moveFile(req: Request, res: Response): Promise<void> {
    try {
      const { fileId, destinationId } = req.body;
      await CloudService.moveFile(fileId, destinationId);
      res.status(200).json({ message: 'File moved successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Move File Error' });
    }
  }

  static async renameFile(req: Request, res: Response): Promise<void> {
    try {
      const { fileId, newName } = req.body;
      await CloudService.renameFile(fileId, newName);
      res.status(200).json({ message: 'File renamed successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Rename File Error' });
    }
  }

  static async deleteFile(req: Request, res: Response): Promise<void> {
    try {
      const fileId = req.params.fileId;
      await CloudService.deleteFile(fileId);
      res.status(200).json({ message: 'File deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Delete File Error' });
    }
  }

  static async getFilesByOwner(req: Request, res: Response): Promise<void> {
    try {
        const ownerId = UserController.currentUser.id;
        const files = await FileService.getFilesByOwnerId(ownerId);
        res.status(200).json(files);
    } catch (error) {
        console.error('Error getting files by owner ID:', error);
        res.status(500).json({ error: 'Error getting files' });
    }
}

  static async getFilesByParent(req: Request, res: Response)
  {
      try {
          const ownerId = req.params.ownerId;
          const parentId = req.params.parentId;
          const files = await FileService.getFilesByOwnerIdAndParentId(ownerId, parentId);
          if (files) {
              res.status(200).json(files);
          } else {
              res.status(404).json({ error: "Files not found" });
          }
      } catch (error) {
          console.error('Error getting files by owner and parent:', error);
          res.status(500).json({ error: "Internal server error" });
      }
  }
  static async createFolder(req: Request, res: Response): Promise<void> {
    try {
      const { folderName, parentId } = req.body;
      await CloudService.createFolder(folderName, parentId);
      res.status(200).json({ message: 'Folder created successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Create Folder Error' });
    }
  }
}

export default CloudController;
