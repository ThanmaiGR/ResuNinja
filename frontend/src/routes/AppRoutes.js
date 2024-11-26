// src/routes/AppRoutes.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import ProfilePage from '../pages/ProfilePage';
import SettingsPage from '../pages/SettingsPage';
import FeedbackPage from '../pages/FeedbackPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
const AppRoutes = () => (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/profile/:username" element={<ProfilePage />} />
      <Route path="/profile/:username/:feedback" element={<FeedbackPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

    </Routes>
);

export default AppRoutes;
