// import React, { useState } from 'react';
// import NurseNav from '../../navbars/NurseNav';

// const RecordPatientData = ({ setIsAuthenticated, setRole }) => {
//   const [formData, setFormData] = useState({
//     fullName: '',
//     contactNumber: '',
//     dateOfBirth: '',
//     addressStreet: '',
//     lifeStyle: '',
//     educationQualification: '',
//     occupation: '',
//     ethnicity: '',
//     gender: '',
//     employmentTypeName: '',
//     familyMonthlyIncome: '',
//     accessToWashRoom: '',
//     typeOfToiletModification: '',
//     bloodGroup: '',
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Form Data:', formData);
//     // Add backend API call here to save data to the Patient table
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <NurseNav setIsAuthenticated={setIsAuthenticated} setRole={setRole} />
//       <div className="container mx-auto p-6">
//         <h1 className="text-3xl font-bold text-primary mb-4">Record Patient Data</h1>
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <form className="space-y-4" onSubmit={handleSubmit}>
//             <div>
//               <label className="block text-gray-700">Full Name</label>
//               <input
//                 type="text"
//                 name="fullName"
//                 value={formData.fullName}
//                 onChange={handleChange}
//                 placeholder="Enter full name"
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700">Contact Number</label>
//               <input
//                 type="text"
//                 name="contactNumber"
//                 value={formData.contactNumber}
//                 onChange={handleChange}
//                 placeholder="Enter 10-digit contact number"
//                 pattern="[0-9]{10}"
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700">Date of Birth</label>
//               <input
//                 type="date"
//                 name="dateOfBirth"
//                 value={formData.dateOfBirth}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700">Address Street</label>
//               <input
//                 type="text"
//                 name="addressStreet"
//                 value={formData.addressStreet}
//                 onChange={handleChange}
//                 placeholder="Enter street address"
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700">Life Style</label>
//               <select
//                 name="lifeStyle"
//                 value={formData.lifeStyle}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
//                 required
//               >
//                 <option value="" disabled>Select lifestyle</option>
//                 <option value="Active">Active</option>
//                 <option value="Sedentary">Sedentary</option>
//                 <option value="Moderate">Moderate</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-gray-700">Education Qualification</label>
//               <input
//                 type="text"
//                 name="educationQualification"
//                 value={formData.educationQualification}
//                 onChange={handleChange}
//                 placeholder="Enter education qualification"
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700">Occupation</label>
//               <input
//                 type="text"
//                 name="occupation"
//                 value={formData.occupation}
//                 onChange={handleChange}
//                 placeholder="Enter occupation"
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700">Ethnicity</label>
//               <select
//                 name="ethnicity"
//                 value={formData.ethnicity}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
//                 required
//               >
//                 <option value="" disabled>Select ethnicity</option>
//                 <option value="Asian">Asian</option>
//                 <option value="Black">Black</option>
//                 <option value="White">White</option>
//                 <option value="Hispanic">Hispanic</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-gray-700">Gender</label>
//               <select
//                 name="gender"
//                 value={formData.gender}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
//                 required
//               >
//                 <option value="" disabled>Select gender</option>
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-gray-700">Employment Type Name</label>
//               <input
//                 type="text"
//                 name="employmentTypeName"
//                 value={formData.employmentTypeName}
//                 onChange={handleChange}
//                 placeholder="Enter employment type"
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700">Family Monthly Income</label>
//               <input
//                 type="number"
//                 name="familyMonthlyIncome"
//                 value={formData.familyMonthlyIncome}
//                 onChange={handleChange}
//                 placeholder="Enter monthly income"
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700">Access to Wash Room</label>
//               <select
//                 name="accessToWashRoom"
//                 value={formData.accessToWashRoom}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
//                 required
//               >
//                 <option value="" disabled>Select access</option>
//                 <option value="Yes">Yes</option>
//                 <option value="No">No</option>
//                 <option value="Limited">Limited</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-gray-700">Type of Toilet Modification</label>
//               <input
//                 type="text"
//                 name="typeOfToiletModification"
//                 value={formData.typeOfToiletModification}
//                 onChange={handleChange}
//                 placeholder="Enter toilet modification type"
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700">Blood Group</label>
//               <select
//                 name="bloodGroup"
//                 value={formData.bloodGroup}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
//                 required
//               >
//                 <option value="" disabled>Select blood group</option>
//                 <option value="A+">A+</option>
//                 <option value="A-">A-</option>
//                 <option value="B+">B+</option>
//                 <option value="B-">B-</option>
//                 <option value="AB+">AB+</option>
//                 <option value="AB-">AB-</option>
//                 <option value="O+">O+</option>
//                 <option value="O-">O-</option>
//               </select>
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

// export default RecordPatientData;

import React, { useState } from 'react';
import NurseNav from '../../navbars/NurseNav';

const RecordPatientData = ({ setIsAuthenticated, setRole }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    contactNumber: '',
    dateOfBirth: '',
    addressStreet: '',
    lifeStyle: '',
    educationQualification: '',
    occupation: '',
    ethnicity: '',
    gender: '',
    employmentTypeName: '',
    familyMonthlyIncome: '',
    accessToWashRoom: '',
    typeOfToiletModification: '',
    bloodGroup: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.contactNumber.trim()) newErrors.contactNumber = 'Contact number is required';
    else if (!/^[0-9]{10}$/.test(formData.contactNumber)) newErrors.contactNumber = 'Contact number must be 10 digits';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.addressStreet.trim()) newErrors.addressStreet = 'Address is required';
    
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
      console.log('Form Data:', formData);
      
      // Show success message
      alert('Patient data recorded successfully!');
      
      // Reset form
      setFormData({
        fullName: '',
        contactNumber: '',
        dateOfBirth: '',
        addressStreet: '',
        lifeStyle: '',
        educationQualification: '',
        occupation: '',
        ethnicity: '',
        gender: '',
        employmentTypeName: '',
        familyMonthlyIncome: '',
        accessToWashRoom: '',
        typeOfToiletModification: '',
        bloodGroup: '',
      });
    } catch (error) {
      alert('Error recording patient data. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const FormSection = ({ title, children, icon }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
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

  const InputField = ({ label, name, type = "text", placeholder, required = false, options = null, pattern = null }) => (
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
          className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white ${
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
          pattern={pattern}
          className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white ${
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <NurseNav setIsAuthenticated={setIsAuthenticated} setRole={setRole} />
      
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Registration</h1>
          <p className="text-gray-600">Complete patient information for medical record</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <FormSection title="Personal Information" icon="👤">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Full Name"
                name="fullName"
                placeholder="Enter patient's full name"
                required
              />
              <InputField
                label="Contact Number"
                name="contactNumber"
                placeholder="Enter 10-digit contact number"
                pattern="[0-9]{10}"
                required
              />
              <InputField
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                required
              />
              <InputField
                label="Gender"
                name="gender"
                options={['Male', 'Female', 'Other']}
                required
              />
              <InputField
                label="Blood Group"
                name="bloodGroup"
                options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']}
                required
              />
              <InputField
                label="Ethnicity"
                name="ethnicity"
                options={['Asian', 'Black', 'White', 'Hispanic', 'Other']}
                required
              />
            </div>
          </FormSection>

          {/* Address Information */}
          <FormSection title="Address Information" icon="🏠">
            <InputField
              label="Street Address"
              name="addressStreet"
              placeholder="Enter complete street address"
              required
            />
          </FormSection>

          {/* Social & Economic Information */}
          <FormSection title="Social & Economic Information" icon="💼">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Education Qualification"
                name="educationQualification"
                placeholder="Enter highest qualification"
                required
              />
              <InputField
                label="Occupation"
                name="occupation"
                placeholder="Enter current occupation"
                required
              />
              <InputField
                label="Employment Type"
                name="employmentTypeName"
                placeholder="e.g., Full-time, Part-time, Self-employed"
                required
              />
              <InputField
                label="Family Monthly Income"
                name="familyMonthlyIncome"
                type="number"
                placeholder="Enter monthly income in USD"
                required
              />
            </div>
          </FormSection>

          {/* Lifestyle Information */}
          <FormSection title="Lifestyle Information" icon="🌟">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Lifestyle"
                name="lifeStyle"
                options={['Active', 'Sedentary', 'Moderate', 'Other']}
                required
              />
              <InputField
                label="Access to Washroom"
                name="accessToWashRoom"
                options={['Yes', 'No', 'Limited']}
                required
              />
              <div className="md:col-span-2">
                <InputField
                  label="Type of Toilet Modification"
                  name="typeOfToiletModification"
                  placeholder="Specify any toilet modifications (if applicable)"
                />
              </div>
            </div>
          </FormSection>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Recording Patient Data...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Record Patient Data
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordPatientData;