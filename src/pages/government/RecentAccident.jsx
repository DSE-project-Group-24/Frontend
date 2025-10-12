import { useState, useEffect } from "react";
import API from "../../utils/api";
import GovernmentNav from './../../navbars/GovernmentNav';
import Footer from '../../components/Footer';
import { t } from "../../utils/translations";

const RecentAccident = ({ setIsAuthenticated, setRole }) => {
    
  return (
    <div className="min-h-screen bg-gray-100">
      <GovernmentNav setIsAuthenticated={setIsAuthenticated} setRole={setRole} />

      <Footer />
    </div>
  );
};

export default RecentAccident;