import React, { useState, useEffect, useMemo } from "react";
import API from "../../utils/api";
import injuryMap from "../../data/injury_site_type_map.json";
import NurseNav from "../../navbars/NurseNav";
import Footer from "../../components/Footer";
import { t } from "../../utils/translations";

/**
 * Assumptions
 * - Backend routes exist:
 *   GET /patients                     -> list of patients (your existing format)
 *   GET /accidents/patient/:patientId -> list accident records for a patient
 *   POST /accidents                   -> create accident record
 *   PATCH /accidents/:accident_id     -> update accident record
 *
 * - The backend enforces:
 *   - managed_by is set to current nurse user_id on create
 *   - Updates only allowed if record is not Completed and managed_by == current user
 *   - Severity defaults to 'U' in DB (we do not send it)
 *
 * - We read nurse user_id from localStorage (same as before),
 *   since your backend auth stub takes `Authorization: Bearer <user_id>`.
 */
const useAuth = () => {
  const id = window.localStorage.getItem("user_id") || "demo-nurse-id";
  const name = window.localStorage.getItem("name") || t('demoNurse');
  //window.localStorage.setItem("user_id", id);
  return { id, name, role: "nurse" };
};

/** Categorical options (per your spec) */
const OPTIONS = {
  time_of_collision: [
    "00:00 - 03:00",
    "03:00 - 06:00",
    "06:00 - 09:00",
    "09:00 - 12:00",
    "12:00 - 15:00",
    "15:00 - 18:00",
    "18:00 - 21:00",
    "21:00 - 00:00",
    "Unknown",
  ],
  mode_of_traveling: [
    "Motorbike",
    "Bicycle",
    "Three Wheeler",
    "Car/Van",
    "Heavy Vehicle",
    "Pedestrian",
    "Others",
    "Unknown",
  ],
  visibility: ["Adequate", "Poor", "Unknown"],
  collision_force_from: ["Front", "RightSide", "LeftSide", "Behind", "Unknown"],
  collision_with: [
    "Heavy Vehicle",
    "Motorbike",
    "Fall From Vehicle",
    "Animal",
    "Three Wheeler",
    "Others",
    "Car/Van",
    "Bicycle",
    "Pedestrian",
    "Unknown",
  ],
  road_condition: ["Poor", "Good", "Unknown"],
  road_type: ["Junction", "Unknown", "Bend", "Straight"],
  category_of_road: ["SideRoad", "Unknown", "HighWay", "PathOrField"],
  road_signals_exist: ["Yes", "No", "Unknown"],
  approximate_speed: [
    "Less Than 40 km/h",
    "Unknown",
    "40 - 80 km/h",
    "More Than 80 km/h",
  ],
  alcohol_consumption: ["Yes", "No", "Unknown"],
  time_between_alcohol: [
    "No alcohol consumption",
    "Less than one hour",
    "More than one hour",
    "Unknown",
  ],
  illicit_drugs: ["Yes", "No", "Unknown"],
  helmet_worn: ["Yes", "No", "Not Necessary", "Unknown"],
  engine_capacity: [
    "LessThan50",
    "50To100",
    "101To200",
    "MoreThan200",
    "Not Necessary",
    "Unknown",
  ],
  mode_of_transport: [
    "Three wheeler",
    "Motor Bike",
    "Unknown",
    "Ambulance",
    "Other Vehicle",
  ],
  time_to_hospital: [
    "Less Than 15 Minutes",
    "15 Minutes - 30 Minutes",
    "30 Minutes - 1 Hour",
    "1 Hour - 2 Hour",
    "More Than 2 Hour",
    "Unknown",
  ],
  bystander_expenditure: [
    "500-1000",
    "Less Than 500",
    "Not Necessary",
    "More than 1000",
    "Unknown",
  ],
  income_before_accident: [
    "More than 60000",
    "30000-45000",
    "Unknown",
    "45000-60000",
    "15000-30000",
    "Less Than 15000",
  ],
  income_after_accident: [
    "45000-60000",
    "15000-30000",
    "Unknown",
    "30000-45000",
    "15000-45000",
    "Less Than 15000",
    "More Than 60000",
  ],
  family_status: [
    "Severely Affected",
    "Moderately Affected",
    "Unknown",
    "Mildly Affected",
    "Not Affected",
  ],
  vehicle_insured: ["Yes", "Unknown", "No"],
  passenger_type: [
    "Driver",
    "Unknown",
    "Pillion Rider",
    "PassengerFallingOfVehicle",
    "N/A",
    "FrontSeatPassenger",
    "RearSeatPassenger",
  ],
  first_aid_given: ["Yes", "No", "Unknown"],
  discharge_outcome: [
    "Partial Recovery",
    "Complete Recovery",
    "Further Interventions",
  ],
};

/** Injuries — categorical options */

const INJURY_SITE_OPTIONS = Object.keys(injuryMap).sort();

const SIDE_OPTIONS = ["Front", "Back", "Left", "Right", "N/A", "Unknown"];

// Severity is auto from ML (display only)
const SEVERITY_LABEL = "Auto (from ML when saved)";

/** Treatments — categorical options (placeholder; replace with your list) */
const TREATMENT_TYPE_OPTIONS = [
  "Medication",
  "Surgery",
  "Plaster/Immobilization",
  "Physiotherapy",
  "Observation",
  "Other",
];

/** Base (snake_case) fields sent to backend models */
const EMPTY_MODEL = {
  patient_id: "",
  incident_at_date: new Date().toISOString().split("T")[0], // yyyy-mm-dd
  time_of_collision: "",
  mode_of_traveling: "",
  visibility: "",
  collision_force_from: "",
  collision_with: "",
  road_condition: "",
  road_type: "",
  category_of_road: "",
  road_signals_exist: "",
  approximate_speed: "",
  alcohol_consumption: "",
  time_between_alcohol: "",
  illicit_drugs: "",
  helmet_worn: "",
  engine_capacity: "",
  mode_of_transport: "",
  time_to_hospital: "",
  bystander_expenditure: "",
  income_before_accident: "",
  income_after_accident: "",
  family_status: "",
  vehicle_insured: "",
  passenger_type: "",
  first_aid_given: "",
  discharge_outcome: "",

  // UX-only
  notes: "",

  // NEW
  injuries: [],
  treatments: [], // <-- added
};

const StatusBadge = ({ completed }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
      completed
        ? "bg-green-50 text-green-700 border-green-200"
        : "bg-yellow-50 text-yellow-800 border-yellow-200"
    }`}
  >
    {completed ? t('completed') : t('notCompleted')}
  </span>
);

const RecordRow = ({ rec, currentUserId, onView, onEdit }) => {
  const created = new Date(rec.created_on || rec.createdAt || rec.created_at);
  const dateStr = isNaN(created.getTime())
    ? "(no created_on)"
    : created.toLocaleString();
  const canEdit = !rec.Completed && rec.managed_by === currentUserId;

  return (
    <div className="rounded-xl border p-3 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <div className="font-medium">{dateStr}</div>
        <StatusBadge completed={!!rec.Completed} />
      </div>
      <div className="text-xs text-gray-500 mt-1">
        {t('managedBy')}{" "}
        {rec.managed_by === currentUserId ? t('you') : rec.managed_by_name}
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => onView(rec)}
          className="px-3 py-1.5 rounded-lg border bg-gray-100 hover:bg-gray-200 text-sm"
        >
          {t('view')}
        </button>
        <button
          onClick={() => onEdit(rec)}
          disabled={!canEdit}
          className={`px-3 py-1.5 rounded-lg text-sm ${
            canEdit
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          {t('edit')}
        </button>
      </div>
    </div>
  );
};

/** Input helpers */
const Label = ({ children, htmlFor }) => (
  <label htmlFor={htmlFor} className="text-sm font-medium text-gray-700">
    {children}
  </label>
);

const Text = ({ name, value, onChange, placeholder = "", disabled }) => (
  <input
    type="text"
    name={name}
    value={value || ""}
    onChange={(e) => onChange(name, e.target.value)}
    placeholder={placeholder}
    disabled={disabled}
    className={`mt-1 block w-full p-2 border border-gray-300 rounded ${
      disabled ? "bg-gray-100" : "bg-white"
    }`}
  />
);

const NumberInput = ({ name, value, onChange, disabled }) => (
  <input
    type="number"
    name={name}
    value={value || ""}
    onChange={(e) => onChange(name, e.target.value)}
    disabled={disabled}
    className={`mt-1 block w-full p-2 border border-gray-300 rounded ${
      disabled ? "bg-gray-100" : "bg-white"
    }`}
  />
);

const DateInput = ({ name, value, onChange, disabled }) => (
  <input
    type="date"
    name={name}
    value={value || ""}
    onChange={(e) => onChange(name, e.target.value)}
    disabled={disabled}
    className={`mt-1 block w-full p-2 border border-gray-300 rounded ${
      disabled ? "bg-gray-100" : "bg-white"
    }`}
  />
);

const RadioChips = ({ name, value, options, onChange, disabled }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const checked = value === opt;
        const id = `${name}-${opt}`.replace(/\s+/g, "_");
        return (
          <label
            key={opt}
            htmlFor={id}
            className={
              "cursor-pointer px-3 py-1.5 rounded-full border text-sm transition " +
              (checked
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50") +
              (disabled ? " opacity-60 pointer-events-none" : "")
            }
          >
            <input
              id={id}
              type="radio"
              name={name}
              value={opt}
              checked={checked}
              disabled={disabled}
              onChange={(e) => onChange(name, e.target.value)}
              className="sr-only"
            />
            {opt}
          </label>
        );
      })}
    </div>
  );
};

