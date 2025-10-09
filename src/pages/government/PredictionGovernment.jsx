// // import { useEffect, useState, useMemo } from 'react';
// // import { useSearchParams } from 'react-router-dom';
// // import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// // import GovernmentNav from '../../navbars/GovernmentNav';
// // import axios from 'axios';

// // const API = axios.create({
// //   baseURL: "http://127.0.0.1:8000/",
// // });

// // API.interceptors.request.use((config) => {
// //   const token = localStorage.getItem("access_token");
// //   if (token) {
// //     config.headers.Authorization = `Bearer ${token}`;
// //   }
// //   return config;
// // });

// // const PredictionGovernment = ({ setIsAuthenticated, setRole }) => {
// //   const [searchParams, setSearchParams] = useSearchParams();
// //   const [months, setMonths] = useState(() => Number(searchParams.get('months')) || 5);
// //   const [forecastData, setForecastData] = useState(() => {
// //     const cached = localStorage.getItem('forecastData');
// //     return cached ? JSON.parse(cached) : null;
// //   });
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState('');
// //   const [showAlert, setShowAlert] = useState(false);

// //   useEffect(() => {
// //     localStorage.setItem('forecastData', JSON.stringify(forecastData));
// //     setSearchParams({ months });
// //   }, [forecastData, months, setSearchParams]);

// //   const fetchPrediction = async () => {
// //     if (months < 1 || months > 6) {
// //       setError('Please enter a valid number of months (1-6)');
// //       return;
// //     }

// //     const cacheKey = `forecastData_${months}`;
// //     const cachedData = localStorage.getItem(cacheKey);
// //     if (cachedData) {
// //       setForecastData(JSON.parse(cachedData));
// //       setShowAlert(true);
// //       setTimeout(() => setShowAlert(false), 5000);
// //       return;
// //     }

// //     setShowAlert(true);
// //     setTimeout(() => setShowAlert(false), 5000);

// //     setLoading(true);
// //     setError('');

// //     try {
// //       const response = await API.post('/predictions/forecast', {
// //         months: parseInt(months)
// //       });
// //       setForecastData(response.data);
// //       localStorage.setItem(cacheKey, JSON.stringify(response.data));
// //     } catch (err) {
// //       setError(err.response?.data?.detail || 'Failed to fetch prediction data');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const formatNumber = (num) => {
// //     return new Intl.NumberFormat('en-US', {
// //       minimumFractionDigits: 1,
// //       maximumFractionDigits: 1
// //     }).format(num);
// //   };

// //   const getMonthLabel = (index) => {
// //     const monthNames = [
// //       'January', 'February', 'March', 'April', 'May', 'June',
// //       'July', 'August', 'September', 'October', 'November', 'December'
// //     ];
// //     const currentDate = new Date(2022, 5);
// //     const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + index);
// //     return `${monthNames[targetDate.getMonth()]} ${targetDate.getFullYear()}`;
// //   };

// //   const prepareChartData = useMemo(() => {
// //     if (!forecastData) return [];

// //     const chartData = [];
// //     const forecastM = forecastData.forecast_M || [];
// //     const forecastS = forecastData.forecast_S || [];

// //     for (let i = 0; i < Math.max(forecastM.length, forecastS.length); i++) {
// //       const mMean = forecastM[i]?.mean || 0;
// //       const sMean = forecastS[i]?.mean || 0;
// //       const totalAccidents = (mMean + sMean) / 0.8;

// //       chartData.push({
// //         month: getMonthLabel(i),
// //         monthShort: getMonthLabel(i).split(' ')[0].substring(0, 3),
// //         forecast_M: Number(mMean.toFixed(1)),
// //         forecast_S: Number(sMean.toFixed(1)),
// //         total_accidents: Number(totalAccidents.toFixed(1))
// //       });
// //     }

// //     return chartData;
// //   }, [forecastData]);

// //   const getConfidenceLevel = (mean, lower, upper) => {
// //     const range = upper - lower;
// //     const relativeRange = range / Math.abs(mean);

// //     if (relativeRange < 0.5) return { level: 'High', color: 'text-green-600', bg: 'bg-green-50' };
// //     if (relativeRange < 1) return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-50' };
// //     return { level: 'Low', color: 'text-red-600', bg: 'bg-red-50' };
// //   };

// //   const calculateSummaryStats = useMemo(() => {
// //     if (!forecastData) return { avgM: 0, avgS: 0, avgTotal: 0, maxTotal: 0, minTotal: 0 };

// //     const forecastM = forecastData.forecast_M || [];
// //     const forecastS = forecastData.forecast_S || [];

// //     const avgM = forecastM.reduce((sum, item) => sum + item.mean, 0) / (forecastM.length || 1);
// //     const avgS = forecastS.reduce((sum, item) => sum + item.mean, 0) / (forecastS.length || 1);
// //     const avgTotal = (avgM + avgS) / 0.8;

// //     const totalAccidents = forecastM.map((item, i) => {
// //       const sMean = forecastS[i]?.mean || 0;
// //       return (item.mean + sMean) / 0.8;
// //     });

// //     const maxTotal = totalAccidents.length ? Math.max(...totalAccidents) : 0;
// //     const minTotal = totalAccidents.length ? Math.min(...totalAccidents) : 0;

// //     return { avgM, avgS, avgTotal, maxTotal, minTotal };
// //   }, [forecastData]);

// //   const stats = calculateSummaryStats;

//   // return (
//   //   <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//   //     <GovernmentNav setIsAuthenticated={setIsAuthenticated} setRole={setRole} />
      
//   //     <div className="container mx-auto p-6 max-w-7xl">
//   //       <div className="text-center mb-8">
//   //         <h1 className="text-4xl font-bold text-gray-900 mb-2">
//   //           🔮 Accident Prediction Forecast
//   //         </h1>
//   //         <p className="text-gray-600 text-lg">
//   //           Generate statistical forecasts for accident trends from June 2022 onwards
//   //         </p>
//   //       </div>

// //         {showAlert && (
// //           <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-lg animate-pulse">
// //             <div className="flex items-center">
// //               <svg className="w-6 h-6 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
// //               </svg>
// //               <div>
// //                 <p className="text-blue-800 font-semibold">Forecast Alert</p>
// //                 <p className="text-blue-700 text-sm">This accident forecast shows monthly predictions starting from June 2022. The data represents statistical projections based on historical patterns.</p>
// //               </div>
// //             </div>
// //           </div>
// //         )}

// //         <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
// //           <div className="flex flex-col md:flex-row items-center justify-center gap-4">
// //             <div className="flex flex-col">
// //               <label className="text-sm font-medium text-gray-700 mb-2">
// //                 Forecast Period (Months)
// //               </label>
// //               <input
// //                 type="number"
// //                 min="1"
// //                 max="6"
// //                 value={months}
// //                 onChange={(e) => setMonths(Number(e.target.value))}
// //                 className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-40"
// //                 placeholder="Enter months"
// //               />
// //             </div>
            
