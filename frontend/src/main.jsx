import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
document.documentElement.dataset.reduceMotion =
  localStorage.getItem('unigames.reduce-motion') || 'false';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
