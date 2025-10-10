import { useState, useEffect } from "react";
import API from "../../utils/api";
import GovernmentNav from './../../navbars/GovernmentNav';
import Footer from '../../components/Footer';
import { LayoutDashboard, TrendingUp, FileText, BookOpen } from 'lucide-react';
import { t } from "../../utils/translations";

const Guide = ({ setIsAuthenticated, setRole }) => {
  const [activeSection, setActiveSection] = useState('introduction');

  const sections = {
    introduction: {
      title: `${t('introduction')} to MedRecord ${t('governmentPortal')}`,
      icon: <BookOpen className="w-8 h-8 text-blue-600" />,
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            {t('welcomeToMedRecord')}
          </p>
          <p className="text-gray-700 leading-relaxed">
            {t('designedWithFocus')}
          </p>
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">{t('keyObjectives')}</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• {t('accurateRecording')}</li>
                <li>• {t('temporalForecasting')}</li>
                <li>• {t('seamlessIntegration')}</li>
                <li>• {t('generationActionable')}</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">{t('dataSecurityCompliance')}</h4>
              <p className="text-sm text-gray-600">
                {t('allDataHandled')}
              </p>
            </div>
          </div>
        </div>
      )
    },
    hospitals: {
      title: t('hospitalManagement'),
      icon: <LayoutDashboard className="w-8 h-8 text-blue-600" />,
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            {t('hospitalsSectionProvides')}
          </p>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">{t('coreFeatures')}</h4>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start space-x-3">
                <span className="text-blue-600 font-medium">•</span>
                <span>{t('interactiveDashboards')}</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-blue-600 font-medium">•</span>
                <span>{t('dataImport')}</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-blue-600 font-medium">•</span>
                <span>{t('alertsHighVolume')}</span>
              </li>
            </ul>
          </div>
          <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600">
            "{t('streamlineHospital')}"
          </blockquote>
        </div>
      )
    },
    analytics: {
      title: t('temporalAnalysisForecasting'),
      icon: <TrendingUp className="w-8 h-8 text-blue-600" />,
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            {t('analyticsSection')}
          </p>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">{t('advancedCapabilities')}</h4>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start space-x-3">
                <span className="text-blue-600 font-medium">•</span>
                <span>{t('timeSeriesForecasting')}</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-blue-600 font-medium">•</span>
                <span>{t('trendAnalysis')}</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-blue-600 font-medium">•</span>
                <span>{t('valuableInsights')}</span>
              </li>
            </ul>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
              <h5 className="font-medium text-blue-900 mb-2">{t('weeklyForecast')}</h5>
              <p className="text-sm text-blue-700">{t('predictsShortTerm')}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
              <h5 className="font-medium text-blue-900 mb-2">{t('monthlyForecast')}</h5>
              <p className="text-sm text-blue-700">{t('supportsLongTerm')}</p>
            </div>
          </div>
        </div>
      )
    },
    reports: {
      title: t('reportsInsights'),
      icon: <FileText className="w-8 h-8 text-blue-600" />,
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            {t('reportsSection')}
          </p>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">{t('reportingTools')}</h4>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start space-x-3">
                <span className="text-blue-600 font-medium">•</span>
                <span>{t('automatedGeneration')}</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-blue-600 font-medium">•</span>
                <span>{t('ruleBasedInsights')}</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-blue-600 font-medium">•</span>
                <span>{t('scheduledReport')}</span>
              </li>
            </ul>
          </div>
          <div className="text-center">
            <p className="text-gray-600 italic">
              {t('transformRawData')}
            </p>
          </div>
        </div>
      )
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <GovernmentNav setIsAuthenticated={setIsAuthenticated} setRole={setRole} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('guideTitle')}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('guideSubtitle')}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center space-x-2 mb-8 -mx-2">
          {Object.keys(sections).map((key) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className={`mx-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                activeSection === key
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {sections[key].icon}
              <span>
                {key === 'introduction' && t('introduction')}
                {key === 'hospitals' && t('hospitals')}
                {key === 'analytics' && t('temporal')}
                {key === 'reports' && t('reports')}
              </span>
            </button>
          ))}
        </div>

        {/* Active Section Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8">
            {sections[activeSection].content}
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center text-gray-500">
          <p className="text-sm">
            {t('guideSupportNote')}
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Guide;