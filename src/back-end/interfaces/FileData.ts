interface FileData {
    owner_id: string;
    parent_id: string | null;
    is_folder: boolean;
    filename: string;
    size: number;
}

export default FileData;