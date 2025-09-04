import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NurseNav = ({ setIsAuthenticated, setRole }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsAuthenticated(false); // Reset authentication
    setRole(null); // Reset role
    navigate('/'); // Navigate to role selection page
  };

  return (
    <nav className="bg-primary text-white p-4 sticky top-0 shadow-md">
      <ul className="flex space-x-6 items-center">
        <li>
          <Link to="/nurse/dashboard" className="hover:text-secondary transition">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/nurse/record-accident" className="hover:text-secondary transition">
            Record Accident Data
          </Link>
        </li>
        <li>
          <Link to="/nurse/record-patient" className="hover:text-secondary transition">
            Record Patient Data
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

export default NurseNav;