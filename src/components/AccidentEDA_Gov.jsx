import React, { useState, useEffect } from 'react';
import API from '../utils/api';

// Fetch analytics data from backend
const fetchAnalyticsData = async () => {
  try {
    const response = await API.get('/govDash');
    return response.data; 
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    throw error;
  }
};

// Fetch summary data from backend
const fetchSummaryData = async () => {
  try {
    const response = await API.get('/govDash/summary');
    return response.data; 
  } catch (error) {
    console.error('Error fetching summary data:', error);
    throw error;
  }
};

const AccidentEDA_GOV = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-20 w-20 border-4 border-slate-200 border-t-blue-600 mb-6 shadow-lg"></div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Loading Analytics Dashboard</h2>
          <p className="text-slate-600">Fetching accident data from secure government servers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl border-l-4 border-red-600 p-8 max-w-lg w-full">
          <div className="flex items-center mb-6">
            <div className="bg-red-100 p-3 rounded-full mr-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-800">System Error</h3>
          </div>
          <p className="text-slate-700 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Reload Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!analyticsData || !summaryData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl border-l-4 border-amber-500 p-8 max-w-lg w-full text-center">
          <div className="bg-amber-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-4">No Data Available</h3>
          <p className="text-slate-600">Please ensure the backend system is operational and contains data records.</p>
        </div>
      </div>
    );
  }

  // Extract data from backend response
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

  const StatCard = ({ title, value, subtitle, icon, gradient }) => (
    <div className={`bg-gradient-to-br ${gradient} p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 border border-white/20`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-white/90 mb-1 uppercase tracking-wide">{title}</p>
          <h3 className="text-4xl font-bold text-white drop-shadow-md">{value}</h3>
        </div>
        <div className="bg-white/25 p-3 rounded-xl backdrop-blur-sm shadow-inner">
          {icon}
        </div>
      </div>
      {subtitle && <p className="text-sm text-white/85 mt-2 font-medium">{subtitle}</p>}
    </div>
  );

  const ChartSection = ({ title, children, icon }) => (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 flex items-center">
        <div className="bg-blue-600 p-2.5 rounded-xl mr-3 shadow-md">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
      <div className="p-6 bg-gradient-to-br from-white to-slate-50">
        {children}
      </div>
    </div>
  );

  const BarChart = ({ data }) => {
    if (!data || Object.keys(data).length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-40 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
          <svg className="w-12 h-12 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-slate-500 font-medium">No data available</p>
        </div>
      );
    }

    const maxValue = Math.max(...Object.values(data));
    const sortedData = Object.entries(data).sort((a, b) => b[1] - a[1]);
    
    return (
      <div className="space-y-3.5">
        {sortedData.map(([key, value], index) => {
          const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
          return (
            <div key={key} className="group">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-semibold text-slate-700 tracking-wide">{key}</span>
                <span className="text-sm font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">{value}</span>
              </div>
              <div className="relative h-9 bg-gradient-to-r from-slate-100 to-slate-50 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="absolute h-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-full transition-all duration-700 ease-out flex items-center justify-end px-3 shadow-md"
                  style={{ width: `${percentage}%` }}
                >
                  <span className="text-xs font-bold text-white drop-shadow-sm">{Math.round(percentage)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const getTopEntry = (obj) => {
    const entries = Object.entries(obj);
    if (entries.length === 0) return ['N/A', 0];
    return entries.sort((a, b) => b[1] - a[1])[0];
  };

  // Overview Content
  const totalRecords = analyticsData.total_records || summaryData.total_accidents || 0;
  const peakHour = summaryData.peak_accident_hour || analyticsData.peak_accident_hour || 'N/A';
  const commonCollision = summaryData.most_common_collision || analyticsData.most_common_collision || 'N/A';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 shadow-2xl">
        <div className="container mx-auto px-6 py-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-lg">
                Road Accident Analytics System
              </h1>
              <p className="text-slate-300 text-lg font-medium">
                Government Dashboard for Traffic Safety Intelligence & Data-Driven Policy Making
              </p>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 border border-white/30 shadow-xl">
              <svg className="w-14 h-14 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Overview */}
      <div className="container mx-auto px-6 py-10">
        <div className="space-y-8">
          {/* Data Period Banner */}
          {analyticsData.data_period && (
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-2xl p-8 shadow-xl border border-blue-500/20">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center">
                  <div className="bg-white/20 p-3 rounded-xl mr-4 backdrop-blur-sm shadow-inner">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-100 uppercase tracking-wider">Analysis Period</p>
                    <p className="text-2xl font-bold drop-shadow-md">{analyticsData.data_period.start_date} — {analyticsData.data_period.end_date}</p>
                  </div>
                </div>
                <div className="text-right bg-white/10 px-5 py-3 rounded-xl backdrop-blur-sm">
                  <p className="text-sm text-blue-100 uppercase tracking-wide">Generated</p>
                  <p className="text-sm font-semibold">{new Date(analyticsData.generated_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          {/* Key Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
              title="Total Accident Cases" 
              value={totalRecords.toLocaleString()} 
              subtitle="Records analyzed in database"
              gradient="from-blue-600 via-blue-700 to-blue-800"
              icon={<svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
            />
            <StatCard 
              title="Peak Accident Hour" 
              value={peakHour !== 'N/A' ? `${peakHour}:00` : 'N/A'}
              subtitle={Object.keys(accidentChars.hourlyDistribution).length > 0 ? 
                `${getTopEntry(accidentChars.hourlyDistribution)[1]} incidents recorded` : 'No temporal data'}
              gradient="from-red-600 via-red-700 to-red-800"
              icon={<svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <StatCard 
              title="Common Collision Type" 
              value={commonCollision}
              subtitle={Object.keys(accidentChars.collisionTypes).length > 0 ? 
                `${getTopEntry(accidentChars.collisionTypes)[1]} occurrences` : 'No collision data'}
              gradient="from-amber-600 via-amber-700 to-amber-800"
              icon={<svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" /></svg>}
            />
          </div>

          {/* Main Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartSection 
              title="Medical Outcomes" 
              icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
            >
              <BarChart data={medicalFactors.outcomesDist} />
            </ChartSection>

            <ChartSection 
              title="Age Group Distribution" 
              icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
            >
              <BarChart data={demographics.ageGroups} />
            </ChartSection>

            <ChartSection 
              title="Collision Types" 
              icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
            >
              <BarChart data={accidentChars.collisionTypes} />
            </ChartSection>
                    
            <ChartSection 
              title="Gender Distribution" 
              icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
            >
              <BarChart data={demographics.genderDist} />
            </ChartSection>

            <ChartSection 
              title="Ethnicity Distribution" 
              icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            >
              <BarChart data={demographics.ethnicityDist} />
            </ChartSection>

            <ChartSection 
              title="Education Levels" 
              icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
            >
              <BarChart data={demographics.educationDist} />
            </ChartSection>
          </div>

          {/* Key Insights Summary */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4">
              <h3 className="text-xl font-bold text-white">Critical Insights & Risk Factors</h3>
            </div>
            <div className="p-8 bg-gradient-to-br from-white to-slate-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-l-4 border-blue-600 bg-gradient-to-br from-blue-50 to-blue-100/50 p-6 rounded-r-xl shadow-md">
                  <h5 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    High-Risk Demographics
                  </h5>
                  <ul className="space-y-3 text-sm">
                    {Object.keys(demographics.ageGroups).length > 0 && (
                      <li className="flex items-start">
                        <span className="font-bold text-blue-600 mr-2">•</span>
                        <span className="text-slate-700">Most affected age group: <strong className="text-slate-900">{Object.entries(demographics.ageGroups).sort((a,b) => b[1] - a[1])[0][0]} years</strong></span>
                      </li>
                    )}
                    {Object.keys(demographics.genderDist).length > 0 && (
                      <li className="flex items-start">
                        <span className="font-bold text-blue-600 mr-2">•</span>
                        <span className="text-slate-700">Primary gender affected: <strong className="text-slate-900">{Object.entries(demographics.genderDist).sort((a,b) => b[1] - a[1])[0][0]}</strong> ({Math.round((Object.entries(demographics.genderDist).sort((a,b) => b[1] - a[1])[0][1] / (analyticsData.total_records || 1)) * 100)}%)</span>
                      </li>
                    )}
                    {Object.keys(demographics.occupationDist).length > 0 && (
                      <li className="flex items-start">
                        <span className="font-bold text-blue-600 mr-2">•</span>
                        <span className="text-slate-700">Most common occupation: <strong className="text-slate-900">{Object.entries(demographics.occupationDist).sort((a,b) => b[1] - a[1])[0][0]}</strong></span>
                      </li>
                    )}
                    {Object.keys(demographics.ageGroups).length === 0 && Object.keys(demographics.genderDist).length === 0 && Object.keys(demographics.occupationDist).length === 0 && (
                      <li className="text-slate-500 italic">No demographic data available for analysis</li>
                    )}
                  </ul>
                </div>

                <div className="border-l-4 border-red-600 bg-gradient-to-br from-red-50 to-red-100/50 p-6 rounded-r-xl shadow-md">
                  <h5 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    Critical Risk Conditions
                  </h5>
                  <ul className="space-y-3 text-sm">
                    {Object.keys(accidentChars.hourlyDistribution).length > 0 && (
                      <li className="flex items-start">
                        <span className="font-bold text-red-600 mr-2">•</span>
                        <span className="text-slate-700">Peak danger time: <strong className="text-slate-900">{Object.entries(accidentChars.hourlyDistribution).sort((a,b) => b[1] - a[1])[0][0]}:00 hours</strong></span>
                      </li>
                    )}
                    {Object.keys(accidentChars.collisionTypes).length > 0 && (
                      <li className="flex items-start">
                        <span className="font-bold text-red-600 mr-2">•</span>
                        <span className="text-slate-700">Predominant collision: <strong className="text-slate-900">{Object.entries(accidentChars.collisionTypes).sort((a,b) => b[1] - a[1])[0][0]}</strong></span>
                      </li>
                    )}
                    {Object.keys(accidentChars.roadCategories).length > 0 && (
                      <li className="flex items-start">
                        <span className="font-bold text-red-600 mr-2">•</span>
                        <span className="text-slate-700">High-risk road type: <strong className="text-slate-900">{Object.entries(accidentChars.roadCategories).sort((a,b) => b[1] - a[1])[0][0]}</strong></span>
                      </li>
                    )}
                    {Object.keys(accidentChars.hourlyDistribution).length === 0 && Object.keys(accidentChars.collisionTypes).length === 0 && Object.keys(accidentChars.roadCategories).length === 0 && (
                      <li className="text-slate-500 italic">No accident condition data available for analysis</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 mt-16 border-t-4 border-blue-600">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <p className="font-medium">© 2025 Government Road Safety Analytics System. All rights reserved.</p>
            <p className="font-semibold text-slate-300">Confidential Data - Authorized Personnel Only</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccidentEDA_GOV;