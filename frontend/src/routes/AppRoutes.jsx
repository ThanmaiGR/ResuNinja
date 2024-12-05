// src/routes/AppRoutes.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import ProfilePage from '../pages/ProfilePage';
import FeedbackPage from '../pages/FeedbackPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import LogoutPage from "../pages/LogoutPage";
import ResumePage from "../pages/ResumePage";
import InterviewPage from "../pages/InterviewPage";
import ProjectInterviewPage from "../pages/ProjectInterviewPage";

const AppRoutes = () => (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/profile/:username" element={<ProfilePage />} />
      <Route path="/profile/:username/:feedback" element={<FeedbackPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/logout" element={<LogoutPage />} />
      <Route path="/resume" element={<ResumePage />} />
      <Route path="/interview" element={<InterviewPage />} />
      <Route path="/project-interview" element={<ProjectInterviewPage />} />

    </Routes>
);

export default AppRoutes;
