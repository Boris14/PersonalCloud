import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faFileImage, faFilePdf, faFileWord, faFileExcel, faFileArchive, faFileAlt } from '@fortawesome/free-solid-svg-icons';

const YourFilesContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  box-sizing: border-box;
  text-align: center;
`;

const YourFilesTitle = styled.h2`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
`;

const FileList = styled.ul`
  list-style: none;
  padding: 0;
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const FileItem = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 150px;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const FileIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 0.5rem;
`;

const FileName = styled.span`
  font-size: 1rem;
  color: #555;
  word-break: break-word;
  margin-bottom: 0.5rem;
`;

const FileActions = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const ActionButton = styled.button`
  padding: 0.3rem 0.6rem;
  font-size: 0.9rem;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
  &:hover {
    background-color: #0056b3;
  }
`;

const Input = styled.input`
  margin: 12px;
  font-size: 1rem;
  margin-right: 0.5rem;
`;

const UploadInput = styled.input`
  display: none;
`;

const UploadLabel = styled.label`
  padding: 12px;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  background-color: #28a745;
  color: #fff;
  &:hover {
    background-color: #218838;
  }
`;

const Button = styled.button`
  padding: 12px;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
  &:hover {
    background-color: #0056b3;
  }
`;

interface FileData {
  id: string;
  filename: string;
  is_folder: boolean;
  size: number;
}

const YourFiles: React.FC = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [renameFileId, setRenameFileId] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState<string>('');
  const [newFolderName, setNewFolderName] = useState<string>('');

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await axios.get('/api/cloud/files');
      setFiles(response.data || []);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const formData = new FormData();
    if (event.target.files) {
      for (const file of Array.from(event.target.files)) {
        formData.append('multipleFiles', file);
      }
      try {
        await axios.post('/api/cloud/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        fetchFiles();
      } catch (error) {
        console.error('Error uploading files:', error);
      }
    }
  };

  const handleDownloadAll = async () => {
    try {
      const response = await axios.get('/api/cloud/download', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'all_files.zip'); // or any other extension
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading all files:', error);
    }
  };

  const handleDownloadFile = async (fileId: string) => {
    try {
      const response = await axios.get(`/api/cloud/download/${fileId}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'file'); // you might want to set the filename dynamically
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      await axios.delete(`/api/files/${fileId}`);
      fetchFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const handleRenameFile = async (fileId: string, newName: string) => {
    try {
      await axios.put(`/api/cloud/rename`, { fileId, newName });
      fetchFiles();
      setRenameFileId(null);
      setNewFileName('');
    } catch (error) {
      console.error('Error renaming file:', error);
    }
  };

  const handleMoveFile = async (fileId: string, destinationId: string) => {
    try {
      await axios.put(`/api/cloud/move`, { fileId, destinationId });
      fetchFiles();
    } catch (error) {
      console.error('Error moving file:', error);
    }
  };

  const handleCreateFolder = async () => {
    try {
      await axios.post(`/api/cloud/folder`, { folderName: newFolderName, parentId: null });
      fetchFiles();
      setNewFolderName('');
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  const getFileIcon = (file: FileData) => {
    if (file.is_folder) {
      return faFolder;
    }
    const fileExtension = file.filename.split('.').pop()?.toLowerCase();
    switch (fileExtension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return faFileImage;
      case 'pdf':
        return faFilePdf;
      case 'doc':
      case 'docx':
        return faFileWord;
      case 'xls':
      case 'xlsx':
        return faFileExcel;
      case 'zip':
      case 'rar':
        return faFileArchive;
      default:
        return faFileAlt;
    }
  };

  return (
    <YourFilesContainer>
      <YourFilesTitle>Your Files</YourFilesTitle>
      <UploadLabel htmlFor="fileUpload">Upload Files</UploadLabel>
      <UploadInput id="fileUpload" type="file" multiple onChange={handleUpload} />
      <Button onClick={handleDownloadAll}>Download All</Button>
      <div>
        <Input
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          placeholder="New folder name"
        />
        <Button onClick={handleCreateFolder}>Create Folder</Button>
      </div>
      <FileList>
        {Array.isArray(files) && files.map((file) => (
          <FileItem key={file.id}>
            <FileIcon>
              <FontAwesomeIcon icon={getFileIcon(file)} />
            </FileIcon>
            {renameFileId === file.id ? (
              <>
                <Input
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="New file name"
                />
                <Button onClick={() => handleRenameFile(file.id, newFileName)}>Save</Button>
              </>
            ) : (
              <>
                <FileName>{file.filename}</FileName>
                <FileActions>
                  <ActionButton onClick={() => handleDownloadFile(file.id)}>Download</ActionButton>
                  <ActionButton onClick={() => setRenameFileId(file.id)}>Rename</ActionButton>
                  <ActionButton onClick={() => handleDeleteFile(file.id)}>Delete</ActionButton>
                  <ActionButton onClick={() => handleMoveFile(file.id, 'destination_folder_id')}>Move</ActionButton>
                </FileActions>
              </>
            )}
          </FileItem>
        ))}
      </FileList>
    </YourFilesContainer>
  );
};

export default YourFiles;
