// Split extracted text into overlapping chunks for better context retention
const chunkText = (text, chunkSize = 750, overlapSize = 150) => {
  try {
    const chunks = [];
    let startIndex = 0;

    while (startIndex < text.length) {
      // Extract chunk from current position to chunkSize
      const endIndex = Math.min(startIndex + chunkSize, text.length);
      const chunk = text.substring(startIndex, endIndex).trim();

      if (chunk.length > 0) {
        chunks.push(chunk);
      }

      // Move start index forward, accounting for overlap
      startIndex += chunkSize - overlapSize;
    }

    return chunks;
  } catch (error) {
    throw new Error(`Text chunking failed: ${error.message}`);
  }
};

module.exports = {
  chunkText,
};
