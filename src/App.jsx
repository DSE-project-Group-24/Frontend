
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import RoleSelection from './components/RoleSelection';
import Login from './components/Login';
import RegisterNurse from './components/RegisterNurse';
import RegisterDoctor from './components/RegisterDoctor';
import RegisterAdmin from './components/RegisterAdmin';
import RegisterGovernment from './components/RegisterGovernment';
import DashboardNurse from './pages/nurse/DashboardNurse';
import RecordAccidentData from './pages/nurse/RecordAccidentData';
import RecordPatientData from './pages/nurse/RecordPatientData';
import DashboardDoctor from './pages/doctor/DashboardDoctor';
import ViewPatientData from './pages/doctor/ViewPatientData';
import GetPrediction from './pages/doctor/GetPrediction';
import DashboardAdmin from './pages/admin/DashboardAdmin';
import PredictionAdmin from './pages/admin/PredictionAdmin';
import AddStaff from './pages/admin/AddStaff';
import DashboardGovernment from './pages/government/DashboardGovernment';
import PredictionGovernment from './pages/government/PredictionGovernment';
import ReportsGovernment from './pages/government/ReportsGovernment';

function App() {
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          {/* Login as root route */}
          <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} setRole={setRole} />} />
          
          {/* Role Selection for Registration */}
          <Route path="/register" element={<RoleSelection setRole={setRole} isRegister={true} />} />
          
          {/* Registration Routes */}
          <Route path="/register/nurse" element={<RegisterNurse />} />
          <Route path="/register/doctor" element={<RegisterDoctor />} />
          <Route path="/register/admin" element={<RegisterAdmin />} />
          <Route path="/register/government" element={<RegisterGovernment />} />

          {/* Nurse Routes */}
          <Route 
            path="/nurse/dashboard" 
            element={
              isAuthenticated && role === 'nurse' ? 
                <DashboardNurse setIsAuthenticated={setIsAuthenticated} setRole={setRole} /> : 
                <Navigate to="/" />
            } 
          />
          <Route 
            path="/nurse/record-accident" 
            element={
              isAuthenticated && role === 'nurse' ? 
                <RecordAccidentData setIsAuthenticated={setIsAuthenticated} setRole={setRole} /> : 
                <Navigate to="/" />
            } 
          />
          <Route 
            path="/nurse/record-patient" 
            element={
              isAuthenticated && role === 'nurse' ? 
                <RecordPatientData setIsAuthenticated={setIsAuthenticated} setRole={setRole} /> : 
                <Navigate to="/" />
            } 
          />
          
          {/* Doctor Routes */}
          <Route 
            path="/doctor/dashboard" 
            element={
              isAuthenticated && role === 'doctor' ? 
                <DashboardDoctor setIsAuthenticated={setIsAuthenticated} setRole={setRole} /> : 
                <Navigate to="/" />
            } 
          />
          <Route 
            path="/doctor/view-patient" 
            element={
              isAuthenticated && role === 'doctor' ? 
                <ViewPatientData setIsAuthenticated={setIsAuthenticated} setRole={setRole} /> : 
                <Navigate to="/" />
            } 
          />
          <Route 
            path="/doctor/get-prediction" 
            element={
              isAuthenticated && role === 'doctor' ? 
                <GetPrediction setIsAuthenticated={setIsAuthenticated} setRole={setRole} /> : 
                <Navigate to="/" />
            } 
          />
          
          {/* Admin Routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              isAuthenticated && role === 'admin' ? 
                <DashboardAdmin setIsAuthenticated={setIsAuthenticated} setRole={setRole} /> : 
                <Navigate to="/" />
            } 
          />
          <Route 
            path="/admin/prediction" 
            element={
              isAuthenticated && role === 'admin' ? 
                <PredictionAdmin setIsAuthenticated={setIsAuthenticated} setRole={setRole} /> : 
                <Navigate to="/" />
            } 
          />
          <Route 
            path="/admin/add-staff" 
            element={
              isAuthenticated && role === 'admin' ? 
                <AddStaff setIsAuthenticated={setIsAuthenticated} setRole={setRole} /> : 
                <Navigate to="/" />
            } 
          />
          
          {/* Government Routes */}
          <Route 
            path="/government/dashboard" 
            element={
              isAuthenticated && role === 'government' ? 
                <DashboardGovernment setIsAuthenticated={setIsAuthenticated} setRole={setRole} /> : 
                <Navigate to="/" />
            } 
          />
          <Route 
            path="/government/prediction" 
            element={
              isAuthenticated && role === 'government' ? 
                <PredictionGovernment setIsAuthenticated={setIsAuthenticated} setRole={setRole} /> : 
                <Navigate to="/" />
            } 
          />
          <Route 
            path="/government/reports" 
            element={
              isAuthenticated && role === 'government' ? 
                <ReportsGovernment setIsAuthenticated={setIsAuthenticated} setRole={setRole} /> : 
                <Navigate to="/" />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;