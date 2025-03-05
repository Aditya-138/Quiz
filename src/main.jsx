import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../node_modules/@mdi/font/css/materialdesignicons.min.css';
import "materialize-css/dist/css/materialize.min.css";
import "materialize-css/dist/js/materialize.min.js";

import App from './App.jsx'
import './styles/style.scss'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
