// src/pages/nurse/RecordPatientData.jsx
import React, { useMemo, useState } from "react";
import NurseNav from "../../navbars/NurseNav";
import API from "../../utils/api";

// --- Dropdown sources (exact categories you specified) ---
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

function getHospitalId(propHospitalId) {
  if (propHospitalId) return propHospitalId;
  const stored = window?.localStorage?.getItem("hospital_id");
  return stored || null;
}

const Field = ({ label, required, children }) => (
  <label className="flex flex-col gap-1">
    <span className="text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </span>
    {children}
  </label>
);

const Section = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-100">
      <h3 className="text-base font-semibold text-gray-800">{title}</h3>
    </div>
    <div className="p-4">{children}</div>
  </div>
);

export default function RecordPatientData({ hospitalId: hospitalIdProp }) {
  const today = useMemo(() => {
    const d = new Date();
    // YYYY-MM-DD
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
  }, []);

  const [hospitalId] = useState(() => getHospitalId(hospitalIdProp));
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  // Only the bare minimum is required by your spec:
  const [form, setForm] = useState({
    full_name: "",
    gender: "",
    // Optional / quick-fillable:
    date_of_birth: "",
    ethnicity: "",
    address_street: "",
    life_style: "",
    education_qualification: "",
    occupation: "",
    family_monthly_income: "",
    blood_group: "Unknown",
    nic: "",
    registered_date: today, // default to today (editable)
    contact_number: "",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const resetForNext = () => {
    setForm((f) => ({
      ...f,
      full_name: "",
      gender: "",
      // do not reset dropdown defaults except essentials
      date_of_birth: "",
      address_street: "",
      nic: "",
      contact_number: "",
      registered_date: today,
    }));
  };

  const buildPayload = () => ({
    // Pydantic aliases expected by your backend (see patient.py)
    "Full Name": form.full_name.trim(),
    Gender: form.gender,
    "Date of Birth": form.date_of_birth || null,
    Ethnicity: form.ethnicity || null,
    "Address Street": form.address_street || null,
    "Life Style": form.life_style || null,
    "Education Qualification": form.education_qualification || null,
    Occupation: form.occupation || null,
    "Family Monthly Income": form.family_monthly_income || null,
    "Blood Group": form.blood_group || null,
    NIC: form.nic || null,
    "Registered Date": form.registered_date || null,
    "Contact Number": form.contact_number || null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!form.full_name.trim() || !form.gender) {
      setMessage({ type: "error", text: "Full Name and Gender are required." });
      return;
    }

    try {
      setLoading(true);
      const payload = buildPayload();
      await API.post("/patients/", payload);
      setMessage({ type: "success", text: "Patient created and linked ✅" });
    } catch (err) {
      setMessage({
        type: "error",
        text: err?.response?.data?.detail || "Failed to create patient ❌",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndNew = async (e) => {
    await handleSubmit(e);
    if (message.type !== "error") resetForNext();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <NurseNav />
      <div className="max-w-3xl mx-auto mt-8 bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-700 mb-2">
          Patient — Quick Intake
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Only <span className="text-red-500">Full Name</span> and{" "}
          <span className="text-red-500">Gender</span> are required. Everything
          else can be filled later.
        </p>

        {message.text && (
          <div
            className={`mb-4 p-3 rounded-md text-white ${
              message.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Section title="Essentials">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Full Name" required>
                <input
                  name="full_name"
                  value={form.full_name}
                  onChange={onChange}
                  placeholder="e.g., M.S.I. Weerawansa"
                  className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  autoFocus
                  required
                />
              </Field>

              <Field label="Gender" required>
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
              </Field>

              <Field label="Contact Number">
                <input
                  name="contact_number"
                  value={form.contact_number}
                  onChange={onChange}
                  placeholder="07XXXXXXXX or +947XXXXXXXX"
                  className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  inputMode="tel"
                />
              </Field>

              <Field label="Registered Date">
                <input
                  type="date"
                  name="registered_date"
                  value={form.registered_date}
                  onChange={onChange}
                  className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                />
              </Field>
            </div>
          </Section>

          <details className="group rounded-xl border border-gray-100 open:shadow-sm">
            <summary className="px-4 py-3 cursor-pointer list-none flex items-center justify-between">
              <span className="text-base font-semibold text-gray-800">
                More details (optional)
              </span>
              <span className="text-sm text-gray-500">
                {/** toggled text not strictly needed **/}
              </span>
            </summary>

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Date of Birth">
                <input
                  type="date"
                  name="date_of_birth"
                  value={form.date_of_birth}
                  onChange={onChange}
                  className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                />
              </Field>

              <Field label="Ethnicity">
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
              </Field>

              <Field label="Address — Street">
                <input
                  name="address_street"
                  value={form.address_street}
                  onChange={onChange}
                  placeholder="e.g., 123/A, Lake Rd, Moratuwa"
                  className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                />
              </Field>

              <Field label="Life Style">
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
              </Field>

              <Field label="Education Qualification">
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
              </Field>

              <Field label="Occupation">
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
              </Field>

              <Field label="Family Monthly Income">
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
              </Field>

              <Field label="Blood Group">
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
              </Field>

              <Field label="NIC">
                <input
                  name="nic"
                  value={form.nic}
                  onChange={onChange}
                  placeholder="Old or new format"
                  className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                />
              </Field>
            </div>
          </details>

          <div className="flex flex-col md:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={handleSaveAndNew}
              disabled={loading}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save & New"}
            </button>
            <button
              type="button"
              onClick={() => resetForNext()}
              className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
            >
              Reset
            </button>
            <div className="ml-auto text-sm text-gray-500 self-center">
              {hospitalId ? `Hospital: ${hospitalId}` : "No hospital selected"}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
