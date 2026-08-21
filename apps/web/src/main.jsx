/**
 * Project CHOWKI — Campus Outbreak Surveillance System
 * Made by Synthreaper | github.com/synthreaper/chowki
 * File: apps/web/src/main.jsx | Last Modified: 2026-08-22
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
