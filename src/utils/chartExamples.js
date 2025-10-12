// Example usage in your AccidentEDA component charts

// Import the helper functions
import { createTranslatedTooltip, createTranslatedLabel, translateBackendValue } from '../utils/dataTranslations';

// Example 1: Medical Outcomes Chart
const MedicalOutcomesChart = ({ data }) => {
  // Data is already processed by processBackendChartData, so names are translated
  return (
    <div className="chart-container">
      <h3>{t('medicalOutcomesDistribution')}</h3>
      <BarChart data={data.medical_outcomes || []}>
        <XAxis 
          dataKey="name" // Already translated by processBackendChartData
          tick={{ fontSize: 12 }}
        />
        <YAxis />
        <Tooltip 
          formatter={createTranslatedTooltip('medicalOutcome')} // Auto-translates tooltip values
          labelFormatter={createTranslatedLabel('medicalOutcome')} // Auto-translates labels
        />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

// Example 2: Age Demographics Chart
const AgeDemographicsChart = ({ data }) => {
  return (
    <div className="chart-container">
      <h3>{t('ageDemographics')}</h3>
      <PieChart>
        <Pie
          data={data.age_demographics || []} // Already processed with translated names
          dataKey="count"
          nameKey="name" // Already translated
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        />
        <Tooltip formatter={createTranslatedTooltip('ageGroup')} />
        <Legend />
      </PieChart>
    </div>
  );
};

// Example 3: Summary Statistics (automatically translated)
const SummaryStats = ({ data }) => {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <h3>{translateBackendValue('Total', 'analytics')}</h3>
        <p>{data.total || 0}</p>
      </div>
      <div className="stat-card">
        <h3>{translateBackendValue('Partial Recovery', 'medicalOutcome')}</h3>
        <p>{data.partial_recovery || 0}</p>
      </div>
      <div className="stat-card">
        <h3>{translateBackendValue('Complete Recovery', 'medicalOutcome')}</h3>
        <p>{data.complete_recovery || 0}</p>
      </div>
    </div>
  );
};

// Example 4: Dynamic data processing in your main component
const processRealBackendData = (backendResponse) => {
  // Your backend returns data like:
  // {
  //   medical_outcomes: [
  //     { name: "Partial Recovery", count: 2074 },
  //     { name: "Complete Recovery", count: 4 },
  //     { name: "Further Interventions", count: 1 }
  //   ],
  //   age_demographics: [
  //     { age_group: "26-35", count: 344 },
  //     { age_group: "36-45", count: 226 }
  //   ]
  // }
  
  // processBackendChartData automatically converts this to:
  // {
  //   medical_outcomes: [
  //     { name: "අර්ධ සුවය", count: 2074 }, // Translated to current language
  //     { name: "සම්පූර්ණ සුවය", count: 4 },
  //     { name: "වැඩිදුර මැදිහත්වීම්", count: 1 }
  //   ],
  //   age_demographics: [
  //     { age_group: "26-35", count: 344 }, // Age ranges stay the same
  //     { age_group: "36-45", count: 226 }
  //   ]
  // }
  
  return processBackendChartData(backendResponse);
};

// Example 5: Using with your existing chart data
const YourExistingChart = ({ analyticsData }) => {
  // The analyticsData is already processed, so you can use it directly
  const medicalOutcomes = analyticsData?.medical_outcomes || [];
  const ageGroups = analyticsData?.age_demographics || [];
  
  return (
    <div>
      {/* Chart with translated data */}
      <BarChart data={medicalOutcomes}>
        <XAxis dataKey="name" /> {/* Names are already translated */}
        <Bar dataKey="count" />
        <Tooltip 
          formatter={(value, name) => [
            value, 
            name // Name is already translated
          ]} 
        />
      </BarChart>
      
      {/* Display translated statistics */}
      <div className="summary">
        <h2>{t('keyInsightsSummary')}</h2>
        {medicalOutcomes.map((item, index) => (
          <div key={index}>
            <span>{item.name}</span>: <span>{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export {
  MedicalOutcomesChart,
  AgeDemographicsChart,
  SummaryStats,
  processRealBackendData,
  YourExistingChart
};