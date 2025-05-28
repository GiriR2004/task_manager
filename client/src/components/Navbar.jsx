import React, { useState, useEffect } from 'react';
import { ListTodo } from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user } = useTaskContext()

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.name && storedUser.email) {
      setUser(storedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left section - logo and title */}
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-lg">
              {user.name ? user.name.charAt(0).toUpperCase() : 'T'}
            </div>
            <span className="ml-3 text-xl font-semibold text-gray-800">TaskFlow</span>
          </div>

          {/* Right section - user avatar and dropdown */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center focus:outline-none"
            >
              <span className="text-sm font-medium text-gray-700">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                <div className="px-6 py-4">
                  <div className="text-lg font-semibold text-gray-800">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
                <hr />
                <div className="px-6 py-3">
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
