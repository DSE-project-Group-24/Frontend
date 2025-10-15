import React, { useState, useEffect } from 'react';
import { t } from '../../utils/translations';
import { Search, MapPin, Phone, Building2, Filter, X, Hospital, Activity, TrendingUp } from 'lucide-react';
import GovernmentNav from '../../navbars/GovernmentNav';
import Footer from '../../components/Footer';
import HospitalsMap from '../../components/HospitalsMap';

// Error Boundary Component (class) — wrapped with withTranslation for t prop
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error:", error, info);
  }

  render() {
    // use project-level t() helper
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {t('somethingWentWrong')}
            </h2>
            <p className="text-gray-600">
              {t('pleaseRefreshPage')}
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// We use the project-level translations helper directly
const TranslatedErrorBoundary = ErrorBoundary;

// Statistics Card Component (functional - can use hooks)
const StatCard = ({ icon: Icon, label, value, change, color = "blue" }) => {

  // Tailwind dynamic class names (note: for purge you might need to add these variations to safelist)
  const bgClass = `bg-${color}-100`;
  const iconClass = `text-${color}-600`;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          {change && (
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-green-600 font-medium">{change}</span>
              <span className="text-gray-500">{t('vsLastMonth')}</span>
            </div>
          )}
        </div>
        <div className={`${bgClass} w-12 h-12 rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${iconClass}`} />
        </div>
      </div>
    </div>
  );
};

