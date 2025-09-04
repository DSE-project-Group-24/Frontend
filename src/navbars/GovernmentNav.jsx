import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const GovernmentNav = ({ setIsAuthenticated, setRole }) => {
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
          <Link to="/government/dashboard" className="hover:text-secondary transition">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/government/prediction" className="hover:text-secondary transition">
            Prediction
          </Link>
        </li>
        <li>
          <Link to="/government/reports" className="hover:text-secondary transition">
            Reports
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

export default GovernmentNav;