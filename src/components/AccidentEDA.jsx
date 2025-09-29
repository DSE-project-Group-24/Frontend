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
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading EDA Analysis...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Data</h3>
        <p className="text-red-700">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!analyticsData || !summaryData) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">No Data Available</h3>
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
    <div className={`bg-white p-4 rounded-lg shadow-md border-l-4 border-${color}-500`}>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
      {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
    </div>
  );

  const ChartContainer = ({ title, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
      {children}
    </div>
  );

  const BarChart = ({ data, title }) => {
    // Handle empty or invalid data
    if (!data || Object.keys(data).length === 0) {
      return (
        <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No data available</p>
        </div>
      );
    }

    const maxValue = Math.max(...Object.values(data));
    
    return (
      <div className="space-y-3">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex items-center">
            <div className="w-32 text-sm font-medium text-gray-700">{key}:</div>
            <div className="flex-1 bg-gray-200 rounded-full h-6 ml-4 relative">
              <div 
                className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-2"
                style={{ width: `${maxValue > 0 ? (value / maxValue) * 100 : 0}%` }}
              >
                <span className="text-white text-xs font-medium">{value}</span>
              </div>
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
      <div className="space-y-6">
        {/* Data Period Info */}
        {analyticsData.data_period && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Data Period</h3>
            <p className="text-blue-700">
              Analysis Period: {analyticsData.data_period.start_date} to {analyticsData.data_period.end_date}
            </p>
            <p className="text-sm text-blue-600">
              Generated: {new Date(analyticsData.generated_at).toLocaleString()}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <ChartContainer title="Discharge Outcomes">
          <BarChart data={medicalFactors.outcomesDist} />
        </ChartContainer>

        <ChartContainer title="Age Group Distribution">
          <BarChart data={demographics.ageGroups} />
        </ChartContainer>

        <ChartContainer title="Collision Types Distribution">
          <BarChart data={accidentChars.collisionTypes} />
        </ChartContainer>

                
        <ChartContainer title="Gender Distribution">
          <BarChart data={demographics.genderDist} />
        </ChartContainer>

        <ChartContainer title="Ethnicity Distribution">
          <BarChart data={demographics.ethnicityDist} />
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
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartContainer title="Monthly Accident Distribution">
            <BarChart data={monthlyData} />
          </ChartContainer>
          
          <ChartContainer title="Day of Week Distribution">
            <BarChart data={dailyData} />
          </ChartContainer>

          <ChartContainer title="Accident Distribution by Hour">
            <BarChart data={accidentChars.hourlyDistribution} />
          </ChartContainer>
        </div>

        <ChartContainer title="Temporal Patterns Analysis">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-2">Peak Accident Month</h4>
              <p className="text-red-700">{getTopEntry(monthlyData)[0]}</p>
              <p className="text-sm text-red-600">{getTopEntry(monthlyData)[1]} accidents</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-800 mb-2">Peak Accident Day</h4>
              <p className="text-orange-700">{getTopEntry(dailyData)[0]}</p>
              <p className="text-sm text-orange-600">{getTopEntry(dailyData)[1]} accidents</p>
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
    <div className="w-full">
      <div className="mb-6">
        
        
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab.id 
                ? 'bg-blue-500 text-white border-b-2 border-blue-500' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {tabs.find(tab => tab.id === activeTab)?.component()}
      </div>

      {/* Summary Section */}
      {activeTab === 'overview' && (
        <ChartContainer title="Key Insights Summary">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Major Findings:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-semibold text-blue-700 mb-2">Vulnerable Groups:</h5>
                <ul className="text-sm text-gray-700 space-y-1">
                  {Object.keys(demographics.ageGroups).length > 0 && (
                    <li>• Age group: {Object.entries(demographics.ageGroups).sort((a,b) => b[1] - a[1])[0][0]} years (highest risk)</li>
                  )}
                  {Object.keys(demographics.genderDist).length > 0 && (
                    <li>• Gender: {Object.entries(demographics.genderDist).sort((a,b) => b[1] - a[1])[0][0]} ({Math.round((Object.entries(demographics.genderDist).sort((a,b) => b[1] - a[1])[0][1] / (analyticsData.total_records || 1)) * 100)}% of cases)</li>
                  )}
                  {Object.keys(demographics.occupationDist).length > 0 && (
                    <li>• Occupation: {Object.entries(demographics.occupationDist).sort((a,b) => b[1] - a[1])[0][0]} (most affected)</li>
                  )}
                  {Object.keys(demographics.ageGroups).length === 0 && Object.keys(demographics.genderDist).length === 0 && Object.keys(demographics.occupationDist).length === 0 && (
                    <li className="text-gray-500">• No demographic data available</li>
                  )}
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-red-700 mb-2">High-Risk Conditions:</h5>
                <ul className="text-sm text-gray-700 space-y-1">
                  {Object.keys(accidentChars.hourlyDistribution).length > 0 && (
                    <li>• Peak time: {Object.entries(accidentChars.hourlyDistribution).sort((a,b) => b[1] - a[1])[0][0]}:00 hours</li>
                  )}
                  {Object.keys(accidentChars.collisionTypes).length > 0 && (
                    <li>• Common collision: {Object.entries(accidentChars.collisionTypes).sort((a,b) => b[1] - a[1])[0][0]}</li>
                  )}
                  {Object.keys(accidentChars.roadCategories).length > 0 && (
                    <li>• Risky roads: {Object.entries(accidentChars.roadCategories).sort((a,b) => b[1] - a[1])[0][0]}</li>
                  )}
                  {Object.keys(accidentChars.hourlyDistribution).length === 0 && Object.keys(accidentChars.collisionTypes).length === 0 && Object.keys(accidentChars.roadCategories).length === 0 && (
                    <li className="text-gray-500">• No accident condition data available</li>
                  )}
                </ul>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-300">
              <h5 className="font-semibold text-green-700 mb-2">Recovery & Financial Impact:</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
                <div>
                  {Object.keys(medicalFactors.outcomesDist).length > 0 && medicalFactors.outcomesDist['Full Recovery'] ? 
                    `Recovery rate: ${Math.round((medicalFactors.outcomesDist['Full Recovery'] / (analyticsData.total_records || 1)) * 100)}%` :
                    'Recovery data: Not available'
                  }
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