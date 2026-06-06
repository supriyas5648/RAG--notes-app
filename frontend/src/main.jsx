/**
 * main.jsx - React Application Entry Point
 * 
 * PURPOSE:
 * This is the first JavaScript file that runs when the app starts.
 * It initializes React and mounts the App component to the DOM.
 * 
 * WHAT HAPPENS HERE:
 * 1. React is imported
 * 2. The App component is imported
 * 3. A root element is created in the DOM
 * 4. App component is mounted to that root element
 * 5. React takes over and renders everything
 * 
 * VITE vs WEBPACK:
 * This project uses Vite (a modern bundler) instead of Create React App's Webpack.
 * Vite is faster and has better development experience.
 * The file must be named main.jsx for Vite to recognize it as entry point.
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

/**
 * ReactDOM.createRoot()
 * 
 * This creates a React root that we can render the App into.
 * 
 * WHAT IT DOES:
 * 1. Finds the HTML element with id="root" (from index.html)
 * 2. Creates a React root pointing to that element
 * 3. We then render our App component into it
 * 
 * IN index.html:
 * <div id="root"></div>
 * 
 * This is where all React components will be rendered.
 * Everything you see on the screen comes from this div.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  // React.StrictMode wraps the app and helps catch bugs
  // It runs components twice in development to find issues
  // It doesn't affect production build
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

/**
 * FLOW:
 * 1. User opens index.html in browser
 * 2. Browser downloads and runs main.jsx (bundled by Vite)
 * 3. this file runs
 * 4. React renders <App /> component
 * 5. App renders <Home /> component
 * 6. Home renders FileUpload, QuestionForm, AnswerBox
 * 7. User sees the complete UI
 * 
 * After this point, React takes over:
 * - Manages component state
 * - Re-renders when state changes
 * - Handles user events
 * - Communicates with backend API
 */
