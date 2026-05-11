import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { preloadCharacterSheets } from './engine/sprites';
import { preloadTilesheets } from './engine/tiles';

// Kick off sprite + tileset preloads as soon as the bundle runs.
preloadCharacterSheets();
preloadTilesheets();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
