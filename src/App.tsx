import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import TasksPage from './pages/TasksPage';
import RegisterPage from './pages/RegisterPage'; // Import RegisterPage

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} /> {/* Add this line */}
        <Route path="/tasks" element={<TasksPage />} />
      </Routes>
    </Router>
  );
};

export default App;
