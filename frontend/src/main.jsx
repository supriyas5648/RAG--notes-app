
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  // React.StrictMode wraps the app and helps catch bugs
  // It runs components twice in development to find issues
  // It doesn't affect production build
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

