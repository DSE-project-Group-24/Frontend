
import { useEffect, useState, useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, PieChart, Pie, Cell, ComposedChart } from 'recharts';
import { Calendar, TrendingUp, TrendingDown, AlertTriangle, Clock, Filter, Activity, BarChart3 } from 'lucide-react';
import axios from 'axios';
import GovernmentNav from '../../navbars/GovernmentNav';
import Footer from '../../components/Footer';
import { t } from '../../utils/translations';


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
          <p className="text-gray-600">{t('loading')}...</p>
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
            {t('analytics')} {t('dashboard')}
          </h1>
          <p className="text-gray-600 text-lg">{t('comprehensiveAnalysisPredictions')}</p>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* View Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="inline mr-1" size={16} />
                {t('viewMode')}
              </label>
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="monthly">{t('monthlyView')}</option>
                <option value="yearly">{t('yearlyView')}</option>
                <option value="weekly">{t('dayOfWeek')}</option>
                <option value="historical">{t('historicalOnly')}</option>
                <option value="predicted">{t('predictedOnly')}</option>
                <option value="combined">{t('historicalPredicted')}</option>
              </select>
            </div>

            {/* Time Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline mr-1" size={16} />
                {t('timeRange')}
              </label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={viewMode === 'predicted'}
              >
                <option value="all">{t('allTime')}</option>
                <option value="3m">{t('last3Months')}</option>
                <option value="6m">{t('last6Months')}</option>
                <option value="1y">{t('lastYear')}</option>
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline mr-1" size={16} />
                {t('yearFilter')}
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">{t('allYears')}</option>
                {processedYearlyData.map(d => (
                  <option key={d.year} value={d.year}>{d.year}</option>
                ))}
              </select>
            </div>

            {/* Prediction Months */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <TrendingUp className="inline mr-1" size={16} />
                {t('predictMonths')}
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
                  {predictionLoading ? '...' : t('get')}
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
                <h3 className="text-sm font-medium opacity-90">{t('totalAccidents')}</h3>
                <AlertTriangle size={20} />
              </div>
              <p className="text-3xl font-bold">{statistics.totalAccidents.toLocaleString()}</p>
              <p className="text-xs opacity-80 mt-1">{t('historicalRecords')}</p>
            </div>

            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium opacity-90">{t('seriousRate')}</h3>
                <TrendingUp size={20} />
              </div>
              <p className="text-3xl font-bold">{statistics.seriousRate}%</p>
              <p className="text-xs opacity-80 mt-1">{statistics.totalSerious} {t('seriousCases')}</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium opacity-90">{t('avgMonthly')}</h3>
                <BarChart3 size={20} />
              </div>
              <p className="text-3xl font-bold">{statistics.avgMonthly}</p>
              <p className="text-xs opacity-80 mt-1">{t('accidentsPerMonth')}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium opacity-90">{t('peakDay')}</h3>
                <Calendar size={20} />
              </div>
              <p className="text-2xl font-bold">{statistics.peakDay}</p>
              <p className="text-xs opacity-80 mt-1">{t('highestAccidentDay')}</p>
            </div>
          </div>
        )}

        {/* Predicted Statistics */}
        {predictedStatistics && (viewMode === 'predicted' || viewMode === 'combined') && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-6 border-2 border-indigo-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <TrendingUp className="mr-2 text-indigo-600" />
              {t('predictedStatistics')} ({t('nextMonths')} {predictionMonths} {t('months')})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">{t('avgTotalMonth')}</p>
                <p className="text-2xl font-bold text-indigo-600">{predictedStatistics.avgTotal}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('avgSeriousMonth')}</p>
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
                {viewMode === 'historical' ? t('historical') : viewMode === 'predicted' ? t('predicted') : t('combined')} {t('monthlyAccidentTrends')}
              </h2>
              <p className="text-sm text-gray-600">
                {viewMode === 'predicted' ? t('statisticalForecasts') : t('totalSeriousModerate')}
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
                        name={t('totalAccidentsName')}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="serious" 
                        stroke="#ef4444" 
                        strokeWidth={2}
                        dot={{ fill: '#ef4444', r: 3 }}
                        name={t('serious')}
                      />
                    </>
                  )}
                  
                  {(viewMode === 'historical' || viewMode === 'monthly') && (
                    <>
                      <Bar dataKey="moderate" fill="#10b981" name={t('moderate')} />
                      <Bar dataKey="serious" fill="#ef4444" name={t('serious')} />
                      <Line 
                        type="monotone" 
                        dataKey="total" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', r: 4 }}
                        name={t('total')}
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
                        name={t('predictedModerate')}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="serious" 
                        stroke="#ef4444" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ fill: '#ef4444', r: 4 }}
                        name={t('predictedSerious')}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="total" 
                        stroke="#8b5cf6" 
                        strokeWidth={3}
                        dot={{ fill: '#8b5cf6', r: 5 }}
                        name={t('predictedTotal')}
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
              <h2 className="text-xl font-semibold text-gray-800 mb-1">{t('yearlyAccidentComparison')}</h2>
              <p className="text-sm text-gray-600">{t('totalAccidentsByYear')}</p>
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
                  <Bar dataKey="serious" stackId="a" fill="#ef4444" name={t('serious')} />
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
                <h2 className="text-xl font-semibold text-gray-800 mb-1">{t('accidentsByDayOfWeek')}</h2>
                <p className="text-sm text-gray-600">{t('weeklyPatternAnalysis')}</p>
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
                    <Bar dataKey="serious" fill="#ef4444" name={t('serious')} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-1">{t('dayDistribution')}</h2>
                <p className="text-sm text-gray-600">{t('proportionTotalAccidents')}</p>
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
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('dayOfWeekStatistics')}</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Day</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serious</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Moderate</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serious Rate</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('riskLevel')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {processedDayOfWeekData.map((item) => {
                      const riskLevel = item.total > 950 ? t('high') : item.total > 850 ? t('medium') : t('low');
                      const riskColor = item.total > 950 ? 'text-red-600 bg-red-50' : 
                                       item.total > 850 ? 'text-yellow-600 bg-yellow-50' : 
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
              <h2 className="text-xl font-semibold text-gray-800 mb-1">{t('dailyAccidentForecast')}</h2>
              <p className="text-sm text-gray-600">{t('next7Days')}</p>
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
                t('generateDailyForecast')
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
                      name={t('predictedAccidents')}
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
                    <p className="text-xs text-gray-500 mt-1">{t('accidents')}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-200">
                <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                  <AlertTriangle className="mr-2 text-purple-600" size={16} />
                  {t('weeklyInsights')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                  <div>• {t('totalWeeklyForecast')} <span className="font-semibold text-purple-600">
                    {processedPredictedDaily.reduce((sum, d) => sum + d.accidents, 0).toFixed(1)}
                  </span> {t('accidents')}</div>
                  <div>• {t('averageDaily')} <span className="font-semibold text-purple-600">
                    {(processedPredictedDaily.reduce((sum, d) => sum + d.accidents, 0) / processedPredictedDaily.length).toFixed(1)}
                  </span> {t('accidents')}</div>
                  <div>• {t('peakDay')} <span className="font-semibold text-orange-600">
                    {Math.max(...processedPredictedDaily.map(d => d.accidents)).toFixed(1)}
                  </span> {t('accidents')}</div>
                  <div>• {t('lowestDay')} <span className="font-semibold text-green-600">
                    {Math.min(...processedPredictedDaily.map(d => d.accidents)).toFixed(1)}
                  </span> {t('accidents')}</div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Clock className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-600">{t('clickGenerate')}</p>
            </div>
          )}
        </div>

        {/* Severity Rate Trend */}
        {(viewMode === 'monthly' || viewMode === 'historical') && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-1">{t('severityRateTrend')}</h2>
              <p className="text-sm text-gray-600">{t('percentageSeriousAccidents')}</p>
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
                    label={{ value: t('seriousRatePercent'), angle: -90, position: 'insideLeft' }}
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
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('historicalMonthlyData')}</h3>
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
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('predictedMonthlyData')}</h3>
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
            {t('keyInsightsTrends')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="flex items-start">
              <span className="text-blue-600 mr-2 mt-1">•</span>
              <span>
                <strong>{t('monthlyPattern')}:</strong> {t('historicalDataShows')} {statistics?.peakMonth} {t('accidentsAtPeak')}, 
                {t('avgMonthly')} {statistics?.avgMonthly} {t('perMonth')}
              </span>
            </div>
            <div className="flex items-start">
              <span className="text-blue-600 mr-2 mt-1">•</span>
              <span>
                <strong>{t('weeklyTrend')}:</strong> {statistics?.peakDay} {t('consistentlyShows')}
              </span>
            </div>
            <div className="flex items-start">
              <span className="text-blue-600 mr-2 mt-1">•</span>
              <span>
                <strong>{t('severityAnalysis')}:</strong> {t('overallSeriousRate')} {statistics?.seriousRate}{t('indicatingProportion')}
              </span>
            </div>
            <div className="flex items-start">
              <span className="text-blue-600 mr-2 mt-1">•</span>
              <span>
                <strong>{t('predictionValue')}:</strong> {t('useForecasts')}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TemporalAccidentDashboard;