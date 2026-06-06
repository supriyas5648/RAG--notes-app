const Groq = require('groq-sdk');
const Note = require('../models/Note');
const { generateEmbedding } = require('./embeddingService');
const { searchSimilarChunks } = require('./vectorSearchService');

// Initialize Groq client
const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Retrieve relevant chunks for a query using vector search
const retrieveRelevantChunks = async (question, topK = 5) => {
  try {
    // Generate embedding for the user's question using HuggingFace
    // This converts the question text into a 384-dimensional vector
    // that can be compared with chunk embeddings for semantic similarity
    const questionEmbedding = await generateEmbedding(question);

    // Retrieve all notes from database
    const allNotes = await Note.find();

    if (!allNotes || allNotes.length === 0) {
      throw new Error('No notes found in database');
    }

    // Collect all chunks from all notes
    const allChunks = [];
    allNotes.forEach((note) => {
      note.chunks.forEach((chunk) => {
        allChunks.push({
          ...chunk.toObject(),
          noteId: note._id,
          noteTitle: note.title,
        });
      });
    });

    // Perform cosine similarity search to find top K similar chunks
    // searchSimilarChunks compares the question embedding with all chunk embeddings
    // and returns the most semantically similar chunks
    const relevantChunks = searchSimilarChunks(questionEmbedding, allChunks, topK);

    return relevantChunks;
  } catch (error) {
    throw new Error(`Chunk retrieval failed: ${error.message}`);
  }
};

// Generate answer using Gemini with retrieved context
const generateAnswer = async (question, relevantChunks) => {
  try {
    // --- DEBUG: post-retrieval flow ---
    console.log('Creating context...');

    // Build context from relevant chunks
    const context = (relevantChunks || [])
      .map((chunk) => `[Note: ${chunk.noteTitle}]\n${chunk.text}`)
      .join('\n\n---\n\n');

    // --- DEBUG: safe length check ---
    console.log('Context length:', context?.length);

    // Construct prompt for Groq's LLM
    // This instructs the model to answer based on the provided context
    const prompt = `You are a helpful assistant. Answer the following question based on the provided context. If the answer is not in the context, say "I don't have enough information to answer this question."

Context:
${context}

Question: ${question}

Answer:`;

    // --- DEBUG ---
    console.log('Prompt generated');

    // Call Groq API to generate answer
    // Groq uses Meta's Llama model for fast, accurate text generation
    // The API will generate a response based on the context and question
    console.log('Sending request to Groq');
    const response = await client.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 1024,
    });

    // --- DEBUG ---
    console.log('Groq response received');
    console.log(JSON.stringify(response, null, 2));

    // Safe extraction so a malformed/empty response surfaces a clear message
    // instead of throwing "Cannot read properties of undefined".
    const answer = response?.choices?.[0]?.message?.content;

    // --- DEBUG ---
    console.log('Answer:', answer);

    if (!answer) {
      throw new Error(
        `Groq returned no answer content. choices length: ${response?.choices?.length}`
      );
    }

    return answer;
  } catch (error) {
    // Log the underlying error so the real cause is visible in the console,
    // not just the wrapped "Answer generation failed" message.
    console.error('generateAnswer error:', error);
    throw new Error(`Answer generation failed: ${error.message}`);
  }
};

// Main RAG pipeline: retrieve chunks and generate answer
const askQuestion = async (question, topK = 5) => {
  try {
    // Display retrieved chunks in terminal
    const relevantChunks = await retrieveRelevantChunks(question, topK);

    console.log('\n=== TOP RELEVANT CHUNKS ===');
    relevantChunks.forEach((chunk, index) => {
      console.log(`\nChunk ${index + 1} (Note: ${chunk.noteTitle}, Similarity: ${(chunk.similarity * 100).toFixed(2)}%)`);
      console.log(chunk.text.substring(0, 200) + '...');
    });
    console.log('\n=========================\n');

    // Generate answer using retrieved context
    const answer = await generateAnswer(question, relevantChunks);

    return {
      answer,
      sources: relevantChunks.map((chunk) => ({
        noteTitle: chunk.noteTitle,
        chunkIndex: chunk.index,
        similarity: chunk.similarity,
      })),
    };
  } catch (error) {
    throw new Error(`RAG pipeline failed: ${error.message}`);
  }
};

module.exports = {
  retrieveRelevantChunks,
  generateAnswer,
  askQuestion,
};

module.exports = {
  retrieveRelevantChunks,
  generateAnswer,
  askQuestion,
};
