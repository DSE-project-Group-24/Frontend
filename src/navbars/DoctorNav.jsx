import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const DoctorNav = ({ setIsAuthenticated, setRole }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsAuthenticated(false);
    setRole(null);
    navigate('/');
  };

  return (
    <nav className="bg-primary text-white p-4 sticky top-0 shadow-md">
      <ul className="flex space-x-6 items-center">
        <li>
          <Link to="/doctor/dashboard" className="hover:text-secondary transition">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/doctor/view-patient" className="hover:text-secondary transition">
            View Patient Data
          </Link>
        </li>
        <li>
          <Link to="/doctor/get-prediction" className="hover:text-secondary transition">
            Get Prediction
          </Link>
        </li>
        <li className="ml-auto">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default DoctorNav;