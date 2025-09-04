// import React, { useState } from 'react';
// import NurseNav from '../../navbars/NurseNav';

// const RecordAccidentData = ({ setIsAuthenticated, setRole }) => {
//   const [formData, setFormData] = useState({
//     patientId: '',
//     createdBy: '1', // Hardcoded nurse ID for demo
//     incidentAtDate: '',
//     incidentAtTime: '',
//     timeOfCollision: '',
//     modeOfTraveling: '',
//     visibility: '',
//     collisionForceFrom: '',
//     collisionWith: '',
//     roadCondition: '',
//     roadType: '',
//     categoryOfRoad: '',
//     roadSignalsExist: '',
//     approximateSpeed: '',
//     alcoholConsumption: false,
//     timeBetweenAlcoholAndAccident: '',
//     illicitDrugs: '',
//     vehicleType: '',
//     helmetWorn: false,
//     engineCapacity: '',
//     modeOfTransportToHospital: '',
//     timeTakenToReachHospital: '',
//     bystanderExpenditurePerDay: '',
//     familyMonthlyIncomeBefore: '',
//     familyMonthlyIncomeAfter: '',
//     familyCurrentStatus: '',
//     anyInsuranceClaimType: '',
//     dressName: '',
//     vehicleInsured: false,
//     vehicleInsuredType: '',
//     passengerType: '',
//     firstAidGiven: false,
//   });

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Accident Record Data:', formData);
//     // Add backend API call here to save data to the Accident Record table
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <NurseNav setIsAuthenticated={setIsAuthenticated} setRole={setRole} />
//       <div className="container mx-auto p-6">
//         <h1 className="text-3xl font-bold text-primary mb-4">Record Accident Data</h1>
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <form className="space-y-4" onSubmit={handleSubmit}>
//             <div>
//               <label className="block text-gray-700">Patient</label>
//               <select
//                 name="patientId"
//                 value={formData.patientId}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
//                 required
//               >
//                 <option value="" disabled>Select patient</option>
//                 <option value="1">Patient 1</option>
//                 <option value="2">Patient 2</option>
//                 <option value="3">Patient 3</option>
//                 {/* Replace with actual patient data from backend */}
//               </select>
//             </div>

