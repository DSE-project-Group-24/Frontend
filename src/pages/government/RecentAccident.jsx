

// import { useState, useEffect } from "react";
// import axios from 'axios'; // Import axios
// import { Calendar, Filter, TrendingUp, AlertCircle, Download, RefreshCw } from 'lucide-react';
// import GovernmentNav from './../../navbars/GovernmentNav';

// const RecentAccident = ({ setIsAuthenticated, setRole }) => {
//   const [startDate, setStartDate] = useState("2025-10-13");
//   const [endDate, setEndDate] = useState("2025-10-13");
//   const [severity, setSeverity] = useState("All");
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState(null);
//   const [error, setError] = useState(null);

//   const fetchData = async () => {
//     setLoading(true);
//     setError(null);
    
//     // Define the full backend URL
//     const API_URL = 'http://127.0.0.1:8000/govDash/comprehensive';

//     try {
//       if (severity === "All") {
//         // Fetch both S and M severity data in parallel
//         const [severeResponse, moderateResponse] = await Promise.all([
//           axios.post(API_URL, {
//             start_date: startDate,
//             end_date: endDate,
//             severity: "S"
//           }),
//           axios.post(API_URL, {
//             start_date: startDate,
//             end_date: endDate,
//             severity: "M"
//           })
//         ]);
        
//         // Merge the data from the actual responses
//         const mergedData = mergeData(severeResponse.data.results, moderateResponse.data.results);
//         setData(mergedData);
//       } else {
//         // Fetch data for a specific severity
//         const response = await axios.post(API_URL, {
//           start_date: startDate,
//           end_date: endDate,
//           severity: severity
//         });
//         setData(response.data.results);
//       }
//     } catch (err) {
//       setError("Failed to fetch data. Please try again.");
//       console.error("API Error:", err); // Log the actual error for debugging
//     } finally {
//       setLoading(false);
//     }
//   };

//   const mergeData = (data1, data2) => {
//     const merged = {};
//     const allKeys = new Set([...Object.keys(data1), ...Object.keys(data2)]);
    
//     allKeys.forEach(category => {
//       merged[category] = {};
//       const keys1 = Object.keys(data1[category] || {});
//       const keys2 = Object.keys(data2[category] || {});
//       const allSubKeys = new Set([...keys1, ...keys2]);
      
//       allSubKeys.forEach(key => {
//         merged[category][key] = (data1[category]?.[key] || 0) + (data2[category]?.[key] || 0);
//       });
//     });
    
