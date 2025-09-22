import React, { useState } from 'react';
import AdminNav from '../../navbars/AdminNav';
import API from "../../utils/api";

const PredictionAdmin = ({ setIsAuthenticated, setRole }) => {
  const [formData, setFormData] = useState({
    "Time of Collision": "00:00 - 03:00",
    "Discharge Outcome": "Partial Recovery",
    "Facilities for Daily Activity": "Both Toilet and Bathing Facilities Available",
    "Access To Wash Room": "Yes",
    "Type of Toilet Modification": "No Modification done",
    "Bystander Expenditure per day": "500-1000",
    "Traveling Expenditure per day": "300-400",
    "Total Traveling Expenditure For Whole Hospital Stay": "1000-1500",
    "Family Monthly Income Before Accident": "15000-30000",
    "Family Monthly Income After Accident": "25000-30000",
    "Family Current Status": "Mildly Affected",
    "Hospital Distance From Home": "Less than 5 Km",
    "Any Insurance Claim Type": "Not Necessary",
    "Any Other Hospital Admission Expenditure": "No Other Expenses",
    "Ethnicity": "Tamil",
    "Age": "60-69",
    "Gender": "Male",
    "Life Style": "Living with children",
    "Educational Qualification": "O/L or A/L",
    "Occupation": "Retired pensioners",
    "Employment Type Name": "Permanent - Government",
    "Dress Name": "Sarong",
    "Mode Of Travel During Accident": "Motor Cyclist",
    "Collision With ": "Animal",
    "Vehicle Insured": "Yes",
    "Vehicle Insurance Type": "3rdParty",
    "Category of Road": "SideRoad",
    "Incident At Time and Date": "2020-10-08 00:00:00",
    "Collision Force From": "Front",
    "Visiblity": "Poor",
    "Road Condition": "Poor",
    "Road Type": "Straight",
    "Road Signals Exist": "No",
    "Approximate Speed": "40 - 80 km/h",
    "Alcohol Consumption": "No",
    "Time between Alcohol Consumption and Accident": "Not Necessary",
    "Illicit Drugs": "No",
    "Vehicle Type": "Motor Cyclist",
    "Helmet Worn": "Yes",
    "Engine Capacity": "LessThan50",
    "Passenger Type": "Driver",
    "Mode of Transport to the Hospital": "Ambulance",
    "Time Taken To Reach Hospital": "Less Than 15 Minutes",
    "First Aid Given At Seen": "No",
    "Current Hospital Name": "DGH – Vavuniya",
    "First Hospital Name": "DGH – Vavuniya",
    "Transfer To Next Hospital": "No",
    "Treatment During Tranfer": "Yes",
    "State of Transfer": "Oxygen Used During Transfer",
    "Transport Time To Second Hospital": "Not Necessary",
    "Site of Injury No1": "Knee",
    "Type of injury No 1": "Abration",
    "Side": "Left",
    "Site of injury No 2": "No Secondary Injury Found",
    "Type of Injury No 2": "nan",
    "Side.1": "nan",
    "Other Injury": "Not Necessary",
    "Investigation Done": "Others",
    "Management Done At First Hospital": "Yes",
    "Management Name 1": "Wound Cleaning And Dressing",
    "Management Name 2": "Informed to JMO / Police",
    "Number of Wards Stayed": 2,
    "Reason for stay in first ward": "For observation",
    "Reason for stay in Second ward": "For specialist opinion",
    "Reason for stay in Third ward": "Not Necessary",
    "Total_Days_Stay": 3
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Dropdown options based on your data analysis
  const dropdownOptions = {
    "Time of Collision": ['00:00 - 03:00', '03:00 - 06:00', '06:00 - 09:00', '09:00 - 12:00', '12:00 -15:00', '15:00 - 18:00', '18:00 - 21:00', '21:00 - 00:00', 'Victim Unable to recall the Time or Early Discharge'],
    "Discharge Outcome": ['Partial Recovery', 'Complete Recovery', 'Further Interventions', 'Others'],
    "Facilities for Daily Activity": ['Both Toilet and Bathing Facilities Available'],
    "Access To Wash Room": ['No', 'Yes', 'Victim not willing to share/ Unable to respond/ Early Discharge'],
    "Type of Toilet Modification": ['No Modification done', 'Permanent Commode Build', 'Victim not willing to share/ Unable to respond/ Early Discharge', 'Commode Chair Bought'],
    "Bystander Expenditure per day": ['Not Necessary', 'More than 1000', '500-1000', '0-500'],
    "Traveling Expenditure per day": ['200-300', '400-500', '100-200', '0-100', 'Victim not willing to share/ Unable to respond/ Early Discharge', '300-400', 'More than 500'],
    "Total Traveling Expenditure For Whole Hospital Stay": ['500-1000', 'Victim not willing to share/ Unable to respond/ Early Discharge', '1000-1500', '0-500', 'More than 2000', '1500-2000'],
    "Family Monthly Income Before Accident": ['15000-30000', '30000-45000', '45000-60000', 'Victim not willing to share/ Unable to respond/ Early Discharge', 'More than 60000', '0-15000'],
    "Family Monthly Income After Accident": ['25000-30000', '30000-40000', '10000-15000', 'Victim not willing to share/ Unable to respond/ Early Discharge', '20000-25000', '50000-55000', '45000-50000', '40000-45000', '5000-10000', '15000-20000', '55000-60000', '0-5000', '65000-70000', '75000-80000', 'No Income', '60000-65000', '80000-85000', '70000-75000'],
    "Family Current Status": ['Mildly Affected', 'Moderately Affected', 'Not Affected', 'Victim not willing to share/ Unable to respond/ Early Discharge', 'Severely Affected'],
    "Hospital Distance From Home": ['Less than 5 Km', '100-150 Km', '25-30 Km', '10-15 Km', '15-20 Km', "Victim doesn't have knowledge on distance/ Not willing to share/ Unable to respond/ Early Discharge", '5-10 Km', '20-25 Km', '50-100 Km', '30-50 Km', '25-30 km', '150-200 Km'],
    "Any Insurance Claim Type": ['Not Necessary', 'Partial Claim', 'Full Claim'],
    "Any Other Hospital Admission Expenditure": ['No Other Expenses', 'Broad arm sling', 'Medical Appliances', 'Cervical collar', 'Armsling', 'Thoraco lumbar support', 'Prosthesis', 'Bone cement'],
    "Ethnicity": ['Tamil', 'Sinhalese', 'Moor'],
    "Age": ['60-69', '20-29', '30-39', '70-79', 'Data Missing', '40-49', '80-89', '50-59', '1-9Y', '10-19Y', '90-100'],
    "Gender": ['Male', 'Female'],
    "Life Style": ['Living with children', 'Living with care givers', 'Victim not willing to share/ Unable to respond/ Early Discharge', 'Living alone'],
    "Educational Qualification": ['O/L or A/L', 'Grade 5', 'Victim not willing to share/ Unable to respond/ Early Discharge', 'Under Graduate', 'Post Graduate'],
    "Occupation": ['Retired pensioners', 'Unemployed', 'Semi-Skilled Workers', 'Skilled Workers', 'Victim not willing to share/ Unable to respond/ Early Discharge', 'Student', 'Business', 'Others', 'Professionals', 'Highly Skilled Workers', 'Driver', 'Forces', 'Religious Sevice', 'NGO', 'Road and Field', 'Road and field'],
    "Employment Type Name": ['Permanent - Government', 'Victim not willing to share/ Unable to respond/ Early Discharge', 'Temporary', 'Daily Basis', 'Not Necessary for Student and Unemployed', 'Contract', 'Permanent - Private'],
    "Dress Name": ['Sarong', 'Jeans', 'Shorts', 'Skirt', 'Victim not willing to share/ Unable to respond/ Early Discharge', 'Saree', 'Gown', 'Salwar', 'Others'],
    "Mode Of Travel During Accident": ['Motor Cyclist', 'Motorbike Pillion Rider', 'Bicycle', 'Car or Van Passenger', 'Others', 'Victim not willing to share/ Unable to respond/ Early Discharge', 'Pedestrian', 'Three wheeler', 'Bicycle pillion', 'Three wheeler passenger', 'Car or Van passenger', 'Car or van', 'Car or Van', 'Heavy Vehicle', 'Heavy Vehicle Passenger'],
    "Collision With ": ['Animal', 'Fall From Vehicle', 'Others', 'Motorbike', 'Three Wheeler', 'Car or Van', 'Heavy Vehicle', 'Slipped', 'Victim not willing to share/ Unable to respond/ Early Discharge', 'Fixed Object', 'Pedestrian', 'Bicycle', 'Unknown', 'Fixed object', 'Ambulance', 'Train'],
    "Vehicle Insured": ['Yes', 'No', 'Victim not willing to share/ Unable to respond/ Early Discharge'],
    "Vehicle Insurance Type": ['3rdParty', 'Victim not willing to share/ Unable to respond/ Early Discharge', 'Comprehensive', 'Partial'],
    "Category of Road": ['SideRoad', 'HighWay', 'Victim not willing to share/ Unable to respond/ Early Discharge', 'PathOrField'],
    "Collision Force From": ['Victim not willing to share/ Unable to respond/ Early Discharge', 'Front', 'RightSide', 'Behind', 'LeftSide'],
    "Visiblity": ['Poor', 'Adequate', 'Victim not willing to share/ Unable to respond/ Early Discharge'],
    "Road Condition": ['Poor', 'Good', 'Victim not willing to share/ Unable to respond/ Early Discharge'],
    "Road Type": ['Straight', 'Junction', 'Victim not willing to share/ Unable to respond/ Early Discharge', 'Bend'],
    "Road Signals Exist": ['No', 'Yes', 'Victim not willing to share/ Unable to respond/ Early Discharge'],
    "Approximate Speed": ['40 - 80 km/h', 'Less Than 40 km/h', 'Victim not willing to share/ Unable to respond/ Early Discharge', '80 - 100 km/h', 'More Than 100 km/h'],
    "Alcohol Consumption": ['No', 'Yes', 'Victim not willing to share/ Unable to respond/ Early Discharge'],
    "Time between Alcohol Consumption and Accident": ['Not Necessary', 'Victim not willing to share/ Unable to respond/ Early Discharge'],
    "Illicit Drugs": ['No', 'Victim not willing to share/ Unable to respond/ Early Discharge', 'Yes'],
    "Vehicle Type": ['Motor Cyclist', 'Victim not willing to share/ Unable to respond/ Early Discharge', 'Other Vehicle'],
    "Helmet Worn": ['Yes', 'Not Necessary', 'Victim not willing to share/ Unable to respond/ Early Discharge', 'No'],
    "Engine Capacity": ['Victim not willing to share/ Unable to respond/ Early Discharge', 'LessThan50', '101To200', '50To100', 'Not Necessary', 'MoreThan200'],
    "Passenger Type": ['Victim not willing to share/ Unable to respond/ Early Discharge', 'RearSeatPassenger', 'Driver', 'FrontSeatPassenger', 'PassengerFallingOfVehicle', 'PassengerEnteringOrLeavingBus'],
    "Mode of Transport to the Hospital": ['Ambulance', 'Other Vehicle', 'Three wheeler', 'Motor Bike', 'Victim not willing to share/ Unable to respond/ Early Discharge', 'Unknown'],
    "Time Taken To Reach Hospital": ['Less Than 15 Minutes', '15 Minutes - 30 Minutes', '30 Minutes - 1 Hour', 'More Than 2 Hour', 'Victim not aware about the time/ not willing to share/ Unable to respond/ Early Discharge', '1 Hour - 2 Hour'],
    "First Aid Given At Seen": ['No'],
    "Current Hospital Name": ['DGH – Vavuniya', 'Teaching hospital - Jaffna (THJ)', 'Base Hospital (A) -Tellipalai', 'DGH – Kilinochchi', 'Base Hospital (B) - Chavakachcheri', 'Base Hospital (A) - Point Pedro', 'DGH – Mannar', 'DGH – Mullaithivu'],
    "First Hospital Name": ['DGH – Vavuniya', 'DGH – Mullaithivu', 'Teaching hospital - Jaffna (THJ)', 'Base Hospital (A) -Tellipalai', 'Base Hospital (B) - Chavakachcheri', 'DGH – Kilinochchi', 'Base Hospital (A) - Point Pedro'],
    "Transfer To Next Hospital": ['No', 'Yes'],
    "Treatment During Tranfer": ['No', 'Yes'],
    "State of Transfer": ['Tranfer without any Support', 'Sinal Board and Cervical Collar used during transfer', 'Cervical collar used during transfer', 'Spinal board used during transfer', 'SB,CC, Oxygen Support used during transfer', 'Oxygen Used During Transfer'],
    "Transport Time To Second Hospital": ['Not Necessary', 'More than 180', '15-30', 'Victim not aware about the time/ not willing to share/ Unable to respond/ Early Discharge', '30-60', '60-120', '0-15', '120-180'],
    "Site of Injury No1": ['Knee', 'Shoulder Clavicle', 'Thigh Femur', 'Elbow Region', 'Missing Data', 'Forearm', 'Knee patella', 'Leg tibia', 'Forearm (Radius, Ulna)', 'Leg', 'Hand Phalanges', 'Head injury', 'Hand', 'Humerus Region', 'Foot', 'Thigh', 'Forehead', 'Abdomen', 'Forearm ulna', 'Facial Injury', 'Lumbar', 'Chest Injury', 'No Injury Found', 'Forearm Ulna', 'Pelvis', 'Shoulder Injury', 'Thigh NOF', 'Cervical', 'Forearm Radius', 'Foot Phalanges', 'Knee Patella', 'Leg Fibula', 'Hand Metacarpals', 'Eye Injury', 'Foot Metacarpals', 'Leg Tibia', 'Foot Metatarsals', 'Chest rib', 'Hand phalanges', 'Foot tarsals', 'Leg (Tibia, fibula)', 'Leg (tibia, fibula)', 'Leg (Tibia, Fibula)', 'Leg fibula', 'Thoracic', 'Femur', 'Foot phalanges', 'Foot Tarsals', 'Sacrum', 'Pelvis ilium', 'Humerus head', 'Thigh femur', 'Clavicle', 'Pelvis ramous', 'Forearm (radius, Ulna)', 'Forearm radius'],
    "Type of injury No 1": ['Abration', 'Fracture', 'Laceration', 'Amputation', 'Ligament Injury', 'Contusion', 'Spinal Cord Injury', 'Nerve Lesion', 'Dislocation', 'amputation', 'Nerve lesion', 'Kidney Injury', 'contusion', 'SDH', 'Pericardial Effusion', 'ICH', 'Ligament injury', 'fracture', 'Pneumothorax', 'Bowel Injury', 'ligament Injury', 'Spleen Injury', 'spinal Cord Injury', 'Lung injury'],
    "Side": ['Left', 'Right', 'left', 'right', 'Head injury'],
    "Site of injury No 2": ['No Secondary Injury Found', 'Leg', 'Foot', 'Knee', 'Humerus Region', 'Forearm (Radius, Ulna)', 'Thigh femur', 'Forearm Radius', 'Not Necessary', 'Shoulder Injury', 'Forearm', 'Leg tibia', 'Cervical', 'Knee Patella', 'Elbow Region', 'Humerus head', 'Facial Injury', 'Leg fibula', 'Foot phalanges', 'Knee patella', 'Eye Injury', 'Chest rib', 'Head injury', 'Shoulder Clavicle', 'Foot Phalanges', 'Hand', 'Thigh', 'Leg Fibula', 'Foot Metatarsals', 'Chest Injury', 'Humerus Head', 'Shoulder clavicle', 'Hand metacarpals', 'Hand Phalanges', 'Abdomen', 'Forearm radius', 'RightLeg', 'Thoracic', 'Hand Metacarpals', 'Shoulder', 'Pelvis', 'Chest Rib', 'Forearm Ulna', 'Sacrum', 'Forearm ulna', 'Foot Tarsals', 'Forearm Radius', 'Forehead', 'Pelvis ramous', 'Thigh Femur', 'RightShoulder', 'Lumbar', 'Foot tarsals', 'Pelvis ilium', 'Leg (Tibia, Fibula)', 'Leg (tibia, fibula)', 'Leg Tibia', 'Hand phalanges', 'Thigh NOF', 'Hand carpals'],
    "Type of Injury No 2": ['Abration', 'Fracture', 'ligament Injury', 'Ligament Injury', 'Nerve Lesion', 'Dislocation', 'Laceration', 'Contusion', 'Amputation', 'abration', 'fracture', 'Spleen Injury', 'Pneumothorax', 'Kidney Injury', 'Bowel Injury', 'Nerve lesion'],
    "Side.1": ['Left', 'Right', 'left', 'right'],
    "Other Injury": ['Not Necessary', 'No Other Injury', 'Multiple'],
    "Investigation Done": ['Others', 'X-ray', 'CT scan', 'MRI scan', 'Ultrasound scan'],
    "Management Done At First Hospital": ['Yes', 'No'],
    "Management Name 1": ['Wound Cleaning And Dressing', 'Early Discharge/ Data Entry Staff Missed to Enter', 'Fracture Stabilization', 'Only Medicine And Discharge', 'Informed to JMO / Police', 'Surgery', 'Wound Debridement', 'Wound Suturing', 'Duration Of Hospital Stay', 'Reduction done for left elbow joint dislocation', 'Others', 'Ligamental injury management', 'Observation for head injury'],
    "Management Name 2": ['Informed to JMO / Police', 'Wound Suturing', 'No Other Management', 'Wound Cleaning And Dressing', 'Others', 'Wound Debridement', 'Only Medicine And Discharge', 'Duration Of Hospital Stay', 'Pain management', 'Surgery', 'Imaging', 'Fracture Stabilization', 'X Ray (right hand)', 'Strict bed rest', 'POP applied'],
    "Number of Wards Stayed": [1, 2, 3],
    "Reason for stay in first ward": ['For observation', 'For specialist opinion', 'For fracture management', 'For wound management', 'For surgery', 'Observation', 'Medical management'],
    "Reason for stay in Second ward": ['For specialist opinion', 'For fracture management', 'For wound management', 'For surgery', 'Specialist management', 'Observation'],
    "Reason for stay in Third ward": ['Not Necessary', 'Wound mangement and observation', 'Specialist opinion and management', 'Fracture stabilisation and observation', 'Fracture stabilization']
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPrediction(null);

   try {
    const response = await API.post(
      `/hospitalstay/predict`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // axios already parses JSON for you
    const result = response.data;
    setPrediction(result.predictions[0].predict);
    } catch (err) {
      setError("Failed to get prediction: " + err.message);
      console.error("Prediction error:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderField = (fieldName, type = 'select') => {
    if (type === 'number') {
      return (
        <div key={fieldName} className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            {fieldName}
          </label>
          <input
            type="number"
            value={formData[fieldName]}
            onChange={(e) => handleInputChange(fieldName, parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
          />
        </div>
      );
    }

    return (
      <div key={fieldName} className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          {fieldName}
        </label>
        <select
          value={formData[fieldName]}
          onChange={(e) => handleInputChange(fieldName, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {dropdownOptions[fieldName]?.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    );
  };

  // Group fields by category for better organization
  const fieldGroups = {
    "Personal Information": [
      "Age", "Gender", "Ethnicity", "Life Style", "Educational Qualification", 
      "Occupation", "Employment Type Name", "Dress Name"
    ],
    "Accident Details": [
      "Time of Collision", "Mode Of Travel During Accident", "Collision With ",
      "Vehicle Insured", "Vehicle Insurance Type", "Category of Road",
      "Incident At Time and Date", "Collision Force From", "Visiblity",
      "Road Condition", "Road Type", "Road Signals Exist", "Approximate Speed",
      "Alcohol Consumption", "Time between Alcohol Consumption and Accident",
      "Illicit Drugs", "Vehicle Type", "Helmet Worn", "Engine Capacity", "Passenger Type"
    ],
    "Hospital & Medical": [
      "Mode of Transport to the Hospital", "Time Taken To Reach Hospital",
      "First Aid Given At Seen", "Current Hospital Name", "First Hospital Name",
      "Transfer To Next Hospital", "Treatment During Tranfer", "State of Transfer",
      "Transport Time To Second Hospital", "Site of Injury No1", "Type of injury No 1",
      "Side", "Site of injury No 2", "Type of Injury No 2", "Side.1", "Other Injury",
      "Investigation Done", "Management Done At First Hospital", "Management Name 1",
      "Management Name 2", "Number of Wards Stayed", "Reason for stay in first ward",
      "Reason for stay in Second ward", "Reason for stay in Third ward"
    ],
    "Financial & Social": [
      "Discharge Outcome", "Facilities for Daily Activity", "Access To Wash Room",
      "Type of Toilet Modification", "Bystander Expenditure per day",
      "Traveling Expenditure per day", "Total Traveling Expenditure For Whole Hospital Stay",
      "Family Monthly Income Before Accident", "Family Monthly Income After Accident",
      "Family Current Status", "Hospital Distance From Home", "Any Insurance Claim Type",
      "Any Other Hospital Admission Expenditure"
    ]
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav setIsAuthenticated={setIsAuthenticated} setRole={setRole} />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-primary mb-4">Hospital Stay Prediction</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Prediction Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Patient Information Form</h2>
            
            <form onSubmit={handleSubmit}>
              {Object.entries(fieldGroups).map(([category, fields]) => (
                <div key={category} className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-blue-600 border-b pb-2">
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {fields.map(field => 
                      field === "Number of Wards Stayed" || field === "Total_Days_Stay" 
                        ? renderField(field, 'number')
                        : renderField(field)
                    )}
                  </div>
                </div>
              ))}

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Predicting...' : 'Predict Hospital Stay'}
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
          </div>

          {/* Prediction Result */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Prediction Result</h2>
            
            {prediction !== null ? (
              <div className="text-center">
                <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                  <h3 className="text-2xl font-bold text-blue-600 mb-2">
                    Predicted Hospital Stay
                  </h3>
                  <div className="text-4xl font-bold text-gray-800">
                    {prediction.toFixed(1)} days
                  </div>
                  <p className="text-gray-600 mt-2">
                    Based on the provided information, the predicted hospital stay duration is approximately {prediction.toFixed(1)} days.
                  </p>
                </div>
                
                <div className="mt-6 text-left">
                  <h4 className="font-semibold text-gray-700 mb-2">Interpretation:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Values are predicted in days</li>
                    <li>Consider this as an estimate for resource planning</li>
                    <li>Actual stay may vary based on patient condition</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>Submit the form to get a prediction</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionAdmin;