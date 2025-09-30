import React, { useState } from "react";
import DoctorNav from "../../navbars/DoctorNav";
import API from "../../utils/api"; // your axios instance

const ViewPatientData = ({ setIsAuthenticated, setRole }) => {
  const [searchId, setSearchId] = useState("");
  const [patients, setPatients] = useState([]);
  const [filtered, setFiltered] = useState(null);
  const [accidents, setAccidents] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedAccident, setSelectedAccident] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleSearch = async () => {
    setError("");
    setFiltered(null);
    setAccidents([]);
    if (!searchId.trim()) {
      setError("Please enter a Patient ID");
      return;
    }
    setLoading(true);
    try {
      // 1️⃣ fetch patients and filter by id
      const res = await API.get("/patients");
      setPatients(res.data);
      const match = res.data.find((p) => p.patient_id === searchId.trim());
      if (!match) {
        setError("No patient found with that ID.");
        return;
      }
      setFiltered(match);

      // 2️⃣ fetch accident details for that patient id
      const accRes = await API.get(`/accidents/patient/${searchId.trim()}`);
      setAccidents(accRes.data);
      console.log(accRes.data);
    } catch (err) {
      console.error(err);
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <DoctorNav setIsAuthenticated={setIsAuthenticated} setRole={setRole} />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">
          View Patient Data
        </h1>

        {/* Search box */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <label className="block mb-2 text-gray-700 font-medium">
            Enter Patient ID:
          </label>
          <div className="flex">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Patient ID"
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
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        {/* Patient info */}
        {filtered && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Patient Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
              <p><span className="font-medium">Full Name:</span> {filtered["Full Name"]}</p>
              <p><span className="font-medium">Contact Number:</span> {filtered["Contact Number"]}</p>
              <p><span className="font-medium">Date of Birth:</span> {filtered["Date of Birth"]}</p>
              <p><span className="font-medium">Ethnicity:</span> {filtered["Ehinicity"]}</p>
              <p><span className="font-medium">Gender:</span> {filtered["Gender"]}</p>
              <p><span className="font-medium">Address:</span> {filtered["Address Street"]}</p>
              <p><span className="font-medium">Life Style:</span> {filtered["Life Style"]}</p>
              <p><span className="font-medium">Education:</span> {filtered["Education Qualification"]}</p>
              <p><span className="font-medium">Occupation:</span> {filtered["Occupation"]}</p>
              <p><span className="font-medium">Employment Type:</span> {filtered["Employment Type Name"]}</p>
              <p><span className="font-medium">Family Monthly Income:</span> {filtered["Family  Monthly Income"]}</p>
              <p><span className="font-medium">Access to Wash Room:</span> {filtered["Access to Wash Room"]}</p>
              <p><span className="font-medium">Toilet Modification:</span> {filtered["Type of toilet modification"]}</p>
              <p><span className="font-medium">Blood Group:</span> {filtered["Blood Group"]}</p>
              <p><span className="font-medium">Patient ID:</span> {filtered["patient_id"]}</p>
              {/* <p><span className="font-medium">Hospital ID:</span> {filtered["Hospital ID"]}</p> */}
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
                  <h3 className="font-semibold text-blue-700 mb-2">Accident #{index + 1}</h3>
                  <div className="text-gray-700">
                    <p><span className="font-medium">Incident Date:</span> {acc["incident at date"]}</p>
                    <p><span className="font-medium">Incident Time:</span> {acc["incident at time"]}</p>
                    <p>
                      <span className="font-medium">Completed:</span>{" "}
                      {acc["Completed"] ? "Yes" : "No"}
                    </p>

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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3 text-blue-600">Basic Information</h3>
                    <p className="mb-2"><span className="font-medium">Incident Date:</span> {selectedAccident["incident at date"]}</p>
                    <p className="mb-2"><span className="font-medium">Incident Time:</span> {selectedAccident["incident at time"]}</p>
                    <p className="mb-2"><span className="font-medium">Time of Collision:</span> {selectedAccident["time of collision"]}</p>
                    <p className="mb-2"><span className="font-medium">Mode of Traveling:</span> {selectedAccident["Mode of traveling during accident"]}</p>
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
                    <p className="mb-2"><span className="font-medium">Collision With:</span> {selectedAccident["Collision with"]}</p>
                    <p className="mb-2"><span className="font-medium">Approximate Speed:</span> {selectedAccident["Approximate speed"]}</p>
                    <p className="mb-2"><span className="font-medium">Alcohol Consumption:</span> {selectedAccident["Alcohol Consumption"]}</p>
                    <p className="mb-2"><span className="font-medium">Helmet Worn:</span> {selectedAccident["Helmet Worn"]}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3 text-blue-600">Medical & Financial</h3>
                    <p className="mb-2"><span className="font-medium">Mode of Transport to Hospital:</span> {selectedAccident["Mode of transport to hospital"]}</p>
                    <p className="mb-2"><span className="font-medium">First Aid Given at Scene:</span> {selectedAccident["First aid given at seen"] ? "Yes" : "No"}</p>
                    <p className="mb-2"><span className="font-medium">Bystander Expenditure/Day:</span> {selectedAccident["Bystander expenditure per day"]}</p>
                    <p className="mb-2"><span className="font-medium">Any Insurance Claim:</span> {selectedAccident["Any insurance claim type"]}</p>
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
    </div>
  );
};

export default ViewPatientData;
