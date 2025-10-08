// Backend data translation utility
// Maps backend response values to translation keys

import { t } from './translations';

// Medical outcome translations
export const medicalOutcomeTranslations = {
  'Total': () => t('total'),
  'Partial Recovery': () => t('partialRecovery'),
  'Complete Recovery': () => t('completeRecovery'),
  'Further Interventions': () => t('furtherInterventions'),
};

// Age group translations
export const ageGroupTranslations = {
  'Under 18': () => t('under18'),
  '18-25': () => t('age18to25'),
  '26-35': () => t('age26to35'),
  '36-45': () => t('age36to45'),
  '46-55': () => t('age46to55'),
  '56+': () => t('age56Plus'),
  'Total Cases': () => t('totalCases'),
};

// Collision type translations
export const collisionTypeTranslations = {
  'Fall From Vehicle': () => t('fallFromVehicle'),
  'Unknown': () => t('unknown'),
  'Animal': () => t('animal'),
  'Motorbike': () => t('motorbike'),
  'Three Wheeler': () => t('threeWheeler'),
  'Heavy Vehicle': () => t('heavyVehicle'),
};

// Gender translations
export const genderTranslations = {
  'Male': () => t('male'),
  'Female': () => t('female'),
  'Total': () => t('total'),
};

// Ethnicity translations
export const ethnicityTranslations = {
  'Tamil': () => t('tamil'),
  'Sinhalese': () => t('sinhalese'),
  'Moor': () => t('moor'),
  'Total': () => t('total'),
};

// Education level translations
export const educationLevelTranslations = {
  'Victim not willing to share/ Unable to respond/ Early Discharge': () => t('unableToRespondEarlyDischarge'),
  'O/L or A/L': () => t('olOrAl'),
  'Grade 5': () => t('grade5'),
  'Under Graduate': () => t('underGraduate'),
  'Post Graduate': () => t('postGraduate'),
};

// General analytics translations
export const analyticsTranslations = {
  'Live': () => t('live'),
  'years': () => t('years'),
  'highest risk': () => t('highestRisk'),
  'of cases': () => t('ofCases'),
  'Peak time': () => t('peakTime'),
  'Common collision': () => t('commonCollision'),
};

// Function to translate backend data values
export const translateBackendValue = (value, category = null) => {
  if (!value) return value;
  
  // Remove percentage and count information for translation
  const cleanValue = value.toString().split('(')[0].trim();
  
  let translationMap;
  switch (category) {
    case 'medicalOutcome':
      translationMap = medicalOutcomeTranslations;
      break;
    case 'ageGroup':
      translationMap = ageGroupTranslations;
      break;
    case 'collisionType':
      translationMap = collisionTypeTranslations;
      break;
    case 'gender':
      translationMap = genderTranslations;
      break;
    case 'ethnicity':
      translationMap = ethnicityTranslations;
      break;
    case 'educationLevel':
      translationMap = educationLevelTranslations;
      break;
    case 'analytics':
      translationMap = analyticsTranslations;
      break;
    default:
      // Try all translation maps
      translationMap = {
        ...medicalOutcomeTranslations,
        ...ageGroupTranslations,
        ...collisionTypeTranslations,
        ...genderTranslations,
        ...ethnicityTranslations,
        ...educationLevelTranslations,
        ...analyticsTranslations,
      };
  }
  
  if (translationMap[cleanValue]) {
    const translatedValue = translationMap[cleanValue]();
    // Preserve percentage and count information
    const extraInfo = value.toString().split('(')[1];
    return extraInfo ? `${translatedValue} (${extraInfo}` : translatedValue;
  }
  
  return value;
};

