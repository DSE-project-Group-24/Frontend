import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import NurseNav from "../../navbars/NurseNav";
import API from "../../utils/api";

function StatCard({ title, value, subtitle }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-3xl font-semibold text-gray-800 mt-1">{value}</div>
      {subtitle ? (
        <div className="text-xs text-gray-400 mt-1">{subtitle}</div>
      ) : null}
    </div>
  );
}

function Section({ title, action, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-3 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// Helper to read either alias keys ("Full Name") or snake_case ("full_name")
const pick = (row, ...keys) => {
  for (const k of keys) {
    if (row && row[k] !== undefined && row[k] !== null) return row[k];
  }
  return "";
};

export default function NurseDashboard() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [patients, setPatients] = useState([]);
  const [accidents, setAccidents] = useState([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    let ok = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");

        // Patients are already hospital-scoped by your backend dependency
        const pat = await API.get("/patients/");
        if (!ok) return;
        const patientsData = pat.data || [];
        setPatients(patientsData);

        // Accidents: your route returns all accidents; we'll still fetch it
        // and join names locally using patient_id
        const acc = await API.get("/accidents/");
        if (!ok) return;
        setAccidents(acc.data || []);
      } catch (e) {
        setErr(e?.response?.data?.detail || "Failed to load dashboard");
      } finally {
        if (ok) setLoading(false);
      }
    })();
    return () => {
      ok = false;
    };
  }, []);

  // Build a quick map for patient_id -> patient object
  const patientById = useMemo(() => {
    const m = new Map();
    for (const p of patients) {
      const id = p.patient_id || p.id;
      if (id) m.set(id, p);
    }
    return m;
  }, [patients]);

  // Derive totals
  const totalPatients = patients.length;
  const totalAccidents = accidents.length;

  // Try to derive "recent" by created_at if present
  const recentPatients = useMemo(() => {
    const arr = [...patients];
    if (arr.some((r) => r.created_at)) {
      arr.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    return arr.slice(0, 8);
  }, [patients]);

  const recentAccidents = useMemo(() => {
    const arr = [...accidents];
    if (arr.some((r) => r.created_at)) {
      arr.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    return arr.slice(0, 8);
  }, [accidents]);

  // Search patients
  const filteredPatients = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return recentPatients;
    return patients
      .filter((p) => {
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
      })
      .slice(0, 10);
  }, [q, patients, recentPatients]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <NurseNav />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-gray-800">Nurse Dashboard</h1>
          <p className="text-sm text-gray-600">
            Overview of recent patients and accidents
          </p>
        </div>

        {err && (
          <div className="mb-4 p-3 rounded-md bg-red-50 text-red-700 border border-red-100">
            {err}
          </div>
        )}

        {/* Top stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Patients"
            value={loading ? "…" : totalPatients}
          />
          <StatCard
            title="Total Accidents"
            value={loading ? "…" : totalAccidents}
          />
          <StatCard
            title="Blood Group Coverage"
            value={
              loading
                ? "…"
                : new Set(
                    patients
                      .map((p) => pick(p, "Blood Group", "blood_group"))
                      .filter(Boolean)
                  ).size
            }
            subtitle="Unique blood groups recorded"
          />
          <StatCard
            title="Recent Patient Adds"
            value={loading ? "…" : recentPatients.length}
            subtitle="Showing up to 8 newest"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions + Patient Search */}
          <Section
            title="Quick Actions"
            action={
              <div className="flex gap-2">
                <Link
                  to="/nurse/record-patient"
                  className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
                >
                  + New Patient
                </Link>
                <Link
                  to="/nurse/record-accident"
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700"
                >
                  + New Accident
                </Link>
              </div>
            }
          >
            <div className="flex items-center gap-2">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search patient by name / NIC / phone"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mt-4 space-y-2">
              {loading ? (
                <div className="text-gray-500 text-sm">Loading patients…</div>
              ) : filteredPatients.length === 0 ? (
                <div className="text-gray-500 text-sm">
                  No matching patients
                </div>
              ) : (
                filteredPatients.map((p, i) => (
                  <div
                    key={p.patient_id || i}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100"
                  >
                    <div>
                      <div className="font-medium text-gray-800">
                        {pick(p, "Full Name", "full_name") || "Unnamed"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {pick(p, "Contact Number", "contact_number") || "—"} •{" "}
                        {pick(p, "Date of Birth", "date_of_birth") || "—"}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Section>

          {/* Recent Patients */}
          <Section title="Recent Patients">
            {loading ? (
              <div className="text-gray-500 text-sm">Loading…</div>
            ) : recentPatients.length === 0 ? (
              <div className="text-gray-500 text-sm">No patients yet</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="py-2 pr-4">Name</th>
                      <th className="py-2 pr-4">Phone</th>
                      <th className="py-2 pr-4">DOB</th>
                      <th className="py-2 pr-4">Blood</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPatients.map((p, i) => (
                      <tr key={p.patient_id || i} className="border-t">
                        <td className="py-2 pr-4">
                          {pick(p, "Full Name", "full_name")}
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Section>

          {/* Recent Accidents */}
          <Section title="Recent Accidents">
            {loading ? (
              <div className="text-gray-500 text-sm">Loading…</div>
            ) : recentAccidents.length === 0 ? (
              <div className="text-gray-500 text-sm">No accidents yet</div>
            ) : (
              <div className="space-y-2">
                {recentAccidents.map((a, i) => {
                  const pid = a.patient_id || a.patientId || a.patientID;
                  const p = pid ? patientById.get(pid) : null;
                  const patientName =
                    pick(
                      a,
                      "patient_name",
                      "Patient Name",
                      "Full Name",
                      "full_name"
                    ) ||
                    pick(p || {}, "Full Name", "full_name") ||
                    "Patient";
                  const date =
                    pick(a, "incident at date", "incident_date") || "—";
                  const mode =
                    pick(
                      a,
                      "Mode of traveling during accident",
                      "mode_of_travel"
                    ) || "—";
                  const coll =
                    pick(a, "Collision with", "collision_with") || "—";
                  return (
                    <div
                      key={a.accident_id || i}
                      className="p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="text-sm text-gray-800">
                        {patientName} — {date}
                      </div>
                      <div className="text-xs text-gray-500">
                        Mode: {mode} • Collision: {coll}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Section>
        </div>
      </div>
    </div>
  );
}
