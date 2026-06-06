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