// Function to automatically process backend response data
export const processBackendChartData = (rawData) => {
  if (!rawData) return null;
  
  const processedData = {};
  
  // Process each data category from backend
  Object.keys(rawData).forEach(key => {
    const data = rawData[key];
    
    switch (key) {
      case 'medical_outcomes':
      case 'discharge_outcomes':
        processedData[key] = Array.isArray(data) ? data.map(item => ({
          ...item,
          name: translateBackendValue(item.name || item.outcome, 'medicalOutcome'),
          label: translateBackendValue(item.label || item.outcome, 'medicalOutcome'),
          outcome: translateBackendValue(item.outcome, 'medicalOutcome')
        })) : data;
        break;
        
      case 'age_demographics':
      case 'age_distribution':
        processedData[key] = Array.isArray(data) ? data.map(item => ({
          ...item,
          name: translateBackendValue(item.name || item.age_group, 'ageGroup'),
          label: translateBackendValue(item.label || item.age_group, 'ageGroup'),
          age_group: translateBackendValue(item.age_group, 'ageGroup')
        })) : data;
        break;
        
      case 'collision_types':
      case 'collision_with':
        processedData[key] = Array.isArray(data) ? data.map(item => ({
          ...item,
          name: translateBackendValue(item.name || item.collision_type, 'collisionType'),
          label: translateBackendValue(item.label || item.collision_type, 'collisionType'),
          collision_type: translateBackendValue(item.collision_type, 'collisionType')
        })) : data;
        break;
        
      case 'gender_split':
      case 'gender_distribution':
        processedData[key] = Array.isArray(data) ? data.map(item => ({
          ...item,
          name: translateBackendValue(item.name || item.gender, 'gender'),
          label: translateBackendValue(item.label || item.gender, 'gender'),
          gender: translateBackendValue(item.gender, 'gender')
        })) : data;
        break;
        
      case 'ethnicity':
      case 'ethnicity_distribution':
        processedData[key] = Array.isArray(data) ? data.map(item => ({
          ...item,
          name: translateBackendValue(item.name || item.ethnicity, 'ethnicity'),
          label: translateBackendValue(item.label || item.ethnicity, 'ethnicity'),
          ethnicity: translateBackendValue(item.ethnicity, 'ethnicity')
        })) : data;
        break;
        
      case 'education_levels':
      case 'education_distribution':
        processedData[key] = Array.isArray(data) ? data.map(item => ({
          ...item,
          name: translateBackendValue(item.name || item.education_level, 'educationLevel'),
          label: translateBackendValue(item.label || item.education_level, 'educationLevel'),
          education_level: translateBackendValue(item.education_level, 'educationLevel')
        })) : data;
        break;
        
      default:
        // For other data, try to translate common fields
        if (Array.isArray(data)) {
          processedData[key] = data.map(item => {
            const processedItem = { ...item };
            if (item.name) processedItem.name = translateBackendValue(item.name);
            if (item.label) processedItem.label = translateBackendValue(item.label);
            if (item.category) processedItem.category = translateBackendValue(item.category);
            return processedItem;
          });
        } else {
          processedData[key] = data;
        }
    }
  });
  
  return processedData;
};

// New function to handle raw data values directly (for your use case)
export const translateDataValue = (value) => {
  if (!value || typeof value !== 'string') return value;
  
  // Try to translate the value using all available categories
  const allTranslations = {
    ...medicalOutcomeTranslations,
    ...ageGroupTranslations,
    ...collisionTypeTranslations,
    ...genderTranslations,
    ...ethnicityTranslations,
    ...educationLevelTranslations,
    ...analyticsTranslations,
  };
  
  // Clean the value (remove percentages and counts)
  const cleanValue = value.split('(')[0].trim();
  
  if (allTranslations[cleanValue]) {
    const translatedValue = allTranslations[cleanValue]();
    // Preserve percentage and count information
    const extraInfo = value.split('(')[1];
    return extraInfo ? `${translatedValue} (${extraInfo}` : translatedValue;
  }
  
  return value;
};

// Function to translate chart data arrays
export const translateChartData = (data, category) => {
  if (!Array.isArray(data)) return data;
  
  return data.map(item => {
    if (typeof item === 'object' && item !== null) {
      const translatedItem = { ...item };
      
      // Translate common keys
      if (item.name) {
        translatedItem.name = translateBackendValue(item.name, category);
      }
      if (item.label) {
        translatedItem.label = translateBackendValue(item.label, category);
      }
      if (item.category) {
        translatedItem.category = translateBackendValue(item.category, category);
      }
      
      return translatedItem;
    }
    
    return translateBackendValue(item, category);
  });
};

// Function to translate summary statistics
export const translateSummaryStats = (stats) => {
  if (!stats || typeof stats !== 'object') return stats;
  
  const translatedStats = {};
  
  Object.keys(stats).forEach(key => {
    const translatedKey = translateBackendValue(key, 'analytics');
    const translatedValue = typeof stats[key] === 'string' 
      ? translateBackendValue(stats[key], 'analytics')
      : stats[key];
    
    translatedStats[translatedKey] = translatedValue;
  });
  
  return translatedStats;
};

// Main function to process complete backend response
export const processBackendResponse = (backendData) => {
  if (!backendData) return null;
  
  return {
    analytics: processBackendChartData(backendData.analytics || backendData),
    summary: translateSummaryStats(backendData.summary),
    raw: backendData // Keep original data for reference
  };
};

// Helper function for chart tooltips - automatically translates values
export const createTranslatedTooltip = (category) => {
  return (value, name, props) => {
    const translatedName = translateBackendValue(name, category);
    const translatedValue = typeof value === 'string' ? translateBackendValue(value, category) : value;
    return [translatedValue, translatedName];
  };
};

// Helper function for chart labels - automatically translates labels
export const createTranslatedLabel = (category) => {
  return (value) => translateBackendValue(value, category);
};