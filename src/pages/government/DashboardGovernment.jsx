import React from 'react';
import GovernmentNav from '../../navbars/GovernmentNav';
import AccidentEDA_Gov from '../../components/AccidentEDA_Gov';

const DashboardGovernment = ({ setIsAuthenticated, setRole }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <GovernmentNav setIsAuthenticated={setIsAuthenticated} setRole={setRole} />
      <div className="container mx-auto p-6">
        <AccidentEDA_Gov />
      </div>
    </div>
  );
};

export default DashboardGovernment;