//             <div>
//               <label className="block text-gray-700">Incident Date</label>
//               <input
//                 type="date"
//                 name="incidentAtDate"
//                 value={formData.incidentAtDate}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700">Incident Time</label>
//               <input
//                 type="time"
//                 name="incidentAtTime"
//                 value={formData.incidentAtTime}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700">Time of Collision</label>
//               <input
//                 type="time"
//                 name="timeOfCollision"
//                 value={formData.timeOfCollision}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700">Mode of Traveling</label>
//               <select
//                 name="modeOfTraveling"
//                 value={formData.modeOfTraveling}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
//                 required
//               >
//                 <option value="" disabled>Select mode</option>
//                 <option value="Car">Car</option>
//                 <option value="Motorcycle">Motorcycle</option>
//                 <option value="Bicycle">Bicycle</option>
//                 <option value="Pedestrian">Pedestrian</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-gray-700">Visibility</label>
//               <select
//                 name="visibility"
//                 value={formData.visibility}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
//                 required
//               >
//                 <option value="" disabled>Select visibility</option>
//                 <option value="Clear">Clear</option>
//                 <option value="Foggy">Foggy</option>
//                 <option value="Rainy">Rainy</option>
//                 <option value="Dark">Dark</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-gray-700">Collision Force From</label>
//               <select
//                 name="collisionForceFrom"
//                 value={formData.collisionForceFrom}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
//                 required
//               >
//                 <option value="" disabled>Select direction</option>
//                 <option value="Front">Front</option>
//                 <option value="Rear">Rear</option>
//                 <option value="Side">Side</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-gray-700">Collision With</label>
//               <select
//                 name="collisionWith"
//                 value={formData.collisionWith}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
//                 required
//               >
//                 <option value="" disabled>Select object</option>
//                 <option value="Vehicle">Vehicle</option>
//                 <option value="Pedestrian">Pedestrian</option>
//                 <option value="Object">Object</option>
//                 <option value="None">None</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-gray-700">Road Condition</label>
//               <select
//                 name="roadCondition"
//                 value={formData.roadCondition}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
//                 required
//               >
//                 <option value="" disabled>Select condition</option>
//                 <option value="Dry">Dry</option>
//                 <option value="Wet">Wet</option>
//                 <option value="Icy">Icy</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-gray-700">Road Type</label>
//               <select
//                 name="roadType"
//                 value={formData.roadType}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
//                 required
//               >
//                 <option value="" disabled>Select road type</option>
//                 <option value="Highway">Highway</option>
//                 <option value="City Street">City Street</option>
//                 <option value="Rural Road">Rural Road</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-gray-700">Category of Road</label>
//               <select
//                 name="categoryOfRoad"
//                 value={formData.categoryOfRoad}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
//                 required
//               >
//                 <option value="" disabled>Select category</option>
//                 <option value="Main Road">Main Road</option>
//                 <option value="Secondary Road">Secondary Road</option>
//                 <option value="Residential">Residential</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-gray-700">Road Signals Exist</label>
//               <select
//                 name="roadSignalsExist"
//                 value={formData.roadSignalsExist}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
//                 required
//               >
//                 <option value="" disabled>Select option</option>
//                 <option value="Yes">Yes</option>
//                 <option value="No">No</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-gray-700">Approximate Speed (km/h)</label>
//               <input
//                 type="number"
//                 name="approximateSpeed"
//                 value={formData.approximateSpeed}
//                 onChange={handleChange}
//                 placeholder="Enter speed"
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700">Alcohol Consumption</label>
//               <input
//                 type="checkbox"
//                 name="alcoholConsumption"
//                 checked={formData.alcoholConsumption}
//                 onChange={handleChange}
//                 className="h-5 w-5 text-accent focus:ring-accent"
//               />
//             </div>

//             {formData.alcoholConsumption && (
//               <div>
//                 <label className="block text-gray-700">Time Between Alcohol Consumption and Accident (hours)</label>
//                 <input
//                   type="number"
//                   name="timeBetweenAlcoholAndAccident"
//                   value={formData.timeBetweenAlcoholAndAccident}
//                   onChange={handleChange}
//                   placeholder="Enter hours"
//                   step="0.01"
//                   className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
//                 />
//               </div>
//             )}

