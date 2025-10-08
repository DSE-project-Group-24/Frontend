import React, { useState } from 'react';
import { User, Activity, MapPin, DollarSign, Users, Home, Building, Stethoscope, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import DoctorNav from '../../navbars/DoctorNav';
import Footer from '../../components/Footer';
import API from '../../utils/api';

const GetPrediction = ({ setIsAuthenticated, setRole }) => {
  const [formData, setFormData] = useState({
    age: '',
    alcohol: '',
    illicit: '',
    severity: '',
    gender: '',
    distance: '',
    traveling: '',
    bystander: '',
    family: '',
    lifestyle: '',
    other_exp: '',
    ethnicity: '',
    hospital: '',
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formSections = [
    {
      title: "Personal Information",
      icon: <User className="w-6 h-6" />,
      fields: ['age', 'gender', 'ethnicity']
    },
    {
      title: "Medical History",
      icon: <Activity className="w-6 h-6" />,
      fields: ['alcohol', 'illicit', 'severity']
    },
    {
      title: "Location & Distance",
      icon: <MapPin className="w-6 h-6" />,
      fields: ['distance', 'hospital']
    },
    {
      title: "Financial Information",
      icon: <DollarSign className="w-6 h-6" />,
      fields: ['traveling', 'bystander', 'other_exp']
    },
    {
      title: "Social Factors",
      icon: <Home className="w-6 h-6" />,
      fields: ['lifestyle', 'family']
    }
  ];

  const fieldConfig = {
    age: {
      label: "Person Age (as of 2023-01-01)",
      type: "number",
      icon: <User className="w-5 h-5" />
    },
    alcohol: {
      label: "Alcohol Consumption",
      type: "select",
      icon: <Activity className="w-5 h-5" />,
      options: [
        { value: "", label: "Select an option" },
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
        { value: "Victim not willing to share/ Unable to respond/  Early Discharge", label: "Unable to respond/Early Discharge" }
      ]
    },
    illicit: {
      label: "Illicit Drugs",
      type: "select",
      icon: <Activity className="w-5 h-5" />,
      options: [
        { value: "", label: "Select an option" },
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
        { value: "Victim not willing to share/ Unable to respond/  Early Discharge", label: "Unable to respond/Early Discharge" }
      ]
    },
    severity: {
      label: "Severity Level",
      type: "select",
      icon: <AlertCircle className="w-5 h-5" />,
      options: [
        { value: "", label: "Select severity" },
        { value: "Unknown", label: "Unknown" },
        { value: "Medium", label: "Medium" },
        { value: "Serious", label: "Serious" }
      ]
    },
    gender: {
      label: "Gender",
      type: "select",
      icon: <User className="w-5 h-5" />,
      options: [
        { value: "", label: "Select gender" },
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" }
      ]
    },
    distance: {
      label: "Hospital Distance From Home",
      type: "select",
      icon: <MapPin className="w-5 h-5" />,
      options: [
        { value: "", label: "Select distance range" },
        { value: "Victim doesn't have knowledge on distance/ Not willing to share/ Unable to respond/  Early Discharge", label: "Unknown/Unable to respond" },
        { value: "Less than 5 Km", label: "Less than 5 Km" },
        { value: "5-10 Km", label: "5-10 Km" },
        { value: "10-15 Km", label: "10-15 Km" },
        { value: "15-20 Km", label: "15-20 Km" },
        { value: "20-25 Km", label: "20-25 Km" },
        { value: "25-30 Km", label: "25-30 Km" },
        { value: "30-50 Km", label: "30-50 Km" },
        { value: "50-100 Km", label: "50-100 Km" },
        { value: "100-150 Km", label: "100-150 Km" },
        { value: "150-200 Km", label: "150-200 Km" }
      ]
    },
    traveling: {
      label: "Traveling Expenditure per day",
      type: "select",
      icon: <DollarSign className="w-5 h-5" />,
      options: [
        { value: "", label: "Select expenditure range" },
        { value: "Victim not willing to share/ Unable to respond/  Early Discharge", label: "Unable to respond/Early Discharge" },
        { value: "0-100", label: "0-100" },
        { value: "100-200", label: "100-200" },
        { value: "200-300", label: "200-300" },
        { value: "300-400", label: "300-400" },
        { value: "400-500", label: "400-500" },
        { value: "More than 500", label: "More than 500" }
      ]
    },
    bystander: {
      label: "Bystander Expenditure per day",
      type: "select",
      icon: <DollarSign className="w-5 h-5" />,
      options: [
        { value: "", label: "Select expenditure range" },
        { value: "Not Necessary", label: "Not Necessary" },
        { value: "0-500", label: "0-500" },
        { value: "500-1000", label: "500-1000" },
        { value: "More than 1000", label: "More than 1000" }
      ]
    },
    family: {
      label: "Family Current Status",
      type: "select",
      icon: <Users className="w-5 h-5" />,
      options: [
        { value: "", label: "Select family status" },
        { value: "Victim not willing to share/ Unable to respond/  Early Discharge", label: "Unable to respond/Early Discharge" },
        { value: "Not Affected", label: "Not Affected" },
        { value: "Mildly Affected", label: "Mildly Affected" },
        { value: "Moderately Affected", label: "Moderately Affected" },
        { value: "Severely Affected", label: "Severely Affected" }
      ]
    },
    lifestyle: {
      label: "Lifestyle",
      type: "select",
      icon: <Home className="w-5 h-5" />,
      options: [
        { value: "", label: "Select living situation" },
        { value: "Living alone", label: "Living alone" },
        { value: "Living with care givers", label: "Living with care givers" },
        { value: "Living with children", label: "Living with children" },
        { value: "Victim not willing to share/ Unable to respond/  Early Discharge", label: "Unable to respond/Early Discharge" }
      ]
    },
    other_exp: {
      label: "Any Other Hospital Admission Expenditure",
      type: "select",
      icon: <DollarSign className="w-5 h-5" />,
      options: [
        { value: "", label: "Select option" },
        { value: "No Other Expenses", label: "No Other Expenses" },
        { value: "Has Other Expenses", label: "Has Other Expenses" }
      ]
    },
    ethnicity: {
      label: "Ethnicity",
      type: "select",
      icon: <User className="w-5 h-5" />,
      options: [
        { value: "", label: "Select ethnicity" },
        { value: "Moor", label: "Moor" },
        { value: "Sinhalese", label: "Sinhalese" },
        { value: "Tamil", label: "Tamil" }
      ]
    },
    hospital: {
      label: "Hospital Name",
      type: "select",
      icon: <Building className="w-5 h-5" />,
      options: [
        { value: "", label: "Select hospital" },
        ...[
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
        ].map(h => ({ value: h, label: h }))
      ]
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const data = {};

    // Age
    data['Person Age (as of 2023-01-01)'] = parseInt(formData.age) || 0;

    // Alcohol
    const alcohol_map = {
      "Yes": 1,
      "No": 0,
      "Victim not willing to share/ Unable to respond/  Early Discharge": -1
    };
    data['Alcohol_Consumption_Encoded'] = alcohol_map[formData.alcohol];

    // Illicit Drugs
    const illicit_map = {
      "Yes": 1,
      "No": 0,
      "Victim not willing to share/ Unable to respond/  Early Discharge": -1
    };
    data['Illicit_Drugs_Encoded'] = illicit_map[formData.illicit];

    // Severity
    const severity_map = {
      "Unknown": -1,
      "Medium": 1,
      "Serious": 2
    };
    data['Severity'] = severity_map[formData.severity];

    // Gender
    const gender_map = {
      "Male": 1,
      "Female": 0
    };
    data['Gender'] = gender_map[formData.gender];

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
    data['Hospital Distance From Home'] = distance_map[formData.distance];

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
    data['Traveling Expenditure per day'] = travel_exp_map[formData.traveling];

    // Bystander Expenditure
    const expenditure_map = {
      'Not Necessary': 0,
      '0-500': 1,
      '500-1000': 2,
      'More than 1000': 4
    };
    data['Bystander Expenditure per day'] = expenditure_map[formData.bystander];

    // Family Current Status
    const ordinal_map = {
      "Victim not willing to share/ Unable to respond/  Early Discharge": -1,
      "Not Affected": 0,
      "Mildly Affected": 1,
      "Moderately Affected": 2,
      "Severely Affected": 3
    };
    data['Family Current Status'] = ordinal_map[formData.family];

    // LifeStyle one-hot
    const lifestyle_columns = [
      "LifeStyle_Living alone",
      "LifeStyle_Living with care givers",
      "LifeStyle_Living with children"
    ];
    lifestyle_columns.forEach(col => data[col] = 0);
    const lifestyle_val = formData.lifestyle;
    const unwilling = "Victim not willing to share/ Unable to respond/  Early Discharge";
    if (lifestyle_val !== unwilling) {
      let col;
      if (lifestyle_val === "Living alone") col = "LifeStyle_Living alone";
      else if (lifestyle_val === "Living with care givers") col = "LifeStyle_Living with care givers";
      else if (lifestyle_val === "Living with children") col = "LifeStyle_Living with children";
      if (col) data[col] = 1;
    }

    // Any Other Expenditure
    data["Any Other Hospital Admission Expenditure"] = formData.other_exp === "No Other Expenses" ? 0 : 1;

    // Ethnicity one-hot
    const ethnicity_columns = [
      "Ethnicity_Moor",
      "Ethnicity_Sinhalese",
      "Ethnicity_Tamil"
    ];
    ethnicity_columns.forEach(col => data[col] = 0);
    const ethnicity_val = formData.ethnicity;
    let eth_col;
    if (ethnicity_val === "Moor") eth_col = "Ethnicity_Moor";
    else if (ethnicity_val === "Sinhalese") eth_col = "Ethnicity_Sinhalese";
    else if (ethnicity_val === "Tamil") eth_col = "Ethnicity_Tamil";
    if (eth_col) data[eth_col] = 1;

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
    if (formData.hospital) {
      data["First Hospital Name_" + formData.hospital] = 1;
    }

    try {
      const response = await API.post('predictions/transferprobability', data);
      const result = response.data;
      if (result.error) {
        setError(result.error);
        setResult(null);
      } else {
        setResult({
          message: result.message || 'No message provided',
          prediction: result.prediction !== undefined ? result.prediction : 'N/A',
          transfer_probability: result.transfer_probability !== undefined
            ? (result.transfer_probability * 100).toFixed(2) + '%'
            : 'N/A'
        });
        setError(null);
      }
    } catch (error) {
      setError('Error: ' + error.message);
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const renderField = (fieldName) => {
    const config = fieldConfig[fieldName];
    const value = formData[fieldName];

    return (
      <div key={fieldName} className="space-y-2">
        <label htmlFor={fieldName} className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          {config.icon}
          {config.label}
        </label>
        {config.type === 'number' ? (
          <input
            type="number"
            id={fieldName}
            name={fieldName}
            value={value}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter age"
          />
        ) : (
          <select
            id={fieldName}
            name={fieldName}
            value={value}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
          >
            {config.options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </div>
    );
  };

  const isFormValid = () => {
    return Object.values(formData).every(value => value !== '');
  };

  const getCompletedFields = () => {
    return Object.values(formData).filter(value => value !== '').length;
  };

  const totalFields = Object.keys(formData).length;
  const completedFields = getCompletedFields();
  const progressPercentage = (completedFields / totalFields) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <DoctorNav setIsAuthenticated={setIsAuthenticated} setRole={setRole} />
      
      <div className="max-w-6xl mx-auto p-6 pt-24">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Stethoscope className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">Medical Transfer Prediction</h1>
          </div>
          <p className="text-gray-600 text-lg">Complete the form to get AI-powered transfer probability analysis</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Form Completion</span>
            <span className="text-sm font-medium text-blue-600">{completedFields}/{totalFields} fields</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Form sections */}
          <div className="grid gap-8">
            {formSections.map((section, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {section.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">{section.title}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {section.fields.map(field => renderField(field))}
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={!isFormValid() || isLoading}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg 
                       hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 
                       flex items-center gap-3 text-lg shadow-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing Prediction...
                </>
              ) : (
                <>
                  <Activity className="w-5 h-5" />
                  Get Prediction Analysis
                </>
              )}
            </button>
          </div>
        </form>

        {/* Results */}
        {result && (
          <div className="mt-8 bg-white rounded-xl shadow-lg border-l-4 border-green-500 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <h3 className="text-2xl font-bold text-gray-800">Prediction Results</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-blue-800 font-semibold mb-1">Analysis Message</div>
                  <div className="text-blue-900">{result.message}</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-purple-800 font-semibold mb-1">Prediction Outcome</div>
                  <div className="text-purple-900 font-bold text-xl">{result.prediction}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-green-800 font-semibold mb-1">Transfer Probability</div>
                  <div className="text-green-900 font-bold text-2xl">{result.transfer_probability}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-8 bg-white rounded-xl shadow-lg border-l-4 border-red-500 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="w-6 h-6 text-red-500" />
                <h3 className="text-xl font-bold text-red-800">Error Occurred</h3>
              </div>
              <p className="text-red-700 bg-red-50 p-3 rounded">{error}</p>
            </div>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default GetPrediction;