import React from 'react';
import AdminNav from '../../navbars/AdminNav';

const PredictionAdmin = ({ setIsAuthenticated, setRole }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav setIsAuthenticated={setIsAuthenticated} setRole={setRole} />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-primary mb-4">Prediction Page</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-700">Admin predictions here.</p>
        </div>
      </div>
    </div>
  );
};

export default PredictionAdmin;