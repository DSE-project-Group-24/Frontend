import React, { useEffect, useMemo, useState } from "react";
import NurseNav from "../../navbars/NurseNav";
import API from "../../utils/api";

// ------------------------------
// Category sources (exact lists you provided)
// ------------------------------
const EDUCATION = [
  "None",
  "Grade 5 Scholarship",
  "OL or AL",
  "Undergraduate",
  "Postgraduate",
  "Unknown",
];
const ETHNICITY = ["Tamil", "Sinhalese", "Moor", "Other"];
const GENDER = ["Male", "Female", "Other"];
const LIFESTYLE = [
  "Living with care givers",
  "Living with children",
  "Living alone",
  "Unknown",
];
const OCCUPATION = [
  "Unemployed",
  "Semi-Skilled Worker",
  "Skilled Worker",
  "Highly Skilled Worker",
  "Professional",
  "Retired pensioner",
  "Other",
  "Unknown",
];
const FAMILY_INCOME = [
  "Less than 15000",
  "15000-30000",
  "30000-45000",
  "45000-60000",
  "More than 60000",
  "Unknown",
];
const BLOOD_GROUP = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
  "Unknown",
];

// Helper to read either alias keys ("Full Name") or snake_case ("full_name")
const pick = (row, ...keys) => {
  for (const k of keys)
    if (row && row[k] !== undefined && row[k] !== null) return row[k];
  return "";
};

