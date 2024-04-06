import React from 'react';
import { createRoot } from 'react-dom/client'; 
import 'mapbox-gl/dist/mapbox-gl.css';
import './style/index.css';
import App from './frontend/App';

const root = createRoot(document.getElementById('root')); 

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
