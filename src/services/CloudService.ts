import formidable from 'formidable';
import crypto from 'crypto';
import FileData from '../interfaces/FileData.js'
import path from 'path';
import express from 'express';
import * as fs from 'fs';

const scriptDirpath: string = process.cwd();
const cloudDirname: string = 'Cloud';

var cloudDirpath : string = path.join(scriptDirpath, cloudDirname);
var cloudFiles : FileData[] = [];
var router : express.Router;

class CloudService {
    static InitCloud(inRouter: express.Router) : Promise<void> {
        router = inRouter;

        if(!fs.existsSync(cloudDirpath))
        {
            try{
                fs.mkdirSync(cloudDirpath);
            } catch(err) {
                console.error("Couldn't create Cloud directory");
                return;
            }
        }

        cloudFiles = [];

        try{
            const files : string[] = fs.readdirSync(cloudDirpath);
            files.forEach(file => {
                const fileId = this.getFileHash(file);
                const filePath = path.join(cloudDirpath, file);
                const fileData = fs.readFileSync(filePath);
                const newFile : FileData = {
                    id: fileId, 
                    filename: file, 
                    filepath: filePath, 
                    data: fileData
                };
                cloudFiles.push(newFile);
            });   
        } catch(err) {
            console.error("Couldn't extract files from Cloud driectory");
        }
    }

    static async parseFilesToUpload(req: Request) : Promise<FileData[] | null> {
        const form : formidable.Formidable = formidable({allowEmptyFiles : true, minFileSize : 0});
        let files, fields;
        try {
            [fields, files] = await form.parse(req);
        } catch(err) {
            console.error("Couldn't parse File for upload");
            return null;
        }
        let parsedFiles : FileData[] = [];
        for(const file of files.multipleFiles) {
            if(file.size <= 0) { continue; }
            const newFilename : string = file.originalFilename;
            if(newFilename == '') { continue; }

            const newFileId : string = this.getFileHash(newFilename);
            let isAlreadyAdded = false;
            for(const cloudFile of cloudFiles) {
                if(cloudFile.id == newFileId) {
                    isAlreadyAdded = true;
                    break;
                }
            }
            if(isAlreadyAdded) { continue; }

            let newData : Buffer;
            try {
                newData = await fs.promises.readFile(file.filepath);
            } catch(err) {
                console.error("Couldn't read uploaded File");
                return null;
            }

            let newFileData : FileData = {
                id: newFileId, 
                filename: newFilename, 
                filepath: file.filepath, 
                data: newData
            };

            parsedFiles.push(newFileData);
            await fs.promises.unlink(file.filepath).catch((err) => {
                console.error(`Failed to unlink ${file.filepath}: `, err);
            });
        }
        return parsedFiles;
    }

    static async downloadFiles() : Promise<void> {
        for(const file of cloudFiles) {
            await fs.promises.writeFile(path.join(scriptDirpath, file.filename), file.data).catch((err) => {
                console.error(`Couldn't download ${file.filename}: `, err);
            });
        }
    }

    static async uploadFiles(files: FileData[]) {
        if(files == null){
            console.error('Upload files are null');
            return;
        }

        for(const file of files) {
            const newFilepath = path.join(cloudDirpath, file.filename);
            await fs.promises.writeFile(newFilepath, file.data).then(() => {
                file.filepath = newFilepath;
                cloudFiles.push(file);
                // Refresh page
            }, (err) => {
                console.error(`Couldn't upload file: `, err);
            });
        }
    }

    static async removeFile(fileIndex: number) {
        const file : FileData = cloudFiles.at(fileIndex);
        await fs.promises.rm(file.filepath).then(() =>{
            cloudFiles.splice(fileIndex, 1);
            // Refresh page
        }, (err) => {
            console.error(`Couldn't remove ${file.filename}: `, err);
        })
    }

    static getFileHash(filename: string) : string {
        const hash = crypto.createHash('sha256');
        hash.update(filename);
        return hash.digest('hex');
    }

    static getPageHtml() : string {
        return `
        <h2>Personal Cloud</h2>
        ${this.getCloudFilesHtml()}
        <form action="/upload" enctype="multipart/form-data" method="post">
          <div>Files to upload: <input id="uploadFiles" type="file" name="multipleFiles" multiple="multiple" /></div>
          <input type="submit" value="Upload" />
        </form>
        <form action="/download" method="post">
          <input type="submit" value="Download" />
        </form>
        `;
    }

    private static getCloudFilesHtml() : string {
        let result : string = "";
        for(let i = 0; i < cloudFiles.length; ++i) {
          result += 
          `<form action="/remove/${i}" method="post">
            <div>${cloudFiles[i].filename}</div>
            <input type="submit" value="Remove" />
          </form>\n`;
        }
        return result;
    }
}


export default CloudService;