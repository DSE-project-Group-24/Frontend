import React, { useState } from "react";
import NurseNav from "../../navbars/NurseNav";
import API from "../../utils/api";

const RecordPatientData = () => {
  // Define dropdown options from provided data
  const bloodGroupOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const ethnicityOptions = ["Tamil", "Sinhalese", "Moor"];
  const lifeStyleOptions = [
    "Living with children",
    "Living with care givers",
    "Living alone",
  ];
  const educationOptions = [
    "O/L or A/L",
    "Grade 5",
    "Under Graduate",
    "Post Graduate",
  ];
  const occupationOptions = [
    "Retired pensioners",
    "Unemployed",
    "Semi-Skilled Workers",
    "Skilled Workers",
    "Student",
    "Business",
    "Others",
    "Professionals",
    "Highly Skilled Workers",
    "Driver",
    "Forces",
    "Religious Sevice",
    "NGO",
    "Road and Field",
  ];
  const employmentTypeOptions = [
    "Permanent - Government",
    "Temporary",
    "Daily Basis",
    "Not Necessary for Student and Unemployed",
    "Contract",
    "Permanent - Private",
  ];
  const accessToWashroomOptions = [
    "No",
    "Yes",
    "Victim not willing to share/ Unable to respond/  Early Discharge",
  ];
  const toiletModificationOptions = [
    "No Modification done",
    "Permanent Commode Build",
    "Victim not willing to share/ Unable to respond/  Early Discharge",
    "Commode Chair Bought",
  ];

  const [formData, setFormData] = useState({
    full_name: "",
    contact_number: "",
    date_of_birth: "",
    gender: "",
    ethinicity: "",
    address_street: "",
    life_style: "",
    education_qualification: "",
    occupation: "",
    employment_type_name: "",
    family_monthly_income: "",
    access_to_wash_room: "",
    type_of_toilet_modification: "",
    blood_group: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Handle form input changes
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Submit patient data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const payload = {
        "Full Name": formData.full_name,
        "Contact Number": formData.contact_number,
        "Date of Birth": formData.date_of_birth,
        Gender: formData.gender,
        Ehinicity: formData.ethinicity,
        "Address Street": formData.address_street,
        "Life Style": formData.life_style,
        "Education Qualification": formData.education_qualification,
        Occupation: formData.occupation,
        "Employment Type Name": formData.employment_type_name,
        "Family  Monthly Income": formData.family_monthly_income
          ? Number(formData.family_monthly_income)
          : null,
        "Access to Wash Room": formData.access_to_wash_room,
        "Type of toilet modification": formData.type_of_toilet_modification,
        "Blood Group": formData.blood_group,
      };

      await API.post("/patients", payload);
      setMessage({
        type: "success",
        text: "Patient record created successfully ✅",
      });
      setFormData({
        full_name: "",
        contact_number: "",
        date_of_birth: "",
        gender: "",
        ethinicity: "",
        address_street: "",
        life_style: "",
        education_qualification: "",
        occupation: "",
        employment_type_name: "",
        family_monthly_income: "",
        access_to_wash_room: "",
        type_of_toilet_modification: "",
        blood_group: "",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.detail || "Failed to create patient ❌",
      });
    } finally {
      setLoading(false);
    }
  };

  const FormSection = ({ title, children, icon }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {" "}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
        {" "}
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          {" "}
          <span className="mr-3 text-xl">{icon}</span> {title}{" "}
        </h3>{" "}
      </div>{" "}
      <div className="p-6 space-y-6"> {children} </div>{" "}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <NurseNav />
      <div className="max-w-3xl mx-auto mt-8 bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          Record Patient Data
        </h2>

        {message.text && (
          <div
            className={`mb-4 p-3 rounded-md text-white ${
              message.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {message.text}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Example inputs */}
          <input
            type="text"
            label="Full Name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Full Name"
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="text"
            name="contact_number"
            value={formData.contact_number}
            onChange={handleChange}
            placeholder="Contact Number"
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
            required
          />

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <select
            name="ethinicity"
            value={formData.ethinicity}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">Select Ethnicity</option>
            {ethnicityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="address_street"
            value={formData.address_street}
            onChange={handleChange}
            placeholder="Street Address"
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
          />

          <select
            name="life_style"
            value={formData.life_style}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">Select Life Style</option>
            {lifeStyleOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select
            name="education_qualification"
            value={formData.education_qualification}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">Select Education Qualification</option>
            {educationOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">Select Occupation</option>
            {occupationOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select
            name="employment_type_name"
            value={formData.employment_type_name}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">Select Employment Type</option>
            {employmentTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="family_monthly_income"
            value={formData.family_monthly_income}
            onChange={handleChange}
            placeholder="Family Monthly Income"
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
          />

          <select
            name="access_to_wash_room"
            value={formData.access_to_wash_room}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">Select Access to Wash Room</option>
            {accessToWashroomOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select
            name="type_of_toilet_modification"
            value={formData.type_of_toilet_modification}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">Select Type of Toilet Modification</option>
            {toiletModificationOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select
            name="blood_group"
            value={formData.blood_group}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">Select Blood Group</option>
            {bloodGroupOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={loading}
            className="col-span-1 md:col-span-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Patient Record"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecordPatientData;
