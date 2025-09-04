import React from 'react';
import AdminNav from '../../navbars/AdminNav';

const AddStaff = ({ setIsAuthenticated, setRole }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav setIsAuthenticated={setIsAuthenticated} setRole={setRole} />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-primary mb-4">Add Nurse/Doctor to Hospital</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form className="space-y-4">
            <input 
              type="text" 
              placeholder="Staff name" 
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent">
              <option>Nurse</option>
              <option>Doctor</option>
            </select>
            <button 
              className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-600 transition"
            >
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStaff;