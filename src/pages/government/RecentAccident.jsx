import { useState, useEffect } from "react";
import axios from 'axios';
import {
  Calendar,
  Filter,
  TrendingUp,
  AlertCircle,
  Download,
  RefreshCw,
  ChevronRight,
  BarChart3
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import GovernmentNav from './../../navbars/GovernmentNav';
import { t } from '../../utils/translations';

const RecentAccident = ({ setIsAuthenticated, setRole }) => {
  const [startDate, setStartDate] = useState("2020-10-13");
  const [endDate, setEndDate] = useState("2021-10-13");
  const [severity, setSeverity] = useState("All");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const fetchData = async () => {
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

  const calculatePercentage = (value, total) => {
    return total > 0 ? ((value / total) * 100).toFixed(1) : 0;
  };

  const exportData = () => {
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

  const COLORS = ["#3b82f6", "#06b6d4", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"];

  const CategoryChart = ({ title, data }) => {
    const chartData = Object.entries(data)
      .filter(([key]) => key !== "Unknown")
      .map(([key, value]) => ({ name: key, value }));

    const total = chartData.reduce((sum, d) => sum + d.value, 0);

    if (chartData.length === 0) {
      return (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-base font-semibold text-gray-800 mb-2">{title}</h3>
          <p className="text-sm text-gray-500">No data available for this category.</p>
        </div>
      );
    }

    const isBar = chartData.length > 5;

    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-800">{title}</h3>
          <span className="text-xs text-gray-500">{total} total</span>
        </div>

        {isBar ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-30} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={(entry) => `${entry.name} (${((entry.value / total) * 100).toFixed(1)}%)`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}

        <button
          onClick={() => handleViewDetails(title, data)}
          className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center group"
        >
          View All Details
          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  };

  const DetailsModal = ({ isOpen, onClose, data }) => {
    if (!isOpen || !data) return null;

    const sortedData = Object.entries(data.values).sort(([, a], [, b]) => b - a);
    const total = getTotal(data.values);

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto" onClick={onClose}>
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
          <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-50" />

          <div
            className="relative inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <h3 className="text-xl font-semibold text-white">{data.title}</h3>
              <p className="text-blue-100 text-sm mt-1">Total Cases: {total}</p>
            </div>

            <div className="px-6 py-4 max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {sortedData.map(([key, value], idx) => (
                  <div
                    key={key}
                    className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-medium text-gray-800">{key}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-32 bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${calculatePercentage(value, total)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-12 text-right">{value}</span>
                      <span className="text-xs text-gray-500 w-12 text-right">{calculatePercentage(value, total)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={onClose}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <GovernmentNav setIsAuthenticated={setIsAuthenticated} setRole={setRole} />

      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-full px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Comprehensive Accident Analysis</h1>
          <p className="text-sm text-gray-600 mt-1">
            Analyze road accident patterns across North Province with temporal and severity filters
          </p>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Filters */}
        <div className="w-80 bg-white border-r border-gray-200 flex-shrink-0">
          <div className="p-6 space-y-6">
            <div>
              <div className="flex items-center mb-4">
                <Filter className="w-5 h-5 text-blue-600 mr-2" />
                <h2 className="text-base font-semibold text-gray-900">Analysis Filters</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    <Calendar className="w-3.5 h-3.5 inline mr-1" />
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    <Calendar className="w-3.5 h-3.5 inline mr-1" />
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    <AlertCircle className="w-3.5 h-3.5 inline mr-1" />
                    Severity Level
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="All">All Severities</option>
                    <option value="S">Severe (S)</option>
                    <option value="M">Moderate (M)</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={fetchData}
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Loading
                      </>
                    ) : (
                      <>
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Analyze
                      </>
                    )}
                  </button>

                  {data && (
                    <button
                      onClick={exportData}
                      className="bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition-colors"
                      title="Export Data"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {data && (
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Summary</h3>
                <div className="space-y-3">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-xs text-blue-600 font-medium">Total Accidents</div>
                    <div className="text-2xl font-bold text-blue-900 mt-1">
                      {data["time of collision"] ? getTotal(data["time of collision"]) : 0}
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <div className="text-xs text-purple-600 font-medium">Severity Filter</div>
                    <div className="text-lg font-bold text-purple-900 mt-1">
                      {severity === "All" ? "S + M" : severity}
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-xs text-green-600 font-medium">Categories</div>
                    <div className="text-lg font-bold text-green-900 mt-1">
                      {Object.keys(data).length}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Graph Section */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            )}

            {data && (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                {Object.entries(data).map(([category, values]) => (
                  <CategoryChart key={category} title={category} data={values} />
                ))}
              </div>
            )}

            {!data && !loading && !error && (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                  Select your analysis parameters and click "Analyze" to view comprehensive accident statistics
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <DetailsModal isOpen={isModalOpen} onClose={closeModal} data={modalData} />
    </div>
  );
};

export default RecentAccident;


// import { useState, useEffect } from "react";
// import axios from 'axios';
// import {
//   Calendar,
//   Filter,
//   TrendingUp,
//   AlertCircle,
//   Download,
//   RefreshCw,
//   ChevronRight,
//   BarChart3
// } from 'lucide-react';
// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";
// import GovernmentNav from './../../navbars/GovernmentNav';
// import { t } from '../../utils/translations';

// const RecentAccident = ({ setIsAuthenticated, setRole }) => {
//   const [startDate, setStartDate] = useState("2020-10-13");
//   const [endDate, setEndDate] = useState("2021-10-13");
//   const [severity, setSeverity] = useState("All");
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState(null);
//   const [error, setError] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalData, setModalData] = useState(null);

//   const fetchData = async () => {
//     setLoading(true);
//     setError(null);
//     const API_URL = 'http://127.0.0.1:8000/govDash/comprehensive';

//     try {
//       if (severity === "All") {
//         const [severeResponse, moderateResponse] = await Promise.all([
//           axios.post(API_URL, { start_date: startDate, end_date: endDate, severity: "S" }),
//           axios.post(API_URL, { start_date: startDate, end_date: endDate, severity: "M" })
//         ]);
//         const mergedData = mergeData(severeResponse.data.results, moderateResponse.data.results);
//         setData(mergedData);
//       } else {
//         const response = await axios.post(API_URL, { start_date: startDate, end_date: endDate, severity });
//         setData(response.data.results);
//       }
//     } catch (err) {
//       setError(t("failedFetchData"));
//       console.error("API Error:", err);
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

//   const handleViewDetails = (title, values) => {
//     setModalData({ title, values });
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setModalData(null);
//   };

//   const getTotal = (categoryData) => {
//     return Object.values(categoryData).reduce((sum, val) => sum + val, 0);
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

//   const COLORS = ["#3b82f6", "#06b6d4", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"];

//   const CategoryChart = ({ title, data }) => {
//     const chartData = Object.entries(data)
//       .filter(([key]) => key !== "Unknown")
//       .map(([key, value]) => ({ name: key, value }));

//     const total = chartData.reduce((sum, d) => sum + d.value, 0);

//     if (chartData.length === 0) {
//       return (
//         <div className="bg-white p-6 rounded-lg border border-gray-200">
//           <h3 className="text-base font-semibold text-gray-800 mb-2">{title}</h3>
//           <p className="text-sm text-gray-500">{t("noDataAvailableCategory")}</p>
//         </div>
//       );
//     }

//     const isBar = chartData.length > 5;

//     return (
//       <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-200">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-base font-semibold text-gray-800">{title}</h3>
//           <span className="text-xs text-gray-500">{total} {t("total")}</span>
//         </div>

//         {isBar ? (
//           <ResponsiveContainer width="100%" height={250}>
//             <BarChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-30} textAnchor="end" height={60} />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         ) : (
//           <ResponsiveContainer width="100%" height={250}>
//             <PieChart>
//               <Pie
//                 data={chartData}
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={80}
//                 fill="#8884d8"
//                 dataKey="value"
//                 label={(entry) => `${entry.name} (${((entry.value / total) * 100).toFixed(1)}%)`}
//               >
//                 {chartData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Tooltip />
//               <Legend />
//             </PieChart>
//           </ResponsiveContainer>
//         )}

//         <button
//           onClick={() => handleViewDetails(title, data)}
//           className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center group"
//         >
//           {t("viewAllDetails")}
//           <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
//         </button>
//       </div>
//     );
//   };

//   const DetailsModal = ({ isOpen, onClose, data }) => {
//     if (!isOpen || !data) return null;
//     const sortedData = Object.entries(data.values).sort(([, a], [, b]) => b - a);
//     const total = getTotal(data.values);

//     return (
//       <div className="fixed inset-0 z-50 overflow-y-auto" onClick={onClose}>
//         <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
//           <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-50" />

//           <div
//             className="relative inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
//               <h3 className="text-xl font-semibold text-white">{data.title}</h3>
//               <p className="text-blue-100 text-sm mt-1">{t("totalCases")}: {total}</p>
//             </div>

//             <div className="px-6 py-4 max-h-96 overflow-y-auto">
//               <div className="space-y-2">
//                 {sortedData.map(([key, value], idx) => (
//                   <div
//                     key={key}
//                     className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
//                   >
//                     <div className="flex items-center space-x-3">
//                       <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
//                         {idx + 1}
//                       </span>
//                       <span className="text-sm font-medium text-gray-800">{key}</span>
//                     </div>
//                     <div className="flex items-center space-x-4">
//                       <div className="w-32 bg-gray-100 rounded-full h-2">
//                         <div
//                           className="bg-blue-500 h-2 rounded-full"
//                           style={{ width: `${calculatePercentage(value, total)}%` }}
//                         ></div>
//                       </div>
//                       <span className="text-sm font-semibold text-gray-900 w-12 text-right">{value}</span>
//                       <span className="text-xs text-gray-500 w-12 text-right">{calculatePercentage(value, total)}%</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
//               <button
//                 onClick={onClose}
//                 className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
//               >
//                 {t("close")}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="h-screen bg-gray-50 flex flex-col">
//       <GovernmentNav setIsAuthenticated={setIsAuthenticated} setRole={setRole} />

//       <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
//         <div className="max-w-full px-6 py-4">
//           <h1 className="text-2xl font-bold text-gray-900">{t("comprehensiveAccidentAnalysis")}</h1>
//           <p className="text-sm text-gray-600 mt-1">
//             {t("accidentAnalysisDescription")}
//           </p>
//         </div>
//       </div>

//       {/* Sidebar Filters, Graphs, Error Messages... */}
//       {/* Replace all other texts with t('key') as above */}
//     </div>
//   );
// };

// export default RecentAccident;

