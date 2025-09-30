import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

/**
 * Plain Tailwind version — no shadcn/ui.
 * Drop this file anywhere (e.g., src/pages/nurse/RecordAccidentData.jsx)
 * Make sure Tailwind is configured in your project.
 */

function useAuth() {
  const id = window.localStorage.getItem("user_id") || "demo-nurse-id";
  window.localStorage.setItem("user_id", id);
  return { id, role: "nurse" };
}

const FIELDS = {
  patient_id: { label: "Patient", type: "patient" },
  managed_by: { label: "Managed by (nurse)", type: "hidden" },
  incident_at_date: { label: "Incident date", type: "date" },
  time_of_collision: {
    label: "Time of collision",
    type: "select",
    options: [
      "00:00 - 03:00",
      "03:00 - 06:00",
      "06:00 - 09:00",
      "09:00 - 12:00",
      "12:00 - 15:00",
      "15:00 - 18:00",
      "18:00 - 21:00",
      "21:00 - 00:00",
    ],
  },
  mode_of_traveling: {
    label: "Mode of traveling during accident",
    type: "select",
    options: [
      "Motorbike",
      "Unknown",
      "Bicycle",
      "Others",
      "Three Wheeler",
      "Pedestrian",
      "Car/Van",
      "Heavy Vehicle",
    ],
  },
  visibility: {
    label: "Visibility",
    type: "select",
    options: ["Adequate", "Poor", "Unknown"],
  },
  collision_force_from: {
    label: "Collision force from",
    type: "select",
    options: ["Front", "RightSide", "LeftSide", "Behind", "Unknown"],
  },
  collision_with: {
    label: "Collision with",
    type: "select",
    options: [
      "Heavy Vehicle",
      "Motorbike",
      "Unknown",
      "Fall From Vehicle",
      "Animal",
      "Three Wheeler",
      "Others",
      "Car/Van",
      "Bicycle",
      "Pedestrian",
    ],
  },
  road_condition: {
    label: "Road Condition",
    type: "select",
    options: ["Poor", "Good", "Unknown"],
  },
  road_type: {
    label: "Road Type",
    type: "select",
    options: ["Junction", "Unknown", "Bend", "Straight"],
  },
  category_of_road: {
    label: "Category of Road",
    type: "select",
    options: ["SideRoad", "Unknown", "HighWay", "PathOrField"],
  },
  road_signals_exist: {
    label: "Road signals exist",
    type: "select",
    options: ["Yes", "No", "Unknown"],
  },
  approximate_speed: {
    label: "Approximate speed",
    type: "select",
    options: [
      "Less Than 40 km/h",
      "Unknown",
      "40 - 80 km/h",
      "More Than 80 km/h",
    ],
  },
  alcohol_consumption: {
    label: "Alcohol Consumption",
    type: "select",
    options: ["Yes", "No", "Unknown"],
  },
  time_between_alcohol: {
    label: "Time between alcohol consumption and accident",
    type: "select",
    options: [
      "No alcohol consumption",
      "Less than one hour",
      "Unknown",
      "More than one hour",
    ],
  },
  illicit_drugs: {
    label: "Illicit Drugs",
    type: "select",
    options: ["Yes", "No", "Unknown"],
  },
  helmet_worn: {
    label: "Helmet Worn",
    type: "select",
    options: ["Yes", "No", "Not Necessary", "Unknown"],
  },
  engine_capacity: {
    label: "Engine Capacity",
    type: "select",
    options: [
      "101To200",
      "Unknown",
      "50To100",
      "Not Necessary",
      "MoreThan200",
      "LessThan50",
    ],
  },
  mode_of_transport: {
    label: "Mode of transport to hospital",
    type: "select",
    options: [
      "Three wheeler",
      "Motor Bike",
      "Unknown",
      "Ambulance",
      "Other Vehicle",
    ],
  },
  time_to_hospital: {
    label: "Time taken to reach hospital",
    type: "select",
    options: [
      "15 Minutes - 30 Minutes",
      "Less Than 15 Minutes",
      "Unknown",
      "30 Minutes - 1 Hour",
      "More Than 2 Hour",
      "1 Hour - 2 Hour",
    ],
  },
  bystander_expenditure: {
    label: "Bystander expenditure per day",
    type: "select",
    options: ["500-1000", "Less Than 500", "Not Necessary", "More than 1000"],
  },
  income_before_accident: {
    label: "Family monthly income before accident",
    type: "select",
    options: [
      "More than 60000",
      "30000-45000",
      "Unknown",
      "45000-60000",
      "15000-30000",
      "Less Than 15000",
    ],
  },
  income_after_accident: {
    label: "Family monthly income after accident",
    type: "select",
    options: [
      "45000-60000",
      "15000-30000",
      "Unknown",
      "30000-45000",
      "15000-45000",
      "Less Than 15000",
      "More Than 60000",
    ],
  },
  family_status: {
    label: "Family current status",
    type: "select",
    options: [
      "Severely Affected",
      "Moderately Affected",
      "Unknown",
      "Mildly Affected",
      "Not Affected",
    ],
  },
  vehicle_insured: {
    label: "Vehicle insured",
    type: "select",
    options: ["Yes", "Unknown", "No"],
  },
  passenger_type: {
    label: "Passenger type",
    type: "select",
    options: [
      "Driver",
      "Unknown",
      "Pillion Rider",
      "PassengerFallingOfVehicle",
      "N/A",
      "FrontSeatPassenger",
      "RearSeatPassenger",
    ],
  },
  first_aid_given: {
    label: "First aid given at seen",
    type: "select",
    options: ["Yes", "No", "Unknown"],
  },
  discharge_outcome: {
    label: "Discharge Outcome",
    type: "select",
    options: ["Partial Recovery", "Complete Recovery", "Further Interventions"],
  },
  notes: { label: "Notes (optional)", type: "textarea" },
};

