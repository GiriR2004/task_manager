import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';

const TaskContext = createContext();
export const useTaskContext = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [reload, setReload] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState({ name: '', email: '' });


  // 🔐 Axios config with token
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // ✅ GET tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks/get', axiosConfig);
      console.log("response GET: ",res)
      setTasks(res.data.tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error.response?.data || error.message);
    }
  };

  // ➕ POST - Add new task
  const addTask = async (taskData) => {
    try {
      const res = await axios.post('http://localhost:5000/api/tasks/create', taskData, axiosConfig);
      setTasks((prev) => [...prev, res.data]);
    } catch (error) {
      console.error('Error adding task:', error.response?.data || error.message);
    }
  };

  // 🔄 PUT - Update task
  const updateTask = async (taskData) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/tasks/update/${taskData.id}`, taskData, axiosConfig);
      setTasks((prev) =>
        prev.map((task) => (task._id === taskData.id ? res.data : task))
      );
    } catch (error) {
      console.error('Error updating task:', error.response?.data || error.message);
    }
  };

  // ❌ DELETE task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/del/${id}`, axiosConfig);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error.response?.data || error.message);
    }
  };

  // ✅ Toggle task status
  const toggleTaskStatus = (task) => {
    const updated = {
      ...task,
      status: task.status === 'open' ? 'completed' : 'open',
    };
    updateTask({ ...updated, id: task._id });
  };

  // ✅ Filter logic
  const filteredTasks = tasks.filter(task => {
    if (activeFilter !== 'all' && task.status !== activeFilter) return false;
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  useEffect(() => {
    if (token) {
      fetchTasks();
    } // Only fetch tasks if logged in
  }, [token]);

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
        setToken,
        setUser,
        user,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
