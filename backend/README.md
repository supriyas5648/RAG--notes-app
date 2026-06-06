# RAG Notes Assistant Backend

A backend API for a Retrieval-Augmented Generation (RAG) based Notes Assistant built with Node.js, Express, MongoDB, Groq, and HuggingFace.

## Features

- **PDF & TXT Upload**: Upload notes as PDF or text files
- **Text Chunking**: Automatically splits documents into 750-character chunks with 150-character overlap
- **Embeddings**: Generates embeddings using HuggingFace's all-MiniLM-L6-v2 model (free, no API key required)
- **Vector Search**: Uses cosine similarity for semantic search
- **RAG Pipeline**: Retrieves relevant chunks and generates answers using Groq API
- **Error Handling**: Comprehensive error handling and validation
- **Clean Architecture**: Service-based architecture for maintainability

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **File Upload**: Multer
- **PDF Processing**: pdf-parse
- **Embeddings**: HuggingFace (@xenova/transformers) - Xenova/all-MiniLM-L6-v2
- **LLM**: Groq API (Mixtral 8x7B)
- **Environment**: dotenv

## Project Structure

```
src/
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/
│   ├── noteController.js     # Note upload logic
│   └── chatController.js     # Chat/question logic
├── models/
│   └── Note.js               # Mongoose Note schema
├── routes/
│   ├── noteRoutes.js         # Note endpoints
│   └── chatRoutes.js         # Chat endpoints
├── services/
│   ├── pdfService.js         # PDF text extraction
│   ├── chunkService.js       # Text chunking
│   ├── embeddingService.js   # HuggingFace embedding generation
│   ├── vectorSearchService.js # Cosine similarity search
│   └── ragService.js         # RAG pipeline with Groq
├── middleware/
│   └── errorHandler.js       # Error handling
└── server.js                 # Main server file
```

## Installation

1. **Clone or extract the project**
```bash
cd notes-RAG app/backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create `.env` file:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/Notes-RAG-app
GROQ_API_KEY=your_groq_api_key_here
NODE_ENV=development
```

Get GROQ_API_KEY from: https://console.groq.com/keys

4. **Ensure MongoDB is running**
```bash
# On Windows, if installed locally
mongod
```

## Usage

### Start the Server

```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

### API Endpoints

#### 1. Upload a Note
**POST** `/api/notes/upload`

Upload a PDF or TXT file.

**Form Data:**
- `file`: PDF or TXT file
- `title`: Note title (string)

**Example using cURL:**
```bash
curl -X POST http://localhost:5000/api/notes/upload \
  -F "file=@path/to/file.pdf" \
  -F "title=My Notes"
```

**Response:**
```json
{
  "success": true,
  "message": "Note uploaded successfully",
  "data": {
    "noteId": "507f1f77bcf86cd799439011",
    "title": "My Notes",
    "chunkCount": 45,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### 2. Get All Notes
**GET** `/api/notes`

Retrieve metadata for all uploaded notes.

**Example:**
```bash
curl http://localhost:5000/api/notes
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "My Notes",
      "originalFileName": "notes.pdf",
      "createdAt": "2024-01-15T10:30:00Z",
      "chunkCount": 45
    }
  ]
}
```

#### 3. Delete a Note
**DELETE** `/api/notes/:noteId`

Delete a note by ID.

**Example:**
```bash
curl -X DELETE http://localhost:5000/api/notes/507f1f77bcf86cd799439011
```

#### 4. Ask a Question (RAG)
**POST** `/api/chat/ask`

Ask a question to get an answer based on uploaded notes.

**Request Body:**
```json
{
  "question": "What is binary search?",
  "topK": 5
}
```

- `question` (required): User's question
- `topK` (optional, default: 5): Number of chunks to retrieve

**Example:**
```bash
curl -X POST http://localhost:5000/api/chat/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is binary search?",
    "topK": 5
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "question": "What is binary search?",
    "answer": "Binary search is an efficient algorithm...",
    "sources": [
      {
        "noteTitle": "My Notes",
        "chunkIndex": 5,
        "similarity": 0.87
      },
      {
        "noteTitle": "My Notes",
        "chunkIndex": 8,
        "similarity": 0.82
      }
    ]
  }
}
```

#### 5. Health Check
**GET** `/health`

Check if the server is running.

**Example:**
```bash
curl http://localhost:5000/health
```

## How It Works

### Upload Flow
1. User uploads PDF/TXT file with a title
2. Backend extracts text from file
3. Text is split into 750-character chunks with 150-character overlap
4. Embeddings are generated for each chunk using Gemini
5. Chunks and embeddings are stored in MongoDB

### Question Answering Flow
1. User asks a question
2. Question embedding is generated using Gemini
3. Cosine similarity search finds top 5 most relevant chunks
4. Top chunks are displayed in terminal with similarity scores
5. Retrieved context and question are sent to Gemini
6. Gemini generates an answer based on the context
7. Answer and source information are returned to user

## Error Handling

The API includes comprehensive error handling:

```json
{
  "success": false,
  "status": 400,
  "message": "Unsupported file type. Only PDF and TXT are allowed.",
  "error": {}
}
```

Common error codes:
- `400`: Bad request (missing files, invalid input)
- `404`: Not found (note not found)
- `500`: Internal server error

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `MONGO_URI` | MongoDB connection string | mongodb://localhost:27017/rag-notes-assistant |
| `GEMINI_API_KEY` | Google Generative AI API key | sk-xxxx |
| `NODE_ENV` | Environment | development/production |

## Key Functions

### Services

**pdfService.js**
- `extractTextFromPDF(filePath)`: Extract text from PDF files

**chunkService.js**
- `chunkText(text, chunkSize, overlapSize)`: Split text into overlapping chunks

**embeddingService.js**
- `generateEmbedding(text)`: Generate embedding for text
- `generateEmbeddingsForChunks(chunks)`: Batch generate embeddings

**vectorSearchService.js**
- `cosineSimilarity(vectorA, vectorB)`: Calculate cosine similarity
- `searchSimilarChunks(queryEmbedding, allChunks, topK)`: Find top K similar chunks

**ragService.js**
- `retrieveRelevantChunks(question, topK)`: Retrieve relevant chunks
- `generateAnswer(question, relevantChunks)`: Generate answer using Gemini
- `askQuestion(question, topK)`: Main RAG pipeline

## Performance Tips

1. **Chunk Size**: Adjust chunk size in `chunkService.js` (500-1000 recommended)
2. **Overlap**: Increase overlap for better context retention
3. **topK**: Adjust topK parameter in ask endpoint for accuracy vs. speed trade-off
4. **MongoDB Indexing**: Consider adding indexes for frequently queried fields

## Troubleshooting

**MongoDB Connection Error**
- Ensure MongoDB is running
- Check `MONGO_URI` in `.env`

**Gemini API Error**
- Verify `GEMINI_API_KEY` is correct
- Check API quota and billing

**File Upload Issues**
- Ensure file is PDF or TXT
- Check file size (max 50MB)
- Verify `uploads/` directory exists

**Embedding Generation Slow**
- Gemini API calls can be slow for large batches
- Consider implementing request batching

## Future Enhancements

- [ ] User authentication
- [ ] Support for more file types (DOCX, PPT)
- [ ] Hybrid search (keyword + semantic)
- [ ] Caching for embeddings
- [ ] Multi-language support
- [ ] Fine-tuned models
- [ ] Rate limiting
- [ ] Pagination for notes listing

## License

ISC
