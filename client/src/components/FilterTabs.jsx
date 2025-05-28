import React from 'react';
import { useTaskContext } from '../context/TaskContext';

const FilterTabs = () => {
  const { activeFilter, setActiveFilter, tasks } = useTaskContext();

  const openCount = tasks.filter(task => task.status === 'open').length;
  const completedCount = tasks.filter(task => task.status === 'completed').length;

  const tabs = [
    { label: 'All', value: 'all', count: tasks.length },
    { label: 'Open', value: 'open', count: openCount },
    { label: 'Completed', value: 'completed', count: completedCount },
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {tabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveFilter(tab.value)}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${
                activeFilter === tab.value
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
              transition-colors duration-200
            `}
          >
            {tab.label}
            <span
              className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                activeFilter === tab.value
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default FilterTabs;
