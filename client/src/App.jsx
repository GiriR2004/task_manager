// client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { TaskProvider, useTaskContext } from './context/TaskContext';
import Dashboard from './components/Dashboard';
import NotFound from './components/NotFound';
import Login from './components/Login';
import Signup from './components/Signup';
import Navbar from './components/Navbar';

const PrivateRoute = () => {
  const { isLoggedIn, loading } = useTaskContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
        <div className="text-lg text-gray-700">Loading application...</div>
      </div>
    );
  }

  return isLoggedIn ? (
    <>
      <Navbar />
      <div className="p-4 sm:p-6 md:p-8">
        <Outlet />
      </div>
    </>
  ) : (
    <Navigate to="/login" replace />
  );
};

function App() {
  return (
    <TaskProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Router>
    </TaskProvider>
  );
}

export default App;
