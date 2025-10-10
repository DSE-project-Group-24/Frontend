// src/pages/nurse/RecordPatientData.jsx
import React, { useMemo, useState } from "react";
import NurseNav from "../../navbars/NurseNav";
import Footer from "../../components/Footer";
import API from "../../utils/api";

// --- Categories (unchanged) ---
const EDUCATION = [
  "None",
  "Grade 5 Scholarship",
  "OL or AL",
  "Undergraduate",
  "Postgraduate",
  "Unknown",
];
const ETHNICITY = ["Tamil", "Sinhalese", "Moor", "Other"];
const GENDER = ["Male", "Female", "Other"]; // ≤ 3 → chips (checkbox look, single select)
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

// ---------- UI atoms ----------
const Card = ({ title, children }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    {title && (
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-3 border-b border-gray-100">
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
      </div>
    )}
    <div className="p-5">{children}</div>
  </div>
);

const Field = ({ label, required, hint, children }) => (
  <label className="flex flex-col gap-1">
    <span className="text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </span>
    {children}
    {hint && <span className="text-xs text-gray-500">{hint}</span>}
  </label>
);

// Single-select “checkbox chips” (enforced single value)
function ChoiceChips({ name, value, options, onChange, required }) {
  const toggle = (opt) => {
    // single-select: clicking the same option clears it; otherwise sets it
    onChange({ target: { name, value: value === opt ? "" : opt } });
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const checked = value === opt;
        return (
          <button
            type="button"
            key={opt}
            onClick={() => toggle(opt)}
            aria-pressed={checked}
            className={
              "px-3 py-1.5 rounded-full border text-sm transition " +
              (checked
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50")
            }
          >
            {/* visually looks like a chip; keep an input for a11y if needed */}
            {opt}
          </button>
        );
      })}
      {/* hidden input to satisfy required validation if needed */}
      {required && (
        <input
          tabIndex={-1}
          className="sr-only"
          name={name}
          value={value}
          onChange={() => {}}
          required
        />
      )}
    </div>
  );
}

export default function RecordPatientData({ hospitalId: hospitalIdProp }) {
  const today = useMemo(() => {
    const d = new Date();
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
  }, []);

  const [hospitalId] = useState(() => getHospitalId(hospitalIdProp));
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  // Only Full Name + Gender are required
  const [form, setForm] = useState({
    full_name: "",
    gender: "",
    // Optional:
    contact_number: "",
    registered_date: today,
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

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const resetForNext = () => {
    setForm((f) => ({
      ...f,
      full_name: "",
      gender: "",
      contact_number: "",
      registered_date: today,
      date_of_birth: "",
      ethnicity: "",
      address_street: "",
      education_qualification: "",
      occupation: "",
      family_monthly_income: "",
      nic: "",
      // keep blood_group default “Unknown”
      blood_group: "Unknown",
      life_style: "",
    }));
  };

  const buildPayload = () => ({
    "Full Name": form.full_name.trim(),
    Gender: form.gender,
    "Contact Number": form.contact_number || null,
    "Registered Date": form.registered_date || null,
    "Date of Birth": form.date_of_birth || null,
    Ethnicity: form.ethnicity || null,
    "Address Street": form.address_street || null,
    "Life Style": form.life_style || null,
    "Education Qualification": form.education_qualification || null,
    Occupation: form.occupation || null,
    "Family Monthly Income": form.family_monthly_income || null,
    "Blood Group": form.blood_group || null,
    NIC: form.nic || null,
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
    // if we just set an error, it’ll remain visible; still reset for speed if success:
    // we can check last message via callback, but keeping it simple
    setTimeout(() => {
      if (message.type !== "error") resetForNext();
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <NurseNav />
      <div className="max-w-4xl mx-auto mt-8">
        {/* Page header */}
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-gray-800">
            Patient — Quick Intake
          </h2>
          <p className="text-sm text-gray-600">
            Only <span className="text-red-500 font-medium">Full Name</span> and{" "}
            <span className="text-red-500 font-medium">Gender</span> are
            required. Everything else can be filled later.
          </p>
        </div>

        {/* Flash messages */}
        {message.text && (
          <div
            className={`mb-4 p-3 rounded-md border ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Essentials */}
          <Card title="Essentials">
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
                {/* Chips instead of dropdown (single-select) */}
                <ChoiceChips
                  name="gender"
                  value={form.gender}
                  options={GENDER}
                  onChange={onChange}
                  required
                />
              </Field>

              <Field label="Contact Number" hint="07XXXXXXXX or +947XXXXXXXX">
                <input
                  name="contact_number"
                  value={form.contact_number}
                  onChange={onChange}
                  className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  inputMode="tel"
                  placeholder="07XXXXXXXX"
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
          </Card>

          {/* Demographics */}
          <Card title="Demographics">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            </div>
          </Card>

          {/* Contact & Identity */}
          <Card title="Contact & Identity">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="NIC" hint="Old or new format">
                <input
                  name="nic"
                  value={form.nic}
                  onChange={onChange}
                  className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  placeholder="e.g., 941234567V / 200045600123"
                />
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
            </div>
          </Card>

          {/* Socioeconomic */}
          <Card title="Socioeconomic">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
          </Card>

          {/* Actions */}
          <div className="flex flex-col md:flex-row gap-3">
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
            <div className="md:ml-auto text-sm text-gray-500 self-center">
              {hospitalId ? `Hospital: ${hospitalId}` : "No hospital selected"}
            </div>
          </div>
        </form>
      </div>
      
      <Footer />
    </div>
  );
}
