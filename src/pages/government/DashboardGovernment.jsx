import React, { useState, useMemo } from 'react';
import GovernmentNav from '../../navbars/GovernmentNav';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { MessageCircle, Download, TrendingUp, AlertTriangle, Users, Calendar } from 'lucide-react';
import Chatbot from '../Chatbot';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Title, Tooltip, Legend);

// Simulated complex data structure
const dataByPeriod = {
  'Last 6 Months': {
    timeLabels: ['Apr 2025', 'May 2025', 'Jun 2025', 'Jul 2025', 'Aug 2025', 'Sep 2025'],
    accidentCounts: [120, 150, 100, 180, 200, 170],
    severity: { minor: [50, 60, 40, 70, 80, 60], major: [40, 50, 30, 60, 70, 60], fatal: [30, 40, 30, 50, 50, 50] },
    roadTypes: { labels: ['Highway', 'Urban', 'Rural', 'Residential'], data: [300, 200, 150, 100] },
    vehicleTypes: { labels: ['Car', 'Truck', 'Motorcycle', 'Bus', 'Bicycle'], data: [400, 150, 100, 80, 50] },
    timeOfDay: { labels: ['Morning', 'Afternoon', 'Evening', 'Night'], data: [200, 250, 300, 150] },
    topRoads: [
      { name: 'Route 66', count: 120, severity: { minor: 50, major: 40, fatal: 30 } },
      { name: 'Main Street', count: 95, severity: { minor: 40, major: 35, fatal: 20 } },
      { name: 'Highway 101', count: 80, severity: { minor: 30, major: 30, fatal: 20 } },
      { name: 'Park Avenue', count: 65, severity: { minor: 25, major: 25, fatal: 15 } },
    ],
    totals: { total: 1250, fatal: 85, injuries: 620, minor: 500, major: 400 },
  },
  'Last Year': {
    timeLabels: ['Oct 2024', 'Nov', 'Dec', 'Jan 2025', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    accidentCounts: [140, 130, 160, 110, 170, 190, 120, 150, 100, 180, 200, 170],
    severity: { minor: [60, 50, 70, 40, 80, 90, 50, 60, 40, 70, 80, 60], major: [50, 50, 60, 40, 60, 70, 40, 50, 30, 60, 70, 60], fatal: [30, 30, 30, 30, 30, 30, 30, 40, 30, 50, 50, 50] },
    roadTypes: { labels: ['Highway', 'Urban', 'Rural', 'Residential'], data: [600, 400, 300, 200] },
    vehicleTypes: { labels: ['Car', 'Truck', 'Motorcycle', 'Bus', 'Bicycle'], data: [800, 300, 200, 160, 100] },
    timeOfDay: { labels: ['Morning', 'Afternoon', 'Evening', 'Night'], data: [400, 500, 600, 300] },
    topRoads: [
      { name: 'Route 66', count: 240, severity: { minor: 100, major: 80, fatal: 60 } },
      { name: 'Main Street', count: 190, severity: { minor: 80, major: 70, fatal: 40 } },
      { name: 'Highway 101', count: 160, severity: { minor: 60, major: 60, fatal: 40 } },
      { name: 'Park Avenue', count: 130, severity: { minor: 50, major: 50, fatal: 30 } },
    ],
    totals: { total: 2500, fatal: 170, injuries: 1240, minor: 1000, major: 800 },
  },
  'Last 2 Years': {
    timeLabels: ['2023 Q4', '2024 Q1', '2024 Q2', '2024 Q3', '2024 Q4', '2025 Q1', '2025 Q2', '2025 Q3'],
    accidentCounts: [450, 500, 480, 520, 490, 510, 470, 530],
    severity: { minor: [180, 200, 190, 210, 190, 200, 190, 210], major: [150, 160, 160, 170, 160, 170, 150, 170], fatal: [120, 140, 130, 140, 140, 140, 130, 150] },
    roadTypes: { labels: ['Highway', 'Urban', 'Rural', 'Residential'], data: [1200, 800, 600, 400] },
    vehicleTypes: { labels: ['Car', 'Truck', 'Motorcycle', 'Bus', 'Bicycle'], data: [1600, 600, 400, 320, 200] },
    timeOfDay: { labels: ['Morning', 'Afternoon', 'Evening', 'Night'], data: [800, 1000, 1200, 600] },
    topRoads: [
      { name: 'Route 66', count: 480, severity: { minor: 200, major: 160, fatal: 120 } },
      { name: 'Main Street', count: 380, severity: { minor: 160, major: 140, fatal: 80 } },
      { name: 'Highway 101', count: 320, severity: { minor: 120, major: 120, fatal: 80 } },
      { name: 'Park Avenue', count: 260, severity: { minor: 100, major: 100, fatal: 60 } },
    ],
    totals: { total: 5000, fatal: 340, injuries: 2480, minor: 2000, major: 1600 },
  },
  'All Time': {
    timeLabels: ['2020', '2021', '2022', '2023', '2024', '2025'],
    accidentCounts: [2000, 2200, 2100, 2300, 2500, 1800],
    severity: { minor: [800, 880, 840, 920, 1000, 720], major: [600, 660, 630, 690, 750, 540], fatal: [600, 660, 630, 690, 750, 540] },
    roadTypes: { labels: ['Highway', 'Urban', 'Rural', 'Residential'], data: [3000, 2000, 1500, 1000] },
    vehicleTypes: { labels: ['Car', 'Truck', 'Motorcycle', 'Bus', 'Bicycle'], data: [4000, 1500, 1000, 800, 500] },
    timeOfDay: { labels: ['Morning', 'Afternoon', 'Evening', 'Night'], data: [2000, 2500, 3000, 1500] },
    topRoads: [
      { name: 'Route 66', count: 1200, severity: { minor: 500, major: 400, fatal: 300 } },
      { name: 'Main Street', count: 950, severity: { minor: 400, major: 350, fatal: 200 } },
      { name: 'Highway 101', count: 800, severity: { minor: 300, major: 300, fatal: 200 } },
      { name: 'Park Avenue', count: 650, severity: { minor: 250, major: 250, fatal: 150 } },
    ],
    totals: { total: 12500, fatal: 850, injuries: 6200, minor: 5000, major: 4000 },
  },
};

const DashboardGovernment = ({ setIsAuthenticated, setRole }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('Last 6 Months');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [timeOfDayFilter, setTimeOfDayFilter] = useState('All');
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const currentData = dataByPeriod[selectedPeriod];

  // Compute filtered data
  const filteredData = useMemo(() => {
    let filteredCounts = [...currentData.accidentCounts];
    let filteredRoadTypes = [...currentData.roadTypes.data];
    let filteredVehicleTypes = [...currentData.vehicleTypes.data];
    let filteredTimeOfDay = [...currentData.timeOfDay.data];
    let filteredTotals = { ...currentData.totals };

    if (severityFilter !== 'All') {
      filteredCounts = currentData.severity[severityFilter.toLowerCase()] || filteredCounts;
      filteredTotals = { ...filteredTotals, total: filteredCounts.reduce((sum, val) => sum + val, 0) };
    }

    if (timeOfDayFilter !== 'All') {
      const index = currentData.timeOfDay.labels.indexOf(timeOfDayFilter);
      filteredCounts = filteredCounts.map(count => Math.round(count * (filteredTimeOfDay[index] / currentData.totals.total)));
    }

    return {
      accidentCounts: filteredCounts,
      roadTypes: filteredRoadTypes,
      vehicleTypes: filteredVehicleTypes,
      timeOfDay: filteredTimeOfDay,
      totals: filteredTotals,
    };
  }, [selectedPeriod, severityFilter, timeOfDayFilter]);

  // Export report as CSV
  const exportReport = () => {
    const csvContent = [
      ['Period', 'Total Accidents', 'Fatal', 'Injuries', 'Minor', 'Major'],
      [selectedPeriod, filteredData.totals.total, filteredData.totals.fatal, filteredData.totals.injuries, filteredData.totals.minor, filteredData.totals.major],
      ['', 'Accidents by Period'],
      ['Period', ...currentData.timeLabels],
      ['Count', ...filteredData.accidentCounts],
      ['', 'Top Roads'],
      ['Road', 'Count', 'Minor', 'Major', 'Fatal'],
      ...currentData.topRoads.map(road => [road.name, road.count, road.severity.minor, road.severity.major, road.severity.fatal]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Accident_Report_${selectedPeriod.replace(/\s+/g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Chart data
  const accidentChartData = {
    labels: currentData.timeLabels,
    datasets: [
      {
        label: 'Accidents',
        data: filteredData.accidentCounts,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        borderRadius: 8,
      },
      ...(severityFilter === 'All' ? [
        {
          label: 'Minor',
          data: currentData.severity.minor,
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          type: 'line',
          tension: 0.4,
          pointBackgroundColor: '#10B981',
          pointBorderWidth: 2,
        },
        {
          label: 'Major',
          data: currentData.severity.major,
          borderColor: '#F59E0B',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          type: 'line',
          tension: 0.4,
          pointBackgroundColor: '#F59E0B',
          pointBorderWidth: 2,
        },
        {
          label: 'Fatal',
          data: currentData.severity.fatal,
          borderColor: '#EF4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          type: 'line',
          tension: 0.4,
          pointBackgroundColor: '#EF4444',
          pointBorderWidth: 2,
        },
      ] : []),
    ],
  };

  const roadTypesChartData = {
    labels: currentData.roadTypes.labels,
    datasets: [{ 
      data: filteredData.roadTypes, 
      backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'],
      borderWidth: 0,
      hoverBackgroundColor: ['#2563EB', '#059669', '#D97706', '#7C3AED'],
    }],
  };

  const vehicleTypesChartData = {
    labels: currentData.vehicleTypes.labels,
    datasets: [{ 
      data: filteredData.vehicleTypes, 
      backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'],
      borderWidth: 0,
      hoverBackgroundColor: ['#2563EB', '#059669', '#D97706', '#7C3AED', '#DB2777'],
    }],
  };

  const timeOfDayChartData = {
    labels: currentData.timeOfDay.labels,
    datasets: [{ 
      data: filteredData.timeOfDay, 
      backgroundColor: ['#F59E0B', '#3B82F6', '#8B5CF6', '#1F2937'],
      borderWidth: 0,
      hoverBackgroundColor: ['#D97706', '#2563EB', '#7C3AED', '#111827'],
    }],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <GovernmentNav setIsAuthenticated={setIsAuthenticated} setRole={setRole} />
      
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Traffic Safety Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Comprehensive accident analytics and insights</p>
            </div>
            <button
              onClick={exportReport}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Download size={20} />
              Export Report
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <label htmlFor="period-select" className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
              <Calendar size={20} className="text-blue-600" />
              Time Period
            </label>
            <select
              id="period-select"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {Object.keys(dataByPeriod).map((period) => (
                <option key={period} value={period}>{period}</option>
              ))}
            </select>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <label htmlFor="severity-select" className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
              <AlertTriangle size={20} className="text-orange-600" />
              Severity Level
            </label>
            <select
              id="severity-select"
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option>All</option>
              <option>Minor</option>
              <option>Major</option>
              <option>Fatal</option>
            </select>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <label htmlFor="time-of-day-select" className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
              <TrendingUp size={20} className="text-green-600" />
              Time of Day
            </label>
            <select
              id="time-of-day-select"
              value={timeOfDayFilter}
              onChange={(e) => setTimeOfDayFilter(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option>All</option>
              {currentData.timeOfDay.labels.map((time) => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium opacity-90">Total Accidents</h3>
                <p className="text-3xl font-bold mt-2">{filteredData.totals.total.toLocaleString()}</p>
              </div>
              <Users size={40} className="opacity-20" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-xl text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium opacity-90">Fatal Accidents</h3>
                <p className="text-3xl font-bold mt-2">{filteredData.totals.fatal}</p>
              </div>
              <AlertTriangle size={40} className="opacity-20" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium opacity-90">Injuries Reported</h3>
                <p className="text-3xl font-bold mt-2">{filteredData.totals.injuries}</p>
              </div>
              <Users size={40} className="opacity-20" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium opacity-90">Minor Accidents</h3>
                <p className="text-3xl font-bold mt-2">{filteredData.totals.minor}</p>
              </div>
              <TrendingUp size={40} className="opacity-20" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium opacity-90">Major Accidents</h3>
                <p className="text-3xl font-bold mt-2">{filteredData.totals.major}</p>
              </div>
              <AlertTriangle size={40} className="opacity-20" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <TrendingUp className="text-blue-600" size={24} />
              Accidents Over Time
            </h2>
            <Bar
              data={accidentChartData}
              options={{
                responsive: true,
                plugins: { 
                  legend: { position: 'top' }, 
                  title: { display: false }
                },
                scales: {
                  y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.1)' } },
                  x: { grid: { display: false } }
                }
              }}
            />
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Road Type Distribution</h2>
            <Pie
              data={roadTypesChartData}
              options={{
                responsive: true,
                plugins: { legend: { position: 'bottom' } },
              }}
            />
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Vehicle Type Analysis</h2>
            <Pie
              data={vehicleTypesChartData}
              options={{
                responsive: true,
                plugins: { legend: { position: 'bottom' } },
              }}
            />
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Time of Day Patterns</h2>
            <Pie
              data={timeOfDayChartData}
              options={{
                responsive: true,
                plugins: { legend: { position: 'bottom' } },
              }}
            />
          </div>
        </div>

        {/* Most Accident-Prone Roads */}
        <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">High-Risk Road Analysis</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Road Name</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Total Incidents</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Minor</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Major</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Fatal</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Risk Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.topRoads.map((road, index) => {
                  const riskLevel = road.severity.fatal > 25 ? 'High' : road.severity.fatal > 15 ? 'Medium' : 'Low';
                  const riskColor = riskLevel === 'High' ? 'text-red-600 bg-red-50' : riskLevel === 'Medium' ? 'text-orange-600 bg-orange-50' : 'text-green-600 bg-green-50';
                  
                  return (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-3 ${index === 0 ? 'bg-red-500' : index === 1 ? 'bg-orange-500' : index === 2 ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                          <span className="text-sm font-semibold text-gray-900">{road.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{road.count}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{road.severity.minor}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{road.severity.major}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">{road.severity.fatal}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${riskColor}`}>
                          {riskLevel}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Floating Chatbot Button */}
      <button
        onClick={() => setIsChatbotOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-110 z-40"
      >
        <MessageCircle size={24} />
      </button>

      {/* Chatbot */}
      <Chatbot isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </div>
  );
};

export default DashboardGovernment;