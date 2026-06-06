const fs = require('fs');
const Note = require('../models/Note');
const { extractTextFromPDF } = require('../services/pdfService');
const { chunkText } = require('../services/chunkService');
const { generateEmbeddingsForChunks } = require('../services/embeddingService');

// Handle note upload: extract text, chunk it, and generate embeddings
const uploadNote = async (req, res, next) => {
  const uploadedFilePath = req.file?.path;

  try {
    if (!req.file) {
      const error = new Error('No file uploaded');
      error.status = 400;
      throw error;
    }

    const { title } = req.body;

    if (!title) {
      const error = new Error('Title is required');
      error.status = 400;
      throw error;
    }

    let extractedText;

    // Extract text based on file type
    if (req.file.mimetype === 'application/pdf') {
      extractedText = await extractTextFromPDF(uploadedFilePath);
    } else if (req.file.mimetype === 'text/plain') {
      extractedText = fs.readFileSync(uploadedFilePath, 'utf-8');
    } else {
      const error = new Error('Unsupported file type. Only PDF and TXT are allowed.');
      error.status = 400;
      throw error;
    }

    // Split text into chunks
    const chunks = chunkText(extractedText);

    if (chunks.length === 0) {
      const error = new Error('No text extracted from file');
      error.status = 400;
      throw error;
    }

    // Generate embeddings for all chunks
    console.log(`Generating embeddings for ${chunks.length} chunks...`);
    const embeddings = await generateEmbeddingsForChunks(chunks);

    // Create chunk objects with embeddings
    const chunkObjects = chunks.map((text, index) => ({
      index,
      text,
      embedding: embeddings[index],
    }));

    // Save note to database
    const note = await Note.create({
      title,
      originalFileName: req.file.originalname,
      chunks: chunkObjects,
      createdAt: new Date(),
    });

    // Clean up uploaded file
    fs.unlinkSync(uploadedFilePath);

    res.status(201).json({
      success: true,
      message: 'Note uploaded successfully',
      data: {
        noteId: note._id,
        title: note.title,
        chunkCount: chunks.length,
        createdAt: note.createdAt,
      },
    });
  } catch (error) {
    // Clean up file on error
    if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
      fs.unlinkSync(uploadedFilePath);
    }

    next(error);
  }
};

// Retrieve all notes metadata
const getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find().select(
      '_id title originalFileName createdAt'
    );

    const notesWithChunkCount = notes.map((note) => ({
      ...note.toObject(),
      chunkCount: note.chunks.length,
    }));

    res.status(200).json({
      success: true,
      data: notesWithChunkCount,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a note by ID
const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const deletedNote = await Note.findByIdAndDelete(noteId);

    if (!deletedNote) {
      const error = new Error('Note not found');
      error.status = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully',
      data: {
        noteId: deletedNote._id,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadNote,
  getNotes,
  deleteNote,
};
