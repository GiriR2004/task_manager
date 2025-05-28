import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Loader2, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import FilterTabs from './FilterTabs';
import Navbar from './Navbar';
import SearchBar from './SearchBar';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';

const Dashboard = () => {
  const {
    filteredTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    isLoading,
    error,
  } = useTaskContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(undefined);

  const openAddModal = () => {
    setCurrentTask(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setCurrentTask(task);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (taskData) => {
    if ('_id' in taskData) {
      updateTask({ ...taskData, id: taskData._id });
    } else {
      addTask(taskData);
    }
    setIsModalOpen(false);
  };

  const taskCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans">
   

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 min-w-0"
          >
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              My Tasks
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {isLoading ? 'Loading tasks...' : `${filteredTasks.length} ${filteredTasks.length === 1 ? 'task' : 'tasks'}`} • {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 flex md:mt-0 md:ml-4"
          >
            <button
              onClick={openAddModal}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </button>
          </motion.div>
        </div>

        <div className="mt-6 border-b border-gray-200">
          <FilterTabs filter={filter} setFilter={setFilter} />
        </div>

        <div className="mt-6">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>

        <div className="mt-8">
          {isLoading ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm">
              <Loader2 className="h-10 w-10 text-blue-500 mx-auto animate-spin" />
              <p className="mt-4 text-lg text-gray-700">Loading tasks...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm text-red-600">
              <p className="text-lg font-medium">{error}</p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredTasks.length > 0 ? (
                <motion.div
                  className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                  //initial="hidden"
                  //animate="visible"
                  //exit="exit"
                >
                  {filteredTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onEdit={openEditModal}
                      onDelete={() => deleteTask(task._id)}
                      onToggleStatus={() => toggleTaskStatus(task)}
                      variants={taskCardVariants}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-16 bg-white rounded-xl shadow-sm"
                >
                  <div className="mx-auto h-16 w-16 text-gray-400 flex items-center justify-center">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No tasks found</h3>
                  <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                    {searchQuery
                      ? 'Try changing your search query or filter'
                      : 'Get started by creating a new task'}
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={openAddModal}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      New Task
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </main>

      <div className="sm:hidden fixed right-6 bottom-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openAddModal}
          className="h-14 w-14 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          aria-label="Add new task"
        >
          <Plus className="h-6 w-6" />
        </motion.button>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <TaskModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleModalSubmit}
            initialTask={currentTask}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
