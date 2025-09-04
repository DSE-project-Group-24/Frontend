import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../public/background.jpg'; // local file

const Login = ({ role, setIsAuthenticated }) => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Hardcoded passwords
  const passwords = {
    nurse: 'nurse_pass',
    doctor: 'doctor_pass',
    admin: 'admin_pass',
    government: 'gov_pass',
  };

  const handleLogin = () => {
    if (password === passwords[role]) {
      setIsAuthenticated(true);
      navigate(`/${role}/dashboard`);
    } else {
      alert('Invalid password');
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="bg-black/50 w-full min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-white mb-6">
          Login as {role.charAt(0).toUpperCase() + role.slice(1)}
        </h1>
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Enter password" 
            className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button 
            onClick={handleLogin} 
            className="w-full px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
