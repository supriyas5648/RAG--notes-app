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
    // VALIDATION: Check if file is selected
    if (!selectedFile) {
      // Set error message that will display to user
      setUploadError('Please select a file first');
      return; // Exit early, don't try to upload nothing
    }

    // VALIDATION: Check if title is provided
    // Backend requires a title to store the document
    if (!title.trim()) {
      setUploadError('Please enter a title for your notes');
      return; // Exit early if title is empty
    }

    try {
      setIsLoading(true);
      
      // Clear any previous errors
      setUploadError(null);
      const response = await uploadNotes(selectedFile, title.trim());
      
      // SUCCESS! Upload completed successfully
      
      // Show success message
      setUploadSuccess(true);
      
      // Reset form so user can upload another file
      setSelectedFile(null);
      setTitle('');  // Clear the title field
      
      // Clear the file input element visually
      // This resets the "Choose File" button to show "No file chosen"
      document.getElementById('fileInput').value = '';
      
      // Notify parent component that upload succeeded
      // Parent will update its state about uploaded files
      // Backend returns response.data.title (the title we sent)
      if (onUploadSuccess) {
        onUploadSuccess(response.data.title);
      }
      
      // Auto-hide success message after 3 seconds
      // Better UX: message doesn't stay forever
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
      
    } catch (error) {
      // ERROR! Upload failed
      
      // Extract error message from the error object
      // Backend returns: { message: "File too large" } or similar
      const errorMessage = error.response?.data?.message || 'Upload failed. Try again.';
      
      // Display error to user
      setUploadError(errorMessage);
      
      console.error('Upload failed:', error);
    } finally {
      // This runs whether upload succeeded or failed
      // Hide loading state and re-enable the button
      setIsLoading(false);
    }
  };

  // JSX STRUCTURE EXPLANATION:
  // This is the HTML/UI that renders on screen
  // We conditionally show/hide elements based on state
  
  return (
    <div className="upload-container">
      <h2>Upload Your Notes</h2>
      
      {/* TITLE INPUT: Let user enter a meaningful title for their notes */}
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
      
      {/* FILE INPUT: Let user select a file from their computer */}
      <div className="file-input-wrapper">
        <input
          id="fileInput"
          type="file"
          // Accept only PDF and TXT files
          // This filters the file picker to show only these types
          accept=".pdf,.txt"
          // When file is selected, call handleFileChange
          onChange={handleFileChange}
          className="file-input"
        />
        <label htmlFor="fileInput" className="file-label">
          {selectedFile ? selectedFile.name : 'Choose a PDF or TXT file'}
        </label>
      </div>
      
      {/* UPLOAD BUTTON */}
      <button
        onClick={handleUpload}
        disabled={isLoading || !selectedFile || !title.trim()}
        className="upload-btn"
      >
        {isLoading ? 'Uploading...' : 'Upload File'}
      </button>
      
      {/* SUCCESS MESSAGE: Show when upload succeeds */}
      {uploadSuccess && (
        <div className="success-message">
          ✓ File uploaded successfully! Processing your document...
        </div>
      )}
      
      {/* ERROR MESSAGE: Show when upload fails */}
      {uploadError && (
        <div className="error-message">
          ✗ {uploadError}
        </div>
      )}
    </div>
  );
}

export default FileUpload;
