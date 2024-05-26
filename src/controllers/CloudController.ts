import { Request, Response } from 'express';
import FileData from '../interfaces/FileData.js';
import CloudService from '../services/CloudService.js'

class CloudController{
    static async uploadFile(req : Request, res: Response) : Promise<void> {
      try{
        const uploadedFiles = await CloudService.parseFilesToUpload(req);
        if(uploadedFiles != null) {
          CloudService.uploadFiles(uploadedFiles);
        }
        else {
          res.status(400).json({ error: "No files uploaded" });
        }
      } catch (err) {
        console.error("Error uploading file:", err);
        res.status(500).json({error: "Internal server error"});
        return;
      }
      if(!res.writableEnded) {
        res.end(CloudService.getPageHtml());
      }
    }

    static async downloadFiles(req: Request, res: Response) : Promise<void> {
      try {
        await CloudService.downloadFiles();
      } catch(err) {
        console.error("Error downloading file:", err);
        res.status(400).json({error: "Couldn't download files"});
      }
      if(!res.writableEnded) {
        res.end(CloudService.getPageHtml());
      }
    }

    static async removeFile(req: Request, res: Response) : Promise<void> {
      const indexOfFileToRemove = Number(req.params.id);
      CloudService.removeFile(indexOfFileToRemove);
      res.end(CloudService.getPageHtml());
    }

    static async defaultPage(req: Request, res: Response) : Promise<void> {
      res.end(CloudService.getPageHtml());
    }
}

export default CloudController;