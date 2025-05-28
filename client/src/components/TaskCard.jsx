import React from 'react';
import { Edit, Trash2, Check, Clock } from 'lucide-react';
import { formatDate, isDatePast } from '../utils/formatDate';

const TaskCard = ({ task, onEdit, onDelete, onToggleStatus }) => {
  const { id, title, description, dueDate, status } = task;
  const isPast = isDatePast(dueDate);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-900 truncate">{title}</h3>
          <div className="flex space-x-1">
            <button
              onClick={() => onEdit(task)}
              className="text-gray-400 hover:text-blue-500 transition-colors duration-200"
              aria-label="Edit task"
            >
              <Edit className="h-5 w-5" />
            </button>
            <button
              onClick={() => onDelete(id)}
              className="text-gray-400 hover:text-red-500 transition-colors duration-200"
              aria-label="Delete task"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{description}</p>

        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-gray-400 mr-1" />
            <span
              className={`text-sm ${
                isPast && status === 'open'
                  ? 'text-red-500 font-medium'
                  : 'text-gray-500'
              }`}
            >
              {formatDate(dueDate)}
            </span>
          </div>

          <div className="flex items-center">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                status === 'completed'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {status === 'completed' ? 'Completed' : 'Open'}
            </span>
          </div>
        </div>
      </div>

      <div className="px-5 py-3 bg-gray-50 flex justify-end border-t border-gray-100">
        <button
          onClick={() => onToggleStatus(id)}
          className={`inline-flex items-center px-3 py-1 rounded text-sm font-medium ${
            status === 'completed'
              ? 'text-amber-700 hover:text-amber-800'
              : 'text-green-700 hover:text-green-800'
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
