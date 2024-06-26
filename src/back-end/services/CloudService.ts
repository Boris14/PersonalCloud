import formidable from 'formidable';
import FileData from '../interfaces/FileData.js'
import File from '../models/File.js';
import path from 'path';
import * as fs from 'fs';
import FileService from './FileService.js';
import UserController from '../controllers/UserController.js';

const scriptDirpath: string = process.cwd();
const cloudDirname: string = 'Cloud';
const cloudDirpath : string = path.join(scriptDirpath, cloudDirname);

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
        this.syncCloudAndDatabase();
    }

    static async syncCloudAndDatabase() : Promise<void> {
        if(!UserController.currentUser) {
            return;
        }

        try {
            const dbFiles = await FileService.getFilesByOwnerId(UserController.currentUser.id);
            const cloudFilenames : string[] = await fs.promises.readdir(cloudDirpath);

            if(dbFiles) {
                for(const dbFile of dbFiles) {
                    if(!cloudFilenames.includes(dbFile.filename)) {
                        console.log(`${dbFile.filename} isn't in Cloud. Removing it from Database`);
                        await FileService.deleteFile(dbFile.id);
                    }
                }
            }
            
            for(const filename of cloudFilenames) {
                const filepath : string = path.join(cloudDirpath, filename);
                if(!dbFiles?.find(item => item.filename == filename)) {
                    console.log(`${filename} isn't in Database. Removing it from Cloud`);
                    await fs.promises.rm(filepath).catch((err) => {
                        console.error(`Couldn't remove ${filename}. `, err);
                    });
                    continue;
                }
            }
        } catch(err) {
            console.error(err);
        }
    }

    static async uploadFiles(files: formidable.File[]) : Promise<void> {
        if(!UserController.currentUser) {
            throw new Error("Current user is undefined");
        }
        if(!files) {
            throw new Error("Files to upload are invalid");
        }

        for(const file of files) {
            if(!file.originalFilename) { 
                console.log("Invalid filename for upload");
                continue; 
            }
            try {
                // Check if it already exists in the Database
                const cloudFile = await FileService.getFileByName(file.originalFilename);
                if(cloudFile) { continue; }
            } catch(err) {
                console.error(err);
            }

            if(file.size <= 0) { continue; }

            const newFileData : FileData = {
                  owner_id: UserController.currentUser.id,
                  parent_id: null, // TODO: Get it from the Frontend (current folder)
                  is_folder: false, // TODO: Handle Folder creation
                  size: fs.statSync(file.filepath).size,
                  filename: file.originalFilename, 
            };

            try {
                await FileService.createFile(newFileData);

                const data : Buffer = await fs.promises.readFile(file.filepath);
                await fs.promises.writeFile(file.filepath, data);
            }
            catch(err) {
                console.error(err);
                continue;
            }
        }
    }

    static async downloadFile(fileId: string) : Promise<void> {
        try {
            const file = await CloudService.getCloudFileById(fileId);
            if(file) {
                let fileData : Buffer = await fs.promises.readFile(CloudService.getCloudFilepath(file.filename));
                await fs.promises.writeFile(path.join(scriptDirpath, file.filename), fileData);
            }
            else {
                console.error("Invalid File ID");
            }
        } catch(err) {
            console.error(err);
        }
    }

    static async downloadAllFiles() : Promise<void> {
        try {
            const filenames : string[] = await fs.promises.readdir(cloudDirpath);
            for(const filename of filenames) {
                const filepath = CloudService.getCloudFilepath(filename);
                try{
                    const fileData = await fs.promises.readFile(filepath);
                    await fs.promises.writeFile(path.join(scriptDirpath, filename), fileData);
                } catch(err)
                {
                    console.error(err);
                }
            }
        } catch(err) {
            console.error(err);
        }
    }

    static async getCloudFileById(fileId: string) : Promise<File | null> {
        const filenames : string[] = fs.readdirSync(cloudDirpath);
        for(const filename of filenames) {
            try{
                const file = await FileService.getFileById(fileId);
                if(file && file.filename == filename) {
                    return file;
                }
            } catch(err)
            {
                console.error(err);
            }
        }
        return null;
    }

    static getCloudFilepath(filename: string) : string {
        return path.join(cloudDirpath, filename);
    }

    static getPageHtml() : string {
        const userText : string = UserController.currentUser ? `of ${UserController.currentUser.username}` : "";
        return `
        <h2>Personal Cloud ${userText}</h2>
        <form action="/api/cloud/upload" enctype="multipart/form-data" method="post">
          <div>Files to upload: <input id="uploadFiles" type="file" name="multipleFiles" multiple="multiple" /></div>
          <input type="submit" value="Upload" />
        </form>
        <form action="/api/cloud/download" method="get">
          <input type="submit" value="Download All" />
        </form>
        `;
    }
}

export default CloudService;