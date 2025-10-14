// src/pages/admin/ApproveTransfers.jsx
import React, { useEffect, useMemo, useState } from "react";
import AdminNav from "../../navbars/AdminNav";
import API from "../../utils/api";

const TIME_OPTIONS = [
  "Less Than 15 Minutes",
  "15 Minutes - 30 Minutes",
  "30 Minutes - 1 Hour",
  "1 Hour - 2 Hour",
  "More Than 2 Hour",
  "Unknown",
];

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

const Row = ({ label, children }) => (
  <div className="flex items-center justify-between py-1.5">
    <span className="text-sm text-gray-500">{label}</span>
    <div className="text-sm text-gray-800">{children}</div>
  </div>
);

export default function ApproveTransfers() {
  // --- Auth / context from localStorage ---
  const me = {
    id: localStorage.getItem("user_id") || "",
    name: localStorage.getItem("name") || "",
    role: localStorage.getItem("role") || "",
  };
  const myHospital = {
    id: localStorage.getItem("hospital_id") || "",
    name: localStorage.getItem("hospital_name") || "",
  };

  // Optional guard — avoid rendering the page for non-admins
  if (me.role !== "hospital_administrator") {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        <div className="max-w-4xl mx-auto p-6">
          <div className="rounded-lg border bg-white p-4">
            Only hospital administrators can view this page.
          </div>
        </div>
      </div>
    );
  }

  // --- Data state ---
  const [loading, setLoading] = useState(true);
  const [transfers, setTransfers] = useState([]); // pending incoming transfers
  const [nurses, setNurses] = useState([]); // [{ user_id, name }]
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Selection state for approval form, keyed by transfer_id
  const [selectedNurse, setSelectedNurse] = useState({});
  const [selectedTime, setSelectedTime] = useState({});
  const [submittingId, setSubmittingId] = useState(null);

  // --- Fetch pending transfers & nurses (admin's hospital only) ---
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        setSuccess("");

        const [trRes, nurseRes] = await Promise.all([
          API.get("/transfers/incoming"),
          API.get("hospital/nurses-list"), // returns [{ user_id, name }]
        ]);

        setTransfers(trRes.data || []);
        setNurses(
          (nurseRes.data || []).map((n) => ({
            user_id: n.user_id,
            name: n.name || "Unnamed Nurse",
          }))
        );
      } catch (e) {
        const msg =
          e?.response?.data?.detail ||
          e?.response?.data?.message ||
          "Failed to load transfers.";
        setError(String(msg));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // For quick filtering/searching if needed later
  const sortedTransfers = useMemo(() => {
    const copy = [...transfers];
    // If your transfer rows have created_on, you can sort by it. Otherwise stable by id.
    return copy.sort((a, b) =>
      String(a.transfer_id || "").localeCompare(String(b.transfer_id || ""))
    );
  }, [transfers]);

  const approve = async (t) => {
    const transfer_id = t.transfer_id;
    const nurseId = selectedNurse[transfer_id] || "";
    const timeCat = selectedTime[transfer_id] || "";

    if (!nurseId || !timeCat) {
      setError("Please select a nurse and a transfer time.");
      return;
    }

    try {
      setSubmittingId(transfer_id);
      setError("");
      setSuccess("");

      await API.post(`/transfers/${transfer_id}/approve`, {
        new_nurse_user_id: nurseId,
        transfer_time_category: timeCat,
      });

      setTransfers((prev) => prev.filter((x) => x.transfer_id !== transfer_id));
      setSuccess("Transfer approved successfully.");
    } catch (e) {
      const msg =
        e?.response?.data?.detail ||
        e?.response?.data?.message ||
        "Approval failed.";
      setError(String(msg));
    } finally {
      setSubmittingId(null);
    }
  };

  const reject = async (t) => {
    const transfer_id = t.transfer_id;
    try {
      setSubmittingId(transfer_id);
      setError("");
      setSuccess("");

      await API.delete(`/transfers/${transfer_id}`);

      setTransfers((prev) => prev.filter((x) => x.transfer_id !== transfer_id));
      setSuccess("Transfer rejected and removed.");
    } catch (e) {
      const msg =
        e?.response?.data?.detail ||
        e?.response?.data?.message ||
        "Reject failed.";
      setError(String(msg));
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <AdminNav />
      <div className="max-w-6xl mx-auto p-4">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-gray-800">
            Approve Transfers
          </h2>
          <p className="text-sm text-gray-600">
            Incoming transfer requests to{" "}
            <b>{myHospital.name || myHospital.id}</b>
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-md border bg-red-50 text-red-700 border-red-200">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded-md border bg-green-50 text-green-700 border-green-200">
            {success}
          </div>
        )}

        <Card
          title="Pending Transfers"
          right={
            <div className="text-xs text-gray-600">
              Total: <b>{transfers.length}</b>
            </div>
          }
        >
          {loading ? (
            <div className="text-sm text-gray-500">Loading…</div>
          ) : transfers.length === 0 ? (
            <div className="text-sm text-gray-500">No pending transfers.</div>
          ) : (
            <div className="space-y-4">
              {sortedTransfers.map((t) => {
                const tid = t.transfer_id;
                const disabled = submittingId === tid;

                return (
                  <div
                    key={tid}
                    className="rounded-xl border bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">
                          Transfer #{tid?.slice(0, 8) || "—"}
                        </div>
                        <div className="mt-2 space-y-1">
                          <Row label="Accident ID">
                            <span className="font-mono text-xs">
                              {t.accident_id || "—"}
                            </span>
                          </Row>
                          <Row label="From hospital">
                            <span className="font-mono text-xs">
                              {t.from_hospital || "—"}
                            </span>
                          </Row>
                          <Row label="To hospital">
                            <span className="font-mono text-xs">
                              {t.to_hospital || "—"}
                            </span>
                          </Row>
                          {/* If your table has created_on or requested_by etc., show them here */}
                        </div>
                      </div>

                      <div className="w-full max-w-sm">
                        <div className="grid grid-cols-1 gap-3">
                          <div>
                            <label className="text-sm font-medium text-gray-700">
                              Assign to nurse
                            </label>
                            <select
                              className="mt-1 block w-full p-2 border border-gray-300 rounded bg-white"
                              value={selectedNurse[tid] || ""}
                              onChange={(e) =>
                                setSelectedNurse((m) => ({
                                  ...m,
                                  [tid]: e.target.value,
                                }))
                              }
                              disabled={disabled}
                            >
                              <option value="">Select a nurse…</option>
                              {nurses.map((n) => (
                                <option key={n.user_id} value={n.user_id}>
                                  {n.name} ({n.user_id.slice(0, 6)})
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-gray-700">
                              Transfer time to second hospital
                            </label>
                            <select
                              className="mt-1 block w-full p-2 border border-gray-300 rounded bg-white"
                              value={selectedTime[tid] || ""}
                              onChange={(e) =>
                                setSelectedTime((m) => ({
                                  ...m,
                                  [tid]: e.target.value,
                                }))
                              }
                              disabled={disabled}
                            >
                              <option value="">Select time…</option>
                              {TIME_OPTIONS.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                              onClick={() => reject(t)}
                              disabled={disabled}
                              className={`px-3 py-1.5 rounded-lg border text-sm ${
                                disabled
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  : "bg-white hover:bg-gray-50 text-gray-700"
                              }`}
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => approve(t)}
                              disabled={
                                disabled ||
                                !selectedNurse[tid] ||
                                !selectedTime[tid]
                              }
                              className={`px-3 py-1.5 rounded-lg text-sm ${
                                disabled ||
                                !selectedNurse[tid] ||
                                !selectedTime[tid]
                                  ? "bg-blue-200 text-white cursor-not-allowed"
                                  : "bg-blue-600 text-white hover:bg-blue-700"
                              }`}
                            >
                              {disabled ? "Working…" : "Approve"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
