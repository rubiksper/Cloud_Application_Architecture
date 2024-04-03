import React from 'react';
import { createRoot } from 'react-dom/client'; // Importez createRoot depuis react-dom/client
import 'mapbox-gl/dist/mapbox-gl.css';
import './style/index.css';
import App from './frontend/App';

const root = createRoot(document.getElementById('root')); // Utilisez createRoot pour créer la racine de votre application

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
