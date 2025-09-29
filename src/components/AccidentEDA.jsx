import React, { useState, useEffect } from 'react';
import API from '../utils/api';

// Fetch analytics data from backend
const fetchAnalyticsData = async () => {
  try {
    const response = await API.get('/analytics');
    return response.data; 
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    throw error;
  }
};

// Fetch summary data from backend
const fetchSummaryData = async () => {
  try {
    const response = await API.get('/analytics/summary');
    return response.data; 
  } catch (error) {
    console.error('Error fetching summary data:', error);
    throw error;
  }
};

const AccidentEDA = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch both analytics and summary data
        const [analytics, summary] = await Promise.all([
          fetchAnalyticsData(),
          fetchSummaryData()
        ]);
        
        setAnalyticsData(analytics);
        setSummaryData(summary);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError(`Failed to load data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-6"></div>
        <div className="text-xl font-semibold text-gray-700 mb-2">Loading EDA Analysis...</div>
        <div className="text-sm text-gray-500">Please wait while we fetch your data</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-8 text-center shadow-lg">
        <div className="bg-red-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-red-800 mb-4">Error Loading Data</h3>
        <p className="text-red-700 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          🔄 Retry
        </button>
      </div>
    );
  }

  if (!analyticsData || !summaryData) {
    return (
      <div className="bg-gradient-to-br from-yellow-50 to-orange-100 border border-yellow-200 rounded-xl p-8 text-center shadow-lg">
        <div className="bg-yellow-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-yellow-800 mb-4">No Data Available</h3>
        <p className="text-yellow-700">No analytics data found. Please ensure the backend is running and has data.</p>
      </div>
    );
  }

  // Extract data from backend response - now using the actual API structure
  const accidentChars = {
    hourlyDistribution: analyticsData.accident_characteristics?.hourly_distribution || {},
    collisionTypes: analyticsData.accident_characteristics?.collision_types || {},
    travelModes: analyticsData.accident_characteristics?.travel_modes || {},
    roadCategories: analyticsData.accident_characteristics?.road_categories || {}
  };

  const demographics = {
    ageGroups: analyticsData.demographics?.age_groups || {},
    genderDist: analyticsData.demographics?.gender_dist || {},
    ethnicityDist: analyticsData.demographics?.ethnicity_dist || {},
    educationDist: analyticsData.demographics?.education_dist || {},
    occupationDist: analyticsData.demographics?.occupation_dist || {}
  };

  const medicalFactors = {
    outcomesDist: analyticsData.medical_factors?.outcomes_dist || {},
    washRoomAccess: analyticsData.medical_factors?.wash_room_access || {},
    toiletModification: analyticsData.medical_factors?.toilet_modification || {},
    avgHospitalExpenditure: analyticsData.medical_factors?.avg_hospital_expenditure || 0
  };

  const financialImpact = {
    incomeComparison: analyticsData.financial_impact?.income_comparison || {},
    avgIncomeChange: analyticsData.financial_impact?.avg_income_change || 0,
    familyStatusDist: analyticsData.financial_impact?.family_status_dist || {},
    insuranceClaimDist: analyticsData.financial_impact?.insurance_claim_dist || {},
    avgBystanderExp: analyticsData.financial_impact?.avg_bystander_exp || 0,
    avgTravelExp: analyticsData.financial_impact?.avg_travel_exp || 0
  };

  const temporalTrends = {
    monthlyTrends: analyticsData.temporal_trends?.monthly_trends || {},
    dailyTrends: analyticsData.temporal_trends?.daily_trends || {}
  };

  const StatCard = ({ title, value, subtitle, color = "blue" }) => (
    <div className={`bg-white p-6 rounded-xl shadow-lg border-l-4 border-${color}-500 hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1`}>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className={`text-3xl font-bold text-${color}-600 mb-1`}>{value}</p>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );

  const ChartContainer = ({ title, children }) => (
    <div className="bg-white p-8 rounded-xl shadow-lg mb-8 hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center border-b border-gray-200 pb-4">{title}</h3>
      <div className="mt-6">
        {children}
      </div>
    </div>
  );

  const BarChart = ({ data, title }) => {
    // Handle empty or invalid data
    if (!data || Object.keys(data).length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-40 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-gray-500 text-center">No data available</p>
        </div>
      );
    }

    const maxValue = Math.max(...Object.values(data));
    
    return (
      <div className="space-y-4">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex items-center group hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200">
            <div className="w-36 text-sm font-semibold text-gray-700 truncate">{key}:</div>
            <div className="flex-1 bg-gray-200 rounded-full h-8 ml-6 relative overflow-hidden shadow-inner">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-8 rounded-full flex items-center justify-end pr-3 shadow-sm transition-all duration-500 ease-out"
                style={{ width: `${maxValue > 0 ? (value / maxValue) * 100 : 0}%` }}
              >
                <span className="text-white text-sm font-bold">{value}</span>
              </div>
            </div>
            <div className="ml-3 text-sm font-medium text-gray-600 w-12 text-right">
              {maxValue > 0 ? Math.round((value / maxValue) * 100) : 0}%
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderOverview = () => {
    // Helper function to get top entry from object
    const getTopEntry = (obj) => {
      const entries = Object.entries(obj);
      if (entries.length === 0) return ['N/A', 0];
      return entries.sort((a, b) => b[1] - a[1])[0];
    };

    const totalRecords = analyticsData.total_records || summaryData.total_accidents || 0;
    const peakHour = summaryData.peak_accident_hour || analyticsData.peak_accident_hour || 'N/A';
    const commonCollision = summaryData.most_common_collision || analyticsData.most_common_collision || 'N/A';
    const avgIncomeImpact = summaryData.avg_income_impact || analyticsData.avg_income_impact || 0;

    return (
      <div className="space-y-8">
        {/* Data Period Info */}
        {analyticsData.data_period && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8 shadow-md">
            <div className="text-center">
              <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Data Period
              </h3>
              <div className="space-y-2">
                <p className="text-blue-700 text-lg font-medium">
                  Analysis Period: <span className="font-bold">{analyticsData.data_period.start_date}</span> to <span className="font-bold">{analyticsData.data_period.end_date}</span>
                </p>
                <p className="text-sm text-blue-600">
                  Generated: {new Date(analyticsData.generated_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          <StatCard 
            title="Total Records" 
            value={totalRecords.toLocaleString()} 
            subtitle="Accident cases analyzed"
            color="blue"
          />
          <StatCard 
            title="Peak Accident Hour" 
            value={peakHour !== 'N/A' ? `${peakHour}:00` : 'N/A'}
            subtitle={Object.keys(accidentChars.hourlyDistribution).length > 0 ? 
              `${getTopEntry(accidentChars.hourlyDistribution)[1]} accidents` : 'No data'}
            color="red"
          />
          <StatCard 
            title="Most Common Collision" 
            value={commonCollision}
            subtitle={Object.keys(accidentChars.collisionTypes).length > 0 ? 
              `${getTopEntry(accidentChars.collisionTypes)[1]} cases` : 'No data'}
            color="yellow"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          <ChartContainer title="🏥 Medical Outcomes">
            <BarChart data={medicalFactors.outcomesDist} />
          </ChartContainer>

          <ChartContainer title="👥 Age Group Distribution">
            <BarChart data={demographics.ageGroups} />
          </ChartContainer>

          <ChartContainer title="🚗 Collision Types">
            <BarChart data={accidentChars.collisionTypes} />
          </ChartContainer>
                  
          <ChartContainer title="⚧ Gender Distribution">
            <BarChart data={demographics.genderDist} />
          </ChartContainer>

          <ChartContainer title="🌍 Ethnicity Distribution">
            <BarChart data={demographics.ethnicityDist} />
          </ChartContainer>

          <ChartContainer title="🎓 Education Levels">
            <BarChart data={demographics.educationDist} />
          </ChartContainer>
        </div>
    </div>
    );
  };



  

  const renderTemporalTrends = () => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    const monthlyData = {};
    const dailyData = {};
    
    // Convert numeric month/day keys to readable names
    Object.entries(temporalTrends.monthlyTrends || {}).forEach(([month, count]) => {
      const monthIndex = parseInt(month);
      if (monthIndex >= 0 && monthIndex < 12) {
        monthlyData[monthNames[monthIndex]] = count;
      } else {
        monthlyData[`Month ${month}`] = count;
      }
    });
    
    Object.entries(temporalTrends.dailyTrends || {}).forEach(([day, count]) => {
      const dayIndex = parseInt(day);
      if (dayIndex >= 0 && dayIndex < 7) {
        dailyData[dayNames[dayIndex]] = count;
      } else {
        dailyData[`Day ${day}`] = count;
      }
    });

    const getTopEntry = (obj) => {
      const entries = Object.entries(obj);
      if (entries.length === 0) return ['N/A', 0];
      return entries.sort((a, b) => b[1] - a[1])[0];
    };

    return (
      <div className="space-y-10">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          <ChartContainer title="📅 Monthly Accident Distribution">
            <BarChart data={monthlyData} />
          </ChartContainer>
          
          <ChartContainer title="📊 Day of Week Distribution">
            <BarChart data={dailyData} />
          </ChartContainer>
        </div>

        <ChartContainer title="🕒 Hourly Accident Distribution">
          <BarChart data={accidentChars.hourlyDistribution} />
        </ChartContainer>

        <ChartContainer title="🎯 Temporal Patterns Analysis">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-xl border-l-4 border-red-500 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-red-500 p-3 rounded-full">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <h4 className="text-lg font-bold text-red-800 mb-3">Peak Accident Month</h4>
                <p className="text-2xl font-bold text-red-700 mb-1">{getTopEntry(monthlyData)[0]}</p>
                <p className="text-sm text-red-600">{getTopEntry(monthlyData)[1]} accidents</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-xl border-l-4 border-orange-500 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-orange-500 p-3 rounded-full">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                    </svg>
                  </div>
                </div>
                <h4 className="text-lg font-bold text-orange-800 mb-3">Peak Accident Day</h4>
                <p className="text-2xl font-bold text-orange-700 mb-1">{getTopEntry(dailyData)[0]}</p>
                <p className="text-sm text-orange-600">{getTopEntry(dailyData)[1]} accidents</p>
              </div>
            </div>
          </div>
        </ChartContainer>
      </div>
    );
  };

  

  const tabs = [
    { id: 'overview', label: 'Overview', component: renderOverview },
    { id: 'temporal', label: 'Temporal Trends', component: renderTemporalTrends },
  ];

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🚗 Road Accident Analytics Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive analysis of road accident data with insights into patterns, demographics, 
            medical outcomes, and socioeconomic impacts for evidence-based decision making.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-3 border border-gray-200">
            <div className="flex space-x-3">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-10 py-4 text-base font-semibold rounded-xl transition-all duration-300 transform ${
                    activeTab === tab.id 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl scale-105' 
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:scale-102 hover:shadow-md'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

        {/* Tab Content */}
        <div className="tab-content px-4">
          {tabs.find(tab => tab.id === activeTab)?.component()}
        </div>

      {/* Summary Section */}
      {activeTab === 'overview' && (
        <ChartContainer title="🔍 Key Insights Summary">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-xl shadow-inner">
            <h4 className="text-2xl font-bold text-gray-800 mb-8 text-center">📊 Major Findings</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                <h5 className="text-xl font-bold text-blue-700 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Vulnerable Groups
                </h5>
                <ul className="space-y-3 text-gray-700">
                  {Object.keys(demographics.ageGroups).length > 0 && (
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">🎯</span>
                      <span><strong>Age group:</strong> {Object.entries(demographics.ageGroups).sort((a,b) => b[1] - a[1])[0][0]} years (highest risk)</span>
                    </li>
                  )}
                  {Object.keys(demographics.genderDist).length > 0 && (
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">⚧</span>
                      <span><strong>Gender:</strong> {Object.entries(demographics.genderDist).sort((a,b) => b[1] - a[1])[0][0]} ({Math.round((Object.entries(demographics.genderDist).sort((a,b) => b[1] - a[1])[0][1] / (analyticsData.total_records || 1)) * 100)}% of cases)</span>
                    </li>
                  )}
                  {Object.keys(demographics.occupationDist).length > 0 && (
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">💼</span>
                      <span><strong>Occupation:</strong> {Object.entries(demographics.occupationDist).sort((a,b) => b[1] - a[1])[0][0]} (most affected)</span>
                    </li>
                  )}
                  {Object.keys(demographics.ageGroups).length === 0 && Object.keys(demographics.genderDist).length === 0 && Object.keys(demographics.occupationDist).length === 0 && (
                    <li className="text-gray-500 text-center py-4">
                      <div className="bg-gray-100 rounded-lg p-4">
                        <span>📋 No demographic data available</span>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500">
                <h5 className="text-xl font-bold text-red-700 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  High-Risk Conditions
                </h5>
                <ul className="space-y-3 text-gray-700">
                  {Object.keys(accidentChars.hourlyDistribution).length > 0 && (
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">🕒</span>
                      <span><strong>Peak time:</strong> {Object.entries(accidentChars.hourlyDistribution).sort((a,b) => b[1] - a[1])[0][0]}:00 hours</span>
                    </li>
                  )}
                  {Object.keys(accidentChars.collisionTypes).length > 0 && (
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">🚗</span>
                      <span><strong>Common collision:</strong> {Object.entries(accidentChars.collisionTypes).sort((a,b) => b[1] - a[1])[0][0]}</span>
                    </li>
                  )}
                  {Object.keys(accidentChars.roadCategories).length > 0 && (
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">🛣</span>
                      <span><strong>Risky roads:</strong> {Object.entries(accidentChars.roadCategories).sort((a,b) => b[1] - a[1])[0][0]}</span>
                    </li>
                  )}
                  {Object.keys(accidentChars.hourlyDistribution).length === 0 && Object.keys(accidentChars.collisionTypes).length === 0 && Object.keys(accidentChars.roadCategories).length === 0 && (
                    <li className="text-gray-500 text-center py-4">
                      <div className="bg-gray-100 rounded-lg p-4">
                        <span>📊 No accident condition data available</span>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            </div>
            <div className="mt-10 pt-8 border-t-2 border-gray-300">
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                <h5 className="text-xl font-bold text-green-700 mb-4 flex items-center justify-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Recovery & Financial Impact
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {Object.keys(medicalFactors.outcomesDist).length > 0 && medicalFactors.outcomesDist['Full Recovery'] ? 
                        `${Math.round((medicalFactors.outcomesDist['Full Recovery'] / (analyticsData.total_records || 1)) * 100)}%` :
                        'N/A'
                      }
                    </div>
                    <div className="text-sm text-green-700">Recovery Rate</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      ₹{Math.round(financialImpact.avgIncomeChange || 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-blue-700">Avg Income Impact</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      {analyticsData.total_records || 0}
                    </div>
                    <div className="text-sm text-purple-700">Total Cases</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ChartContainer>
      )}
    </div>
  );
};

export default AccidentEDA;