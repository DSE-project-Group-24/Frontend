// import React, { useEffect, useMemo, useState } from "react";
// import GovernmentNav from "../../navbars/GovernmentNav";
// import API from "../../utils/api";

// /* ---------------- Utils: token grouping & translation ---------------- */

// function splitToken(token) {
//   const idx = token.indexOf("_");
//   if (idx === -1) return { col: "Other", val: token };
//   return { col: token.slice(0, idx), val: token.slice(idx + 1) };
// }
// function groupTokens(tokens) {
//   const map = new Map();
//   tokens.forEach((t) => {
//     const { col, val } = splitToken(t);
//     if (!map.has(col)) map.set(col, new Set());
//     map.get(col).add(val);
//   });
//   return Array.from(map.entries())
//     .map(([column, set]) => ({
//       column,
//       values: Array.from(set).sort(),
//     }))
//     .sort((a, b) => a.column.localeCompare(b.column));
// }
// function filtersToTokens(filters) {
//   const out = [];
//   filters.forEach((f) => {
//     if (!f.selected || f.selected.length === 0) return; // no constraint on this column
//     f.selected.forEach((v) => out.push(`${f.column}_${v}`));
//   });
//   return out;
// }

// /* ---------------- Small UI bits ---------------- */

// const Pill = ({ children }) => (
//   <span className="inline-flex items-center rounded-full border px-2 py-1 text-xs bg-white text-slate-700">
//     {children}
//   </span>
// );

// const NumberInput = ({
//   label,
//   value,
//   onChange,
//   step = "0.01",
//   min = "0",
//   max = "1",
//   width = "w-28",
// }) => (
//   <label className="flex items-center gap-2 text-sm text-slate-700">
//     {label}
//     <input
//       type="number"
//       step={step}
//       min={min}
//       max={max}
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       className={`rounded-md border border-slate-300 bg-white px-2 py-1 ${width} text-slate-900`}
//     />
//   </label>
// );

// const Skeleton = ({ className = "" }) => (
//   <div className={`animate-pulse rounded bg-slate-200 ${className}`} />
// );

// /* ---------------- FilterBuilder: add column → pick categories ---------------- */

// function FilterBuilder({ title, grouped, value, onChange, hint }) {
//   const [draftCol, setDraftCol] = useState("");
//   const [draftVals, setDraftVals] = useState([]);

//   const colOptions = grouped.map((g) => g.column);
//   const currentValues = useMemo(() => {
//     const g = grouped.find((x) => x.column === draftCol);
//     return g ? g.values : [];
//   }, [grouped, draftCol]);

//   const resetDraft = () => {
//     setDraftCol("");
//     setDraftVals([]);
//   };

//   const addFilter = () => {
//     if (!draftCol) return;
//     const next = value.slice();
//     const idx = next.findIndex((f) => f.column === draftCol);
//     if (idx >= 0) next[idx] = { column: draftCol, selected: draftVals.slice() };
//     else next.push({ column: draftCol, selected: draftVals.slice() });
//     onChange(next);
//     resetDraft();
//   };

//   const removeFilter = (column) =>
//     onChange(value.filter((f) => f.column !== column));

//   const toggleDraftVal = (v) => {
//     const s = new Set(draftVals);
//     s.has(v) ? s.delete(v) : s.add(v);
//     setDraftVals(Array.from(s));
//   };

//   return (
//     <section className="space-y-3">
//       <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
//       {hint && <p className="text-xs text-slate-600">{hint}</p>}

