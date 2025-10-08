// Multilingual support utility
// Currently supports English and Sinhala

const translations = {
  en: {
    // Common
    loading: "Loading...",
    search: "Search",
    close: "Close",
    error: "Error",
    success: "Success",
    cancel: "Cancel",
    confirm: "Confirm",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    view: "View",
    back: "Back",
    next: "Next",
    previous: "Previous",
    yes: "Yes",
    no: "No",
    
    // Navigation
    dashboard: "Dashboard",
    viewPatientData: "View Patient Data",
    getPrediction: "Get Prediction",
    logout: "Logout",
    doctorPortal: "Doctor Portal",
    roadAccidentCareSystem: "Road Accident Care System",
    secureHealthcareManagementSystem: "Secure healthcare management system",
    dontHaveAnAccountRegisterHere: "Don't have an account? Register here",
    online: "Online",
    currentlyOnline: "Currently Online",
    
    // Login & Auth
    login: "Login",
    email: "Email",
    password: "Password",
    selectLanguage: "Select Language",
    english: "English",
    sinhala: "සිංහල",
    tamil: "தமிழ்",
    rememberMe: "Remember Me",
    forgotPassword: "Forgot Password?",
    
    // Patient Data
    patientDetails: "Patient Details",
    fullName: "Full Name",
    contactNumber: "Contact Number",
    dateOfBirth: "Date of Birth",
    age: "Age",
    ethnicity: "Ethnicity",
    gender: "Gender",
    address: "Address",
    lifeStyle: "Life Style",
    education: "Education",
    occupation: "Occupation",
    familyMonthlyIncome: "Family Monthly Income",
    bloodGroup: "Blood Group",
    patientId: "Patient ID",
    notRecorded: "Not Recorded",
    
    // Search
    searchPatient: "Search Patient",
    enterPatientIdNicOrName: "Enter Patient ID, NIC, or Full Name",
    searchByIdNicName: "You can search by Patient ID, NIC, or Full Name",
    pleaseEnterSearchTerm: "Please enter a Patient ID, NIC, or Full Name",
    noPatientFound: "No patient found with that Patient ID, NIC, or Full Name.",
    searching: "Searching...",
    
    // Accidents
    accidentRecords: "Accident Records",
    accidentDetails: "Accident Details",
    incidentDate: "Incident Date", 
    timeOfCollision: "Time Of Collision",
    completed: "Completed",
    incomplete: "Incomplete",
    clickToViewFullDetails: "Click to view full details →",
    noAccidentRecords: "No accident records for this patient.",
    fullDetails: "Full Details",
    
    // Predictions
    mlTransferPrediction: "ML Transfer Prediction",
    calculatingPrediction: "Calculating prediction...",
    transferProbability: "Transfer Probability",
    prediction: "Prediction",
    predictionOutcome: "Prediction Outcome",
    analysis: "Analysis",
    predictionNotAvailable: "Prediction not available",
    mlTransferPredictionAnalysis: "ML Transfer Prediction Analysis",
    
    // Accident Details
    basicInformation: "Basic Information",
    environmentConditions: "Environment Conditions",
    visibility: "Visibility",
    roadCondition: "Road Condition",
    roadType: "Road Type",
    categoryOfRoad: "Category of Road",
    severity: "Severity",
    approximateSpeed: "Approximate Speed",
    modeOfTraveling: "Mode of Traveling",
    collisionWith: "Collision With",
    modeOfTransportToHospital: "Mode of Transport to Hospital",
    alcoholConsumption: "Alcohol Consumption",
    illicitDrugs: "Illicit Drugs",
    helmetWorn: "Helmet Worn",
    medicalFinancial: "Medical & Financial",
    firstAidGivenAtScene: "First Aid Given at Scene",
    hospitalDistanceFromHome: "Hospital Distance From Home",
    hospital: "Hospital",
    familyCurrentStatus: "Family Current Status",
    bystanderExpenditurePerDay: "Bystander Expenditure/Day",
    travelingExpenditurePerDay: "Traveling Expenditure Per Day",
    anyOtherHospitalAdmissionExpenditure: "Any Other Hospital Admission Expenditure",
    
    // Prediction Form
    medicalTransferPrediction: "Medical Transfer Prediction",
    completeFormForAnalysis: "Complete the form to get AI-powered transfer probability analysis",
    formCompletion: "Form Completion",
    fields: "fields",
    getPredictionAnalysis: "Get Prediction Analysis",
    processingPrediction: "Processing Prediction...",
    predictionResults: "Prediction Results",
    analysisMessage: "Analysis Message",
    errorOccurred: "Error Occurred",
    
    // Form Sections
    personalInformation: "Personal Information",
    medicalHistory: "Medical History",
    locationDistance: "Location & Distance",
    financialInformation: "Financial Information",
    socialFactors: "Social Factors"
  },
  
  si: {
    // Common
    loading: "පූරණය වෙමින්...",
    search: "සොයන්න",
    close: "වසන්න",
    error: "දෝෂයක්",
    success: "සාර්ථකයි",
    cancel: "අවලංගු කරන්න",
    confirm: "තහවුරු කරන්න",
    save: "සුරකින්න",
    delete: "මකන්න",
    edit: "සංස්කරණය",
    view: "බලන්න",
    back: "ආපසු",
    next: "ඊළඟ",
    previous: "පෙර",
    yes: "ඔව්",
    no: "නැත",
    
    // Navigation
    dashboard: "උපකරණ පුවරුව",
    viewPatientData: "රෝගී දත්ත බලන්න",
    getPrediction: "පුරෝකථනය ලබා ගන්න",
    logout: "ඉවත් වන්න",
    doctorPortal: "වෛද්‍ය ද්වාරය",
    roadAccidentCareSystem: "මාර්ග අනතුරු සත්කාර පද්ධතිය",
    online: "සබැඳි",
    currentlyOnline: "දැනට සබැඳි",
    
    // Login & Auth
    login: "ඇතුල් වන්න",
    email: "විද්‍යුත් තැපැල්",
    password: "මුරපදය",
    selectLanguage: "භාෂාව තෝරන්න",
    english: "English",
    sinhala: "සිංහල",
    tamil: "தமிழ்",
    rememberMe: "මාව මතක තබා ගන්න",
    forgotPassword: "මුරපදය අමතකද?",
    dontHaveAnAccountRegisterHere: "ගිණුමක් නැද්ද? මෙහි ලියාපදිංචි වන්න",
    secureHealthcareManagementSystem: "ආරක්ෂිත සෞඛ්‍ය කළමනාකරණ පද්ධතිය",
    
    // Patient Data
    patientDetails: "රෝගී විස්තර",
    fullName: "සම්පූර්ණ නම",
    contactNumber: "සම්පර්ක අංකය",
    dateOfBirth: "උපන් දිනය",
    age: "වයස",
    ethnicity: "ජනවර්ගය",
    gender: "ස්ත්‍රී පුරුෂ භාවය",
    address: "ලිපිනය",
    lifeStyle: "ජීවන රටාව",
    education: "අධ්‍යාපනය",
    occupation: "රැකියාව",
    familyMonthlyIncome: "පවුලේ මාසික ආදායම",
    bloodGroup: "රුධිර වර්ගය",
    patientId: "රෝගී හැඳුනුම්පත",
    notRecorded: "සටහන් නොවේ",
    
    // Search
    searchPatient: "රෝගියා සොයන්න",
    enterPatientIdNicOrName: "රෝගී හැඳුනුම්පත, ජාතික හැඳුනුම්පත, හෝ සම්පූර්ණ නම ඇතුළත් කරන්න",
    searchByIdNicName: "ඔබට රෝගී හැඳුනුම්පත, ජාතික හැඳුනුම්පත, හෝ සම්පූර්ණ නම මගින් සෙවිය හැක",
    pleaseEnterSearchTerm: "කරුණාකර රෝගී හැඳුනුම්පත, ජාතික හැඳුනුම්පත, හෝ සම්පූර්ණ නම ඇතුළත් කරන්න",
    noPatientFound: "එම රෝගී හැඳුනුම්පත, ජාතික හැඳුනුම්පත, හෝ සම්පූර්ණ නම සහිත රෝගියෙකු නොමැත.",
    searching: "සොයමින්...",
    
    // Accidents
    accidentRecords: "අනතුරු වාර්තා",
    accidentDetails: "අනතුරු විස්තර",
    incidentDate: "සිදුවීම් දිනය",
    timeOfCollision: "ගැටීමේ වේලාව",
    completed: "සම්පූර්ණයි",
    incomplete: "අසම්පූර්ණයි",
    clickToViewFullDetails: "සම්පූර්ණ විස්තර බැලීමට ක්ලික් කරන්න →",
    noAccidentRecords: "මෙම රෝගියා සඳහා අනතුරු වාර්තා නොමැත.",
    fullDetails: "සම්පූර්ණ විස්තර",
    
    // Predictions
    mlTransferPrediction: "ML මාරු කිරීමේ පුරෝකථනය",
    calculatingPrediction: "පුරෝකථනය ගණනය කරමින්...",
    transferProbability: "මාරු කිරීමේ සම්භාවිතාව",
    prediction: "පුරෝකථනය",
    predictionOutcome: "පුරෝකථන ප්‍රතිඵලය",
    analysis: "විශ්ලේෂණය",
    predictionNotAvailable: "පුරෝකථනය ලබා ගත නොහැක",
    mlTransferPredictionAnalysis: "ML මාරු කිරීමේ පුරෝකථන විශ්ලේෂණය",
    
    // Accident Details
    basicInformation: "මූලික තොරතුරු",
    environmentConditions: "පරිසර තත්ත්වයන්",
    visibility: "දෘශ්‍යතාව",
    roadCondition: "මාර්ග තත්ත්වය",
    roadType: "මාර්ග වර්ගය",
    categoryOfRoad: "මාර්ග කාණ්ඩය",
    severity: "බරපතලකම",
    approximateSpeed: "ආසන්න වේගය",
    modeOfTraveling: "ගමන් ක්‍රමය",
    collisionWith: "ගැටුණු දෙය",
    modeOfTransportToHospital: "රෝහලට ප්‍රවාහන ක්‍රමය",
    alcoholConsumption: "මත්පැන් පානය",
    illicitDrugs: "නීති විරෝධී ඖෂධ",
    helmetWorn: "හිස්වැසුම් පැළඳීම",
    medicalFinancial: "වෛද්‍ය සහ මූල්‍ය",
    firstAidGivenAtScene: "ස්ථානයේදී ප්‍රථමාධාර",
    hospitalDistanceFromHome: "ගෙයේ සිට රෝහල දුර",
    hospital: "රෝහල",
    familyCurrentStatus: "පවුලේ වර්තමාන තත්ත්වය",
    bystanderExpenditurePerDay: "නරඹන්නාගේ දෛනික වියදම",
    travelingExpenditurePerDay: "දෛනික ගමන් වියදම",
    anyOtherHospitalAdmissionExpenditure: "වෙනත් රෝහල් ඇතුළත් වීමේ වියදම්",
    
    // Prediction Form
    medicalTransferPrediction: "වෛද්‍ය මාරු කිරීමේ පුරෝකථනය",
    completeFormForAnalysis: "AI බලයෙන් යුත් මාරු කිරීමේ සම්භාවිතාविश्लेषण ලබා ගැනීමට පෝරමය සම්පූර්ණ කරන්න",
    formCompletion: "පෝරම සම්පූර්ණ කිරීම",
    fields: "ක්ෂේත්‍ර",
    getPredictionAnalysis: "පුරෝකථන විශ්ලේෂණය ලබා ගන්න",
    processingPrediction: "පුරෝකථනය සකසමින්...",
    predictionResults: "පුරෝකථන ප්‍රතිඵල",
    analysisMessage: "විශ්ලේෂණ පණිවිඩය",
    errorOccurred: "දෝෂයක් සිදු විය",
    
    // Form Sections
    personalInformation: "පුද්ගලික තොරතුරු",
    medicalHistory: "වෛද්‍ය ඉතිහාසය",
    locationDistance: "ස්ථානය සහ දුර",
    financialInformation: "මූල්‍ය තොරතුරු",
    socialFactors: "සමාජ සාධක"
  }
};

// Get current language from localStorage or default to 'en'
export const getCurrentLanguage = () => {
  return localStorage.getItem('selectedLanguage') || 'en';
};

// Set language in localStorage
export const setLanguage = (lang) => {
  localStorage.setItem('selectedLanguage', lang);
};

// Get translation for a key
export const t = (key) => {
  const currentLang = getCurrentLanguage();
  return translations[currentLang]?.[key] || translations['en'][key] || key;
};

// Get all available languages
export const getAvailableLanguages = () => {
  return [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'si', name: 'Sinhala', nativeName: 'සිංහල' }
  ];
};

export default translations;