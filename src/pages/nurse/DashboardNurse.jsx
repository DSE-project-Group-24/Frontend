import React, { useEffect, useMemo, useRef, useState } from "react";
import NurseNav from "../../navbars/NurseNav";
import API from "../../utils/api";
import Footer from "../../components/Footer";
import { t } from "../../utils/translations";

// --- Category options ---
const EDUCATION = [
  t("none") || "None",
  t("grade5Scholarship") || "Grade 5 Scholarship",
  t("olOrAl") || "OL or AL",
  t("undergraduate") || "Undergraduate",
  t("postgraduate") || "Postgraduate",
  t("unknown") || "Unknown",
];
const ETHNICITY = [
  t("tamil") || "Tamil",
  t("sinhalese") || "Sinhalese",
  t("moor") || "Moor",
  t("other") || "Other",
];
const GENDER = [
  t("male") || "Male",
  t("female") || "Female",
  t("other") || "Other",
];
const LIFESTYLE = [
  t("livingWithCareGivers") || "Living with care givers",
  t("livingWithChildren") || "Living with children",
  t("livingAlone") || "Living alone",
  t("unknown") || "Unknown",
];
const OCCUPATION = [
  t("unemployed") || "Unemployed",
  t("semiSkilledWorker") || "Semi-Skilled Worker",
  t("skilledWorker") || "Skilled Worker",
  t("highlySkilledWorker") || "Highly Skilled Worker",
  t("professional") || "Professional",
  t("retiredPensioner") || "Retired pensioner",
  t("other") || "Other",
  t("unknown") || "Unknown",
];
const FAMILY_INCOME = [
  t("lessThan15000") || "Less than 15000",
  "15000-30000",
  "30000-45000",
  "45000-60000",
  t("moreThan60000") || "More than 60000",
  t("unknown") || "Unknown",
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
  t("unknown") || "Unknown",
];

const pick = (row, ...keys) => {
  for (const k of keys) {
    if (row && row[k] !== undefined && row[k] !== null) return row[k];
  }
  return "";
};

function useDebouncedValue(value, delay = 250) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

function SortIcon({ dir }) {
  return (
    <span className="inline-block w-3 text-gray-400">
      {dir === "asc" ? "▲" : dir === "desc" ? "▼" : ""}
    </span>
  );
}

