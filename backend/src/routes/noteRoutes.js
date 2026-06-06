const express = require('express');
const multer = require('multer');
const {
  uploadNote,
  getNotes,
  deleteNote,
} = require('../controllers/noteController');

const router = express.Router();

// Configure multer for file uploads (PDF and TXT only)
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['application/pdf', 'text/plain'];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and TXT files are allowed'));
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

// POST /api/notes/upload - Upload a new note
router.post('/upload', upload.single('file'), uploadNote);

// GET /api/notes - Retrieve all notes
router.get('/', getNotes);

// DELETE /api/notes/:noteId - Delete a note
router.delete('/:noteId', deleteNote);

module.exports = router;
