import { useState, useEffect } from "react";
import API from "../../utils/api";
import GovernmentNav from './../../navbars/GovernmentNav';

const RecentAccident = ({ setIsAuthenticated, setRole }) => {
    
  return (
    <div className="min-h-screen bg-gray-100">
      <GovernmentNav setIsAuthenticated={setIsAuthenticated} setRole={setRole} />

    </div>
  );
};

export default RecentAccident;