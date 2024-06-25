import formidable from 'formidable';
import crypto from 'crypto';
import FileData from '../interfaces/FileData.js'
import { Request } from 'express';
import path from 'path';
import * as fs from 'fs';
import Formidable from 'formidable/Formidable.js';
import FileService from './FileService.js';
import UserController from '../controllers/UserController.js';

const scriptDirpath: string = process.cwd();
const cloudDirname: string = 'Cloud';
const cloudDirpath : string = path.join(scriptDirpath, cloudDirname);

var cloudFiles : FileData[] = []; // TODO: Remove. We only need the Cloud Directory content and the Metadata from the Database

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

    static async syncCloudFiles() : Promise<void> {
        cloudFiles = cloudFiles.filter(file => {
            if (file.filepath) {
              return fs.existsSync(file.filepath);
            }
            return false;
        });

        if(!UserController.currentUser) {
            return;
        }

        try{        
            const filenames : string[] = fs.readdirSync(cloudDirpath);
            for(let i = 0; i < filenames.length; ++i) {
                const filename : string = filenames[i];
                const filepath : string = path.join(cloudDirpath, filename);
                const isRegistered : boolean = this.isFileRegistered(filename);
                const file = await FileService.getFileByName(filename);
                if(!file) {
                    console.log("File isn't in Database. Removing it");
                    await fs.promises.rm(filepath).then(() =>{
                        cloudFiles = cloudFiles.filter(cloudFile => {
                            return cloudFile.filename != filename;
                        });
                    }, (err) => {
                        console.error(`Couldn't remove ${filename}. `, err);
                    })
                    continue;
                }
                if(isRegistered) { return; }
                
                const newFileData : FileData = {
                    id: file.id, 
                    owner_id: file.owner_id,
                    parent_id: file.parent_id,
                    is_folder: file.is_folder,
                    size: file.size,
                    filename: filename, 
                    filepath: path.join(cloudDirpath, filename), 
                };
                cloudFiles.push(newFileData);
            }
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

        if(!UserController.currentUser) {
            throw new Error("Current user is undefined");
        }

        if(files.multipleFiles) {
            for(const file of files.multipleFiles) {
                if(file.size <= 0) { continue; }
                let newFileData : FileData;
                if(file.originalFilename) {
                    newFileData  = {
                        id: this.getFileHash(file.originalFilename),
                        owner_id: UserController.currentUser.id,
                        parent_id: null, // TODO: Get it from the Frontend (current folder)
                        is_folder: false, // TODO: Handle Folder creation
                        size: fs.statSync(file.filepath).size,
                        filename: file.originalFilename, 
                        filepath: path.join(cloudDirpath, file.originalFilename), // TODO: Maybe remove (not needed)
                    };
                    if(newFileData.filename == '' || this.isFileRegistered(newFileData.filename)) { continue; }

                    try{
                        const newFile = await FileService.createFile(newFileData);
                        if(!newFile) {
                            throw new Error("Couldn't create new File in the Cloud");
                        }
                        newFileData.id = newFile.id;
                    }
                    catch(err) {
                        console.error(err);
                        continue;
                    }

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
        if(file && file.filepath && file.id != undefined) {
            try{
                await FileService.deleteFile(file.id);
            }
            catch(err) {
                console.error(`Couldn't delete ${file.filename} from Database. `, err);
                return;
            }

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

    static isFileRegistered(filename : string) : boolean {
        for(const cloudFile of cloudFiles) {
            if(cloudFile.filename == filename) {
                return true;
            }
        }
        return false;
    }

    static getPageHtml() : string {
        const userText : string = UserController.currentUser ? `of ${UserController.currentUser.username}` : "";
        return `
        <h2>Personal Cloud ${userText}</h2>
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