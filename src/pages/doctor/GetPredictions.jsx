import React, { useState } from 'react';
import { User, Activity, MapPin, DollarSign, Users, Home, Building, Stethoscope, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import DoctorNav from '../../navbars/DoctorNav';
import Footer from '../../components/Footer';
import API from '../../utils/api';
import { t } from '../../utils/translations';

const GetPredictions = ({ setIsAuthenticated, setRole }) => {
  const [activeTab, setActiveTab] = useState('transfer'); // 'transfer' | 'discharge'
  // Add hospital-stay tab
  // 'hospital' will be the new tab key
  // ensure activeTab can accept it

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

  // ---------- Hospital stay prediction state ----------
  const [hospitalForm, setHospitalForm] = useState({
    investigation_done: 'Others',
    type_of_injury_no_1: '',
    side: '',
    site_of_injury_no1: '',
    current_hospital_name: localStorage.getItem('hospital_name') || '',
    engine_capacity: '',
    severity: '',
    collision_force_from: '',
    side_1: '',
    type_of_injury_no_2: '',
    family_current_status: '',
    time_taken_to_reach_hospital: '',
    mode_of_transport_to_the_hospital: '',
    category_of_road: '',
    time_of_collision: ''
  });
  const [hospitalResult, setHospitalResult] = useState(null);
  const [hospitalError, setHospitalError] = useState(null);
  const [isHospitalLoading, setIsHospitalLoading] = useState(false);

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
  const handleHospitalChange = (e) => setHospitalForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // Simple formatter for hospital-stay prediction raw strings
  const formatHospitalStayPrediction = (raw) => {
    if (!raw && raw !== 0) return '';
    if (typeof raw === 'string') {
      const m = raw.match(/['"]([^'\"]+)['"]/);
      if (m && m[1]) return m[1];
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return String(parsed[0]);
      } catch (e) {}
      return raw;
    }
    try {
      if (Array.isArray(raw) && raw.length > 0) return String(raw[0]);
      if (raw && raw[0] && Array.isArray(raw[0])) return String(raw[0][0]);
    } catch (e) {}
    return String(raw);
  };

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

  // Get translated field labels for discharge form
  const getDischargeFieldLabel = (fieldName) => {
    const labelKeys = {
      current_hospital_name: 'currentHospitalName',
      family_current_status: 'familyCurrentStatus',
      type_of_injury_no_1: 'typeOfInjuryNo1',
      traveling_expenditure_per_day: 'travelingExpenditurePerDay',
      first_hospital_name: 'firstHospitalName',
      date_of_birth: 'dateOfBirth',
      site_of_injury_no1: 'siteOfInjuryNo1',
      approximate_speed: 'approximateSpeed',
      incident_at_time_and_date: 'incidentDateTime',
      hospital_distance_from_home: 'hospitalDistanceFromHome',
      mode_of_transport_to_the_hospital: 'modeOfTransportToHospital',
      educational_qualification: 'educationalQualification',
      time_taken_to_reach_hospital: 'timeTakenToReachHospital',
      any_other_hospital_admission_expenditure: 'otherHospitalExpenditure',
      site_of_injury_no_2: 'siteOfInjuryNo2',
      occupation: 'occupation',
      family_monthly_income_before_accident: 'familyMonthlyIncome',
      collision_with: 'collisionWith',
      life_style: 'lifeStyle',
      collision_force_from: 'collisionForceFrom',
      road_type: 'roadType',
      type_of_injury_no_2: 'typeOfInjuryNo2'
    };
    
    return t(labelKeys[fieldName]) || fieldName.replace(/_/g, ' ');
  };

  // Get translated option labels
  const getDischargeOptionLabel = (fieldName, option) => {
    // For common options that are already translated
    const commonTranslations = {
      'Not Affected': t('notAffected'),
      'Mildly Affected': t('mildlyAffected'),
      'Moderately Affected': t('moderatelyAffected'),
      'Severely Affected': t('severelyAffected'),
      'Living alone': t('livingAlone'),
      'Living with children': t('livingWithChildren'),
      'Living with care givers': t('livingWithCaregivers'),
      'Student': t('student'),
      'Unemployed': t('unemployed'),
      'No Other Expenses': t('noOtherExpenses'),
      'Grade 5': t('grade5'),
      'O/L or A/L': t('olOrAl'),
      'Under Graduate': t('underGraduate'),
      'Post Graduate': t('postGraduate'),
      'Less Than 15 Minutes': t('lessThan15Minutes'),
      '15 Minutes - 30 Minutes': t('minutes15To30'),
      '30 Minutes - 1 Hour': t('minutes30To1Hour'),
      '1 Hour - 2 Hour': t('hour1To2'),
      'More Than 2 Hour': t('moreThan2Hours'),
      'Ambulance': t('ambulance'),
      'Three wheeler': t('threeWheeler'),
      'Motor Bike': t('motorBike'),
      'Other Vehicle': t('otherVehicle'),
      'Unknown': t('unknown'),
      'Less Than 40 km/h': t('lessThan40Kmh'),
      '40 - 80 km/h': t('from40To80Kmh'),
      '80 - 100 km/h': t('from80To100Kmh'),
      'More Than 100 km/h': t('moreThan100Kmh'),
      'Straight': t('straight'),
      'Junction': t('junction'),
      'Bend': t('bend'),
      'Front': t('front'),
      'Behind': t('behind'),
      'LeftSide': t('leftSide'),
      'RightSide': t('rightSide')
    };

    return commonTranslations[option] || option;
  };

  // Get translated placeholders for input fields
  const getDischargeFieldPlaceholder = (fieldName) => {
    const placeholders = {
      date_of_birth: t('enterDateOfBirth') || 'YYYY-MM-DD',
      incident_at_time_and_date: t('enterIncidentDateTime') || 'YYYY-MM-DD HH:MM'
    };
    
    return placeholders[fieldName] || '';
  };

  // Get organized sections for discharge form
  const getDischargeSections = () => [
    {
      title: t("hospitalInformation"),
      icon: <Building className="w-6 h-6" />,
      fields: ['current_hospital_name', 'first_hospital_name'],
      fieldIcons: {
        current_hospital_name: <Building className="w-4 h-4" />,
        first_hospital_name: <Building className="w-4 h-4" />
      }
    },
    {
      title: t("personalInformation"),
      icon: <User className="w-6 h-6" />,
      fields: ['date_of_birth', 'occupation', 'educational_qualification', 'life_style'],
      fieldIcons: {
        date_of_birth: <User className="w-4 h-4" />,
        occupation: <User className="w-4 h-4" />,
        educational_qualification: <User className="w-4 h-4" />,
        life_style: <Home className="w-4 h-4" />
      }
    },
    {
      title: t("accidentDetails"),
      icon: <AlertCircle className="w-6 h-6" />,
      fields: ['incident_at_time_and_date', 'approximate_speed', 'collision_with', 'collision_force_from', 'road_type'],
      fieldIcons: {
        incident_at_time_and_date: <AlertCircle className="w-4 h-4" />,
        approximate_speed: <Activity className="w-4 h-4" />,
        collision_with: <AlertCircle className="w-4 h-4" />,
        collision_force_from: <Activity className="w-4 h-4" />,
        road_type: <MapPin className="w-4 h-4" />
      }
    },
    {
      title: t("medicalInformation"),
      icon: <Activity className="w-6 h-6" />,
      fields: ['type_of_injury_no_1', 'site_of_injury_no1', 'type_of_injury_no_2', 'site_of_injury_no_2'],
      fieldIcons: {
        type_of_injury_no_1: <Activity className="w-4 h-4" />,
        site_of_injury_no1: <Activity className="w-4 h-4" />,
        type_of_injury_no_2: <Activity className="w-4 h-4" />,
        site_of_injury_no_2: <Activity className="w-4 h-4" />
      }
    },
    {
      title: t("transportAndTiming"),
      icon: <MapPin className="w-6 h-6" />,
      fields: ['hospital_distance_from_home', 'mode_of_transport_to_the_hospital', 'time_taken_to_reach_hospital'],
      fieldIcons: {
        hospital_distance_from_home: <MapPin className="w-4 h-4" />,
        mode_of_transport_to_the_hospital: <MapPin className="w-4 h-4" />,
        time_taken_to_reach_hospital: <MapPin className="w-4 h-4" />
      }
    },
    {
      title: t("financialInformation"),
      icon: <DollarSign className="w-6 h-6" />,
      fields: ['family_current_status', 'family_monthly_income_before_accident', 'traveling_expenditure_per_day', 'any_other_hospital_admission_expenditure'],
      fieldIcons: {
        family_current_status: <Users className="w-4 h-4" />,
        family_monthly_income_before_accident: <DollarSign className="w-4 h-4" />,
        traveling_expenditure_per_day: <DollarSign className="w-4 h-4" />,
        any_other_hospital_admission_expenditure: <DollarSign className="w-4 h-4" />
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <DoctorNav setIsAuthenticated={setIsAuthenticated} setRole={setRole} />

      <div className="max-w-6xl mx-auto p-6 pt-24">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Stethoscope className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">{t('medicalTransferPrediction')} &amp; {t('dischargeOutcomePredictionTitle')}</h1>
          </div>
          <p className="text-gray-600 text-lg">{t('predictionFormsDescription')}</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex items-center justify-center gap-3">
            <button onClick={() => setActiveTab('transfer')} className={`px-4 py-2 rounded-lg ${activeTab==='transfer' ? 'bg-white shadow-lg' : 'bg-white/60'}`}>{t('transferProbabilityPrediction')}</button>
            <button onClick={() => setActiveTab('discharge')} className={`px-4 py-2 rounded-lg ${activeTab==='discharge' ? 'bg-white shadow-lg' : 'bg-white/60'}`}>{t('dischargeOutcomePrediction')}</button>
            <button onClick={() => setActiveTab('hospital')} className={`px-4 py-2 rounded-lg ${activeTab==='hospital' ? 'bg-white shadow-lg' : 'bg-white/60'}`}>{t('hospitalStayTitle')}</button>
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
            <form onSubmit={handleDischargeSubmit} className="space-y-8">
              {getDischargeSections().map((section, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200">
                    <div className="p-2 bg-blue-100 rounded-lg">{section.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-800">{section.title}</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {section.fields.map(key => {
                      const fieldOptions = getDischargeFieldOptions(key);
                      const fieldLabel = getDischargeFieldLabel(key);
                      return (
                        <div key={key} className="space-y-2">
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                            {section.fieldIcons[key] || <Activity className="w-4 h-4" />}
                            {fieldLabel}
                          </label>
                          {fieldOptions ? (
                            <select name={key} value={dischargeForm[key]} onChange={handleDischargeChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white">
                              <option value="">{t('selectAnOption')}</option>
                              {fieldOptions.map((option, idx) => (
                                <option key={idx} value={option}>{getDischargeOptionLabel(key, option)}</option>
                              ))}
                            </select>
                          ) : (
                            <input 
                              name={key} 
                              value={dischargeForm[key]} 
                              onChange={handleDischargeChange} 
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              placeholder={getDischargeFieldPlaceholder(key)}
                              type={key.includes('date') ? 'date' : 'text'}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="flex justify-center gap-4 mt-8">
                <button type="submit" disabled={isDischargeLoading} className="px-8 py-4 bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-sky-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 text-lg shadow-lg">
                  {isDischargeLoading ? (<><Loader2 className="w-5 h-5 animate-spin" />{t('processingPrediction')}</>) : (<><Activity className="w-5 h-5" />{t('dischargeOutcomePrediction')}</>)}
                </button>

                <button type="button" onClick={() => { setDischargeForm({
                  current_hospital_name: '', family_current_status: '', type_of_injury_no_1: '', traveling_expenditure_per_day: '', first_hospital_name: '', date_of_birth: '', site_of_injury_no1: '', approximate_speed: '', incident_at_time_and_date: '', hospital_distance_from_home: '', mode_of_transport_to_the_hospital: '', educational_qualification: '', time_taken_to_reach_hospital: '', any_other_hospital_admission_expenditure: '', site_of_injury_no_2: '', occupation: '', family_monthly_income_before_accident: '', collision_with: '', life_style: '', collision_force_from: '', road_type: '', type_of_injury_no_2: '' }); setDischargeResult(null); setDischargeError(null); }} className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {t('reset')}
                </button>
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
        {activeTab === 'hospital' && (
          <div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              setIsHospitalLoading(true);
              setHospitalError(null);
              setHospitalResult(null);

              try {
                // Build payload matching expected shape
                const payload = { data: [ {
                  'Investigation Done': hospitalForm.investigation_done || 'Others',
                  'Type of injury No 1': hospitalForm.type_of_injury_no_1 || '',
                  'Side': hospitalForm.side || '',
                  'Site of Injury No1': hospitalForm.site_of_injury_no1 || '',
                  'Current Hospital Name': hospitalForm.current_hospital_name || localStorage.getItem('hospital_name') || '',
                  'Engine Capacity': hospitalForm.engine_capacity || '',
                  'Severity': hospitalForm.severity || '',
                  'Collision Force From': hospitalForm.collision_force_from || '',
                  'Side.1': hospitalForm.side_1 || '',
                  'Type of Injury No 2': hospitalForm.type_of_injury_no_2 || '',
                  'Family Current Status': hospitalForm.family_current_status || '',
                  'Time Taken To Reach Hospital': hospitalForm.time_taken_to_reach_hospital || '',
                  'Mode of Transport to the Hospital': hospitalForm.mode_of_transport_to_the_hospital || '',
                  'Category of Road': hospitalForm.category_of_road || '',
                  'Time of Collision': hospitalForm.time_of_collision || ''
                } ] };

                const res = await API.post('predictions/hospital-stay-predict', payload);
                const pred = res.data?.predictions && res.data.predictions[0];
                if (pred) {
                  setHospitalResult({ prediction: pred.prediction, probabilities: pred.probabilities || {} });
                } else {
                  setHospitalResult({ prediction: 'Unknown', probabilities: {} });
                }
              } catch (err) {
                console.error('Hospital stay prediction error', err);
                setHospitalError(err?.response?.data || err.message || 'Request failed');
              } finally {
                setIsHospitalLoading(false);
              }
            }} className="space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">{t('investigationDone') || 'Investigation Done'}</label>
                  <select name="investigation_done" value={hospitalForm.investigation_done} onChange={handleHospitalChange} className="w-full p-3 border rounded bg-white">
                    <option value="">{t('selectAnOption')}</option>
                    <option value="Others">{t('others') || 'Others'}</option>
                    <option value="XRay">X-Ray</option>
                    <option value="CT">CT</option>
                    <option value="MRI">MRI</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">{t('typeOfInjuryNo1') || 'Type of Injury No 1'}</label>
                  <input name="type_of_injury_no_1" value={hospitalForm.type_of_injury_no_1} onChange={handleHospitalChange} className="w-full p-3 border rounded" placeholder={t('typeOfInjuryNo1') || 'Type of injury'} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">{t('side') || 'Side'}</label>
                  <select name="side" value={hospitalForm.side} onChange={handleHospitalChange} className="w-full p-3 border rounded bg-white">
                    <option value="">{t('selectAnOption')}</option>
                    <option value="Right">{t('right') || 'Right'}</option>
                    <option value="Left">{t('left') || 'Left'}</option>
                    <option value="Unknown">{t('unknown')}</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">{t('siteOfInjuryNo1') || 'Site of Injury No 1'}</label>
                  <input name="site_of_injury_no1" value={hospitalForm.site_of_injury_no1} onChange={handleHospitalChange} className="w-full p-3 border rounded" placeholder={t('siteOfInjuryNo1') || 'Site'} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">{t('currentHospitalName') || 'Current Hospital Name'}</label>
                  <input name="current_hospital_name" value={hospitalForm.current_hospital_name} onChange={handleHospitalChange} className="w-full p-3 border rounded" placeholder={t('currentHospitalName') || 'Hospital'} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Engine Capacity</label>
                  <select name="engine_capacity" value={hospitalForm.engine_capacity} onChange={handleHospitalChange} className="w-full p-3 border rounded bg-white">
                    <option value="">{t('selectAnOption')}</option>
                    <option value="0To100">0To100</option>
                    <option value="101To200">101To200</option>
                    <option value="201To400">201To400</option>
                    <option value="400Plus">400Plus</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">{t('severity') || 'Severity'}</label>
                  <select name="severity" value={hospitalForm.severity} onChange={handleHospitalChange} className="w-full p-3 border rounded bg-white">
                    <option value="">{t('selectAnOption')}</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">{t('collisionForceFrom') || 'Collision Force From'}</label>
                  <select name="collision_force_from" value={hospitalForm.collision_force_from} onChange={handleHospitalChange} className="w-full p-3 border rounded bg-white">
                    <option value="">{t('selectAnOption')}</option>
                    <option value="RightSide">{t('rightSide') || 'RightSide'}</option>
                    <option value="LeftSide">{t('leftSide') || 'LeftSide'}</option>
                    <option value="Front">{t('front')}</option>
                    <option value="Behind">{t('behind')}</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Side (secondary)</label>
                  <input name="side_1" value={hospitalForm.side_1} onChange={handleHospitalChange} className="w-full p-3 border rounded" placeholder={t('side') || 'Side'} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">{t('typeOfInjuryNo2') || 'Type of Injury No 2'}</label>
                  <input name="type_of_injury_no_2" value={hospitalForm.type_of_injury_no_2} onChange={handleHospitalChange} className="w-full p-3 border rounded" placeholder={t('typeOfInjuryNo2') || ''} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">{t('familyCurrentStatus') || 'Family Current Status'}</label>
                  <select name="family_current_status" value={hospitalForm.family_current_status} onChange={handleHospitalChange} className="w-full p-3 border rounded bg-white">
                    <option value="">{t('selectAnOption')}</option>
                    <option value="Not Affected">{t('notAffected')}</option>
                    <option value="Mildly Affected">{t('mildlyAffected')}</option>
                    <option value="Moderately Affected">{t('moderatelyAffected')}</option>
                    <option value="Severely Affected">{t('severelyAffected')}</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">{t('timeTakenToReachHospital') || 'Time Taken To Reach Hospital'}</label>
                  <select name="time_taken_to_reach_hospital" value={hospitalForm.time_taken_to_reach_hospital} onChange={handleHospitalChange} className="w-full p-3 border rounded bg-white">
                    <option value="">{t('selectAnOption')}</option>
                    <option value="Less Than 15 Minutes">{t('lessThan15Minutes')}</option>
                    <option value="15 Minutes - 30 Minutes">{t('minutes15To30')}</option>
                    <option value="30 Minutes - 1 Hour">{t('minutes30To1Hour')}</option>
                    <option value="1 Hour - 2 Hour">{t('hour1To2')}</option>
                    <option value="More Than 2 Hour">{t('moreThan2Hours')}</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">{t('modeOfTransportToHospital') || 'Mode of Transport to the Hospital'}</label>
                  <select name="mode_of_transport_to_the_hospital" value={hospitalForm.mode_of_transport_to_the_hospital} onChange={handleHospitalChange} className="w-full p-3 border rounded bg-white">
                    <option value="">{t('selectAnOption')}</option>
                    <option value="Ambulance">{t('ambulance')}</option>
                    <option value="Three wheeler">{t('threeWheeler')}</option>
                    <option value="Motor Bike">{t('motorBike')}</option>
                    <option value="Other Vehicle">{t('otherVehicle')}</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">{t('categoryOfRoad') || 'Category of Road'}</label>
                  <select name="category_of_road" value={hospitalForm.category_of_road} onChange={handleHospitalChange} className="w-full p-3 border rounded bg-white">
                    <option value="">{t('selectAnOption')}</option>
                    <option value="SideRoad">{t('sideRoad') || 'SideRoad'}</option>
                    <option value="HighWay">{t('highway') || 'HighWay'}</option>
                    <option value="Junction">{t('junction')}</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">{t('timeOfCollision') || 'Time of Collision'}</label>
                  <input name="time_of_collision" value={hospitalForm.time_of_collision} onChange={handleHospitalChange} className="w-full p-3 border rounded" placeholder={t('timeOfCollision') || 'e.g., 09:00 - 12:00'} />
                </div>
              </div>

              <div className="flex justify-center">
                <button type="submit" disabled={isHospitalLoading} className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg font-semibold disabled:opacity-50">
                  {isHospitalLoading ? `${t('processingPrediction')}` : `${t('getPredictionAnalysis')}`}
                </button>
              </div>
            </form>

            <div className="mt-6">
              {hospitalError && (<div className="bg-red-50 border border-red-200 p-4 text-red-700 rounded">{typeof hospitalError === 'string' ? hospitalError : JSON.stringify(hospitalError, null, 2)}</div>)}

              {hospitalResult && (
                <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
                  <h3 className="text-lg font-semibold mb-2">{t('hospitalStayTitle')}: <span className="font-bold text-emerald-700">{formatHospitalStayPrediction(hospitalResult.prediction)}</span></h3>
                  {hospitalResult.probabilities && (
                    <div className="mt-3">
                      <h4 className="font-medium mb-2">{t('outcomeProbabilities') || 'Probabilities'}</h4>
                      <div className="space-y-2">{Object.entries(hospitalResult.probabilities).sort(([,a],[,b]) => b-a).map(([k,v]) => (
                        <div key={k} className="flex justify-between"><div className="text-sm text-slate-700">{k}</div><div className="font-semibold text-green-600">{(v*100).toFixed(1)}%</div></div>
                      ))}</div>
                    </div>
                  )}
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
