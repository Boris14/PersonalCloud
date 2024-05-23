import { Request, Response } from 'express';
import FileData from '../interfaces/FileData.js';
import CloudService from '../services/CloudService.js'

const dirPath: string = process.cwd();

var storedFiles : FileData[] = [];

class CloudController{

    static async uploadFile(req : Request, res: Response) : Promise<void> {
      try{
        const uploadedFiles = await CloudService.parseFilesToUpload(req, storedFiles);
        if(uploadedFiles != null) {
          storedFiles.push(...uploadedFiles);
        }
        else {
          res.status(400).json({ error: "No files uploaded" });
        }
      } catch (err) {
        console.error("Error uploading file:", err);
        res.status(500).json({error: "Internal server error"});
      }
      res.end(CloudService.getPageHtml(storedFiles));
    }

    static async downloadFile(req: Request, res: Response) : Promise<void> {
      try {
        await CloudService.downloadFilesToPath(storedFiles, dirPath);
      } catch(err) {
        console.error("Error downloading file:", err);
        res.status(400).json({error: "Couldn't download file"});
      }
      res.end(CloudService.getPageHtml(storedFiles));
    }

    static async removeFile(req: Request, res: Response) : Promise<void> {
      const indexOfFileToRemove = Number(req.params.id);
      storedFiles.splice(indexOfFileToRemove, 1);
      res.end(CloudService.getPageHtml(storedFiles));
    }

    static async defaultPage(req: Request, res: Response) : Promise<void> {
      res.end(CloudService.getPageHtml(storedFiles));
    }
}

export default CloudController;