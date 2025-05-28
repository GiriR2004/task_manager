import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext';
import Dashboard from './components/Dashboard';
import NotFound from './components/NotFound';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  return (
    <TaskProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Router>
    </TaskProvider>
  );
}

export default App;