const api = {
  async searchPatients(q) {
    const r = await axios.get(`/patients`, {
      params: { search: q, limit: 12 },
    });
    return r.data;
  },
  async listAccidents(patientId) {
    const r = await axios.get(`/accidents/patient/${patientId}`);
    return r.data;
  },
  async getAccident(accidentId) {
    const r = await axios.get(`/accidents/${accidentId}`);
    return r.data;
  },
  async createAccident(payload) {
    const r = await axios.post(`/accidents`, payload);
    return r.data;
  },
  async updateAccident(accidentId, payload) {
    const r = await axios.patch(`/accidents/${accidentId}`, payload);
    return r.data;
  },
};

function Card({ title, description, children, footer }) {
  return (
    <div className="rounded-2xl border bg-white shadow-sm">
      {(title || description) && (
        <div className="p-4 border-b">
          {title && <div className="text-lg font-semibold">{title}</div>}
          {description && (
            <div className="text-sm text-gray-500">{description}</div>
          )}
        </div>
      )}
      <div className="p-4">{children}</div>
      {footer && <div className="p-4 border-t flex gap-2">{footer}</div>}
    </div>
  );
}

function Button({ children, className = "", disabled, onClick, type }) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium border shadow-sm transition ${
        disabled
          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
          : "bg-blue-600 text-white hover:bg-blue-700"
      } ${className}`}
    >
      {children}
    </button>
  );
}

function SecondaryButton(props) {
  return (
    <Button
      {...props}
      className={`bg-gray-100 text-gray-900 hover:bg-gray-200 ${
        props.className || ""
      }`}
    />
  );
}

function Input({ value, onChange, type = "text", placeholder = "", disabled }) {
  return (
    <input
      type={type}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        disabled ? "bg-gray-100" : "bg-white"
      }`}
    />
  );
}

function Textarea({ value, onChange, placeholder = "", disabled }) {
  return (
    <textarea
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full rounded-xl border px-3 py-2 text-sm h-28 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        disabled ? "bg-gray-100" : "bg-white"
      }`}
    />
  );
}

function Select({ value, onChange, options, disabled }) {
  return (
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
}

function Checkbox({ checked, onChange, disabled, id }) {
  return (
    <input
      id={id}
      type="checkbox"
      checked={!!checked}
      disabled={disabled}
      onChange={(e) => onChange(e.target.checked)}
      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
    />
  );
}

function Label({ children, htmlFor, className = "" }) {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-sm font-medium text-gray-700 ${className}`}
    >
      {children}
    </label>
  );
}