// //             <button
// //               onClick={fetchPrediction}
// //               disabled={loading}
// //               className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 mt-6 md:mt-0"
// //             >
// //               {loading ? (
// //                 <div className="flex items-center">
// //                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
// //                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
// //                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
// //                   </svg>
// //                   Generating...
// //                 </div>
// //               ) : (
// //                 <div className="flex items-center">
// //                   <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
// //                   </svg>
// //                   Generate Forecast
// //                 </div>
// //               )}
// //             </button>
// //           </div>
// //         </div>

// //         {error && (
// //           <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
// //             <div className="flex items-center">
// //               <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
// //               </svg>
// //               <span className="text-red-800 font-medium">{error}</span>
// //             </div>
// //           </div>
// //         )}

// //         {forecastData && (
// //           <div className="space-y-6">
// //             <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
// //               <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
// //                 <h3 className="text-sm font-medium opacity-80 mb-2">Avg Monthly (M)</h3>
// //                 <p className="text-3xl font-bold">{formatNumber(stats.avgM)}</p>
// //                 <p className="text-sm opacity-80">Recorded Moderate Severity Accidents per month</p>
// //               </div>
              
// //               <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
// //                 <h3 className="text-sm font-medium opacity-80 mb-2">Avg Monthly (S)</h3>
// //                 <p className="text-3xl font-bold">{formatNumber(stats.avgS)}</p>
// //                 <p className="text-sm opacity-80">Recorded Serious Severity Accidents per month</p>
// //               </div>
              
// //               <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
// //                 <h3 className="text-sm font-medium opacity-80 mb-2">Avg Total Accidents</h3>
// //                 <p className="text-3xl font-bold">{formatNumber(stats.avgTotal)}</p>
// //                 <p className="text-sm opacity-80">all accidents not only recorded per month</p>
// //               </div>
              
// //               <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white">
// //                 <h3 className="text-sm font-medium opacity-80 mb-2">Peak Month</h3>
// //                 <p className="text-3xl font-bold">{formatNumber(stats.maxTotal)}</p>
// //                 <p className="text-sm opacity-80">maximum expected all happens,not only recorded.</p>
// //               </div>
// //             </div>

// //             <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
// //               <div className="mb-6">
// //                 <h2 className="text-xl font-semibold text-gray-800 mb-2">Accident Forecast Trends</h2>
// //                 <p className="text-sm text-gray-600">Monthly accident predictions from June 2022 onwards</p>
// //               </div>
              
// //               <div className="h-96">
// //                 <ResponsiveContainer width="100%" height="100%">
// //                   <LineChart data={prepareChartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
// //                     <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
// //                     <XAxis 
// //                       dataKey="monthShort" 
// //                       stroke="#666"
// //                       fontSize={12}
// //                     />
// //                     <YAxis 
// //                       stroke="#666"
// //                       fontSize={12}
// //                     />
// //                     <Tooltip 
// //                       contentStyle={{
// //                         backgroundColor: '#fff',
// //                         border: '1px solid #ccc',
// //                         borderRadius: '8px',
// //                         boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
// //                       }}
// //                       formatter={(value, name) => [
// //                         formatNumber(value),
// //                         name === 'forecast_M' ? 'Forecast M' :
// //                         name === 'forecast_S' ? 'Forecast S' : 'Total Accidents'
// //                       ]}
// //                       labelFormatter={(label) => {
// //                         const dataPoint = prepareChartData.find(d => d.monthShort === label);
// //                         return dataPoint ? dataPoint.month : label;
// //                       }}
// //                     />
// //                     <Legend />
// //                     <Line 
// //                       type="monotone" 
// //                       dataKey="forecast_M" 
// //                       stroke="#3b82f6" 
// //                       strokeWidth={2}
// //                       dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
// //                       name="Forecast Moderately Recorded Accidents"
// //                     />
// //                     <Line 
// //                       type="monotone" 
// //                       dataKey="forecast_S" 
// //                       stroke="#10b981" 
// //                       strokeWidth={2}
// //                       dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
// //                       name="Forecast Seriously Recorded Accidents"
// //                     />
// //                     <Line 
// //                       type="monotone" 
// //                       dataKey="total_accidents" 
// //                       stroke="#ef4444" 
// //                       strokeWidth={3}
// //                       dot={{ fill: '#ef4444', strokeWidth: 2, r: 5 }}
// //                       name="All Accidents Not Only Recorded"
// //                     />
// //                   </LineChart>
// //                 </ResponsiveContainer>
// //               </div>
// //             </div>

// //             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// //               <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
// //                 <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
// //                   <h3 className="text-lg font-semibold text-gray-800">Forecast Moderate Recorded Accident Details</h3>
// //                 </div>
// //                 <div className="overflow-x-auto">
// //                   <table className="w-full">
// //                     <thead className="bg-gray-50">
// //                       <tr>
// //                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
// //                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mean</th>
// //                       </tr>
// //                     </thead>
// //                     <tbody className="divide-y divide-gray-200">
// //                       {forecastData?.forecast_M?.map((item, index) => (
// //                         <tr key={index} className="hover:bg-gray-50">
// //                           <td className="px-4 py-3 text-sm font-medium text-gray-900">
// //                             {getMonthLabel(index).split(' ')[0]}
// //                           </td>
// //                           <td className="px-4 py-3 text-sm text-gray-900">
// //                             {formatNumber(item.mean)}
// //                           </td>
// //                         </tr>
// //                       ))}
// //                     </tbody>
// //                   </table>
// //                 </div>
// //               </div>

// //               <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
// //                 <div className="bg-green-50 px-6 py-4 border-b border-gray-200">
// //                   <h3 className="text-lg font-semibold text-gray-800">Forecast Serious Recorded Accident Details</h3>
// //                 </div>
// //                 <div className="overflow-x-auto">
// //                   <table className="w-full">
// //                     <thead className="bg-gray-50">
// //                       <tr>
// //                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
// //                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mean</th>
// //                       </tr>
// //                     </thead>
// //                     <tbody className="divide-y divide-gray-200">
// //                       {forecastData?.forecast_S?.map((item, index) => (
// //                         <tr key={index} className="hover:bg-gray-50">
// //                           <td className="px-4 py-3 text-sm font-medium text-gray-900">
// //                             {getMonthLabel(index).split(' ')[0]}
// //                           </td>
// //                           <td className="px-4 py-3 text-sm text-gray-900">
// //                             {formatNumber(item.mean)}
// //                           </td>
// //                         </tr>
// //                       ))}
// //                     </tbody>
// //                   </table>
// //                 </div>
// //               </div>
// //             </div>

// //             <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
// //               <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
// //                 <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
// //                 </svg>
// //                 Key Insights
// //               </h3>
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
// //                 <div className="flex items-start">
// //                   <span className="text-purple-600 mr-2">•</span>
// //                   <span>Forecasts start from June 2022 and show {months} months ahead</span>
// //                 </div>
// //                 <div className="flex items-start">
// //                   <span className="text-purple-600 mr-2">•</span>
// //                   <span>Red line shows total accidents calculated as (Moderate + Serious)/0.8</span>
// //                 </div>
// //                 <div className="flex items-start">
// //                   <span className="text-purple-600 mr-2">•</span>
// //                   <span>Blue and green lines show individual forecast components</span>
// //                 </div>
// //                 <div className="flex items-start">
// //                   <span className="text-purple-600 mr-2">•</span>
// //                   <span>Use confidence intervals for risk assessment planning</span>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         )}

