import React, { useState } from 'react';
import { User, Activity, MapPin, DollarSign, Users, Home, Building, Stethoscope, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import DoctorNav from '../../navbars/DoctorNav';
import Footer from '../../components/Footer';
import API from '../../utils/api';
import { t } from '../../utils/translations';

const GetPredictions = ({ setIsAuthenticated, setRole }) => {
  const [activeTab, setActiveTab] = useState('transfer'); // 'transfer' | 'discharge'

  // ---------- Transfer prediction state (from existing GetPrediction.jsx) ----------
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
  const [transferResult, setTransferResult] = useState(null);
  const [transferError, setTransferError] = useState(null);
  const [isTransferLoading, setIsTransferLoading] = useState(false);

  
  const [dischargeForm, setDischargeForm] = useState({
    current_hospital_name: '',
    family_current_status: '',
    type_of_injury_no_1: '',
    traveling_expenditure_per_day: '',
    first_hospital_name: '',
    date_of_birth: '',
    site_of_injury_no1: '',
    approximate_speed: '',
    incident_at_time_and_date: '',
    hospital_distance_from_home: '',
    mode_of_transport_to_the_hospital: '',
    educational_qualification: '',
    time_taken_to_reach_hospital: '',
    any_other_hospital_admission_expenditure: '',
    site_of_injury_no_2: '',
    occupation: '',
    family_monthly_income_before_accident: '',
    collision_with: '',
    life_style: '',
    collision_force_from: '',
    road_type: '',
    type_of_injury_no_2: ''
  });
  const [dischargeResult, setDischargeResult] = useState(null);
  const [dischargeError, setDischargeError] = useState(null);
  const [isDischargeLoading, setIsDischargeLoading] = useState(false);

  // Field/config helpers taken from GetPrediction.jsx
  const formSections = [
    {
      title: t("personalInformation"),
      icon: <User className="w-6 h-6" />,
      fields: ['age', 'gender', 'ethnicity']
    },
    {
      title: t("medicalHistory"),
      icon: <Activity className="w-6 h-6" />,
      fields: ['alcohol', 'illicit', 'severity']
    },
    {
      title: t("locationDistance"),
      icon: <MapPin className="w-6 h-6" />,
      fields: ['distance', 'hospital']
    },
    {
      title: t("financialInformation"),
      icon: <DollarSign className="w-6 h-6" />,
      fields: ['traveling', 'bystander', 'other_exp']
    },
    {
      title: t("socialFactors"),
      icon: <Home className="w-6 h-6" />,
      fields: ['lifestyle', 'family']
    }
  ];

  const fieldConfig = {
    age: { label: t("personAge"), type: "number", icon: <User className="w-5 h-5" /> },
    alcohol: { label: t("alcoholConsumption"), type: "select", icon: <Activity className="w-5 h-5" />, options: [
      { value: "", label: t("selectAnOption") }, { value: "Yes", label: t("yes") }, { value: "No", label: t("no") }, { value: "Victim not willing to share/ Unable to respond/  Early Discharge", label: t("unableToRespondEarlyDischarge") }
    ]},
    illicit: { label: t("illicitDrugs"), type: "select", icon: <Activity className="w-5 h-5" />, options: [
      { value: "", label: t("selectAnOption") }, { value: "Yes", label: t("yes") }, { value: "No", label: t("no") }, { value: "Victim not willing to share/ Unable to respond/  Early Discharge", label: t("unableToRespondEarlyDischarge") }
    ]},
    severity: { label: t("severityLevel"), type: "select", icon: <AlertCircle className="w-5 h-5" />, options: [
      { value: "", label: t("selectSeverity") }, { value: "Unknown", label: t("unknown") }, { value: "Medium", label: t("medium") }, { value: "Serious", label: t("serious") }
    ]},
    gender: { label: t("gender"), type: "select", icon: <User className="w-5 h-5" />, options: [
      { value: "", label: t("selectGender") }, { value: "Male", label: t("male") }, { value: "Female", label: t("female") }
    ]},
    distance: { label: t("hospitalDistanceFromHome"), type: "select", icon: <MapPin className="w-5 h-5" />, options: [
      { value: "", label: t("selectDistanceRange") }, { value: "Victim doesn't have knowledge on distance/ Not willing to share/ Unable to respond/  Early Discharge", label: t("unknownUnableToRespond") },
      { value: "Less than 5 Km", label: t("lessThan5Km") }, { value: "5-10 Km", label: t("km5to10") }, { value: "10-15 Km", label: t("km10to15") }, { value: "15-20 Km", label: t("km15to20") },
      { value: "20-25 Km", label: t("km20to25") }, { value: "25-30 Km", label: t("km25to30") }, { value: "30-50 Km", label: t("km30to50") }, { value: "50-100 Km", label: t("km50to100") },
      { value: "100-150 Km", label: t("km100to150") }, { value: "150-200 Km", label: t("km150to200") }
    ]},
    traveling: { label: t("travelingExpenditurePerDay"), type: "select", icon: <DollarSign className="w-5 h-5" />, options: [
      { value: "", label: t("selectExpenditureRange") }, { value: "Victim not willing to share/ Unable to respond/  Early Discharge", label: t("unableToRespondEarlyDischarge") },
      { value: "0-100", label: t("expenditure0to100") }, { value: "100-200", label: t("expenditure100to200") }, { value: "200-300", label: t("expenditure200to300") },
      { value: "300-400", label: t("expenditure300to400") }, { value: "400-500", label: t("expenditure400to500") }, { value: "More than 500", label: t("moreThan500") }
    ]},
    bystander: { label: t("bystanderExpenditurePerDay"), type: "select", icon: <DollarSign className="w-5 h-5" />, options: [
      { value: "", label: t("selectExpenditureRange") }, { value: "Not Necessary", label: t("notNecessary") }, { value: "0-500", label: t("expenditure0to500") }, { value: "500-1000", label: t("expenditure500to1000") }, { value: "More than 1000", label: t("moreThan1000") }
    ]},
    family: { label: t("familyCurrentStatus"), type: "select", icon: <Users className="w-5 h-5" />, options: [
      { value: "", label: t("selectFamilyStatus") }, { value: "Victim not willing to share/ Unable to respond/  Early Discharge", label: t("unableToRespondEarlyDischarge") }, { value: "Not Affected", label: t("notAffected") }, { value: "Mildly Affected", label: t("mildlyAffected") }, { value: "Moderately Affected", label: t("moderatelyAffected") }, { value: "Severely Affected", label: t("severelyAffected") }
    ]},
    lifestyle: { label: t("lifeStyle"), type: "select", icon: <Home className="w-5 h-5" />, options: [
      { value: "", label: t("selectLivingSituation") }, { value: "Living alone", label: t("livingAlone") }, { value: "Living with care givers", label: t("livingWithCaregivers") }, { value: "Living with children", label: t("livingWithChildren") }, { value: "Victim not willing to share/ Unable to respond/  Early Discharge", label: t("unableToRespondEarlyDischarge") }
    ]},
    other_exp: { label: t("anyOtherHospitalAdmissionExpenditure"), type: "select", icon: <DollarSign className="w-5 h-5" />, options: [
      { value: "", label: t("selectOption") }, { value: "No Other Expenses", label: t("noOtherExpenses") }, { value: "Has Other Expenses", label: t("hasOtherExpenses") }
    ]},
    ethnicity: { label: t("ethnicity"), type: "select", icon: <User className="w-5 h-5" />, options: [
      { value: "", label: t("selectEthnicity") }, { value: "Moor", label: t("moor") }, { value: "Sinhalese", label: t("sinhalese") }, { value: "Tamil", label: t("tamil") }
    ]},
    hospital: { label: t("hospital"), type: "select", icon: <Building className="w-5 h-5" />, options: [
      { value: "", label: t("selectHospital") },
      ...["DGH – Kilinochchi", "DGH – Mannar", "Teaching hospital - Jaffna (THJ)"].map(h => ({ value: h, label: h }))
    ]}
  };

  // ---------- Handlers ----------
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleDischargeChange = (e) => setDischargeForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // Transfer submit logic (kept from GetPrediction.jsx)
  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    setIsTransferLoading(true);
    setTransferError(null);
    setTransferResult(null);

    const data = {};
    data['Person Age (as of 2023-01-01)'] = parseInt(formData.age) || 0;
    const alcohol_map = { "Yes": 1, "No": 0, "Victim not willing to share/ Unable to respond/  Early Discharge": -1 };
    data['Alcohol_Consumption_Encoded'] = alcohol_map[formData.alcohol];
    const illicit_map = { "Yes": 1, "No": 0, "Victim not willing to share/ Unable to respond/  Early Discharge": -1 };
    data['Illicit_Drugs_Encoded'] = illicit_map[formData.illicit];
    const severity_map = { "Unknown": -1, "Medium": 1, "Serious": 2 };
    data['Severity'] = severity_map[formData.severity];
    const gender_map = { "Male": 1, "Female": 0 };
    data['Gender'] = gender_map[formData.gender];
    const distance_map = { "Victim doesn't have knowledge on distance/ Not willing to share/ Unable to respond/  Early Discharge": NaN, "Less than 5 Km": 2.5, "5-10 Km": 7.5, "10-15 Km": 12.5, "15-20 Km": 17.5, "20-25 Km": 22.5, "25-30 Km": 27.5, "25-30 km": 27.5, "30-50 Km": 40, "50-100 Km": 75, "100-150 Km": 125, "150-200 Km": 175 };
    data['Hospital Distance From Home'] = distance_map[formData.distance];
    const travel_exp_map = { 'Victim not willing to share/ Unable to respond/  Early Discharge': -1, '0-100': 1, '100-200': 2, '200-300': 3, '300-400': 4, '400-500': 5, 'More than 500': 7 };
    data['Traveling Expenditure per day'] = travel_exp_map[formData.traveling];
    const expenditure_map = { 'Not Necessary': 0, '0-500': 1, '500-1000': 2, 'More than 1000': 4 };
    data['Bystander Expenditure per day'] = expenditure_map[formData.bystander];
    const ordinal_map = { "Victim not willing to share/ Unable to respond/  Early Discharge": -1, "Not Affected": 0, "Mildly Affected": 1, "Moderately Affected": 2, "Severely Affected": 3 };
    data['Family Current Status'] = ordinal_map[formData.family];
    const lifestyle_columns = ["LifeStyle_Living alone","LifeStyle_Living with care givers","LifeStyle_Living with children"];
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
    data["Any Other Hospital Admission Expenditure"] = formData.other_exp === "No Other Expenses" ? 0 : 1;
    const ethnicity_columns = ["Ethnicity_Moor","Ethnicity_Sinhalese","Ethnicity_Tamil"]; ethnicity_columns.forEach(col => data[col] = 0);
    const ethnicity_val = formData.ethnicity; let eth_col; if (ethnicity_val === "Moor") eth_col = "Ethnicity_Moor"; else if (ethnicity_val === "Sinhalese") eth_col = "Ethnicity_Sinhalese"; else if (ethnicity_val === "Tamil") eth_col = "Ethnicity_Tamil"; if (eth_col) data[eth_col] = 1;
    // simple hospital one-hot minimal mapping
    if (formData.hospital) data[`First Hospital Name_${formData.hospital}`] = 1;

    try {
      const response = await API.post('predictions/transferprobability', data);
      const result = response.data;
      if (result.error) {
        setTransferError(result.error);
        setTransferResult(null);
      } else {
        setTransferResult({
          message: result.message || 'No message provided',
          prediction: result.prediction !== undefined ? result.prediction : 'N/A',
          transfer_probability: result.transfer_probability !== undefined ? (result.transfer_probability * 100).toFixed(2) + '%' : 'N/A'
        });
        setTransferError(null);
      }
    } catch (error) {
      setTransferError('Error: ' + (error.message || 'Request failed'));
      setTransferResult(null);
    } finally {
      setIsTransferLoading(false);
    }
  };

  // Discharge submit logic (kept and adapted from GetDischargePrediction.jsx)
  const handleDischargeSubmit = async (e) => {
    e.preventDefault();
    setIsDischargeLoading(true);
    setDischargeError(null);
    setDischargeResult(null);

    try {
      const payload = { ...dischargeForm };
      const res = await API.post('predictions/discharge-outcome', payload);
      setDischargeResult(res.data);
    } catch (err) {
      console.error('Discharge prediction error:', err);
      const respData = err?.response?.data;
      if (Array.isArray(respData)) {
        const messages = respData.map(e => {
          try { const loc = Array.isArray(e.loc) ? e.loc.join(' > ') : e.loc; return `${loc}: ${e.msg}`; } catch (_) { return JSON.stringify(e); }
        });
        setDischargeError(messages);
      } else if (respData && typeof respData === 'object') {
        if (Array.isArray(respData.detail)) {
          const messages = respData.detail.map(e => { const loc = Array.isArray(e.loc) ? e.loc.join(' > ') : e.loc; return `${loc}: ${e.msg}`; });
          setDischargeError(messages);
        } else setDischargeError(JSON.stringify(respData, null, 2));
      } else setDischargeError(err.message || 'Request failed');
    } finally {
      setIsDischargeLoading(false);
    }
  };

  const renderField = (fieldName) => {
    const config = fieldConfig[fieldName];
    const value = formData[fieldName];

    return (
      <div key={fieldName} className="space-y-2">
        <label htmlFor={fieldName} className="flex items-center gap-2 text-sm font-semibold text-gray-700">{config.icon}{config.label}</label>
        {config.type === 'number' ? (
          <input type="number" id={fieldName} name={fieldName} value={value} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" placeholder={t("enterAge")} />
        ) : (
          <select id={fieldName} name={fieldName} value={value} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white">
            {config.options.map((option, index) => (<option key={index} value={option.value}>{option.label}</option>))}
          </select>
        )}
      </div>
    );
  };

  // Helpers for form validation/progress (transfer form)
  const isTransferFormValid = () => Object.values(formData).every(value => value !== '');
  const completedFields = Object.values(formData).filter(v => v !== '').length;
  const totalFields = Object.keys(formData).length;
  const progressPercentage = (completedFields / totalFields) * 100;

  // Discharge form field options based on actual model data
  const getDischargeFieldOptions = (fieldName) => {
    const options = {
      current_hospital_name: [
        'DGH – Kilinochchi', 'DGH – Vavuniya', 'Base Hospital (A) -Tellipalai',
        'Teaching hospital - Jaffna (THJ)', 'DGH – Mullaithivu',
        'Base Hospital (B) - Chavakachcheri', 'DGH – Mannar',
        'Base Hospital (A) - Point Pedro'
      ],
      family_current_status: [
        'Not Affected', 'Mildly Affected', 'Moderately Affected', 'Severely Affected'
      ],
      type_of_injury_no_1: [
        'nerve_lesion', 'contusion', 'fracture', 'laceration', 'dislocation',
        'abrasion', 'ligament_injury', 'pericardial_effusion', 'amputation',
        'spinal_injury', 'ich', 'sdh', 'kidney_injury', 'spleen_injury',
        'pneumothorax', 'bowel_injury', 'lung_injury'
      ],
      traveling_expenditure_per_day: [
        '0-100', '100-200', '200-300', '300-400', '400-500', 'More than 500'
      ],
      first_hospital_name: [
        'DGH – Kilinochchi', 'DGH – Vavuniya', 'Base Hospital (A) -Tellipalai',
        'Teaching hospital - Jaffna (THJ)', 'DH,Atchuveli', 'DH,Velanai',
        'DGH – Mullaithivu', 'Base Hospital (B) - Puthukudiyiruppu',
        'Base Hospital (B) - Chavakachcheri', 'DH,Poonakary', 'DH, Poovarasankulam',
        'DH,Nedunkerny', 'Base Hospital (A) - Point Pedro', 'DH,Vaddakachchi',
        'DH,Tharmapuram', 'DH,Akkarayankulam', 'DH, Puliyankulam', 'DH,Kopay',
        'DH, Sithamparapuram', 'Base Hospital (B) - Mallavi', 'DH,Palai',
        'DH,Alavedddy', 'Base Hospital (B) - Mulankavil', 'DGH – Mannar',
        'DH,Chankanai', 'Base Hospital (A) - Mankulam', 'DH,Adampan',
        'DH,Sampathnuwara', 'DH,Oddusuddan', 'BH,Mallavi(TypeB)',
        'Base Hospital (B) - Cheddikulam', 'DH,Erukalampitti', 'DH,Pungudutivu',
        'Base Hospital (B) - Kayts', 'DH,Pesalai', 'DH,Vidathaltivu', 'DH,Kokulai',
        'Base Hospital (B) - Murunkan', 'DH,Uruthirapuram', 'DH,Alampil',
        'BH,Mankulam(TypeA)', 'DH,Nanattan', 'DH,Vankalai', 'DH,Valvettithurai',
        'BH,Chavakachcheri(TypeB)', 'DH,Veravil', 'DH,Karainagar',
        'BH,Puthukudijiruppu(TypeB)', 'DGH,Kilinochchi', 'BH,Murungan (TypeB)'
      ],
      site_of_injury_no1: [
        'nee', 'ead_injury', 'houlder__lavicle', 'lbow__egion', 'oot',
        'houlder__njury', 'umerus__egion', 'orearm', 'head_face', 'and', 'leg_tibia',
        'issing__ata', 'hest__njury', 'acial__njury', 'eg', 'orearm___adius___lna',
        'eg__ibia', 'orearm__lna', 'orearm__adius', 'oot_tarsals', 'ye__njury',
        'hest_rib', 'high__emur', 'o__njury__ound', 'high', 'ervical', 'horacic',
        'orearm_ulna', 'acrum', 'nee_patella', 'hand', 'umbar', 'and_phalanges',
        'eg___ibia___ibula', 'and__halanges', 'bdomen', 'nee__atella',
        'oot__halanges', 'elvis', 'leg_fibula', 'lavicle', 'emur', 'oot__etatarsals',
        'eg__ibula', 'oot_phalanges', 'orearm__radius___lna', 'leg_tibia_fibula',
        'oot__arsals', 'elvis_ilium', 'thigh'
      ],
      approximate_speed: [
        'Less Than 40 km/h', '40 - 80 km/h', '80 - 100 km/h', 'More Than 100 km/h'
      ],
      hospital_distance_from_home: [
        "Victim doesn't have knowledge on distance/ Not willing to share/ Unable to respond/  Early Discharge",
        'Less than 5 Km', '5-10 Km', '10-15 Km', '15-20 Km', '20-25 Km',
        '25-30 Km', '25-30 km', '30-50 Km', '50-100 Km', '100-150 Km', '150-200 Km'
      ],
      mode_of_transport_to_the_hospital: [
        'Ambulance', 'Three wheeler', 'Motor Bike', 'Other Vehicle', 'Unknown'
      ],
      educational_qualification: [
        'Grade 5', 'O/L or A/L', 'Under Graduate', 'Post Graduate'
      ],
      time_taken_to_reach_hospital: [
        'Less Than 15 Minutes', '15 Minutes - 30 Minutes', '30 Minutes - 1 Hour',
        '1 Hour - 2 Hour', 'More Than 2 Hour',
        'Victim not aware about the time/ not willing to share/ Unable to respond/  Early Discharge'
      ],
      any_other_hospital_admission_expenditure: [
        'No Other Expenses', 'Broad arm sling', 'Medical Appliances',
        'Thoraco lumbar support', 'Cervical collar', 'Prosthesis', 'Armsling',
        'Bone cement'
      ],
      site_of_injury_no_2: [
        'ot__ecessary', 'o__econdary__njury__ound', 'nee', 'ead_injury', 'umerus__egion', 'high',
        'lbow__egion', 'oot', 'orearm', 'eg', 'hest__ib', 'acial__njury', 'and',
        'ervical', 'horacic', 'nee_patella', 'hest__njury', 'houlder', 'eg___ibia___ibula',
        'houlder__njury', 'umbar', 'bdomen', 'ye__njury', 'ight_houlder', 'orearm_radius',
        'oot__halanges', 'leg_tibia', 'hand', 'hest_rib', 'high__emur', 'orearm__lna',
        'nee__atella', 'eg__ibia', 'shoulder', 'and__halanges', 'leg_fibula',
        'orearm__adius', 'oot__etatarsals', 'ight_eg', 'head_face', 'eg__ibula',
        'oot_tarsals', 'houlder__lavicle', 'oot_phalanges', 'umerus__ead', 'elvis',
        'orearm_ulna', 'thigh', 'elvis_ilium', 'leg_tibia_fibula'
      ],
      occupation: [
        'Student', 'Professionals', 'Skilled Workers', 'Unemployed',
        'Semi-Skilled Workers', 'Business', 'Retired pensioners', 'Driver', 'Forces',
        'Others', 'Highly Skilled Workers', 'NGO', 'Religious Sevice',
        'Road and Field', 'Road and field'
      ],
      family_monthly_income_before_accident: [
        '0-15000', '15000-30000', '30000-45000', '45000-60000', 'More than 60000'
      ],
      collision_with: [
        'Animal', 'Fall From Vehicle', 'Motorbike', 'Unknown', 'Pedestrian',
        'Bicycle', 'Three Wheeler', 'Fixed Object', 'Heavy Vehicle', 'Fixed object',
        'Slipped', 'Car or Van', 'Others', 'Ambulance', 'Train'
      ],
      life_style: [
        'Living alone', 'Living with children', 'Living with care givers'
      ],
      collision_force_from: [
        'Front', 'Behind', 'LeftSide', 'RightSide'
      ],
      road_type: [
        'Straight', 'Junction', 'Bend'
      ],
      type_of_injury_no_2: [
        'abrasion', 'contusion', 'dislocation', 'laceration', 'ligament_injury',
        'fracture', 'pneumothorax', 'nerve_lesion', 'kidney_injury', 'bowel_injury',
        'amputation', 'spleen_injury'
      ]
    };
    
    return options[fieldName] || null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <DoctorNav setIsAuthenticated={setIsAuthenticated} setRole={setRole} />

      <div className="max-w-6xl mx-auto p-6 pt-24">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Stethoscope className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">{t('medicalTransferPrediction')} &amp; {t('dischargeOutcomePredictionTitle')}</h1>
          </div>
          <p className="text-gray-600 text-lg">Use either panel below to generate ML predictions. Both forms are independent and post to their respective endpoints.</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex items-center justify-center gap-3">
          <button onClick={() => setActiveTab('transfer')} className={`px-4 py-2 rounded-lg ${activeTab==='transfer' ? 'bg-white shadow-lg' : 'bg-white/60'}`}>{t('getPredictionAnalysis')}</button>
          <button onClick={() => setActiveTab('discharge')} className={`px-4 py-2 rounded-lg ${activeTab==='discharge' ? 'bg-white shadow-lg' : 'bg-white/60'}`}>{t('dischargeOutcomePrediction')}</button>
        </div>

        {activeTab === 'transfer' && (
          <div>
            {/* Progress Bar */}
            <div className="mb-6 bg-white rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">{t('formCompletion')}</span>
                <span className="text-sm font-medium text-blue-600">{completedFields}/{totalFields} {t('fields')}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progressPercentage}%` }}></div>
              </div>
            </div>

            <form onSubmit={handleTransferSubmit} className="space-y-8">
              <div className="grid gap-8">
                {formSections.map((section, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200">
                      <div className="p-2 bg-blue-100 rounded-lg">{section.icon}</div>
                      <h3 className="text-xl font-semibold text-gray-800">{section.title}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {section.fields.map(field => renderField(field))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center">
                <button type="submit" disabled={!isTransferFormValid() || isTransferLoading} className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 text-lg shadow-lg">
                  {isTransferLoading ? (<><Loader2 className="w-5 h-5 animate-spin" />{t('processingPrediction')}</>) : (<><Activity className="w-5 h-5" />{t('getPredictionAnalysis')}</>)}
                </button>
              </div>
            </form>

            {/* Transfer Results */}
            {transferResult && (
              <div className="mt-8 bg-white rounded-xl shadow-lg border-l-4 border-green-500 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4"><CheckCircle className="w-8 h-8 text-green-500" /><h3 className="text-2xl font-bold text-gray-800">{t('predictionResults')}</h3></div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-4 rounded-lg"><div className="text-blue-800 font-semibold mb-1">{t('analysisMessage')}</div><div className="text-blue-900">{transferResult.message}</div></div>
                    <div className="bg-purple-50 p-4 rounded-lg"><div className="text-purple-800 font-semibold mb-1">{t('predictionOutcome')}</div><div className="text-purple-900 font-bold text-xl">{transferResult.prediction}</div></div>
                    <div className="bg-green-50 p-4 rounded-lg"><div className="text-green-800 font-semibold mb-1">{t('transferProbability')}</div><div className="text-green-900 font-bold text-2xl">{transferResult.transfer_probability}</div></div>
                  </div>
                </div>
              </div>
            )}

            {transferError && (<div className="mt-8 bg-white rounded-xl shadow-lg border-l-4 border-red-500 overflow-hidden"><div className="p-6"><div className="flex items-center gap-3 mb-2"><AlertCircle className="w-6 h-6 text-red-500" /><h3 className="text-xl font-bold text-red-800">{t('errorOccurred')}</h3></div><p className="text-red-700 bg-red-50 p-3 rounded">{transferError}</p></div></div>)}
          </div>
        )}

        {activeTab === 'discharge' && (
          <div>
            <form onSubmit={handleDischargeSubmit} className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(dischargeForm).map(key => {
                  const fieldOptions = getDischargeFieldOptions(key);
                  return (
                    <div key={key} className="space-y-1">
                      <label className="block text-sm font-medium text-slate-700">{key.replace(/_/g, ' ')}</label>
                      {fieldOptions ? (
                        <select name={key} value={dischargeForm[key]} onChange={handleDischargeChange} className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option value="">Select an option</option>
                          {fieldOptions.map((option, idx) => (
                            <option key={idx} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : (
                        <input name={key} value={dischargeForm[key]} onChange={handleDischargeChange} className="w-full p-2 border border-gray-200 rounded-lg" />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center gap-3">
                <button type="submit" disabled={isDischargeLoading} className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-sky-700 hover:to-indigo-700 disabled:opacity-60">
                  {isDischargeLoading ? (<svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"></path></svg>) : null}
                  <span>{isDischargeLoading ? t('processingPrediction') : t('dischargeOutcomePrediction')}</span>
                </button>

                <button type="button" onClick={() => { setDischargeForm({
                  current_hospital_name: '', family_current_status: '', type_of_injury_no_1: '', traveling_expenditure_per_day: '', first_hospital_name: '', date_of_birth: '', site_of_injury_no1: '', approximate_speed: '', incident_at_time_and_date: '', hospital_distance_from_home: '', mode_of_transport_to_the_hospital: '', educational_qualification: '', time_taken_to_reach_hospital: '', any_other_hospital_admission_expenditure: '', site_of_injury_no_2: '', occupation: '', family_monthly_income_before_accident: '', collision_with: '', life_style: '', collision_force_from: '', road_type: '', type_of_injury_no_2: '' }); setDischargeResult(null); setDischargeError(null); }} className="px-4 py-2 border rounded-lg">Reset</button>
              </div>
            </form>

            <div className="mt-6">
              {dischargeError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
                  {Array.isArray(dischargeError) ? (
                    <ul className="list-disc pl-5 space-y-1">{dischargeError.map((msg, idx) => (<li key={idx} className="text-sm">{msg}</li>))}</ul>
                  ) : typeof dischargeError === 'string' ? (
                    <pre className="whitespace-pre-wrap text-sm">{dischargeError}</pre>
                  ) : (
                    <pre className="text-sm">{JSON.stringify(dischargeError, null, 2)}</pre>
                  )}
                </div>
              )}

              {dischargeResult && (
                <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
                  <h2 className="text-xl font-semibold mb-2">{t('dischargeOutcomePredictionTitle')}: <span className="font-bold text-emerald-700">{dischargeResult.prediction}</span></h2>

                  {dischargeResult.prediction_probabilities && (
                    <div className="mt-3">
                      <h3 className="font-medium text-slate-800 mb-2">{t('outcomeProbabilities')}</h3>
                      <div className="space-y-2">{Object.entries(dischargeResult.prediction_probabilities).sort(([,a],[,b]) => b-a).map(([k,v]) => (
                        <div key={k} className="flex items-center justify-between"><div className="text-sm text-slate-700">{k}</div><div className="font-semibold text-green-600">{(v * 100).toFixed(1)}%</div></div>
                      ))}</div>
                    </div>
                  )}

                  {dischargeResult.model_info && (
                    <div className="mt-4"><h3 className="font-medium">Model Info</h3><pre className="bg-slate-50 p-3 rounded mt-2 overflow-auto text-sm">{JSON.stringify(dischargeResult.model_info, null, 2)}</pre></div>
                  )}

                  {/* Preprocessed features intentionally hidden from UI to avoid exposing internal preprocessing details */}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default GetPredictions;
