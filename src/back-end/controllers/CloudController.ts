import { Request, Response } from 'express';
import CloudService from '../services/CloudService.js'
import formidable from 'formidable';

class CloudController{
    static async uploadFiles(req : Request, res: Response) : Promise<void> {
      try {
        const form = formidable({allowEmptyFiles : true, minFileSize : 0});
        let files, fields;
        [fields, files] = await form.parse(req);
    
        if(files.multipleFiles) {
          await CloudService.uploadFiles(files.multipleFiles);
        }
        else {
          res.status(500).json({error: "Upload Files Error"});
          return;
        }
      } catch (err) {
        console.error(err);
        res.status(500).json({error: "Upload Files Error"});
        return;
      }
      res.redirect('/api');
      res.status(200);
    }

    static async downloadFile(req: Request, res: Response) : Promise<void> {
      try {
        const fileId = req.params.fileId;
        await CloudService.downloadFile(fileId);
      } catch(err) {
        console.error(err);
        res.status(500).json({error: "Download File Error"});
        return;
      }
      res.redirect('/api');
      res.status(200);
    }

    static async downloadAllFiles(req: Request, res: Response) : Promise<void> {
      try {
        await CloudService.downloadAllFiles();
      } catch(err) {
        console.error(err);
        res.status(400).json({error: "Download All Files Error"});
        return;
      }
      res.redirect('/api');
    }

    static async defaultPage(req: Request, res: Response) : Promise<void> {
      CloudService.syncCloudAndDatabase();
      res.end(CloudService.getPageHtml());
    }
}

export default CloudController;