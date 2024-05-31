import { Request, Response } from 'express';
import CloudService from '../services/CloudService.js'

class CloudController{
    static async uploadFile(req : Request, res: Response) : Promise<void> {
      try {
        await CloudService.uploadFiles(req);
      } catch (err) {
        console.error(err);
        res.status(500).json({error: "Upload Files Error"});
        return;
      }
      res.redirect('/');
    }

    static async downloadFile(req: Request, res: Response) : Promise<void> {
      try {
        await CloudService.downloadFile(req);
      } catch(err) {
        console.error(err);
        res.status(400).json({error: "Download File Error"});
        return;
      }
      res.redirect('/');
    }

    static async removeFile(req: Request, res: Response) : Promise<void> {
      try {
        CloudService.removeFile(req);
      } catch(err) {
        console.error(err);
        res.status(500).json({error: "Remove File Error"});
        return;
      }
      res.redirect('/');
    }

    static async downloadAllFiles(req: Request, res: Response) : Promise<void> {
      try {
        await CloudService.downloadAllFiles();
      } catch(err) {
        console.error(err);
        res.status(400).json({error: "Download All Files Error"});
        return;
      }
      res.redirect('/');
    }

    static async defaultPage(req: Request, res: Response) : Promise<void> {
      CloudService.syncCloudFiles();
      res.end(CloudService.getPageHtml());
    }
}

export default CloudController;