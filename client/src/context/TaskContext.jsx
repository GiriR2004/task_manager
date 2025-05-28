// client/src/context/TaskContext.jsx
import axios from 'axios';
import { createContext, useContext, useEffect, useState, useMemo } from 'react';

const TaskContext = createContext();
export const useTaskContext = () => useContext(TaskContext);

// 🚀 IMPORTANT: Define your deployed backend API base URL here
const API_BASE_URL = 'https://task-manager-backend-qjyc.onrender.com'; 

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      return null;
    }
  });
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const [loading, setLoading] = useState(true);

  // New: For tracking task fetch loading and errors (as discussed previously)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  const axiosConfig = useMemo(() => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }), [token]);

  const fetchTasks = async () => {
    if (!token) {
      console.warn('Attempted to fetch tasks without a token.');
      setIsLoading(false); // Ensure loading is false if no token
      setError(null);      // Clear any previous errors
      return;
    }

    setIsLoading(true); // Set loading to true before fetching
    setError(null);      // Clear any previous errors

    try {
      // ✅ Change here: Use API_BASE_URL
      const res = await axios.get(`${API_BASE_URL}/api/tasks/get`, axiosConfig);
      setTasks(res.data.tasks);
      setIsLoading(false); // Set loading to false on success
    } catch (error) {
      console.error('Error fetching tasks:', error.response?.data || error.message);
      setError(error.response?.data?.msg || error.message || 'Failed to fetch tasks.'); // Set error message
      setIsLoading(false); // Set loading to false on error
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        logout();
      }
    }
  };

  const addTask = async (taskData) => {
    try {
      // ✅ Change here: Use API_BASE_URL
      const res = await axios.post(`${API_BASE_URL}/api/tasks/create`, taskData, axiosConfig);
      setTasks((prev) => [...prev, res.data]);
    } catch (error) {
      console.error('Error adding task:', error.response?.data || error.message);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        logout();
      }
    }
  };

  const updateTask = async (taskData) => {
    try {
      // ✅ Change here: Use API_BASE_URL
      const res = await axios.put(`${API_BASE_URL}/api/tasks/update/${taskData._id}`, taskData, axiosConfig);
      setTasks((prev) =>
        prev.map((task) => (task._id === taskData._id ? res.data : task))
      );
    } catch (error) {
      console.error('Error updating task:', error.response?.data || error.message);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        logout();
      }
    }
  };

  const deleteTask = async (id) => {
    try {
      // ✅ Change here: Use API_BASE_URL
      await axios.delete(`${API_BASE_URL}/api/tasks/del/${id}`, axiosConfig);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error.response?.data || error.message);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        logout();
      }
    }
  };

  const toggleTaskStatus = (task) => {
    const updated = {
      ...task,
      status: task.status === 'open' ? 'completed' : 'open',
    };
    updateTask({ ...updated, _id: task._id });
  };

  const filteredTasks = tasks.filter(task => {
    if (activeFilter !== 'all' && task.status !== activeFilter) return false;
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase()) && !task.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const login = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
    setTasks([]);
    setIsLoading(false); // Reset loading state on logout
    setError(null);      // Reset error state on logout
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (token && isLoggedIn) {
      fetchTasks();
    } else {
      setTasks([]);
      setIsLoading(false); // Ensure loading is false if no token
      setError(null);      // Ensure no error is displayed
    }
  }, [token, isLoggedIn]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filteredTasks,
        activeFilter,
        setActiveFilter,
        searchQuery,
        setSearchQuery,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        token,
        user,
        isLoggedIn,
        loading,
        isLoading, // Make isLoading available in context
        error,     // Make error available in context
        login,
        logout,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
