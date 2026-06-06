// Calculate cosine similarity between two vectors
const cosineSimilarity = (vectorA, vectorB) => {
  try {
    const dotProduct = vectorA.reduce((sum, a, i) => sum + a * vectorB[i], 0);
    const magnitudeA = Math.sqrt(vectorA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vectorB.reduce((sum, b) => sum + b * b, 0));

    if (magnitudeA === 0 || magnitudeB === 0) return 0;

    return dotProduct / (magnitudeA * magnitudeB);
  } catch (error) {
    throw new Error(`Cosine similarity calculation failed: ${error.message}`);
  }
};

// Search for top similar chunks using cosine similarity
const searchSimilarChunks = (queryEmbedding, allChunks, topK = 5) => {
  try {
    // Calculate similarity score for each chunk
    const scoredChunks = allChunks.map((chunk) => ({
      ...chunk,
      similarity: cosineSimilarity(queryEmbedding, chunk.embedding),
    }));

    // Sort by similarity score in descending order and return top K
    const topChunks = scoredChunks
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);

    return topChunks;
  } catch (error) {
    throw new Error(`Vector search failed: ${error.message}`);
  }
};

module.exports = {
  cosineSimilarity,
  searchSimilarChunks,
};
