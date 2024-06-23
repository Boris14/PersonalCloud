interface FileData {
    // TODO: Delete id property, database generates an id and returns it as a property in 'File' object
    id: string | null,
    // TODO: Maybe delete filepath property (not needed)
    filepath: string | null,
    owner_id: string;
    parent_id: string | null;
    is_folder: boolean;
    filename: string;
    size: number;
}

export default FileData;