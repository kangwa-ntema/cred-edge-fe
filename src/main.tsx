// fe/src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/authContext';
import './index.css';

// Get the root element from the HTML
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

// Create a root and render the application
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    {/* Wrap the entire application with the AuthProvider */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
