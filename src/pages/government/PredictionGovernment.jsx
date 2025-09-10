import React, { useState } from 'react';
import GovernmentNav from '../../navbars/GovernmentNav';
import axios from 'axios';

const API = axios.create({
  baseURL: "http://127.0.0.1:9000/",
});

// Add JWT token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const PredictionGovernment = ({ setIsAuthenticated, setRole }) => {
  const [months, setMonths] = useState(5);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPrediction = async () => {
    if (months < 1 || months > 24) {
      setError('Please enter a valid number of months (1-24)');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await API.post('/predictions/forecast', {
        months: parseInt(months)
      });
      
      console.log('Forecast data received:', response.data);
      setForecastData(response.data.forecast_data);
    } catch (err) {
      console.error('Error fetching prediction:', err);
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
    const currentMonth = new Date().getMonth();
    const targetMonth = (currentMonth + index + 1) % 12;
    return monthNames[targetMonth];
  };

  const getConfidenceLevel = (mean, lower, upper) => {
    const range = upper - lower;
    const relativeRange = range / Math.abs(mean);
    
    if (relativeRange < 0.5) return { level: 'High', color: 'text-green-600', bg: 'bg-green-50' };
    if (relativeRange < 1) return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { level: 'Low', color: 'text-red-600', bg: 'bg-red-50' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <GovernmentNav setIsAuthenticated={setIsAuthenticated} setRole={setRole} />
      
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🔮 Accident Prediction Forecast
          </h1>
          <p className="text-gray-600 text-lg">
            Generate statistical forecasts for accident trends and planning
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Forecast Period (Months)
              </label>
              <input
                type="number"
                min="1"
                max="24"
                value={months}
                onChange={(e) => setMonths(e.target.value)}
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

        {/* Error Message */}
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

        {/* Results Section */}
        {forecastData && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                <h3 className="text-sm font-medium opacity-80 mb-2">Average Prediction</h3>
                <p className="text-3xl font-bold">
                  {formatNumber(forecastData.reduce((sum, item) => sum + item.mean, 0) / forecastData.length)}
                </p>
                <p className="text-sm opacity-80">incidents/month</p>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                <h3 className="text-sm font-medium opacity-80 mb-2">Best Case Scenario</h3>
                <p className="text-3xl font-bold">
                  {formatNumber(Math.min(...forecastData.map(item => item.mean_ci_lower)))}
                </p>
                <p className="text-sm opacity-80">minimum expected</p>
              </div>
              
              <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white">
                <h3 className="text-sm font-medium opacity-80 mb-2">Worst Case Scenario</h3>
                <p className="text-3xl font-bold">
                  {formatNumber(Math.max(...forecastData.map(item => item.mean_ci_upper)))}
                </p>
                <p className="text-sm opacity-80">maximum expected</p>
              </div>
            </div>

            {/* Detailed Forecast Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Monthly Forecast Details
                </h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Predicted Value</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence Range</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence Level</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Standard Error</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {forecastData.map((item, index) => {
                      const confidence = getConfidenceLevel(item.mean, item.mean_ci_lower, item.mean_ci_upper);
                      return (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-semibold">{index + 1}</span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{getMonthLabel(index)}</div>
                                <div className="text-sm text-gray-500">Month {index + 1}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-lg font-semibold text-gray-900">
                              {formatNumber(item.mean)}
                            </div>
                            <div className="text-sm text-gray-500">incidents</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatNumber(item.mean_ci_lower)} - {formatNumber(item.mean_ci_upper)}
                            </div>
                            <div className="text-xs text-gray-500">95% confidence interval</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${confidence.bg} ${confidence.color}`}>
                              {confidence.level}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ±{formatNumber(item.mean_se)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Insights Section */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Key Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>Forecast generated for {months} months ahead</span>
                </div>
                <div className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>95% confidence intervals provided for each prediction</span>
                </div>
                <div className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>Use this data for resource allocation and planning</span>
                </div>
                <div className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>Standard error indicates prediction reliability</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!forecastData && !loading && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-200">
            <div className="mx-auto h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="h-12 w-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Generate Predictions</h3>
            <p className="text-gray-600 mb-6">Enter the number of months and click "Generate Forecast" to see accident predictions.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionGovernment;