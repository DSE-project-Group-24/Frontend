import React, { useState, useEffect } from 'react';
import API from '../utils/api';

// Fetch analytics data from backend with optional filters
const fetchAnalyticsData = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    // Add filters as query parameters
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);
    if (filters.gender) params.append('gender', filters.gender);
    if (filters.age_min !== undefined && filters.age_min !== null) params.append('age_min', filters.age_min);
    if (filters.age_max !== undefined && filters.age_max !== null) params.append('age_max', filters.age_max);
    if (filters.ethnicity) params.append('ethnicity', filters.ethnicity);
    if (filters.collision_type) params.append('collision_type', filters.collision_type);
    if (filters.road_category) params.append('road_category', filters.road_category);
    if (filters.discharge_outcome) params.append('discharge_outcome', filters.discharge_outcome);
    
    const url = `/analytics${params.toString() ? '?' + params.toString() : ''}`;
    const response = await API.get(url);
    return response.data; 
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    throw error;
  }
};

// Fetch summary data from backend with optional filters
const fetchSummaryData = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    // Add date filters for summary
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);
    
    const url = `/analytics/summary${params.toString() ? '?' + params.toString() : ''}`;
    const response = await API.get(url);
    return response.data; 
  } catch (error) {
    console.error('Error fetching summary data:', error);
    throw error;
  }
};

// Fetch filter options from backend (initial load to get available options)
const fetchFilterOptions = async () => {
  try {
    const response = await API.get('/analytics');
    console.log('Filter options response:', response.data);
    return response.data; 
  } catch (error) {
    console.error('Error fetching filter options:', error);
    throw error;
  }
};

