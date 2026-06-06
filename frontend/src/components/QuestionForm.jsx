import React, { useState } from 'react';
import '../styles/QuestionForm.css';

function QuestionForm({ onAsk, isLoading }) {
  const [question, setQuestion] = useState('');

  const handleInputChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleSubmit = (event) => {
    // Prevent browser from reloading page (default form behavior)
    event.preventDefault();
    
    // Trim whitespace and validate
    const trimmedQuestion = question.trim();
    
    if (!trimmedQuestion) {
      // Don't submit empty questions
      alert('Please enter a question');
      return;
    }
    
    onAsk(trimmedQuestion);
    setQuestion('');
  };

  const handleKeyPress = (event) => {
    // Check if user pressed Ctrl (Windows/Linux) or Cmd (Mac) + Enter
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      handleSubmit(event);
    }
  };

  // JSX - The UI that renders
  
  return (
    <form onSubmit={handleSubmit} className="question-form">
      <h2>Ask a Question</h2>
      
      <textarea
        value={question}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder="Ask a question about your uploaded notes... (Ctrl+Enter to submit)"
        className="question-input"
        disabled={isLoading}
      />
      
      {/* SUBMIT BUTTON */}
      <button
        type="submit"
        disabled={isLoading || !question.trim()}
        className="ask-btn"
      >
        {isLoading ? 'Thinking...' : 'Ask Question'}
      </button>
      
      {/* HELPER TEXT: Show keyboard shortcut */}
      <p className="helper-text">
        💡 Tip: Press Ctrl+Enter (or Cmd+Enter on Mac) to submit quickly
      </p>
    </form>
  );
}

export default QuestionForm;
