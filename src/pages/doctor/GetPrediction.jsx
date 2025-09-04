import React from 'react';
import DoctorNav from '../../navbars/DoctorNav';

const GetPrediction = ({ setIsAuthenticated, setRole }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <DoctorNav setIsAuthenticated={setIsAuthenticated} setRole={setRole} />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-primary mb-4">Get Prediction from Models</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <button 
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-600 transition mb-4"
          >
            Get Prediction
          </button>
          <p className="text-gray-700">Prediction results here (placeholder).</p>
        </div>
      </div>
    </div>
  );
};

export default GetPrediction;