import React from 'react';
import NurseNav from '../../navbars/NurseNav';

const DashboardNurse = ({ setIsAuthenticated, setRole }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <NurseNav setIsAuthenticated={setIsAuthenticated} setRole={setRole} />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-primary mb-4">Nurse Dashboard</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-700">Welcome to the nurse dashboard. Overview of tasks and data.</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardNurse;