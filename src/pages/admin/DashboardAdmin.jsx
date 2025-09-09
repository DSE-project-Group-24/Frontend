import React, { useState, useEffect } from 'react';
import AdminNav from '../../navbars/AdminNav';
import { Link } from 'react-router-dom';
import API from '../../utils/api';

const DashboardAdmin = ({ setIsAuthenticated, setRole }) => {
  const [stats, setStats] = useState({
    totalStaff: 0,
    activePatients: 0,
    pendingPredictions: 0,
    monthlyAccidents: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching dashboard data
    const fetchDashboardData = async () => {
      try {

        const [doctorsRes, nursesRes, patientsRes] = await Promise.all([
          API.get('/hospital/doctors-count'),
          API.get('/hospital/nurses-count'),
          API.get('/hospital/patients-count'),
        ]);


        const doctors = doctorsRes.data.count || 0;
        const nurses = nursesRes.data.count || 0;
        const patients = patientsRes.data.count || 0;
        // This would be replaced with real API calls in production
        // const statsResponse = await API.get('/admin/dashboard/stats');
        // const activitiesResponse = await API.get('/admin/dashboard/activities');
        
        // Simulated data for demonstration
        setStats((prev) => ({
          ...prev,
          doctors,
          nurses,
          totalStaff: doctors + nurses,
          activePatients: patients,        // mock (replace with API later)
          pendingPredictions: 12,     // mock
          monthlyAccidents: 27        // mock
        }));
          
          setRecentActivities([
            { id: 1, type: 'staff_added', user: 'Dr. Sarah Johnson', timestamp: '2025-09-06T10:30:00', description: 'New doctor added to Cardiology department' },
            { id: 2, type: 'prediction_completed', user: 'System', timestamp: '2025-09-06T09:15:00', description: 'Batch prediction completed for 15 patients' },
            { id: 3, type: 'patient_record', user: 'Nurse Michael Smith', timestamp: '2025-09-06T08:45:00', description: 'Added 5 new patient records' },
            { id: 4, type: 'system_update', user: 'System Admin', timestamp: '2025-09-05T22:00:00', description: 'System maintenance completed' }
          ]);
          
        setIsLoading(false);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Function to format timestamp to readable format
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Function to get icon for activity type
  const getActivityIcon = (type) => {
    switch(type) {
      case 'staff_added':
        return (
          <div className="bg-blue-100 p-2 rounded-full">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
        );
      case 'prediction_completed':
        return (
          <div className="bg-green-100 p-2 rounded-full">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        );
      case 'patient_record':
        return (
          <div className="bg-purple-100 p-2 rounded-full">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 p-2 rounded-full">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav setIsAuthenticated={setIsAuthenticated} setRole={setRole} />
      <div className="container mx-auto p-4 md:p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Hospital Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back. Here's an overview of your hospital system.</p>
        </header>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Total Staff</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.totalStaff}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2">
                  <Link to="/hospital_administrator/add-staff" className="text-blue-500 hover:text-blue-700 text-sm font-medium">
                    Manage Staff →
                  </Link>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Active Patients</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.activePatients}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2">
                  <a href="#" className="text-green-500 hover:text-green-700 text-sm font-medium">
                    View Patient Records →
                  </a>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Pending Predictions</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.pendingPredictions}</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2">
                  <Link to="/hospital_administrator/prediction" className="text-purple-500 hover:text-purple-700 text-sm font-medium">
                    View Predictions →
                  </Link>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-orange-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Monthly Accidents</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.monthlyAccidents}</p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2">
                  <a href="#" className="text-orange-500 hover:text-orange-700 text-sm font-medium">
                    View Accident Reports →
                  </a>
                </div>
              </div>
            </div>
            
            {/* Recent Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md p-5">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Activities</h2>
                  <div className="space-y-4">
                    {recentActivities.map(activity => (
                      <div key={activity.id} className="flex items-start">
                        {getActivityIcon(activity.type)}
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between items-center">
                            <p className="text-sm font-semibold text-gray-800">{activity.description}</p>
                            <span className="text-xs text-gray-500">{formatTime(activity.timestamp)}</span>
                          </div>
                          <p className="text-xs text-gray-500">by {activity.user}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <a href="#" className="text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center">
                      View all activities 
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="bg-white rounded-lg shadow-md p-5">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
                  <div className="space-y-2">
                    <Link to="/hospital_administrator/add-staff" className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                      </div>
                      <span className="ml-3 font-medium">Add New Staff</span>
                    </Link>
                    <Link to="/hospital_administrator/prediction" className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <span className="ml-3 font-medium">Generate Predictions</span>
                    </Link>
                    <a href="#" className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                      <div className="bg-green-100 p-2 rounded-full">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <span className="ml-3 font-medium">Generate Reports</span>
                    </a>
                    <a href="#" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="bg-gray-100 p-2 rounded-full">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <span className="ml-3 font-medium">System Settings</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardAdmin;