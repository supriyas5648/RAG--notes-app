
import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import QuestionForm from '../components/QuestionForm';
import AnswerBox from '../components/AnswerBox';
import { askQuestion } from '../services/api';
import '../styles/Home.css';

/**
 * Home Component - Main application component
 * 
 * This component demonstrates several important React concepts:
 * 1. Multiple state variables for different concerns
 * 2. State lifting (children pass data back up through callbacks)
 * 3. Conditional rendering based on state
 * 4. Async/await with try-catch error handling
 */
function Home() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasAsked, setHasAsked] = useState(false);

  const handleUploadSuccess = (filename) => {
    // Store the uploaded filename so we can display it
    setUploadedFile(filename);
    
    // Clear any previous errors when new file is uploaded
    setError(null);
    
    // Reset answer from previous questions
    setAnswer('');
    setQuestion('');
    setHasAsked(false);
  };

  const handleAskQuestion = async (userQuestion) => {
    try {
      // Store the question so we can display it
      setQuestion(userQuestion);
      
      // Mark that user has asked a question
      // This tells AnswerBox to start displaying
      setHasAsked(true);
      
      // Show loading spinner/message
      setIsLoading(true);
      
      // Clear any previous errors
      setError(null);
      
      // Clear previous answer while fetching new one
      setAnswer('');
      
      const response = await askQuestion(userQuestion);
      const generatedAnswer = response.answer;
      
      setAnswer(generatedAnswer);
      
      // Hide loading spinner
      setIsLoading(false);
      
    } catch (err) {
      setIsLoading(false);
      const errorMessage = err.response?.data?.message || 
                          'Failed to get answer. Please try again.';
      setError(errorMessage);
      console.error('Error getting answer:', err);
    }
  };

  // ========== JSX - THE UI THAT RENDERS ==========
  // This is what users see on the screen
  
  return (
    <main className="home-container">
      <div className="header">
        <h1>📚 RAG-Based Notes Assistant</h1>
        <p className="subtitle">Upload your notes and ask questions about them</p>
      </div>

      <div className="content-wrapper">
        <section className="column upload-column">
          <FileUpload onUploadSuccess={handleUploadSuccess} />
          
          {uploadedFile && (
            <div className="uploaded-file-info">
              <p>✓ File uploaded: <strong>{uploadedFile}</strong></p>
            </div>
          )}
        </section>

        <section className="column question-column">
          <QuestionForm 
            onAsk={handleAskQuestion}
            isLoading={isLoading}
          />
        </section>

        <section className="column answer-column">
          <AnswerBox 
            answer={answer}
            isLoading={isLoading}
            error={error}
            hasAsked={hasAsked}
          />
        </section>
      </div>

      <footer className="footer">
        <h3>How to Use:</h3>
        <ol>
          <li>Upload a PDF or TXT file with your notes</li>
          <li>Ask a question about the content</li>
          <li>Get an AI-generated answer based on your documents</li>
        </ol>
      </footer>
    </main>
  );
}

export default Home;

