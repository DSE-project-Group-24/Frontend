import React, { useState, useEffect, useMemo } from "react";
import API from "../../utils/api";
import NurseNav from "../../navbars/NurseNav";

const AccidentRecordSystem = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [accidentData, setAccidentData] = useState({
    patient_id: "",
    "incident at date": "",
    "incident at time": "",
    "time of collision": "",
    "Mode of traveling during accident": "",
    Visibility: "",
    "Collision force from": "",
    "Collision with": "",
    "Road Condition": "",
    "Road Type": "",
    "Category of Road": "",
    "Road signals exist": "",
    "Approximate speed": "",
    "Alcohol Consumption": "",
    "Time between alcohol consumption and accident": "",
    "Illicit Drugs": "",
    "Vehicle type": "",
    "Helmet Worn": "",
    "Engine Capacity": "",
    "Mode of transport to hospital": "",
    "Time taken to reach hospital": "",
    "Bystander expenditure per day": "",
    "Family monthly income before accident": "",
    "Family monthly income after accident": "",
    "Family current status": "",
    "Any insurance claim type": "",
    "Dress name": "",
    "vehicle insured": "",
    "vehicle insured type": "",
    "Passenger type": "",
    "First aid given at seen": "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // NEW: local search
  const [q, setQ] = useState("");

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await API.get("/patients");
      setPatients(response.data || []);
    } catch (error) {
      console.error("Error fetching patients:", error);
      setMessage("Failed to fetch patients");
    } finally {
      setLoading(false);
    }
  };

  // Helper to read alias or snake_case keys
  const val = (obj, ...keys) => {
    for (const k of keys) {
      if (obj && obj[k] !== undefined && obj[k] !== null) return obj[k];
    }
    return "";
  };

  // Filtered patients for search
  const filteredPatients = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return patients;
    return patients.filter((p) => {
      const name = (val(p, "Full Name", "full_name") || "").toLowerCase();
      const nic = (val(p, "NIC", "nic") || "").toLowerCase();
      const phone = (
        val(p, "Contact Number", "contact_number") || ""
      ).toLowerCase();
      const dob = (
        val(p, "Date of Birth", "date_of_birth") || ""
      ).toLowerCase();
      return (
        name.includes(needle) ||
        nic.includes(needle) ||
        phone.includes(needle) ||
        dob.includes(needle)
      );
    });
  }, [q, patients]);

  const handlePatientSelect = (patient) => {
    if (!patient) {
      alert("Error: Patient data is undefined!");
      return;
    }
    setSelectedPatient(patient);
    const pid = patient.patient_id ?? patient.id ?? patient.user_id ?? "";
    setAccidentData((prev) => ({ ...prev, patient_id: pid }));
    alert(
      `Patient selected: ${
        patient["Full Name"] ||
        patient.full_name ||
        patient.name ||
        "Unknown name"
      }`
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccidentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await API.post("/accidents", accidentData);
      setMessage("Accident record created successfully!");
      // Partial reset while keeping selected patient_id
      setAccidentData((prev) => ({
        ...prev,
        "incident at date": "",
        "incident at time": "",
        "time of collision": "",
        "Mode of traveling during accident": "",
        Visibility: "",
        "Collision with": "",
      }));
    } catch (error) {
      console.error("Error creating accident record:", error);
      setMessage("Failed to create accident record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <NurseNav />

      <h1 className="text-2xl font-bold mb-6">
        Accident Record Management System
      </h1>

      {message && (
        <div
          className={`p-4 mb-4 rounded ${
            message.includes("success")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patients Card */}
        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">Patients</h2>
          </div>

          {/* Search */}
          <div className="mb-3">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name / NIC / phone / DOB"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {loading ? (
            <p>Loading patients...</p>
          ) : (
            <div className="overflow-y-auto max-h-96">
              {filteredPatients && filteredPatients.length > 0 ? (
                filteredPatients.map((patient, index) => {
                  const pid = patient.patient_id ?? index;
                  const isSelected =
                    selectedPatient &&
                    (selectedPatient.patient_id ?? "") ===
                      (patient.patient_id ?? "");
                  return (
                    <div
                      key={pid}
                      className={`p-3 mb-2 rounded cursor-pointer ${
                        isSelected
                          ? "bg-blue-100"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                      onClick={() => handlePatientSelect(patient)}
                    >
                      <div className="font-medium">
                        {val(patient, "Full Name", "full_name") || "No Name"}
                      </div>
                      <div className="text-sm text-gray-600">
                        {val(patient, "Contact Number", "contact_number") ||
                          "No Contact"}{" "}
                        •{" "}
                        {val(patient, "Date of Birth", "date_of_birth") ||
                          "No DOB"}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500">No patients found</p>
              )}
            </div>
          )}
        </div>

        {/* Accident Record Form */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">
            {selectedPatient
              ? `Create Accident Record for ${
                  val(selectedPatient, "Full Name", "full_name") || "Patient"
                }`
              : "Select a patient to create accident record"}
          </h2>

          {selectedPatient && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Incident Date
                  </label>
                  <input
                    type="date"
                    name="incident at date"
                    value={accidentData["incident at date"]}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Incident Time
                  </label>
                  <input
                    type="time"
                    name="incident at time"
                    value={accidentData["incident at time"]}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Time of Collision
                  </label>
                  <input
                    type="time"
                    name="time of collision"
                    value={accidentData["time of collision"]}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mode of Travel
                  </label>
                  <select
                    name="Mode of traveling during accident"
                    value={accidentData["Mode of traveling during accident"]}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="">Select mode</option>
                    <option value="bus">Bus</option>
                    <option value="car">Car</option>
                    <option value="motorcycle">Motorcycle</option>
                    <option value="bicycle">Bicycle</option>
                    <option value="pedestrian">Pedestrian</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Visibility
                  </label>
                  <select
                    name="Visibility"
                    value={accidentData["Visibility"]}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="">Select visibility</option>
                    <option value="good">Good</option>
                    <option value="moderate">Moderate</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Collision With
                  </label>
                  <select
                    name="Collision with"
                    value={accidentData["Collision with"]}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="">Select collision type</option>
                    <option value="car">Car</option>
                    <option value="lorry">Lorry</option>
                    <option value="bus">Bus</option>
                    <option value="motorcycle">Motorcycle</option>
                    <option value="bicycle">Bicycle</option>
                    <option value="pedestrian">Pedestrian</option>
                    <option value="object">Object</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Collision Force From
                  </label>
                  <input
                    type="text"
                    name="Collision force from"
                    value={accidentData["Collision force from"]}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Road Condition
                  </label>
                  <select
                    name="Road Condition"
                    value={accidentData["Road Condition"]}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="">Select road condition</option>
                    <option value="dry">Dry</option>
                    <option value="wet">Wet</option>
                    <option value="icy">Icy</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Road Type
                  </label>
                  <input
                    type="text"
                    name="Road Type"
                    value={accidentData["Road Type"]}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category of Road
                  </label>
                  <input
                    type="text"
                    name="Category of Road"
                    value={accidentData["Category of Road"]}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Road Signals Exist
                  </label>
                  <select
                    name="Road signals exist"
                    value={accidentData["Road signals exist"]}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Approximate Speed (km/h)
                  </label>
                  <input
                    type="number"
                    name="Approximate speed"
                    value={accidentData["Approximate speed"]}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Alcohol Consumption
                  </label>
                  <select
                    name="Alcohol Consumption"
                    value={accidentData["Alcohol Consumption"]}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Time Between Alcohol and Accident
                  </label>
                  <input
                    type="text"
                    name="Time between alcohol consumption and accident"
                    value={
                      accidentData[
                        "Time between alcohol consumption and accident"
                      ]
                    }
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Illicit Drugs
                  </label>
                  <select
                    name="Illicit Drugs"
                    value={accidentData["Illicit Drugs"]}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Vehicle Type
                  </label>
                  <input
                    type="text"
                    name="Vehicle type"
                    value={accidentData["Vehicle type"]}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Helmet Worn
                  </label>
                  <select
                    name="Helmet Worn"
                    value={accidentData["Helmet Worn"]}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Engine Capacity (cc)
                  </label>
                  <input
                    type="number"
                    name="Engine Capacity"
                    value={accidentData["Engine Capacity"]}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mode of Transport to Hospital
                  </label>
                  <input
                    type="text"
                    name="Mode of transport to hospital"
                    value={accidentData["Mode of transport to hospital"]}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Time Taken to Reach Hospital (minutes)
                  </label>
                  <input
                    type="number"
                    name="Time taken to reach hospital"
                    value={accidentData["Time taken to reach hospital"]}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Bystander Expenditure Per Day (LKR)
                  </label>
                  <input
                    type="number"
                    name="Bystander expenditure per day"
                    value={accidentData["Bystander expenditure per day"]}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Family Monthly Income Before Accident (LKR)
                  </label>
                  <input
                    type="number"
                    name="Family monthly income before accident"
                    value={
                      accidentData["Family monthly income before accident"]
                    }
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Family Monthly Income After Accident (LKR)
                  </label>
                  <input
                    type="number"
                    name="Family monthly income after accident"
                    value={accidentData["Family monthly income after accident"]}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Family Current Status
                  </label>
                  <input
                    type="text"
                    name="Family current status"
                    value={accidentData["Family current status"]}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Any Insurance Claim Type
                  </label>
                  <input
                    type="text"
                    name="Any insurance claim type"
                    value={accidentData["Any insurance claim type"]}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Dress Name
                  </label>
                  <input
                    type="text"
                    name="Dress name"
                    value={accidentData["Dress name"]}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Vehicle Insured
                  </label>
                  <select
                    name="vehicle insured"
                    value={accidentData["vehicle insured"]}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Vehicle Insured Type
                  </label>
                  <input
                    type="text"
                    name="vehicle insured type"
                    value={accidentData["vehicle insured type"]}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Passenger Type
                  </label>
                  <input
                    type="text"
                    name="Passenger type"
                    value={accidentData["Passenger type"]}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    First Aid Given at Scene
                  </label>
                  <select
                    name="First aid given at seen"
                    value={accidentData["First aid given at seen"]}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="">Select</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
              >
                {loading ? "Creating..." : "Create Accident Record"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccidentRecordSystem;
