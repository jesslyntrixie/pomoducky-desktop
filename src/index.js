// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Ganti nama file CSS
import App from './App'; // Import komponen App

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