const AccidentEDA = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [filterOptions, setFilterOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [applying, setApplying] = useState(false);

  // Backend filter states
  const [filters, setFilters] = useState({
    start_date: '',
    end_date: '',
    gender: '',
    age_min: '',
    age_max: '',
    ethnicity: '',
    collision_type: '',
    road_category: '',
    discharge_outcome: ''
  });

  // Apply filters by fetching filtered data from backend
  const applyFilters = async () => {
    try {
      setApplying(true);
      setError(null);

      // Build filter object for API call
      const apiFilters = {};
      
      if (filters.start_date) apiFilters.start_date = filters.start_date;
      if (filters.end_date) apiFilters.end_date = filters.end_date;
      if (filters.gender) apiFilters.gender = filters.gender;
      if (filters.age_min) apiFilters.age_min = parseInt(filters.age_min);
      if (filters.age_max) apiFilters.age_max = parseInt(filters.age_max);
      if (filters.ethnicity) apiFilters.ethnicity = filters.ethnicity;
      if (filters.collision_type) apiFilters.collision_type = filters.collision_type;
      if (filters.road_category) apiFilters.road_category = filters.road_category;
      if (filters.discharge_outcome) apiFilters.discharge_outcome = filters.discharge_outcome;

      // Fetch filtered data from backend
      const [analytics, summary] = await Promise.all([
        fetchAnalyticsData(apiFilters),
        fetchSummaryData(apiFilters)
      ]);

      setAnalyticsData(analytics);
      setSummaryData(summary);
    } catch (err) {
      console.error('Failed to apply filters:', err);
      setError(`Failed to apply filters: ${err.message}`);
    } finally {
      setApplying(false);
    }
  };

  // Analytics calculation functions
  const calculateAccidentCharacteristics = (data) => {
    const hourlyDistribution = {};
    const collisionTypes = {};
    const travelModes = {};
    const roadCategories = {};

    data.forEach(record => {
      // Hourly distribution
      const timeStr = record['time of collision'];
      if (timeStr && timeStr !== 'Victim Unable to recall the Time or Early Discharge') {
        try {
          if (timeStr.includes(':')) {
            let hour = parseInt(timeStr.split(':')[0]);
            if (timeStr.toUpperCase().includes('PM') && hour !== 12) hour += 12;
            if (timeStr.toUpperCase().includes('AM') && hour === 12) hour = 0;
            hourlyDistribution[hour] = (hourlyDistribution[hour] || 0) + 1;
          }
        } catch (e) {}
      }

      // Collision types
      const collision = record['Collision with'];
      if (collision && collision !== 'Victim not willing to share/ Unable to respond/  Early Discharge') {
        collisionTypes[collision] = (collisionTypes[collision] || 0) + 1;
      }

      // Travel modes
      const travelMode = record['Mode of traveling during accident'];
      if (travelMode) {
        travelModes[travelMode] = (travelModes[travelMode] || 0) + 1;
      }

      // Road categories
      const roadCategory = record['Category of Road'];
      if (roadCategory && roadCategory !== 'Victim not willing to share/ Unable to respond/  Early Discharge') {
        roadCategories[roadCategory] = (roadCategories[roadCategory] || 0) + 1;
      }
    });

    return { hourly_distribution: hourlyDistribution, collision_types: collisionTypes, travel_modes: travelModes, road_categories: roadCategories };
  };

  const calculateDemographics = (data) => {
    const ageGroups = {};
    const genderDist = {};
    const ethnicityDist = {};
    const educationDist = {};

    data.forEach(record => {
      const patientData = record.patient_data;
      if (patientData) {
        // Age groups
        const dob = patientData['Date of Birth'];
        if (dob) {
          try {
            const birthDate = new Date(dob);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear() - 
              ((today.getMonth(), today.getDate()) < (birthDate.getMonth(), birthDate.getDate()) ? 1 : 0);
            
            let ageGroup;
            if (age < 18) ageGroup = 'Under 18';
            else if (age <= 25) ageGroup = '18-25';
            else if (age <= 35) ageGroup = '26-35';
            else if (age <= 45) ageGroup = '36-45';
            else if (age <= 55) ageGroup = '46-55';
            else ageGroup = '56+';

            ageGroups[ageGroup] = (ageGroups[ageGroup] || 0) + 1;
          } catch (e) {}
        }

        // Gender
        const gender = patientData.Gender;
        if (gender) {
          genderDist[gender] = (genderDist[gender] || 0) + 1;
        }

        // Ethnicity
        const ethnicity = patientData.Ethnicity;
        if (ethnicity) {
          ethnicityDist[ethnicity] = (ethnicityDist[ethnicity] || 0) + 1;
        }

        // Education
        const education = patientData['Education Qualification'];
        if (education) {
          educationDist[education] = (educationDist[education] || 0) + 1;
        }
      }
    });

    return { age_groups: ageGroups, gender_dist: genderDist, ethnicity_dist: ethnicityDist, education_dist: educationDist };
  };

  const calculateMedicalFactors = (data) => {
    const outcomesDist = {};
    let expenditures = [];

    data.forEach(record => {
      const outcome = record['Discharge Outcome'];
      if (outcome) {
        outcomesDist[outcome] = (outcomesDist[outcome] || 0) + 1;
      }

      const bystanderExp = record['Bystander expenditure per day'];
      if (bystanderExp && bystanderExp !== '0') {
        try {
          expenditures.push(parseFloat(bystanderExp));
        } catch (e) {}
      }
    });

    const avgHospitalExpenditure = expenditures.length > 0 ? expenditures.reduce((a, b) => a + b, 0) / expenditures.length : 0;

    return { outcomes_dist: outcomesDist, wash_room_access: {}, toilet_modification: {}, avg_hospital_expenditure: avgHospitalExpenditure };
  };

  const calculateFinancialImpact = (data) => {
    const incomeComparison = {};
    const familyStatusDist = {};
    const insuranceClaimDist = {};
    let bystanderExpenses = [];
    let incomeChanges = [];

    data.forEach(record => {
      // Family status
      const familyStatus = record['Family current status'];
      if (familyStatus && familyStatus !== 'Victim not willing to share/ Unable to respond/  Early Discharge') {
        familyStatusDist[familyStatus] = (familyStatusDist[familyStatus] || 0) + 1;
      }

      // Insurance
      const vehicleInsured = record['vehicle insured'];
      if (vehicleInsured && vehicleInsured !== 'Victim not willing to share/ Unable to respond/  Early Discharge') {
        insuranceClaimDist[vehicleInsured] = (insuranceClaimDist[vehicleInsured] || 0) + 1;
      }

      // Income comparison would need more complex parsing
      // Simplified for now
      incomeComparison['same'] = (incomeComparison['same'] || 0) + 1;
    });

    const avgIncomeChange = incomeChanges.length > 0 ? incomeChanges.reduce((a, b) => a + b, 0) / incomeChanges.length : 0;
    const avgBystanderExp = bystanderExpenses.length > 0 ? bystanderExpenses.reduce((a, b) => a + b, 0) / bystanderExpenses.length : 0;

    return { income_comparison: incomeComparison, avg_income_change: avgIncomeChange, family_status_dist: familyStatusDist, insurance_claim_dist: insuranceClaimDist, avg_bystander_exp: avgBystanderExp, avg_travel_exp: 0 };
  };

  const calculateTemporalTrends = (data) => {
    const monthlyTrends = {};
    const dailyTrends = {};

    data.forEach(record => {
      if (record.incident_year && record.incident_month) {
        monthlyTrends[record.incident_month] = (monthlyTrends[record.incident_month] || 0) + 1;
      }

      const incidentDate = record['incident at date'];
      if (incidentDate) {
        try {
          const date = new Date(incidentDate);
          const dayOfWeek = date.getDay();
          dailyTrends[dayOfWeek] = (dailyTrends[dayOfWeek] || 0) + 1;
        } catch (e) {}
      }
    });

    return { monthly_trends: monthlyTrends, daily_trends: dailyTrends };
  };

  const calculateDataQuality = (data) => {
    const complete = data.filter(record => 
      record['incident at date'] && 
      record.patient_data && 
      record.patient_data.Gender
    ).length;

    return {
      quality_dist: { 'Complete': complete, 'Missing/Incomplete': data.length - complete },
      total_records: data.length,
      completion_rate: data.length > 0 ? (complete / data.length) * 100 : 0
    };
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch initial data without filters (all data)
        const [analytics, summary, filterOpts] = await Promise.all([
          fetchAnalyticsData(),
          fetchSummaryData(),
          fetchFilterOptions()
        ]);
        
        setAnalyticsData(analytics);
        setSummaryData(summary);
        setFilterOptions(filterOpts);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError(`Failed to load data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      start_date: '',
      end_date: '',
      gender: '',
      age_min: '',
      age_max: '',
      ethnicity: '',
      collision_type: '',
      road_category: '',
      discharge_outcome: ''
    });
  };

  const FilterSidebar = () => {
    if (!filterOptions) return null;

    return (
      <>
        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-1/2 left-4 z-40 bg-blue-500 text-white p-3 rounded-r-lg shadow-lg hover:bg-blue-600 transition-all duration-300 transform -translate-y-1/2"
          style={{ display: sidebarOpen ? 'none' : 'block' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707v4.586a1 1 0 01-.293.707L9 19.414V15a1 1 0 00-.293-.707L2.293 7.707A1 1 0 012 7V4z" />
          </svg>
        </button>

        {/* Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="p-6 h-full overflow-y-auto">
            {/* Sidebar Header */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707v4.586a1 1 0 01-.293.707L9 19.414V15a1 1 0 00-.293-.707L2.293 7.707A1 1 0 012 7V4z" />
                </svg>
                Filters
              </h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Filter Controls */}
            <div className="space-y-6">
              {/* Date Range Filters */}
              <div className="filter-group">
                <label className="block text-sm font-semibold text-gray-700 mb-3">📅 Date Range</label>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={filters.start_date}
                      onChange={(e) => handleFilterChange('start_date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">End Date</label>
                    <input
                      type="date"
                      value={filters.end_date}
                      onChange={(e) => handleFilterChange('end_date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Gender Filter */}
              <div className="filter-group">
                <label className="block text-sm font-semibold text-gray-700 mb-3">⚧ Gender</label>
                <select
                  value={filters.gender}
                  onChange={(e) => handleFilterChange('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  {/* Add any additional genders from backend if available */}
                  {filterOptions.genders?.filter(gender => 
                    !['Male', 'Female'].includes(gender)
                  ).map(gender => (
                    <option key={gender} value={gender}>{gender}</option>
                  ))}
                </select>
              </div>

              {/* Age Range Filter */}
              <div className="filter-group">
                <label className="block text-sm font-semibold text-gray-700 mb-3">👥 Age Range</label>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Minimum Age</label>
                    <input
                      type="number"
                      min="0"
                      max="120"
                      value={filters.age_min}
                      onChange={(e) => handleFilterChange('age_min', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Min age"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Maximum Age</label>
                    <input
                      type="number"
                      min="0"
                      max="120"
                      value={filters.age_max}
                      onChange={(e) => handleFilterChange('age_max', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Max age"
                    />
                  </div>
                </div>
              </div>

              {/* Ethnicity Filter */}
              <div className="filter-group">
                <label className="block text-sm font-semibold text-gray-700 mb-3">🌍 Ethnicity</label>
                <select
                  value={filters.ethnicity}
                  onChange={(e) => handleFilterChange('ethnicity', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Ethnicities</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Sinhalese">Sinhalese</option>
                  <option value="Muslim">Muslim</option>
                  <option value="Moor">Moor</option>
                  {/* Add any additional ethnicities from backend if available */}
                  {filterOptions.ethnicities?.filter(ethnicity => 
                    !['Sinhalese', 'Tamil', 'Muslim', 'Moor'].includes(ethnicity)
                  ).map(ethnicity => (
                    <option key={ethnicity} value={ethnicity}>{ethnicity}</option>
                  ))}
                </select>
              </div>

              
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200 space-y-3">
              <button
                onClick={applyFilters}
                disabled={applying}
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {applying ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Applying...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707v4.586a1 1 0 01-.293.707L9 19.414V15a1 1 0 00-.293-.707L2.293 7.707A1 1 0 012 7V4z" />
                    </svg>
                    Apply Filters
                  </>
                )}
              </button>
              
              <button
                onClick={clearAllFilters}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear All
              </button>
            </div>

            {/* Active Filters Display */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Active Filters</h4>
              <div className="space-y-1 text-xs">
                {filters.start_date && (
                  <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Start: {filters.start_date}
                  </div>
                )}
                {filters.end_date && (
                  <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    End: {filters.end_date}
                  </div>
                )}
                {filters.gender && (
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded">
                    Gender: {filters.gender}
                  </div>
                )}
                {(filters.age_min || filters.age_max) && (
                  <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                    Age: {filters.age_min || '0'}-{filters.age_max || '120'}
                  </div>
                )}
                {filters.ethnicity && (
                  <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    Ethnicity: {filters.ethnicity}
                  </div>
                )}
                {filters.collision_type && (
                  <div className="bg-red-100 text-red-800 px-2 py-1 rounded">
                    Collision: {filters.collision_type}
                  </div>
                )}
                {filters.road_category && (
                  <div className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                    Road: {filters.road_category}
                  </div>
                )}
                {filters.discharge_outcome && (
                  <div className="bg-pink-100 text-pink-800 px-2 py-1 rounded">
                    Outcome: {filters.discharge_outcome}
                  </div>
                )}
                {!filters.start_date && !filters.end_date && !filters.gender && !filters.age_min && !filters.age_max && 
                 !filters.ethnicity && !filters.collision_type && !filters.road_category && !filters.discharge_outcome && (
                  <div className="text-gray-500 italic">No active filters</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

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
    educationDist: analyticsData.demographics?.education_dist || {}
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

  const StatCard = ({ title, value, subtitle, color = "blue", icon }) => (
    <div className="group relative bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-2xl hover:border-blue-200/80 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
      {/* Background gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${
        color === 'blue' ? 'from-blue-500 to-indigo-500' :
        color === 'red' ? 'from-red-500 to-pink-500' :
        color === 'yellow' ? 'from-yellow-500 to-orange-500' :
        color === 'green' ? 'from-green-500 to-emerald-500' :
        'from-blue-500 to-indigo-500'
      }`}></div>
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br shadow-lg ${
            color === 'blue' ? 'from-blue-500 to-indigo-500' :
            color === 'red' ? 'from-red-500 to-pink-500' :
            color === 'yellow' ? 'from-yellow-500 to-orange-500' :
            color === 'green' ? 'from-green-500 to-emerald-500' :
            'from-blue-500 to-indigo-500'
          }`}>
            {icon || (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            )}
          </div>
          <div className="text-right">
            <h3 className="text-sm font-semibold text-gray-600 mb-1 tracking-wide uppercase">{title}</h3>
            <p className="text-3xl font-bold text-gray-900 mb-1 group-hover:scale-110 transition-transform duration-300">{value}</p>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
        </div>
        
        {/* Progress indicator */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div className={`h-2 rounded-full bg-gradient-to-r transition-all duration-500 ${
            color === 'blue' ? 'from-blue-500 to-indigo-500' :
            color === 'red' ? 'from-red-500 to-pink-500' :
            color === 'yellow' ? 'from-yellow-500 to-orange-500' :
            color === 'green' ? 'from-green-500 to-emerald-500' :
            'from-blue-500 to-indigo-500'
          }`} style={{ width: '85%' }}></div>
        </div>
        <p className="text-xs text-gray-400">Updated in real-time</p>
      </div>
    </div>
  );

  // Professional Chart Container with enhanced styling
  const ChartContainer = ({ title, children, className = "", size = "default" }) => {
    const sizeClasses = {
      small: "p-4",
      default: "p-6",
      large: "p-8"
    };
    
    return (
      <div className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 ${sizeClasses[size]} ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500">Live</span>
          </div>
        </div>
        <div className="chart-content">
          {children}
        </div>
      </div>
    );
  };

  // Empty State Component
  const EmptyChart = ({ message = "No data available for current filters" }) => (
    <div className="flex flex-col items-center justify-center h-48 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
      <div className="text-gray-400 mb-3">
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
      <p className="text-gray-500 text-center text-sm">{message}</p>
    </div>
  );

  // Modern Horizontal Bar Chart
  const HorizontalBarChart = ({ data, colorScheme = "blue" }) => {
    if (!data || Object.keys(data).length === 0) return <EmptyChart />;

    const maxValue = Math.max(...Object.values(data));
    const colorSchemes = {
      blue: { from: 'from-blue-500', to: 'to-blue-600', bg: 'bg-blue-50' },
      red: { from: 'from-red-500', to: 'to-red-600', bg: 'bg-red-50' },
      green: { from: 'from-green-500', to: 'to-green-600', bg: 'bg-green-50' },
      purple: { from: 'from-purple-500', to: 'to-purple-600', bg: 'bg-purple-50' },
      orange: { from: 'from-orange-500', to: 'to-orange-600', bg: 'bg-orange-50' }
    };
    const colors = colorSchemes[colorScheme];
    
    return (
      <div className="space-y-4">
        {Object.entries(data)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 6)
          .map(([key, value], index) => {
            const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
            return (
              <div key={key} className="group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 truncate max-w-[150px]">{key}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-gray-900">{value.toLocaleString()}</span>
                    <span className="text-xs text-gray-500">({Math.round(percentage)}%)</span>
                  </div>
                </div>
                <div className={`w-full ${colors.bg} rounded-full h-3 relative overflow-hidden`}>
                  <div 
                    className={`h-3 bg-gradient-to-r ${colors.from} ${colors.to} rounded-full transition-all duration-700 ease-out shadow-sm relative`}
                    style={{ 
                      width: `${percentage}%`,
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    );
  };

  // Modern Donut Chart
  const DonutChart = ({ data, colorScheme = "mixed" }) => {
    if (!data || Object.keys(data).length === 0) return <EmptyChart />;

    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [hoveredData, setHoveredData] = useState(null);

    const total = Object.values(data).reduce((sum, value) => sum + value, 0);
    const sortedData = Object.entries(data).sort(([,a], [,b]) => b - a).slice(0, 5);
    
    const colors = [
      { hex: '#3b82f6', bg: 'bg-blue-500', name: 'Blue' },
      { hex: '#10b981', bg: 'bg-emerald-500', name: 'Emerald' },
      { hex: '#f59e0b', bg: 'bg-amber-500', name: 'Amber' },
      { hex: '#8b5cf6', bg: 'bg-purple-500', name: 'Purple' },
      { hex: '#ef4444', bg: 'bg-red-500', name: 'Red' }
    ];

    let cumulativePercentage = 0;

    return (
      <div className="flex items-center justify-center space-x-8">
        {/* Donut Chart Visual */}
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="8"
            />
            {/* Data segments */}
            {sortedData.map(([key, value], index) => {
              const percentage = (value / total) * 100;
              const strokeDasharray = `${percentage * 2.199} ${219.9 - percentage * 2.199}`;
              const strokeDashoffset = -cumulativePercentage * 2.199;
              const isHovered = hoveredIndex === index;
              const isOtherHovered = hoveredIndex !== null && hoveredIndex !== index;
              cumulativePercentage += percentage;
              
              return (
                <circle
                  key={key}
                  cx="50"
                  cy="50"
                  r={isHovered ? "37" : "35"}
                  fill="none"
                  stroke={colors[index % colors.length].hex}
                  strokeWidth={isHovered ? "10" : "8"}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-300 ease-in-out cursor-pointer"
                  style={{ 
                    animationDelay: `${index * 200}ms`,
                    filter: isHovered 
                      ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' 
                      : isOtherHovered 
                        ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.1)) opacity(0.6)'
                        : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                    opacity: isOtherHovered ? 0.4 : 1
                  }}
                  onMouseEnter={() => {
                    setHoveredIndex(index);
                    setHoveredData({ key, value, percentage: percentage.toFixed(1) });
                  }}
                  onMouseLeave={() => {
                    setHoveredIndex(null);
                    setHoveredData(null);
                  }}
                />
              );
            })}
          </svg>
          
          {/* Center content - dynamic based on hover */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center transition-all duration-300">
              {hoveredData ? (
                <>
                  <div className="text-xl font-bold text-gray-900">{hoveredData.value.toLocaleString()}</div>
                  <div className="text-sm text-gray-600 truncate max-w-20">{hoveredData.key}</div>
                  <div className="text-xs text-gray-500">{hoveredData.percentage}%</div>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold text-gray-900">{total.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Total</div>
                </>
              )}
            </div>
          </div>

          {/* Floating tooltip */}
          {hoveredData && (
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg shadow-lg z-10 pointer-events-none">
              <div className="text-xs font-medium">{hoveredData.key}</div>
              <div className="text-sm font-bold">{hoveredData.value.toLocaleString()} ({hoveredData.percentage}%)</div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
            </div>
          )}
        </div>

        {/* Legend with enhanced hover effects */}
        <div className="space-y-3">
          {sortedData.map(([key, value], index) => {
            const percentage = ((value / total) * 100).toFixed(1);
            const isHovered = hoveredIndex === index;
            const isOtherHovered = hoveredIndex !== null && hoveredIndex !== index;
            
            return (
              <div 
                key={key} 
                className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-300 cursor-pointer ${
                  isHovered 
                    ? 'bg-blue-50 border-2 border-blue-200 shadow-md scale-105' 
                    : isOtherHovered 
                      ? 'bg-gray-50 opacity-50' 
                      : 'hover:bg-gray-50'
                }`}
                onMouseEnter={() => {
                  setHoveredIndex(index);
                  setHoveredData({ key, value, percentage });
                }}
                onMouseLeave={() => {
                  setHoveredIndex(null);
                  setHoveredData(null);
                }}
              >
                <div 
                  className={`rounded-full shadow-sm border-2 border-white transition-all duration-300 ${
                    isHovered ? 'w-5 h-5' : 'w-4 h-4'
                  }`}
                  style={{ backgroundColor: colors[index % colors.length].hex }}
                ></div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium text-gray-700 truncate transition-all duration-300 ${
                    isHovered ? 'font-bold' : ''
                  }`}>
                    {key}
                  </div>
                  <div className={`text-xs text-gray-500 transition-all duration-300 ${
                    isHovered ? 'text-gray-700 font-semibold' : ''
                  }`}>
                    {value.toLocaleString()} ({percentage}%)
                  </div>
                </div>
                {isHovered && (
                  <div className="text-blue-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Modern Vertical Bar Chart with Dynamic Hover Effects
  const VerticalBarChart = ({ data, colorScheme = "gradient" }) => {
    if (!data || Object.keys(data).length === 0) return <EmptyChart />;

    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [totalValue, setTotalValue] = useState(0);

    const maxValue = Math.max(...Object.values(data));
    const sortedData = Object.entries(data).sort(([,a], [,b]) => b - a).slice(0, 8);
    const total = sortedData.reduce((sum, [, value]) => sum + value, 0);
    
    React.useEffect(() => {
      setTotalValue(total);
    }, [total]);
    
    return (
      <div className="h-80 relative">
        {/* Dynamic title with hover info */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-center mb-4">
          <div className="transition-all duration-300">
            {hoveredIndex !== null ? (
              <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                <div className="text-sm font-semibold text-blue-800">
                  {sortedData[hoveredIndex][0]}
                </div>
                <div className="text-lg font-bold text-blue-900">
                  {sortedData[hoveredIndex][1].toLocaleString()}
                </div>
                <div className="text-xs text-blue-600">
                  {((sortedData[hoveredIndex][1] / total) * 100).toFixed(1)}% of total
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-600">
                <div className="font-semibold">Total Cases</div>
                <div className="text-lg font-bold text-gray-800">{total.toLocaleString()}</div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-end justify-center space-x-4 h-full px-4 pb-16 pt-20">
          {sortedData.map(([key, value], index) => {
            const height = maxValue > 0 ? (value / maxValue) * 150 : 0;
            const hue = (index * 45) % 360;
            const isHovered = hoveredIndex === index;
            const isOtherHovered = hoveredIndex !== null && hoveredIndex !== index;
            const percentage = ((value / total) * 100).toFixed(1);
            
            return (
              <div 
                key={key} 
                className="flex flex-col items-center cursor-pointer transition-all duration-300"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  transform: isHovered ? 'scale(1.05)' : isOtherHovered ? 'scale(0.95)' : 'scale(1)',
                  opacity: isOtherHovered ? 0.6 : 1
                }}
              >
                <div className="relative mb-3">
                  {/* Dynamic value label above bar */}
                  <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                    isHovered ? 'text-blue-700 font-bold -top-10' : 'text-gray-700'
                  }`}>
                    {value.toLocaleString()}
                    {isHovered && (
                      <div className="text-xs font-normal text-blue-600 mt-1">
                        {percentage}%
                      </div>
                    )}
                  </div>
                  
                  {/* Enhanced Bar with animations */}
                  <div
                    className="rounded-t-lg transition-all duration-500 ease-out relative overflow-hidden"
                    style={{
                      width: isHovered ? '56px' : '48px',
                      height: `${isHovered ? height + 10 : height}px`,
                      background: isHovered 
                        ? `linear-gradient(to top, hsl(${hue}, 85%, 45%), hsl(${hue}, 85%, 65%), hsl(${hue}, 85%, 75%))`
                        : `linear-gradient(to top, hsl(${hue}, 70%, 50%), hsl(${hue}, 70%, 60%))`,
                      boxShadow: isHovered 
                        ? '0 10px 30px rgba(0,0,0,0.2), 0 0 20px rgba(59, 130, 246, 0.3)' 
                        : '0 4px 15px rgba(0,0,0,0.1)',
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    {/* Animated shine effect on hover */}
                    {isHovered && (
                      <div 
                        className="absolute inset-0 bg-gradient-to-t from-transparent via-white to-transparent opacity-20 animate-pulse"
                        style={{ animation: `shine 2s ease-in-out infinite` }}
                      />
                    )}
                    
                    {/* Progress fill animation */}
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/20 to-transparent transition-all duration-1000"
                      style={{ 
                        height: '100%',
                        transform: `scaleY(${isHovered ? 1 : 0.8})`,
                        transformOrigin: 'bottom'
                      }}
                    />
                  </div>
                  
                  {/* Enhanced floating tooltip */}
                  {isHovered && (
                    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl z-20 whitespace-nowrap">
                      <div className="font-semibold">{key}</div>
                      <div className="text-blue-300">{value.toLocaleString()} cases</div>
                      <div className="text-gray-300">{percentage}% of total</div>
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  )}
                </div>
                
                {/* Enhanced age range label */}
                <div className={`text-xs font-medium text-center whitespace-nowrap mt-2 transition-all duration-300 ${
                  isHovered ? 'text-blue-700 font-bold text-sm' : 'text-gray-700'
                }`}>
                  {key}
                  {isHovered && (
                    <div className="flex items-center justify-center mt-1">
                      <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add CSS animation for shine effect */}
        <style jsx>{`
          @keyframes shine {
            0% { transform: translateX(-100%) skewX(-15deg); }
            100% { transform: translateX(200%) skewX(-15deg); }
          }
        `}</style>
      </div>
    );
  };

  // Modern Line Chart (simplified)
  const LineChart = ({ data, colorScheme = "blue" }) => {
    if (!data || Object.keys(data).length === 0) return <EmptyChart />;

    const maxValue = Math.max(...Object.values(data));
    const minValue = Math.min(...Object.values(data));
    const range = maxValue - minValue || 1;
    
    const points = Object.entries(data).map(([key, value], index, arr) => {
      const x = (index / (arr.length - 1)) * 300;
      const y = 150 - ((value - minValue) / range) * 120;
      return { x, y, value, key };
    });

    const pathData = points.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x},${point.y}`
    ).join(' ');

    return (
      <div className="h-48 relative">
        <svg viewBox="0 0 300 150" className="w-full h-full">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="30" height="15" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 15" fill="none" stroke="#f3f4f6" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="300" height="150" fill="url(#grid)" />
          
          {/* Area under curve */}
          <path
            d={`${pathData} L 300,150 L 0,150 Z`}
            fill="url(#gradient)"
            fillOpacity="0.2"
          />
          
          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-sm"
          />
          
          {/* Data points */}
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#3b82f6"
              stroke="white"
              strokeWidth="2"
              className="drop-shadow-sm hover:r-6 transition-all duration-200"
            />
          ))}
          
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1"/>
            </linearGradient>
          </defs>
        </svg>
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

    const totalRecords = analyticsData.total_records || summaryData.total_accidents;
    const peakHour = summaryData.peak_accident_hour || analyticsData.peak_accident_hour || 'N/A';
    const commonCollision = summaryData.most_common_collision || analyticsData.most_common_collision || 'N/A';
    const avgIncomeImpact = summaryData.avg_income_impact || analyticsData.avg_income_impact || 0;

    return (
      <div className="space-y-8">
        {/* Data Period Info - Compact & Official */}
        {analyticsData.data_period && (
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 mb-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      {filters.start_date || filters.end_date ? 'Filtered Period' : 'Dataset Coverage'}
                    </span>
                    <div className={`w-2 h-2 rounded-full animate-pulse ${
                      filters.start_date || filters.end_date ? 'bg-orange-500' : 'bg-green-500'
                    }`}></div>
                  </div>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-lg font-bold text-gray-900">
                      {(() => {
                        const startDate = filters.start_date || analyticsData.data_period.start_date;
                        return new Date(startDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        });
                      })()}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className={`w-8 h-0.5 rounded-full ${
                        filters.start_date || filters.end_date 
                          ? 'bg-gradient-to-r from-orange-500 to-red-500' 
                          : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                      }`}></div>
                      <svg className={`w-4 h-4 ${
                        filters.start_date || filters.end_date ? 'text-orange-500' : 'text-blue-500'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <div className={`w-8 h-0.5 rounded-full ${
                        filters.start_date || filters.end_date 
                          ? 'bg-gradient-to-r from-orange-500 to-red-500' 
                          : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                      }`}></div>
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      {(() => {
                        const endDate = filters.end_date || analyticsData.data_period.end_date;
                        return new Date(endDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        });
                      })()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center space-x-2 text-xs text-gray-500 mb-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Last Updated</span>
                </div>
                <div className="text-sm font-medium text-gray-700">
                  {new Date(analyticsData.generated_at).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })} • {new Date(analyticsData.generated_at).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </div>
              </div>
            </div>
            
            {/* Duration Badge */}
            <div className="mt-3 flex justify-center">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                filters.start_date || filters.end_date 
                  ? 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border-orange-200/50' 
                  : 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200/50'
              }`}>
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
                </svg>
                {(() => {
                  const startDate = new Date(filters.start_date || analyticsData.data_period.start_date);
                  const endDate = new Date(filters.end_date || analyticsData.data_period.end_date);
                  const diffTime = Math.abs(endDate - startDate);
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  const years = Math.floor(diffDays / 365);
                  const months = Math.floor((diffDays % 365) / 30);
                  const periodType = filters.start_date || filters.end_date ? 'filtered period' : 'analysis period';
                  return `${years > 0 ? `${years}y ` : ''}${months > 0 ? `${months}m` : `${diffDays}d`} ${periodType}`;
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Modern Chart Grid with Mixed Types */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Row 1: Large charts */}
          <div className="lg:col-span-7">
            <ChartContainer title="🏥 Medical Outcomes Distribution" size="default">
              <DonutChart data={medicalFactors.outcomesDist} colorScheme="mixed" />
            </ChartContainer>
          </div>
          <div className="lg:col-span-5">
            <ChartContainer title="👥 Age Demographics" size="default">
              <VerticalBarChart data={demographics.ageGroups} colorScheme="gradient" />
            </ChartContainer>
          </div>

          {/* Row 2: Medium charts */}
          <div className="lg:col-span-6">
            <ChartContainer title="🚗 Collision Type Analysis" size="default">
              <HorizontalBarChart data={accidentChars.collisionTypes} colorScheme="red" />
            </ChartContainer>
          </div>
          <div className="lg:col-span-3">
            <ChartContainer title="⚧ Gender Split" size="small">
              <DonutChart data={demographics.genderDist} colorScheme="mixed" />
            </ChartContainer>
          </div>
          <div className="lg:col-span-3">
            <ChartContainer title="🌍 Ethnicity" size="small">
              <DonutChart data={demographics.ethnicityDist} colorScheme="mixed" />
            </ChartContainer>
          </div>

          {/* Row 3: Full width chart */}
          <div className="lg:col-span-12">
            <ChartContainer title="🎓 Education Level Distribution" size="default">
              <HorizontalBarChart data={demographics.educationDist} colorScheme="purple" />
            </ChartContainer>
          </div>
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
      <div className="space-y-8">
        {/* Temporal Analysis Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Monthly Trends - Line Chart */}
          <div className="lg:col-span-8">
            <ChartContainer title="📅 Monthly Accident Trends" size="default">
              <LineChart data={monthlyData} colorScheme="blue" />
            </ChartContainer>
          </div>

          {/* Day of Week - Donut Chart */}
          <div className="lg:col-span-4">
            <ChartContainer title="📊 Weekly Pattern" size="default">
              <DonutChart data={dailyData} colorScheme="mixed" />
            </ChartContainer>
          </div>

          {/* Hourly Distribution - Full Width */}
          <div className="lg:col-span-12">
            <ChartContainer title="🕒 24-Hour Accident Pattern" size="default">
              <HorizontalBarChart data={accidentChars.hourlyDistribution} colorScheme="orange" />
            </ChartContainer>
          </div>
        </div>

        {/* Key Insights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-red-50 via-white to-red-50 p-6 rounded-2xl border border-red-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-red-700 mb-1">Peak Month</h4>
                <p className="text-xl font-bold text-red-800">{getTopEntry(monthlyData)[0]}</p>
                <p className="text-sm text-red-600">{getTopEntry(monthlyData)[1]} incidents</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 via-white to-orange-50 p-6 rounded-2xl border border-orange-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-orange-700 mb-1">Peak Day</h4>
                <p className="text-xl font-bold text-orange-800">{getTopEntry(dailyData)[0]}</p>
                <p className="text-sm text-orange-600">{getTopEntry(dailyData)[1]} incidents</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6 rounded-2xl border border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-blue-700 mb-1">Peak Hour</h4>
                <p className="text-xl font-bold text-blue-800">
                  {Object.keys(accidentChars.hourlyDistribution).length > 0 
                    ? `${getTopEntry(accidentChars.hourlyDistribution)[0]}:00`
                    : 'N/A'
                  }
                </p>
                <p className="text-sm text-blue-600">
                  {Object.keys(accidentChars.hourlyDistribution).length > 0 
                    ? `${getTopEntry(accidentChars.hourlyDistribution)[1]} incidents`
                    : 'No data'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'overview', label: 'Overview', component: renderOverview },
    { id: 'temporal', label: 'Temporal Trends', component: renderTemporalTrends },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Filter Sidebar */}
      <FilterSidebar />
      
      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-0' : 'ml-0'}`}>
        {/* Professional Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Analytics Dashboard</h1>
                  <p className="text-sm text-gray-500">Road Accident Intelligence</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Live Data</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Last updated: {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Secondary Navigation - Tab Bar */}
          <div className="border-t border-gray-200/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-center py-3">
                <nav className="flex space-x-1 bg-gray-100/50 rounded-xl p-1 backdrop-blur-sm">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                        activeTab === tab.id 
                        ? 'bg-white text-blue-600 shadow-md border border-blue-100' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                      }`}
                    >
                      {tab.id === 'overview' && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      )}
                      {tab.id === 'temporal' && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      <span>{tab.label}</span>
                      {activeTab === tab.id && (
                        <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-blue-600 rounded-full"></div>
                      )}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="text-center mb-16 relative">
            {/* Background decoration */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-10 left-1/4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
              <div className="absolute top-20 right-1/4 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
              <div className="absolute -top-8 left-1/3 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
            </div>
            
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full text-sm font-medium mb-8 shadow-lg border border-blue-200/50 backdrop-blur-sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Advanced Analytics Platform
              <div className="ml-3 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Road Accident
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient-x"> Intelligence</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-5xl mx-auto leading-relaxed mb-8">
              Comprehensive analysis of road accident data with insights into patterns, demographics, 
              medical outcomes, and socioeconomic impacts for evidence-based decision making.
            </p>

            {/* Key Statistics Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-12">
              <StatCard
                title="Total Records"
                value={(analyticsData?.total_records || summaryData?.totalAccidents || 0).toLocaleString()}
                subtitle="Accident cases analyzed"
                color="blue"
                icon={
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                }
              />
              <StatCard
                title="Peak Accident Hour"
                value={(() => {
                  const peakHour = summaryData?.peak_accident_hour || analyticsData?.peak_accident_hour;
                  if (peakHour !== undefined && peakHour !== null) {
                    return `${peakHour}:00`;
                  }
                  // Find peak hour from hourly distribution
                  if (Object.keys(accidentChars.hourlyDistribution).length > 0) {
                    const peakEntry = Object.entries(accidentChars.hourlyDistribution)
                      .sort((a, b) => b[1] - a[1])[0];
                    return `${peakEntry[0]}:00`;
                  }
                  return 'N/A';
                })()}
                subtitle={(() => {
                  if (Object.keys(accidentChars.hourlyDistribution).length > 0) {
                    const peakEntry = Object.entries(accidentChars.hourlyDistribution)
                      .sort((a, b) => b[1] - a[1])[0];
                    return `${peakEntry[1]} accidents`;
                  }
                  return 'No data available';
                })()}
                color="red"
                icon={
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <StatCard
                title="Most Common Collision"
                value={(() => {
                  const commonCollision = summaryData?.most_common_collision || analyticsData?.most_common_collision;
                  if (commonCollision) {
                    return commonCollision;
                  }
                  // Find most common collision from collision types
                  if (Object.keys(accidentChars.collisionTypes).length > 0) {
                    const topEntry = Object.entries(accidentChars.collisionTypes)
                      .sort((a, b) => b[1] - a[1])[0];
                    return topEntry[0];
                  }
                  return 'N/A';
                })()}
                subtitle={(() => {
                  if (Object.keys(accidentChars.collisionTypes).length > 0) {
                    const topEntry = Object.entries(accidentChars.collisionTypes)
                      .sort((a, b) => b[1] - a[1])[0];
                    return `${topEntry[1]} cases`;
                  }
                  return 'No data available';
                })()}
                color="yellow"
                icon={
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                }
              />
            </div>
          </div>

        {/* Tab Content */}
        <div className="tab-content py-8 px-4 mt-12">
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
                    {Object.keys(demographics.ageGroups).length === 0 && Object.keys(demographics.genderDist).length === 0 && (
                      <li className="text-gray-500 text-center py-4">
                        <div className="bg-gray-100 rounded-lg p-4">
                          <span>📋 No demographic data available for current filters</span>
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
           
                    {Object.keys(accidentChars.hourlyDistribution).length === 0 && Object.keys(accidentChars.collisionTypes).length === 0 && Object.keys(accidentChars.roadCategories).length === 0 && (
                      <li className="text-gray-500 text-center py-4">
                        <div className="bg-gray-100 rounded-lg p-4">
                          <span>📊 No accident condition data available for current filters</span>
                        </div>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </ChartContainer>
        )}
        </main>

        {/* Professional Footer */}
        <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200/50 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <span className="text-lg font-bold text-gray-900">Analytics Platform</span>
                </div>
                <p className="text-gray-600 text-sm">
                  Advanced road accident analytics for evidence-based decision making and improved public safety.
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Analytics</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>Demographic Analysis</li>
                  <li>Temporal Patterns</li>
                  <li>Risk Assessment</li>
                  <li>Outcome Prediction</li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">System Status</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Data Pipeline: Active</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Analytics Engine: Online</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-gray-600">Last Sync: {new Date().toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} Road Safety Analytics Platform. All rights reserved.
              </p>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <span className="text-xs text-gray-400">Powered by Advanced Analytics</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AccidentEDA;