// //         {!forecastData && !loading && (
// //           <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-200">
// //             <div className="mx-auto h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
// //               <svg className="h-12 w-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
// //               </svg>
// //             </div>
// //             <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Generate Predictions</h3>
// //             <p className="text-gray-600 mb-6">Enter the number of months and click "Generate Forecast" to see accident predictions starting from June 2022.</p>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default PredictionGovernment;


// import { useEffect, useState, useMemo } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import GovernmentNav from '../../navbars/GovernmentNav';
// import axios from 'axios';

// const API = axios.create({
//   baseURL: "http://127.0.0.1:8000/",
// });

// API.interceptors.request.use((config) => {
//   const token = localStorage.getItem("access_token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// const PredictionGovernment = ({ setIsAuthenticated, setRole }) => {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const [months, setMonths] = useState(() => Number(searchParams.get('months')) || 5);
//   const [forecastData, setForecastData] = useState(() => {
//     const cached = localStorage.getItem('forecastData');
//     return cached ? JSON.parse(cached) : null;
//   });
//   const [dailyForecastData, setDailyForecastData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [dailyLoading, setDailyLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [dailyError, setDailyError] = useState('');
//   const [showAlert, setShowAlert] = useState(false);
//   const [showDailyAlert, setShowDailyAlert] = useState(false);

//   useEffect(() => {
//     localStorage.setItem('forecastData', JSON.stringify(forecastData));
//     setSearchParams({ months });
//   }, [forecastData, months, setSearchParams]);

//   const fetchPrediction = async () => {
//     if (months < 1 || months > 6) {
//       setError('Please enter a valid number of months (1-6)');
//       return;
//     }

//     const cacheKey = `forecastData_${months}`;
//     const cachedData = localStorage.getItem(cacheKey);
//     if (cachedData) {
//       setForecastData(JSON.parse(cachedData));
//       setShowAlert(true);
//       setTimeout(() => setShowAlert(false), 5000);
//       return;
//     }

//     setShowAlert(true);
//     setTimeout(() => setShowAlert(false), 5000);

//     setLoading(true);
//     setError('');

//     try {
//       const response = await API.post('/predictions/forecast', {
//         months: parseInt(months)
//       });
//       setForecastData(response.data);
//       localStorage.setItem(cacheKey, JSON.stringify(response.data));
//     } catch (err) {
//       setError(err.response?.data?.detail || 'Failed to fetch prediction data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchDailyForecast = async () => {
//     setDailyLoading(true);
//     setDailyError('');

//     try {
//       const response = await API.post('/predictions/daily-forecast', {
//         days: 7
//       });
//       // Round values to one decimal place
//       const roundedData = Object.fromEntries(
//         Object.entries(response.data).map(([date, value]) => [date, Number(value.toFixed(1))])
//       );
//       setDailyForecastData(roundedData);
//       localStorage.setItem('dailyForecastData', JSON.stringify(roundedData));
//       setShowDailyAlert(true);
//       setTimeout(() => setShowDailyAlert(false), 5000);
//     } catch (err) {
//       setDailyError(err.response?.data?.detail || 'Failed to fetch daily forecast data');
//     } finally {
//       setDailyLoading(false);
//     }
//   };

//   const formatNumber = (num) => {
//     return new Intl.NumberFormat('en-US', {
//       minimumFractionDigits: 1,
//       maximumFractionDigits: 1
//     }).format(num);
//   };

//   const getMonthLabel = (index) => {
//     const monthNames = [
//       'January', 'February', 'March', 'April', 'May', 'June',
//       'July', 'August', 'September', 'October', 'November', 'December'
//     ];
//     const currentDate = new Date(2022, 5);
//     const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + index);
//     return `${monthNames[targetDate.getMonth()]} ${targetDate.getYear()}`;
//   };

//   const prepareChartData = useMemo(() => {
//     if (!forecastData) return [];

//     const chartData = [];
//     const forecastM = forecastData.forecast_M || [];
//     const forecastS = forecastData.forecast_S || [];

//     for (let i = 0; i < Math.max(forecastM.length, forecastS.length); i++) {
//       const mMean = forecastM[i]?.mean || 0;
//       const sMean = forecastS[i]?.mean || 0;
//       const totalAccidents = (mMean + sMean) / 0.8;

//       chartData.push({
//         month: getMonthLabel(i),
//         monthShort: getMonthLabel(i).split(' ')[0].substring(0, 3),
//         forecast_M: Number(mMean.toFixed(1)),
//         forecast_S: Number(sMean.toFixed(1)),
//         total_accidents: Number(totalAccidents.toFixed(1))
//       });
//     }

//     return chartData;
//   }, [forecastData]);

//   const getConfidenceLevel = (mean, lower, upper) => {
//     const range = upper - lower;
//     const relativeRange = range / Math.abs(mean);

//     if (relativeRange < 0.5) return { level: 'High', color: 'text-green-600', bg: 'bg-green-50' };
//     if (relativeRange < 1) return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-50' };
//     return { level: 'Low', color: 'text-red-600', bg: 'bg-red-50' };
//   };

//   const calculateSummaryStats = useMemo(() => {
//     if (!forecastData) return { avgM: 0, avgS: 0, avgTotal: 0, maxTotal: 0, minTotal: 0 };

//     const forecastM = forecastData.forecast_M || [];
//     const forecastS = forecastData.forecast_S || [];

//     const avgM = forecastM.reduce((sum, item) => sum + item.mean, 0) / (forecastM.length || 1);
//     const avgS = forecastS.reduce((sum, item) => sum + item.mean, 0) / (forecastS.length || 1);
//     const avgTotal = (avgM + avgS) / 0.8;

//     const totalAccidents = forecastM.map((item, i) => {
//       const sMean = forecastS[i]?.mean || 0;
//       return (item.mean + sMean) / 0.8;
//     });

//     const maxTotal = totalAccidents.length ? Math.max(...totalAccidents) : 0;
//     const minTotal = totalAccidents.length ? Math.min(...totalAccidents) : 0;

//     return { avgM, avgS, avgTotal, maxTotal, minTotal };
//   }, [forecastData]);

//   const stats = calculateSummaryStats;

//   // Prepare daily chart data
//   const prepareDailyChartData = useMemo(() => {
//     if (!dailyForecastData) return [];

//     const sortedDates = Object.keys(dailyForecastData).sort();
//     return sortedDates.map((date, index) => ({
//       day: new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
//       accidents: dailyForecastData[date]
//     }));
//   }, [dailyForecastData]);

//   // Calculate daily insights
//   const calculateDailyInsights = useMemo(() => {
//     if (!dailyForecastData) return {
//       avgDaily: 0,
//       maxDaily: 0,
//       minDaily: 0,
//       totalWeekly: 0,
//       trend: 'stable',
//       highRiskDays: []
//     };

