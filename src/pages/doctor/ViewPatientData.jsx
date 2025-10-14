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
  const [hospitalStayPredictions, setHospitalStayPredictions] = useState({});
  const [loadingHospitalStay, setLoadingHospitalStay] = useState({});
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
        // hospital stay prediction
        await getHospitalStayPrediction(accident, match);
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const prepareHospitalStayData = (accident, patient) => {
    // Prepare the payload object expected by the hospital-stay model
    const obj = {};
    const missingValues = [];

    const injury1 = accident?.injuries && accident.injuries[0];
    const injury2 = accident?.injuries && accident.injuries[1];

    // Investigation Done - not present in current accident schema; hard-code and mark missing
    obj['Investigation Done'] = accident?.['Investigation Done'] || 'Others';
    if (!accident?.['Investigation Done']) missingValues.push('Investigation Done (hard-coded: Others)');

    // Type of injury No 1
    obj['Type of injury No 1'] = injury1?.type_of_injury || 'Fracture';
    if (!injury1?.type_of_injury) missingValues.push('Type of injury No 1');

    // Side (primary injury) - best-effort mapping; hardcode if not available
    obj['Side'] = injury1?.side || injury1?.location_side || 'Right';
    if (!injury1?.side && !injury1?.location_side) missingValues.push('Side (hard-coded)');

    // Site of Injury No1
    obj['Site of Injury No1'] = injury1?.site_of_injury || 'Shoulder Clavicle';
    if (!injury1?.site_of_injury) missingValues.push('Site of Injury No1');

    // Current Hospital Name
    obj['Current Hospital Name'] = localStorage.getItem('hospital_name') || accident?.['Hospital'] || 'DGH – Vavuniya';
    if (!localStorage.getItem('hospital_name') && !accident?.['Hospital']) missingValues.push('Current Hospital Name (fallback used)');

    // Engine Capacity - best-effort fallback
    obj['Engine Capacity'] = accident?.['Engine capacity'] || accident?.['Engine Capacity'] || '101To200';
    if (!accident?.['Engine capacity'] && !accident?.['Engine Capacity']) missingValues.push('Engine Capacity (hard-coded)');

    // Severity
    obj['Severity'] = accident?.['Severity'] || (injury1?.severity === 'S' ? 'S' : 'M');
    if (!accident?.['Severity'] && !injury1?.severity) missingValues.push('Severity');

    // Collision Force From
    obj['Collision Force From'] = accident?.['Collision force from'] || 'RightSide';
    if (!accident?.['Collision force from']) missingValues.push('Collision Force From (hard-coded)');

    // Side.1 (secondary injury side)
    obj['Side.1'] = injury2 ? (injury2.side || 'Unknown') : 'No Secondary Injury Found';
    if (!injury2) missingValues.push('Side.1 (no secondary injury)');

    // Type of Injury No 2
    obj['Type of Injury No 2'] = injury2?.type_of_injury || '';
    if (!injury2?.type_of_injury) missingValues.push('Type of Injury No 2');

    // Family Current Status
    obj['Family Current Status'] = accident?.['Family current status'] || 'Severely Affected';
    if (!accident?.['Family current status']) missingValues.push('Family Current Status (hard-coded)');

    // Time Taken To Reach Hospital
    obj['Time Taken To Reach Hospital'] = accident?.['Time taken to reach hospital'] || 'Less Than 15 Minutes';
    if (!accident?.['Time taken to reach hospital']) missingValues.push('Time Taken To Reach Hospital (hard-coded)');

    // Mode of Transport to the Hospital
    obj['Mode of Transport to the Hospital'] = accident?.['Mode of transport to hospital'] || 'Ambulance';
    if (!accident?.['Mode of transport to hospital']) missingValues.push('Mode of Transport to the Hospital (hard-coded)');

    // Category of Road
    obj['Category of Road'] = accident?.['Category of Road'] || 'SideRoad';
    if (!accident?.['Category of Road']) missingValues.push('Category of Road (hard-coded)');

    // Time of Collision
    obj['Time of Collision'] = accident?.['time of collision'] || '09:00 - 12:00';
    if (!accident?.['time of collision']) missingValues.push('Time of Collision (hard-coded)');

    // Include the friendly debug missingValues so UI can show data quality warnings
    obj._missingValues = missingValues;

    return obj;
  };

  const getHospitalStayPrediction = async (accident, patient) => {
    setLoadingHospitalStay(prev => ({ ...prev, [accident.accident_id]: true }));
    try {
      const prepared = prepareHospitalStayData(accident, patient);
      const missingValues = prepared._missingValues || [];

      // Remove debug prop before sending
      const payloadObj = { ...prepared };
      delete payloadObj._missingValues;

      const payload = { data: [payloadObj] };
      const response = await API.post('predictions/hospital-stay-predict', payload);

      // Expect response.predictions array
      const pred = response.data?.predictions && response.data.predictions[0];
      if (pred) {
        setHospitalStayPredictions(prev => ({
          ...prev,
          [accident.accident_id]: {
            prediction: pred.prediction,
            probabilities: pred.probabilities || pred.probabilities || {},
            missingValues: missingValues
          }
        }));
      } else {
        setHospitalStayPredictions(prev => ({
          ...prev,
          [accident.accident_id]: {
            prediction: 'Unknown',
            probabilities: {},
            missingValues: missingValues
          }
        }));
      }
    } catch (error) {
      console.error(`Error getting hospital stay prediction for ${accident.accident_id}:`, error);
      setHospitalStayPredictions(prev => ({
        ...prev,
        [accident.accident_id]: {
          prediction: 'Error',
          probabilities: {},
          message: 'Failed to get hospital stay prediction'
        }
      }));
    } finally {
      setLoadingHospitalStay(prev => ({ ...prev, [accident.accident_id]: false }));
    }
  };

  // Small skeleton components to display while loading
  const SkeletonPatient = () => (
    <div className="bg-white p-6 rounded-xl shadow-md mb-6 border border-slate-100 animate-pulse">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gray-200 rounded-xl" />
          <div className="space-y-2">
            <div className="w-48 h-4 bg-gray-200 rounded" />
            <div className="w-32 h-3 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="w-24 h-8 bg-gray-200 rounded" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-700">
        <div className="space-y-2">
          <div className="w-40 h-3 bg-gray-200 rounded" />
          <div className="w-32 h-3 bg-gray-200 rounded" />
          <div className="w-48 h-3 bg-gray-200 rounded" />
          <div className="w-56 h-3 bg-gray-200 rounded" />
        </div>
        <div className="space-y-2">
          <div className="w-44 h-3 bg-gray-200 rounded" />
          <div className="w-36 h-3 bg-gray-200 rounded" />
          <div className="w-28 h-3 bg-gray-200 rounded" />
          <div className="w-40 h-3 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );

  const SkeletonAccidentCard = () => (
    <article className="group bg-white rounded-xl border border-slate-100 p-4 shadow-sm animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="space-y-2">
          <div className="w-32 h-4 bg-gray-200 rounded" />
          <div className="w-24 h-3 bg-gray-200 rounded" />
        </div>
        <div className="w-12 h-6 bg-gray-200 rounded" />
      </div>

      <div className="space-y-2 text-slate-700">
        <div className="flex items-center justify-between">
          <div className="w-20 h-3 bg-gray-200 rounded" />
          <div className="w-24 h-3 bg-gray-200 rounded" />
        </div>
        <div className="flex items-center justify-between">
          <div className="w-28 h-3 bg-gray-200 rounded" />
          <div className="w-20 h-3 bg-gray-200 rounded" />
        </div>

        <div className="mt-3 space-y-2">
          <div className="p-3 bg-gray-100 rounded-lg">
            <div className="w-full h-3 bg-gray-200 rounded" />
            <div className="w-3/4 h-3 bg-gray-200 rounded mt-2" />
          </div>
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-400">&nbsp;</p>
    </article>
  );

  // Helper to translate model outcome labels (fallback to the original label)
  const translateOutcome = (label) => {
    if (!label) return label;
    // Create a safe key (convert spaces and punctuation to camel-case-like keys used in translations)
    const key = label.replace(/[^a-zA-Z0-9]+/g, ' ').trim().split(' ').map((w, i) => i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase()).join('');
    const translated = t(key);
    return translated || label;
  };

  // Helper to translate transfer prediction values into meaningful strings
  const translateTransferPrediction = (prediction) => {
    if (prediction === "1" || prediction === 1) {
      return t('transferRequired') || 'Transfer Required';
    } else if (prediction === "0" || prediction === 0) {
      return t('noTransferRequired') || 'No Transfer Required';
    } else if (prediction === "Yes") {
      return t('transferRequired') || 'Transfer Required';
    } else if (prediction === "No") {
      return t('noTransferRequired') || 'No Transfer Required';
    }
    // Fallback for any other values
    return prediction || t('unknown');
  };

  const formatPercent = (prob) => {
    if (prob === null || prob === undefined || isNaN(prob)) return '-';
    try {
      const pct = Number(prob) * 100;
      // use Intl for nicer formatting
      return new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(pct) + '%';
    } catch (e) {
      return (prob * 100).toFixed(1) + '%';
    }
  };

  // Helper to format the hospital-stay model prediction responses like
  // "[array(['2–3 days'], dtype=object)]" into a readable string "2–3 days".
  const formatHospitalStayPrediction = (raw) => {
    if (!raw && raw !== 0) return '';
    // If it's already a string label, return it
    if (typeof raw === 'string') {
      // Some responses are strings like "[array(['2–3 days'], dtype=object)]" or "['2–3 days']"
      // Try to extract the inner quoted text
      const m = raw.match(/['"]([^'"]+)['"]/);
      if (m && m[1]) return m[1];
      // If it's a JSON-like array, try parse
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return String(parsed[0]);
      } catch (e) {
        // ignore
      }
      return raw;
    }

    // If it's an array-like object (e.g., returned already parsed), handle common shapes
    try {
      // e.g., ['2–3 days']
      if (Array.isArray(raw) && raw.length > 0) return String(raw[0]);
      // e.g., object with array inside
      if (raw && raw[0] && Array.isArray(raw[0])) return String(raw[0][0]);
    } catch (e) {
      // fallback
    }

    return String(raw);
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

    // Current Hospital Name - use localStorage hospital data first, then fallback to accident data
    const hospitalName = localStorage.getItem('hospital_name') || accident?.["Hospital"] || accident?.hospital;
    data['current_hospital_name'] = hospitalName;
    if (!hospitalName) {
      missingValues.push('Current Hospital Name');
    }
    
    // Family Current Status
    data['family_current_status'] = accident?.["Family current status"];
    if (!accident?.["Family current status"]) {
      missingValues.push('Family Current Status');
    }

    // Type of injury No 1 - Extract from injuries array
    const injury1 = accident?.injuries && accident.injuries[0];
    data['type_of_injury_no_1'] = injury1?.type_of_injury 
    if (!injury1?.type_of_injury) {
      missingValues.push('Type of injury No 1 (no injury data available)');
    }

    // Type of Injury No 2 - Extract from injuries array
    const injury2 = accident?.injuries && accident.injuries[1];
    data['type_of_injury_no_2'] = injury2?.type_of_injury
    if (!injury2?.type_of_injury) {
      missingValues.push('Type of Injury No 2 (no secondary injury data available)');
    }


    // Traveling Expenditure per day
    data['traveling_expenditure_per_day'] = accident?.["Traveling Expenditure Per Day"];
    if (!accident?.["Traveling Expenditure Per Day"]) {
      missingValues.push('Traveling Expenditure Per Day');
    }

    // First Hospital Name - use localStorage hospital data first, then fallback to accident data
    const firstHospitalName = localStorage.getItem('hospital_name') || accident?.["Hospital"] || accident?.hospital;
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
          data['date_of_birth']
          missingValues.push('Date of Birth (invalid date format)');
        }
      } catch (e) {
        data['date_of_birth']
        missingValues.push('Date of Birth (date parsing error)');
      }
    } else {
      data['date_of_birth']
      missingValues.push('Date of Birth');
    }

    // Site of injury No1 - Extract from injuries array
    data['site_of_injury_no1'] = injury1?.site_of_injury
    if (!injury1?.site_of_injury) {
      missingValues.push('Site of injury No1 (no injury data available)');
    }

    // Site of injury No 2 - Extract from injuries array
    data['site_of_injury_no_2'] = injury2?.site_of_injury
    if (!injury2?.site_of_injury) {
      missingValues.push('Site of injury No 2 (no secondary injury data available)');
    }


    // Approximate Speed
    data['approximate_speed'] = accident?.["Approximate speed"];
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
          data['incident_at_time_and_date']
          missingValues.push('Incident At Time and Date (invalid date format)');
        }
      } catch (e) {
        data['incident_at_time_and_date'] 
        missingValues.push('Incident At Time and Date (date parsing error)');
      }
    } else {
      data['incident_at_time_and_date']
      missingValues.push('Incident At Time and Date');
    }

    // Hospital Distance From Home
    data['hospital_distance_from_home'] = accident?.["Hospital Distance From Home"];
    if (!accident?.["Hospital Distance From Home"]) {
      missingValues.push('Hospital Distance From Home');
    }

    // Mode of Transport to the Hospital
    data['mode_of_transport_to_the_hospital'] = accident?.["Mode of transport to hospital"];
    if (!accident?.["Mode of transport to hospital"]) {
      missingValues.push('Mode of Transport to the Hospital');
    }

    // Educational Qualification
    data['educational_qualification'] = patient?.["Education Qualification"];
    if (!patient?.["Education Qualification"]) {
      missingValues.push('Educational Qualification');
    }

    // Time Taken To Reach Hospitat
    data['time_taken_to_reach_hospital'] = accident?.["Time taken to reach hospital"];
    if (!accident?.["Time taken to reach hospital"]) {
      missingValues.push('Time taken to reach hospital');
    }


    // Any Other Hospital Admission Expenditure
    data['any_other_hospital_admission_expenditure'] = accident?.["Any Other Hospital Admission Expenditure"];
    if (!accident?.["Any Other Hospital Admission Expenditure"]) {
      missingValues.push('Any Other Hospital Admission Expenditure');
    }

    // Occupation
    data['occupation'] = patient?.["Occupation"];
    if (!patient?.["Occupation"]) {
      missingValues.push('Occupation');
    }

    // Family Monthly Income Before Accident
    data['family_monthly_income_before_accident'] = accident?.["Family monthly income before accident"];
    if (!accident?.["Family monthly income before accident"]) {
      missingValues.push('Family monthly income before accident');
    }

    // Collision With
    data['collision_with'] = accident?.["Collision with"];
    if (!accident?.["Collision with"]) {
      missingValues.push('Collision With');
    }

    // Life Style
    data['life_style'] = patient?.["Life Style"];
    if (!patient?.["Life Style"]) {
      missingValues.push('Life Style');
    }

    // Collision Force From
    data['collision_force_from'] = accident?.["Collision force from"];
    if (!accident?.["Collision force from"]) {
      missingValues.push('Collision force from');
    }

    // Road Type
    data['road_type'] = accident?.["Road Type"];
    if (!accident?.["Road Type"]) {
      missingValues.push('Road Type');
    }


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

    // Hospital one-hot - use localStorage hospital data first, then fallback to accident data
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
    
    // Use localStorage hospital data first, then fallback to accident hospital data
    const hospitalName = localStorage.getItem('hospital_name') || accident?.hospital;
    if (hospitalName) {
      data["First Hospital Name_" + hospitalName] = 1;
    } else {
      missingValues.push(`Hospital (localStorage: "${localStorage.getItem('hospital_name')}", accident: "${accident?.hospital}")`);
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
          <p className="mt-1 text-sm text-slate-500">{t('searchPatientsIntro')}</p>
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
        {loading ? (
          <SkeletonPatient />
        ) : (
          filtered && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
              {/* Patient Header */}
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                      {filtered["Full Name"] ? filtered["Full Name"].split(' ').map(n => n[0]).slice(0,2).join('') : 'P'}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{filtered["Full Name"]}</h2>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span>ID: {filtered["patient_id"]}</span>
                        <span>•</span>
                        <span>{filtered["Contact Number"]}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleCopy(filtered["patient_id"])} 
                      className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                    >
                      {t('copyId')}
                    </button>
                    {copySuccess && <span className="text-xs text-green-600 font-medium">{copySuccess}</span>}
                  </div>
                </div>
              </div>

              {/* Patient Details */}
              <div className="px-6 py-5">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Demographics */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b border-gray-200 pb-2">
                      {t('demographics')}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-gray-600 w-20 flex-shrink-0">{t('dateOfBirth')}</span>
                        <div className="text-sm text-gray-900 text-right">
                          <div>{filtered["Date of Birth"]}</div>
                          {filtered["Date of Birth"] && (
                            <div className="text-xs text-gray-500 mt-0.5">
                              {t('age')}: {Math.floor((new Date() - new Date(filtered["Date of Birth"])) / (1000 * 60 * 60 * 24 * 365.25))} years
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 w-20 flex-shrink-0">{t('gender')}</span>
                        <span className="text-sm text-gray-900">{filtered["Gender"]}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 w-20 flex-shrink-0">{t('ethnicity')}</span>
                        <span className="text-sm text-gray-900">{filtered["Ethnicity"]}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 w-20 flex-shrink-0">{t('bloodGroup')}</span>
                        <span className="text-sm text-gray-900">{filtered["Blood Group"] || t('notRecorded')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Social Information */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b border-gray-200 pb-2">
                      {t('socialInformation')}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 w-24 flex-shrink-0">{t('occupation')}</span>
                        <span className="text-sm text-gray-900 text-right">{filtered["Occupation"]}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 w-24 flex-shrink-0">{t('education')}</span>
                        <span className="text-sm text-gray-900 text-right">{filtered["Education Qualification"]}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 w-24 flex-shrink-0">{t('lifeStyle')}</span>
                        <span className="text-sm text-gray-900 text-right">{filtered["Life Style"]}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 w-24 flex-shrink-0">{t('familyMonthlyIncome')}</span>
                        <span className="text-sm text-gray-900 text-right">{filtered["Family Monthly Income"]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b border-gray-200 pb-2">
                      {t('contactInformation')}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-gray-600 w-16 flex-shrink-0">{t('address')}</span>
                        <span className="text-sm text-gray-900 text-right">{filtered["Address Street"]}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 w-16 flex-shrink-0">Phone</span>
                        <span className="text-sm text-gray-900">{filtered["Contact Number"]}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        )}

        {/* Medical Records Overview */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonAccidentCard key={i} />
            ))}
          </div>
        ) : (
          filtered && accidents.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{t('accidentRecords')}</h2>
                  <p className="text-sm text-gray-600">{t('clinicalIncidentIntro')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {accidents.length} {accidents.length === 1 ? 'Record' : 'Records'}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accidents.map((acc, index) => {
                // Calculate dynamic severity styling
                const severity = acc["Severity"];
                const isHighSeverity = severity === 'Serious';
                const isMediumSeverity = severity === 'Medium';
                const isLowSeverity = severity === 'Light' || severity === 'Minor';
                
                const severityColors = {
                  high: { border: 'border-l-red-500', bg: 'bg-red-50', text: 'text-red-700', badge: 'bg-red-100 text-red-800' },
                  medium: { border: 'border-l-orange-500', bg: 'bg-orange-50', text: 'text-orange-700', badge: 'bg-orange-100 text-orange-800' },
                  low: { border: 'border-l-green-500', bg: 'bg-green-50', text: 'text-green-700', badge: 'bg-green-100 text-green-800' },
                  default: { border: 'border-l-gray-500', bg: 'bg-gray-50', text: 'text-gray-700', badge: 'bg-gray-100 text-gray-800' }
                };
                
                const currentSeverity = isHighSeverity ? severityColors.high : 
                                      isMediumSeverity ? severityColors.medium : 
                                      isLowSeverity ? severityColors.low : 
                                      severityColors.default;

                return (
                  <article
                    key={acc.accident_id}
                    onClick={() => {
                      setSelectedAccident(acc);
                      setShowModal(true);
                    }}
                    className={`group bg-white border border-gray-200 ${currentSeverity.border} border-l-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden`}
                  >
                    {/* Card Header */}
                    <div className={`${currentSeverity.bg} px-4 py-3 border-b border-gray-100`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                            <span className="text-sm font-bold text-gray-700">#{index + 1}</span>
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900">{t('medicalIncident')} {index + 1}</h3>
                            <p className="text-xs text-gray-600">{acc["incident at date"]}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="px-4 py-4">
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex flex-col">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{t('time')}</span>
                            <span className="font-medium text-gray-900 mt-1">{acc["time of collision"]}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{t('status')}</span>
                            <span className={`font-medium mt-1 ${acc["Completed"] ? 'text-green-600' : 'text-orange-600'}`}>
                              {acc["Completed"] ? t('complete') : t('inProgress')}
                            </span>
                          </div>
                        </div>

                        {/* Dynamic ML Predictions Section */}
                        {!acc["Completed"] && (
                          <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
                            <div className="flex items-center space-x-2 mb-3">
                              <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                              </div>
                              <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">{t('clinicalDecisionSupport')}</h4>
                            </div>

                            {/* Transfer Risk Assessment */}
                            {loadingPredictions[acc.accident_id] ? (
                              <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                                <span className="ml-3 text-sm text-gray-600">Analyzing transfer risk...</span>
                              </div>
                            ) : transferProbabilities[acc.accident_id] ? (() => {
                              const transferData = transferProbabilities[acc.accident_id];
                              const probabilityPercent = parseFloat(transferData.probability?.replace('%', '') || '0');
                              const isHighRisk = probabilityPercent >= 70;
                              const isMediumRisk = probabilityPercent >= 40 && probabilityPercent < 70;
                              
                              const riskStyle = {
                                high: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', accent: 'bg-red-600', indicator: 'bg-red-500' },
                                medium: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', accent: 'bg-orange-600', indicator: 'bg-orange-500' },
                                low: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', accent: 'bg-green-600', indicator: 'bg-green-500' }
                              };
                              
                              const currentRisk = isHighRisk ? riskStyle.high : isMediumRisk ? riskStyle.medium : riskStyle.low;
                              const riskLevel = isHighRisk ? 'HIGH' : isMediumRisk ? 'MODERATE' : 'LOW';
                              
                              return (
                                <div className={`${currentRisk.bg} border ${currentRisk.border} rounded-lg p-3`}>
                                  <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center space-x-2">
                                      <div className={`w-3 h-3 ${currentRisk.indicator} rounded-full`}></div>
                                      <span className="text-xs font-medium text-gray-600">{t('transferRisk')}</span>
                                    </div>
                                    <span className={`text-xs font-bold px-2 py-1 rounded ${currentRisk.text} bg-white`}>
                                      {isHighRisk ? t('highRisk') : isMediumRisk ? t('moderateRisk') : t('lowRisk')}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-semibold text-gray-800">{transferData.probability}</span>
                                    <div className="flex-1 mx-3">
                                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                                        <div 
                                          className={`h-1.5 rounded-full ${currentRisk.indicator} transition-all duration-1000`} 
                                          style={{ width: `${Math.min(probabilityPercent, 100)}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                  </div>
                                  <p className={`text-xs ${currentRisk.text} font-medium`}>
                                    {translateTransferPrediction(transferData.prediction)}
                                  </p>
                                </div>
                              );
                            })() : (
                              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                <div className="flex items-center space-x-2">
                                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                                  <span className="text-xs text-gray-600">Transfer risk analysis unavailable</span>
                                </div>
                              </div>
                            )}

                            {/* Discharge Outcome Prediction */}
                            {/* Hospital Stay Prediction */}
                            {loadingHospitalStay[acc.accident_id] ? (
                              <div className="flex items-center justify-center p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                                <span className="ml-3 text-sm text-indigo-600">Predicting hospital stay...</span>
                              </div>
                            ) : hospitalStayPredictions[acc.accident_id] ? (() => {
                              const hs = hospitalStayPredictions[acc.accident_id];
                              const probs = hs.probabilities || {};
                              // Determine top prediction text
                              const top = hs.prediction || '';
                              return (
                                <div className="mt-3 bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                                        <span className="text-xs font-medium text-indigo-700">{t('hospitalStayTitleCompact')}</span>
                                      </div>
                                      <span className="text-xs font-semibold text-indigo-800 bg-white px-2 py-1 rounded">{formatHospitalStayPrediction(top)}</span>
                                  </div>
                                  {Object.keys(probs).length > 0 ? (
                                    <div className="space-y-2">
                                      {Object.entries(probs).sort(([,a],[,b]) => b-a).map(([k,v]) => (
                                        <div key={k} className="flex items-center justify-between text-sm">
                                          <div className="text-slate-700">{k}</div>
                                          <div className="font-semibold text-indigo-700">{(v*100).toFixed(1)}%</div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                      <div className="text-xs text-indigo-600">{t('noHospitalStayProbabilitiesCompact')}</div>
                                  )}

                                  {hs.missingValues && hs.missingValues.length > 0 && (
                                    <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded">
                                        <div className="text-xs text-orange-800 font-medium">{t('missingDefaultedFieldsCompact')}</div>
                                      <div className="flex flex-wrap gap-1 mt-2">
                                          {hs.missingValues.slice(0,5).map((m,i) => (
                                            <span key={i} className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded">{t(m) || m}</span>
                                          ))}
                                        {hs.missingValues.length > 5 && <span className="text-xs text-orange-700">+{hs.missingValues.length - 5} more</span>}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })() : (
                              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                                <div className="flex items-center space-x-2">
                                  <div className="w-3 h-3 bg-indigo-400 rounded-full"></div>
                                  <span className="text-xs text-indigo-600">Hospital stay prediction unavailable</span>
                                </div>
                              </div>
                            )}
                            {loadingDischargeOutcome[acc.accident_id] ? (
                              <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                                <span className="ml-3 text-sm text-blue-600">Predicting discharge outcome...</span>
                              </div>
                            ) : dischargeOutcomePredictions[acc.accident_id] ? (() => {
                              const dischargeData = dischargeOutcomePredictions[acc.accident_id];
                              const prediction = dischargeData.prediction?.toLowerCase() || '';
                              
                              const isPositive = prediction.includes('home') || prediction.includes('routine');
                              const isCritical = prediction.includes('death') || prediction.includes('expired');
                              const isTransfer = prediction.includes('transfer') || prediction.includes('other');
                              
                              const outcomeStyle = {
                                positive: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', indicator: 'bg-green-500' },
                                critical: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', indicator: 'bg-red-500' },
                                transfer: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', indicator: 'bg-blue-500' },
                                default: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', indicator: 'bg-blue-500' }
                              };
                              
                              const currentOutcome = isCritical ? outcomeStyle.critical : 
                                                   isPositive ? outcomeStyle.positive : 
                                                   isTransfer ? outcomeStyle.transfer : 
                                                   outcomeStyle.default;
                              
                              // Get the highest probability percentage for the progress bar
                              const probabilities = dischargeData.probabilities || {};
                              const highestProbability = Math.max(...Object.values(probabilities).map(p => Number(p) * 100));
                              const confidenceLevel = highestProbability >= 80 ? 'HIGH' : highestProbability >= 60 ? 'MODERATE' : 'LOW';
                              
                              return (
                                <div className={`${currentOutcome.bg} border ${currentOutcome.border} rounded-lg p-3`}>
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-2">
                                      <div className={`w-3 h-3 ${currentOutcome.indicator} rounded-full`}></div>
                                      <span className="text-xs font-medium text-blue-600">Discharge Outcome</span>
                                    </div>
                                    <span className={`text-xs font-bold px-2 py-1 rounded ${currentOutcome.text} bg-white`}>
                                      {confidenceLevel} CONFIDENCE
                                    </span>
                                  </div>
                                  <p className={`text-xs ${currentOutcome.text} font-medium mb-3`}>
                                    {dischargeData.prediction}
                                  </p>
                                  {dischargeData.probabilities && (
                                    <div className="space-y-2">
                                      {Object.entries(dischargeData.probabilities)
                                        .sort(([,a], [,b]) => b - a)
                                        .map(([outcome, probability]) => {
                                          const probabilityPercent = Number(probability) * 100;
                                          const isHighest = probabilityPercent === highestProbability;
                                          
                                          // Dynamic color based on probability and outcome type
                                          const getProgressColor = () => {
                                            if (outcome.toLowerCase().includes('recovery') && outcome.toLowerCase().includes('complete')) {
                                              return 'bg-green-500';
                                            } else if (outcome.toLowerCase().includes('recovery') && outcome.toLowerCase().includes('partial')) {
                                              return 'bg-blue-500';
                                            } else if (outcome.toLowerCase().includes('intervention')) {
                                              return 'bg-orange-500';
                                            } else if (probabilityPercent >= 70) {
                                              return 'bg-red-500';
                                            } else if (probabilityPercent >= 40) {
                                              return 'bg-yellow-500';
                                            } else {
                                              return 'bg-blue-500';
                                            }
                                          };
                                          
                                          return (
                                            <div key={outcome} className={`flex items-center justify-between p-2 rounded-lg transition-all duration-300 ${
                                              isHighest ? 'bg-white border border-blue-300 shadow-sm' : 'bg-white bg-opacity-60'
                                            }`}>
                                              <div className="flex items-center space-x-2 flex-1">
                                                <span className={`text-xs font-medium ${isHighest ? 'text-blue-900' : 'text-blue-700'} min-w-0 flex-1`}>
                                                  {translateOutcome(outcome)}
                                                </span>
                                                <div className="flex items-center space-x-2">
                                                  <div className="w-12 bg-blue-200 rounded-full h-1.5 shadow-inner">
                                                    <div 
                                                      className={`h-1.5 rounded-full ${getProgressColor()} transition-all duration-1000`}
                                                      style={{ width: `${Math.min(probabilityPercent, 100)}%` }}
                                                    ></div>
                                                  </div>
                                                  <span className={`text-xs font-bold ${isHighest ? 'text-blue-900' : 'text-blue-700'} min-w-fit`}>
                                                    {formatPercent(probability)}
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        })}
                                    </div>
                                  )}
                                </div>
                              );
                            })() : (
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <div className="flex items-center space-x-2">
                                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                                  <span className="text-xs text-blue-600">Discharge prediction unavailable</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {t('recordIdShort', { id: acc.accident_id?.toString().slice(-6) || 'N/A' })}
                        </span>
                        <span className="text-xs text-blue-600 font-medium group-hover:text-blue-800 flex items-center">
                          {t('viewDetails')}
                          <svg className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}

        {filtered && accidents.length === 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">{t('accidentRecords')}</h2>
            <p className="text-gray-700">{t('noAccidentRecords')}</p>
          </div>
        )}

        {/* Modal for Accident Details */}
        {showModal && selectedAccident && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[95vh] overflow-hidden border border-gray-200">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-900 to-blue-500 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">
                        {t('medicalRecordIncident')} #{accidents.findIndex(acc => acc.accident_id === selectedAccident.accident_id) + 1}
                      </h2>
                      <p className="text-blue-100 text-sm">{t('detailedAccidentInfo')}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setSelectedAccident(null);
                    }}
                    className="text-white hover:text-blue-100 transition-colors p-2 hover:bg-white hover:bg-opacity-10 rounded-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="overflow-y-auto max-h-[calc(95vh-80px)]">
                <div className="p-6 space-y-6">

                  {/* Clinical Decision Support Section */}
                  {!selectedAccident["Completed"] && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-5 mb-6">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{t('clinicalDecisionSupport')}</h3>
                          <p className="text-sm text-gray-600">{t('aiPredictionsForTreatment')}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Transfer Probability Analysis */}
                        {transferProbabilities[selectedAccident.accident_id] && (() => {
                          const transferData = transferProbabilities[selectedAccident.accident_id];
                          const probabilityPercent = parseFloat(transferData.probability?.replace('%', '') || '0');
                          const isHighRisk = probabilityPercent >= 70;
                          const isMediumRisk = probabilityPercent >= 40 && probabilityPercent < 70;
                          const isLowRisk = probabilityPercent < 40;
                          
                          const riskColors = {
                            high: {
                              border: 'border-red-300',
                              bg: 'bg-red-50',
                              icon: 'bg-red-100',
                              iconText: 'text-red-600',
                              probability: 'text-red-600',
                              recommendation: 'text-red-700',
                              accent: 'bg-red-100 border-red-200 text-red-800'
                            },
                            medium: {
                              border: 'border-orange-300',
                              bg: 'bg-orange-50',
                              icon: 'bg-orange-100',
                              iconText: 'text-orange-600',
                              probability: 'text-orange-600',
                              recommendation: 'text-orange-700',
                              accent: 'bg-orange-100 border-orange-200 text-orange-800'
                            },
                            low: {
                              border: 'border-blue-300',
                              bg: 'bg-blue-50',
                              icon: 'bg-blue-100',
                              iconText: 'text-blue-600',
                              probability: 'text-blue-600',
                              recommendation: 'text-blue-700',
                              accent: 'bg-blue-100 border-blue-200 text-blue-800'
                            }
                          };
                          
                          const currentRisk = isHighRisk ? riskColors.high : isMediumRisk ? riskColors.medium : riskColors.low;
                          
                          return (
                            <div className={`bg-white border-2 ${currentRisk.border} rounded-lg p-4 ${currentRisk.bg} shadow-lg transition-all duration-300 hover:shadow-xl`}>
                              <div className="flex items-center mb-3">
                                <div className={`w-8 h-8 ${currentRisk.icon} rounded-lg flex items-center justify-center mr-3 shadow-sm`}>
                                  <svg className={`w-4 h-4 ${currentRisk.iconText}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                  </svg>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900">{t('transferRiskAssessment')}</h4>
                                  <p className={`text-xs font-medium ${currentRisk.iconText}`}>
                                    {isHighRisk ? t('highRisk') : isMediumRisk ? t('moderateRisk') : t('lowRisk')}
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-3">
                                <div className={`flex justify-between items-center p-3 ${currentRisk.accent} rounded-lg border shadow-sm`}>
                                  <span className="text-sm font-medium text-gray-700">{t('transferProbability')}</span>
                                  <div className="flex items-center space-x-2">
                                    <div className={`w-16 bg-gray-200 rounded-full h-2 shadow-inner`}>
                                      <div 
                                        className={`h-2 rounded-full transition-all duration-1000 ${
                                          isHighRisk ? 'bg-red-500' : isMediumRisk ? 'bg-orange-500' : 'bg-green-500'
                                        }`} 
                                        style={{ width: `${Math.min(probabilityPercent, 100)}%` }}
                                      ></div>
                                    </div>
                                    <span className={`text-lg font-bold ${currentRisk.probability}`}>{transferData.probability}</span>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                                  <span className="text-sm font-medium text-gray-700">Recommendation</span>
                                  <span className={`text-sm font-semibold px-3 py-1 rounded-full ${currentRisk.accent}`}>
                                    {translateTransferPrediction(transferData.prediction)}
                                  </span>
                                </div>
                                <div className={`p-3 ${currentRisk.accent} rounded-lg border animate-pulse-subtle`}>
                                  <div className="flex items-start space-x-2">
                                    <svg className={`w-4 h-4 ${currentRisk.iconText} mt-0.5 flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className={`text-sm ${currentRisk.recommendation} font-medium`}>{transferData.message}</p>
                                  </div>
                                </div>
                              </div>

                              {transferData.missingValues && transferData.missingValues.length > 0 && (
                                <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                                  <h5 className="font-medium text-orange-900 mb-2 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                    Data Quality Notice
                                  </h5>
                                  <div className="max-h-20 overflow-y-auto">
                                    <div className="flex flex-wrap gap-1">
                                      {transferData.missingValues.slice(0, 5).map((missing, idx) => (
                                        <span key={idx} className="inline-block text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded">{t(missing) || missing}</span>
                                      ))}
                                      {transferData.missingValues.length > 5 && (
                                        <span className="text-xs text-orange-700">+{transferData.missingValues.length - 5} more</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })()}

                        {/* Discharge Outcome Analysis */}
                        {dischargeOutcomePredictions[selectedAccident.accident_id] && (() => {
                          const dischargeData = dischargeOutcomePredictions[selectedAccident.accident_id];
                          const prediction = dischargeData.prediction?.toLowerCase() || '';
                          
                          // Determine outcome type and styling
                          const isPositiveOutcome = prediction.includes('home') || prediction.includes('routine') || prediction.includes('recovery');
                          const isCriticalOutcome = prediction.includes('death') || prediction.includes('expired') || prediction.includes('mortality');
                          const isTransferOutcome = prediction.includes('transfer') || prediction.includes('other');
                          
                          const outcomeColors = {
                            positive: {
                              border: 'border-green-300',
                              bg: 'bg-green-50',
                              icon: 'bg-green-100',
                              iconText: 'text-green-600',
                              prediction: 'text-green-700',
                              accent: 'bg-green-100 border-green-200 text-green-800',
                              gradient: 'from-green-500 to-emerald-500'
                            },
                            critical: {
                              border: 'border-red-300',
                              bg: 'bg-red-50',
                              icon: 'bg-red-100',
                              iconText: 'text-red-600',
                              prediction: 'text-red-700',
                              accent: 'bg-red-100 border-red-200 text-red-800',
                              gradient: 'from-red-500 to-rose-500'
                            },
                            transfer: {
                              border: 'border-blue-300',
                              bg: 'bg-blue-50',
                              icon: 'bg-blue-100',
                              iconText: 'text-blue-600',
                              prediction: 'text-blue-700',
                              accent: 'bg-blue-100 border-blue-200 text-blue-800',
                              gradient: 'from-blue-500 to-indigo-500'
                            },
                            default: {
                              border: 'border-gray-300',
                              bg: 'bg-gray-50',
                              icon: 'bg-gray-100',
                              iconText: 'text-gray-600',
                              prediction: 'text-gray-700',
                              accent: 'bg-gray-100 border-gray-200 text-gray-800',
                              gradient: 'from-gray-500 to-slate-500'
                            }
                          };
                          
                          const currentOutcome = isCriticalOutcome ? outcomeColors.critical : 
                                               isPositiveOutcome ? outcomeColors.positive : 
                                               isTransferOutcome ? outcomeColors.transfer : 
                                               outcomeColors.default;
                          
                          return (
                            <div className={`bg-white border-2 ${currentOutcome.border} rounded-lg p-4 ${currentOutcome.bg} shadow-lg transition-all duration-300 hover:shadow-xl`}>
                              <div className="flex items-center mb-3">
                                <div className={`w-8 h-8 ${currentOutcome.icon} rounded-lg flex items-center justify-center mr-3 shadow-sm`}>
                                  <svg className={`w-4 h-4 ${currentOutcome.iconText}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                  </svg>
                                </div>
                                <div>
                                              <h4 className="font-semibold text-gray-900">{t('dischargeOutcomePredictionTitle')}</h4>
                                  <p className={`text-xs font-medium ${currentOutcome.iconText}`}>
                                    {isCriticalOutcome ? t('criticalOutcome') : 
                                     isPositiveOutcome ? t('positiveOutcome') : 
                                     isTransferOutcome ? t('transferRequired') : 
                                     t('standardCare')}
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-3">
                                <div className={`flex justify-between items-center p-3 ${currentOutcome.accent} rounded-lg border shadow-sm`}>
                                  <span className="text-sm font-medium text-gray-700">{t('predictedOutcome')}</span>
                                  <span className={`text-sm font-bold px-3 py-1 rounded-full bg-white shadow-sm ${currentOutcome.prediction}`}>
                                    {dischargeData.prediction}
                                  </span>
                                </div>
                                {dischargeData.probabilities && (
                                  <div className="space-y-2">
                                    <h5 className="text-sm font-medium text-gray-700 flex items-center">
                                      <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                      </svg>
                                      Probability Distribution
                                    </h5>
                                    {Object.entries(dischargeData.probabilities)
                                      .sort(([,a], [,b]) => b - a)
                                      .slice(0, 3)
                                      .map(([outcome, probability], index) => {
                                        const isHighest = index === 0;
                                        return (
                                          <div key={outcome} className={`flex justify-between items-center p-2 rounded-lg transition-all duration-300 ${
                                            isHighest ? `${currentOutcome.accent} border shadow-sm` : 'bg-white border border-gray-200'
                                          }`}>
                                            <span className={`text-xs font-medium ${isHighest ? currentOutcome.prediction : 'text-gray-600'}`}>
                                              {translateOutcome(outcome)}
                                            </span>
                                            <div className="flex items-center gap-2">
                                              <div className="w-20 bg-gray-200 rounded-full h-2 shadow-inner">
                                                <div 
                                                  className={`h-2 rounded-full bg-gradient-to-r ${currentOutcome.gradient} transition-all duration-1000`}
                                                  style={{ width: `${Number(probability) * 100}%` }}
                                                ></div>
                                              </div>
                                              <span className={`text-xs font-bold w-10 ${isHighest ? currentOutcome.prediction : 'text-gray-900'}`}>
                                                {formatPercent(probability)}
                                              </span>
                                            </div>
                                          </div>
                                        );
                                      })}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })()}

                        {/* Hospital Stay Details in Modal */}
                        {hospitalStayPredictions[selectedAccident.accident_id] && (() => {
                          const hs = hospitalStayPredictions[selectedAccident.accident_id];
                          const probs = hs.probabilities || {};
                          const top = hs.prediction || '';

                          return (
                            <div className="bg-white border-2 border-indigo-200 rounded-lg p-4">
                              <div className="flex items-center mb-3">
                                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                                  <svg className="w-4 h-4 text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v4a1 1 0 001 1h3m10 0h3a1 1 0 001-1V7M3 7a2 2 0 012-2h14a2 2 0 012 2M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7" /></svg>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900">{t('hospitalStayTitle')}</h4>
                                  <p className="text-xs text-indigo-600">{t('hospitalStaySubtitle')}</p>
                                </div>
                              </div>

                              <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                                  <span className="text-sm font-medium text-gray-700">{t('predictedStay')}</span>
                                  <span className="text-sm font-bold text-indigo-800">{formatHospitalStayPrediction(top)}</span>
                                </div>

                                {Object.keys(probs).length > 0 ? (
                                  <div className="space-y-2">
                                    {Object.entries(probs).sort(([,a],[,b]) => b-a).map(([k,v]) => (
                                      <div key={k} className="flex items-center justify-between p-2 rounded-lg bg-white border border-gray-100">
                                        <div className="text-sm text-gray-700">{k}</div>
                                        <div className="font-semibold text-indigo-700">{(v*100).toFixed(1)}%</div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-sm text-gray-600">{t('noHospitalStayProbabilities')}</div>
                                )}

                                {hs.missingValues && hs.missingValues.length > 0 && (
                                  <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded">
                                    <div className="text-sm font-medium text-orange-800">{t('missingDefaultedFields')}</div>
                                    <div className="mt-2 flex flex-wrap gap-1">
                                      {hs.missingValues.map((m,i) => (
                                        <span key={i} className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded">{t(m) || m}</span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {/* Main Content Sections */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {/* Incident Overview */}
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h3 className="font-semibold text-gray-900">{t('incidentOverview') || 'Incident Overview'}</h3>
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 font-medium">{t('incidentDate')}</span>
                          <span className="text-sm text-gray-900">{selectedAccident["incident at date"]}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 font-medium">{t('timeOfCollision')}</span>
                          <span className="text-sm text-gray-900">{selectedAccident["time of collision"]}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 font-medium">{t('severity')}</span>
                          <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                            selectedAccident["Severity"] === 'Serious' ? 'bg-red-100 text-red-800' :
                            selectedAccident["Severity"] === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>{selectedAccident["Severity"]}</span>
                        </div>
                      </div>
                    </div>

                    {/* Environmental Conditions */}
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-green-50 border-b border-green-200 px-4 py-3">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                            </svg>
                          </div>
                          <h3 className="font-semibold text-gray-900">{t('environmentConditions')}</h3>
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 font-medium">{t('visibility')}</span>
                          <span className="text-sm text-gray-900">{selectedAccident["Visibility"]}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 font-medium">{t('roadCondition')}</span>
                          <span className="text-sm text-gray-900">{selectedAccident["Road Condition"]}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 font-medium">{t('roadType')}</span>
                          <span className="text-sm text-gray-900">{selectedAccident["Road Type"]}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 font-medium">{t('categoryOfRoad')}</span>
                          <span className="text-sm text-gray-900">{selectedAccident["Category of Road"]}</span>
                        </div>
                      </div>
                    </div>

                    {/* Vehicle & Collision Details */}
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-purple-50 border-b border-purple-200 px-4 py-3">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <h3 className="font-semibold text-gray-900">{t('vehicleCollisionDetails') || 'Vehicle & Collision Details'}</h3>
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 font-medium">{t('approximateSpeed')}</span>
                          <span className="text-sm text-gray-900">{selectedAccident["Approximate speed"]}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 font-medium">{t('modeOfTraveling')}</span>
                          <span className="text-sm text-gray-900">{selectedAccident["Mode of traveling during accident"]}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 font-medium">{t('collisionWith')}</span>
                          <span className="text-sm text-gray-900">{selectedAccident["Collision with"]}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 font-medium">{t('helmetWorn')}</span>
                          <span className={`text-sm font-medium ${selectedAccident["Helmet Worn"] === 'Yes' ? 'text-green-600' : 'text-red-600'}`}>
                            {selectedAccident["Helmet Worn"]}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 font-medium">{t('alcoholConsumption')}</span>
                          <span className={`text-sm font-medium ${selectedAccident["Alcohol Consumption"] === 'No' ? 'text-green-600' : 'text-red-600'}`}>
                            {selectedAccident["Alcohol Consumption"]}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 font-medium">{t('illicitDrugs')}</span>
                          <span className={`text-sm font-medium ${selectedAccident["Illicit Drugs"] === 'No' ? 'text-green-600' : 'text-red-600'}`}>
                            {selectedAccident["Illicit Drugs"]}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Medical Response */}
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                          </div>
                          <h3 className="font-semibold text-gray-900">{t('medicalResponse') || 'Medical Response'}</h3>
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 font-medium">{t('firstAidGivenAtScene')}</span>
                          <span className={`text-sm font-medium ${selectedAccident["First aid given at seen"] ? 'text-green-600' : 'text-red-600'}`}>
                            {selectedAccident["First aid given at seen"] ? t('yes') : t('no')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 font-medium">{t('modeOfTransportToHospital')}</span>
                          <span className="text-sm text-gray-900">{selectedAccident["Mode of transport to hospital"]}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 font-medium">{t('timeTakenToReachHospital')}</span>
                          <span className="text-sm text-gray-900">{selectedAccident["Time taken to reach hospital"]}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 font-medium">{t('hospital')}</span>
                          <span className="text-sm text-gray-900">{localStorage.getItem('hospital_name') || selectedAccident["Hospital"] || selectedAccident?.hospital || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 font-medium">{t('hospitalDistanceFromHome')}</span>
                          <span className="text-sm text-gray-900">{selectedAccident["Hospital Distance From Home"]}</span>
                        </div>
                      </div>
                    </div>

                    {/* Financial Impact */}
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-3">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                          </div>
                          <h3 className="font-semibold text-gray-900">{t('financialImpact') || 'Financial Impact'}</h3>
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 font-medium">{t('familyMonthlyIncomeBeforeAccident')}</span>
                          <span className="text-sm text-gray-900">{selectedAccident["Family monthly income before accident"]}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 font-medium">{t('familyMonthlyIncomeAfterAccident')}</span>
                          <span className="text-sm text-gray-900">{selectedAccident["Family monthly income after accident"]}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 font-medium">{t('familyCurrentStatus')}</span>
                          <span className="text-sm text-gray-900">{selectedAccident["Family current status"]}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 font-medium">{t('bystanderExpenditurePerDay')}</span>
                          <span className="text-sm text-gray-900">{selectedAccident["Bystander expenditure per day"]}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 font-medium">{t('travelingExpenditurePerDay')}</span>
                          <span className="text-sm text-gray-900">{selectedAccident["Traveling Expenditure Per Day"]}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 font-medium">{t('anyOtherHospitalAdmissionExpenditure')}</span>
                          <span className="text-sm text-gray-900">{selectedAccident["Any Other Hospital Admission Expenditure"]}</span>
                        </div>
                      </div>
                    </div>

                    {/* Injury Details Section */}
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-red-50 border-b border-red-200 px-4 py-3">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                          </div>
                          <h3 className="font-semibold text-gray-900">{t('injuryDetails')}</h3>
                        </div>
                      </div>
                      <div className="p-4">
                        {selectedAccident.injuries && selectedAccident.injuries.length > 0 ? (
                          <div className="space-y-3">
                            {selectedAccident.injuries.map((injury, index) => (
                              <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                <div className="flex items-center mb-2">
                                  <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                                    {index + 1}
                                  </div>
                                  <h4 className="text-sm font-medium text-gray-900">{t('injuryNumber')} {index + 1}</h4>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-xs text-gray-600 font-medium">{t('siteOfInjury')}</span>
                                    <span className="text-xs text-gray-900">{injury.site_of_injury || '-'}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-xs text-gray-600 font-medium">{t('typeOfInjury')}</span>
                                    <span className="text-xs text-gray-900">{injury.type_of_injury || '-'}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-xs text-gray-600 font-medium">{t('severity')}</span>
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                      injury.severity === 'S' ? 'bg-red-100 text-red-800' : 
                                      injury.severity === 'M' ? 'bg-yellow-100 text-yellow-800' : 
                                      injury.severity === 'L' ? 'bg-green-100 text-green-800' : 
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {injury.severity === 'S' ? 'Serious' :
                                       injury.severity === 'M' ? 'Medium' :
                                       injury.severity === 'L' ? 'Light' :
                                       injury.severity || 'Unknown'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-gray-500">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <p className="text-sm text-gray-600 font-medium">{t('noInjuries')}</p>
                            <p className="text-xs text-gray-500 mt-1">No injury information recorded</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Record ID: {selectedAccident.accident_id} • Last updated: {selectedAccident["incident at date"]}
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => {
                          setShowModal(false);
                          setSelectedAccident(null);
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                      >
                        {t('close')}
                      </button>
                      <button
                        onClick={() => {
                          const printContent = `
                            <!DOCTYPE html>
                            <html>
                            <head>
                              <title>Medical Report - ${filtered["Full Name"]}</title>
                              <style>
                                @media print { @page { margin: 1in; } }
                                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
                                .header { text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
                                .hospital-name { color: #2563eb; font-size: 24px; font-weight: bold; margin-bottom: 5px; }
                                .report-title { font-size: 20px; font-weight: 600; color: #1f2937; }
                                .report-date { color: #6b7280; font-size: 14px; }
                                .section { margin-bottom: 25px; }
                                .section-title { background: #f3f4f6; padding: 10px 15px; border-left: 4px solid #2563eb; font-weight: 600; color: #1f2937; margin-bottom: 15px; }
                                .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px; }
                                .info-item { display: flex; padding: 8px 12px; border-bottom: 1px solid #e5e7eb; }
                                .info-label { font-weight: 600; color: #374151; min-width: 150px; }
                                .info-value { color: #1f2937; }
                                .accident-header { background: #fef3c7; padding: 12px 15px; border-left: 4px solid #f59e0b; margin: 20px 0 15px 0; }
                                .prediction-box { background: #dbeafe; border: 1px solid #93c5fd; padding: 15px; border-radius: 8px; margin: 10px 0; }
                                .prediction-title { font-weight: 600; color: #1e40af; margin-bottom: 8px; }
                                .injury-item { background: #fef2f2; border: 1px solid #fecaca; padding: 12px; border-radius: 6px; margin: 8px 0; }
                                .severity-serious { background: #fee2e2; color: #991b1b; }
                                .severity-medium { background: #fef3c7; color: #92400e; }
                                .severity-light { background: #dcfce7; color: #15803d; }
                                .footer { text-align: center; border-top: 1px solid #d1d5db; padding-top: 20px; margin-top: 40px; color: #6b7280; font-size: 12px; }
                              </style>
                            </head>
                            <body>
                              <div class="header">
                                <div class="hospital-name">${localStorage.getItem('hospital_name') || 'Medical Center'}</div>
                                <div class="report-title">Patient Medical Report</div>
                                <div class="report-date">Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</div>
                              </div>

                              <div class="section">
                                <div class="section-title">Patient Information</div>
                                <div class="info-grid">
                                  <div class="info-item">
                                    <span class="info-label">Full Name:</span>
                                    <span class="info-value">${filtered["Full Name"]}</span>
                                  </div>
                                  <div class="info-item">
                                    <span class="info-label">Patient ID:</span>
                                    <span class="info-value">${filtered["patient_id"]}</span>
                                  </div>
                                  <div class="info-item">
                                    <span class="info-label">Date of Birth:</span>
                                    <span class="info-value">${filtered["Date of Birth"]}</span>
                                  </div>
                                  <div class="info-item">
                                    <span class="info-label">Age:</span>
                                    <span class="info-value">${Math.floor((new Date() - new Date(filtered["Date of Birth"])) / (1000 * 60 * 60 * 24 * 365.25))} years</span>
                                  </div>
                                  <div class="info-item">
                                    <span class="info-label">Gender:</span>
                                    <span class="info-value">${filtered["Gender"]}</span>
                                  </div>
                                  <div class="info-item">
                                    <span class="info-label">Blood Group:</span>
                                    <span class="info-value">${filtered["Blood Group"] || 'Not recorded'}</span>
                                  </div>
                                  <div class="info-item">
                                    <span class="info-label">Contact Number:</span>
                                    <span class="info-value">${filtered["Contact Number"]}</span>
                                  </div>
                                  <div class="info-item">
                                    <span class="info-label">Address:</span>
                                    <span class="info-value">${filtered["Address Street"]}</span>
                                  </div>
                                  <div class="info-item">
                                    <span class="info-label">Occupation:</span>
                                    <span class="info-value">${filtered["Occupation"]}</span>
                                  </div>
                                  <div class="info-item">
                                    <span class="info-label">Education:</span>
                                    <span class="info-value">${filtered["Education Qualification"]}</span>
                                  </div>
                                </div>
                              </div>

                              <div class="accident-header">
                                <strong>ACCIDENT RECORD - Incident #${accidents.findIndex(acc => acc.accident_id === selectedAccident.accident_id) + 1}</strong>
                              </div>

                              <div class="section">
                                <div class="section-title">Incident Overview</div>
                                <div class="info-grid">
                                  <div class="info-item">
                                    <span class="info-label">Incident Date:</span>
                                    <span class="info-value">${selectedAccident["incident at date"]}</span>
                                  </div>
                                  <div class="info-item">
                                    <span class="info-label">Time of Collision:</span>
                                    <span class="info-value">${selectedAccident["time of collision"]}</span>
                                  </div>
                                  <div class="info-item">
                                    <span class="info-label">Severity:</span>
                                    <span class="info-value">${selectedAccident["Severity"]}</span>
                                  </div>
                                  <div class="info-item">
                                    <span class="info-label">Completed:</span>
                                    <span class="info-value">${selectedAccident["Completed"] ? 'Yes' : 'No'}</span>
                                  </div>
                                </div>
                              </div>

                              ${!selectedAccident["Completed"] && transferProbabilities[selectedAccident.accident_id] ? `
                              <div class="prediction-box">
                                <div class="prediction-title">AI Transfer Risk Assessment</div>
                                <div class="info-item">
                                  <span class="info-label">Transfer Probability:</span>
                                  <span class="info-value">${transferProbabilities[selectedAccident.accident_id].probability}</span>
                                </div>
                                <div class="info-item">
                                  <span class="info-label">Recommendation:</span>
                                  <span class="info-value">${translateTransferPrediction(transferProbabilities[selectedAccident.accident_id].prediction)}</span>
                                </div>
                              </div>
                              ` : ''}

                              ${!selectedAccident["Completed"] && dischargeOutcomePredictions[selectedAccident.accident_id] ? `
                              <div class="prediction-box">
                                <div class="prediction-title">AI Discharge Outcome Prediction</div>
                                <div class="info-item">
                                  <span class="info-label">Predicted Outcome:</span>
                                  <span class="info-value">${dischargeOutcomePredictions[selectedAccident.accident_id].prediction}</span>
                                </div>
                              </div>
                              ` : ''}

                              <div class="section">
                                <div class="section-title">Medical Response</div>
                                <div class="info-grid">
                                  <div class="info-item">
                                    <span class="info-label">First Aid at Scene:</span>
                                    <span class="info-value">${selectedAccident["First aid given at seen"] ? 'Yes' : 'No'}</span>
                                  </div>
                                  <div class="info-item">
                                    <span class="info-label">Transport to Hospital:</span>
                                    <span class="info-value">${selectedAccident["Mode of transport to hospital"]}</span>
                                  </div>
                                  <div class="info-item">
                                    <span class="info-label">Time to Hospital:</span>
                                    <span class="info-value">${selectedAccident["Time taken to reach hospital"]}</span>
                                  </div>
                                  <div class="info-item">
                                    <span class="info-label">Hospital:</span>
                                    <span class="info-value">${localStorage.getItem('hospital_name') || selectedAccident["Hospital"] || 'Not specified'}</span>
                                  </div>
                                </div>
                              </div>

                              ${selectedAccident.injuries && selectedAccident.injuries.length > 0 ? `
                              <div class="section">
                                <div class="section-title">Injury Details</div>
                                ${selectedAccident.injuries.map((injury, index) => `
                                  <div class="injury-item">
                                    <strong>Injury ${index + 1}:</strong><br>
                                    <span class="info-label">Site:</span> ${injury.site_of_injury || 'Not specified'}<br>
                                    <span class="info-label">Type:</span> ${injury.type_of_injury || 'Not specified'}<br>
                                    <span class="info-label">Severity:</span> 
                                    <span class="severity-${injury.severity === 'S' ? 'serious' : injury.severity === 'M' ? 'medium' : 'light'}">
                                      ${injury.severity === 'S' ? 'Serious' : injury.severity === 'M' ? 'Medium' : injury.severity === 'L' ? 'Light' : 'Unknown'}
                                    </span>
                                  </div>
                                `).join('')}
                              </div>
                              ` : ''}

                              <div class="section">
                                <div class="section-title">Environmental & Vehicle Details</div>
                                <div class="info-grid">
                                  <div class="info-item">
                                    <span class="info-label">Visibility:</span>
                                    <span class="info-value">${selectedAccident["Visibility"]}</span>
                                  </div>
                                  <div class="info-item">
                                    <span class="info-label">Road Condition:</span>
                                    <span class="info-value">${selectedAccident["Road Condition"]}</span>
                                  </div>
                                  <div class="info-item">
                                    <span class="info-label">Approximate Speed:</span>
                                    <span class="info-value">${selectedAccident["Approximate speed"]}</span>
                                  </div>
                                  <div class="info-item">
                                    <span class="info-label">Mode of Travel:</span>
                                    <span class="info-value">${selectedAccident["Mode of traveling during accident"]}</span>
                                  </div>
                                  <div class="info-item">
                                    <span class="info-label">Helmet Worn:</span>
                                    <span class="info-value">${selectedAccident["Helmet Worn"]}</span>
                                  </div>
                                  <div class="info-item">
                                    <span class="info-label">Alcohol Consumption:</span>
                                    <span class="info-value">${selectedAccident["Alcohol Consumption"]}</span>
                                  </div>
                                </div>
                              </div>

                              <div class="footer">
                                <p>This report was generated electronically by the Medical Information System</p>
                                <p>Record ID: ${selectedAccident.accident_id} | Generated by: ${localStorage.getItem('user_name') || 'Medical Staff'}</p>
                              </div>
                            </body>
                            </html>
                          `;
                          
                          const printWindow = window.open('', '_blank');
                          printWindow.document.write(printContent);
                          printWindow.document.close();
                          printWindow.focus();
                          setTimeout(() => {
                            printWindow.print();
                            printWindow.close();
                          }, 250);
                        }}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Print Report
                      </button>
                    </div>
                  </div>
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