//       <div className="space-y-2">
//         {value.length === 0 ? (
//           <p className="text-xs text-slate-500">No filters added.</p>
//         ) : (
//           value.map((f) => (
//             <div
//               key={f.column}
//               className="rounded-lg border bg-white p-3 shadow-sm"
//             >
//               <div className="mb-1 flex items-center justify-between">
//                 <div className="text-sm font-medium text-slate-800">
//                   {f.column}
//                 </div>
//                 <button
//                   onClick={() => removeFilter(f.column)}
//                   className="text-xs text-red-600 hover:underline"
//                 >
//                   Remove
//                 </button>
//               </div>
//               <div className="text-xs text-slate-600">
//                 {!f.selected || f.selected.length === 0 ? (
//                   <em>All categories (no restriction)</em>
//                 ) : (
//                   f.selected.join(", ")
//                 )}
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       <div className="rounded-lg border bg-white p-3 shadow-sm">
//         <div className="grid gap-3">
//           <div>
//             <label className="text-xs text-slate-600">Column</label>
//             <select
//               className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-sm"
//               value={draftCol}
//               onChange={(e) => {
//                 setDraftCol(e.target.value);
//                 setDraftVals([]);
//               }}
//             >
//               <option value="">— choose —</option>
//               {colOptions.map((c) => (
//                 <option key={c} value={c}>
//                   {c}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {draftCol && (
//             <div>
//               <label className="text-xs text-slate-600">Categories</label>
//               <div className="mt-1 max-h-40 overflow-auto rounded border border-slate-200 p-2">
//                 {currentValues.map((v) => {
//                   const checked = draftVals.includes(v);
//                   return (
//                     <label
//                       key={v}
//                       className="mr-4 inline-flex items-center gap-2 text-sm"
//                     >
//                       <input
//                         type="checkbox"
//                         className="h-4 w-4 rounded border-slate-300"
//                         checked={checked}
//                         onChange={() => toggleDraftVal(v)}
//                       />
//                       <span className="select-none">{v}</span>
//                     </label>
//                   );
//                 })}
//               </div>
//               <p className="mt-1 text-xs text-slate-500">
//                 Leave all unchecked to include <b>all</b> categories for this
//                 column.
//               </p>
//             </div>
//           )}

//           <div className="flex gap-2">
//             <button
//               onClick={addFilter}
//               disabled={!draftCol}
//               className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white disabled:opacity-60"
//             >
//               Add / Update filter
//             </button>
//             <button
//               onClick={resetDraft}
//               className="rounded-md border px-3 py-1.5 text-sm"
//             >
//               Clear
//             </button>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// /* ---------------- TargetPicker: RHS exact = pick column → pick ONE category ---------------- */

// function TargetPicker({
//   title,
//   grouped,
//   enabled,
//   onToggle,
//   targetCol,
//   setTargetCol,
//   targetVal,
//   setTargetVal,
// }) {
//   const colOptions = grouped.map((g) => g.column);
//   const currentValues = React.useMemo(() => {
//     const g = grouped.find((x) => x.column === targetCol);
//     return g ? g.values : [];
//   }, [grouped, targetCol]);

//   return (
//     <section className="space-y-3">
//       <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
//       <div className="rounded-lg border bg-white p-3 shadow-sm space-y-3">
//         <div className="flex items-center gap-2">
//           <input
//             id="rhs-exact"
//             type="checkbox"
//             className="h-4 w-4 rounded border-slate-300"
//             checked={enabled}
//             onChange={() => onToggle(!enabled)}
//           />
//           <label htmlFor="rhs-exact" className="text-sm text-slate-700">
//             Enable
//           </label>
//         </div>

//         {enabled && (
//           <>
//             <div>
//               <label className="text-xs text-slate-600">Column</label>
//               <select
//                 className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-sm"
//                 value={targetCol}
//                 onChange={(e) => {
//                   setTargetCol(e.target.value);
//                   setTargetVal("");
//                 }}
//               >
//                 <option value="">— choose —</option>
//                 {colOptions.map((c) => (
//                   <option key={c} value={c}>
//                     {c}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {targetCol && (
//               <div>
//                 <label className="text-xs text-slate-600">Category</label>
//                 <div className="mt-1 max-h-40 overflow-auto rounded border border-slate-200 p-2">
//                   {currentValues.map((v) => (
//                     <label
//                       key={v}
//                       className="mr-4 inline-flex items-center gap-2 text-sm"
//                     >
//                       <input
//                         type="radio"
//                         name="rhs-target-radio"
//                         className="h-4 w-4 border-slate-300"
//                         checked={targetVal === v}
//                         onChange={() => setTargetVal(v)}
//                       />
//                       <span className="select-none">{v}</span>
//                     </label>
//                   ))}
//                 </div>
//                 <p className="mt-1 text-xs text-slate-500">
//                   The consequent will be{" "}
//                   <b>{targetCol ? `${targetCol}_${targetVal || "…"}` : "—"}</b>.
//                 </p>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </section>
//   );
// }

// /* ---------------- Main page ---------------- */

// const ReportsGovernment = ({ setIsAuthenticated, setRole }) => {
//   const [tokens, setTokens] = useState([]);
//   const [bootLoading, setBootLoading] = useState(true);
//   const [bootError, setBootError] = useState("");

//   // Structured filters
//   const [preFilters, setPreFilters] = useState([]); // [{ column, selected:[] }]
//   const [postAFilters, setPostAFilters] = useState([]);
//   const [postCFilters, setPostCFilters] = useState([]);

//   // Thresholds
//   const [minSupport, setMinSupport] = useState(0.02);
//   const [minConfidence, setMinConfidence] = useState(0.3);

//   // RHS exact (picker state)
//   const [rhsExact, setRhsExact] = useState(false);
//   const [rhsTargetCol, setRhsTargetCol] = useState("");
//   const [rhsTargetVal, setRhsTargetVal] = useState("");

//   // Results
//   const [running, setRunning] = useState(false);
//   const [stats, setStats] = useState(null);
//   const [rules, setRules] = useState([]);

//   const grouped = useMemo(() => groupTokens(tokens), [tokens]);

//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       try {
//         const response = await API.get('/gov/rules/bootstrap');
//         if (!mounted) return;
//         setTokens(response.data.tokens || []);
//         if (response.data.defaults) {
//           setMinSupport(response.data.defaults.min_support ?? 0.02);
//           setMinConfidence(response.data.defaults.min_confidence ?? 0.3);
//         }
//       } catch (e) {
//         setBootError(String(e.response?.data?.detail || e.message || e));
//       } finally {
//         if (mounted) setBootLoading(false);
//       }
//     })();
//     return () => (mounted = false);
//   }, []);

//   const chipBar = useMemo(() => {
//     const preTokens = filtersToTokens(preFilters);
//     const chips = [];
//     if (preTokens.length)
//       chips.push(
//         `Pre: ${preTokens.slice(0, 5).join(" • ")}${
//           preTokens.length > 5 ? " …" : ""
//         }`
//       );
//     if (rhsExact && rhsTargetCol && rhsTargetVal)
//       chips.push(`RHS: ${rhsTargetCol}_${rhsTargetVal}`);
//     chips.push(`min_sup ${minSupport}`);
//     chips.push(`min_conf ${minConfidence}`);
//     return chips;
//   }, [
//     preFilters,
//     rhsExact,
//     rhsTargetCol,
//     rhsTargetVal,
//     minSupport,
//     minConfidence,
//   ]);

//   const runApriori = async () => {
//     setRunning(true);
//     try {
//       const rhsToken =
//         rhsExact && rhsTargetCol && rhsTargetVal
//           ? `${rhsTargetCol}_${rhsTargetVal}`
//           : null;

//       if (rhsExact && !rhsToken) {
//         alert(
//           "Please choose a column and a category for the exact RHS target."
//         );
//         setRunning(false);
//         return;
//       }

//       const requestBody = {
//         pre: {
//           target_consequents: filtersToTokens(preFilters),
//           min_support: Number(minSupport),
//           min_confidence: Number(minConfidence),
//           max_len_antecedent: 4,
//           max_rules: 20,
//         },
//         post: {
//           antecedents_contains: filtersToTokens(postAFilters),
//           consequents_contains: filtersToTokens(postCFilters),
//           rhs_exact: rhsExact,
//           rhs_target: rhsToken,
//         },
//         sort: { by: "lift", order: "desc" },
//       };

//       console.log('Sending request:', requestBody);
//       const response = await API.post('/gov/rules/run', requestBody);
//       console.log('Response received:', response.data);
//       setStats(response.data.stats || null);
//       setRules(response.data.rules || []);
//     } catch (e) {
//       console.error('Error running Apriori:', e);
//       alert(e.response?.data?.detail || "Failed to run Apriori. Check console.");
//     } finally {
//       setRunning(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50">
//       <GovernmentNav
//         setIsAuthenticated={setIsAuthenticated}
//         setRole={setRole}
//       />

