import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import RoleSelection from "./components/RoleSelection";
import Login from "./components/Login";
import RegisterNurse from "./components/RegisterNurse";
import RegisterDoctor from "./components/RegisterDoctor";
import RegisterAdmin from "./components/RegisterAdmin";
import RegisterGovernment from "./components/RegisterGovernment";
import DashboardNurse from "./pages/nurse/DashboardNurse";
import RecordAccidentData from "./pages/nurse/RecordAccidentData";
import RecordPatientData from "./pages/nurse/RecordPatientData";
import TransferPatients from "./pages/nurse/TransferPatient";
import DashboardDoctor from "./pages/doctor/DashboardDoctor";
import ViewPatientData from "./pages/doctor/ViewPatientData";
import GetPredictions from "./pages/doctor/GetPredictions";
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import PredictionAdmin from "./pages/admin/PredictionAdmin";
import AddStaff from "./pages/admin/AddStaff";
import DashboardGovernment from "./pages/government/DashboardGovernment";
import PredictionGovernment from "./pages/government/PredictionGovernment";
import ReportsGovernment from "./pages/government/ReportsGovernment";
import Guide from "./pages/government/Guide";
import RecentAccident from "./pages/government/RecentAccident";

function App() {
  // Initialize state from localStorage to maintain auth state on refresh
  const [role, setRole] = useState(() => localStorage.getItem("role") || null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("access_token") ? true : false;
  });

  // Keep localStorage and state in sync
  useEffect(() => {
    if (role) {
      localStorage.setItem("role", role);
    } else {
      localStorage.removeItem("role");
    }

    if (!isAuthenticated) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  }, [role, isAuthenticated]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          {/* Login as root route */}
          <Route
            path="/"
            element={
              <Login
                setIsAuthenticated={setIsAuthenticated}
                setRole={setRole}
              />
            }
          />

          {/* Role Selection for Registration */}
          <Route
            path="/register"
            element={<RoleSelection setRole={setRole} isRegister={true} />}
          />

          {/* Registration Routes */}
          <Route path="/register/nurse" element={<RegisterNurse />} />
          <Route path="/register/doctor" element={<RegisterDoctor />} />
          <Route path="/register/admin" element={<RegisterAdmin />} />
          <Route path="/register/government" element={<RegisterGovernment />} />

          {/* Nurse Routes */}
          <Route
            path="/nurse/dashboard"
            element={
              isAuthenticated && role === "nurse" ? (
                <DashboardNurse
                  setIsAuthenticated={setIsAuthenticated}
                  setRole={setRole}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/nurse/record-accident"
            element={
              isAuthenticated && role === "nurse" ? (
                <RecordAccidentData
                  setIsAuthenticated={setIsAuthenticated}
                  setRole={setRole}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/nurse/record-patient"
            element={
              isAuthenticated && role === "nurse" ? (
                <RecordPatientData
                  setIsAuthenticated={setIsAuthenticated}
                  setRole={setRole}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/nurse/transfer-patient"
            element={
              isAuthenticated && role === "nurse" ? (
                <TransferPatients
                  setIsAuthenticated={setIsAuthenticated}
                  setRole={setRole}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          {/* Doctor Routes */}
          <Route
            path="/doctor/dashboard"
            element={
              isAuthenticated && role === "doctor" ? (
                <DashboardDoctor
                  setIsAuthenticated={setIsAuthenticated}
                  setRole={setRole}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/doctor/view-patient"
            element={
              isAuthenticated && role === "doctor" ? (
                <ViewPatientData
                  setIsAuthenticated={setIsAuthenticated}
                  setRole={setRole}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/doctor/predictions"
            element={
              isAuthenticated && role === "doctor" ? (
                <GetPredictions
                  setIsAuthenticated={setIsAuthenticated}
                  setRole={setRole}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          {/* Legacy routes redirect to combined page */}
          <Route
            path="/doctor/get-prediction"
            element={<Navigate to="/doctor/predictions" replace />}
          />
          <Route
            path="/doctor/get-discharge-prediction"
            element={<Navigate to="/doctor/predictions" replace />}
          />

          {/* hospital_administrator Routes */}
          <Route
            path="/hospital_administrator/dashboard"
            element={
              isAuthenticated && role === "hospital_administrator" ? (
                <DashboardAdmin
                  setIsAuthenticated={setIsAuthenticated}
                  setRole={setRole}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/hospital_administrator/prediction"
            element={
              isAuthenticated && role === "hospital_administrator" ? (
                <PredictionAdmin
                  setIsAuthenticated={setIsAuthenticated}
                  setRole={setRole}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/hospital_administrator/add-staff"
            element={
              isAuthenticated && role === "hospital_administrator" ? (
                <AddStaff
                  setIsAuthenticated={setIsAuthenticated}
                  setRole={setRole}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          {/* Government Routes */}
          <Route
            path="/government_personnel/dashboard"
            element={
              isAuthenticated && role === "government_personnel" ? (
                <DashboardGovernment
                  setIsAuthenticated={setIsAuthenticated}
                  setRole={setRole}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/government_personnel/prediction"
            element={
              isAuthenticated && role === "government_personnel" ? (
                <PredictionGovernment
                  setIsAuthenticated={setIsAuthenticated}
                  setRole={setRole}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/government_personnel/reports"
            element={
              isAuthenticated && role === "government_personnel" ? (
                <ReportsGovernment
                  setIsAuthenticated={setIsAuthenticated}
                  setRole={setRole}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/government_personnel/guide"
            element={
              isAuthenticated && role === "government_personnel" ? (
                <Guide
                  setIsAuthenticated={setIsAuthenticated}
                  setRole={setRole}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/government_personnel/recent-accidents"
            element={
              isAuthenticated && role === "government_personnel" ? (
                <RecentAccident
                  setIsAuthenticated={setIsAuthenticated}
                  setRole={setRole}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
