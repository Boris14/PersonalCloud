import formidable from 'formidable';
import FileData from '../interfaces/FileData.js'
import * as fs from 'fs';

class CloudService {
    static async parseFilesToUpload(req: Request, storedFiles: FileData[]) : Promise<FileData[] | null> {
        const form : formidable.Formidable = formidable({allowEmptyFiles : true, minFileSize : 0});
        let files : formidable.FormidableFiles;
        let fields;
        try {
            [fields, files] = await form.parse(req);
        } catch(err) {
            console.error("Couldn't parse File for upload");
            return null;
        }
        let parsedFiles : FileData[] = [];
        for(const file of files.multipleFiles) {
            if(file.size <= 0) { continue; }
            let isAlreadyAdded = false;
            for(const storedFile of storedFiles) {
                if(storedFile.filename == file.originalFilename) {
                    isAlreadyAdded = true;
                    break;
                }
            }
            if(isAlreadyAdded) { continue; }
            let newFileData : FileData = {id: 0, filename: '', filepath: '', data: Buffer.from('')};
            newFileData.filename = file.originalFilename;
            newFileData.data = await fs.promises.readFile(file.filepath);
            if(newFileData.filename != '') {
                parsedFiles.push(newFileData);
            }
            await fs.promises.unlink(file.filepath).catch((err) => {
                console.error(`Failed to unlink ${file.filepath}: `, err);
            });
        }
        return parsedFiles;
    }

    static async downloadFilesToPath(files: FileData[], path: string) : Promise<void> {
        for(const file of files) {
            await fs.promises.writeFile(path + `\\${file.filename}`, file.data).catch((err) => {
                console.error(`Couldn't download ${file.filename}: `, err);
            });
        }
    }

    static getPageHtml(storedFiles: FileData[]) {
        return `
        <h2>Personal Cloud</h2>
        ${this.getStoredFilesHtml(storedFiles)}
        <form action="/upload" enctype="multipart/form-data" method="post">
          <div>Files to upload: <input id="uploadFiles" type="file" name="multipleFiles" multiple="multiple" /></div>
          <input type="submit" value="Upload" />
        </form>
        <form action="/download" method="post">
          <input type="submit" value="Download" />
        </form>
        `;
    }

    private static getStoredFilesHtml(storedFiles: FileData[]) {
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