//     return merged;
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const getTotal = (categoryData) => {
//     return Object.values(categoryData).reduce((sum, val) => sum + val, 0);
//   };

//   const getTopItems = (categoryData, limit = 3) => {
//     return Object.entries(categoryData)
//       .sort(([, a], [, b]) => b - a)
//       .slice(0, limit);
//   };

//   const calculatePercentage = (value, total) => {
//     return total > 0 ? ((value / total) * 100).toFixed(1) : 0;
//   };

//   const exportData = () => {
//     if (!data) return;
    
//     const csvContent = Object.entries(data).map(([category, values]) => {
//       const rows = Object.entries(values).map(([key, value]) => `"${category}","${key}",${value}`);
//       return rows.join('\n');
//     }).join('\n');
    
//     const blob = new Blob([`Category,Item,Count\n${csvContent}`], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `accident_analysis_${startDate}_to_${endDate}.csv`;
//     a.click();
//   };

//   const CategoryCard = ({ title, data, icon }) => {
//     const total = getTotal(data);
//     const topItems = getTopItems(data);
    
//     return (
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
//           <div className="text-blue-600">{icon}</div>
//         </div>
        
//         <div className="mb-4">
//           <span className="text-3xl font-bold text-gray-900">{total}</span>
//           <span className="text-sm text-gray-500 ml-2">total cases</span>
//         </div>
        
//         <div className="space-y-3">
//           {topItems.map(([key, value], idx) => (
//             <div key={key} className="space-y-1">
//               <div className="flex justify-between items-center">
//                 <span className="text-sm font-medium text-gray-700">{key}</span>
//                 <span className="text-sm text-gray-900 font-semibold">{value}</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div
//                   className={`h-2 rounded-full ${
//                     idx === 0 ? 'bg-blue-600' : idx === 1 ? 'bg-blue-400' : 'bg-blue-300'
//                   }`}
//                   style={{ width: `${calculatePercentage(value, total)}%` }}
//                 ></div>
//               </div>
//             </div>
//           ))}
//         </div>
        
//         <button
//           onClick={() => {
//             const items = Object.entries(data)
//               .sort(([, a], [, b]) => b - a)
//               .map(([key, value]) => `${key}: ${value}`)
//               .join('\n');
//             alert(`${title}\n\n${items}`);
//           }}
//           className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
//         >
//           View All Details →
//         </button>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <GovernmentNav setIsAuthenticated={setIsAuthenticated} setRole={setRole} />

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Comprehensive Accident Analysis</h1>
//           <p className="text-gray-600">Analyze road accident patterns across North Province with temporal and severity filters</p>
//         </div>

//         {/* Filters Section */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
//           <div className="flex items-center mb-4">
//             <Filter className="w-5 h-5 text-blue-600 mr-2" />
//             <h2 className="text-lg font-semibold text-gray-900">Analysis Filters</h2>
//           </div>
          
//           <div className="grid md:grid-cols-4 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 <Calendar className="w-4 h-4 inline mr-1" />
//                 Start Date
//               </label>
//               <input
//                 type="date"
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 <Calendar className="w-4 h-4 inline mr-1" />
//                 End Date
//               </label>
//               <input
//                 type="date"
//                 value={endDate}
//                 onChange={(e) => setEndDate(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 <AlertCircle className="w-4 h-4 inline mr-1" />
//                 Severity Level
//               </label>
//               <select
//                 value={severity}
//                 onChange={(e) => setSeverity(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
//               >
//                 <option value="All">All Severities</option>
//                 <option value="S">Severe (S)</option>
//                 <option value="M">Moderate (M)</option>
//               </select>
//             </div>
            
//             <div className="flex items-end space-x-2">
//               <button
//                 onClick={fetchData}
//                 disabled={loading}
//                 className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
//               >
//                 {loading ? (
//                   <>
//                     <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
//                     Loading...
//                   </>
//                 ) : (
//                   <>
//                     <TrendingUp className="w-4 h-4 mr-2" />
//                     Analyze
//                   </>
//                 )}
//               </button>
              
//               {data && (
//                 <button
//                   onClick={exportData}
//                   className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
//                   title="Export Data"
//                 >
//                   <Download className="w-4 h-4" />
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 flex items-center">
//             <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
//             <span className="text-red-700">{error}</span>
//           </div>
//         )}

//         {/* Summary Cards */}
//         {data && (
//           <>
//             <div className="grid md:grid-cols-3 gap-6 mb-8">
//               <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
//                 <div className="flex items-center justify-between mb-2">
//                   <h3 className="text-lg font-semibold opacity-90">Total Accidents</h3>
//                   <TrendingUp className="w-6 h-6 opacity-80" />
//                 </div>
//                 <p className="text-4xl font-bold">
//                   {data["time of collision"] ? getTotal(data["time of collision"]) : 0}
//                 </p>
//                 <p className="text-sm opacity-80 mt-2">
//                   {startDate} to {endDate}
//                 </p>
//               </div>
              
//               <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
//                 <div className="flex items-center justify-between mb-2">
//                   <h3 className="text-lg font-semibold opacity-90">Severity Filter</h3>
//                   <AlertCircle className="w-6 h-6 opacity-80" />
//                 </div>
//                 <p className="text-4xl font-bold">
//                   {severity === "All" ? "S + M" : severity}
//                 </p>
//                 <p className="text-sm opacity-80 mt-2">
//                   {severity === "All" ? "Combined Analysis" : severity === "S" ? "Severe Cases" : "Moderate Cases"}
//                 </p>
//               </div>
              
//               <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-sm p-6 text-white">
//                 <div className="flex items-center justify-between mb-2">
//                   <h3 className="text-lg font-semibold opacity-90">Categories Analyzed</h3>
//                   <Filter className="w-6 h-6 opacity-80" />
//                 </div>
//                 <p className="text-4xl font-bold">
//                   {Object.keys(data).length}
//                 </p>
//                 <p className="text-sm opacity-80 mt-2">
//                   Comprehensive data points
//                 </p>
//               </div>
//             </div>

//             {/* Data Categories Grid */}
//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {Object.entries(data).map(([category, values]) => (
//                 <CategoryCard
//                   key={category}
//                   title={category}
//                   data={values}
//                   icon={<TrendingUp className="w-5 h-5" />}
//                 />
//               ))}
//             </div>
//           </>
//         )}

//         {/* Empty State */}
//         {!data && !loading && !error && (
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
//             <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">No Data Available</h3>
//             <p className="text-gray-600 mb-6">Select your analysis parameters and click "Analyze" to view comprehensive accident statistics</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RecentAccident;

import { useState, useEffect } from "react";
import axios from 'axios';
import { Calendar, Filter, TrendingUp, AlertCircle, Download, RefreshCw } from 'lucide-react';
import GovernmentNav from './../../navbars/GovernmentNav';
<<<<<<< Updated upstream
import Footer from '../../components/Footer';
import { t } from "../../utils/translations";
=======
import DetailsModal from './DetailsModal'; // 👈 Import the new modal component
>>>>>>> Stashed changes

const RecentAccident = ({ setIsAuthenticated, setRole }) => {
  const [startDate, setStartDate] = useState("2025-10-13");
  const [endDate, setEndDate] = useState("2025-10-13");
  const [severity, setSeverity] = useState("All");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // 👇 State for managing the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const fetchData = async () => {
    // ... (fetchData function remains the same as before)
    setLoading(true);
    setError(null);
    const API_URL = 'http://127.0.0.1:8000/govDash/comprehensive';
    try {
      if (severity === "All") {
        const [severeResponse, moderateResponse] = await Promise.all([
          axios.post(API_URL, { start_date: startDate, end_date: endDate, severity: "S" }),
          axios.post(API_URL, { start_date: startDate, end_date: endDate, severity: "M" })
        ]);
        const mergedData = mergeData(severeResponse.data.results, moderateResponse.data.results);
        setData(mergedData);
      } else {
        const response = await axios.post(API_URL, { start_date: startDate, end_date: endDate, severity: severity });
        setData(response.data.results);
      }
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const mergeData = (data1, data2) => {
    // ... (mergeData function remains the same)
    const merged = {};
    const allKeys = new Set([...Object.keys(data1), ...Object.keys(data2)]);
    allKeys.forEach(category => {
      merged[category] = {};
      const keys1 = Object.keys(data1[category] || {});
      const keys2 = Object.keys(data2[category] || {});
      const allSubKeys = new Set([...keys1, ...keys2]);
      allSubKeys.forEach(key => {
        merged[category][key] = (data1[category]?.[key] || 0) + (data2[category]?.[key] || 0);
      });
    });
    return merged;
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  // 👇 Functions to open and close the modal
  const handleViewDetails = (title, values) => {
    setModalData({ title, values });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  const getTotal = (categoryData) => {
    return Object.values(categoryData).reduce((sum, val) => sum + val, 0);
  };

  const getTopItems = (categoryData, limit = 3) => {
    return Object.entries(categoryData)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit);
  };

  const calculatePercentage = (value, total) => {
    return total > 0 ? ((value / total) * 100).toFixed(1) : 0;
  };

  const exportData = () => {
    // ... (exportData function remains the same)
    if (!data) return;
    const csvContent = Object.entries(data).map(([category, values]) => {
      const rows = Object.entries(values).map(([key, value]) => `"${category}","${key}",${value}`);
      return rows.join('\n');
    }).join('\n');
    const blob = new Blob([`Category,Item,Count\n${csvContent}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `accident_analysis_${startDate}_to_${endDate}.csv`;
    a.click();
  };

  const CategoryCard = ({ title, data, icon }) => {
    const total = getTotal(data);
    const topItems = getTopItems(data);
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <div className="text-blue-600">{icon}</div>
        </div>
        
        <div className="mb-4">
          <span className="text-3xl font-bold text-gray-900">{total}</span>
          <span className="text-sm text-gray-500 ml-2">total cases</span>
        </div>
        
        <div className="space-y-3">
          {topItems.map(([key, value], idx) => (
            <div key={key} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{key}</span>
                <span className="text-sm text-gray-900 font-semibold">{value}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${idx === 0 ? 'bg-blue-600' : idx === 1 ? 'bg-blue-400' : 'bg-blue-300'}`}
                  style={{ width: `${calculatePercentage(value, total)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* 👇 Updated button to open the modal */}
        <button
          onClick={() => handleViewDetails(title, data)}
          className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          View All Details →
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <GovernmentNav setIsAuthenticated={setIsAuthenticated} setRole={setRole} />

<<<<<<< Updated upstream
      <Footer />
=======
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 👇 Sticky wrapper for header and filters */}
        <div className="sticky top-0 z-20 bg-gray-50 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Comprehensive Accident Analysis</h1>
                <p className="text-gray-600">Analyze road accident patterns across North Province with temporal and severity filters</p>
            </div>

            {/* Filters Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                <div className="flex items-center mb-4">
                    <Filter className="w-5 h-5 text-blue-600 mr-2" />
                    <h2 className="text-lg font-semibold text-gray-900">Analysis Filters</h2>
                </div>
                <div className="grid md:grid-cols-4 gap-4">
                    {/* Filter inputs remain the same */}
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Calendar className="w-4 h-4 inline mr-1" /> Start Date
                        </label>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Calendar className="w-4 h-4 inline mr-1" /> End Date
                        </label>
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <AlertCircle className="w-4 h-4 inline mr-1" /> Severity Level
                        </label>
                        <select value={severity} onChange={(e) => setSeverity(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                            <option value="All">All Severities</option>
                            <option value="S">Severe (S)</option>
                            <option value="M">Moderate (M)</option>
                        </select>
                    </div>
                    <div className="flex items-end space-x-2">
                        <button onClick={fetchData} disabled={loading}
                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center">
                            {loading ? (<><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Loading...</>) : (<><TrendingUp className="w-4 h-4 mr-2" /> Analyze</>)}
                        </button>
                        {data && (<button onClick={exportData} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors" title="Export Data"><Download className="w-4 h-4" /></button>)}
                    </div>
                </div>
            </div>
        </div>

        {/* The rest of the page content */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 flex items-center">
            {/* Error content */}
          </div>
        )}

        {data && (
          <>
            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Summary card content */}
            </div>

            {/* Data Categories Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(data).map(([category, values]) => (
                <CategoryCard key={category} title={category} data={values} icon={<TrendingUp className="w-5 h-5" />} />
              ))}
            </div>
          </>
        )}

        {/* ... Empty state div ... */}
      </div>

      {/* 👇 Render the modal component conditionally */}
      <DetailsModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        data={modalData} 
      />
>>>>>>> Stashed changes
    </div>
  );
};

export default RecentAccident;