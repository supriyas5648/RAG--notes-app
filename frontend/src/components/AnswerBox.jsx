
import React from 'react';
import '../styles/AnswerBox.css';

function AnswerBox({ answer, isLoading, error, hasAsked }) {
  if (!hasAsked) {
    return (
      <div className="answer-box empty">
        <p className="placeholder-text">
          Ask a question about your notes to get started!
        </p>
      </div>
    );
  }

  // If API is currently processing the question
  if (isLoading) {
    return (
      <div className="answer-box loading">
        <div className="loading-spinner"></div>
        <p className="loading-text">
          Searching your documents and generating answer...
        </p>
      </div>
    );
  }

  // If an error occurred during processing
  if (error) {
    return (
      <div className="answer-box error">
        <h3>Error Processing Question</h3>
        <p className="error-text">{error}</p>
        <p className="error-hint">
          Make sure you've uploaded documents and try again.
        </p>
      </div>
    );
  }

  // If answer is successfully received from backend
  if (answer) {
    return (
      <div className="answer-box success">
        <h3>Answer</h3>
        <div className="answer-content">
          {answer.split('\n').map((paragraph, index) => (
            paragraph.trim() && (
              <p key={index} className="answer-paragraph">
                {paragraph}
              </p>
            )
          ))}
        </div>
      </div>
    );
  }

  // Fallback: No answer and not loading/error (shouldn't normally happen)
  return (
    <div className="answer-box">
      <p className="placeholder-text">
        Ask a question to see the answer here.
      </p>
    </div>
  );
}

export default AnswerBox;
