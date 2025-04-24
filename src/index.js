import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'leaflet/dist/leaflet.css';
import { BrowserRouter } from 'react-router-dom';
import './18n';

const LoadingScreen = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-purple-200 bg-opacity-95 z-50">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin mb-4 mx-auto"></div>
    </div>
  </div>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Suspense fallback={<LoadingScreen />}>
      <App />
    </Suspense>
  </React.StrictMode>
);

reportWebVitals();