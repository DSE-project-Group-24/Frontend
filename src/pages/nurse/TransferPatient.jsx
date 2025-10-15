import React, { useEffect, useMemo, useState } from "react";
import NurseNav from "../../navbars/NurseNav";
import API from "../../utils/api";

const val = (obj, ...keys) => {
  for (const k of keys)
    if (obj && obj[k] !== undefined && obj[k] !== null) return obj[k];
  return "";
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

const Chip = ({ children, tone = "blue" }) => {
  const tones = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-red-50 text-red-700 border-red-200",
    gray: "bg-gray-50 text-gray-700 border-gray-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs border ${
        tones[tone] || tones.gray
      }`}
    >
      {children}
    </span>
  );
};

const Card = ({ title, right, children }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    {(title || right) && (
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-3 border-b border-gray-100">
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        {right}
      </div>
    )}
    <div className="p-5">{children}</div>
  </div>
);

export default function TransferPatients() {
  // --- Auth from localStorage ---
  const me = {
    id: window.localStorage.getItem("user_id") || "",
    name: window.localStorage.getItem("name") || "",
    role: window.localStorage.getItem("role") || "nurse",
  };
  const myHospital = {
    hospital_id: window.localStorage.getItem("hospital_id") || "",
    name: window.localStorage.getItem("hospital_name") || "",
  };

  // --- Patients ---
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoadingPatients(true);
        const r = await API.get("/patients");
        setPatients(r.data || []);
      } catch (e) {
        console.error("Failed to fetch patients", e);
      } finally {
        setLoadingPatients(false);
      }
    })();
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

  const [selectedPatient, setSelectedPatient] = useState(null);

  // --- Accident Records ---
  const [accidents, setAccidents] = useState([]);
  const [loadingAccidents, setLoadingAccidents] = useState(false);

  useEffect(() => {
    (async () => {
      if (!selectedPatient) return;
      const pid =
        selectedPatient.id ??
        selectedPatient.patient_id ??
        selectedPatient.user_id ??
        null;
      if (!pid) return;
      try {
        setLoadingAccidents(true);
        const r = await API.get(`/accidents/patient/${pid}`);
        setAccidents(r.data || []);
      } catch (e) {
        console.error("Failed to fetch accidents", e);
        setAccidents([]);
      } finally {
        setLoadingAccidents(false);
      }
    })();
  }, [selectedPatient]);

  // --- Hospitals for destination ---
  const [hospitals, setHospitals] = useState([]);
  const [loadingHospitals, setLoadingHospitals] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        setLoadingHospitals(true);
        const r = await API.get("/hospital/hospital_list");
        setHospitals(
          (r.data || []).sort((a, b) =>
            (a.name || "").localeCompare(b.name || "")
          )
        );
      } catch (e) {
        console.error("Failed to load hospitals", e);
      } finally {
        setLoadingHospitals(false);
      }
    })();
  }, []);

  // --- Outgoing transfers (for pending detection) ---
  const [outgoing, setOutgoing] = useState([]);
  const [loadingOutgoing, setLoadingOutgoing] = useState(false);

  const loadOutgoing = async () => {
    try {
      setLoadingOutgoing(true);
      const r = await API.get("/transfers/outgoing");
      setOutgoing(r.data || []);
    } catch (e) {
      console.error("Failed to load outgoing transfers", e);
      setOutgoing([]);
    } finally {
      setLoadingOutgoing(false);
    }
  };

  useEffect(() => {
    loadOutgoing();
  }, []);

  const findHospitalName = (hid) =>
    (hospitals.find((h) => String(h.hospital_id) === String(hid)) || {}).name ||
    hid ||
    "";

  // A helper that returns the pending transfer for an accident (if any)
  const getPendingForAccident = (accident_id) => {
    if (!accident_id) return null;
    const pending = outgoing.find(
      (t) =>
        String(t.accident_id) === String(accident_id) &&
        (t.approved_by === null || t.approved_by === undefined)
    );
    return pending || null;
  };

  // --- Transfer State ---
  const [selectedAccident, setSelectedAccident] = useState(null);
  const [toHospital, setToHospital] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [submitting, setSubmitting] = useState(false);

  const resetTransfer = () => {
    setSelectedAccident(null);
    setToHospital("");
    setMessage({ type: "", text: "" });
  };

  const selectedPending = selectedAccident
    ? getPendingForAccident(selectedAccident.accident_id)
    : null;

  const canTransfer =
    !!selectedAccident &&
    !!toHospital &&
    !!myHospital.hospital_id &&
    toHospital !== myHospital.hospital_id &&
    !selectedAccident?.Completed &&
    selectedAccident?.managed_by === me.id &&
    !selectedPending; // <-- BLOCK if already pending

  const doTransfer = async () => {
    try {
      setSubmitting(true);
      setMessage({ type: "", text: "" });
      await API.post("/transfers/", {
        accident_id: selectedAccident.accident_id,
        to_hospital: toHospital,
      });
      setMessage({
        type: "success",
        text: "Transfer request created. Awaiting approval by destination admin.",
      });
      setToHospital("");
      await loadOutgoing(); // refresh pending list
    } catch (e) {
      const err =
        e?.response?.data?.detail ||
        e?.response?.data?.message ||
        "Failed to create transfer.";
      setMessage({ type: "error", text: String(err) });
    } finally {
      setSubmitting(false);
    }
  };

  const cancelPending = async () => {
    if (!selectedPending) return;
    try {
      setSubmitting(true);
      setMessage({ type: "", text: "" });
      // Assumes backend allows nurse to delete their own pending outgoing transfer:
      await API.delete(`/transfers/${selectedPending.transfer_id}`);
      setMessage({ type: "success", text: "Transfer request cancelled." });
      await loadOutgoing(); // refresh
    } catch (e) {
      const err =
        e?.response?.data?.detail ||
        e?.response?.data?.message ||
        "Failed to cancel transfer.";
      setMessage({ type: "error", text: String(err) });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <NurseNav />
      <div className="max-w-6xl mx-auto p-4">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-gray-800">
            Transfer Patients
          </h2>
          <p className="text-sm text-gray-600">
            You can only request a transfer for accident records managed by you,
            not completed, and not already pending transfer.
          </p>
        </div>

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Patients List */}
          <Card
            title="Patients"
            right={
              <div className="text-xs text-gray-600">
                Your hospital:{" "}
                <b>{myHospital.name || myHospital.hospital_id}</b>
              </div>
            }
          >
            <div className="mb-3">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name / NIC / phone / DOB"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
              />
            </div>
            {loadingPatients ? (
              <div className="text-sm text-gray-500">Loading patients…</div>
            ) : filteredPatients.length === 0 ? (
              <div className="text-sm text-gray-500">No patients found.</div>
            ) : (
              <div className="max-h-96 overflow-y-auto space-y-2">
                {filteredPatients.map((p, idx) => {
                  const pid = p.id ?? p.patient_id ?? idx;
                  const isSelected =
                    selectedPatient &&
                    (selectedPatient.id ?? selectedPatient.patient_id ?? "") ===
                      (p.id ?? p.patient_id ?? "");
                  return (
                    <button
                      key={pid}
                      onClick={() => {
                        setSelectedPatient(p);
                        resetTransfer();
                      }}
                      className={`w-full text-left p-3 rounded-lg border ${
                        isSelected
                          ? "bg-blue-100 border-blue-200"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <div className="font-medium">
                        {val(p, "Full Name", "full_name", "name") || "No name"}
                      </div>
                      <div className="text-xs text-gray-600">
                        {val(p, "Contact Number", "contact_number") ||
                          "No Contact"}{" "}
                        • {val(p, "Date of Birth", "date_of_birth") || "No DOB"}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Accidents & Transfer */}
          <div className="flex flex-col gap-6">
            <Card title="Accident Records">
              {!selectedPatient ? (
                <div className="text-sm text-gray-500">
                  Select a patient to view records.
                </div>
              ) : loadingAccidents || loadingOutgoing ? (
                <div className="text-sm text-gray-500">
                  Loading accident records…
                </div>
              ) : accidents.length === 0 ? (
                <div className="text-sm text-gray-500">
                  No accident records for this patient.
                </div>
              ) : (
                <div className="space-y-2">
                  {accidents.map((rec) => {
                    const created = new Date(
                      rec.created_on || rec.createdAt || rec.created_at
                    );
                    const dateStr = isNaN(created.getTime())
                      ? "—"
                      : created.toLocaleString();

                    const ownedByMe = rec.managed_by === me.id;
                    const pending = getPendingForAccident(rec.accident_id);
                    const canTransferRecord =
                      ownedByMe && !rec.Completed && !pending;

                    return (
                      <div
                        key={rec.accident_id}
                        className={`p-3 rounded-lg border ${
                          canTransferRecord
                            ? "bg-gray-50 hover:bg-blue-50 cursor-pointer"
                            : "bg-gray-100 " + (ownedByMe ? "" : "opacity-60")
                        }`}
                        onClick={() => {
                          if (ownedByMe) setSelectedAccident(rec);
                        }}
                        title={
                          canTransferRecord
                            ? "Click to select for transfer"
                            : ownedByMe
                            ? pending
                              ? "This record already has a pending transfer"
                              : "Completed record cannot be transferred"
                            : "You do not manage this record"
                        }
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-800">
                              {dateStr}
                            </div>
                            <div className="text-xs text-gray-600 flex items-center gap-2">
                              <span>
                                Managed by:{" "}
                                {rec.managed_by_name || rec.managed_by}
                              </span>
                              {pending && (
                                <Chip tone="amber">Pending transfer</Chip>
                              )}
                            </div>
                          </div>
                          <StatusBadge completed={!!rec.Completed} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* Transfer Creation / Pending UI */}
            <Card title="Transfer">
              {!selectedAccident ? (
                <div className="text-sm text-gray-500">
                  Choose a record you manage.
                </div>
              ) : selectedPending ? (
                // ----- Pending transfer details + cancel -----
                <div className="space-y-3">
                  <div className="text-sm text-gray-700">
                    <div>
                      Selected accident: <b>{selectedAccident.accident_id}</b>
                    </div>
                    <div className="mt-2">
                      Status: <Chip tone="amber">Pending transfer</Chip>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        From hospital
                      </label>
                      <input
                        disabled
                        value={myHospital.name || myHospital.hospital_id}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        To hospital
                      </label>
                      <input
                        disabled
                        value={findHospitalName(selectedPending.to_hospital)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded bg-gray-100"
                      />
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    This record already has a pending transfer. You can cancel
                    it below if needed.
                  </div>

                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={cancelPending}
                      disabled={submitting}
                      className={`px-4 py-2 rounded-lg text-sm ${
                        submitting
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-red-600 text-white hover:bg-red-700"
                      }`}
                    >
                      {submitting ? "Cancelling…" : "Cancel transfer"}
                    </button>
                  </div>
                </div>
              ) : (
                // ----- Create transfer form -----
                <>
                  <div className="text-sm text-gray-700 mb-3">
                    Selected accident: <b>{selectedAccident.accident_id}</b>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        From hospital
                      </label>
                      <input
                        disabled
                        value={myHospital.name || myHospital.hospital_id}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        To hospital
                      </label>
                      <select
                        value={toHospital}
                        onChange={(e) => setToHospital(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded bg-white"
                        disabled={loadingHospitals}
                      >
                        <option value="">Select hospital…</option>
                        {hospitals.map((h) => (
                          <option key={h.hospital_id} value={h.hospital_id}>
                            {h.name || h.hospital_id}
                          </option>
                        ))}
                      </select>
                      {toHospital && toHospital === myHospital.hospital_id && (
                        <div className="text-xs text-red-600 mt-1">
                          Destination must be different from your current
                          hospital.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mt-3">
                    You can only transfer records you manage. Approved fields
                    are filled later by the destination admin.
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={doTransfer}
                      disabled={!canTransfer || submitting}
                      className={`px-4 py-2 rounded-lg text-sm ${
                        !canTransfer || submitting
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {submitting ? "Submitting…" : "Request transfer"}
                    </button>
                  </div>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
