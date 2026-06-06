# RAG Notes Assistant - Frontend

A React-based frontend for the RAG (Retrieval-Augmented Generation) Notes Assistant application. This application allows users to upload PDF/TXT notes and ask questions about them using AI-powered retrieval and generation.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── FileUpload.jsx        # File upload component
│   │   ├── QuestionForm.jsx      # Question input component
│   │   └── AnswerBox.jsx         # Answer display component
│   ├── pages/
│   │   └── Home.jsx              # Main page component
│   ├── services/
│   │   └── api.js                # API service layer (Axios)
│   ├── styles/
│   │   ├── FileUpload.css        # FileUpload component styles
│   │   ├── QuestionForm.css      # QuestionForm component styles
│   │   ├── AnswerBox.css         # AnswerBox component styles
│   │   └── Home.css              # Home page styles
│   ├── App.jsx                   # Root app component
│   ├── App.css                   # Global app styles
│   ├── index.css                 # Global base styles
│   └── main.jsx                  # React entry point
├── index.html                    # HTML entry point
├── package.json                  # Dependencies and scripts
├── vite.config.js               # Vite configuration
└── .gitignore                   # Git ignore rules
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+ recommended)
- npm or yarn package manager
- Backend API running on `http://localhost:5000`

### Installation

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

This will:
- Start Vite dev server at `http://localhost:5173`
- Auto-open in your browser
- Enable Hot Module Replacement (HMR) - auto-reload on save
- Proxy API calls to backend at `http://localhost:5000`

### Production Build

Build for production:
```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

Preview production build locally:
```bash
npm run preview
```

## 📚 Component Architecture

### Component Hierarchy

```
App (root)
└── Home (main page, state management)
    ├── FileUpload (handles file uploads)
    ├── QuestionForm (handles question input)
    └── AnswerBox (displays answers)
```

### Data Flow

```
User Input → Component State → API Call → Backend Processing → State Update → UI Re-render
```

### Component Descriptions

#### FileUpload.jsx
- **Purpose**: Handles file selection and upload
- **State**: selectedFile, isLoading, uploadSuccess, uploadError
- **Props**: onUploadSuccess callback
- **API**: POST /api/notes/upload (multipart/form-data)

#### QuestionForm.jsx
- **Purpose**: Captures user questions
- **State**: question
- **Props**: onAsk callback, isLoading
- **Features**: Keyboard shortcut (Ctrl+Enter to submit)

#### AnswerBox.jsx
- **Purpose**: Displays AI-generated answers
- **Props**: answer, isLoading, error, hasAsked
- **States**: Empty, Loading, Error, Success

#### Home.jsx
- **Purpose**: Orchestrates components and manages application state
- **State**: uploadedFile, question, answer, isLoading, error, hasAsked
- **Responsibilities**: API calls, state management, prop passing

## 🔗 API Integration

### API Service (`services/api.js`)

The API service layer abstracts all backend communication:

```javascript
// Upload a file
await uploadNotes(file)
// Response: { success: true, filename: "...", message: "..." }

// Ask a question
await askQuestion(question)
// Response: { success: true, answer: "..." }
```

### Backend API Endpoints

- **POST /api/notes/upload** - Upload PDF/TXT files
- **POST /api/chat/ask** - Ask questions about uploaded notes

## 🎨 Styling

### CSS Organization

- **App.css**: Global styles, CSS variables, typography
- **index.css**: Browser resets, base element styles
- **Component CSS**: Each component has its own CSS file
- **Responsive**: Mobile-first design with breakpoints at 768px and 480px

### CSS Variables

```css
--primary-color: #2c3e50
--secondary-color: #3498db
--success-color: #27ae60
--error-color: #e74c3c
--spacing-md: 16px
--border-radius: 8px
```

## 🎓 Educational Comments

This codebase includes comprehensive comments explaining:

- **Why** each component exists
- **What** each state variable stores
- **How** data flows through the app
- **Why** certain React patterns are used
- **How** API calls are made and handled
- **What** each hook does

Perfect for learning React and RAG architecture!

## 📦 Dependencies

### Core
- **react**: UI library
- **react-dom**: React DOM rendering

### HTTP
- **axios**: Promise-based HTTP client for API calls

### Build Tools
- **vite**: Modern build tool and dev server
- **@vitejs/plugin-react**: React plugin for Vite

## 🔧 Development Tips

### Hot Module Replacement (HMR)
Changes to components are instantly reflected in the browser without full reload.

### Debugging
- Open browser DevTools (F12)
- React DevTools browser extension recommended
- Console logs in components appear in DevTools
- Network tab shows API calls

### Common Issues

**Backend not connecting?**
- Ensure backend is running on port 5000
- Check vite.config.js proxy settings
- Look for CORS errors in console

**Axios requests failing?**
- Verify backend API endpoints
- Check request/response format in Network tab
- Ensure FormData is used for file uploads

**Styling issues?**
- Check CSS file imports
- Verify class names in CSS vs JSX
- Clear browser cache if styles don't update

## 🧪 Testing Workflow

1. Start backend server: `npm run dev` (in backend directory)
2. Start frontend server: `npm run dev` (in frontend directory)
3. Upload a PDF/TXT file
4. Ask a question about the content
5. See AI-generated answer

## 📝 Learning Resources

### React Concepts Used
- Functional Components
- Hooks (useState)
- Conditional Rendering
- Component Composition
- Props and Callbacks
- Form Handling
- Async/Await

### RAG Concepts
- Document Chunking
- Vector Embeddings
- Semantic Search
- Retrieval-Augmented Generation
- LLM Integration (Gemini)

## 🚢 Deployment

### Building for Production
```bash
npm run build
```

### Hosting Options
- Vercel (recommended for Vite + React)
- Netlify
- GitHub Pages
- Traditional web server (upload `dist/` folder)

### Environment Variables
Create `.env.production` for production API endpoint:
```
VITE_API_URL=https://your-backend-url.com/api
```

## 📄 License

MIT License - feel free to use this code for learning and educational purposes.

## 🤝 Contributing

This is a learning project. Suggestions and improvements are welcome!

---

**Happy Learning! 🚀**

For questions about React concepts or the codebase, refer to the educational comments throughout the components.
