const mongoose = require('mongoose');

// Note schema to store document information, chunks, and their embeddings
const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    originalFileName: {
      type: String,
      required: true,
    },
    chunks: [
      {
        index: {
          type: Number,
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        embedding: {
          type: [Number],
          required: true,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Note', noteSchema);
