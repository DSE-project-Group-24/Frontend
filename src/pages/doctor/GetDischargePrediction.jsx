import React, { useState } from 'react';
import DoctorNav from '../../navbars/DoctorNav';
import Footer from '../../components/Footer';
import API from '../../utils/api';
import { t } from '../../utils/translations';

const GetDischargePrediction = ({ setIsAuthenticated, setRole }) => {
  const [form, setForm] = useState({
    current_hospital_name: 'DGH – Kilinochchi',
    family_current_status: 'Moderately Affected',
    type_of_injury_no_1: 'fracture',
    traveling_expenditure_per_day: '100-200',
    first_hospital_name: 'DGH – Kilinochchi',
    date_of_birth: '1990-05-15',
    site_of_injury_no1: 'head injury',
    approximate_speed: '40 - 80 km/h',
    incident_at_time_and_date: '2023-10-15',
    hospital_distance_from_home: '5-10 Km',
    mode_of_transport_to_the_hospital: 'Ambulance',
    educational_qualification: 'O/L or A/L',
    time_taken_to_reach_hospital: 'Less Than 15 Minutes',
    any_other_hospital_admission_expenditure: 'No Other Expenses',
    site_of_injury_no_2: 'no secondary injury found',
    occupation: 'Student',
    family_monthly_income_before_accident: '30000-45000',
    collision_with: 'Motorbike',
    life_style: 'Living with care givers',
    collision_force_from: 'Front',
    road_type: 'Straight',
    type_of_injury_no_2: 'abrasion'
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
  // Backend expects a single object (POST body matches what works in Postman)
  const payload = { ...form };
  const res = await API.post('predictions/discharge-outcome', payload);
      setResult(res.data);
    } catch (err) {
      console.error('Discharge prediction error:', err);
      const respData = err?.response?.data;

      // FastAPI/Pydantic validation errors commonly come back as a list of objects
      if (Array.isArray(respData)) {
        const messages = respData.map(e => {
          try {
            const loc = Array.isArray(e.loc) ? e.loc.join(' > ') : e.loc;
            return `${loc}: ${e.msg}`;
          } catch (_) {
            return JSON.stringify(e);
          }
        });
        setError(messages);
      } else if (respData && typeof respData === 'object') {
        if (Array.isArray(respData.detail)) {
          const messages = respData.detail.map(e => {
            const loc = Array.isArray(e.loc) ? e.loc.join(' > ') : e.loc;
            return `${loc}: ${e.msg}`;
          });
          setError(messages);
        } else {
          // Render object as pretty JSON string
          setError(JSON.stringify(respData, null, 2));
        }
      } else {
        setError(err.message || 'Request failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-gray-800">
      <DoctorNav setIsAuthenticated={setIsAuthenticated} setRole={setRole} />
      <div className="max-w-4xl mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-sky-700 to-indigo-600">{t('dischargeOutcomePredictionTitle')}</h1>
          <p className="mt-1 text-sm text-slate-500">{t('dischargeOutcomePrediction') || 'Discharge outcome prediction (manual input)'}</p>
        </header>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(form).map(key => (
              <div key={key} className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">{key.replace(/_/g, ' ')}</label>
                <input
                  name={key}
                  value={form[key]}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-200 rounded-lg"
                />
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button type="submit" disabled={loading} className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-sky-700 hover:to-indigo-700 disabled:opacity-60">
              {loading ? (
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"></path></svg>
              ) : null}
              <span>{loading ? t('processingPrediction') : t('getPredictionAnalysis')}</span>
            </button>

            <button type="button" onClick={() => { setForm({
              current_hospital_name: 'DGH – Kilinochchi',
              family_current_status: 'Moderately Affected',
              type_of_injury_no_1: 'fracture',
              traveling_expenditure_per_day: '100-200',
              first_hospital_name: 'DGH – Kilinochchi',
              date_of_birth: '1990-05-15',
              site_of_injury_no1: 'head injury',
              approximate_speed: '40 - 80 km/h',
              incident_at_time_and_date: '2023-10-15',
              hospital_distance_from_home: '5-10 Km',
              mode_of_transport_to_the_hospital: 'Ambulance',
              educational_qualification: 'O/L or A/L',
              time_taken_to_reach_hospital: 'Less Than 15 Minutes',
              any_other_hospital_admission_expenditure: 'No Other Expenses',
              site_of_injury_no_2: 'no secondary injury found',
              occupation: 'Student',
              family_monthly_income_before_accident: '30000-45000',
              collision_with: 'Motorbike',
              life_style: 'Living with care givers',
              collision_force_from: 'Front',
              road_type: 'Straight',
              type_of_injury_no_2: 'abrasion'
            }); setResult(null); setError(null);} } className="px-4 py-2 border rounded-lg">Reset</button>
          </div>
        </form>

        <div className="mt-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
              {Array.isArray(error) ? (
                <ul className="list-disc pl-5 space-y-1">
                  {error.map((msg, idx) => (
                    <li key={idx} className="text-sm">{msg}</li>
                  ))}
                </ul>
              ) : typeof error === 'string' ? (
                <pre className="whitespace-pre-wrap text-sm">{error}</pre>
              ) : (
                <pre className="text-sm">{JSON.stringify(error, null, 2)}</pre>
              )}
            </div>
          )}

          {result && (
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
              <h2 className="text-xl font-semibold mb-2">{t('predictedOutcome')}: <span className="font-bold text-emerald-700">{result.prediction}</span></h2>

              {result.prediction_probabilities && (
                <div className="mt-3">
                  <h3 className="font-medium text-slate-800 mb-2">{t('outcomeProbabilities')}</h3>
                  <div className="space-y-2">
                    {Object.entries(result.prediction_probabilities).sort(([,a],[,b]) => b-a).map(([k,v]) => (
                      <div key={k} className="flex items-center justify-between">
                        <div className="text-sm text-slate-700">{k}</div>
                        <div className="font-semibold text-green-600">{(v * 100).toFixed(1)}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.model_info && (
                <div className="mt-4">
                  <h3 className="font-medium">Model Info</h3>
                  <pre className="bg-slate-50 p-3 rounded mt-2 overflow-auto text-sm">{JSON.stringify(result.model_info, null, 2)}</pre>
                </div>
              )}

              {result.preprocessed_features && (
                <div className="mt-4">
                  <h3 className="font-medium">Preprocessed Features</h3>
                  <pre className="bg-slate-50 p-3 rounded mt-2 overflow-auto text-sm">{JSON.stringify(result.preprocessed_features, null, 2)}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default GetDischargePrediction;
