import React, { useState, useEffect, useMemo } from "react";
import API from "../../utils/api";
import NurseNav from "../../navbars/NurseNav";

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
  const name = window.localStorage.getItem("name") || "Demo Nurse";
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

/** Base (snake_case) fields sent to backend models */
const EMPTY_MODEL = {
  patient_id: "",
  incident_at_date: "",
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
};

const StatusBadge = ({ completed }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
      completed
        ? "bg-green-50 text-green-700 border-green-200"
        : "bg-yellow-50 text-yellow-800 border-yellow-200"
    }`}
  >
    {completed ? "Completed" : "Not Completed"}
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
        Managed by:{" "}
        {rec.managed_by === currentUserId ? "You" : rec.managed_by_name}
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => onView(rec)}
          className="px-3 py-1.5 rounded-lg border bg-gray-100 hover:bg-gray-200 text-sm"
        >
          View
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
          Edit
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
    <option value="">Select…</option>
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
    // map DB record into model fields (best effort)
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
    }));
    setCompleted(!!rec.Completed);
    setMode("view"); // renders read-only based on rules
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

  const save = async () => {
    try {
      setSaving(true);
      // Build payload (snake_case). Backend maps to DB columns by alias.
      const payload = {
        ...model,
        completed: !!completed, // maps to DB "Completed"
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
    <div className="container mx-auto p-4">
      <NurseNav />
      <h1 className="text-2xl font-bold mb-6">
        Accident Record Management System
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

          {loadingPatients ? (
            <p>Loading patients...</p>
          ) : (
            <div className="overflow-y-auto max-h-96">
              {filteredPatients && filteredPatients.length > 0 ? (
                filteredPatients.map((patient, index) => {
                  const pid = patient.id ?? patient.patient_id ?? index;
                  const isSelected =
                    selectedPatient &&
                    (selectedPatient.id ?? selectedPatient.patient_id ?? "") ===
                      (patient.id ?? patient.patient_id ?? "");
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

        {/* Right: Actions + Record list / Form */}
        <div className="flex flex-col gap-4">
          {/* Actions */}
          <div className="bg-white p-4 rounded shadow">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold">Actions</h2>
            </div>
            <div className="text-sm mb-3">
              Signed in as: <b>{me.name}</b> (role: {me.role})
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
              Create new record
            </button>
          </div>

          {/* Existing records */}
          {selectedPatient && mode === "idle" && (
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold mb-2">
                Existing accident records —{" "}
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
              <div className="bg-white p-4 rounded shadow">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    {mode === "create"
                      ? "Create accident record"
                      : mode === "edit"
                      ? "Edit accident record"
                      : "View record"}
                  </h3>
                  <div className="text-sm text-gray-600">
                    Patient:{" "}
                    <b>
                      {val(selectedPatient, "Full Name", "full_name", "name")}
                    </b>
                  </div>
                </div>

                {/* editability banner */}
                {mode !== "create" && current && !canEdit(current) && (
                  <div className="text-sm text-amber-700 p-3 rounded-md bg-amber-50 border mt-3">
                    This record is read-only (either completed or managed by
                    another nurse).
                  </div>
                )}

                {/* Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label>Incident date</Label>
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
                    <Label>Time of collision</Label>
                    <Select
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

                  <div>
                    <Label>Mode of traveling during accident</Label>
                    <Select
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
                    <Label>Visibility</Label>
                    <Select
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

                  <div>
                    <Label>Collision force from</Label>
                    <Select
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
                    <Label>Collision with</Label>
                    <Select
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
                    <Label>Road Condition</Label>
                    <Select
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
                    <Select
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
                    <Select
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
                    <Select
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
                    <Label>Approximate speed</Label>
                    <Select
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
                    <Label>Alcohol Consumption</Label>
                    <Select
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
                    <Label>Time between alcohol consumption and accident</Label>
                    <Select
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
                    <Select
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
                    <Select
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
                    <Select
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

                  <div>
                    <Label>Mode of transport to hospital</Label>
                    <Select
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
                    <Select
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
                    <Label>Bystander expenditure per day</Label>
                    <Select
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
                    <Label>Family monthly income before accident</Label>
                    <Select
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
                    <Label>Family monthly income after accident</Label>
                    <Select
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

                  <div className="md:col-span-2">
                    <Label>Family current status</Label>
                    <Select
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
                    <Select
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

                  <div>
                    <Label>Passenger type</Label>
                    <Select
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

                  <div>
                    <Label>First aid given at scene</Label>
                    <Select
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

                  <div>
                    <Label>Discharge Outcome</Label>
                    <Select
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
                      onChange={(e) => updateModel("notes", e.target.value)}
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

                {/* Completed toggle + actions */}
                <div className="mt-4 border-t pt-4">
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
                      Mark as <b>Completed</b> before saving
                    </Label>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Severity is set automatically later (default “U”).
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => {
                        setMode("idle");
                        resetForm();
                      }}
                      className="px-4 py-2 rounded-lg border bg-gray-100 hover:bg-gray-200 text-sm"
                    >
                      Cancel
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
                        {saving ? "Saving…" : "Save"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>

      <div className="text-xs text-gray-500 mt-6">
        <ul className="list-disc ml-5">
          <li>
            All form fields are optional. <b>Completed</b> must be checked
            manually to finalize a record.
          </li>
          <li>
            <b>Severity</b> is omitted (DB default “U”).
          </li>
          <li>
            <b>managed_by</b> is enforced by the backend to the current nurse
            user.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AccidentRecordSystem;
