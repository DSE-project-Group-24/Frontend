import React, { useState } from "react";
import DoctorNav from "../../navbars/DoctorNav";
import API from "../../utils/api"; // your axios instance
import Footer from "../../components/Footer";
import { t } from "../../utils/translations";

const ViewPatientData = ({ setIsAuthenticated, setRole }) => {
  const [searchId, setSearchId] = useState("");
  const [patients, setPatients] = useState([]);
  const [filtered, setFiltered] = useState(null);
  const [accidents, setAccidents] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedAccident, setSelectedAccident] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [transferProbabilities, setTransferProbabilities] = useState({});
  const [loadingPredictions, setLoadingPredictions] = useState({});
  const [dischargeOutcomePredictions, setDischargeOutcomePredictions] = useState({});
  const [loadingDischargeOutcome, setLoadingDischargeOutcome] = useState({});
  const [copySuccess, setCopySuccess] = useState("");

  const handleCopy = async (text) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setCopySuccess("Copied!");
        setTimeout(() => setCopySuccess(""), 1500);
      }
    } catch (e) {
      // ignore clipboard errors silently
    }
  };

  const handleSearch = async () => {
    setError("");
    setFiltered(null);
    setAccidents([]);
    setTransferProbabilities({});
    setDischargeOutcomePredictions({});
    if (!searchId.trim()) {
      setError(t('pleaseEnterSearchTerm'));
      return;
    }
    setLoading(true);
    try {
      // 1️⃣ fetch patients and filter by id, NIC, or name
      const res = await API.get("/patients");
      setPatients(res.data);
      console.log("Fetched patients:", res.data);
      
      const searchTerm = searchId.trim().toLowerCase();
      const match = res.data.find((p) => {
        // Search by Patient ID (exact match, case insensitive)
        if (p.patient_id && p.patient_id.toLowerCase() === searchTerm) {
          return true;
        }
        
        // Search by NIC (exact match, case insensitive)
        if (p.NIC && p.NIC.toLowerCase() === searchTerm) {
          return true;
        }
        
        // Search by Full Name (partial match, case insensitive)
        if (p["Full Name"] && p["Full Name"].toLowerCase().includes(searchTerm)) {
          return true;
        }
        
        return false;
      });
      
      if (!match) {
        setError("No patient found with that Patient ID, NIC, or Full Name.");
        return;
      }
      setFiltered(match);

      // 2️⃣ fetch accident details for that patient using the matched patient's ID
      const accRes = await API.get(`/accidents/patient/${match.patient_id}`);
      setAccidents(accRes.data);
      console.log("Fetched accidents:", accRes.data);
      
      // 3️⃣ Get predictions for incomplete accidents
      const incompleteAccidents = accRes.data.filter(acc => !acc["Completed"]);
      for (const accident of incompleteAccidents) {
        await getPredictionForAccident(accident, match); 
        await getDischargeOutcomePrediction(accident, match);
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const getPredictionForAccident = async (accident, patientData) => {
    setLoadingPredictions(prev => ({ ...prev, [accident.accident_id]: true }));
    
    try {
      // Prepare data for prediction API
      const predictionData = preparePredictionData(accident, patientData);
      const missingValues = predictionData._missingValues || [];
      
      // Remove the debug info before sending to API
      const apiData = { ...predictionData };
      delete apiData._missingValues;
      
      const response = await API.post('predictions/transferprobability', apiData);
      
      const result = response.data;
      
      if (result.transfer_probability !== undefined) {
        setTransferProbabilities(prev => ({
          ...prev,
          [accident.accident_id]: {
            probability: (result.transfer_probability * 100).toFixed(2) + '%',
            prediction: result.prediction,
            message: result.message,
            missingValues: missingValues // Store missing values for display
          }
        }));
      }
    } catch (error) {
      console.error(`Error getting prediction for accident ${accident.accident_id}:`, error);
      setTransferProbabilities(prev => ({
        ...prev,
        [accident.accident_id]: {
          probability: 'Error',
          prediction: 'N/A',
          message: 'Failed to get prediction'
        }
      }));
    } finally {
      setLoadingPredictions(prev => ({ ...prev, [accident.accident_id]: false }));
    }
  };

  const getDischargeOutcomePrediction = async (accident, patientData) => {
    setLoadingDischargeOutcome(prev => ({ ...prev, [accident.accident_id]: true }));
    
    try {
      // Prepare data for discharge outcome prediction API
      const predictionData = prepareDischargeOutcomeData(accident, patientData);
      const missingValues = predictionData._missingValues || [];
      
      // Remove the debug info before sending to API
      const apiData = { ...predictionData };
      delete apiData._missingValues;
      
      console.log('🚀 Sending discharge outcome prediction request:', apiData);
      const response = await API.post('predictions/discharge-outcome', apiData);
      
      const result = response.data;
      console.log('✅ Discharge outcome prediction response:', result);
      
      if (result && result.prediction) {
        setDischargeOutcomePredictions(prev => ({
          ...prev,
          [accident.accident_id]: {
            prediction: result.prediction,
            probabilities: result.prediction_probabilities || {},
            modelInfo: result.model_info || {},
            preprocessedFeatures: result.preprocessed_features || {},
            missingValues: missingValues // Store missing values for display
          }
        }));
      } else {
        // Handle case where prediction is not in expected format
        console.warn('Unexpected response format:', result);
        setDischargeOutcomePredictions(prev => ({
          ...prev,
          [accident.accident_id]: {
            prediction: 'Unknown',
            probabilities: {},
            message: 'Unexpected response format from API'
          }
        }));
      }
    } catch (error) {
      console.error(`❌ Error getting discharge outcome prediction for accident ${accident.accident_id}:`, error);
      console.error('Error response data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Data sent to API:', apiData);
      
      let errorMessage = 'Failed to get discharge outcome prediction';
      if (error.response?.data?.detail) {
        errorMessage = `API Error: ${error.response.data.detail}`;
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error - please check data format';
      }
      
      setDischargeOutcomePredictions(prev => ({
        ...prev,
        [accident.accident_id]: {
          prediction: 'Error',
          probabilities: {},
          message: errorMessage
        }
      }));
    } finally {
      setLoadingDischargeOutcome(prev => ({ ...prev, [accident.accident_id]: false }));
    }
  };

  const prepareDischargeOutcomeData = (accident, patient) => {
    // Map accident and patient data to match the discharge outcome prediction model format
    const data = {};
    const missingValues = []; // Track missing/null values

    // Current Hospital Name - use available hospital data
    const hospitalName = accident?.["Hospital"] || accident?.hospital;
    data['current_hospital_name'] = hospitalName || "DGH – Kilinochchi";
    if (!hospitalName) {
      missingValues.push('Current Hospital Name');
    }
    
    // Family Current Status
    data['family_current_status'] = accident?.["Family current status"] || "Moderately Affected";
    if (!accident?.["Family current status"]) {
      missingValues.push('Family Current Status');
    }

    // Type of injury No 1 - Warning: Not available in current data
    data['type_of_injury_no_1'] = "fracture"; // Default value
    missingValues.push('Type of injury No 1 (not available in current data structure)');

    // Traveling Expenditure per day
    data['traveling_expenditure_per_day'] = accident?.["Traveling Expenditure Per Day"] || "100-200";
    if (!accident?.["Traveling Expenditure Per Day"]) {
      missingValues.push('Traveling Expenditure Per Day');
    }

    // First Hospital Name - use available hospital data
    const firstHospitalName = accident?.["Hospital"] || accident?.hospital;
    data['first_hospital_name'] = firstHospitalName || "DGH – Kilinochchi";
    if (!firstHospitalName) {
      missingValues.push('First Hospital Name');
    }

    // Date of Birth - ensure proper format (YYYY-MM-DD)
    if (patient?.["Date of Birth"]) {
      try {
        const dob = new Date(patient["Date of Birth"]);
        if (!isNaN(dob.getTime())) {
          data['date_of_birth'] = dob.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        } else {
          data['date_of_birth'] = "1990-05-15"; // Default for invalid date
          missingValues.push('Date of Birth (invalid date format)');
        }
      } catch (e) {
        data['date_of_birth'] = "1990-05-15"; // Default for parsing error
        missingValues.push('Date of Birth (date parsing error)');
      }
    } else {
      data['date_of_birth'] = "1990-05-15"; // Default value
      missingValues.push('Date of Birth');
    }

    // Site of injury No1 - Warning: Not available in current data
    data['site_of_injury_no1'] = "head injury"; // Default value
    missingValues.push('Site of injury No1 (not available in current data structure)');

    // Approximate Speed
    data['approximate_speed'] = accident?.["Approximate speed"] || "40 - 80 km/h";
    if (!accident?.["Approximate speed"]) {
      missingValues.push('Approximate Speed');
    }

    // Incident At Time and Date - ensure proper format (YYYY-MM-DD)
    if (accident?.["incident at date"]) {
      try {
        const incidentDate = new Date(accident["incident at date"]);
        if (!isNaN(incidentDate.getTime())) {
          data['incident_at_time_and_date'] = incidentDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        } else {
          data['incident_at_time_and_date'] = "2023-10-15"; // Default for invalid date
          missingValues.push('Incident At Time and Date (invalid date format)');
        }
      } catch (e) {
        data['incident_at_time_and_date'] = "2023-10-15"; // Default for parsing error
        missingValues.push('Incident At Time and Date (date parsing error)');
      }
    } else {
      data['incident_at_time_and_date'] = "2023-10-15"; // Default value
      missingValues.push('Incident At Time and Date');
    }

    // Hospital Distance From Home
    data['hospital_distance_from_home'] = accident?.["Hospital Distance From Home"] || "5-10 Km";
    if (!accident?.["Hospital Distance From Home"]) {
      missingValues.push('Hospital Distance From Home');
    }

    // Mode of Transport to the Hospital
    data['mode_of_transport_to_the_hospital'] = accident?.["Mode of transport to hospital"] || "Ambulance";
    if (!accident?.["Mode of transport to hospital"]) {
      missingValues.push('Mode of Transport to the Hospital');
    }

    // Educational Qualification
    data['educational_qualification'] = patient?.["Education Qualification"] || "O/L or A/L";
    if (!patient?.["Education Qualification"]) {
      missingValues.push('Educational Qualification');
    }

    // Time Taken To Reach Hospital - Warning: Not available in current data
    data['time_taken_to_reach_hospital'] = "Less Than 15 Minutes"; // Default value
    missingValues.push('Time Taken To Reach Hospital (not available in current data structure)');

    // Any Other Hospital Admission Expenditure
    data['any_other_hospital_admission_expenditure'] = accident?.["Any Other Hospital Admission Expenditure"] || "No Other Expenses";
    if (!accident?.["Any Other Hospital Admission Expenditure"]) {
      missingValues.push('Any Other Hospital Admission Expenditure');
    }

    // Site of injury No 2 - Warning: Not available in current data
    data['site_of_injury_no_2'] = "no secondary injury found"; // Default value
    missingValues.push('Site of injury No 2 (not available in current data structure)');

    // Occupation
    data['occupation'] = patient?.["Occupation"] || "Student";
    if (!patient?.["Occupation"]) {
      missingValues.push('Occupation');
    }

    // Family Monthly Income Before Accident - Warning: Not available in current data
    data['family_monthly_income_before_accident'] = patient?.["Family Monthly Income"] || "30000-45000";
    if (!patient?.["Family Monthly Income"]) {
      missingValues.push('Family Monthly Income Before Accident (using current income as approximation)');
    }

    // Collision With
    data['collision_with'] = accident?.["Collision with"] || "Motorbike";
    if (!accident?.["Collision with"]) {
      missingValues.push('Collision With');
    }

    // Life Style
    data['life_style'] = patient?.["Life Style"] || "Living with care givers";
    if (!patient?.["Life Style"]) {
      missingValues.push('Life Style');
    }

    // Collision Force From - Warning: Not available in current data
    data['collision_force_from'] = "Front"; // Default value
    missingValues.push('Collision Force From (not available in current data structure)');

    // Road Type
    data['road_type'] = accident?.["Road Type"] || "Straight";
    if (!accident?.["Road Type"]) {
      missingValues.push('Road Type');
    }

    // Type of Injury No 2 - Warning: Not available in current data
    data['type_of_injury_no_2'] = "abrasion"; // Default value
    missingValues.push('Type of Injury No 2 (not available in current data structure)');

    // Validate and clean data before sending
    const cleanedData = {};
    for (const [key, value] of Object.entries(data)) {
      if (key !== '_missingValues') {
        // Ensure all values are strings (except for the _missingValues array)
        cleanedData[key] = value !== null && value !== undefined ? String(value) : "";
      }
    }

    // Log missing values for debugging
    console.log("🔍 Missing/Null Values for Discharge Outcome Prediction:");
    console.log("Patient Data:", patient);
    console.log("Accident Data:", accident);
    console.log("Missing Values:", missingValues);
    console.log("Final Data Sent to Discharge Outcome API:", cleanedData);
    
    // Store missing values for UI display
    cleanedData._missingValues = missingValues;
    
    return cleanedData;
  };

  const preparePredictionData = (accident, patient) => {
    // Map accident and patient data to match the prediction model format
    const data = {};
    const missingValues = []; // Track missing/null values

    // Age
    if (patient?.["Date of Birth"]) {
      const birthYear = new Date(patient["Date of Birth"]).getFullYear();
      data['Person Age (as of 2023-01-01)'] = 2023 - birthYear;
    } else {
      data['Person Age (as of 2023-01-01)'] = undefined;
      missingValues.push('Person Age (Date of Birth not available)');
    }

    // Alcohol Consumption 
    const alcohol_map = {
      "Yes": 1,
      "No": 0,
      "Victim not willing to share/ Unable to respond/  Early Discharge": -1
    };

    // This will be undefined if accident or the field is missing
    data['Alcohol_Consumption_Encoded'] = alcohol_map?.[accident?.["Alcohol Consumption"]];
    if (data['Alcohol_Consumption_Encoded'] === undefined) {
      missingValues.push(`Alcohol Consumption (value: "${accident?.["Alcohol Consumption"]}")`);
    }

    // Illicit Drugs (you might need to add this field to your accident data)
    const illicit_map = {
      "Yes": 1,
      "No": 0,
      "Victim not willing to share/ Unable to respond/  Early Discharge": -1
    };
    data['Illicit_Drugs_Encoded'] = illicit_map?.[accident?.["Illicit Drugs"]];
    if (data['Illicit_Drugs_Encoded'] === undefined) {
      missingValues.push(`Illicit Drugs (value: "${accident?.["Illicit Drugs"]}")`);
    }


    // Severity with null checks
    const severity_map = {
      "Unknown": -1,
      "Medium": 1,
      "Serious": 2
    };
    data['Severity'] = severity_map?.[accident?.["Severity"]];
    if (data['Severity'] === undefined) {
      missingValues.push(`Severity (value: "${accident?.["Severity"]}")`);
    }

    // Gender with null checks
    const gender_map = {
      "Male": 1,
      "Female": 0
    };
    data['Gender'] = gender_map?.[patient?.["Gender"]]; // Fixed: should be from patient, not accident
    if (data['Gender'] === undefined) {
      missingValues.push(`Gender (value: "${patient?.["Gender"]}")`);
    }

    // Hospital Distance
    const distance_map = {
      "Victim doesn't have knowledge on distance/ Not willing to share/ Unable to respond/  Early Discharge": NaN,
      "Less than 5 Km": 2.5,
      "5-10 Km": 7.5,
      "10-15 Km": 12.5,
      "15-20 Km": 17.5,
      "20-25 Km": 22.5,
      "25-30 Km": 27.5,
      "25-30 km": 27.5,
      "30-50 Km": 40,
      "50-100 Km": 75,
      "100-150 Km": 125,
      "150-200 Km": 175
    };
    data['Hospital Distance From Home'] = distance_map?.[accident?.["Hospital Distance From Home"]];
    if (data['Hospital Distance From Home'] === undefined && !isNaN(data['Hospital Distance From Home'])) {
      missingValues.push(`Hospital Distance From Home (value: "${accident?.["Hospital Distance From Home"]}")`);
    }

    // Traveling Expenditure
    const travel_exp_map = {
      'Victim not willing to share/ Unable to respond/  Early Discharge': -1,
      '0-100': 1,
      '100-200': 2,
      '200-300': 3,
      '300-400': 4,
      '400-500': 5,
      'More than 500': 7
    };
    data['Traveling Expenditure per day'] = travel_exp_map?.[accident?.["Traveling Expenditure Per Day"]];
    if (data['Traveling Expenditure per day'] === undefined) {
      missingValues.push(`Traveling Expenditure Per Day (value: "${accident?.["Traveling Expenditure Per Day"]}")`);
    }
    
    // Bystander Expenditure
    const expenditure_map = {
      'Not Necessary': 0,
      'Less Than 500': 1,
      '500-1000': 2,
      'More than 1000': 4
    };
    data['Bystander Expenditure per day'] = expenditure_map?.[accident?.["Bystander expenditure per day"]];
    if (data['Bystander Expenditure per day'] === undefined) {
      missingValues.push(`Bystander Expenditure Per Day (value: "${accident?.["Bystander expenditure per day"]}")`);
    }
    
    // Family Current Status
    const ordinal_map = {
      "Victim not willing to share/ Unable to respond/  Early Discharge": -1,
      "Not Affected": 0,
      "Mildly Affected": 1,
      "Moderately Affected": 2,
      "Severely Affected": 3
    };
    data['Family Current Status'] = ordinal_map?.[accident?.["Family current status"]];
    if (data['Family Current Status'] === undefined) {
      missingValues.push(`Family Current Status (value: "${accident?.["Family current status"]}")`);
    }


    // Lifestyle with null checks
    const lifestyle_columns = [
      "LifeStyle_Living alone",
      "LifeStyle_Living with care givers",
      "LifeStyle_Living with children"
    ];
    lifestyle_columns.forEach(col => data[col] = 0);
    if (patient && patient["Life Style"]) {
      let col;
      if (patient["Life Style"] === "Living alone") col = "LifeStyle_Living alone";
      else if (patient["Life Style"] === "Living with care givers") col = "LifeStyle_Living with care givers";
      else if (patient["Life Style"] === "Living with children") col = "LifeStyle_Living with children";
      if (col) data[col] = 1;
    }

    // Any Other Expenditure
    const any_other_expenditure_map = {
      "No Other Expenses": 0,
      "Has Other Expenses": 1
    };
    data["Any Other Hospital Admission Expenditure"] = any_other_expenditure_map?.[accident?.["Any Other Hospital Admission Expenditure"]];
    if (data["Any Other Hospital Admission Expenditure"] === undefined) {
      missingValues.push(`Any Other Hospital Admission Expenditure (value: "${accident?.["Any Other Hospital Admission Expenditure"]}")`);
    }

    // Ethnicity  
    const ethnicity_columns = [
      "Ethnicity_Moor",
      "Ethnicity_Sinhalese",
      "Ethnicity_Tamil"
    ];
    ethnicity_columns.forEach(col => data[col] = 0);
    const ethnicity_val = patient && patient["Ethnicity"];
    console.log("Patient Ethnicity:", ethnicity_val);
    if (ethnicity_val) {
      let eth_col;
      if (ethnicity_val === "Moor") eth_col = "Ethnicity_Moor";
      else if (ethnicity_val === "Sinhalese") eth_col = "Ethnicity_Sinhalese";
      else if (ethnicity_val === "Tamil") eth_col = "Ethnicity_Tamil";
      if (eth_col) data[eth_col] = 1;
    } else {
      missingValues.push(`Ethnicity (value: "${patient?.["Ehinicity"]}")`);
    }

    // Hospital one-hot
    const hospital_options = [
      "BH, Tellipalai(Type A)",
      "BH,Chavakachcheri(TypeB)",
      "BH,Mallavi(TypeB)",
      "BH,Mankulam(TypeA)",
      "BH,Murungan (TypeB)",
      "BH,Puthukudijiruppu(TypeB)",
      "Base Hospital (A) - Mankulam",
      "Base Hospital (A) - Point Pedro",
      "Base Hospital (A) -Tellipalai",
      "Base Hospital (B) - Chavakachcheri",
      "Base Hospital (B) - Cheddikulam",
      "Base Hospital (B) - Kayts",
      "Base Hospital (B) - Mallavi",
      "Base Hospital (B) - Mulankavil",
      "Base Hospital (B) - Murunkan",
      "Base Hospital (B) - Puthukudiyiruppu",
      "DGH – Kilinochchi",
      "DGH – Mannar",
      "DGH – Mullaithivu",
      "DGH – Vavuniya",
      "DGH, Mannar",
      "DGH,Kilinochchi",
      "DH, Nerijakulam",
      "DH, Poovarasankulam",
      "DH, Puliyankulam",
      "DH, Sithamparapuram",
      "DH, Ulukulam",
      "DH,Adampan",
      "DH,Akkarayankulam",
      "DH,Alampil",
      "DH,Alavedddy",
      "DH,Atchuveli",
      "DH,Chankanai",
      "DH,Chilawaththurai",
      "DH,Delft",
      "DH,Erukalampitti",
      "DH,Karainagar",
      "DH,Kodikamam",
      "DH,Kokulai",
      "DH,Kopay",
      "DH,Moonkilaru",
      "DH,Nainativu",
      "DH,Nanattan",
      "DH,Nedunkerny",
      "DH,Oddusuddan",
      "DH,Palai",
      "DH,Periyapandivirichchan",
      "DH,Pesalai",
      "DH,Poonakary",
      "DH,Pungudutivu",
      "DH,Sampathnuwara",
      "DH,Talaimannar",
      "DH,Tharmapuram",
      "DH,Uruthirapuram",
      "DH,Vaddakachchi",
      "DH,Vaddukoddai",
      "DH,Valvettithurai",
      "DH,Vankalai",
      "DH,Velanai",
      "DH,Veravil",
      "DH,Vidathaltivu",
      "PMCU, Bogeswewa",
      "PMCU, Omanthai",
      "PMCU, Tharapuram",
      "PMCU, Velankulam",
      "Teaching hospital - Jaffna (THJ)"
    ];
    hospital_options.forEach(opt => {
      data["First Hospital Name_" + opt] = 0;
    });
    if (accident?.hospital) {
      data["First Hospital Name_" + accident.hospital] = 1;
    } else {
      missingValues.push(`Hospital (value: "${accident?.hospital}")`);
      // Default to DGH – Vavuniya if no hospital specified
      data["First Hospital Name_DGH – Vavuniya"] = 1;
    }

    // Log missing values for debugging
    console.log("🔍 Missing/Null Values for Prediction:");
    console.log("Patient Data:", patient);
    console.log("Accident Data:", accident);
    console.log("Missing Values:", missingValues);
    console.log("Final Data Sent to API:", data);
    
    // Store missing values for UI display
    data._missingValues = missingValues;
    
    return data;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-gray-800">
      <DoctorNav setIsAuthenticated={setIsAuthenticated} setRole={setRole} />
      <div className="max-w-7xl mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-sky-700 to-indigo-600">
            {t('viewPatientData')}
          </h1>
          <p className="mt-1 text-sm text-slate-500">Search patients by Patient ID, NIC or full name and view accident records with ML predictions.</p>
        </header>

        {/* Search box */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md mb-6 border border-slate-100">
          <label className="block mb-3 text-sm font-medium text-slate-700">{t('searchPatient')}:</label>
          <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="flex items-center gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder={t('enterPatientIdNicOrName')}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-sky-700 hover:to-indigo-700 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? (
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"></path>
                </svg>
              ) : null}
              <span>{loading ? t('searching') : t('search')}</span>
            </button>
          </form>
          <p className="text-xs text-slate-500 mt-3">{t('searchByIdNicName')}</p>
          {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
        </div>

        {/* Patient info */}
        {filtered && (
          <div className="bg-white p-6 rounded-xl shadow-md mb-6 border border-slate-100">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-sky-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-md">
                  {filtered["Full Name"] ? filtered["Full Name"].split(' ').map(n => n[0]).slice(0,2).join('') : 'P'}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">{filtered["Full Name"]}</h2>
                  <p className="text-sm text-slate-500">{filtered["Contact Number"]}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => handleCopy(filtered["patient_id"])} className="inline-flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm hover:shadow transition">Copy ID</button>
                {copySuccess && <span className="text-sm text-emerald-600">{copySuccess}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-700">
              <div className="space-y-2">
                <p><span className="font-medium">{t('dateOfBirth')}:</span> {filtered["Date of Birth"]} {filtered["Date of Birth"] && (<span className="text-sm text-slate-500"> ({t('age')}: {Math.floor((new Date() - new Date(filtered["Date of Birth"])) / (1000 * 60 * 60 * 24 * 365.25))})</span>)}</p>
                <p><span className="font-medium">{t('ethnicity')}:</span> {filtered["Ethnicity"]}</p>
                <p><span className="font-medium">{t('gender')}:</span> {filtered["Gender"]}</p>
                <p><span className="font-medium">{t('address')}:</span> {filtered["Address Street"]}</p>
              </div>
              <div className="space-y-2">
                <p><span className="font-medium">{t('lifeStyle')}:</span> {filtered["Life Style"]}</p>
                <p><span className="font-medium">{t('education')}:</span> {filtered["Education Qualification"]}</p>
                <p><span className="font-medium">{t('occupation')}:</span> {filtered["Occupation"]}</p>
                <p><span className="font-medium">{t('familyMonthlyIncome')}:</span> {filtered["Family Monthly Income"]}</p>
                <p><span className="font-medium">{t('bloodGroup')}:</span> {filtered["Blood Group"] || t('notRecorded')}</p>
                <p><span className="font-medium">{t('patientId')}:</span> <span className="text-sm text-slate-600">{filtered["patient_id"]}</span></p>
              </div>
            </div>
          </div>
        )}

        {/* Accident Summary */}
        {filtered && accidents.length > 0 && (
          <section className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-800">{t('accidentRecords')} <span className="text-sm text-slate-500">({accidents.length})</span></h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {accidents.map((acc, index) => (
                <article
                  key={acc.accident_id}
                  onClick={() => {
                    setSelectedAccident(acc);
                    setShowModal(true);
                  }}
                  className="group bg-white rounded-xl border border-slate-100 p-4 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">Accident #{index + 1}</h3>
                      <p className="text-xs text-slate-500">{acc["incident at date"]} • {acc["time of collision"]}</p>
                    </div>
                    {!acc["Completed"] && (
                      <div className="inline-flex items-center gap-2 px-2 py-1 rounded-md text-xs font-medium bg-amber-100 text-amber-800">
                        {t('incomplete')}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 text-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">{t('timeOfCollision')}</span>
                      <span className="font-medium text-sm">{acc["time of collision"]}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">{t('completed')}</span>
                      <span className="font-medium text-sm">{acc["Completed"] ? t('yes') : t('no')}</span>
                    </div>

                    {!acc["Completed"] && (
                      <div className="mt-3 space-y-2">
                        <div className="p-3 bg-gradient-to-r from-sky-50 to-indigo-50 rounded-lg border border-sky-100">
                          <h4 className="text-xs font-semibold text-sky-700">{t('mlTransferPrediction')}</h4>
                          {loadingPredictions[acc.accident_id] ? (
                            <div className="flex items-center gap-2 text-sky-600 mt-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-sky-600"></div>
                              <span className="text-sm">{t('calculatingPrediction')}</span>
                            </div>
                          ) : transferProbabilities[acc.accident_id] ? (
                            <div className="mt-2">
                              <div className="text-sm text-slate-600">{t('transferProbability')}: <span className="font-bold text-sky-700">{transferProbabilities[acc.accident_id].probability}</span></div>
                              <div className="text-sm mt-1">{t('prediction')}: <span className="font-semibold">{transferProbabilities[acc.accident_id].prediction}</span></div>
                            </div>
                          ) : (
                            <p className="text-sm text-red-600 mt-2">{t('predictionNotAvailable')}</p>
                          )}
                        </div>

                        <div className="p-3 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg border border-emerald-100">
                          <h4 className="text-xs font-semibold text-emerald-700">{t('dischargeOutcomePrediction') /* intentional key label */}</h4>
                          {loadingDischargeOutcome[acc.accident_id] ? (
                            <div className="flex items-center gap-2 text-emerald-600 mt-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600"></div>
                              <span className="text-sm">{t('calculatingPrediction')}</span>
                            </div>
                          ) : dischargeOutcomePredictions[acc.accident_id] ? (
                            <div className="mt-2 text-sm">
                              <div className="font-bold text-emerald-700">{dischargeOutcomePredictions[acc.accident_id].prediction}</div>
                              {dischargeOutcomePredictions[acc.accident_id].probabilities && (
                                <div className="text-xs text-slate-600 mt-1">
                                  {Object.entries(dischargeOutcomePredictions[acc.accident_id].probabilities).map(([outcome, prob]) => (
                                    <div key={outcome} className="flex justify-between">
                                      <span>{outcome}</span>
                                      <span className="font-semibold">{(prob * 100).toFixed(1)}%</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className="text-sm text-red-600 mt-2">{t('predictionNotAvailable')}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="mt-3 text-xs text-sky-600 group-hover:underline">{t('clickToViewFullDetails')}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {filtered && accidents.length === 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">{t('accidentRecords')}</h2>
            <p className="text-gray-700">{t('noAccidentRecords')}</p>
          </div>
        )}

        {/* Modal for Accident Details */}
        {showModal && selectedAccident && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-slate-100">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <h2 className="text-2xl font-bold text-slate-800">Accident #{accidents.findIndex(acc => acc.accident_id === selectedAccident.accident_id) + 1} — {t('fullDetails')}</h2>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setShowModal(false);
                        setSelectedAccident(null);
                      }}
                      className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-slate-50 border border-slate-100 hover:bg-slate-100"
                    >
                      <span className="text-xl font-semibold text-slate-600">×</span>
                    </button>
                  </div>
                </div>

                {/* Predictions in Modal for Incomplete Accidents */}
                {!selectedAccident["Completed"] && (
                  <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Transfer Probability Prediction */}
                    {transferProbabilities[selectedAccident.accident_id] && (
                      <div className="p-4 rounded-lg bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-100">
                        <h3 className="text-lg font-semibold text-sky-800 mb-3">🧠 {t('mlTransferPredictionAnalysis')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                            <div className="text-2xl font-bold text-sky-600">{transferProbabilities[selectedAccident.accident_id].probability}</div>
                            <div className="text-sm text-sky-800 font-medium">{t('transferProbability')}</div>
                          </div>
                          <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                            <div className="text-xl font-bold text-purple-600">{transferProbabilities[selectedAccident.accident_id].prediction}</div>
                            <div className="text-sm text-purple-800 font-medium">{t('predictionOutcome')}</div>
                          </div>
                          <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                            <div className="text-sm text-slate-700">{transferProbabilities[selectedAccident.accident_id].message}</div>
                            <div className="text-xs text-slate-500 font-medium mt-1">{t('analysis')}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Discharge Outcome Prediction */}
                    {dischargeOutcomePredictions[selectedAccident.accident_id] && (
                      <div className="p-4 rounded-lg bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-100">
                        <h3 className="text-lg font-semibold text-emerald-800 mb-3">🏥 {t('dischargeOutcomePredictionTitle') || 'Discharge Outcome Prediction'}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                            <div className="text-xl font-bold text-emerald-600">{dischargeOutcomePredictions[selectedAccident.accident_id].prediction}</div>
                            <div className="text-sm text-emerald-800 font-medium">{t('predictedOutcome')}</div>
                          </div>
                          <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                            <div className="text-sm text-slate-700">{dischargeOutcomePredictions[selectedAccident.accident_id].modelInfo?.model_type || 'CatBoost Classifier'}</div>
                            <div className="text-xs text-slate-500 font-medium mt-1">{t('modelType')}</div>
                          </div>
                        </div>
                        {dischargeOutcomePredictions[selectedAccident.accident_id].probabilities && (
                          <div className="bg-white rounded-lg p-3 shadow-sm">
                            <h4 className="font-semibold text-green-800 mb-2">{t('outcomeProbabilities')}</h4>
                            <div className="space-y-2">
                              {Object.entries(dischargeOutcomePredictions[selectedAccident.accident_id].probabilities)
                                .sort(([,a], [,b]) => b - a)
                                .map(([outcome, probability]) => (
                                <div key={outcome} className="flex justify-between items-center">
                                  <span className="text-sm font-medium text-slate-700">{outcome}</span>
                                  <div className="flex items-center gap-2">
                                    <div className="w-36 bg-gray-200 rounded-full h-2">
                                      <div className="bg-green-600 h-2 rounded-full" style={{ width: `${probability * 100}%` }}></div>
                                    </div>
                                    <span className="text-sm font-bold text-green-600 w-12">{(probability * 100).toFixed(1)}%</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {dischargeOutcomePredictions[selectedAccident.accident_id].missingValues && dischargeOutcomePredictions[selectedAccident.accident_id].missingValues.length > 0 && (
                          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <h4 className="font-semibold text-yellow-800 mb-2">⚠️ {t('dataAvailabilityWarning')}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-28 overflow-y-auto">
                              {dischargeOutcomePredictions[selectedAccident.accident_id].missingValues.map((missing, idx) => (
                                <div key={idx} className="text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded">{missing}</div>
                              ))}
                            </div>
                            <p className="text-xs text-yellow-600 mt-2 italic">{t('missingFieldsNote')}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-700">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3 text-sky-700">{t('basicInformation')}</h3>
                    <p className="mb-2"><span className="font-medium">{t('incidentDate')}:</span> {selectedAccident["incident at date"]}</p>
                    <p className="mb-2"><span className="font-medium">{t('timeOfCollision')}:</span> {selectedAccident["time of collision"]}</p>
                    <p className="mb-2"><span className="font-medium">{t('severity')}:</span> {selectedAccident["Severity"]}</p>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3 text-sky-700">{t('environmentConditions')}</h3>
                    <p className="mb-2"><span className="font-medium">{t('visibility')}:</span> {selectedAccident["Visibility"]}</p>
                    <p className="mb-2"><span className="font-medium">{t('roadCondition')}:</span> {selectedAccident["Road Condition"]}</p>
                    <p className="mb-2"><span className="font-medium">{t('roadType')}:</span> {selectedAccident["Road Type"]}</p>
                    <p className="mb-2"><span className="font-medium">{t('categoryOfRoad')}:</span> {selectedAccident["Category of Road"]}</p>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3 text-sky-700">{t('accidentDetails')}</h3>
                    <p className="mb-2"><span className="font-medium">{t('approximateSpeed')}:</span> {selectedAccident["Approximate speed"]}</p>
                    <p className="mb-2"><span className="font-medium">{t('modeOfTraveling')}:</span> {selectedAccident["Mode of traveling during accident"]}</p>
                    <p className="mb-2"><span className="font-medium">{t('collisionWith')}:</span> {selectedAccident["Collision with"]}</p>
                    <p className="mb-2"><span className="font-medium">{t('modeOfTransportToHospital')}:</span> {selectedAccident["Mode of transport to hospital"]}</p>
                    <p className="mb-2"><span className="font-medium">{t('alcoholConsumption')}:</span> {selectedAccident["Alcohol Consumption"]}</p>
                    <p className="mb-2"><span className="font-medium">{t('illicitDrugs')}:</span> {selectedAccident["Illicit Drugs"]}</p>
                    <p className="mb-2"><span className="font-medium">{t('helmetWorn')}:</span> {selectedAccident["Helmet Worn"]}</p>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3 text-sky-700">{t('medicalFinancial')}</h3>
                    <p className="mb-2"><span className="font-medium">{t('firstAidGivenAtScene')}:</span> {selectedAccident["First aid given at seen"] ? t('yes') : t('no')}</p>
                    <p className="mb-2"><span className="font-medium">{t('hospitalDistanceFromHome')}:</span> {selectedAccident["Hospital Distance From Home"]}</p>
                    <p className="mb-2"><span className="font-medium">{t('hospital')}:</span> {selectedAccident["Hospital"]}</p>
                    <p className="mb-2"><span className="font-medium">{t('familyCurrentStatus')}:</span> {selectedAccident["Family current status"]}</p>
                    <p className="mb-2"><span className="font-medium">{t('bystanderExpenditurePerDay')}:</span> {selectedAccident["Bystander expenditure per day"]}</p>
                    <p className="mb-2"><span className="font-medium">{t('travelingExpenditurePerDay')}:</span> {selectedAccident["Traveling Expenditure Per Day"]}</p>
                    <p className="mb-2"><span className="font-medium">{t('anyOtherHospitalAdmissionExpenditure')}:</span> {selectedAccident["Any Other Hospital Admission Expenditure"]}</p>
                  </div>

                  <p className="mb-2"><span className="font-medium">{t('completed')}:</span> {selectedAccident["Completed"] ? t('yes') : t('no')}</p>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setSelectedAccident(null);
                    }}
                    className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-sky-700 hover:to-indigo-700 transition-colors"
                  >
                    {t('close')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ViewPatientData;