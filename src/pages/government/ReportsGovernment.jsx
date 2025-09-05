import React, { useEffect, useMemo, useState } from "react";
import GovernmentNav from "../../navbars/GovernmentNav";

const API_BASE = import.meta?.env?.VITE_API_BASE || "http://localhost:8000";

/* ---------------- Utils: token grouping & translation ---------------- */

function splitToken(token) {
  const idx = token.indexOf("_");
  if (idx === -1) return { col: "Other", val: token };
  return { col: token.slice(0, idx), val: token.slice(idx + 1) };
}
function groupTokens(tokens) {
  const map = new Map();
  tokens.forEach((t) => {
    const { col, val } = splitToken(t);
    if (!map.has(col)) map.set(col, new Set());
    map.get(col).add(val);
  });
  return Array.from(map.entries())
    .map(([column, set]) => ({
      column,
      values: Array.from(set).sort(),
    }))
    .sort((a, b) => a.column.localeCompare(b.column));
}
function filtersToTokens(filters) {
  const out = [];
  filters.forEach((f) => {
    if (!f.selected || f.selected.length === 0) return; // no constraint on this column
    f.selected.forEach((v) => out.push(`${f.column}_${v}`));
  });
  return out;
}

/* ---------------- Small UI bits ---------------- */

const Pill = ({ children }) => (
  <span className="inline-flex items-center rounded-full border px-2 py-1 text-xs bg-white text-slate-700">
    {children}
  </span>
);

const NumberInput = ({
  label,
  value,
  onChange,
  step = "0.01",
  min = "0",
  max = "1",
  width = "w-28",
}) => (
  <label className="flex items-center gap-2 text-sm text-slate-700">
    {label}
    <input
      type="number"
      step={step}
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`rounded-md border border-slate-300 bg-white px-2 py-1 ${width} text-slate-900`}
    />
  </label>
);