//     const values = Object.values(dailyForecastData).map(v => Number(v.toFixed(1)));
//     const sortedDates = Object.keys(dailyForecastData).sort();
//     const recentValues = values; // All 7 days
//     const avgDaily = recentValues.reduce((sum, v) => sum + v, 0) / recentValues.length;
//     const maxDaily = Math.max(...recentValues);
//     const minDaily = Math.min(...recentValues);
//     const totalWeekly = recentValues.reduce((sum, v) => sum + v, 0);

//     // Simple trend: compare first and last of the week
//     const trend = recentValues[0] < recentValues[recentValues.length - 1] ? 'increasing' : recentValues[0] > recentValues[recentValues.length - 1] ? 'decreasing' : 'stable';

//     const highRiskDays = sortedDates.filter((date, idx) => recentValues[idx] > avgDaily * 1.2).map(date => new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }));

//     return { avgDaily: Number(avgDaily.toFixed(1)), maxDaily: Number(maxDaily.toFixed(1)), minDaily: Number(minDaily.toFixed(1)), totalWeekly: Number(totalWeekly.toFixed(1)), trend, highRiskDays };
//   }, [dailyForecastData]);

//   const dailyInsights = calculateDailyInsights;

//   // Load cached daily data on mount
//   useEffect(() => {
//     const cachedDaily = localStorage.getItem('dailyForecastData');
//     if (cachedDaily) {
//       setDailyForecastData(JSON.parse(cachedDaily));
//     }
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//       <GovernmentNav setIsAuthenticated={setIsAuthenticated} setRole={setRole} />
      
//       <div className="container mx-auto p-6 max-w-7xl">
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-gray-900 mb-2">
//             🔮 Accident Prediction Forecast
//           </h1>
//           <p className="text-gray-600 text-lg">
//             Generate statistical forecasts for accident trends from June 2022 onwards
//           </p>
//         </div>

//         {showAlert && (
//           <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-lg animate-pulse">
//             <div className="flex items-center">
//               <svg className="w-6 h-6 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <div>
//                 <p className="text-blue-800 font-semibold">Forecast Alert</p>
//                 <p className="text-blue-700 text-sm">This accident forecast shows monthly predictions starting from June 2022. The data represents statistical projections based on historical patterns.</p>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
//           <div className="flex flex-col md:flex-row items-center justify-center gap-4">
//             <div className="flex flex-col">
//               <label className="text-sm font-medium text-gray-700 mb-2">
//                 Forecast Period (Months)
//               </label>
//               <input
//                 type="number"
//                 min="1"
//                 max="6"
//                 value={months}
//                 onChange={(e) => setMonths(Number(e.target.value))}
//                 className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-40"
//                 placeholder="Enter months"
//               />
//             </div>
            
//             <button
//               onClick={fetchPrediction}
//               disabled={loading}
//               className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 mt-6 md:mt-0"
//             >
//               {loading ? (
//                 <div className="flex items-center">
//                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Generating...
//                 </div>
//               ) : (
//                 <div className="flex items-center">
//                   <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//                   </svg>
//                   Generate Forecast
//                 </div>
//               )}
//             </button>
//           </div>
//         </div>

//         {error && (
//           <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
//             <div className="flex items-center">
//               <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <span className="text-red-800 font-medium">{error}</span>
//             </div>
//           </div>
//         )}

//         {forecastData && (
//           <div className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//               <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
//                 <h3 className="text-sm font-medium opacity-80 mb-2">Avg Monthly (M)</h3>
//                 <p className="text-3xl font-bold">{formatNumber(stats.avgM)}</p>
//                 <p className="text-sm opacity-80">Recorded Moderate Severity Accidents per month</p>
//               </div>
              
//               <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
//                 <h3 className="text-sm font-medium opacity-80 mb-2">Avg Monthly (S)</h3>
//                 <p className="text-3xl font-bold">{formatNumber(stats.avgS)}</p>
//                 <p className="text-sm opacity-80">Recorded Serious Severity Accidents per month</p>
//               </div>
              
//               <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
//                 <h3 className="text-sm font-medium opacity-80 mb-2">Avg Total Accidents</h3>
//                 <p className="text-3xl font-bold">{formatNumber(stats.avgTotal)}</p>
//                 <p className="text-sm opacity-80">all accidents not only recorded per month</p>
//               </div>
              
//               <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white">
//                 <h3 className="text-sm font-medium opacity-80 mb-2">Peak Month</h3>
//                 <p className="text-3xl font-bold">{formatNumber(stats.maxTotal)}</p>
//                 <p className="text-sm opacity-80">maximum expected all happens,not only recorded.</p>
//               </div>
//             </div>

//             <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
//               <div className="mb-6">
//                 <h2 className="text-xl font-semibold text-gray-800 mb-2">Accident Forecast Trends</h2>
//                 <p className="text-sm text-gray-600">Monthly accident predictions from June 2022 onwards</p>
//               </div>
              
//               <div className="h-96">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={prepareChartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                     <XAxis 
//                       dataKey="monthShort" 
//                       stroke="#666"
//                       fontSize={12}
//                     />
//                     <YAxis 
//                       stroke="#666"
//                       fontSize={12}
//                     />
//                     <Tooltip 
//                       contentStyle={{
//                         backgroundColor: '#fff',
//                         border: '1px solid #ccc',
//                         borderRadius: '8px',
//                         boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
//                       }}
//                       formatter={(value, name) => [
//                         formatNumber(value),
//                         name === 'forecast_M' ? 'Forecast M' :
//                         name === 'forecast_S' ? 'Forecast S' : 'Total Accidents'
//                       ]}
//                       labelFormatter={(label) => {
//                         const dataPoint = prepareChartData.find(d => d.monthShort === label);
//                         return dataPoint ? dataPoint.month : label;
//                       }}
//                     />
//                     <Legend />
//                     <Line 
//                       type="monotone" 
//                       dataKey="forecast_M" 
//                       stroke="#3b82f6" 
//                       strokeWidth={2}
//                       dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
//                       name="Forecast Moderately Recorded Accidents"
//                     />
//                     <Line 
//                       type="monotone" 
//                       dataKey="forecast_S" 
//                       stroke="#10b981" 
//                       strokeWidth={2}
//                       dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
//                       name="Forecast Seriously Recorded Accidents"
//                     />
//                     <Line 
//                       type="monotone" 
//                       dataKey="total_accidents" 
//                       stroke="#ef4444" 
//                       strokeWidth={3}
//                       dot={{ fill: '#ef4444', strokeWidth: 2, r: 5 }}
//                       name="All Accidents Not Only Recorded"
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
//                 <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
//                   <h3 className="text-lg font-semibold text-gray-800">Forecast Moderate Recorded Accident Details</h3>
//                 </div>
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mean</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200">
//                       {forecastData?.forecast_M?.map((item, index) => (
//                         <tr key={index} className="hover:bg-gray-50">
//                           <td className="px-4 py-3 text-sm font-medium text-gray-900">
//                             {getMonthLabel(index).split(' ')[0]}
//                           </td>
//                           <td className="px-4 py-3 text-sm text-gray-900">
//                             {formatNumber(item.mean)}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>

//               <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
//                 <div className="bg-green-50 px-6 py-4 border-b border-gray-200">
//                   <h3 className="text-lg font-semibold text-gray-800">Forecast Serious Recorded Accident Details</h3>
//                 </div>
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mean</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200">
//                       {forecastData?.forecast_S?.map((item, index) => (
//                         <tr key={index} className="hover:bg-gray-50">
//                           <td className="px-4 py-3 text-sm font-medium text-gray-900">
//                             {getMonthLabel(index).split(' ')[0]}
//                           </td>
//                           <td className="px-4 py-3 text-sm text-gray-900">
//                             {formatNumber(item.mean)}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//                 <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//                 Key Insights
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
//                 <div className="flex items-start">
//                   <span className="text-purple-600 mr-2">•</span>
//                   <span>Forecasts start from June 2022 and show {months} months ahead</span>
//                 </div>
//                 <div className="flex items-start">
//                   <span className="text-purple-600 mr-2">•</span>
//                   <span>Red line shows total accidents calculated as (Moderate + Serious)/0.8</span>
//                 </div>
//                 <div className="flex items-start">
//                   <span className="text-purple-600 mr-2">•</span>
//                   <span>Blue and green lines show individual forecast components</span>
//                 </div>
//                 <div className="flex items-start">
//                   <span className="text-purple-600 mr-2">•</span>
//                   <span>Use confidence intervals for risk assessment planning</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {!forecastData && !loading && (
//           <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-200">
//             <div className="mx-auto h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
//               <svg className="h-12 w-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//               </svg>
//             </div>
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Generate Predictions</h3>
//             <p className="text-gray-600 mb-6">Enter the number of months and click "Generate Forecast" to see accident predictions starting from June 2022.</p>
//           </div>
//         )}

//         {/* New Daily Forecast Section */}
//         <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
//           <div className="flex flex-col md:flex-row items-center justify-center gap-4">
//             <h3 className="text-lg font-semibold text-gray-800">Next Week Daily Accident Forecast</h3>
//             <button
//               onClick={fetchDailyForecast}
//               disabled={dailyLoading}
//               className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
//             >
//               {dailyLoading ? (
//                 <div className="flex items-center">
//                   <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Loading...
//                 </div>
//               ) : (
//                 'Generate Daily Forecast'
//               )}
//             </button>
//           </div>
//         </div>

//         {dailyError && (
//           <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
//             <div className="flex items-center">
//               <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <span className="text-red-800 font-medium">{dailyError}</span>
//             </div>
//           </div>
//         )}

//         {showDailyAlert && (
//           <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 mb-6 rounded-lg animate-pulse">
//             <div className="flex items-center">
//               <svg className="w-6 h-6 text-indigo-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <div>
//                 <p className="text-indigo-800 font-semibold">Daily Forecast Alert</p>
//                 <p className="text-indigo-700 text-sm">This shows projected daily accidents for the next week, rounded to one decimal place based on the model's statistical series.</p>
//               </div>
//             </div>
//           </div>
//         )}

//         {dailyForecastData && (
//           <div className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//               <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-6 text-white">
//                 <h3 className="text-sm font-medium opacity-80 mb-2">Avg Daily Accidents</h3>
//                 <p className="text-3xl font-bold">{formatNumber(dailyInsights.avgDaily)}</p>
//                 <p className="text-sm opacity-80">Average expected per day next week</p>
//               </div>
              
//               <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
//                 <h3 className="text-sm font-medium opacity-80 mb-2">Total Weekly</h3>
//                 <p className="text-3xl font-bold">{formatNumber(dailyInsights.totalWeekly)}</p>
//                 <p className="text-sm opacity-80">Sum of forecasted accidents</p>
//               </div>
              
//               <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
//                 <h3 className="text-sm font-medium opacity-80 mb-2">Trend</h3>
//                 <p className={`text-3xl font-bold ${dailyInsights.trend === 'increasing' ? 'text-green-300' : dailyInsights.trend === 'decreasing' ? 'text-red-300' : 'text-yellow-300'}`}>
//                   {dailyInsights.trend.charAt(0).toUpperCase() + dailyInsights.trend.slice(1)}
//                 </p>
//                 <p className="text-sm opacity-80">Overall direction next week</p>
//               </div>
//             </div>

//             <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
//               <div className="mb-6">
//                 <h2 className="text-xl font-semibold text-gray-800 mb-2">Next Week Daily Accident Trends</h2>
//                 <p className="text-sm text-gray-600">Projected daily accidents for the upcoming 7 days</p>
//               </div>
              
//               <div className="h-80">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={prepareDailyChartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                     <XAxis 
//                       dataKey="day" 
//                       stroke="#666"
//                       fontSize={11}
//                     />
//                     <YAxis 
//                       stroke="#666"
//                       fontSize={11}
//                     />
//                     <Tooltip 
//                       contentStyle={{
//                         backgroundColor: '#fff',
//                         border: '1px solid #ccc',
//                         borderRadius: '8px',
//                         boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
//                       }}
//                       formatter={(value) => [formatNumber(value), 'Forecasted Accidents']}
//                     />
//                     <Legend />
//                     <Line 
//                       type="monotone" 
//                       dataKey="accidents" 
//                       stroke="#8b5cf6" 
//                       strokeWidth={3}
//                       dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 5 }}
//                       name="Daily Forecasted Accidents"
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>

//             <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//                 <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//                 Daily Insights from Model
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
//                 <div className="flex items-start">
//                   <span className="text-indigo-600 mr-2">•</span>
//                   <span>The model projects an average of {formatNumber(dailyInsights.avgDaily)} accidents per day next week, based on time series patterns.</span>
//                 </div>
//                 <div className="flex items-start">
//                   <span className="text-indigo-600 mr-2">•</span>
//                   <span>Total expected accidents: {formatNumber(dailyInsights.totalWeekly)}, indicating {dailyInsights.trend} trend which may require adjusted patrols.</span>
//                 </div>
//                 <div className="flex items-start">
//                   <span className="text-indigo-600 mr-2">•</span>
//                   <span>Peak day forecast: {formatNumber(dailyInsights.maxDaily)} accidents – prepare resources for high-risk periods.</span>
//                 </div>
//                 {dailyInsights.highRiskDays.length > 0 && (
//                   <div className="flex items-start">
//                     <span className="text-indigo-600 mr-2">•</span>
//                     <span>High-risk days (above 20% avg): {dailyInsights.highRiskDays.join(', ')} – prioritize monitoring and interventions.</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {!dailyForecastData && !dailyLoading && (
//           <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-200">
//             <div className="mx-auto h-24 w-24 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
//               <svg className="h-12 w-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready for Daily Predictions</h3>
//             <p className="text-gray-600 mb-6">Click "Generate Daily Forecast" to view projected accidents for the next 7 days.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PredictionGovernment;



import { useEffect, useState, useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, PieChart, Pie, Cell, ComposedChart } from 'recharts';
import { Calendar, TrendingUp, TrendingDown, AlertTriangle, Clock, Filter, Activity, BarChart3 } from 'lucide-react';
import axios from 'axios';
import GovernmentNav from '../../navbars/GovernmentNav';


const API = axios.create({
  baseURL: "http://127.0.0.1:8000/",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const TemporalAccidentDashboard = ({ setIsAuthenticated, setRole }) => {
  const [historicalData, setHistoricalData] = useState(null);
  const [timeRange, setTimeRange] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [viewMode, setViewMode] = useState('monthly');
  const [predictionMonths, setPredictionMonths] = useState(6);
  const [predictedMonthlyData, setPredictedMonthlyData] = useState(null);
  const [predictedDailyData, setPredictedDailyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [dailyPredictionLoading, setDailyPredictionLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch historical data
  useEffect(() => {
    const fetchHistoricalData = async () => {
      setLoading(true);
      try {
        const response = await API.get('/govDash/trendsAll');
        setHistoricalData(response.data);
      } catch (err) {
        setError('Failed to fetch historical data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistoricalData();
  }, []);

  // Fetch monthly predictions
  const fetchMonthlyPrediction = async () => {
    setPredictionLoading(true);
    try {
      const response = await API.post('/predictions/forecast', {
        months: parseInt(predictionMonths)
      });
      setPredictedMonthlyData(response.data);
    } catch (err) {
      setError('Failed to fetch monthly predictions');
      console.error(err);
    } finally {
      setPredictionLoading(false);
    }
  };

  // Fetch daily predictions
  const fetchDailyPrediction = async () => {
    setDailyPredictionLoading(true);
    try {
      const response = await API.post('/predictions/daily-forecast', {
        days: 7
      });
      setPredictedDailyData(response.data);
    } catch (err) {
      setError('Failed to fetch daily predictions');
      console.error(err);
    } finally {
      setDailyPredictionLoading(false);
    }
  };

  // Process historical monthly data
  const processedMonthlyData = useMemo(() => {
    if (!historicalData?.monthly_counts) return [];
    
    const entries = Object.entries(historicalData.monthly_counts)
      .sort(([a], [b]) => a.localeCompare(b));
    
    return entries.map(([date, data]) => {
      const [year, month] = date.split('-');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return {
        date,
        year,
        month: monthNames[parseInt(month) - 1],
        label: `${monthNames[parseInt(month) - 1]} ${year}`,
        total: data.total,
        serious: data.serious,
        moderate: data.total - data.serious,
        seriousRate: data.total > 0 ? ((data.serious / data.total) * 100).toFixed(1) : 0,
        type: 'historical'
      };
    });
  }, [historicalData]);

  // Process predicted monthly data
  const processedPredictedMonthly = useMemo(() => {
    if (!predictedMonthlyData) return [];
    
    const forecastM = predictedMonthlyData.forecast_M || [];
    const forecastS = predictedMonthlyData.forecast_S || [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Start from June 2022
    const startDate = new Date(2022, 5);
    
    return forecastM.map((mData, index) => {
      const targetDate = new Date(startDate.getFullYear(), startDate.getMonth() + index);
      const year = targetDate.getFullYear();
      const month = targetDate.getMonth();
      
      const moderate = mData.mean || 0;
      const serious = forecastS[index]?.mean || 0;
      const total = (moderate + serious) / 0.8;
      
      return {
        date: `${year}-${String(month + 1).padStart(2, '0')}`,
        year: String(year),
        month: monthNames[month],
        label: `${monthNames[month]} ${year}`,
        total: Number(total.toFixed(1)),
        serious: Number(serious.toFixed(1)),
        moderate: Number(moderate.toFixed(1)),
        seriousRate: total > 0 ? ((serious / total) * 100).toFixed(1) : 0,
        type: 'predicted'
      };
    });
  }, [predictedMonthlyData]);

  // Process predicted daily data
  const processedPredictedDaily = useMemo(() => {
    if (!predictedDailyData) return [];
    
    const sortedDates = Object.keys(predictedDailyData).sort();
    return sortedDates.map((date, index) => ({
      date,
      day: new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      accidents: Number(predictedDailyData[date].toFixed(1)),
      dayOfWeek: new Date(date).toLocaleDateString('en-US', { weekday: 'long' })
    }));
  }, [predictedDailyData]);

  // Combined monthly data (historical + predicted)
  const combinedMonthlyData = useMemo(() => {
    return [...processedMonthlyData, ...processedPredictedMonthly];
  }, [processedMonthlyData, processedPredictedMonthly]);

  // Filter data by selected year and time range
  const filteredMonthlyData = useMemo(() => {
    let data = viewMode === 'historical' ? processedMonthlyData : 
                viewMode === 'predicted' ? processedPredictedMonthly :
                combinedMonthlyData;
    
    if (selectedYear !== 'all') {
      data = data.filter(d => d.year === selectedYear);
    }
    
    if (timeRange !== 'all' && viewMode !== 'predicted') {
      const now = new Date();
      const cutoff = new Date();
      
      switch(timeRange) {
        case '3m':
          cutoff.setMonth(now.getMonth() - 3);
          break;
        case '6m':
          cutoff.setMonth(now.getMonth() - 6);
          break;
        case '1y':
          cutoff.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      data = data.filter(d => new Date(d.date) >= cutoff);
    }
    
    return data;
  }, [processedMonthlyData, processedPredictedMonthly, combinedMonthlyData, selectedYear, timeRange, viewMode]);

  // Process yearly data
  const processedYearlyData = useMemo(() => {
    if (!historicalData?.yearly_counts) return [];
    
    return Object.entries(historicalData.yearly_counts).map(([year, data]) => ({
      year,
      total: data.total,
      serious: data.serious,
      moderate: data.total - data.serious,
      seriousRate: ((data.serious / data.total) * 100).toFixed(1)
    })).sort((a, b) => a.year.localeCompare(b.year));
  }, [historicalData]);

  // Process day of week data
  const processedDayOfWeekData = useMemo(() => {
    if (!historicalData?.day_of_week_counts) return [];
    
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return dayOrder.map(day => {
      const data = historicalData.day_of_week_counts[day];
      return {
        day: day.substring(0, 3),
        fullDay: day,
        total: data.total,
        serious: data.serious,
        moderate: data.total - data.serious,
        seriousRate: ((data.serious / data.total) * 100).toFixed(1)
      };
    });
  }, [historicalData]);

  // Calculate statistics
  const statistics = useMemo(() => {
    if (!historicalData) return null;
    
    const totalAccidents = Object.values(historicalData.monthly_counts).reduce((sum, d) => sum + d.total, 0);
    const totalSerious = Object.values(historicalData.monthly_counts).reduce((sum, d) => sum + d.serious, 0);
    const avgMonthly = totalAccidents / Object.keys(historicalData.monthly_counts).length;
    const seriousRate = (totalSerious / totalAccidents * 100).toFixed(1);
    
    const monthlyTotals = Object.values(historicalData.monthly_counts).map(d => d.total);
    const peakMonth = Math.max(...monthlyTotals);
    const lowestMonth = Math.min(...monthlyTotals);
    
    const dayTotals = Object.values(historicalData.day_of_week_counts).map(d => d.total);
    const peakDay = Object.keys(historicalData.day_of_week_counts).find(
      day => historicalData.day_of_week_counts[day].total === Math.max(...dayTotals)
    );
    
    return {
      totalAccidents,
      totalSerious,
      avgMonthly: avgMonthly.toFixed(1),
      seriousRate,
      peakMonth,
      lowestMonth,
      peakDay
    };
  }, [historicalData]);

  // Predicted statistics
  const predictedStatistics = useMemo(() => {
    if (!processedPredictedMonthly.length) return null;
    
    const avgTotal = processedPredictedMonthly.reduce((sum, d) => sum + d.total, 0) / processedPredictedMonthly.length;
    const avgSerious = processedPredictedMonthly.reduce((sum, d) => sum + d.serious, 0) / processedPredictedMonthly.length;
    const peakMonth = Math.max(...processedPredictedMonthly.map(d => d.total));
    const lowestMonth = Math.min(...processedPredictedMonthly.map(d => d.total));
    
    return {
      avgTotal: avgTotal.toFixed(1),
      avgSerious: avgSerious.toFixed(1),
      peakMonth: peakMonth.toFixed(1),
      lowestMonth: lowestMonth.toFixed(1)
    };
  }, [processedPredictedMonthly]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation placeholder - don't change */}
      <GovernmentNav setIsAuthenticated={setIsAuthenticated} setRole={setRole} />
      <div className="bg-white shadow-sm border-b">
        {/* <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Government Dashboard</h1>
        </div> */}
      </div>

      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center">
            <Activity className="mr-3 text-blue-600" size={36} />
            Temporal Accident Trends Dashboard
          </h1>
          <p className="text-gray-600 text-lg">Comprehensive analysis of historical data and future predictions</p>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* View Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="inline mr-1" size={16} />
                View Mode
              </label>
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="monthly">Monthly View</option>
                <option value="yearly">Yearly View</option>
                <option value="weekly">Day of Week</option>
                <option value="historical">Historical Only</option>
                <option value="predicted">Predicted Only</option>
                <option value="combined">Historical + Predicted</option>
              </select>
            </div>

            {/* Time Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline mr-1" size={16} />
                Time Range
              </label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={viewMode === 'predicted'}
              >
                <option value="all">All Time</option>
                <option value="3m">Last 3 Months</option>
                <option value="6m">Last 6 Months</option>
                <option value="1y">Last Year</option>
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline mr-1" size={16} />
                Year Filter
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Years</option>
                {processedYearlyData.map(d => (
                  <option key={d.year} value={d.year}>{d.year}</option>
                ))}
              </select>
            </div>

            {/* Prediction Months */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <TrendingUp className="inline mr-1" size={16} />
                Predict Months
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={predictionMonths}
                  onChange={(e) => setPredictionMonths(Number(e.target.value))}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={fetchMonthlyPrediction}
                  disabled={predictionLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
                >
                  {predictionLoading ? '...' : 'Get'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Statistics Cards */}
        {statistics && viewMode !== 'predicted' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium opacity-90">Total Accidents</h3>
                <AlertTriangle size={20} />
              </div>
              <p className="text-3xl font-bold">{statistics.totalAccidents.toLocaleString()}</p>
              <p className="text-xs opacity-80 mt-1">Historical records</p>
            </div>

            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium opacity-90">Serious Rate</h3>
                <TrendingUp size={20} />
              </div>
              <p className="text-3xl font-bold">{statistics.seriousRate}%</p>
              <p className="text-xs opacity-80 mt-1">{statistics.totalSerious} serious cases</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium opacity-90">Avg Monthly</h3>
                <BarChart3 size={20} />
              </div>
              <p className="text-3xl font-bold">{statistics.avgMonthly}</p>
              <p className="text-xs opacity-80 mt-1">accidents per month</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium opacity-90">Peak Day</h3>
                <Calendar size={20} />
              </div>
              <p className="text-2xl font-bold">{statistics.peakDay}</p>
              <p className="text-xs opacity-80 mt-1">highest accident day</p>
            </div>
          </div>
        )}

        {/* Predicted Statistics */}
        {predictedStatistics && (viewMode === 'predicted' || viewMode === 'combined') && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-6 border-2 border-indigo-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <TrendingUp className="mr-2 text-indigo-600" />
              Predicted Statistics (Next {predictionMonths} Months)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Avg Total/Month</p>
                <p className="text-2xl font-bold text-indigo-600">{predictedStatistics.avgTotal}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Serious/Month</p>
                <p className="text-2xl font-bold text-red-600">{predictedStatistics.avgSerious}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Peak Month</p>
                <p className="text-2xl font-bold text-orange-600">{predictedStatistics.peakMonth}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Lowest Month</p>
                <p className="text-2xl font-bold text-green-600">{predictedStatistics.lowestMonth}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Chart - Monthly Trends */}
        {viewMode === 'monthly' || viewMode === 'historical' || viewMode === 'predicted' || viewMode === 'combined' ? (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                {viewMode === 'historical' ? 'Historical' : viewMode === 'predicted' ? 'Predicted' : 'Combined'} Monthly Accident Trends
              </h2>
              <p className="text-sm text-gray-600">
                {viewMode === 'predicted' ? 'Statistical forecasts from June 2022' : 'Total, Serious, and Moderate accidents over time'}
              </p>
            </div>
            
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={filteredMonthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="label" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    stroke="#666"
                    fontSize={11}
                  />
                  <YAxis stroke="#666" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value, name) => {
                      if (name === 'type') return null;
                      return [Number(value).toFixed(1), name];
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  
                  {viewMode === 'combined' && (
                    <>
                      <Area 
                        type="monotone" 
                        dataKey="total" 
                        fill="url(#colorTotal)" 
                        stroke="#3b82f6"
                        strokeWidth={2}
                        name="Total Accidents"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="serious" 
                        stroke="#ef4444" 
                        strokeWidth={2}
                        dot={{ fill: '#ef4444', r: 3 }}
                        name="Serious"
                      />
                    </>
                  )}
                  
                  {(viewMode === 'historical' || viewMode === 'monthly') && (
                    <>
                      <Bar dataKey="moderate" fill="#10b981" name="Moderate" />
                      <Bar dataKey="serious" fill="#ef4444" name="Serious" />
                      <Line 
                        type="monotone" 
                        dataKey="total" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', r: 4 }}
                        name="Total"
                      />
                    </>
                  )}
                  
                  {viewMode === 'predicted' && (
                    <>
                      <Line 
                        type="monotone" 
                        dataKey="moderate" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ fill: '#10b981', r: 4 }}
                        name="Predicted Moderate"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="serious" 
                        stroke="#ef4444" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ fill: '#ef4444', r: 4 }}
                        name="Predicted Serious"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="total" 
                        stroke="#8b5cf6" 
                        strokeWidth={3}
                        dot={{ fill: '#8b5cf6', r: 5 }}
                        name="Predicted Total"
                      />
                    </>
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : null}

        {/* Yearly View */}
        {viewMode === 'yearly' && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-1">Yearly Accident Comparison</h2>
              <p className="text-sm text-gray-600">Total accidents by year with severity breakdown</p>
            </div>
            
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={processedYearlyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="year" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #ccc',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="moderate" stackId="a" fill="#10b981" name="Moderate" />
                  <Bar dataKey="serious" stackId="a" fill="#ef4444" name="Serious" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Yearly Stats Table */}
            <div className="mt-6 overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serious</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Moderate</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serious Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {processedYearlyData.map((item) => (
                    <tr key={item.year} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.year}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.total.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-red-600 font-medium">{item.serious.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-green-600 font-medium">{item.moderate.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.seriousRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Day of Week View */}
        {viewMode === 'weekly' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-1">Accidents by Day of Week</h2>
                <p className="text-sm text-gray-600">Weekly pattern analysis</p>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={processedDayOfWeekData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '8px'
                      }}
                      labelFormatter={(label) => {
                        const item = processedDayOfWeekData.find(d => d.day === label);
                        return item?.fullDay || label;
                      }}
                    />
                    <Legend />
                    <Bar dataKey="moderate" fill="#10b981" name="Moderate" />
                    <Bar dataKey="serious" fill="#ef4444" name="Serious" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-1">Day Distribution</h2>
                <p className="text-sm text-gray-600">Proportion of total accidents</p>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={processedDayOfWeekData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ day, percent }) => `${day} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="total"
                    >
                      {processedDayOfWeekData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Weekly Stats Table */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Day of Week Statistics</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Day</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serious</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Moderate</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serious Rate</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {processedDayOfWeekData.map((item) => {
                      const riskLevel = item.total > 950 ? 'High' : item.total > 850 ? 'Medium' : 'Low';
                      const riskColor = riskLevel === 'High' ? 'text-red-600 bg-red-50' : 
                                       riskLevel === 'Medium' ? 'text-yellow-600 bg-yellow-50' : 
                                       'text-green-600 bg-green-50';
                      return (
                        <tr key={item.fullDay} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.fullDay}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.total.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm text-red-600 font-medium">{item.serious.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm text-green-600 font-medium">{item.moderate.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.seriousRate}%</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${riskColor}`}>
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
        )}

        {/* Daily Predictions Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-1">Daily Accident Forecast</h2>
              <p className="text-sm text-gray-600">Next 7 days prediction</p>
            </div>
            <button
              onClick={fetchDailyPrediction}
              disabled={dailyPredictionLoading}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 transition-all"
            >
              {dailyPredictionLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </div>
              ) : (
                'Generate Daily Forecast'
              )}
            </button>
          </div>

          {processedPredictedDaily.length > 0 ? (
            <>
              <div className="h-80 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={processedPredictedDaily} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <defs>
                      <linearGradient id="colorDaily" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="day" 
                      stroke="#666"
                      fontSize={11}
                    />
                    <YAxis stroke="#666" fontSize={12} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '8px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="accidents" 
                      stroke="#8b5cf6" 
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorDaily)"
                      name="Predicted Accidents"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {processedPredictedDaily.map((item, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-200">
                    <p className="text-xs text-gray-600 mb-1">{item.dayOfWeek}</p>
                    <p className="text-sm font-medium text-gray-700 mb-2">{item.day}</p>
                    <p className="text-2xl font-bold text-purple-600">{item.accidents}</p>
                    <p className="text-xs text-gray-500 mt-1">accidents</p>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-200">
                <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                  <AlertTriangle className="mr-2 text-purple-600" size={16} />
                  Weekly Insights
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                  <div>• Total weekly forecast: <span className="font-semibold text-purple-600">
                    {processedPredictedDaily.reduce((sum, d) => sum + d.accidents, 0).toFixed(1)}
                  </span> accidents</div>
                  <div>• Average daily: <span className="font-semibold text-purple-600">
                    {(processedPredictedDaily.reduce((sum, d) => sum + d.accidents, 0) / processedPredictedDaily.length).toFixed(1)}
                  </span> accidents</div>
                  <div>• Peak day: <span className="font-semibold text-orange-600">
                    {Math.max(...processedPredictedDaily.map(d => d.accidents)).toFixed(1)}
                  </span> accidents</div>
                  <div>• Lowest day: <span className="font-semibold text-green-600">
                    {Math.min(...processedPredictedDaily.map(d => d.accidents)).toFixed(1)}
                  </span> accidents</div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Clock className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-600">Click "Generate Daily Forecast" to view predictions for the next 7 days</p>
            </div>
          )}
        </div>

        {/* Severity Rate Trend */}
        {(viewMode === 'monthly' || viewMode === 'historical') && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-1">Severity Rate Trend</h2>
              <p className="text-sm text-gray-600">Percentage of serious accidents over time</p>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredMonthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="label" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    stroke="#666"
                    fontSize={11}
                  />
                  <YAxis 
                    stroke="#666" 
                    fontSize={12}
                    label={{ value: 'Serious Rate (%)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #ccc',
                      borderRadius: '8px'
                    }}
                    formatter={(value) => [`${value}%`, 'Serious Rate']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="seriousRate" 
                    stroke="#ef4444" 
                    strokeWidth={3}
                    dot={{ fill: '#ef4444', r: 4 }}
                    name="Serious Rate (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Data Table - Historical */}
        {viewMode === 'historical' && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Historical Monthly Data</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serious</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Moderate</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serious Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredMonthlyData.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.label}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.total}</td>
                      <td className="px-4 py-3 text-sm text-red-600 font-medium">{item.serious}</td>
                      <td className="px-4 py-3 text-sm text-green-600 font-medium">{item.moderate}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.seriousRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Data Table - Predicted */}
        {viewMode === 'predicted' && processedPredictedMonthly.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Predicted Monthly Data</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-indigo-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serious</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Moderate</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serious Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {processedPredictedMonthly.map((item, idx) => (
                    <tr key={idx} className="hover:bg-indigo-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.label}</td>
                      <td className="px-4 py-3 text-sm text-purple-600 font-medium">{item.total}</td>
                      <td className="px-4 py-3 text-sm text-red-600 font-medium">{item.serious}</td>
                      <td className="px-4 py-3 text-sm text-green-600 font-medium">{item.moderate}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.seriousRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Key Insights */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <TrendingUp className="mr-2 text-blue-600" />
            Key Insights & Trends
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="flex items-start">
              <span className="text-blue-600 mr-2 mt-1">•</span>
              <span>
                <strong>Monthly Pattern:</strong> Historical data shows {statistics?.peakMonth} accidents at peak, 
                with an average of {statistics?.avgMonthly} per month.
              </span>
            </div>
            <div className="flex items-start">
              <span className="text-blue-600 mr-2 mt-1">•</span>
              <span>
                <strong>Weekly Trend:</strong> {statistics?.peakDay} consistently shows the highest accident rates, 
                suggesting focused intervention opportunities.
              </span>
            </div>
            <div className="flex items-start">
              <span className="text-blue-600 mr-2 mt-1">•</span>
              <span>
                <strong>Severity Analysis:</strong> Overall serious accident rate is {statistics?.seriousRate}%, 
                indicating the proportion requiring immediate response.
              </span>
            </div>
            <div className="flex items-start">
              <span className="text-blue-600 mr-2 mt-1">•</span>
              <span>
                <strong>Prediction Value:</strong> Use forecasts for resource allocation, patrol planning, 
                and preventive measures during high-risk periods.
              </span>
            </div>
          </div>
        </div>
      </div>
     
    </div>
  );
};

export default TemporalAccidentDashboard;