//             <div>
//               <label className="block text-gray-700">Illicit Drugs</label>
//               <input
//                 type="text"
//                 name="illicitDrugs"
//                 value={formData.illicitDrugs}
//                 onChange={handleChange}
//                 placeholder="Enter drugs used, if any"
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700">Vehicle Type</label>
//               <select
//                 name="vehicleType"
//                 value={formData.vehicleType}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
//                 required
//               >
//                 <option value="" disabled>Select vehicle type</option>
//                 <option value="Car">Car</option>
//                 <option value="Motorcycle">Motorcycle</option>
//                 <option value="Truck">Truck</option>
//                 <option value="Bicycle">Bicycle</option>
//                 <option value="None">None</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-gray-700">Helmet Worn</label>
//               <input
//                 type="checkbox"
//                 name="helmetWorn"
//                 checked={formData.helmetWorn}
//                 onChange={handleChange}
//                 className="h-5 w-5 text-accent focus:ring-accent"
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700">Engine Capacity</label>
//               <input
//                 type="text"
//                 name="engineCapacity"
//                 value={formData.engineCapacity}
//                 onChange={handleChange}
//                 placeholder="Enter engine capacity (e.g., 150cc)"
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700">Mode of Transport to Hospital</label>
//               <select
//                 name="modeOfTransportToHospital"
//                 value={formData.modeOfTransportToHospital}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
//                 required
//               >
//                 <option value="" disabled>Select transport mode</option>
//                 <option value="Ambulance">Ambulance</option>
//                 <option value="Car">Car</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-gray-700">Time Taken to Reach Hospital (hours)</label>
//               <input
//                 type="number"
//                 name="timeTakenToReachHospital"
//                 value={formData.timeTakenToReachHospital}
//                 onChange={handleChange}
//                 placeholder="Enter hours"
//                 step="0.01"
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700">Bystander Expenditure Per Day</label>
//               <input
//                 type="text"
//                 name="bystanderExpenditurePerDay"
//                 value={formData.bystanderExpenditurePerDay}
//                 onChange={handleChange}
//                 placeholder="Enter expenditure"
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700">Family Monthly Income Before Accident</label>
//               <input
//                 type="text"
//                 name="familyMonthlyIncomeBefore"
//                 value={formData.familyMonthlyIncomeBefore}
//                 onChange={handleChange}
//                 placeholder="Enter income"
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700">Family Monthly Income After Accident</label>
//               <input
//                 type="text"
//                 name="familyMonthlyIncomeAfter"
//                 value={formData.familyMonthlyIncomeAfter}
//                 onChange={handleChange}
//                 placeholder="Enter income"
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700">Family Current Status</label>
//               <input
//                 type="text"
//                 name="familyCurrentStatus"
//                 value={formData.familyCurrentStatus}
//                 onChange={handleChange}
//                 placeholder="Enter status"
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700">Any Insurance Claim Type</label>
//               <input
//                 type="text"
//                 name="anyInsuranceClaimType"
//                 value={formData.anyInsuranceClaimType}
//                 onChange={handleChange}
//                 placeholder="Enter claim type"
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700">Dress Name</label>
//               <input
//                 type="text"
//                 name="dressName"
//                 value={formData.dressName}
//                 onChange={handleChange}
//                 placeholder="Enter dress name"
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700">Vehicle Insured</label>
//               <input
//                 type="checkbox"
//                 name="vehicleInsured"
//                 checked={formData.vehicleInsured}
//                 onChange={handleChange}
//                 className="h-5 w-5 text-accent focus:ring-accent"
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700">Vehicle Insured Type</label>
//               <input
//                 type="text"
//                 name="vehicleInsuredType"
//                 value={formData.vehicleInsuredType}
//                 onChange={handleChange}
//                 placeholder="Enter insurance type"
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700">Passenger Type</label>
//               <select
//                 name="passengerType"
//                 value={formData.passengerType}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
//                 required
//               >
//                 <option value="" disabled>Select passenger type</option>
//                 <option value="Driver">Driver</option>
//                 <option value="Passenger">Passenger</option>
//                 <option value="Pedestrian">Pedestrian</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-gray-700">First Aid Given at Scene</label>
//               <input
//                 type="checkbox"
//                 name="firstAidGiven"
//                 checked={formData.firstAidGiven}
//                 onChange={handleChange}
//                 className="h-5 w-5 text-accent focus:ring-accent"
//               />
//             </div>

//             <button
//               type="submit"
//               className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-600 transition"
//             >
//               Submit
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RecordAccidentData;


import React, { useState } from 'react';
import NurseNav from '../../navbars/NurseNav';

