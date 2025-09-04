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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // Add backend API call here to save data to the Patient table
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NurseNav setIsAuthenticated={setIsAuthenticated} setRole={setRole} />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-primary mb-4">Record Patient Data</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter full name"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700">Contact Number</label>
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="Enter 10-digit contact number"
                pattern="[0-9]{10}"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700">Address Street</label>
              <input
                type="text"
                name="addressStreet"
                value={formData.addressStreet}
                onChange={handleChange}
                placeholder="Enter street address"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700">Life Style</label>
              <select
                name="lifeStyle"
                value={formData.lifeStyle}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                required
              >
                <option value="" disabled>Select lifestyle</option>
                <option value="Active">Active</option>
                <option value="Sedentary">Sedentary</option>
                <option value="Moderate">Moderate</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700">Education Qualification</label>
              <input
                type="text"
                name="educationQualification"
                value={formData.educationQualification}
                onChange={handleChange}
                placeholder="Enter education qualification"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700">Occupation</label>
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                placeholder="Enter occupation"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700">Ethnicity</label>
              <select
                name="ethnicity"
                value={formData.ethnicity}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                required
              >
                <option value="" disabled>Select ethnicity</option>
                <option value="Asian">Asian</option>
                <option value="Black">Black</option>
                <option value="White">White</option>
                <option value="Hispanic">Hispanic</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                required
              >
                <option value="" disabled>Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700">Employment Type Name</label>
              <input
                type="text"
                name="employmentTypeName"
                value={formData.employmentTypeName}
                onChange={handleChange}
                placeholder="Enter employment type"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700">Family Monthly Income</label>
              <input
                type="number"
                name="familyMonthlyIncome"
                value={formData.familyMonthlyIncome}
                onChange={handleChange}
                placeholder="Enter monthly income"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700">Access to Wash Room</label>
              <select
                name="accessToWashRoom"
                value={formData.accessToWashRoom}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                required
              >
                <option value="" disabled>Select access</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Limited">Limited</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700">Type of Toilet Modification</label>
              <input
                type="text"
                name="typeOfToiletModification"
                value={formData.typeOfToiletModification}
                onChange={handleChange}
                placeholder="Enter toilet modification type"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label className="block text-gray-700">Blood Group</label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                required
              >
                <option value="" disabled>Select blood group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-600 transition"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RecordPatientData;