//       {/* Header */}
//       <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
//         <div className="container mx-auto flex flex-col gap-2 px-4 py-4">
//           <h1 className="text-lg font-semibold text-slate-900">
//             Government Reports — Association Rules
//           </h1>
//           <div className="flex flex-wrap gap-2">
//             {chipBar.map((c, i) => (
//               <Pill key={i}>{c}</Pill>
//             ))}
//           </div>
//           <div className="flex items-center gap-4">
//             <NumberInput
//               label="Min Support"
//               value={minSupport}
//               onChange={setMinSupport}
//               step="0.005"
//             />
//             <NumberInput
//               label="Min Confidence"
//               value={minConfidence}
//               onChange={setMinConfidence}
//               step="0.05"
//             />
//             <button
//               onClick={runApriori}
//               disabled={running || bootLoading}
//               className="rounded-lg bg-indigo-600 px-4 py-2 text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-60"
//             >
//               {running ? "Running…" : "Run Apriori"}
//             </button>
//           </div>
//           {bootError && <div className="text-sm text-red-600">{bootError}</div>}
//         </div>
//       </header>

//       {/* Body */}
//       <main className="container mx-auto grid grid-cols-12 gap-6 px-4 py-6">
//         {/* Left: PRE */}
//         <div className="col-span-12 lg:col-span-3 space-y-6">
//           {bootLoading ? (
//             <Skeleton className="h-48" />
//           ) : (
//             <FilterBuilder
//               title="Pre — Target Consequents (dataset)"
//               grouped={grouped}
//               value={preFilters}
//               onChange={setPreFilters}
//               hint="Records must include at least one selected category per chosen column. If a column has no categories selected, it imposes no restriction."
//             />
//           )}
//         </div>

//         {/* Center: Results */}
//         <div className="col-span-12 lg:col-span-6 space-y-4">
//           <div className="rounded-2xl border bg-white p-4 shadow-sm">
//             <div className="mb-3 flex items-center justify-between">
//               <h2 className="font-semibold text-slate-900">Results</h2>
//               <div className="text-xs text-slate-600">
//                 {stats ? (
//                   <>
//                     {stats.pre_filtered_records?.toLocaleString?.()} records •
//                     min_sup {stats.min_support ?? minSupport} • min_conf{" "}
//                     {stats.min_confidence ?? minConfidence}
//                   </>
//                 ) : (
//                   "—"
//                 )}
//               </div>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="min-w-full text-sm">
//                 <thead>
//                   <tr className="text-left text-slate-600">
//                     <th className="px-2 py-1">Antecedents</th>
//                     <th className="px-2 py-1">Consequents</th>
//                     <th className="px-2 py-1">Support</th>
//                     <th className="px-2 py-1">Confidence</th>
//                     <th className="px-2 py-1">Lift</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {running ? (
//                     [...Array(5)].map((_, i) => (
//                       <tr key={i} className="border-t">
//                         <td className="px-2 py-2">
//                           <Skeleton className="h-4 w-40" />
//                         </td>
//                         <td className="px-2 py-2">
//                           <Skeleton className="h-4 w-40" />
//                         </td>
//                         <td className="px-2 py-2">
//                           <Skeleton className="h-4 w-12" />
//                         </td>
//                         <td className="px-2 py-2">
//                           <Skeleton className="h-4 w-12" />
//                         </td>
//                         <td className="px-2 py-2">
//                           <Skeleton className="h-4 w-12" />
//                         </td>
//                       </tr>
//                     ))
//                   ) : rules.length === 0 ? (
//                     <tr>
//                       <td
//                         colSpan={5}
//                         className="px-2 py-8 text-center text-slate-400"
//                       >
//                         No rules — add filters and run.
//                       </td>
//                     </tr>
//                   ) : (
//                     rules.map((r, i) => (
//                       <tr key={i} className="border-t align-top">
//                         <td className="px-2 py-2">
//                           <div className="flex flex-wrap gap-1">
//                             {r.antecedents.map((a) => (
//                               <Pill key={a}>{a}</Pill>
//                             ))}
//                           </div>
//                         </td>
//                         <td className="px-2 py-2">
//                           <div className="flex flex-wrap gap-1">
//                             {r.consequents.map((c) => (
//                               <Pill key={c}>{c}</Pill>
//                             ))}
//                           </div>
//                         </td>
//                         <td className="px-2 py-2 tabular-nums">
//                           {Number(r.support).toFixed(4)}
//                         </td>
//                         <td className="px-2 py-2 tabular-nums">
//                           {Number(r.confidence).toFixed(4)}
//                         </td>
//                         <td className="px-2 py-2 tabular-nums font-semibold">
//                           {Number(r.lift).toFixed(4)}
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//         {/* Right: POST */}
//         <div className="col-span-12 lg:col-span-3 space-y-6">
//           {bootLoading ? (
//             <Skeleton className="h-48" />
//           ) : (
//             <>
//               <FilterBuilder
//                 title="Post — Antecedents must contain"
//                 grouped={grouped}
//                 value={postAFilters}
//                 onChange={setPostAFilters}
//               />
//               <FilterBuilder
//                 title="Post — Consequents must contain"
//                 grouped={grouped}
//                 value={postCFilters}
//                 onChange={setPostCFilters}
//               />
//               <TargetPicker
//                 title="Post — RHS must be exactly target"
//                 grouped={grouped}
//                 enabled={rhsExact}
//                 onToggle={setRhsExact}
//                 targetCol={rhsTargetCol}
//                 setTargetCol={setRhsTargetCol}
//                 targetVal={rhsTargetVal}
//                 setTargetVal={setRhsTargetVal}
//               />
//             </>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default ReportsGovernment;



