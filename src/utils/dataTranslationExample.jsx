// Example integration for AccidentEDA.jsx
// Add this import at the top of your AccidentEDA.jsx file

import { translateBackendValue, translateChartData, translateSummaryStats } from './dataTranslations';

// Example of how to use the translation functions in your component:

// 1. For translating medical outcomes data:
const processedMedicalOutcomes = analyticsData.medical_outcomes?.map(item => ({
  ...item,
  name: translateBackendValue(item.name, 'medicalOutcome'),
  label: translateBackendValue(item.label, 'medicalOutcome')
})) || [];

// 2. For translating age demographics:
const processedAgeDemographics = analyticsData.age_demographics?.map(item => ({
  ...item,
  age_group: translateBackendValue(item.age_group, 'ageGroup'),
  label: translateBackendValue(item.label, 'ageGroup')
})) || [];

// 3. For translating collision types:
const processedCollisionTypes = analyticsData.collision_types?.map(item => ({
  ...item,
  collision_type: translateBackendValue(item.collision_type, 'collisionType'),
  name: translateBackendValue(item.name, 'collisionType')
})) || [];

// 4. For translating gender data:
const processedGenderData = analyticsData.gender_split?.map(item => ({
  ...item,
  gender: translateBackendValue(item.gender, 'gender'),
  name: translateBackendValue(item.name, 'gender')
})) || [];

// 5. For translating ethnicity data:
const processedEthnicityData = analyticsData.ethnicity?.map(item => ({
  ...item,
  ethnicity: translateBackendValue(item.ethnicity, 'ethnicity'),
  name: translateBackendValue(item.name, 'ethnicity')
})) || [];

// 6. For translating education levels:
const processedEducationData = analyticsData.education_levels?.map(item => ({
  ...item,
  education_level: translateBackendValue(item.education_level, 'educationLevel'),
  name: translateBackendValue(item.name, 'educationLevel')
})) || [];

// 7. For translating summary statistics:
const processedSummaryStats = translateSummaryStats(summaryData);

// Usage in your JSX - replace the hardcoded values with translated ones:

// Instead of displaying raw backend values like:
// <div>{item.name}</div>

// Use the processed values:
// <div>{processedItem.name}</div>

// For chart data, you can use the translateChartData helper:
const chartData = translateChartData(rawChartData, 'medicalOutcome');

// // Example for Recharts:
// <BarChart data={processedMedicalOutcomes}>
//   <XAxis dataKey="name" />
//   <YAxis />
//   <Tooltip formatter={(value, name) => [value, translateBackendValue(name, 'medicalOutcome')]} />
//   <Bar dataKey="value" fill="#8884d8" />
// </BarChart>

// // For displaying statistics with translations:
// <div className="stat-card">
//   <h3>{translateBackendValue('Total Cases', 'analytics')}</h3>
//   <p>{processedSummaryStats.totalCases}</p>
// </div>

// <div className="stat-card">
//   <h3>{translateBackendValue('Partial Recovery', 'medicalOutcome')}</h3>
//   <p>{processedSummaryStats.partialRecovery}</p>
// </div>