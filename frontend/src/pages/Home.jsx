
import React, { useState, useRef } from 'react';
import UploadedNotes from '../components/UploadedNotes';
import FileUpload from '../components/FileUpload';
// import AnswerPreview from '../components/AnswerPreview';
import QuestionForm from '../components/QuestionForm';
import AnswerBox from '../components/AnswerBox';
import { askQuestion } from '../services/api';
import '../styles/Home.css';

function Home() {
  // ========== STATE FOR UPLOADS & NOTES ==========
  const [uploadedNotes, setUploadedNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [notesError, setNotesError] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  
  // ========== STATE FOR QUESTIONS & ANSWERS ==========
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasAsked, setHasAsked] = useState(false);

  // ========== REF FOR UPLOADED NOTES COMPONENT ==========
  // Allows us to refresh the notes list after successful upload
  const uploadedNotesRef = useRef(null);

  const handleUploadSuccess = (title) => {
    // Show upload success message
    setUploadStatus(`Successfully uploaded: ${title}`);
    
    // Clear any previous errors
    setError(null);
    setNotesError(null);
    
    // Clear previous question/answer to reset UI
    setAnswer('');
    setQuestion('');
    setHasAsked(false);

    // IMPORTANT: Refresh the notes list immediately
    // This makes the newly uploaded note appear in the NOTES!! panel
    // We manually trigger a fetch in the UploadedNotes component
    if (uploadedNotesRef.current) {
      uploadedNotesRef.current.refreshNotes();
    }

    // Auto-clear success message after 5 seconds
    setTimeout(() => {
      setUploadStatus('');
    }, 5000);
  };

  const handleAskQuestion = async (userQuestion) => {
    try {
      // Store the question
      setQuestion(userQuestion);
      
      // Mark that user has asked a question
      // This shows the preview and display panels
      setHasAsked(true);
      
      // Show loading indicator
      setIsLoading(true);
      
      // Clear any previous errors
      setError(null);
      
      // Clear previous answer while fetching new one
      setAnswer('');
      
      // Call RAG backend to get answer
      // Backend shape: { success, data: { question, answer, sources } }
      const response = await askQuestion(userQuestion);
      const generatedAnswer = response.data?.answer ?? response.answer;
      
      // Display the answer
      setAnswer(generatedAnswer);
      
      // Hide loading indicator
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
      {/* ========== HEADER SECTION ========== */}
      {/* Large centered title and subtitle */}
      <div className="header">
        <h1 className="header-title">RAG-Based Notes Assistant</h1>
        <p className="header-subtitle">Upload your notes and ask questions about them</p>
      </div>

      {/* ========== ROW 1: NOTES PANEL | UPLOAD CARD | PREVIEW ========== */}
      <div className="layout-row row-1">
        
        {/* LEFT: UPLOADED NOTES PANEL */}
        {/* Displays all notes from MongoDB */}
        <section className="panel notes-panel">
          <UploadedNotes ref={uploadedNotesRef} />
        </section>

        {/* CENTER: UPLOAD NOTES CARD */}
        {/* File picker and upload form */}
        <section className="panel upload-panel">
          <FileUpload onUploadSuccess={handleUploadSuccess} />
          
          {/* Show upload status message */}
          {uploadStatus && (
            <div className="upload-status-message">
              <p className="status-success">{uploadStatus}</p>
            </div>
          )}
        </section>

      </div>

      {/* ========== ROW 2: QUESTION CARD | ANSWER DISPLAY ========== */}
      <div className="layout-row row-2">
        
        {/* LEFT: ASK QUESTION CARD */}
        {/* User inputs their question here */}
        <section className="panel question-panel">
          <QuestionForm 
            onAsk={handleAskQuestion}
            isLoading={isLoading}
          />
        </section>

        {/* RIGHT: LARGE ANSWER DISPLAY CARD */}
        {/* Full answer text displayed here */}
        <section className="panel answer-panel">
          <AnswerBox 
            answer={answer}
            isLoading={isLoading}
            error={error}
            hasAsked={hasAsked}
          />
        </section>
      </div>
    </main>
  );
}

export default Home;

