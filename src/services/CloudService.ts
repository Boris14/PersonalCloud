import formidable from 'formidable';
import crypto from 'crypto';
import FileData from '../interfaces/FileData.js'
import path from 'path';
import * as fs from 'fs';

const scriptDirpath: string = process.cwd();
const storageDirname: string = 'Cloud';

var storageDirpath : string = '';
var storedFiles : FileData[] = [];

class CloudService {
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
            for(const storedFile of storedFiles) {
                if(storedFile.id == newFileId) {
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
        for(const file of storedFiles) {
            await fs.promises.writeFile(scriptDirpath, file.data).catch((err) => {
                console.error(`Couldn't download ${file.filename}: `, err);
            });
        }
    }

    static async uploadFiles(files: FileData[]) {
        if(files == null){
            console.error('Upload files are null');
            return;
        }
        if(storageDirpath == '') {
            let newDirpath = await this.makeStorageDir(storageDirname, scriptDirpath);
            storageDirpath = newDirpath;
            if(storageDirpath == null) {
                console.error(`Couldn't create storage directory`);
                return;
            }
        }

        storedFiles.push(...files);

        for(const file of files) {
            const newFilepath = path.join(storageDirpath, file.filename);
            await fs.promises.writeFile(newFilepath, file.data).catch((err) => {
                console.error(`Couldn't upload ${file.filename}: `, err);
            });
        }
    }

    static removeFile(fileIndex: number) {
        storedFiles.splice(fileIndex, 1);
    }

    static async makeStorageDir(dirname: string, scriptDirpath: string) : Promise<string | null> {
        const newDirpath = path.join(scriptDirpath, dirname);
        try {
            await fs.promises.mkdir(newDirpath);
        } catch(err) {
            console.error(`Couldn't create storage directory: `, err);
            return null;
        }
        return newDirpath;
    }

    static getFileHash(filename: string) : string {
        const hash = crypto.createHash('sha256');
        hash.update(filename);
        return hash.digest('hex');
    }

    static getPageHtml() : string {
        return `
        <h2>Personal Cloud</h2>
        ${this.getStoredFilesHtml()}
        <form action="/upload" enctype="multipart/form-data" method="post">
          <div>Files to upload: <input id="uploadFiles" type="file" name="multipleFiles" multiple="multiple" /></div>
          <input type="submit" value="Upload" />
        </form>
        <form action="/download" method="post">
          <input type="submit" value="Download" />
        </form>
        `;
    }

    private static getStoredFilesHtml() : string {
        let result : string = "";
        for(let i = 0; i < storedFiles.length; ++i) {
          result += 
          `<form action="/remove/${i}" method="post">
            <div>${storedFiles[i].filename}</div>
            <input type="submit" value="Remove" />
          </form>\n`;
        }
        return result;
    }
}


export default CloudService;