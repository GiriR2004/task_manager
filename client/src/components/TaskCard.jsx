import React from 'react';
import { Edit, Trash2, Check, Clock } from 'lucide-react';
import { formatDate, isDatePast } from '../utils/formatDate';

const TaskCard = ({ task, onEdit, onDelete, onToggleStatus }) => {
  const { id, title, description, dueDate, status } = task;
  const isPast = isDatePast(dueDate);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
      <div className="p-5">
        <div className="flex justify-between items-start">
          {/* Task Title */}
          <h3 className="text-xl font-semibold text-gray-800 truncate">{title}</h3>
          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(task)}
              className="p-1 rounded text-gray-600 hover:text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
              aria-label="Edit task"
            >
              <Edit className="h-5 w-5" />
            </button>
            <button
              onClick={() => onDelete(id)}
              className="p-1 rounded text-gray-600 hover:text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-200"
              aria-label="Delete task"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Task Description */}
        <p className="mt-2 text-sm text-gray-700 line-clamp-2">{description}</p>

        <div className="mt-4 flex justify-between items-center">
          {/* Due Date */}
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-gray-400 mr-1" />
            <span
              className={`text-sm ${
                isPast && status === 'open'
                  ? 'text-red-600 font-medium' // Brighter red for past due
                  : 'text-gray-600'
              }`}
            >
              {formatDate(dueDate)}
            </span>
          </div>

          {/* Status Badge */}
          <div className="flex items-center">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                status === 'completed'
                  ? 'bg-green-300 text-green-900' // Brighter green for completed
                  : 'bg-yellow-300 text-yellow-900' // Brighter yellow for open
              }`}
            >
              {status === 'completed' ? 'Completed' : 'Open'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-5 py-3 bg-gray-50 flex justify-end border-t border-gray-100 rounded-bl-2xl rounded-br-2xl">
        <button
          onClick={() => onToggleStatus(id)}
          className={`inline-flex items-center px-3 py-1 rounded text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            status === 'completed'
              ? 'text-yellow-700 bg-yellow-100 hover:bg-yellow-200 hover:text-yellow-800 focus:ring-yellow-500'
              : 'text-green-700 bg-green-100 hover:bg-green-200 hover:text-green-800 focus:ring-green-500'
          } transition-colors duration-200`}
        >
          {status === 'completed' ? (
            <>Reopen</>
          ) : (
            <>
              <Check className="mr-1 h-4 w-4" /> Mark Complete
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default TaskCard;