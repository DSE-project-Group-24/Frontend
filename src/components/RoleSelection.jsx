import React from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../public/background.jpg'; // local file

const RoleSelection = ({ setRole }) => {
  const navigate = useNavigate();

  const selectRole = (selectedRole) => {
    setRole(selectedRole);
    navigate('/login');
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
      <h1 className="text-3xl font-bold text-white mb-8">Select Your Role</h1>
      <div className="flex flex-col gap-4">
        <button
          onClick={() => selectRole('nurse')}
          className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-blue-600 transition"
        >
          Nurse
        </button>
        <button
          onClick={() => selectRole('doctor')}
          className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-blue-600 transition"
        >
          Doctor
        </button>
        <button
          onClick={() => selectRole('admin')}
          className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-blue-600 transition"
        >
          Hospital Administrator
        </button>
        <button
          onClick={() => selectRole('government')}
          className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-blue-600 transition"
        >
          Government
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;
