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

  const handleSearch = async () => {
    setError("");
    setFiltered(null);
    setAccidents([]);
    setTransferProbabilities({});
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
    <div className="bg-gray-100">
      <DoctorNav setIsAuthenticated={setIsAuthenticated} setRole={setRole} />
      <div className="container mx-auto p-6 min-h-screen">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">
          View Patient Data
        </h1>

        {/* Search box */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <label className="block mb-2 text-gray-700 font-medium">
            Search Patient:
          </label>
          <div className="flex">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Patient ID, NIC, or Full Name"
              className="flex-1 border border-gray-300 rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            You can search by Patient ID, NIC, or Full Name
          </p>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        {/* Patient info */}
        {filtered && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Patient Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
              <p><span className="font-medium">Full Name:</span> {filtered["Full Name"]}</p>
              <p><span className="font-medium">Contact Number:</span> {filtered["Contact Number"]}</p>
              <p><span className="font-medium">Date of Birth:</span> {filtered["Date of Birth"]} 
                {filtered["Date of Birth"] && (
                  <span> (Age: {Math.floor((new Date() - new Date(filtered["Date of Birth"])) / (1000 * 60 * 60 * 24 * 365.25))})</span>
                )}
              </p>
              <p><span className="font-medium">Ethnicity:</span> {filtered["Ethnicity"]}</p>
              <p><span className="font-medium">Gender:</span> {filtered["Gender"]}</p>
              <p><span className="font-medium">Address:</span> {filtered["Address Street"]}</p>
              <p><span className="font-medium">Life Style:</span> {filtered["Life Style"]}</p>
              <p><span className="font-medium">Education:</span> {filtered["Education Qualification"]}</p>
              <p><span className="font-medium">Occupation:</span> {filtered["Occupation"]}</p>
              <p><span className="font-medium">Family Monthly Income:</span> {filtered["Family Monthly Income"]}</p>
              <p>
                <span className="font-medium">Blood Group:</span>{" "}
                {filtered["Blood Group"] || "Not Recorded"}
              </p>

              <p><span className="font-medium">Patient ID:</span> {filtered["patient_id"]}</p>
            </div>
          </div>
        )}

        {/* Accident Summary */}
        {filtered && accidents.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              Accident Records ({accidents.length})
            </h2>
            <div className="space-y-3">
              {accidents.map((acc, index) => (
                <div
                  key={acc.accident_id}
                  onClick={() => {
                    setSelectedAccident(acc);
                    setShowModal(true);
                  }}
                  className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 hover:border-blue-300 transition-all duration-200"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-blue-700">Accident #{index + 1}</h3>
                    {!acc["Completed"] && (
                      <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-medium">
                        Incomplete
                      </div>
                    )}
                  </div>
                  <div className="text-gray-700">
                    <p><span className="font-medium">Incident Date:</span> {acc["incident at date"]}</p>
                    <p><span className="font-medium">Time Of Collision:</span> {acc["time of collision"]}</p>
                    <p>
                      <span className="font-medium">Completed:</span>{" "}
                      {acc["Completed"] ? "Yes" : "No"}
                    </p>
                    
                    {/* Prediction Display for Incomplete Accidents */}
                    {!acc["Completed"] && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-800 mb-2">ML Transfer Prediction:</h4>
                        {loadingPredictions[acc.accident_id] ? (
                          <div className="flex items-center gap-2 text-blue-600">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            Calculating prediction...
                          </div>
                        ) : transferProbabilities[acc.accident_id] ? (
                          <div className="space-y-1">
                            <p className="text-sm">
                              <span className="font-medium">Transfer Probability:</span>{" "}
                              <span className="font-bold text-blue-700">
                                {transferProbabilities[acc.accident_id].probability}
                              </span>
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Prediction:</span>{" "}
                              <span className="font-semibold">
                                {transferProbabilities[acc.accident_id].prediction}
                              </span>
                            </p>
                            {transferProbabilities[acc.accident_id].message && (
                              <p className="text-xs text-gray-600 mt-1">
                                {transferProbabilities[acc.accident_id].message}
                              </p>
                            )}
                            {/* {transferProbabilities[acc.accident_id].missingValues && 
                             transferProbabilities[acc.accident_id].missingValues.length > 0 && (
                              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                                <p className="text-xs font-semibold text-yellow-800 mb-1">
                                  ⚠️ Missing Data ({transferProbabilities[acc.accident_id].missingValues.length} fields):
                                </p>
                                <ul className="text-xs text-yellow-700 list-disc list-inside">
                                  {transferProbabilities[acc.accident_id].missingValues.slice(0, 3).map((missing, idx) => (
                                    <li key={idx}>{missing}</li>
                                  ))}
                                  {transferProbabilities[acc.accident_id].missingValues.length > 3 && (
                                    <li>...and {transferProbabilities[acc.accident_id].missingValues.length - 3} more</li>
                                  )}
                                </ul>
                              </div>
                            )} */}
                          </div>
                        ) : (
                          <p className="text-sm text-red-600">Prediction not available</p>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-blue-600 mt-2">Click to view full details →</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {filtered && accidents.length === 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Accident Records</h2>
            <p className="text-gray-700">No accident records for this patient.</p>
          </div>
        )}

        {/* Modal for Accident Details */}
        {showModal && selectedAccident && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-blue-700">
                    Accident #{accidents.findIndex(acc => acc.accident_id === selectedAccident.accident_id) + 1} - Full Details
                  </h2>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setSelectedAccident(null);
                    }}
                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>
                
                {/* Prediction in Modal for Incomplete Accidents */}
                {!selectedAccident["Completed"] && transferProbabilities[selectedAccident.accident_id] && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
                      🧠 ML Transfer Prediction Analysis
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-blue-600">
                          {transferProbabilities[selectedAccident.accident_id].probability}
                        </div>
                        <div className="text-sm text-blue-800 font-medium">Transfer Probability</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div className="text-xl font-bold text-purple-600">
                          {transferProbabilities[selectedAccident.accident_id].prediction}
                        </div>
                        <div className="text-sm text-purple-800 font-medium">Prediction Outcome</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div className="text-sm text-green-700">
                          {transferProbabilities[selectedAccident.accident_id].message}
                        </div>
                        <div className="text-xs text-green-600 font-medium mt-1">Analysis</div>
                      </div>
                    </div>
                    
                    {/* Missing Values Section */}
                    {/* {transferProbabilities[selectedAccident.accident_id].missingValues && 
                     transferProbabilities[selectedAccident.accident_id].missingValues.length > 0 && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                          ⚠️ Missing/Null Data Fields ({transferProbabilities[selectedAccident.accident_id].missingValues.length})
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {transferProbabilities[selectedAccident.accident_id].missingValues.map((missing, idx) => (
                            <div key={idx} className="text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded">
                              {missing}
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-yellow-600 mt-2 italic">
                          *These fields were null/undefined when making the prediction
                        </p>
                      </div>
                    )} */}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3 text-blue-600">Basic Information</h3>
                    <p className="mb-2"><span className="font-medium">Incident Date:</span> {selectedAccident["incident at date"]}</p>
                    <p className="mb-2"><span className="font-medium">Time of Collision:</span> {selectedAccident["time of collision"]}</p>
                    <p className="mb-2"><span className="font-medium">Severity:</span> {selectedAccident["Severity"]}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3 text-blue-600">Environment Conditions</h3>
                    <p className="mb-2"><span className="font-medium">Visibility:</span> {selectedAccident["Visibility"]}</p>
                    <p className="mb-2"><span className="font-medium">Road Condition:</span> {selectedAccident["Road Condition"]}</p>
                    <p className="mb-2"><span className="font-medium">Road Type:</span> {selectedAccident["Road Type"]}</p>
                    <p className="mb-2"><span className="font-medium">Category of Road:</span> {selectedAccident["Category of Road"]}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3 text-blue-600">Accident Details</h3>
                    <p className="mb-2"><span className="font-medium">Approximate Speed:</span> {selectedAccident["Approximate speed"]}</p>
                    <p className="mb-2"><span className="font-medium">Mode of Traveling:</span> {selectedAccident["Mode of traveling during accident"]}</p>
                    <p className="mb-2"><span className="font-medium">Collision With:</span> {selectedAccident["Collision with"]}</p>
                    <p className="mb-2"><span className="font-medium">Mode of Transport to Hospital:</span> {selectedAccident["Mode of transport to hospital"]}</p>
                    <p className="mb-2"><span className="font-medium">Alcohol Consumption:</span> {selectedAccident["Alcohol Consumption"]}</p>
                    <p className="mb-2"><span className="font-medium">Illicit Drugs:</span> {selectedAccident["Illicit Drugs"]}</p>
                    <p className="mb-2"><span className="font-medium">Helmet Worn:</span> {selectedAccident["Helmet Worn"]}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3 text-blue-600">Medical & Financial</h3>
                    <p className="mb-2"><span className="font-medium">First Aid Given at Scene:</span> {selectedAccident["First aid given at seen"] ? "Yes" : "No"}</p>
                    <p className="mb-2"><span className="font-medium">Hospital Distance From Home:</span> {selectedAccident["Hospital Distance From Home"]}</p>
                    <p className="mb-2"><span className="font-medium">Hospital:</span> {selectedAccident["Hospital"]}</p>
                    <p className="mb-2"><span className="font-medium">Family Current Status:</span> {selectedAccident["Family current status"]}</p>
                    <p className="mb-2"><span className="font-medium">Bystander Expenditure/Day:</span> {selectedAccident["Bystander expenditure per day"]}</p>
                    <p className="mb-2"><span className="font-medium">Traveling Expenditure Per Day:</span> {selectedAccident["Traveling Expenditure Per Day"]}</p>
                    <p className="mb-2"><span className="font-medium">Any Other Hospital Admission Expenditure:</span> {selectedAccident["Any Other Hospital Admission Expenditure"]}</p>
                  </div>

                  <p className="mb-2"><span className="font-medium">Completed:</span> {selectedAccident["Completed"] ? "Yes" : "No"}</p>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setSelectedAccident(null);
                    }}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Close
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