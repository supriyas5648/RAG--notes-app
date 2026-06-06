import axios from 'axios';

const BACKEND_URL = 'http://localhost:5000/api';

export const uploadNotes = async (file, title) => {
  try {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);
    
    const response = await axios.post(
      `${BACKEND_URL}/notes/upload`,
      formData
    );
    
    return response.data;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

/**
 * getAllNotes - Fetch all uploaded notes
 * 
 * Retrieves metadata for all notes in MongoDB.
 * Only returns: _id and title (embeddings/chunks/fileName are not included)
 * 
 * IMPORTANT: For UploadedNotes.jsx component
 * This is what populates the "NOTES!!" panel in the UI
 * 
 * @returns {Promise<Array>} - Array of notes with _id and title
 * 
 * Example return:
 * [
 *   { _id: "123abc", title: "Operating Systems" },
 *   { _id: "456def", title: "Computer Networks" }
 * ]
 */
export const getAllNotes = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/notes`);
    
    // Backend returns: { success: true, data: [...notes] }
    // We extract just the data array for simpler consumption
    return response.data.data;
  } catch (error) {
    console.error('Fetch notes error:', error);
    throw error;
  }
};

/**
 * askQuestion - Ask a question about uploaded notes
 * 
 * Sends a user question to the RAG system.
 * Backend searches embeddings and generates an AI answer.
 * 
 * @param {string} question - The user's question
 * @returns {Promise} - Response with the AI-generated answer
 */
export const askQuestion = async (question) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/chat/ask`,
      { question }
    );
    
    return response.data;
  } catch (error) {
    console.error('Question error:', error);
    throw error;
  }
};