// ------------------------------
// Edit Drawer Component (lightweight, no UI lib)
// ------------------------------
function EditDrawer({ open, onClose, patient, onSaved }) {
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  // Prefill with safe fallbacks
  const [form, setForm] = useState({
    full_name: "",
    gender: "",
    contact_number: "",
    registered_date: "",
    date_of_birth: "",
    ethnicity: "",
    address_street: "",
    life_style: "",
    education_qualification: "",
    occupation: "",
    family_monthly_income: "",
    blood_group: "Unknown",
    nic: "",
  });

  useEffect(() => {
    if (!patient) return;
    const val = (k1, k2) => pick(patient, k1, k2) || "";
    setForm({
      full_name: val("Full Name", "full_name"),
      gender: val("Gender", "gender"),
      contact_number: val("Contact Number", "contact_number"),
      registered_date: val("Registered Date", "registered_date"),
      date_of_birth: val("Date of Birth", "date_of_birth"),
      ethnicity: val("Ethnicity", "ethnicity"),
      address_street: val("Address Street", "address_street"),
      life_style: val("Life Style", "life_style"),
      education_qualification: val(
        "Education Qualification",
        "education_qualification"
      ),
      occupation: val("Occupation", "occupation"),
      family_monthly_income: val(
        "Family Monthly Income",
        "family_monthly_income"
      ),
      blood_group: val("Blood Group", "blood_group") || "Unknown",
      nic: val("NIC", "nic"),
    });
    setMsg("");
  }, [patient]);

  if (!open) return null;

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const buildPayload = () => ({
    // Only send fields that changed would be ideal, but backend accepts partials safely
    "Full Name": form.full_name || undefined,
    Gender: form.gender || undefined,
    "Contact Number": form.contact_number || undefined,
    "Registered Date": form.registered_date || undefined,
    "Date of Birth": form.date_of_birth || undefined,
    Ethnicity: form.ethnicity || undefined,
    "Address Street": form.address_street || undefined,
    "Life Style": form.life_style || undefined,
    "Education Qualification": form.education_qualification || undefined,
    Occupation: form.occupation || undefined,
    "Family Monthly Income": form.family_monthly_income || undefined,
    "Blood Group": form.blood_group || undefined,
    NIC: form.nic || undefined,
  });

  const onSave = async () => {
    if (!patient?.patient_id) {
      setMsg("Missing patient_id");
      return;
    }
    if (!form.full_name.trim() || !form.gender) {
      setMsg("Full Name and Gender are required");
      return;
    }

    try {
      setSaving(true);
      setMsg("");
      const payload = buildPayload();
      const res = await API.patch(`/patients/${patient.patient_id}`, payload);
      onSaved?.(res.data);
      setMsg("Saved ✅");
      // Close after a short delay for UX
      setTimeout(() => onClose?.(), 300);
    } catch (err) {
      setMsg(err?.response?.data?.detail || "Failed to save ❌");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      {/* Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-xl p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Edit Patient</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {msg && (
          <div
            className={`mb-4 p-2 text-sm rounded ${
              msg.includes("✅")
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {msg}
          </div>
        )}

        {/* Essentials */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">
                Full Name <span className="text-red-500">*</span>
              </span>
              <input
                name="full_name"
                value={form.full_name}
                onChange={onChange}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                placeholder="Full name"
                required
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">
                Gender <span className="text-red-500">*</span>
              </span>
              <select
                name="gender"
                value={form.gender}
                onChange={onChange}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="">Select Gender</option>
                {GENDER.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Contact Number</span>
              <input
                name="contact_number"
                value={form.contact_number}
                onChange={onChange}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                placeholder="07XXXXXXXX or +947XXXXXXXX"
                inputMode="tel"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Registered Date</span>
              <input
                type="date"
                name="registered_date"
                value={form.registered_date || ""}
                onChange={onChange}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
              />
            </label>
          </div>

          {/* Optional details */}
          <details className="group rounded-xl border border-gray-100 open:shadow-sm">
            <summary className="px-4 py-2 cursor-pointer list-none text-sm font-semibold">
              More details (optional)
            </summary>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Date of Birth</span>
                <input
                  type="date"
                  name="date_of_birth"
                  value={form.date_of_birth || ""}
                  onChange={onChange}
                  className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Ethnicity</span>
                <select
                  name="ethnicity"
                  value={form.ethnicity}
                  onChange={onChange}
                  className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select Ethnicity</option>
                  {ETHNICITY.map((e) => (
                    <option key={e} value={e}>
                      {e}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1 md:col-span-2">
                <span className="text-sm font-medium">Address — Street</span>
                <input
                  name="address_street"
                  value={form.address_street}
                  onChange={onChange}
                  className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  placeholder="e.g., 123/A, Lake Rd, Moratuwa"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Life Style</span>
                <select
                  name="life_style"
                  value={form.life_style}
                  onChange={onChange}
                  className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select Life Style</option>
                  {LIFESTYLE.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">
                  Education Qualification
                </span>
                <select
                  name="education_qualification"
                  value={form.education_qualification}
                  onChange={onChange}
                  className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select Education</option>
                  {EDUCATION.map((q) => (
                    <option key={q} value={q}>
                      {q}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Occupation</span>
                <select
                  name="occupation"
                  value={form.occupation}
                  onChange={onChange}
                  className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select Occupation</option>
                  {OCCUPATION.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">
                  Family Monthly Income
                </span>
                <select
                  name="family_monthly_income"
                  value={form.family_monthly_income}
                  onChange={onChange}
                  className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select Income Range</option>
                  {FAMILY_INCOME.map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Blood Group</span>
                <select
                  name="blood_group"
                  value={form.blood_group}
                  onChange={onChange}
                  className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                >
                  {BLOOD_GROUP.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">NIC</span>
                <input
                  name="nic"
                  value={form.nic}
                  onChange={onChange}
                  className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  placeholder="Old or new format"
                />
              </label>
            </div>
          </details>

          <div className="flex gap-2 pt-2">
            <button
              onClick={onSave}
              disabled={saving}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={onClose}
              className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ------------------------------
// Main Dashboard (simplified per request)
// ------------------------------
export default function NurseDashboard() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [patients, setPatients] = useState([]);
  const [q, setQ] = useState("");

  const [editing, setEditing] = useState({ open: false, patient: null });

  useEffect(() => {
    let ok = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const pat = await API.get("/patients/");
        if (!ok) return;
        setPatients(pat.data || []);
      } catch (e) {
        setErr(e?.response?.data?.detail || "Failed to load patients");
      } finally {
        if (ok) setLoading(false);
      }
    })();
    return () => {
      ok = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return patients;
    return patients.filter((p) => {
      const name = (pick(p, "Full Name", "full_name") || "").toLowerCase();
      const nic = (pick(p, "NIC", "nic") || "").toLowerCase();
      const phone = (
        pick(p, "Contact Number", "contact_number") || ""
      ).toLowerCase();
      return (
        name.includes(needle) || nic.includes(needle) || phone.includes(needle)
      );
    });
  }, [q, patients]);

  const onRowSaved = (updated) => {
    // Replace the patient in local state
    setPatients((arr) =>
      arr.map((p) => (p.patient_id === updated.patient_id ? updated : p))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <NurseNav />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-gray-800">Nurse Dashboard</h1>
          <p className="text-sm text-gray-600">
            Manage and edit patient records
          </p>
        </div>

        {err && (
          <div className="mb-4 p-3 rounded-md bg-red-50 text-red-700 border border-red-100">
            {err}
          </div>
        )}

        {/* Search & Table (Quick Actions / Recent sections removed as requested) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-3 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Patients</h3>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name / NIC / phone"
              className="w-64 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="p-5 overflow-x-auto">
            {loading ? (
              <div className="text-gray-500 text-sm">Loading…</div>
            ) : filtered.length === 0 ? (
              <div className="text-gray-500 text-sm">No patients found</div>
            ) : (
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">Gender</th>
                    <th className="py-2 pr-4">Phone</th>
                    <th className="py-2 pr-4">DOB</th>
                    <th className="py-2 pr-4">Blood</th>
                    <th className="py-2 pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p, i) => (
                    <tr key={p.patient_id || i} className="border-t">
                      <td className="py-2 pr-4">
                        {pick(p, "Full Name", "full_name")}
                      </td>
                      <td className="py-2 pr-4">
                        {pick(p, "Gender", "gender") || "—"}
                      </td>
                      <td className="py-2 pr-4">
                        {pick(p, "Contact Number", "contact_number") || "—"}
                      </td>
                      <td className="py-2 pr-4">
                        {pick(p, "Date of Birth", "date_of_birth") || "—"}
                      </td>
                      <td className="py-2 pr-4">
                        {pick(p, "Blood Group", "blood_group") || "—"}
                      </td>
                      <td className="py-2 pr-4">
                        <button
                          className="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                          onClick={() => setEditing({ open: true, patient: p })}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <EditDrawer
        open={editing.open}
        patient={editing.patient}
        onClose={() => setEditing({ open: false, patient: null })}
        onSaved={onRowSaved}
      />
    </div>
  );
}
