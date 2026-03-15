import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Standard import
import './global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Clean and simple - App handles the routing now */}
    <App />
  </React.StrictMode>,
);
