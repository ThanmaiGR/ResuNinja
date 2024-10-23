// src/routes/AppRoutes.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import ProfilePage from '../pages/ProfilePage';
import SettingsPage from '../pages/SettingsPage';
import FeedbackPage from '../pages/FeedbackPage'; // Ensure this imports your feedback page correctly
const AppRoutes = () => (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/profile/:username" element={<ProfilePage />} />
      <Route path="/profile/:username/:feedback" element={<FeedbackPage />} />
    </Routes>
);

export default AppRoutes;
