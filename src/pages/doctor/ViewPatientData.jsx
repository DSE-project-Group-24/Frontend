import React from 'react';
import DoctorNav from '../../navbars/DoctorNav';

const ViewPatientData = ({ setIsAuthenticated, setRole }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <DoctorNav setIsAuthenticated={setIsAuthenticated} setRole={setRole} />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-primary mb-4">View Patient Data</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-700">List of patient data here (placeholder).</p>
        </div>
      </div>
    </div>
  );
};

export default ViewPatientData;