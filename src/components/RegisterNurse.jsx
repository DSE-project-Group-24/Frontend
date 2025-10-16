import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import backgroundVideo from '../assets/backgroundq9.mov';
import API from '../utils/api';

// Register Nurse API function
const registerNurse = async (userData) => {
  try {
    const response = await API.post("/auth/register/nurse", userData);
    return response.data; // new user object
  } catch (error) {
    throw error.response?.data || { detail: "Registration failed" };
  }
};

const RegisterNurse = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    nic: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await registerNurse(formData);
      navigate('/'); // redirect to login after successful registration
    } catch (err) {
      setError(err.detail || "Registration failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
      <video className="absolute inset-0 w-full h-full object-cover z-0" src={backgroundVideo} autoPlay muted loop playsInline />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-indigo-900/30 z-10"></div>

      <div className="max-w-md w-full space-y-6 relative z-20">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-white mb-1">Register as Nurse</h2>
          <p className="text-blue-100 text-sm">Create your account</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/10">
          <form className="space-y-6" onSubmit={handleRegister}>
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
                required
              />
            </div>

            {/* NIC */}
            <div>
              <label htmlFor="nic" className="block text-sm font-medium text-gray-700 mb-2">NIC</label>
              <input
                id="nic"
                type="text"
                value={formData.nic}
                onChange={handleChange}
                placeholder="Enter your NIC"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center px-4 py-2 rounded-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm transition-all"
            >
              {isLoading ? "Registering..." : "Register"}
            </button>

            <div className="text-center">
              <Link to="/" className="text-sm text-gray-200 hover:text-white">
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterNurse;
