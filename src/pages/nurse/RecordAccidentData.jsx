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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Accident Record Data:', formData);
    // Add backend API call here to save data to the Accident Record table
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NurseNav setIsAuthenticated={setIsAuthenticated} setRole={setRole} />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-primary mb-4">Record Accident Data</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700">Patient</label>
              <select
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                required
              >
                <option value="" disabled>Select patient</option>
                <option value="1">Patient 1</option>
                <option value="2">Patient 2</option>
                <option value="3">Patient 3</option>
                {/* Replace with actual patient data from backend */}
              </select>
            </div>

            <div>
              <label className="block text-gray-700">Incident Date</label>
              <input
                type="date"
                name="incidentAtDate"
                value={formData.incidentAtDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700">Incident Time</label>
              <input
                type="time"
                name="incidentAtTime"
                value={formData.incidentAtTime}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700">Time of Collision</label>
              <input
                type="time"
                name="timeOfCollision"
                value={formData.timeOfCollision}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700">Mode of Traveling</label>
              <select
                name="modeOfTraveling"
                value={formData.modeOfTraveling}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                required
              >
                <option value="" disabled>Select mode</option>
                <option value="Car">Car</option>
                <option value="Motorcycle">Motorcycle</option>
                <option value="Bicycle">Bicycle</option>
                <option value="Pedestrian">Pedestrian</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700">Visibility</label>
              <select
                name="visibility"
                value={formData.visibility}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                required
              >
                <option value="" disabled>Select visibility</option>
                <option value="Clear">Clear</option>
                <option value="Foggy">Foggy</option>
                <option value="Rainy">Rainy</option>
                <option value="Dark">Dark</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700">Collision Force From</label>
              <select
                name="collisionForceFrom"
                value={formData.collisionForceFrom}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                required
              >
                <option value="" disabled>Select direction</option>
                <option value="Front">Front</option>
                <option value="Rear">Rear</option>
                <option value="Side">Side</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700">Collision With</label>
              <select
                name="collisionWith"
                value={formData.collisionWith}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                required
              >
                <option value="" disabled>Select object</option>
                <option value="Vehicle">Vehicle</option>
                <option value="Pedestrian">Pedestrian</option>
                <option value="Object">Object</option>
                <option value="None">None</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700">Road Condition</label>
              <select
                name="roadCondition"
                value={formData.roadCondition}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                required
              >
                <option value="" disabled>Select condition</option>
                <option value="Dry">Dry</option>
                <option value="Wet">Wet</option>
                <option value="Icy">Icy</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700">Road Type</label>
              <select
                name="roadType"
                value={formData.roadType}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                required
              >
                <option value="" disabled>Select road type</option>
                <option value="Highway">Highway</option>
                <option value="City Street">City Street</option>
                <option value="Rural Road">Rural Road</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700">Category of Road</label>
              <select
                name="categoryOfRoad"
                value={formData.categoryOfRoad}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                required
              >
                <option value="" disabled>Select category</option>
                <option value="Main Road">Main Road</option>
                <option value="Secondary Road">Secondary Road</option>
                <option value="Residential">Residential</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700">Road Signals Exist</label>
              <select
                name="roadSignalsExist"
                value={formData.roadSignalsExist}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                required
              >
                <option value="" disabled>Select option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700">Approximate Speed (km/h)</label>
              <input
                type="number"
                name="approximateSpeed"
                value={formData.approximateSpeed}
                onChange={handleChange}
                placeholder="Enter speed"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700">Alcohol Consumption</label>
              <input
                type="checkbox"
                name="alcoholConsumption"
                checked={formData.alcoholConsumption}
                onChange={handleChange}
                className="h-5 w-5 text-accent focus:ring-accent"
              />
            </div>

            {formData.alcoholConsumption && (
              <div>
                <label className="block text-gray-700">Time Between Alcohol Consumption and Accident (hours)</label>
                <input
                  type="number"
                  name="timeBetweenAlcoholAndAccident"
                  value={formData.timeBetweenAlcoholAndAccident}
                  onChange={handleChange}
                  placeholder="Enter hours"
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            )}

            <div>
              <label className="block text-gray-700">Illicit Drugs</label>
              <input
                type="text"
                name="illicitDrugs"
                value={formData.illicitDrugs}
                onChange={handleChange}
                placeholder="Enter drugs used, if any"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label className="block text-gray-700">Vehicle Type</label>
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                required
              >
                <option value="" disabled>Select vehicle type</option>
                <option value="Car">Car</option>
                <option value="Motorcycle">Motorcycle</option>
                <option value="Truck">Truck</option>
                <option value="Bicycle">Bicycle</option>
                <option value="None">None</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700">Helmet Worn</label>
              <input
                type="checkbox"
                name="helmetWorn"
                checked={formData.helmetWorn}
                onChange={handleChange}
                className="h-5 w-5 text-accent focus:ring-accent"
              />
            </div>

            <div>
              <label className="block text-gray-700">Engine Capacity</label>
              <input
                type="text"
                name="engineCapacity"
                value={formData.engineCapacity}
                onChange={handleChange}
                placeholder="Enter engine capacity (e.g., 150cc)"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label className="block text-gray-700">Mode of Transport to Hospital</label>
              <select
                name="modeOfTransportToHospital"
                value={formData.modeOfTransportToHospital}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                required
              >
                <option value="" disabled>Select transport mode</option>
                <option value="Ambulance">Ambulance</option>
                <option value="Car">Car</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700">Time Taken to Reach Hospital (hours)</label>
              <input
                type="number"
                name="timeTakenToReachHospital"
                value={formData.timeTakenToReachHospital}
                onChange={handleChange}
                placeholder="Enter hours"
                step="0.01"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700">Bystander Expenditure Per Day</label>
              <input
                type="text"
                name="bystanderExpenditurePerDay"
                value={formData.bystanderExpenditurePerDay}
                onChange={handleChange}
                placeholder="Enter expenditure"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label className="block text-gray-700">Family Monthly Income Before Accident</label>
              <input
                type="text"
                name="familyMonthlyIncomeBefore"
                value={formData.familyMonthlyIncomeBefore}
                onChange={handleChange}
                placeholder="Enter income"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700">Family Monthly Income After Accident</label>
              <input
                type="text"
                name="familyMonthlyIncomeAfter"
                value={formData.familyMonthlyIncomeAfter}
                onChange={handleChange}
                placeholder="Enter income"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label className="block text-gray-700">Family Current Status</label>
              <input
                type="text"
                name="familyCurrentStatus"
                value={formData.familyCurrentStatus}
                onChange={handleChange}
                placeholder="Enter status"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label className="block text-gray-700">Any Insurance Claim Type</label>
              <input
                type="text"
                name="anyInsuranceClaimType"
                value={formData.anyInsuranceClaimType}
                onChange={handleChange}
                placeholder="Enter claim type"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label className="block text-gray-700">Dress Name</label>
              <input
                type="text"
                name="dressName"
                value={formData.dressName}
                onChange={handleChange}
                placeholder="Enter dress name"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label className="block text-gray-700">Vehicle Insured</label>
              <input
                type="checkbox"
                name="vehicleInsured"
                checked={formData.vehicleInsured}
                onChange={handleChange}
                className="h-5 w-5 text-accent focus:ring-accent"
              />
            </div>

            <div>
              <label className="block text-gray-700">Vehicle Insured Type</label>
              <input
                type="text"
                name="vehicleInsuredType"
                value={formData.vehicleInsuredType}
                onChange={handleChange}
                placeholder="Enter insurance type"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label className="block text-gray-700">Passenger Type</label>
              <select
                name="passengerType"
                value={formData.passengerType}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                required
              >
                <option value="" disabled>Select passenger type</option>
                <option value="Driver">Driver</option>
                <option value="Passenger">Passenger</option>
                <option value="Pedestrian">Pedestrian</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700">First Aid Given at Scene</label>
              <input
                type="checkbox"
                name="firstAidGiven"
                checked={formData.firstAidGiven}
                onChange={handleChange}
                className="h-5 w-5 text-accent focus:ring-accent"
              />
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

export default RecordAccidentData;