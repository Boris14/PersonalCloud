import File from '../models/File.js';
import User from '../models/User.js';
import FileData from '../interfaces/FileData.js';

class FileService {

    static async createFile(fileData: FileData): Promise<File | null> {
        try {
            const user = await User.findByPk(fileData.owner_id);
            if (user == null) {
                console.error("Bad request: Invalid owner id");
                return null;
            }

            if (fileData.parent_id != null) {
                const folder = await File.findByPk(fileData.parent_id);
                if(folder == null || folder.is_folder == false || folder.owner_id != fileData.owner_id) {
                    console.error("Bad request: Parent is not a valid folder");
                    return null;
                }
            }

            const file = await File.create(
                { 
                    owner_id: fileData.owner_id,
                    parent_id: fileData.parent_id,
                    is_folder: fileData.is_folder,
                    filename: fileData.filename, 
                    size: fileData.size, 
                });
            return file;
        } catch (error) {
            console.error('Error creating file:', error);
            return null;
        }
    }

    static async getFileById(fileId: string): Promise<File | null> {
        try {
            return await File.findByPk(fileId);
        } catch (error) {
            console.error('Error getting user:', error);
            return null;
        }
    }

    static async moveFile(fileId: string, destinationId: string): Promise<File | null> {
        try {
            const file = await File.findByPk(fileId);
            if (file == null) {
                console.error("Bad request: Invalid file id");
                return null;
            }
            
            const folder = await File.findByPk(destinationId);
            if (folder == null) {
                console.error("Bad request: Invalid folder id");
                return null;
            }

            if (folder.id == file.id){
                console.error("Bad request: Source and destination are the same folder");
                return null;
            }

            if (file.is_folder && await FileService.isParentOf(file, folder)) {
                console.error("Bad request: Can't move parent folder into child folder");
                return null;
            }

            if (folder.is_folder == false) {
                console.error("Bad request: Destination not a folder in move request")
                return null;
            }

            if (file.owner_id != folder.owner_id) {
                console.error("Bad request: Folder and file have different owners");
                return null;
            }

            const updateData = {
                "parent_id": destinationId,
            }

            return await file.update(updateData);
        } catch (error) {
            console.error('Error moving file:', error);
            return null;
        }
    }

    static async renameFile(fileId: string, newName: string): Promise<File | null> {
        try {
            const file = await File.findByPk(fileId);
            if (file == null) {
                console.error("Bad request: Invalid file id");
                return null;
            }
            
            const updateData = {
                "filename": newName,
            }

            return await file.update(updateData);
        } catch (error) {
            console.error('Error renaming file:', error);
            return null;
        }
    }

    static async deleteFile(fileId: string) : Promise<boolean> {
        try {
            const file = await File.findByPk(fileId);
            if (file) {
                if (file.is_folder == true) {
                    await this.deleteRecursive(fileId, file);
                }
                else {
                    await file.destroy();
                }
                return true;
            }

            return false;
        } catch (error) {
            console.error('Error deleting file:', error);
            return false;
        }
    }

    static async getFilesByOwnerId(ownerId: string): Promise<File[] | null> {
        try {
            const files = await File.findAll({ where: { owner_id: ownerId } });
            return files;
        } catch (error) {
            console.error('Error getting files by owner ID:', error);
            return null;
        }
    }

    private static async deleteRecursive(folderId: string, folder: File) {
         const files = await File.findAll({ where: { parent_id: folderId } });

         for (const file of files) {
            if (file.is_folder == true) {
                await this.deleteRecursive(file.id, file);
            }
            else {
                await file.destroy();
            }
         }

         await folder.destroy();
    }

    private static async isParentOf(folder: File, destination: File): Promise<boolean> {
        
        let folderParent = folder.id;
        let current: File = destination;

        while (current.parent_id !== null) {
            if (current.parent_id == folderParent) {
                return true;
            }

            const next = await File.findByPk(current.parent_id);
            if(next != null) {
                current = next;
            }
            else {
                break;
            }
        }
        return false;
    }
}

export default FileService;