// Drop-in replacement that auto-picks radios when options <= 4
const SmartSelect = ({ name, value, onChange, options, disabled }) => {
  if ((options?.length || 0) <= 3) {
    return (
      <RadioChips
        name={name}
        value={value}
        options={options}
        onChange={onChange}
        disabled={disabled}
      />
    );
  }
  // Fallback: your existing Select
  return (
    <select
      name={name}
      value={value || ""}
      onChange={(e) => onChange(name, e.target.value)}
      disabled={disabled}
      className={`mt-1 block w-full p-2 border border-gray-300 rounded ${
        disabled ? "bg-gray-100" : "bg-white"
      }`}
    >
      <option value="">{t('select')}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
};

const Select = ({ name, value, onChange, options, disabled }) => (
  <select
    name={name}
    value={value || ""}
    onChange={(e) => onChange(name, e.target.value)}
    disabled={disabled}
    className={`mt-1 block w-full p-2 border border-gray-300 rounded ${
      disabled ? "bg-gray-100" : "bg-white"
    }`}
  >
    <option value="">{t('select')}</option>
    {options.map((o) => (
      <option key={o} value={o}>
        {o}
      </option>
    ))}
  </select>
);

const Checkbox = ({ checked, onChange, id, disabled }) => (
  <input
    id={id}
    type="checkbox"
    checked={!!checked}
    disabled={disabled}
    onChange={(e) => onChange(e.target.checked)}
    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
  />
);

/** Read helper for multi-schema patients */
const val = (obj, ...keys) => {
  for (const k of keys) {
    if (obj && obj[k] !== undefined && obj[k] !== null) return obj[k];
  }
  return "";
};

const AccidentRecordSystem = () => {
  const me = useAuth();
  const currentHospitalId = window.localStorage.getItem("hospital_id") || null;

  // ---- Patient search (kept from your working code) ----
  const [patients, setPatients] = useState([]);
  const [q, setQ] = useState("");
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [message, setMessage] = useState("");

  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoadingPatients(true);
        const response = await API.get("/patients");
        setPatients(response.data || []);
      } catch (error) {
        console.error("Error fetching patients:", error);
        setMessage("Failed to fetch patients");
      } finally {
        setLoadingPatients(false);
      }
    };
    fetchPatients();
  }, []);

  const filteredPatients = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return patients;
    return patients.filter((p) => {
      const name = (
        val(p, "Full Name", "full_name", "name") || ""
      ).toLowerCase();
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

  const onSelectPatient = (patient) => {
    if (!patient) return;
    setSelectedPatient(patient);
    // prefer "id", fallback to patient_id/user_id
    const pid = patient.id ?? patient.patient_id ?? patient.user_id ?? "";
    setModel((m) => ({ ...m, patient_id: pid }));
    setMode("idle"); // show list
  };

  // ---- Records + form state ----
  const [records, setRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(false);

  const [mode, setMode] = useState("idle"); // idle | create | edit | view (view renders as read-only)
  const [current, setCurrent] = useState(null);
  const [model, setModel] = useState(EMPTY_MODEL);
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);

  // When patient changes, load records
  useEffect(() => {
    const loadRecords = async () => {
      if (!selectedPatient) return;
      const pid =
        selectedPatient.id ??
        selectedPatient.patient_id ??
        selectedPatient.user_id;
      if (!pid) return;
      try {
        setLoadingRecords(true);
        const r = await API.get(`/accidents/patient/${pid}`);
        setRecords(r.data || []);
        console.log(r.data);
      } catch (e) {
        console.error(e);
        setRecords([]);
      } finally {
        setLoadingRecords(false);
      }
    };
    loadRecords();
  }, [selectedPatient]);

  const resetForm = () => {
    setModel((m) => ({ ...EMPTY_MODEL, patient_id: m.patient_id || "" }));
    setCompleted(false);
    setSaving(false);
    setCurrent(null);
  };

  const startCreate = () => {
    if (!selectedPatient) return;
    const pid =
      selectedPatient.id ??
      selectedPatient.patient_id ??
      selectedPatient.user_id ??
      "";
    setModel({ ...EMPTY_MODEL, patient_id: pid });
    setCompleted(false);
    setCurrent(null);
    setMode("create");
  };

  const startView = (rec) => {
    setCurrent(rec);
    setModel((m) => ({
      ...m,
      patient_id: rec.patient_id || m.patient_id || "",
      incident_at_date: rec["incident at date"] || rec.incident_at_date || "",
      time_of_collision:
        rec["time of collision"] || rec.time_of_collision || "",
      mode_of_traveling:
        rec["Mode of traveling during accident"] || rec.mode_of_traveling || "",
      visibility: rec.Visibility || rec.visibility || "",
      collision_force_from:
        rec["Collision force from"] || rec.collision_force_from || "",
      collision_with: rec["Collision with"] || rec.collision_with || "",
      road_condition: rec["Road Condition"] || rec.road_condition || "",
      road_type: rec["Road Type"] || rec.road_type || "",
      category_of_road: rec["Category of Road"] || rec.category_of_road || "",
      road_signals_exist:
        rec["Road signals exist"] || rec.road_signals_exist || "",
      approximate_speed:
        rec["Approximate speed"] || rec.approximate_speed || "",
      alcohol_consumption:
        rec["Alcohol Consumption"] || rec.alcohol_consumption || "",
      time_between_alcohol:
        rec["Time between alcohol consumption and accident"] ||
        rec.time_between_alcohol ||
        "",
      illicit_drugs: rec["Illicit Drugs"] || rec.illicit_drugs || "",
      helmet_worn: rec["Helmet Worn"] || rec.helmet_worn || "",
      engine_capacity: rec["Engine Capacity"] || rec.engine_capacity || "",
      mode_of_transport:
        rec["Mode of transport to hospital"] || rec.mode_of_transport || "",
      time_to_hospital:
        rec["Time taken to reach hospital"] || rec.time_to_hospital || "",
      bystander_expenditure:
        rec["Bystander expenditure per day"] || rec.bystander_expenditure || "",
      income_before_accident:
        rec["Family monthly income before accident"] ||
        rec.income_before_accident ||
        "",
      income_after_accident:
        rec["Family monthly income after accident"] ||
        rec.income_after_accident ||
        "",
      family_status: rec["Family current status"] || rec.family_status || "",
      vehicle_insured: rec["vehicle insured"] || rec.vehicle_insured || "",
      passenger_type: rec["Passenger type"] || rec.passenger_type || "",
      first_aid_given:
        rec["First aid given at seen"] || rec.first_aid_given || "",
      discharge_outcome:
        rec["Discharge Outcome"] || rec.discharge_outcome || "",
      notes: rec.notes || "",
      injuries: Array.isArray(rec.injuries)
        ? rec.injuries.map((it) => ({
            injury_no: it.injury_no ?? 0,
            site_of_injury: it.site_of_injury || "",
            type_of_injury: it.type_of_injury || "",
            side: it.side || "",
            investigation_done: it.investigation_done || "",
            severity: it.severity || "",
          }))
        : [],
      // NEW: bring treatments in if present
      treatments: Array.isArray(rec.treatments)
        ? rec.treatments.map((t) => ({
            treatment_no: t.treatment_no ?? 0,
            treatment_type: t.treatment_type || "",
            description: t.description || "",
            hospital_id: t.hospital_id ?? null,
            hospital_name: t.hospital_name || "", // for display only
            ward_number: t.ward_number || "",
            number_of_days_stay: t.number_of_days_stay || "",
            reason: t.reason || "",
          }))
        : [],
    }));
    setCompleted(!!rec.Completed);
    setMode("view");
  };

  const startEdit = (rec) => {
    startView(rec);
    setMode("edit");
  };

  const canEdit = (rec) => {
    if (!rec) return false;
    return !rec.Completed && rec.managed_by === me.id;
  };

  const updateModel = (name, value) => {
    setModel((m) => ({ ...m, [name]: value }));
  };

  // Create a new blank injury row
  const makeEmptyInjury = () => ({
    injury_no: 0, // assigned on save
    site_of_injury: "",
    type_of_injury: "",
    side: "",
    investigation_done: "",
    severity: "", // left empty; ML will fill
  });

  const addInjury = () => {
    setModel((m) => ({
      ...m,
      injuries: [...(m.injuries || []), makeEmptyInjury()],
    }));
  };

  const updateInjury = (idx, field, value) => {
    setModel((m) => {
      const copy = [...(m.injuries || [])];
      copy[idx] = { ...copy[idx], [field]: value };
      return { ...m, injuries: copy };
    });
  };

  // When site changes, clear/validate type
  const updateInjurySite = (idx, newSite) => {
    setModel((m) => {
      const copy = [...(m.injuries || [])];
      const allowed = injuryMap?.[newSite] || [];
      const currentType = copy[idx]?.type_of_injury || "";
      copy[idx] = {
        ...copy[idx],
        site_of_injury: newSite,
        type_of_injury: allowed.includes(currentType) ? currentType : "",
      };
      return { ...m, injuries: copy };
    });
  };

  const removeInjury = (idx) => {
    setModel((m) => {
      const copy = [...(m.injuries || [])];
      copy.splice(idx, 1);
      return { ...m, injuries: copy };
    });
  };

  // ---- Treatments helpers (NEW) ----
  const makeEmptyTreatment = () => ({
    treatment_no: 0, // assigned on save
    treatment_type: "",
    description: "",
    hospital_id: currentHospitalId || null, // set on creation
    ward_number: "",
    number_of_days_stay: "",
    reason: "",
  });

  const addTreatment = () => {
    setModel((m) => ({
      ...m,
      treatments: [...(m.treatments || []), makeEmptyTreatment()],
    }));
  };

  const updateTreatment = (idx, field, value) => {
    setModel((m) => {
      const copy = [...(m.treatments || [])];
      copy[idx] = { ...copy[idx], [field]: value };
      return { ...m, treatments: copy };
    });
  };

  const removeTreatment = (idx) => {
    setModel((m) => {
      const copy = [...(m.treatments || [])];
      copy.splice(idx, 1);
      return { ...m, treatments: copy };
    });
  };

  const save = async () => {
    try {
      setSaving(true);

      const numberedInjuries = (model.injuries || []).map((inj, i) => ({
        ...inj,
        injury_no: i + 1, // 1-based
        severity: inj.severity, // keep as-is; backend/ML can overwrite later
      }));

      // Treatments: keep original hospital_id; default to current for new ones
      const numberedTreatments = (model.treatments || []).map((t, i) => {
        const clean = { ...t };
        delete clean.hospital_name; // 👈 remove this frontend-only field

        if (clean.number_of_days_stay == "") {
          clean.number_of_days_stay = -1;
        }

        clean.treatment_no =
          t.treatment_no && t.treatment_no > 0 ? t.treatment_no : i + 1;
        clean.hospital_id = t.hospital_id || currentHospitalId || null;

        return clean;
      });
      print;
      console.log("Numbered treatments", numberedTreatments);
      // Build payload (snake_case). Backend maps to DB columns by alias.
      const payload = {
        ...model,
        injuries: numberedInjuries,
        treatments: numberedTreatments, // NEW
        completed: !!completed,
      };
      console.log("Saving payload", payload);
      if (mode === "create") {
        await API.post("/accidents/", payload);
        setMessage("Accident record created successfully!");
      } else if (mode === "edit" && current?.accident_id) {
        await API.patch(`/accidents/${current.accident_id}`, payload);
        setMessage("Accident record updated successfully!");
      }
      // Refresh list and reset
      if (selectedPatient) {
        const pid =
          selectedPatient.id ??
          selectedPatient.patient_id ??
          selectedPatient.user_id;
        const r = await API.get(`/accidents/patient/${pid}`);
        setRecords(r.data || []);
      }
      setMode("idle");
      resetForm();
    } catch (e) {
      console.error(e);
      setMessage(e?.response?.data?.detail || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  // ----- UI -----
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
      <NurseNav />
      <div className="container mx-auto p-4 flex-1">
        <h1 className="text-2xl font-bold mb-6">
          {t('accidentRecordManagementSystem')}
        </h1>

        {message && (
          <div
            className={`p-4 mb-4 rounded ${
              message.toLowerCase().includes("success")
                ? "bg-green-100 text-green-800"
                : "bg-yellow-50 text-yellow-800"
            }`}
          >
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Patients (kept) */}
          <div className="bg-white p-4 rounded shadow">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold">{t('patients')}</h2>
            </div>

            {/* Search */}
            <div className="mb-3">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t('searchByNameNicPhoneDob')}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {loadingPatients ? (
              <p>Loading patients...</p>
            ) : (
              <div className="overflow-y-auto max-h-96">
                {filteredPatients && filteredPatients.length > 0 ? (
                  filteredPatients.map((patient, index) => {
                    const pid = patient.id ?? patient.patient_id ?? index;
                    const isSelected =
                      selectedPatient &&
                      (selectedPatient.id ??
                        selectedPatient.patient_id ??
                        "") === (patient.id ?? patient.patient_id ?? "");
                    return (
                      <div
                        key={pid}
                        className={`p-3 mb-2 rounded cursor-pointer ${
                          isSelected
                            ? "bg-blue-100"
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                        onClick={() => onSelectPatient(patient)}
                      >
                        <div className="font-medium">
                          {val(patient, "Full Name", "full_name", "name") ||
                            "No Name"}
                        </div>
                        <div className="text-sm text-gray-600">
                          {val(patient, "Contact Number", "contact_number") ||
                            t('noContact')}{" "}
                          •{" "}
                          {val(patient, "Date of Birth", "date_of_birth") ||
                            t('noDob')}
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

          {/* Right: Actions + Record list / Form */}
          <div className="flex flex-col gap-4">
            {/* Actions */}
            <div className="bg-white p-4 rounded shadow">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold">{t('actions')}</h2>
              </div>
              <div className="text-sm mb-3">
                {t('signedInAs')} <b>{me.name}</b> (role: {me.role})
              </div>
              <button
                onClick={startCreate}
                disabled={!selectedPatient}
                className={`px-4 py-2 rounded-lg text-sm ${
                  selectedPatient
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {t('createNewRecord')}
              </button>
            </div>

            {/* Existing records */}
            {selectedPatient && mode === "idle" && (
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold mb-2">
                  {t('existingAccidentRecords')}{" "}
                  {val(selectedPatient, "Full Name", "full_name", "name")}
                </h3>
                {loadingRecords ? (
                  <div className="text-sm">Loading…</div>
                ) : records.length === 0 ? (
                  <div className="text-sm text-gray-500">No records yet</div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-3">
                    {records.map((rec) => (
                      <RecordRow
                        key={rec.accident_id}
                        rec={rec}
                        currentUserId={me.id}
                        onView={() => startView(rec)}
                        onEdit={() => startEdit(rec)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Form (create/edit/view) */}
            {selectedPatient &&
              (mode === "create" || mode === "edit" || mode === "view") && (
                <div className="fixed inset-0 z-50 bg-white/90 backdrop-blur-sm overflow-y-auto">
                  {/* Header (sticky inside the overlay) */}
                  <div className="sticky top-0 bg-white/80 backdrop-blur border-b px-6 py-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                        {mode === "create"
                          ? t('createAccidentRecord')
                          : mode === "edit"
                          ? t('editAccidentRecord')
                          : t('viewAccidentRecord')}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {t('patient')}:{" "}
                        <b>
                          {val(
                            selectedPatient,
                            "Full Name",
                            "full_name",
                            "name"
                          )}
                        </b>
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setMode("idle");
                          resetForm();
                        }}
                        className="text-gray-600 hover:text-gray-900 text-sm border px-3 py-1.5 rounded-lg"
                      >
                        ✕ {t('close')}
                      </button>
                      {(mode === "create" ||
                        (mode === "edit" && canEdit(current))) && (
                        <button
                          onClick={save}
                          disabled={saving}
                          className={`text-sm px-4 py-1.5 rounded-lg ${
                            saving
                              ? "bg-blue-400 text-white"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                        >
                          {saving ? t('saving') : t('save')}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Optional read-only banner */}
                  {mode !== "create" && current && !canEdit(current) && (
                    <div className="mx-auto max-w-5xl px-6">
                      <div className="mt-4 text-sm text-amber-700 p-3 rounded-md bg-amber-50 border">
                        {t('readOnlyRecord')}
                      </div>
                    </div>
                  )}

                  {/* Section jump bar */}
                  <div className="mx-auto max-w-5xl px-6">
                    <div className="mt-4 flex flex-wrap gap-2 text-sm">
                      {[
                        ["incident", t('incident')],
                        ["collision", t('collision')],
                        ["road", t('roadEnvironment')],
                        ["safety", t('substancesSafety')],
                        ["transport", t('transport')],
                        ["socio", t('socioeconomic')],
                        ["injuries", t('injuries')],
                        ["treatments", t('treatments')],
                        ["outcome", t('outcomeNotes')],
                      ].map(([id, label]) => (
                        <a
                          key={id}
                          href={`#${id}`}
                          className="px-3 py-1.5 rounded-lg border bg-gray-50 hover:bg-gray-100"
                        >
                          {label}
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="mx-auto max-w-5xl px-6 py-6 space-y-8">
                    {/* Incident */}
                    <section id="incident" className="rounded-xl border">
                      <header className="px-4 py-3 border-b bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
                        <h4 className="font-semibold text-gray-800">
                          {t('incident')}
                        </h4>
                      </header>
                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>{t('incidentDate')}</Label>
                          <DateInput
                            name="incident_at_date"
                            value={model.incident_at_date}
                            onChange={updateModel}
                            disabled={
                              mode === "view" ||
                              (mode === "edit" && !canEdit(current))
                            }
                          />
                        </div>
                        <div>
                          <Label>{t('timeOfCollision')}</Label>
                          <SmartSelect
                            name="time_of_collision"
                            value={model.time_of_collision}
                            onChange={updateModel}
                            options={OPTIONS.time_of_collision}
                            disabled={
                              mode === "view" ||
                              (mode === "edit" && !canEdit(current))
                            }
                          />
                        </div>
                      </div>
                    </section>

                    {/* Collision */}
                    <section id="collision" className="rounded-xl border">
                      <header className="px-4 py-3 border-b bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
                        <h4 className="font-semibold text-gray-800">
                          {t('collision')}
                        </h4>
                      </header>
                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>{t('collisionForceFrom')}</Label>
                          <SmartSelect
                            name="collision_force_from"
                            value={model.collision_force_from}
                            onChange={updateModel}
                            options={OPTIONS.collision_force_from}
                            disabled={
                              mode === "view" ||
                              (mode === "edit" && !canEdit(current))
                            }
                          />
                        </div>
                        <div>
                          <Label>{t('collisionWith')}</Label>
                          <SmartSelect
                            name="collision_with"
                            value={model.collision_with}
                            onChange={updateModel}
                            options={OPTIONS.collision_with}
                            disabled={
                              mode === "view" ||
                              (mode === "edit" && !canEdit(current))
                            }
                          />
                        </div>
                        <div>
                          <Label>{t('modeOfTraveling')}</Label>
                          <SmartSelect
                            name="mode_of_traveling"
                            value={model.mode_of_traveling}
                            onChange={updateModel}
                            options={OPTIONS.mode_of_traveling}
                            disabled={
                              mode === "view" ||
                              (mode === "edit" && !canEdit(current))
                            }
                          />
                        </div>
                        <div>
                          <Label>Approximate speed</Label>
                          <SmartSelect
                            name="approximate_speed"
                            value={model.approximate_speed}
                            onChange={updateModel}
                            options={OPTIONS.approximate_speed}
                            disabled={
                              mode === "view" ||
                              (mode === "edit" && !canEdit(current))
                            }
                          />
                        </div>
                        <div>
                          <Label>Passenger type</Label>
                          <SmartSelect
                            name="passenger_type"
                            value={model.passenger_type}
                            onChange={updateModel}
                            options={OPTIONS.passenger_type}
                            disabled={
                              mode === "view" ||
                              (mode === "edit" && !canEdit(current))
                            }
                          />
                        </div>
                      </div>
                    </section>

                    {/* Road & Environment */}
                    <section id="road" className="rounded-xl border">
                      <header className="px-4 py-3 border-b bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
                        <h4 className="font-semibold text-gray-800">
                          {t('roadEnvironment')}
                        </h4>
                      </header>
                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Road Condition</Label>
                          <SmartSelect
                            name="road_condition"
                            value={model.road_condition}
                            onChange={updateModel}
                            options={OPTIONS.road_condition}
                            disabled={
                              mode === "view" ||
                              (mode === "edit" && !canEdit(current))
                            }
                          />
                        </div>
                        <div>
                          <Label>Road Type</Label>
                          <SmartSelect
                            name="road_type"
                            value={model.road_type}
                            onChange={updateModel}
                            options={OPTIONS.road_type}
                            disabled={
                              mode === "view" ||
                              (mode === "edit" && !canEdit(current))
                            }
                          />
                        </div>
                        <div>
                          <Label>Category of Road</Label>
                          <SmartSelect
                            name="category_of_road"
                            value={model.category_of_road}
                            onChange={updateModel}
                            options={OPTIONS.category_of_road}
                            disabled={
                              mode === "view" ||
                              (mode === "edit" && !canEdit(current))
                            }
                          />
                        </div>
                        <div>
                          <Label>Road signals exist</Label>
                          <SmartSelect
                            name="road_signals_exist"
                            value={model.road_signals_exist}
                            onChange={updateModel}
                            options={OPTIONS.road_signals_exist}
                            disabled={
                              mode === "view" ||
                              (mode === "edit" && !canEdit(current))
                            }
                          />
                        </div>

                        <div>
                          <Label>Visibility</Label>
                          <SmartSelect
                            name="visibility"
                            value={model.visibility}
                            onChange={updateModel}
                            options={OPTIONS.visibility}
                            disabled={
                              mode === "view" ||
                              (mode === "edit" && !canEdit(current))
                            }
                          />
                        </div>
                      </div>
                    </section>

                    {/* Substances & Safety */}
                    <section id="safety" className="rounded-xl border">
                      <header className="px-4 py-3 border-b bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
                        <h4 className="font-semibold text-gray-800">
                          Substances & Safety
                        </h4>
                      </header>
                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Alcohol Consumption</Label>
                          <SmartSelect
                            name="alcohol_consumption"
                            value={model.alcohol_consumption}
                            onChange={updateModel}
                            options={OPTIONS.alcohol_consumption}
                            disabled={
                              mode === "view" ||
                              (mode === "edit" && !canEdit(current))
                            }
                          />
                        </div>
                        <div>
                          <Label>
                            Time between alcohol consumption and accident
                          </Label>
                          <SmartSelect
                            name="time_between_alcohol"
                            value={model.time_between_alcohol}
                            onChange={updateModel}
                            options={OPTIONS.time_between_alcohol}
                            disabled={
                              mode === "view" ||
                              (mode === "edit" && !canEdit(current))
                            }
                          />
                        </div>
                        <div>
                          <Label>Illicit Drugs</Label>
                          <SmartSelect
                            name="illicit_drugs"
                            value={model.illicit_drugs}
                            onChange={updateModel}
                            options={OPTIONS.illicit_drugs}
                            disabled={
                              mode === "view" ||
                              (mode === "edit" && !canEdit(current))
                            }
                          />
                        </div>
                        <div>
                          <Label>Helmet Worn</Label>
                          <SmartSelect
                            name="helmet_worn"
                            value={model.helmet_worn}
                            onChange={updateModel}
                            options={OPTIONS.helmet_worn}
                            disabled={
                              mode === "view" ||
                              (mode === "edit" && !canEdit(current))
                            }
                          />
                        </div>
                        <div>
                          <Label>Engine Capacity</Label>
                          <SmartSelect
                            name="engine_capacity"
                            value={model.engine_capacity}
                            onChange={updateModel}
                            options={OPTIONS.engine_capacity}
                            disabled={
                              mode === "view" ||
                              (mode === "edit" && !canEdit(current))
                            }
                          />
                        </div>
                      </div>
                    </section>

                    {/* Transport */}
                    <section id="transport" className="rounded-xl border">
                      <header className="px-4 py-3 border-b bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
                        <h4 className="font-semibold text-gray-800">
                          Transport to Hospital
                        </h4>
                      </header>
                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Mode of transport to hospital</Label>
                          <SmartSelect
                            name="mode_of_transport"
                            value={model.mode_of_transport}
                            onChange={updateModel}
                            options={OPTIONS.mode_of_transport}
                            disabled={
                              mode === "view" ||
                              (mode === "edit" && !canEdit(current))
                            }
                          />
                        </div>
                        <div>
                          <Label>Time taken to reach hospital</Label>
                          <SmartSelect
                            name="time_to_hospital"
                            value={model.time_to_hospital}
                            onChange={updateModel}
                            options={OPTIONS.time_to_hospital}
                            disabled={
                              mode === "view" ||
                              (mode === "edit" && !canEdit(current))
                            }
                          />
                        </div>
                        <div>
                          <Label>First aid given at scene</Label>
                          <SmartSelect
                            name="first_aid_given"
                            value={model.first_aid_given}
                            onChange={updateModel}
                            options={OPTIONS.first_aid_given}
                            disabled={
                              mode === "view" ||
                              (mode === "edit" && !canEdit(current))
                            }
                          />
                        </div>
                      </div>
                    </section>

                    {/* Socio-economic */}
                    <section id="socio" className="rounded-xl border">
                      <header className="px-4 py-3 border-b bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
                        <h4 className="font-semibold text-gray-800">
                          Socio-economic Impact
                        </h4>
                      </header>
                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Bystander expenditure per day</Label>
                          <SmartSelect
                            name="bystander_expenditure"
                            value={model.bystander_expenditure}
                            onChange={updateModel}
                            options={OPTIONS.bystander_expenditure}
                            disabled={
                              mode === "view" ||
                              (mode === "edit" && !canEdit(current))
                            }
                          />
                        </div>
                        <div>
                          <Label>Income before accident</Label>
                          <SmartSelect
                            name="income_before_accident"
                            value={model.income_before_accident}
                            onChange={updateModel}
                            options={OPTIONS.income_before_accident}
                            disabled={
                              mode === "view" ||
                              (mode === "edit" && !canEdit(current))
                            }
                          />
                        </div>
                        <div>
                          <Label>Income after accident</Label>
                          <SmartSelect
                            name="income_after_accident"
                            value={model.income_after_accident}
                            onChange={updateModel}
                            options={OPTIONS.income_after_accident}
                            disabled={
                              mode === "view" ||
                              (mode === "edit" && !canEdit(current))
                            }
                          />
                        </div>
                        <div>
                          <Label>Family current status</Label>
                          <SmartSelect
                            name="family_status"
                            value={model.family_status}
                            onChange={updateModel}
                            options={OPTIONS.family_status}
                            disabled={
                              mode === "view" ||
                              (mode === "edit" && !canEdit(current))
                            }
                          />
                        </div>
                        <div>
                          <Label>Vehicle insured</Label>
                          <SmartSelect
                            name="vehicle_insured"
                            value={model.vehicle_insured}
                            onChange={updateModel}
                            options={OPTIONS.vehicle_insured}
                            disabled={
                              mode === "view" ||
                              (mode === "edit" && !canEdit(current))
                            }
                          />
                        </div>
                      </div>
                    </section>

                    {/* Injuries */}
                    <section id="injuries" className="rounded-xl border">
                      <header className="px-4 py-3 border-b bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl flex items-center justify-between">
                        <h4 className="font-semibold text-gray-800">
                          {t('injuries')}
                        </h4>
                        {mode !== "view" && (
                          <button
                            type="button"
                            onClick={addInjury}
                            disabled={mode === "edit" && !canEdit(current)}
                            className={`text-sm px-3 py-1.5 rounded-lg border ${
                              mode === "edit" && !canEdit(current)
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-white hover:bg-gray-50"
                            }`}
                          >
                            + {t('addInjury')}
                          </button>
                        )}
                      </header>

                      <div className="p-4 space-y-4">
                        {model.injuries && model.injuries.length > 0 ? (
                          model.injuries.map((inj, idx) => {
                            const readOnly =
                              mode === "view" ||
                              (mode === "edit" && !canEdit(current));
                            const typesForSite = (
                              injuryMap?.[inj.site_of_injury] || []
                            )
                              .slice()
                              .sort();
                            const disableType =
                              readOnly ||
                              !inj.site_of_injury ||
                              typesForSite.length === 0;

                            return (
                              <div
                                key={idx}
                                className="rounded-lg border p-4 bg-white shadow-sm"
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <div className="font-medium text-gray-800">
                                    Injury #{idx + 1}
                                  </div>
                                  {mode !== "view" && (
                                    <button
                                      type="button"
                                      onClick={() => removeInjury(idx)}
                                      disabled={readOnly}
                                      className={`text-sm px-3 py-1.5 rounded-lg border ${
                                        readOnly
                                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                          : "bg-white hover:bg-gray-50"
                                      }`}
                                    >
                                      Remove
                                    </button>
                                  )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {/* Site of injury */}
                                  <div>
                                    <Label>Site of injury</Label>
                                    <SmartSelect
                                      name={`site_of_injury_${idx}`}
                                      value={inj.site_of_injury}
                                      onChange={(_, v) =>
                                        updateInjurySite(idx, v)
                                      }
                                      options={INJURY_SITE_OPTIONS}
                                      disabled={readOnly}
                                    />
                                  </div>

                                  {/* Type of injury (depends on site) */}
                                  <div>
                                    <Label>Type of injury</Label>
                                    <SmartSelect
                                      name={`type_of_injury_${idx}`}
                                      value={inj.type_of_injury}
                                      onChange={(_, v) =>
                                        updateInjury(idx, "type_of_injury", v)
                                      }
                                      options={typesForSite}
                                      disabled={disableType}
                                    />
                                  </div>

                                  {/* Side */}
                                  <div>
                                    <Label>Side</Label>
                                    <SmartSelect
                                      name={`side_${idx}`}
                                      value={inj.side}
                                      onChange={(_, v) =>
                                        updateInjury(idx, "side", v)
                                      }
                                      options={SIDE_OPTIONS}
                                      disabled={readOnly}
                                    />
                                  </div>

                                  {/* Investigation Done */}
                                  <div>
                                    <Label>Investigation Done</Label>
                                    <input
                                      type="text"
                                      name={`investigation_done_${idx}`}
                                      value={inj.investigation_done || ""}
                                      onChange={(e) =>
                                        updateInjury(
                                          idx,
                                          "investigation_done",
                                          e.target.value
                                        )
                                      }
                                      disabled={readOnly}
                                      placeholder={t('leaveBlankIfNone')}
                                      className={`mt-1 block w-full p-2 border border-gray-300 rounded ${
                                        readOnly ? "bg-gray-100" : "bg-white"
                                      }`}
                                    />
                                  </div>

                                  {/* Severity (ML) */}
                                  <div className="md:col-span-2">
                                    <Label>Severity</Label>
                                    <div className="mt-1 text-sm">
                                      <span className="inline-flex items-center rounded-full px-3 py-1 border bg-gray-50 text-gray-700">
                                        {inj.severity
                                          ? inj.severity
                                          : SEVERITY_LABEL}
                                      </span>
                                      <span className="ml-2 text-xs text-gray-500">
                                        Auto-populated by ML based on site &
                                        type.
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-sm text-gray-500">
                            No injuries added yet. Click <b>“Add injury”</b> to
                            include one or more.
                          </div>
                        )}
                      </div>
                    </section>

                    {/* Treatments (NEW) */}
                    <section id="treatments" className="rounded-xl border">
                      <header className="px-4 py-3 border-b bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl flex items-center justify-between">
                        <h4 className="font-semibold text-gray-800">
                          {t('treatments')}
                        </h4>
                        {mode !== "view" && (
                          <button
                            type="button"
                            onClick={addTreatment}
                            disabled={mode === "edit" && !canEdit(current)}
                            className={`text-sm px-3 py-1.5 rounded-lg border ${
                              mode === "edit" && !canEdit(current)
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-white hover:bg-gray-50"
                            }`}
                          >
                            + {t('addTreatment')}
                          </button>
                        )}
                      </header>

                      <div className="p-4 space-y-4">
                        {model.treatments && model.treatments.length > 0 ? (
                          model.treatments.map((t, idx) => {
                            const recordReadOnly =
                              mode === "view" ||
                              (mode === "edit" && !canEdit(current));
                            const createdHospital = t.hospital_id || null;
                            const foreignHospital =
                              createdHospital &&
                              currentHospitalId &&
                              String(createdHospital) !==
                                String(currentHospitalId);

                            const readOnly = recordReadOnly || foreignHospital;

                            return (
                              <div
                                key={idx}
                                className="rounded-lg border p-4 bg-white shadow-sm"
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <div className="font-medium text-gray-800">
                                    Treatment #{idx + 1}
                                    {foreignHospital && (
                                      <span className="ml-2 text-xs inline-flex items-center px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                                        Read-only (other hospital)
                                      </span>
                                    )}
                                  </div>
                                  {mode !== "view" && !foreignHospital && (
                                    <button
                                      type="button"
                                      onClick={() => removeTreatment(idx)}
                                      disabled={readOnly}
                                      className={`text-sm px-3 py-1.5 rounded-lg border ${
                                        readOnly
                                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                          : "bg-white hover:bg-gray-50"
                                      }`}
                                    >
                                      Remove
                                    </button>
                                  )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label>Treatment type</Label>
                                    <SmartSelect
                                      name={`treatment_type_${idx}`}
                                      value={t.treatment_type}
                                      onChange={(_, v) =>
                                        updateTreatment(
                                          idx,
                                          "treatment_type",
                                          v
                                        )
                                      }
                                      options={TREATMENT_TYPE_OPTIONS}
                                      disabled={readOnly}
                                    />
                                  </div>

                                  <div>
                                    <Label>Ward number</Label>
                                    <input
                                      type="text"
                                      name={`ward_number_${idx}`}
                                      value={t.ward_number || ""}
                                      onChange={(e) =>
                                        updateTreatment(
                                          idx,
                                          "ward_number",
                                          e.target.value
                                        )
                                      }
                                      disabled={readOnly}
                                      placeholder="e.g., 06B"
                                      className={`mt-1 block w-full p-2 border border-gray-300 rounded ${
                                        readOnly ? "bg-gray-100" : "bg-white"
                                      }`}
                                    />
                                  </div>

                                  <div>
                                    <Label>Number of days stayed</Label>
                                    <input
                                      type="number"
                                      min="0"
                                      name={`number_of_days_stay_${idx}`}
                                      value={t.number_of_days_stay || ""}
                                      onChange={(e) =>
                                        updateTreatment(
                                          idx,
                                          "number_of_days_stay",
                                          e.target.value
                                        )
                                      }
                                      disabled={readOnly}
                                      placeholder="e.g., 3"
                                      className={`mt-1 block w-full p-2 border border-gray-300 rounded ${
                                        readOnly ? "bg-gray-100" : "bg-white"
                                      }`}
                                    />
                                  </div>

                                  <div>
                                    <Label>Reason (optional)</Label>
                                    <input
                                      type="text"
                                      name={`reason_${idx}`}
                                      value={t.reason || ""}
                                      onChange={(e) =>
                                        updateTreatment(
                                          idx,
                                          "reason",
                                          e.target.value
                                        )
                                      }
                                      disabled={readOnly}
                                      placeholder="e.g., observation due to …"
                                      className={`mt-1 block w-full p-2 border border-gray-300 rounded ${
                                        readOnly ? "bg-gray-100" : "bg-white"
                                      }`}
                                    />
                                  </div>

                                  <div className="md:col-span-2">
                                    <Label>Description</Label>
                                    <textarea
                                      name={`description_${idx}`}
                                      value={t.description || ""}
                                      onChange={(e) =>
                                        updateTreatment(
                                          idx,
                                          "description",
                                          e.target.value
                                        )
                                      }
                                      disabled={readOnly}
                                      placeholder="Short summary of the treatment performed"
                                      className={`mt-1 block w-full p-2 border border-gray-300 rounded h-24 ${
                                        readOnly ? "bg-gray-100" : "bg-white"
                                      }`}
                                    />
                                  </div>

                                  <div className="md:col-span-2">
                                    <Label>
                                      Hospital (assigned on creation)
                                    </Label>
                                    <div className="mt-1 text-sm">
                                      <span className="inline-flex items-center rounded-full px-3 py-1 border bg-gray-50 text-gray-700">
                                        {(t.hospital_id == currentHospitalId
                                          ? "Your Hospital"
                                          : t.hospital_name) || "Error"}
                                      </span>
                                      <span className="ml-2 text-xs text-gray-500">
                                        This value is kept as-is once saved.
                                        Treatments from other hospitals are
                                        read-only.
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-sm text-gray-500">
                            No treatments added yet. Click{" "}
                            <b>“Add treatment”</b> to include one or more.
                          </div>
                        )}
                      </div>
                    </section>

                    {/* Outcome & Notes */}
                    <section id="outcome" className="rounded-xl border">
                      <header className="px-4 py-3 border-b bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
                        <h4 className="font-semibold text-gray-800">
                          Outcome & Notes
                        </h4>
                      </header>
                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Discharge Outcome</Label>
                          <SmartSelect
                            name="discharge_outcome"
                            value={model.discharge_outcome}
                            onChange={updateModel}
                            options={OPTIONS.discharge_outcome}
                            disabled={
                              mode === "view" ||
                              (mode === "edit" && !canEdit(current))
                            }
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label>Notes (optional)</Label>
                          <textarea
                            name="notes"
                            value={model.notes}
                            onChange={(e) =>
                              updateModel("notes", e.target.value)
                            }
                            disabled={
                              mode === "view" ||
                              (mode === "edit" && !canEdit(current))
                            }
                            className={`mt-1 block w-full p-2 border border-gray-300 rounded h-24 ${
                              mode === "view" ||
                              (mode === "edit" && !canEdit(current))
                                ? "bg-gray-100"
                                : "bg-white"
                            }`}
                          />
                        </div>
                      </div>
                    </section>

                    {/* Completed toggle */}
                    <section className="rounded-xl border">
                      <header className="px-4 py-3 border-b bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
                        <h4 className="font-semibold text-gray-800">
                          Finalize
                        </h4>
                      </header>
                      <div className="p-4">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id="completed"
                            checked={completed}
                            onChange={setCompleted}
                            disabled={
                              mode === "view" ||
                              (mode === "edit" && !canEdit(current))
                            }
                          />
                          <Label htmlFor="completed" className="cursor-pointer">
                            Mark as <b>Completed</b> to finalize this record (no
                            further edits allowed)
                          </Label>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Severity is set automatically later (default “U”).
                        </div>
                      </div>
                    </section>

                    {/* Footer buttons */}
                    <div className="flex flex-wrap gap-3 justify-end pb-8">
                      <button
                        onClick={() => {
                          setMode("idle");
                          resetForm();
                        }}
                        className="px-4 py-2 rounded-lg border bg-gray-100 hover:bg-gray-200 text-sm"
                      >
                        {t('cancel')}
                      </button>
                      {(mode === "create" ||
                        (mode === "edit" && canEdit(current))) && (
                        <button
                          onClick={save}
                          disabled={saving}
                          className={`px-4 py-2 rounded-lg text-sm ${
                            saving
                              ? "bg-blue-400 text-white"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                        >
                          {saving ? t('saving') : t('save')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AccidentRecordSystem;
