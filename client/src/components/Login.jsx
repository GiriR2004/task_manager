// client/src/components/Login.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockIcon, MailIcon } from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useTaskContext();
  const googleClientId = "814114839502-uc9fttjbs81n90lu1jaasf795gujhrvm.apps.googleusercontent.com";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        login(data.token, { name: data.user.name, email: data.user.email });
        setMessage('Login successful! Redirecting to dashboard...');
        navigate('/dashboard');
      } else {
        setMessage(data.msg || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Server error during login:', error);
      setMessage('Server error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    console.log("Google Login Success:", credentialResponse);
    setIsLoading(true);
    setMessage('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
      const data = await res.json();
      if (res.ok) {
        login(data.token, { name: data.user.name, email: data.user.email });
        setMessage('Google login successful! Redirecting to dashboard...');
        navigate('/dashboard');
      } else {
        setMessage(data.msg || 'Google login failed.');
      }
    } catch (error) {
      console.error('Server error during Google login:', error);
      setMessage('Server error during Google login. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleFailure = (error) => {
    console.error("Google Login Failed:", error);
    setMessage('Google login failed. Please try again.');
  };

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="px-8 pt-8 pb-6 text-center bg-indigo-600">
              <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-indigo-200">Please sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 block">
                  Email
                </label>
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
                <label htmlFor="password" className="text-sm font-medium text-gray-700 block">
                  Password
                </label>
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

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    disabled={isLoading}
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                    Forgot password?
                  </a>
                </div>
              </div>

              {message && (
                <div className={`mt-4 p-3 rounded-md text-sm ${
                  message.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
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
                  ) : 'Sign In'}
                </button>

                <div className="relative flex py-5 items-center">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleFailure}
                  size="large"
                  text="continue_with"
                  shape="rectangular"
                  theme="outline"
                  width="100%"
                  disabled={isLoading}
                />

                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  Create Account
                </button>
              </div>
            </form>

            <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-500">
                By signing in, you agree to our <a href="#" className="text-indigo-600 hover:underline">Terms</a> and <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default Login;