const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse rounded bg-slate-200 ${className}`} />
);

/* ---------------- FilterBuilder: add column → pick categories ---------------- */

function FilterBuilder({ title, grouped, value, onChange, hint }) {
  const [draftCol, setDraftCol] = useState("");
  const [draftVals, setDraftVals] = useState([]);

  const colOptions = grouped.map((g) => g.column);
  const currentValues = useMemo(() => {
    const g = grouped.find((x) => x.column === draftCol);
    return g ? g.values : [];
  }, [grouped, draftCol]);

  const resetDraft = () => {
    setDraftCol("");
    setDraftVals([]);
  };

  const addFilter = () => {
    if (!draftCol) return;
    const next = value.slice();
    const idx = next.findIndex((f) => f.column === draftCol);
    if (idx >= 0) next[idx] = { column: draftCol, selected: draftVals.slice() };
    else next.push({ column: draftCol, selected: draftVals.slice() });
    onChange(next);
    resetDraft();
  };

  const removeFilter = (column) =>
    onChange(value.filter((f) => f.column !== column));

  const toggleDraftVal = (v) => {
    const s = new Set(draftVals);
    s.has(v) ? s.delete(v) : s.add(v);
    setDraftVals(Array.from(s));
  };

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      {hint && <p className="text-xs text-slate-600">{hint}</p>}

      <div className="space-y-2">
        {value.length === 0 ? (
          <p className="text-xs text-slate-500">No filters added.</p>
        ) : (
          value.map((f) => (
            <div
              key={f.column}
              className="rounded-lg border bg-white p-3 shadow-sm"
            >
              <div className="mb-1 flex items-center justify-between">
                <div className="text-sm font-medium text-slate-800">
                  {f.column}
                </div>
                <button
                  onClick={() => removeFilter(f.column)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
              <div className="text-xs text-slate-600">
                {!f.selected || f.selected.length === 0 ? (
                  <em>All categories (no restriction)</em>
                ) : (
                  f.selected.join(", ")
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="rounded-lg border bg-white p-3 shadow-sm">
        <div className="grid gap-3">
          <div>
            <label className="text-xs text-slate-600">Column</label>
            <select
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-sm"
              value={draftCol}
              onChange={(e) => {
                setDraftCol(e.target.value);
                setDraftVals([]);
              }}
            >
              <option value="">— choose —</option>
              {colOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {draftCol && (
            <div>
              <label className="text-xs text-slate-600">Categories</label>
              <div className="mt-1 max-h-40 overflow-auto rounded border border-slate-200 p-2">
                {currentValues.map((v) => {
                  const checked = draftVals.includes(v);
                  return (
                    <label
                      key={v}
                      className="mr-4 inline-flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300"
                        checked={checked}
                        onChange={() => toggleDraftVal(v)}
                      />
                      <span className="select-none">{v}</span>
                    </label>
                  );
                })}
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Leave all unchecked to include <b>all</b> categories for this
                column.
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={addFilter}
              disabled={!draftCol}
              className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white disabled:opacity-60"
            >
              Add / Update filter
            </button>
            <button
              onClick={resetDraft}
              className="rounded-md border px-3 py-1.5 text-sm"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- TargetPicker: RHS exact = pick column → pick ONE category ---------------- */

function TargetPicker({
  title,
  grouped,
  enabled,
  onToggle,
  targetCol,
  setTargetCol,
  targetVal,
  setTargetVal,
}) {
  const colOptions = grouped.map((g) => g.column);
  const currentValues = React.useMemo(() => {
    const g = grouped.find((x) => x.column === targetCol);
    return g ? g.values : [];
  }, [grouped, targetCol]);

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      <div className="rounded-lg border bg-white p-3 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <input
            id="rhs-exact"
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300"
            checked={enabled}
            onChange={() => onToggle(!enabled)}
          />
          <label htmlFor="rhs-exact" className="text-sm text-slate-700">
            Enable
          </label>
        </div>

        {enabled && (
          <>
            <div>
              <label className="text-xs text-slate-600">Column</label>
              <select
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-sm"
                value={targetCol}
                onChange={(e) => {
                  setTargetCol(e.target.value);
                  setTargetVal("");
                }}
              >
                <option value="">— choose —</option>
                {colOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {targetCol && (
              <div>
                <label className="text-xs text-slate-600">Category</label>
                <div className="mt-1 max-h-40 overflow-auto rounded border border-slate-200 p-2">
                  {currentValues.map((v) => (
                    <label
                      key={v}
                      className="mr-4 inline-flex items-center gap-2 text-sm"
                    >
                      <input
                        type="radio"
                        name="rhs-target-radio"
                        className="h-4 w-4 border-slate-300"
                        checked={targetVal === v}
                        onChange={() => setTargetVal(v)}
                      />
                      <span className="select-none">{v}</span>
                    </label>
                  ))}
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  The consequent will be{" "}
                  <b>{targetCol ? `${targetCol}_${targetVal || "…"}` : "—"}</b>.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

/* ---------------- Main page ---------------- */

const ReportsGovernment = ({ setIsAuthenticated, setRole }) => {
  const [tokens, setTokens] = useState([]);
  const [bootLoading, setBootLoading] = useState(true);
  const [bootError, setBootError] = useState("");

  // Structured filters
  const [preFilters, setPreFilters] = useState([]); // [{ column, selected:[] }]
  const [postAFilters, setPostAFilters] = useState([]);
  const [postCFilters, setPostCFilters] = useState([]);

  // Thresholds
  const [minSupport, setMinSupport] = useState(0.02);
  const [minConfidence, setMinConfidence] = useState(0.3);

  // RHS exact (picker state)
  const [rhsExact, setRhsExact] = useState(false);
  const [rhsTargetCol, setRhsTargetCol] = useState("");
  const [rhsTargetVal, setRhsTargetVal] = useState("");

  // Results
  const [running, setRunning] = useState(false);
  const [stats, setStats] = useState(null);
  const [rules, setRules] = useState([]);

  const grouped = useMemo(() => groupTokens(tokens), [tokens]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const r = await fetch(`${API_BASE}/gov/rules/bootstrap`);
        if (!r.ok) throw new Error(`Bootstrap failed: ${r.status}`);
        const data = await r.json();
        if (!mounted) return;
        setTokens(data.tokens || []);
        if (data.defaults) {
          setMinSupport(data.defaults.min_support ?? 0.02);
          setMinConfidence(data.defaults.min_confidence ?? 0.3);
        }
      } catch (e) {
        setBootError(String(e.message || e));
      } finally {
        if (mounted) setBootLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  const chipBar = useMemo(() => {
    const preTokens = filtersToTokens(preFilters);
    const chips = [];
    if (preTokens.length)
      chips.push(
        `Pre: ${preTokens.slice(0, 5).join(" • ")}${
          preTokens.length > 5 ? " …" : ""
        }`
      );
    if (rhsExact && rhsTargetCol && rhsTargetVal)
      chips.push(`RHS: ${rhsTargetCol}_${rhsTargetVal}`);
    chips.push(`min_sup ${minSupport}`);
    chips.push(`min_conf ${minConfidence}`);
    return chips;
  }, [
    preFilters,
    rhsExact,
    rhsTargetCol,
    rhsTargetVal,
    minSupport,
    minConfidence,
  ]);

  const runApriori = async () => {
    setRunning(true);
    try {
      const rhsToken =
        rhsExact && rhsTargetCol && rhsTargetVal
          ? `${rhsTargetCol}_${rhsTargetVal}`
          : null;

      if (rhsExact && !rhsToken) {
        alert(
          "Please choose a column and a category for the exact RHS target."
        );
        setRunning(false);
        return;
      }

      const body = {
        pre: {
          target_consequents: filtersToTokens(preFilters),
          min_support: Number(minSupport),
          min_confidence: Number(minConfidence),
          max_len_antecedent: 4,
          max_rules: 20,
        },
        post: {
          antecedents_contains: filtersToTokens(postAFilters),
          consequents_contains: filtersToTokens(postCFilters),
          rhs_exact: rhsExact,
          rhs_target: rhsToken,
        },
        sort: { by: "lift", order: "desc" },
      };

      const r = await fetch(`${API_BASE}/gov/rules/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await r.json();
      setStats(data.stats || null);
      setRules(data.rules || []);
    } catch (e) {
      alert("Failed to run Apriori. Check console.");
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <GovernmentNav
        setIsAuthenticated={setIsAuthenticated}
        setRole={setRole}
      />

      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div className="container mx-auto flex flex-col gap-2 px-4 py-4">
          <h1 className="text-lg font-semibold text-slate-900">
            Government Reports — Association Rules
          </h1>
          <div className="flex flex-wrap gap-2">
            {chipBar.map((c, i) => (
              <Pill key={i}>{c}</Pill>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <NumberInput
              label="Min Support"
              value={minSupport}
              onChange={setMinSupport}
              step="0.005"
            />
            <NumberInput
              label="Min Confidence"
              value={minConfidence}
              onChange={setMinConfidence}
              step="0.05"
            />
            <button
              onClick={runApriori}
              disabled={running || bootLoading}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {running ? "Running…" : "Run Apriori"}
            </button>
          </div>
          {bootError && <div className="text-sm text-red-600">{bootError}</div>}
        </div>
      </header>

      {/* Body */}
      <main className="container mx-auto grid grid-cols-12 gap-6 px-4 py-6">
        {/* Left: PRE */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          {bootLoading ? (
            <Skeleton className="h-48" />
          ) : (
            <FilterBuilder
              title="Pre — Target Consequents (dataset)"
              grouped={grouped}
              value={preFilters}
              onChange={setPreFilters}
              hint="Records must include at least one selected category per chosen column. If a column has no categories selected, it imposes no restriction."
            />
          )}
        </div>

        {/* Center: Results */}
        <div className="col-span-12 lg:col-span-6 space-y-4">
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Results</h2>
              <div className="text-xs text-slate-600">
                {stats ? (
                  <>
                    {stats.pre_filtered_records?.toLocaleString?.()} records •
                    min_sup {stats.min_support ?? minSupport} • min_conf{" "}
                    {stats.min_confidence ?? minConfidence}
                  </>
                ) : (
                  "—"
                )}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-600">
                    <th className="px-2 py-1">Antecedents</th>
                    <th className="px-2 py-1">Consequents</th>
                    <th className="px-2 py-1">Support</th>
                    <th className="px-2 py-1">Confidence</th>
                    <th className="px-2 py-1">Lift</th>
                  </tr>
                </thead>
                <tbody>
                  {running ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i} className="border-t">
                        <td className="px-2 py-2">
                          <Skeleton className="h-4 w-40" />
                        </td>
                        <td className="px-2 py-2">
                          <Skeleton className="h-4 w-40" />
                        </td>
                        <td className="px-2 py-2">
                          <Skeleton className="h-4 w-12" />
                        </td>
                        <td className="px-2 py-2">
                          <Skeleton className="h-4 w-12" />
                        </td>
                        <td className="px-2 py-2">
                          <Skeleton className="h-4 w-12" />
                        </td>
                      </tr>
                    ))
                  ) : rules.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-2 py-8 text-center text-slate-400"
                      >
                        No rules — add filters and run.
                      </td>
                    </tr>
                  ) : (
                    rules.map((r, i) => (
                      <tr key={i} className="border-t align-top">
                        <td className="px-2 py-2">
                          <div className="flex flex-wrap gap-1">
                            {r.antecedents.map((a) => (
                              <Pill key={a}>{a}</Pill>
                            ))}
                          </div>
                        </td>
                        <td className="px-2 py-2">
                          <div className="flex flex-wrap gap-1">
                            {r.consequents.map((c) => (
                              <Pill key={c}>{c}</Pill>
                            ))}
                          </div>
                        </td>
                        <td className="px-2 py-2 tabular-nums">
                          {Number(r.support).toFixed(4)}
                        </td>
                        <td className="px-2 py-2 tabular-nums">
                          {Number(r.confidence).toFixed(4)}
                        </td>
                        <td className="px-2 py-2 tabular-nums font-semibold">
                          {Number(r.lift).toFixed(4)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: POST */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          {bootLoading ? (
            <Skeleton className="h-48" />
          ) : (
            <>
              <FilterBuilder
                title="Post — Antecedents must contain"
                grouped={grouped}
                value={postAFilters}
                onChange={setPostAFilters}
              />
              <FilterBuilder
                title="Post — Consequents must contain"
                grouped={grouped}
                value={postCFilters}
                onChange={setPostCFilters}
              />
              <TargetPicker
                title="Post — RHS must be exactly target"
                grouped={grouped}
                enabled={rhsExact}
                onToggle={setRhsExact}
                targetCol={rhsTargetCol}
                setTargetCol={setRhsTargetCol}
                targetVal={rhsTargetVal}
                setTargetVal={setRhsTargetVal}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ReportsGovernment;
