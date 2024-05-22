import * as fs from 'fs';
import { createServer, Server } from 'node:http';
import formidable from 'formidable';
import { Request, Response } from 'express';

const dirPath: string = process.cwd();

var storedFileData : Buffer[] = [];
var storedFileNames : string[] = [];

function getStoredFilesHtml() : string {
    let result : string = "";
    for(let i = 0; i < storedFileNames.length; ++i) {
      result += 
      `<form action="/remove/${i}" method="post">
        <div>${storedFileNames[i]}</div>
        <input type="submit" value="Remove" />
      </form>\n`;
    }
    return result;
  }

function getPageHtml() : string {
    return `
    <h2>Personal Cloud</h2>
    ${getStoredFilesHtml()}
    <form action="/upload" enctype="multipart/form-data" method="post">
      <div>Files to upload: <input id="uploadFiles" type="file" name="multipleFiles" multiple="multiple" /></div>
      <input type="submit" value="Upload" />
    </form>
    <form action="/download" method="post">
      <input type="submit" value="Download" />
    </form>
    `;
  }

class CloudController{

    static async uploadFile(req : Request, res: Response) {
      // Parse a file upload
      const form : formidable.Formidable = formidable({allowEmptyFiles : true, minFileSize : 0});
      let fields, files;
      try {
          [fields, files] = await form.parse(req);
      } catch (err) {
          console.error(err);
          res.status(400).json({error: "Couldn't upload file"});
          return;
      }
      for(let i = 0; i < files.multipleFiles.length; ++i) {
        let file : formidable.File = files.multipleFiles[i];
        if(file.size <= 0) { continue; }
        var oldpath : string = file.filepath;
        storedFileNames.push(file.originalFilename);
        fs.readFile(file.filepath, function (err, data){
          storedFileData.push(data);
        });
        fs.unlink(oldpath, (err) => {
          if(err) throw err;
        });
      }
      res.end(getPageHtml());
    }

    static async downloadFile(req: Request, res: Response) {
      for(let i = 0; i < storedFileNames.length; ++i) {
        let fileName : string = storedFileNames[i];
        fs.writeFile(dirPath + `\\${fileName}`, storedFileData[i], function (err){
          if(err) throw err;
        });
      }
      res.end(getPageHtml());
    }

    static async removeFile(req: Request, res: Response) {
      const indexOfFileToRemove = Number(req.params.id);
      storedFileData.splice(indexOfFileToRemove, 1);
      storedFileNames.splice(indexOfFileToRemove, 1);
      res.end(getPageHtml());
    }

    static async defaultPage(req: Request, res: Response) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(getPageHtml());
    }
}

export default CloudController;