const RecordAccidentData = ({ setIsAuthenticated, setRole }) => {
  const [formData, setFormData] = useState({
    patientId: '',
    createdBy: '1', // Hardcoded nurse ID for demo
    incidentAtDate: '',
    incidentAtTime: '',
    timeOfCollision: '',
    modeOfTraveling: '',
    visibility: '',
    collisionForceFrom: '',
    collisionWith: '',
    roadCondition: '',
    roadType: '',
    categoryOfRoad: '',
    roadSignalsExist: '',
    approximateSpeed: '',
    alcoholConsumption: false,
    timeBetweenAlcoholAndAccident: '',
    illicitDrugs: '',
    vehicleType: '',
    helmetWorn: false,
    engineCapacity: '',
    modeOfTransportToHospital: '',
    timeTakenToReachHospital: '',
    bystanderExpenditurePerDay: '',
    familyMonthlyIncomeBefore: '',
    familyMonthlyIncomeAfter: '',
    familyCurrentStatus: '',
    anyInsuranceClaimType: '',
    dressName: '',
    vehicleInsured: false,
    vehicleInsuredType: '',
    passengerType: '',
    firstAidGiven: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.patientId) newErrors.patientId = 'Patient selection is required';
    if (!formData.incidentAtDate) newErrors.incidentAtDate = 'Incident date is required';
    if (!formData.incidentAtTime) newErrors.incidentAtTime = 'Incident time is required';
    if (!formData.approximateSpeed) newErrors.approximateSpeed = 'Approximate speed is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Accident Record Data:', formData);
      
      // Show success message
      alert('Accident data recorded successfully!');
      
      // Reset form (optional)
      // setFormData({ ... reset values ... });
    } catch (error) {
      alert('Error recording accident data. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const FormSection = ({ title, children, icon }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <span className="mr-3 text-xl">{icon}</span>
          {title}
        </h3>
      </div>
      <div className="p-6 space-y-6">
        {children}
      </div>
    </div>
  );

  const InputField = ({ label, name, type = "text", placeholder, required = false, options = null, step = null }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {options ? (
        <select
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50 focus:bg-white ${
            errors[name] ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
          }`}
          required={required}
        >
          <option value="" disabled>Select {label.toLowerCase()}</option>
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          placeholder={placeholder}
          step={step}
          className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50 focus:bg-white ${
            errors[name] ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
          }`}
          required={required}
        />
      )}
      {errors[name] && (
        <p className="text-red-500 text-sm flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {errors[name]}
        </p>
      )}
    </div>
  );

  const CheckboxField = ({ label, name, required = false }) => (
    <div className="space-y-2">
      <label className="flex items-center text-sm font-medium text-gray-700 cursor-pointer">
        <input
          type="checkbox"
          name={name}
          checked={formData[name]}
          onChange={handleChange}
          className="h-5 w-5 text-red-500 focus:ring-red-500 border-gray-300 rounded mr-3"
          required={required}
        />
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {errors[name] && (
        <p className="text-red-500 text-sm flex items-center ml-8">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50">
      <NurseNav setIsAuthenticated={setIsAuthenticated} setRole={setRole} />
      
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Accident Record Data</h1>
          <p className="text-gray-600">Document comprehensive accident details and circumstances</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Patient & Basic Information */}
          <FormSection title="Patient & Incident Details" icon="🏥">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Patient"
                name="patientId"
                options={['Patient 1', 'Patient 2', 'Patient 3']}
                required
              />
              <InputField
                label="Incident Date"
                name="incidentAtDate"
                type="date"
                required
              />
              <InputField
                label="Incident Time"
                name="incidentAtTime"
                type="time"
                required
              />
              <InputField
                label="Time of Collision"
                name="timeOfCollision"
                type="time"
                required
              />
            </div>
          </FormSection>

          {/* Accident Circumstances */}
          <FormSection title="Accident Circumstances" icon="🚗">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Mode of Traveling"
                name="modeOfTraveling"
                options={['Car', 'Motorcycle', 'Bicycle', 'Pedestrian', 'Other']}
                required
              />
              <InputField
                label="Visibility"
                name="visibility"
                options={['Clear', 'Foggy', 'Rainy', 'Dark']}
                required
              />
              <InputField
                label="Collision Force From"
                name="collisionForceFrom"
                options={['Front', 'Rear', 'Side', 'Other']}
                required
              />
              <InputField
                label="Collision With"
                name="collisionWith"
                options={['Vehicle', 'Pedestrian', 'Object', 'None']}
                required
              />
              <InputField
                label="Approximate Speed (km/h)"
                name="approximateSpeed"
                type="number"
                placeholder="Enter speed"
                required
              />
              <InputField
                label="Vehicle Type"
                name="vehicleType"
                options={['Car', 'Motorcycle', 'Truck', 'Bicycle', 'None']}
                required
              />
            </div>
          </FormSection>

          {/* Road Conditions */}
          <FormSection title="Road Conditions" icon="🛣️">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Road Condition"
                name="roadCondition"
                options={['Dry', 'Wet', 'Icy', 'Other']}
                required
              />
              <InputField
                label="Road Type"
                name="roadType"
                options={['Highway', 'City Street', 'Rural Road', 'Other']}
                required
              />
              <InputField
                label="Category of Road"
                name="categoryOfRoad"
                options={['Main Road', 'Secondary Road', 'Residential', 'Other']}
                required
              />
              <InputField
                label="Road Signals Exist"
                name="roadSignalsExist"
                options={['Yes', 'No']}
                required
              />
            </div>
          </FormSection>

          {/* Safety & Substance Information */}
          <FormSection title="Safety & Substance Information" icon="⚠️">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <CheckboxField
                  label="Alcohol Consumption"
                  name="alcoholConsumption"
                />
                <CheckboxField
                  label="Helmet Worn"
                  name="helmetWorn"
                />
                <CheckboxField
                  label="First Aid Given at Scene"
                  name="firstAidGiven"
                />
              </div>
              <div className="space-y-4">
                <InputField
                  label="Illicit Drugs"
                  name="illicitDrugs"
                  placeholder="Enter drugs used, if any"
                />
                <InputField
                  label="Engine Capacity"
                  name="engineCapacity"
                  placeholder="Enter engine capacity (e.g., 150cc)"
                />
                <InputField
                  label="Passenger Type"
                  name="passengerType"
                  options={['Driver', 'Passenger', 'Pedestrian']}
                  required
                />
              </div>
            </div>
            
            {formData.alcoholConsumption && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <InputField
                  label="Time Between Alcohol Consumption and Accident (hours)"
                  name="timeBetweenAlcoholAndAccident"
                  type="number"
                  step="0.01"
                  placeholder="Enter hours"
                />
              </div>
            )}
          </FormSection>

          {/* Medical Transport */}
          <FormSection title="Medical Transport" icon="🚑">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Mode of Transport to Hospital"
                name="modeOfTransportToHospital"
                options={['Ambulance', 'Car', 'Other']}
                required
              />
              <InputField
                label="Time Taken to Reach Hospital (hours)"
                name="timeTakenToReachHospital"
                type="number"
                step="0.01"
                placeholder="Enter hours"
                required
              />
            </div>
          </FormSection>

          {/* Economic Impact */}
          <FormSection title="Economic Impact" icon="💰">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Family Monthly Income Before Accident"
                name="familyMonthlyIncomeBefore"
                type="number"
                placeholder="Enter income"
                required
              />
              <InputField
                label="Family Monthly Income After Accident"
                name="familyMonthlyIncomeAfter"
                type="number"
                placeholder="Enter income"
              />
              <InputField
                label="Bystander Expenditure Per Day"
                name="bystanderExpenditurePerDay"
                type="number"
                placeholder="Enter expenditure"
              />
              <InputField
                label="Family Current Status"
                name="familyCurrentStatus"
                placeholder="Enter status"
              />
            </div>
          </FormSection>

          {/* Insurance Information */}
          <FormSection title="Insurance Information" icon="📋">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <CheckboxField
                  label="Vehicle Insured"
                  name="vehicleInsured"
                />
                <InputField
                  label="Any Insurance Claim Type"
                  name="anyInsuranceClaimType"
                  placeholder="Enter claim type"
                />
              </div>
              <div className="space-y-4">
                <InputField
                  label="Vehicle Insurance Type"
                  name="vehicleInsuredType"
                  placeholder="Enter insurance type"
                />
                <InputField
                  label="Dress Name"
                  name="dressName"
                  placeholder="Enter dress name"
                />
              </div>
            </div>
          </FormSection>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-lg shadow-lg hover:from-red-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Recording Accident Data...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Record Accident Data
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordAccidentData;