import { Request, Response } from 'express';
import FileService from '../services/FileService.js';

class FileController {

    static async createFile(req: Request, res: Response) {
        try {
            const result = await FileService.createFile(req.body);
            if(result != null) {
                res.status(201).json(result);
            }
            else {
                res.status(400).json({ error: "Couldn't create file" });
            }
        } catch (error) {
            console.error('Error creating file:', error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
    static async getFileById(req: Request, res: Response) {
        try {
            const fileId = req.params.fileId;
            const file = await FileService.getFileById(fileId);
            if (file) {
                res.status(200).json(file);
            } else {
                res.status(404).json({ error: "File not found" });
            }
        } catch (error) {
            console.error('Error getting file by ID:', error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    static async getFilesByOwner(req: Request, res: Response) {
        try {
            const ownerId = req.params.ownerId;
            const files = await FileService.getFilesByOwnerId(ownerId);
            if (files) {
                res.status(200).json(files);
            } else {
                res.status(404).json({ error: "Files not found" });
            }
        } catch (error) {
            console.error('Error getting files by owner:', error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    static async moveFile(req: Request, res: Response) {
        try {
            const fileId = req.params.fileId;
            const newParentId = req.body.newParentId;
            const result = await FileService.moveFile(fileId, newParentId);
            if(result != null) {
                res.status(200).json({ message: "File moved successfully" });
            }
            else {
                res.status(400).json({ error: "Couldn't move file" });
            }
        } catch (error) {
            console.error('Error moving file:', error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    static async renameFile(req: Request, res: Response) {
        try {
            const fileId = req.params.fileId;
            const newName = req.body.newName;
            const result = await FileService.renameFile(fileId, newName);
            if (result == null) {
                res.status(404).json({ error: "Couldn't delete file"} );
            }
            else {
                res.status(200).json({ message: "File renamed successfully" });
            }
        } catch (error) {
            console.error('Error renaming file:', error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    static async deleteFile(req: Request, res: Response) {
        try {
            const fileId = req.params.fileId;
            const result = await FileService.deleteFile(fileId);
            if(result) {
                res.status(200).json({ message: "File deleted successfully" });
            }
            else {
                res.status(400).json({ error: "Couldn't delete file" });
            }
        } catch (error) {
            console.error('Error deleting file:', error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}

export default FileController;