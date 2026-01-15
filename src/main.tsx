import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import { AuthPage } from './pages/AuthPage';
import { ProfilePage } from './pages/ProfilePage'; // Import New Page
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/profile" element={<ProfilePage />} /> {/* Add Route */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);