import React, { useEffect, useMemo, useState } from "react";
import { Info, Search, Filter, TrendingUp, Users, FileText, Settings } from "lucide-react";
import GovernmentNav from "../../navbars/GovernmentNav";
import API from "../../utils/api";
import { t } from "../../utils/translations";

/* ---------------- Utils ---------------- */
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
    if (!Array.isArray(f.selected) || f.selected.length === 0) return;
    f.selected.forEach((v) => out.push(`${f.column}_${v}`));
  });
  return out;
}

/* ---------------- UI Components ---------------- */
const Badge = ({ children, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  );
};

const InfoTooltip = ({ text }) => (
  <div className="group relative inline-block">
    <Info className="h-4 w-4 text-slate-400 cursor-help" />
    <div className="invisible group-hover:visible absolute z-10 w-64 p-2 mt-1 text-xs bg-slate-800 text-white rounded-lg shadow-lg -left-24">
      {text}
    </div>
  </div>
);

const Slider = ({ label, value, onChange, min, max, step, tooltip }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        {label}
        {tooltip && <InfoTooltip text={tooltip} />}
      </label>
      <span className="text-sm font-semibold text-indigo-600">{(value * 100).toFixed(0)}%</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
    />
  </div>
);

const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse rounded bg-slate-200 ${className}`} />
);

/* ---------------- Filter Section ---------------- */
function FilterSection({ title, icon: Icon, grouped = [], value = [], onChange, hint }) {
  const [draftCol, setDraftCol] = useState("");
  const [draftVals, setDraftVals] = useState([]);

  const colOptions = Array.isArray(grouped) ? grouped.map((g) => g.column) : [];
  const currentValues = useMemo(() => {
    if (!Array.isArray(grouped) || !draftCol) return [];
    const g = grouped.find((x) => x.column === draftCol);
    return g && Array.isArray(g.values) ? g.values : [];
  }, [grouped, draftCol]);

  const addFilter = () => {
    if (!draftCol || !onChange) return;
    const next = Array.isArray(value) ? value.slice() : [];
    const idx = next.findIndex((f) => f.column === draftCol);
    if (idx >= 0) next[idx] = { column: draftCol, selected: draftVals.slice() };
    else next.push({ column: draftCol, selected: draftVals.slice() });
    onChange(next);
    setDraftCol("");
    setDraftVals([]);
  };

  const removeFilter = (column) => {
    if (!onChange || !Array.isArray(value)) return;
    onChange(value.filter((f) => f.column !== column));
  };

  const toggleDraftVal = (v) => {
    const s = new Set(draftVals);
    s.has(v) ? s.delete(v) : s.add(v);
    setDraftVals(Array.from(s));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-6">
      <div className="flex items-center gap-2 mb-4">
        {Icon && <Icon className="h-5 w-5 text-indigo-600" />}
        <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      </div>
      
      {hint && (
        <p className="text-xs text-slate-600 mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
          {hint}
        </p>
      )}

      {/* Active Filters */}
      <div className="space-y-2 mb-4">
        {!Array.isArray(value) || value.length === 0 ? (
          <p className="text-sm text-slate-400 italic">No filters applied yet</p>
        ) : (
          value.map((f) => (
            <div key={f.column} className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3 border border-indigo-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-800">{f.column}</span>
                <button
                  onClick={() => removeFilter(f.column)}
                  className="text-xs text-red-600 hover:text-red-800 font-medium"
                >
                  Remove
                </button>
              </div>
              <div className="text-xs text-slate-700">
                {!Array.isArray(f.selected) || f.selected.length === 0 ? (
                  <em className="text-slate-500">All values included</em>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {f.selected.map(v => <Badge key={v} color="purple">{v}</Badge>)}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add New Filter */}
      <div className="border-t border-slate-200 pt-4 space-y-3">
        <div>
          <label className="text-xs font-medium text-slate-700 mb-1 block">Select Category</label>
          <select
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={draftCol}
            onChange={(e) => {
              setDraftCol(e.target.value);
              setDraftVals([]);
            }}
          >
            <option value="">Choose a category...</option>
            {colOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {draftCol && (
          <div>
            <label className="text-xs font-medium text-slate-700 mb-2 block">Select Values</label>
            <div className="max-h-40 overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="space-y-2">
                {Array.isArray(currentValues) && currentValues.length > 0 ? (
                  currentValues.map((v) => (
                    <label key={v} className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        checked={draftVals.includes(v)}
                        onChange={() => toggleDraftVal(v)}
                      />
                      <span className="text-sm text-slate-700">{v}</span>
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-slate-400 italic">No values available</p>
                )}
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-500 italic">
              Leave unchecked to include all values for this category
            </p>
          </div>
        )}

        <button
          onClick={addFilter}
          disabled={!draftCol}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Add Filter
        </button>
      </div>
    </div>
  );
}

/* ---------------- Target Selector ---------------- */
function TargetSelector({ title, grouped = [], enabled, onToggle, targetCol, setTargetCol, targetVal, setTargetVal }) {
  const colOptions = Array.isArray(grouped) ? grouped.map((g) => g.column) : [];
  const currentValues = React.useMemo(() => {
    if (!Array.isArray(grouped) || !targetCol) return [];
    const g = grouped.find((x) => x.column === targetCol);
    return g && Array.isArray(g.values) ? g.values : [];
  }, [grouped, targetCol]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-indigo-600" />
        <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      </div>

      <div className="space-y-4">
        <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
          <input
            type="checkbox"
            className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            checked={enabled}
            onChange={() => onToggle(!enabled)}
          />
          <span className="text-sm font-medium text-slate-700">Enable Specific Target</span>
        </label>

        {enabled && (
          <div className="space-y-3 pl-2 border-l-2 border-indigo-200">
            <div>
              <label className="text-xs font-medium text-slate-700 mb-1 block">Category</label>
              <select
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={targetCol}
                onChange={(e) => {
                  setTargetCol(e.target.value);
                  setTargetVal("");
                }}
              >
                <option value="">Choose category...</option>
                {colOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {targetCol && (
              <div>
                <label className="text-xs font-medium text-slate-700 mb-2 block">Specific Value</label>
                <div className="max-h-40 overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div className="space-y-2">
                    {Array.isArray(currentValues) && currentValues.length > 0 ? (
                      currentValues.map((v) => (
                        <label key={v} className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded">
                          <input
                            type="radio"
                            name="target-radio"
                            className="h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            checked={targetVal === v}
                            onChange={() => setTargetVal(v)}
                          />
                          <span className="text-sm text-slate-700">{v}</span>
                        </label>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400 italic">No values available</p>
                    )}
                  </div>
                </div>
                {targetVal && (
                  <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
                    <p className="text-xs text-green-800">
                      <strong>Target:</strong> {targetCol} = {targetVal}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Main Component ---------------- */
const ReportsGovernment = ({ setIsAuthenticated, setRole }) => {
  const [tokens, setTokens] = useState([]);
  const [bootLoading, setBootLoading] = useState(true);
  const [bootError, setBootError] = useState("");

  const [preFilters, setPreFilters] = useState([]);
  const [postAFilters, setPostAFilters] = useState([]);
  const [postCFilters, setPostCFilters] = useState([]);

  const [minSupport, setMinSupport] = useState(0.02);
  const [minConfidence, setMinConfidence] = useState(0.3);

  const [rhsExact, setRhsExact] = useState(false);
  const [rhsTargetCol, setRhsTargetCol] = useState("");
  const [rhsTargetVal, setRhsTargetVal] = useState("");

  const [running, setRunning] = useState(false);
  const [stats, setStats] = useState(null);
  const [rules, setRules] = useState([]);

  const grouped = useMemo(() => groupTokens(tokens), [tokens]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const response = await API.get('/gov/rules/bootstrap');
        if (!mounted) return;
        setTokens(response.data.tokens || []);
        if (response.data.defaults) {
          setMinSupport(response.data.defaults.min_support ?? 0.02);
          setMinConfidence(response.data.defaults.min_confidence ?? 0.3);
        }
      } catch (e) {
        setBootError(String(e.response?.data?.detail || e.message || e));
      } finally {
        if (mounted) setBootLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  const runAnalysis = async () => {
    setRunning(true);
    try {
      const rhsToken = rhsExact && rhsTargetCol && rhsTargetVal
        ? `${rhsTargetCol}_${rhsTargetVal}`
        : null;

      if (rhsExact && !rhsToken) {
        alert("Please select both category and value for the specific target.");
        setRunning(false);
        return;
      }

      const requestBody = {
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

      const response = await API.post('/gov/rules/run', requestBody);
      setStats(response.data.stats || null);
      setRules(response.data.rules || []);
    } catch (e) {
      alert(e.response?.data?.detail || "Analysis failed. Please try again.");
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <GovernmentNav
        setIsAuthenticated={setIsAuthenticated}
        setRole={setRole}
      />

      <div className="container mx-auto px-6 py-6">
        {/* Page Title */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-slate-900">{t('governmentReports')} - {t('associationRules')}</h1>
          </div>
          <p className="text-slate-600">{t('governmentPortal')} {t('analytics')} {t('dashboard')}</p>
        </div>

        {bootError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
            {bootError}
          </div>
        )}

        {/* Two Column Layout with Independent Scrollbars */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          
          {/* LEFT COLUMN - INPUTS */}
          <div className="overflow-y-auto pr-4 space-y-6" style={{ height: '100%' }}>
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Settings className="h-6 w-6" />
                <h2 className="text-xl font-bold">{t('configureAnalysis')}</h2>
              </div>
              <p className="text-indigo-100 text-sm">
{t('setupFiltersParametersMessage')}
              </p>
            </div>

            {bootLoading ? (
              <>
                <Skeleton className="h-64" />
                <Skeleton className="h-48" />
              </>
            ) : (
              <>
                {/* Analysis Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Settings className="h-5 w-5 text-indigo-600" />
                    {t('analysisSettings')}
                  </h3>
                  
                  <div className="space-y-6">
                    <Slider
                      label={t('minSupport')}
                      value={minSupport}
                      onChange={setMinSupport}
                      min={0.005}
                      max={0.2}
                      step={0.005}
                      tooltip="How often a pattern must appear in the data (higher = more common patterns only)"
                    />
                    <Slider
                      label={t('minConfidence')}
                      value={minConfidence}
                      onChange={setMinConfidence}
                      min={0.1}
                      max={0.9}
                      step={0.05}
                      tooltip="How reliable the pattern prediction must be (higher = more trustworthy patterns)"
                    />
                  </div>

                  <button
                    onClick={runAnalysis}
                    disabled={running || bootLoading}
                    className="w-full mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <Search className="h-5 w-5" />
                    {running ? t('running') : t('runApriori')}
                  </button>
                </div>

                {/* Data Selection */}
                <FilterSection
                  title="Data Selection"
                  icon={Filter}
                  grouped={grouped}
                  value={preFilters}
                  onChange={setPreFilters}
                  hint="Select which patient records to include in the analysis. This helps focus on specific populations."
                />

                {/* Pattern Filters */}
                <FilterSection
                  title="Must Include (Conditions)"
                  icon={Filter}
                  grouped={grouped}
                  value={postAFilters}
                  onChange={setPostAFilters}
                  hint="Patterns must include these characteristics in the 'When We See' column"
                />

                <FilterSection
                  title="Must Include (Outcomes)"
                  icon={Filter}
                  grouped={grouped}
                  value={postCFilters}
                  onChange={setPostCFilters}
                  hint="Patterns must include these in the 'We Often Find' column"
                />

                {/* Target Selector */}
                <TargetSelector
                  title="Focus on Specific Outcome"
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

          {/* RIGHT COLUMN - OUTPUTS */}
          <div className="overflow-y-auto pl-4" style={{ height: '100%' }}>
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden h-full flex flex-col">
              {/* Results Header */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="h-6 w-6 text-green-600" />
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Discovered Patterns</h2>
                      <p className="text-sm text-slate-600">Meaningful relationships in medical data</p>
                    </div>
                  </div>
                  {stats && (
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-green-200">
                      <div className="text-xs text-slate-600">Records Analyzed</div>
                      <div className="text-lg font-bold text-green-600">
                        {stats.pre_filtered_records?.toLocaleString?.()}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Results Body */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-slate-200">
                        <th className="text-left px-3 py-3 text-slate-700 font-semibold">When We See</th>
                        <th className="text-left px-3 py-3 text-slate-700 font-semibold">We Often Find</th>
                        <th className="text-left px-3 py-3 text-slate-700 font-semibold">Frequency</th>
                        <th className="text-left px-3 py-3 text-slate-700 font-semibold">Reliability</th>
                        <th className="text-left px-3 py-3 text-slate-700 font-semibold">Strength</th>
                      </tr>
                    </thead>
                    <tbody>
                      {running ? (
                        [...Array(5)].map((_, i) => (
                          <tr key={i} className="border-b border-slate-100">
                            <td className="px-3 py-3"><Skeleton className="h-6 w-40" /></td>
                            <td className="px-3 py-3"><Skeleton className="h-6 w-40" /></td>
                            <td className="px-3 py-3"><Skeleton className="h-6 w-16" /></td>
                            <td className="px-3 py-3"><Skeleton className="h-6 w-16" /></td>
                            <td className="px-3 py-3"><Skeleton className="h-6 w-16" /></td>
                          </tr>
                        ))
                      ) : rules.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-3 py-12 text-center">
                            <div className="text-slate-400">
                              <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
                              <p className="font-medium">No patterns found yet</p>
                              <p className="text-xs mt-1">Configure your filters and click "Discover Patterns"</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        rules.map((r, i) => (
                          <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                            <td className="px-3 py-3">
                              <div className="flex flex-wrap gap-1">
                                {r.antecedents.map((a) => <Badge key={a} color="blue">{a}</Badge>)}
                              </div>
                            </td>
                            <td className="px-3 py-3">
                              <div className="flex flex-wrap gap-1">
                                {r.consequents.map((c) => <Badge key={c} color="green">{c}</Badge>)}
                              </div>
                            </td>
                            <td className="px-3 py-3 text-slate-700 font-medium">
                              {(Number(r.support) * 100).toFixed(1)}%
                            </td>
                            <td className="px-3 py-3 text-slate-700 font-medium">
                              {(Number(r.confidence) * 100).toFixed(1)}%
                            </td>
                            <td className="px-3 py-3">
                              <span className={`font-bold ${Number(r.lift) > 2 ? 'text-green-600' : Number(r.lift) > 1.5 ? 'text-blue-600' : 'text-slate-600'}`}>
                                {Number(r.lift).toFixed(2)}×
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {rules.length > 0 && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-sm font-semibold text-blue-900 mb-2">How to Read Results</h4>
                    <ul className="text-xs text-blue-800 space-y-1 leading-relaxed">
                      <li><strong>When We See:</strong> Patient characteristics or conditions</li>
                      <li><strong>We Often Find:</strong> Outcomes commonly occurring with those characteristics</li>
                      <li><strong>Frequency:</strong> How often this pattern appears in the data</li>
                      <li><strong>Reliability:</strong> How trustworthy the connection is (higher = better)</li>
                      <li><strong>Strength:</strong> How much stronger than random chance (higher = more significant)</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsGovernment;