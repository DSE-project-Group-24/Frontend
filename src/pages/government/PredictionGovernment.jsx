import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import GovernmentNav from '../../navbars/GovernmentNav';
import axios from 'axios';

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

const PredictionGovernment = ({ setIsAuthenticated, setRole }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [months, setMonths] = useState(() => Number(searchParams.get('months')) || 5);
  const [forecastData, setForecastData] = useState(() => {
    const cached = localStorage.getItem('forecastData');
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    localStorage.setItem('forecastData', JSON.stringify(forecastData));
    setSearchParams({ months });
  }, [forecastData, months, setSearchParams]);

  const fetchPrediction = async () => {
    if (months < 1 || months > 6) {
      setError('Please enter a valid number of months (1-6)');
      return;
    }

    const cacheKey = `forecastData_${months}`;
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      setForecastData(JSON.parse(cachedData));
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
      return;
    }

    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);

    setLoading(true);
    setError('');

    try {
      const response = await API.post('/predictions/forecast', {
        months: parseInt(months)
      });
      setForecastData(response.data);
      localStorage.setItem(cacheKey, JSON.stringify(response.data));
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch prediction data');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(num);
  };

  const getMonthLabel = (index) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const currentDate = new Date(2022, 5);
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + index);
    return `${monthNames[targetDate.getMonth()]} ${targetDate.getFullYear()}`;
  };

  const prepareChartData = useMemo(() => {
    if (!forecastData) return [];

    const chartData = [];
    const forecastM = forecastData.forecast_M || [];
    const forecastS = forecastData.forecast_S || [];

    for (let i = 0; i < Math.max(forecastM.length, forecastS.length); i++) {
      const mMean = forecastM[i]?.mean || 0;
      const sMean = forecastS[i]?.mean || 0;
      const totalAccidents = (mMean + sMean) / 0.8;

      chartData.push({
        month: getMonthLabel(i),
        monthShort: getMonthLabel(i).split(' ')[0].substring(0, 3),
        forecast_M: Number(mMean.toFixed(1)),
        forecast_S: Number(sMean.toFixed(1)),
        total_accidents: Number(totalAccidents.toFixed(1))
      });
    }

    return chartData;
  }, [forecastData]);

  const getConfidenceLevel = (mean, lower, upper) => {
    const range = upper - lower;
    const relativeRange = range / Math.abs(mean);

    if (relativeRange < 0.5) return { level: 'High', color: 'text-green-600', bg: 'bg-green-50' };
    if (relativeRange < 1) return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { level: 'Low', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const calculateSummaryStats = useMemo(() => {
    if (!forecastData) return { avgM: 0, avgS: 0, avgTotal: 0, maxTotal: 0, minTotal: 0 };

    const forecastM = forecastData.forecast_M || [];
    const forecastS = forecastData.forecast_S || [];

    const avgM = forecastM.reduce((sum, item) => sum + item.mean, 0) / (forecastM.length || 1);
    const avgS = forecastS.reduce((sum, item) => sum + item.mean, 0) / (forecastS.length || 1);
    const avgTotal = (avgM + avgS) / 0.8;

    const totalAccidents = forecastM.map((item, i) => {
      const sMean = forecastS[i]?.mean || 0;
      return (item.mean + sMean) / 0.8;
    });

    const maxTotal = totalAccidents.length ? Math.max(...totalAccidents) : 0;
    const minTotal = totalAccidents.length ? Math.min(...totalAccidents) : 0;

    return { avgM, avgS, avgTotal, maxTotal, minTotal };
  }, [forecastData]);

  const stats = calculateSummaryStats;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <GovernmentNav setIsAuthenticated={setIsAuthenticated} setRole={setRole} />
      
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🔮 Accident Prediction Forecast
          </h1>
          <p className="text-gray-600 text-lg">
            Generate statistical forecasts for accident trends from June 2022 onwards
          </p>
        </div>

        {showAlert && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-lg animate-pulse">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-blue-800 font-semibold">Forecast Alert</p>
                <p className="text-blue-700 text-sm">This accident forecast shows monthly predictions starting from June 2022. The data represents statistical projections based on historical patterns.</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Forecast Period (Months)
              </label>
              <input
                type="number"
                min="1"
                max="6"
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-40"
                placeholder="Enter months"
              />
            </div>
            
            <button
              onClick={fetchPrediction}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 mt-6 md:mt-0"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </div>
              ) : (
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Generate Forecast
                </div>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-800 font-medium">{error}</span>
            </div>
          </div>
        )}

        {forecastData && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                <h3 className="text-sm font-medium opacity-80 mb-2">Avg Monthly (M)</h3>
                <p className="text-3xl font-bold">{formatNumber(stats.avgM)}</p>
                <p className="text-sm opacity-80">Recorded Moderate Severity Accidents per month</p>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                <h3 className="text-sm font-medium opacity-80 mb-2">Avg Monthly (S)</h3>
                <p className="text-3xl font-bold">{formatNumber(stats.avgS)}</p>
                <p className="text-sm opacity-80">Recorded Serious Severity Accidents per month</p>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                <h3 className="text-sm font-medium opacity-80 mb-2">Avg Total Accidents</h3>
                <p className="text-3xl font-bold">{formatNumber(stats.avgTotal)}</p>
                <p className="text-sm opacity-80">all accidents not only recorded per month</p>
              </div>
              
              <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white">
                <h3 className="text-sm font-medium opacity-80 mb-2">Peak Month</h3>
                <p className="text-3xl font-bold">{formatNumber(stats.maxTotal)}</p>
                <p className="text-sm opacity-80">maximum expected all happens,not only recorded.</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Accident Forecast Trends</h2>
                <p className="text-sm text-gray-600">Monthly accident predictions from June 2022 onwards</p>
              </div>
              
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={prepareChartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="monthShort" 
                      stroke="#666"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#666"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value, name) => [
                        formatNumber(value),
                        name === 'forecast_M' ? 'Forecast M' :
                        name === 'forecast_S' ? 'Forecast S' : 'Total Accidents'
                      ]}
                      labelFormatter={(label) => {
                        const dataPoint = prepareChartData.find(d => d.monthShort === label);
                        return dataPoint ? dataPoint.month : label;
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="forecast_M" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      name="Forecast Moderately Recorded Accidents"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="forecast_S" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                      name="Forecast Seriously Recorded Accidents"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="total_accidents" 
                      stroke="#ef4444" 
                      strokeWidth={3}
                      dot={{ fill: '#ef4444', strokeWidth: 2, r: 5 }}
                      name="All Accidents Not Only Recorded"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">Forecast Moderate Recorded Accident Details</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mean</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {forecastData?.forecast_M?.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {getMonthLabel(index).split(' ')[0]}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {formatNumber(item.mean)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                <div className="bg-green-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">Forecast Serious Recorded Accident Details</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mean</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {forecastData?.forecast_S?.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {getMonthLabel(index).split(' ')[0]}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {formatNumber(item.mean)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Key Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>Forecasts start from June 2022 and show {months} months ahead</span>
                </div>
                <div className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>Red line shows total accidents calculated as (Moderate + Serious)/0.8</span>
                </div>
                <div className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>Blue and green lines show individual forecast components</span>
                </div>
                <div className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>Use confidence intervals for risk assessment planning</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {!forecastData && !loading && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-200">
            <div className="mx-auto h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="h-12 w-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Generate Predictions</h3>
            <p className="text-gray-600 mb-6">Enter the number of months and click "Generate Forecast" to see accident predictions starting from June 2022.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionGovernment;