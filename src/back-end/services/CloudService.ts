import formidable from 'formidable';
import crypto from 'crypto';
import FileData from '../interfaces/FileData.js'
import { Request } from 'express';
import path from 'path';
import * as fs from 'fs';
import Formidable from 'formidable/Formidable.js';

const scriptDirpath: string = process.cwd();
const cloudDirname: string = 'Cloud';
const cloudDirpath : string = path.join(scriptDirpath, cloudDirname);

var cloudFiles : FileData[] = [];

class CloudService {

    static InitCloud() : void {
        if(!fs.existsSync(cloudDirpath))
        {
            try{
                fs.mkdirSync(cloudDirpath);
            } catch(err) {
                console.error("Couldn't create Cloud directory. ", err);
                return;
            }
        }

        cloudFiles = [];

        this.syncCloudFiles();
    }

    static syncCloudFiles() : void {
        cloudFiles = cloudFiles.filter(file => {
            if (file.filepath) {
              return fs.existsSync(file.filepath);
            }
            return false;
          });

        try {
            const files : string[] = fs.readdirSync(cloudDirpath);
            files.forEach(file => {
                const fileId = this.getFileHash(file);
                if(this.isFileRegistered(fileId)) { return; }
                const filePath = path.join(cloudDirpath, file);
                const fileData = fs.readFileSync(filePath);
                const newFile : FileData = {
                    id: fileId, 
                    // TODO: Replace placeholder values with actual values
                    owner_id: "",
                    parent_id: null,
                    is_folder: false,
                    size: 1,
                    //
                    filename: file, 
                    filepath: filePath, 
                };
                cloudFiles.push(newFile);
            });   
        } catch(err) {
            console.error(err);
        }
    }

    static async uploadFiles(req: Request) : Promise<void> {
        const form : Formidable = formidable({allowEmptyFiles : true, minFileSize : 0});
        let files, fields;
        try {
            [fields, files] = await form.parse(req);
        } catch(err) {
            console.error(err);
            return;
        }

        if(files.multipleFiles) {
        for(const file of files.multipleFiles) {
            if(file.size <= 0) { continue; }

            let newFileData : FileData;
            if(file.originalFilename) {
                newFileData  = {
                    id: this.getFileHash(file.originalFilename),
                    // TODO: Replace placeholder values with actual values
                    owner_id: "",
                    parent_id: null,
                    is_folder: false,
                    size: 1,
                    // 
                    filename: file.originalFilename, 
                    filepath: path.join(cloudDirpath, file.originalFilename), 
                };
                if(newFileData.filename == '') { continue; }
                if(newFileData.id && this.isFileRegistered(newFileData.id)) { continue; }
                // Write the File in the Cloud
                if(newFileData.filepath) {
                    try {
                        let data : Buffer = await fs.promises.readFile(file.filepath);
                        await fs.promises.writeFile(newFileData.filepath, data);
                    } catch(err) {
                        console.error(err);
                        continue;
                    }
                }
                cloudFiles.push(newFileData);
            }
            
        }
        }
    }

    static async downloadFile(req: Request) : Promise<void> {
        const fileIndex = Number(req.params.id);
        const file : FileData | undefined = cloudFiles.at(fileIndex);
        if(file && file.filepath) {
            try {
                let fileData : Buffer = await fs.promises.readFile(file.filepath);
                await fs.promises.writeFile(path.join(scriptDirpath, file.filename), fileData) 
            } catch(err) {
                console.error(`Couldn't download ${file.filename}. `, err);
            }
        }
    }

    static async removeFile(req: Request) : Promise<void> {
        const fileIndex = Number(req.params.id);
        const file : FileData | undefined = cloudFiles.at(fileIndex);
        if(file && file.filepath) {
            await fs.promises.rm(file.filepath).then(() =>{
                cloudFiles.splice(fileIndex, 1);
            }, (err) => {
                console.error(`Couldn't remove ${file.filename}. `, err);
            })
        }
    }

    static async downloadAllFiles() : Promise<void> {
        for(const file of cloudFiles) {
            if(file.filepath) {
                try {
                    let fileData: Buffer;
                    try {
                        fileData = await fs.promises.readFile(file.filepath);
                        await fs.promises.writeFile(path.join(scriptDirpath, file.filename), fileData) 
                      } catch (error) {
                        console.error('Error reading file:', error);
                } 
                } catch(err) {
                    console.error("Download All Files Error. ", err);
                }
         }
        }
    }

    static getFileHash(filename: string) : string {
        const hash = crypto.createHash('sha256');
        hash.update(filename);
        return hash.digest('hex');
    }

    static isFileRegistered(id : string) : boolean {
        for(const cloudFile of cloudFiles) {
            if(cloudFile.id == id) {
                return true;
            }
        }
        return false;
    }

    static getPageHtml() : string {
        return `
        <h2>Personal Cloud</h2>
        ${this.getCloudFilesHtml()}
        <form action="/files/upload" enctype="multipart/form-data" method="post">
          <div>Files to upload: <input id="uploadFiles" type="file" name="multipleFiles" multiple="multiple" /></div>
          <input type="submit" value="Upload" />
        </form>
        <form action="/files/download/all" method="get">
          <input type="submit" value="Download All" />
        </form>
        `;
    }

    private static getCloudFilesHtml() : string {
        let result : string = "";
        for(let i = 0; i < cloudFiles.length; ++i) {
          result += 
          `<div>${cloudFiles[i].filename}</div>
          <form style="display: inline-block" action="/files/remove/${i}" method="post">
            <input type="submit" value="Remove" />
          </form>
          <form style="display: inline-block"  action="/files/download/${i}" method="get">
            <input type="submit" value="Download" />
          </form>\n`;
        }
        return result;
    }
}

export default CloudService;