function EditDrawer({ open, onClose, patient, onSaved }) {
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const firstInputRef = useRef(null);

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
    setTimeout(() => firstInputRef.current?.focus(), 50);
  }, [patient]);

  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    if (open) window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open) return null;

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const buildPayload = () => ({
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
      const res = await API.patch(
        `/patients/${patient.patient_id}`,
        buildPayload()
      );
      onSaved?.(res.data);
      setMsg(t("patientSaved"));
      setTimeout(() => onClose?.(), 300);
    } catch (err) {
      setMsg(err?.response?.data?.detail || t("errorSavingPatient"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50" aria-modal="true" role="dialog">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-xl p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {t("editPatient")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
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

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">
                {t("fullName")} <span className="text-red-500">*</span>
              </span>
              <input
                ref={firstInputRef}
                name="full_name"
                value={form.full_name}
                onChange={onChange}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                placeholder={t("fullName")}
                required
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">
                {t("gender")} <span className="text-red-500">*</span>
              </span>
              <select
                name="gender"
                value={form.gender}
                onChange={onChange}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="">{t("selectGender")}</option>
                {GENDER.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">{t("contactNumber")}</span>
              <input
                name="contact_number"
                value={form.contact_number}
                onChange={onChange}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                placeholder={t("phoneExample")}
                inputMode="tel"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">{t("registeredDate")}</span>
              <input
                type="date"
                name="registered_date"
                value={form.registered_date || ""}
                onChange={onChange}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
              />
            </label>
          </div>

          <details className="group rounded-xl border border-gray-100 open:shadow-sm">
            <summary className="px-4 py-2 cursor-pointer list-none text-sm font-semibold">
              {t("moreDetailsOptional")}
            </summary>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">{t("dateOfBirth")}</span>
                <input
                  type="date"
                  name="date_of_birth"
                  value={form.date_of_birth || ""}
                  onChange={onChange}
                  className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">{t("ethnicity")}</span>
                <select
                  name="ethnicity"
                  value={form.ethnicity}
                  onChange={onChange}
                  className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">{t("selectEthnicityOption")}</option>
                  {ETHNICITY.map((e) => (
                    <option key={e} value={e}>
                      {e}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 md:col-span-2">
                <span className="text-sm font-medium">
                  {t("addressStreet")}
                </span>
                <input
                  name="address_street"
                  value={form.address_street}
                  onChange={onChange}
                  className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  placeholder={t("addressExample")}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">{t("lifeStyle")}</span>
                <select
                  name="life_style"
                  value={form.life_style}
                  onChange={onChange}
                  className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">{t("selectLifeStyle")}</option>
                  {LIFESTYLE.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">
                  {t("educationQualification")}
                </span>
                <select
                  name="education_qualification"
                  value={form.education_qualification}
                  onChange={onChange}
                  className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">{t("selectEducation")}</option>
                  {EDUCATION.map((q) => (
                    <option key={q} value={q}>
                      {q}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">{t("occupation")}</span>
                <select
                  name="occupation"
                  value={form.occupation}
                  onChange={onChange}
                  className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">{t("selectOccupation")}</option>
                  {OCCUPATION.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">
                  {t("familyMonthlyIncome")}
                </span>
                <select
                  name="family_monthly_income"
                  value={form.family_monthly_income}
                  onChange={onChange}
                  className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">{t("selectIncomeRange")}</option>
                  {FAMILY_INCOME.map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">{t("bloodGroup")}</span>
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
                <span className="text-sm font-medium">{t("nic")}</span>
                <input
                  name="nic"
                  value={form.nic}
                  onChange={onChange}
                  className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  placeholder={t("oldOrNewFormat")}
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
              {saving ? t("saving") : t("save")}
            </button>
            <button
              onClick={onClose}
              className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200"
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ------------------------------
// Main Dashboard
// ------------------------------
export default function NurseDashboard() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [patients, setPatients] = useState([]);

  // table state
  const [q, setQ] = useState("");
  const debouncedQ = useDebouncedValue(q, 300);
  const [sort, setSort] = useState({ key: "Full Name", dir: "asc" });
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const [editing, setEditing] = useState({ open: false, patient: null });

  useEffect(() => {
    let ok = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const pat = await API.get("/patients");
        if (!ok) return;
        setPatients(pat.data || []);
      } catch (e) {
        setErr(e?.response?.data?.detail || t("errorLoadingData"));
      } finally {
        if (ok) setLoading(false);
      }
    })();
    return () => {
      ok = false;
    };
  }, []);

  // derived rows
  const filtered = useMemo(() => {
    const needle = debouncedQ.trim().toLowerCase();
    const base = !needle
      ? patients
      : patients.filter((p) => {
          const name = (pick(p, "Full Name", "full_name") || "").toLowerCase();
          const nic = (pick(p, "NIC", "nic") || "").toLowerCase();
          const phone = (
            pick(p, "Contact Number", "contact_number") || ""
          ).toLowerCase();
          return (
            name.includes(needle) ||
            nic.includes(needle) ||
            phone.includes(needle)
          );
        });
    const key = sort.key;
    const dir = sort.dir === "asc" ? 1 : -1;
    const arr = [...base].sort((a, b) => {
      const av = (pick(a, key, key.replace(/\s/g, "_")) || "")
        .toString()
        .toLowerCase();
      const bv = (pick(b, key, key.replace(/\s/g, "_")) || "")
        .toString()
        .toLowerCase();
      return av < bv ? -1 * dir : av > bv ? 1 * dir : 0;
    });
    return arr;
  }, [patients, debouncedQ, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);
  const pageRows = useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page, pageSize]
  );

  const toggleSort = (key) => {
    setSort((s) =>
      s.key !== key
        ? { key, dir: "asc" }
        : { key, dir: s.dir === "asc" ? "desc" : "asc" }
    );
  };

  const onRowSaved = (updated) => {
    setPatients((arr) =>
      arr.map((p) => (p.patient_id === updated.patient_id ? updated : p))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <NurseNav />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-4 sticky top-0 bg-transparent z-10">
          <h1 className="text-2xl font-bold text-gray-800">
            {t("nurseDashboard")}
          </h1>
          <p className="text-sm text-gray-600">{t("patientManagement")}</p>
        </div>

        {err && (
          <div className="mb-4 p-3 rounded-md bg-red-50 text-red-700 border border-red-100">
            {err}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-3 border-b border-gray-100 sticky top-0 z-10">
            <h3 className="text-lg font-semibold text-gray-800">
              {t("patients")}
            </h3>
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder={t("searchByNameNicPhoneDob")}
              className="w-72 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="p-5 overflow-x-auto">
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-10 bg-gray-100 animate-pulse rounded"
                  />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-gray-500 text-sm">
                {t("noMatchingPatients")}
              </div>
            ) : (
              <>
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th
                        className="py-2 pr-4 cursor-pointer select-none"
                        onClick={() => toggleSort("Full Name")}
                      >
                        {t("fullName")}{" "}
                        <SortIcon
                          dir={sort.key === "Full Name" ? sort.dir : null}
                        />
                      </th>
                      <th
                        className="py-2 pr-4 cursor-pointer select-none"
                        onClick={() => toggleSort("Gender")}
                      >
                        {t("gender")}{" "}
                        <SortIcon
                          dir={sort.key === "Gender" ? sort.dir : null}
                        />
                      </th>
                      <th className="py-2 pr-4">{t("contactNumber")}</th>
                      <th className="py-2 pr-4">{t("dateOfBirth")}</th>
                      <th className="py-2 pr-4">{t("bloodGroup")}</th>
                      <th className="py-2 pr-4">{t("actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map((p, i) => (
                      <tr
                        key={p.patient_id || i}
                        className="border-t hover:bg-gray-50"
                      >
                        <td className="py-2 pr-4">
                          {pick(p, "Full Name", "full_name")}
                        </td>
                        <td className="py-2 pr-4">
                          {pick(p, "Gender", "gender") || t("unknown")}
                        </td>
                        <td className="py-2 pr-4">
                          {pick(p, "Contact Number", "contact_number") ||
                            t("noContact")}
                        </td>
                        <td className="py-2 pr-4">
                          {pick(p, "Date of Birth", "date_of_birth") ||
                            t("noDob")}
                        </td>
                        <td className="py-2 pr-4">
                          {pick(p, "Blood Group", "blood_group") ||
                            t("unknown")}
                        </td>
                        <td className="py-2 pr-4">
                          <button
                            className="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                            onClick={() =>
                              setEditing({ open: true, patient: p })
                            }
                          >
                            {t("edit")}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4">
                  <div className="text-xs text-gray-500">
                    Page {page} {t("of")} {totalPages} • {filtered.length}{" "}
                    {t("patients")}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-3 py-1.5 rounded border disabled:opacity-50"
                    >
                      {t("previous")}
                    </button>
                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                      className="px-3 py-1.5 rounded border disabled:opacity-50"
                    >
                      {t("next")}
                    </button>
                  </div>
                </div>
              </>
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
      <Footer />
    </div>
  );
}