function StatusBadge({ completed }) {
  return (
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
}

function PatientPicker({ value, onChange }) {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState([]);

  useEffect(() => {
    let active = true;
    const run = async () => {
      if (!q) {
        setRes([]);
        return;
      }
      setLoading(true);
      try {
        const data = await api.searchPatients(q);
        if (active) setRes(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        if (active) setLoading(false);
      }
    };
    const t = setTimeout(run, 300);
    return () => {
      active = false;
      clearTimeout(t);
    };
  }, [q]);

  return (
    <Card
      title="Select patient"
      description="Search by name / NIC / hospital ID"
    >
      <div className="space-y-3">
        <Input
          placeholder="Type to search…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="grid gap-2">
          {loading && <div className="text-sm opacity-70">Searching…</div>}
          {!loading && res.length === 0 && q && (
            <div className="text-sm opacity-70">No matches</div>
          )}
          {res.map((p) => (
            <button
              key={p.id}
              className={`text-left p-3 rounded-xl border hover:shadow transition ${
                value?.id === p.id ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => onChange(p)}
            >
              <div className="font-medium">{p.name}</div>
              <div className="text-xs opacity-70">{p.nic || p.hospital_id}</div>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}

function AccidentList({ patient, onSelectExisting, currentUserId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    let active = true;
    async function run() {
      if (!patient) return;
      setLoading(true);
      setErr("");
      try {
        const data = await api.listAccidents(patient.id);
        if (active) setItems(data || []);
      } catch (e) {
        console.error(e);
        setErr("Failed to load existing accident records");
      } finally {
        if (active) setLoading(false);
      }
    }
    run();
    return () => {
      active = false;
    };
  }, [patient?.id]);

  if (!patient) return null;

  return (
    <Card
      title="Existing accident records"
      description={`Patient: ${patient.name}`}
    >
      {loading && <div className="text-sm">Loading…</div>}
      {err && <div className="text-sm text-red-600">{err}</div>}
      {!loading && items.length === 0 && (
        <div className="text-sm opacity-70">No records yet</div>
      )}
      <div className="grid md:grid-cols-2 gap-3 mt-3">
        {items.map((it) => {
          const created = new Date(
            it.created_on || it.createdAt || it.created_at
          );
          const dateStr = isNaN(created.getTime())
            ? ""
            : created.toLocaleString();
          const canEdit = !it.Completed && it.managed_by === currentUserId;
          return (
            <div
              key={it.accident_id}
              className="rounded-xl border p-3 bg-white shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="font-medium">
                  {dateStr || "(no created_on)"}
                </div>
                <StatusBadge completed={!!it.Completed} />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Managed by:{" "}
                {it.managed_by === currentUserId ? "You" : it.managed_by}
              </div>
              <div className="flex gap-2 mt-3">
                <SecondaryButton onClick={() => onSelectExisting(it, "view")}>
                  View
                </SecondaryButton>
                <Button
                  onClick={() => onSelectExisting(it, "edit")}
                  disabled={!canEdit}
                >
                  Edit
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function Field({ name, value, onChange, disabled }) {
  const spec = FIELDS[name];
  if (!spec) return null;

  if (spec.type === "select") {
    return (
      <div className="grid gap-1">
        <Label>{spec.label}</Label>
        <Select
          value={value}
          onChange={(v) => onChange(name, v)}
          options={spec.options}
          disabled={disabled}
        />
      </div>
    );
  }
  if (spec.type === "textarea") {
    return (
      <div className="grid gap-1">
        <Label>{spec.label}</Label>
        <Textarea
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder="Optional"
          disabled={disabled}
        />
      </div>
    );
  }
  if (spec.type === "date") {
    return (
      <div className="grid gap-1">
        <Label>{spec.label}</Label>
        <Input
          type="date"
          value={value || ""}
          onChange={(e) => onChange(name, e.target.value)}
          disabled={disabled}
        />
      </div>
    );
  }
  if (spec.type === "hidden") return null;

  return (
    <div className="grid gap-1">
      <Label>{spec.label}</Label>
      <Input
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        disabled={disabled}
      />
    </div>
  );
}

function AccidentForm({
  mode,
  initial,
  patient,
  currentUserId,
  onSaved,
  onCancel,
}) {
  const [model, setModel] = useState(() => ({
    ...initial,
    patient_id: patient?.id || initial?.patient_id,
    managed_by: initial?.managed_by || currentUserId,
  }));
  const [completed, setCompleted] = useState(Boolean(initial?.Completed));
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const canEdit =
    mode === "create" ||
    (mode === "edit" &&
      !initial?.Completed &&
      initial?.managed_by === currentUserId);

  const editableFieldNames = useMemo(
    () => Object.keys(FIELDS).filter((k) => FIELDS[k].type !== "hidden"),
    []
  );

  function update(name, val) {
    setModel((m) => ({ ...m, [name]: val }));
  }

  async function handleSubmit() {
    setSaving(true);
    setErr("");
    try {
      const payload = {
        ...model,
        completed: !!completed, // backend maps alias -> DB "Completed"
      };
      if (mode === "create") {
        const created = await api.createAccident(payload);
        onSaved?.(created, "created");
      } else {
        const updated = await api.updateAccident(initial.accident_id, payload);
        onSaved?.(updated, "updated");
      }
    } catch (e) {
      console.error(e);
      setErr(
        e?.response?.data?.message || e?.message || "Failed to save record"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card
      title={
        mode === "create" ? "Create accident record" : "Edit accident record"
      }
      description={patient ? `Patient: ${patient.name}` : undefined}
      footer={
        <>
          <SecondaryButton onClick={onCancel}>Cancel</SecondaryButton>
          <Button onClick={handleSubmit} disabled={saving || !canEdit}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </>
      }
    >
      {!canEdit && (
        <div className="text-sm text-amber-700 p-3 rounded-md bg-amber-50 border mb-3">
          This record is read-only (either completed or managed by another
          nurse).
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {editableFieldNames.map((name) => (
          <Field
            key={name}
            name={name}
            value={model[name]}
            onChange={update}
            disabled={!canEdit}
          />
        ))}
      </div>

      <div className="my-4 h-px bg-gray-200" />

      <div className="flex items-center gap-3">
        <Checkbox
          id="completed"
          checked={completed}
          onChange={setCompleted}
          disabled={!canEdit}
        />
        <Label htmlFor="completed" className="cursor-pointer">
          Mark as <b>Completed</b> before saving
        </Label>
      </div>
      <div className="text-xs text-gray-500 mt-1">
        Severity is set automatically later (default "U").
      </div>
      {err && <div className="text-sm text-red-600 mt-2">{err}</div>}
    </Card>
  );
}

export default function RecordAccidentData() {
  const me = useAuth();
  const [patient, setPatient] = useState(null);
  const [mode, setMode] = useState("idle"); // idle | create | view | edit
  const [current, setCurrent] = useState(null);

  function resetToList() {
    setMode("idle");
    setCurrent(null);
  }

  function onSelectExisting(accident, nextMode) {
    setCurrent(accident);
    setMode(nextMode);
  }

  function onCreateNew() {
    setCurrent(null);
    setMode("create");
  }

  async function handleSaved(_, kind) {
    resetToList();
    alert(kind === "created" ? "Record created" : "Record updated");
  }

  return (
    <div className="mx-auto max-w-6xl p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Accident Record</h1>

      <div className="grid md:grid-cols-2 gap-4">
        <PatientPicker
          value={patient}
          onChange={(p) => {
            setPatient(p);
            resetToList();
          }}
        />
        <Card
          title="Actions"
          description="Create or edit a record for the selected patient"
          footer={
            <Button onClick={onCreateNew} disabled={!patient}>
              Create new record
            </Button>
          }
        >
          <div className="text-sm">
            Signed in as: <b>{me.id}</b> (role: {me.role})
          </div>
        </Card>
      </div>

      {patient && mode === "idle" && (
        <AccidentList
          patient={patient}
          onSelectExisting={onSelectExisting}
          currentUserId={me.id}
        />
      )}

      {patient && (mode === "create" || mode === "edit" || mode === "view") && (
        <AccidentForm
          mode={mode === "view" ? "edit" : mode}
          initial={current}
          patient={patient}
          currentUserId={me.id}
          onSaved={handleSaved}
          onCancel={resetToList}
        />
      )}

      <div className="text-xs text-gray-500">
        <ul className="list-disc ml-5">
          <li>
            All form fields are optional. <b>Completed</b> must be checked
            manually to finalize a record.
          </li>
          <li>
            <b>Severity</b> is omitted here and defaults to "U" in the database.
          </li>
          <li>
            <b>managed_by</b> is enforced on the backend to the current nurse
            user id.
          </li>
        </ul>
      </div>
    </div>
  );
}
