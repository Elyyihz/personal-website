import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

/**
 * React entry point mounting the root component into DOM container.
 */
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Fatal error: Root container DOM element #root not found.');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
