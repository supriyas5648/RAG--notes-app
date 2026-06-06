import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { getAllNotes } from '../services/api';
import '../styles/UploadedNotes.css';

const UploadedNotes = forwardRef(function UploadedNotes({ onRefresh }, ref) {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetches all notes from the backend
   * Called on component mount and when parent requests refresh
   */
  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await getAllNotes();
      setNotes(response);
      
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError('Failed to load notes');
      setNotes([]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * LIFECYCLE: Fetch notes when component first mounts
   */
  useEffect(() => {
    fetchNotes();
  }, []);

  /**
   * EXPOSE PUBLIC METHODS TO PARENT
   * Parent component can call ref.current.refreshNotes()
   * This is used after successful file upload to refresh the list
   */
  useImperativeHandle(ref, () => ({
    refreshNotes: fetchNotes
  }));

  // ========== RENDER STATES ==========
  
  // LOADING STATE: Show while fetching notes
  if (isLoading && notes.length === 0) {
    return (
      <div className="uploaded-notes-panel">
        <h2 className="panel-title">NOTES!!</h2>
        <div className="notes-list-container">
          <p className="loading-message">Loading notes...</p>
        </div>
      </div>
    );
  }

  // ERROR STATE: Show if fetch failed
  if (error) {
    return (
      <div className="uploaded-notes-panel">
        <h2 className="panel-title">NOTES!!</h2>
        <div className="notes-list-container">
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  // EMPTY STATE: Show if no notes exist
  if (notes.length === 0) {
    return (
      <div className="uploaded-notes-panel">
        <h2 className="panel-title">NOTES!!</h2>
        <div className="notes-list-container">
          <p className="empty-message">No notes uploaded yet</p>
        </div>
      </div>
    );
  }

  // ========== NORMAL RENDER: Display notes list ==========
  // Only shows note.title - embeddings/chunks/fileName/createdAt are hidden
  return (
    <div className="uploaded-notes-panel">
      <h2 className="panel-title">NOTES!!</h2>
      <div className="notes-list-container">
        <ol className="notes-list">
          {notes.map((note, index) => (
            <li key={note._id} className="note-item">
              {note.title}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
});

export default UploadedNotes;
