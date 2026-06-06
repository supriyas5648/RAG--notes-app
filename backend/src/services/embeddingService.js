const { pipeline } = require('@xenova/transformers');

let extractor;

const initializeEmbeddingModel = async () => {
  if (!extractor) {
    console.log('Loading HuggingFace embedding model: Xenova/all-MiniLM-L6-v2...');
    extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    console.log('Embedding model loaded successfully');
  }
  return extractor;
};

const generateEmbedding = async (text) => {
  try {
    const model = await initializeEmbeddingModel();
    
    const embeddings = await model(text, {
      pooling: 'mean',
      normalize: true,
    });

    const embedding = Array.from(embeddings.data);

    return embedding;
  } catch (error) {
    throw new Error(`Embedding generation failed: ${error.message}`);
  }
};

// Generate embeddings for multiple text chunks in batch
const generateEmbeddingsForChunks = async (chunks) => {
  try {
    const embeddings = await Promise.all(
      chunks.map((chunk) => generateEmbedding(chunk))
    );

    return embeddings;
  } catch (error) {
    throw new Error(`Batch embedding generation failed: ${error.message}`);
  }
};

module.exports = {
  generateEmbedding,
  generateEmbeddingsForChunks,
};
