import React, { useState } from 'react';
import { uploadNotes } from '../services/api';
import '../styles/FileUpload.css';

function FileUpload({ onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [title, setTitle] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setUploadError(null);
    setUploadSuccess(false);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('Please select a file first');
      return;
    }

    if (!title.trim()) {
      setUploadError('Please enter a title for your notes');
      return;
    }

    try {
      setIsLoading(true);
      setUploadError(null);
      const response = await uploadNotes(selectedFile, title.trim());
      
      setUploadSuccess(true);
      setSelectedFile(null);
      setTitle('');
      document.getElementById('fileInput').value = '';
      
      if (onUploadSuccess) {
        onUploadSuccess(response.data.title);
      }
      
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Upload failed. Try again.';
      setUploadError(errorMessage);
      console.error('Upload failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Your Notes</h2>
      
      <div className="title-input-wrapper">
        <label htmlFor="titleInput" className="title-label">
          Document Title
        </label>
        <input
          id="titleInput"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Operating Systems Lecture, Python Notes..."
          className="title-input"
          disabled={isLoading}
        />
      </div>
      
      <div className="file-input-wrapper">
        <input
          id="fileInput"
          type="file"
          accept=".pdf,.txt"
          onChange={handleFileChange}
          className="file-input"
        />
        <label htmlFor="fileInput" className="file-label">
          {selectedFile ? selectedFile.name : 'Choose a PDF or TXT file'}
        </label>
      </div>
      
      <button
        onClick={handleUpload}
        disabled={isLoading || !selectedFile || !title.trim()}
        className="upload-btn"
      >
        {isLoading ? 'Uploading...' : 'Upload File'}
      </button>
      
      {uploadSuccess && (
        <div className="success-message">
          ✓ File uploaded successfully! Processing your document...
        </div>
      )}
      
      {uploadError && (
        <div className="error-message">
          ✗ {uploadError}
        </div>
      )}
    </div>
  );
}

export default FileUpload;