const DashboardGovernmentContent = ({ setIsAuthenticated, setRole }) => {

  const [allHospitals, setAllHospitals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch hospital data
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/hospital/all');
        const data = await response.json();
        setAllHospitals(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching hospitals:', error);
        setAllHospitals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  // Calculate statistics
  const stats = {
    total: allHospitals.length,
    general: allHospitals.filter(h => (h.Type || h.type || '').toLowerCase().includes('general')).length,
    districts: [...new Set(allHospitals.map(h => h.Region || h.region))].filter(Boolean).length,
    active: allHospitals.length
  };

  // Handle live search filtering
  useEffect(() => {
    if (searchTerm.trim()) {
      let filtered = allHospitals.filter(hospital =>
        (hospital.name || '').toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (filterType !== 'all') {
        filtered = filtered.filter(h => 
          (h.Type || h.type || '').toLowerCase().includes(filterType.toLowerCase())
        );
      }

      if (filterRegion !== 'all') {
        filtered = filtered.filter(h => 
          (h.Region || h.region) === filterRegion
        );
      }

      setSuggestions(filtered.slice(0, 8));
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, allHospitals, filterType, filterRegion]);

  const handleSuggestionClick = (hospital) => {
    setSelectedHospital(hospital);
    setSearchTerm(hospital.name);
    setSuggestions([]);
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    if (selectedHospital && !e.target.value.includes(selectedHospital.name)) {
      setSelectedHospital(null);
    }
  };

  const clearFilters = () => {
    setFilterType('all');
    setFilterRegion('all');
    setSearchTerm('');
    setSelectedHospital(null);
  };

  const uniqueTypes = [...new Set(allHospitals.map(h => h.Type || h.type))].filter(Boolean);
  const uniqueRegions = [...new Set(allHospitals.map(h => h.Region || h.region))].filter(Boolean);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <GovernmentNav setIsAuthenticated={setIsAuthenticated} setRole={setRole} />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">{t ? t('loading') : 'Loading'}...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <GovernmentNav setIsAuthenticated={setIsAuthenticated} setRole={setRole} />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t ? `${t('hospitalManagement')} ${t('dashboard')}` : 'Hospital Management Dashboard'}
          </h1>
          <p className="text-gray-600">{t ? t('hospitalManagementDescription') : 'Monitor and manage hospitals across Northern Province'}</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={Hospital} 
            label={t ? t('totalHospitals') : 'Total Hospitals'} 
            value={stats.total} 
            change={t ? t('totalHospitalsChange') : null}
            color="blue"
          />
          <StatCard 
            icon={Building2} 
            label={t ? t('generalHospitals') : 'General Hospitals'} 
            value={stats.general}
            color="green"
          />
          <StatCard 
            icon={MapPin} 
            label={t ? t('districtsCovered') : 'Districts Covered'} 
            value={stats.districts}
            color="purple"
          />
          <StatCard 
            icon={Activity} 
            label={t ? t('activeFacilities') : 'Active Facilities'} 
            value={stats.active} 
            change={t ? t('changeFromLastMonth') : null}
            color="orange"
          />
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{t ? t('hospitalSearch') : 'Hospital Search'}</h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Filter className="w-4 h-4" />
              {showFilters ? (t ? t('hideFilters') : 'Hide Filters') : (t ? t('showFilters') : 'Show Filters')}
            </button>
          </div>

          {/* Search Input */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t ? t('searchHospitals') : 'Search hospitals'}
              value={searchTerm}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedHospital(null);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            
            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-auto">
                {suggestions.map((hospital, idx) => (
                  <div
                    key={hospital.hospital_id || hospital.id || idx}
                    onClick={() => handleSuggestionClick(hospital)}
                    className="px-4 py-3 cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{hospital.name || 'Unnamed Hospital'}</p>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                          {(hospital.Type || hospital.type) && (
                            <span className="flex items-center gap-1">
                              <Building2 className="w-3 h-3" />
                              {hospital.Type || hospital.type}
                            </span>
                          )}
                          {(hospital.Region || hospital.region) && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {hospital.Region || hospital.region}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {searchTerm && suggestions.length === 0 && (
            <p className="text-sm text-gray-500 mb-4">
              {t ? t('noHospitalsFound', { term: searchTerm }) : `No hospitals found matching "${searchTerm}"`}
            </p>
          )}

          {/* Filter Options */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t ? t('type') : 'Type'}</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">{t ? t('allTypes') : 'All types'}</option>
                  {uniqueTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t ? t('region') : 'Region'}</label>
                <select
                  value={filterRegion}
                  onChange={(e) => setFilterRegion(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">{t ? t('allRegions') : 'All regions'}</option>
                  {uniqueRegions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {t ? t('clearAllFilters') : 'Clear all filters'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Selected Hospital Details */}
        {selectedHospital && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">{t ? t('hospitalDetails') : 'Hospital details'}</h2>
              <button
                onClick={() => {
                  setSelectedHospital(null);
                  setSearchTerm('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Hospital className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t ? t('hospitalName') : 'Hospital name'}</p>
                  <p className="font-semibold text-gray-900">{selectedHospital?.name || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t ? t('type') : 'Type'}</p>
                  <p className="font-semibold text-gray-900">{selectedHospital?.Type || selectedHospital?.type || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t ? t('region') : 'Region'}</p>
                  <p className="font-semibold text-gray-900">{selectedHospital?.Region || selectedHospital?.region || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t ? t('address') : 'Address'}</p>
                  <p className="font-semibold text-gray-900">{selectedHospital?.address || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t ? t('city') : 'City'}</p>
                  <p className="font-semibold text-gray-900">{selectedHospital?.city || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t ? t('contact') : 'Contact'}</p>
                  <p className="font-semibold text-gray-900">{selectedHospital?.contact_number || selectedHospital?.contact || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Map Display */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t ? t('geographicDistribution') : 'Geographic distribution'}</h2>
          <HospitalsMap selectedHospital={selectedHospital} allHospitals={allHospitals} />
        </div>
      
      </div>
      
      <Footer />
    </div>
  );
};

// Wrap with TranslatedErrorBoundary
const DashboardGovernment = (props) => (
  <TranslatedErrorBoundary>
    <DashboardGovernmentContent {...props} />
  </TranslatedErrorBoundary>
);

export default DashboardGovernment;
