const pdfParse = require('pdf-parse');
const fs = require('fs');

// Extract text from PDF file
const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);

    // Combine all text from all pages
    const extractedText = data.text;

    return extractedText;
  } catch (error) {
    throw new Error(`PDF extraction failed: ${error.message}`);
  }
};

module.exports = {
  extractTextFromPDF,
};
