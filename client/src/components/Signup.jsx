// client/src/components/Signup.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserIcon, MailIcon, LockIcon } from 'lucide-react';
import { useTaskContext } from '../context/TaskContext'; // Auto-login support

function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useTaskContext(); // Use context login

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token); // Save token
        login(data.token, { name: data.user.name, email: data.user.email }); // Auto-login
        setMessage('Signup successful! Redirecting...');
        navigate('/dashboard'); // Redirect to dashboard or home page
      } else {
        setMessage(data.msg || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Server error during signup:', error);
      setMessage('Server error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 pt-8 pb-6 text-center bg-indigo-600">
            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-indigo-200">Join us and manage your tasks efficiently</p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700 block">Name</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 block">Email</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MailIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 block">Password</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {message && (
              <div className={`mt-4 p-3 rounded-md text-sm ${message.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message}
              </div>
            )}

            <div className="space-y-3">
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : 'Sign Up'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                Already have an account? Sign In
              </button>
            </div>
          </form>

          <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              By signing up, you agree to our <a href="#" className="text-indigo-600 hover:underline">Terms</a> and <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
