import { useState, useEffect } from "react";
import AdminNav from "../../navbars/AdminNav";
import API from "../../utils/api";

const AddStaff = ({ setIsAuthenticated, setRole }) => {
  const [role, setRoleType] = useState("nurse"); // default role
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch staff based on selected role
  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      setMessage("");
      try {
        const res = await API.get(`/${role}/`);
        setStaffList(res.data || []);
        console.log("Fetched staff:", res.data);
      } catch (err) {
        console.error("Error fetching staff:", err);
        setMessage("Failed to fetch staff list.");
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, [role]);

  // Handle assignment
  const handleAssign = async (e) => {
    console.log("Selected Staff:", selectedStaff);
    e.preventDefault();
    if (!selectedStaff) {
      setMessage("⚠️ Please select a staff member.");
      return;
    }

    setAssigning(true);
    setMessage("");
    try {
      const endpoint =
        role === "doctor" ? "/hospital/assign-doctor" : "/hospital/assign-nurse";

      const res = await API.post(endpoint, {
        user_id: selectedStaff,
      });

      setMessage(res.data.message || "✅ Assigned successfully!");
      setSelectedStaff("");
      setSearch("");
    } catch (err) {
      setMessage(err.response?.data?.detail || "❌ Failed to assign.");
    } finally {
      setAssigning(false);
    }
  };

  // Filter staff by search input
  const filteredStaff = staffList.filter((s) =>
    s?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav setIsAuthenticated={setIsAuthenticated} setRole={setRole} />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-primary mb-4">
          Add Nurse/Doctor to Hospital
        </h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleAssign} className="space-y-4">
            {/* Role Selector */}
            <select
              value={role}
              onChange={(e) => setRoleType(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="nurse">Nurse</option>
              <option value="doctor">Doctor</option>
            </select>

           

            {/* Dropdown with search results */}
            <select
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              disabled={loading}
            >
              <option value="">
                {loading ? "Loading..." : `Select ${role}`}
              </option>

              {!loading && filteredStaff.length === 0 && (
                <option disabled>No {role}s found</option>
              )}

              {!loading &&
                filteredStaff.map((staff) => (
                  <option key={staff.user_id} value={staff.user_id}>
                    {staff.name} ({staff.email})
                  </option>
                ))}
            </select>

            {/* Submit Button */}
            <button
              type="submit"
              className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-600 transition"
              disabled={assigning}
            >
              {assigning ? "Assigning..." : `Assign ${role}`}
            </button>
          </form>

          {/* Message */}
          {message && (
            <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddStaff;
