import React from 'react';
import { Search } from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';

const SearchBar = () => {
  const { searchQuery, setSearchQuery } = useTaskContext();

  return (
    <div className="relative rounded-md shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search tasks by title or date..."
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
      />
    </div>
  );
};

export default SearchBar;
