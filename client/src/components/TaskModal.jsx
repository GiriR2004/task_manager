import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const TaskModal = ({ isOpen, onClose, onSubmit, initialTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('open');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || '');
      setDescription(initialTask.description || '');
      setDueDate(initialTask.dueDate || '');
      setStatus(initialTask.status || 'open');
    } else {
      setTitle('');
      setDescription('');
      setDueDate('');
      setStatus('open');
    }
    setErrors({});
  }, [isOpen, initialTask]);

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!dueDate) newErrors.dueDate = 'Due date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const taskData = {
      title,
      description,
      dueDate,
      status,
    };

    if (initialTask) {
      onSubmit({ ...taskData, _id: initialTask._id }); // ✅ FIX: return _id
    } else {
      onSubmit(taskData);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

      <div
        className="relative z-50 bg-white rounded-lg shadow-xl w-full max-w-lg mx-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-4 right-4">
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close Modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {initialTask ? 'Edit Task' : 'Create New Task'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`mt-1 block w-full border ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            />
            {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              rows={3}
            ></textarea>
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={`mt-1 block w-full border ${
                errors.dueDate ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            />
            {errors.dueDate && <p className="text-red-600 text-sm mt-1">{errors.dueDate}</p>}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="open">Open</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex justify-end pt-4 space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
            >
              {initialTask ? 'Save Changes' : 'Create Task'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-sm font-medium rounded hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
