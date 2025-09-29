import React from 'react';
import DoctorNav from '../../navbars/DoctorNav';
import AccidentEDA from '../../components/AccidentEDA';

const DashboardDoctor = ({ setIsAuthenticated, setRole }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <DoctorNav setIsAuthenticated={setIsAuthenticated} setRole={setRole} />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">Doctor Dashboard</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
          <p className="text-gray-700">
            Welcome to the doctor dashboard. This comprehensive analysis provides insights into 
            road accident patterns, patient demographics, medical outcomes, and socioeconomic impacts 
            to support evidence-based decision making.
          </p>
        </div>

        {/* EDA Component */}
        <AccidentEDA />
      </div>
    </div>
  );
};

export default DashboardDoctor;