import { useState, useEffect } from "react";
import API from "../../utils/api";
import GovernmentNav from './../../navbars/GovernmentNav';
import { LayoutDashboard, TrendingUp, FileText, BookOpen } from 'lucide-react';

const Guide = ({ setIsAuthenticated, setRole }) => {
  const [activeSection, setActiveSection] = useState('introduction');

  const sections = {
    introduction: {
      title: 'Introduction to MedRecord Government Portal',
      icon: <BookOpen className="w-8 h-8 text-blue-600" />,
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            Welcome to the MedRecord Government Portal, a comprehensive road accident recording and analysis system tailored for the North Province of Sri Lanka. This platform empowers government personnel to efficiently manage, analyze, and forecast road accident data, enabling proactive measures to enhance road safety and public health.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Designed with a focus on data-driven decision-making, the portal integrates real-time hospital data, advanced temporal analytics, and insightful reporting tools. By leveraging appropriate rules for data validation and generating valuable insights, MedRecord supports the reduction of road accidents through informed policy and resource allocation.
          </p>
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Key Objectives</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Accurate recording of road accidents across the North Province</li>
                <li>• Temporal forecasting to anticipate future trends</li>
                <li>• Seamless integration with hospital systems for victim data</li>
                <li>• Generation of actionable reports for stakeholders</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Data Security & Compliance</h4>
              <p className="text-sm text-gray-600">
                All data is handled in compliance with Sri Lankan data protection regulations, ensuring confidentiality and integrity. Role-based access control restricts sensitive information to authorized government personnel.
              </p>
            </div>
          </div>
        </div>
      )
    },
    hospitals: {
      title: 'Hospital Data Management',
      icon: <LayoutDashboard className="w-8 h-8 text-blue-600" />,
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            The Hospitals section (accessible via the Dashboard) provides a centralized view of accident-related admissions across North Province facilities. This module facilitates real-time tracking of victim demographics, injury types, and treatment outcomes.
          </p>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">Core Features</h4>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start space-x-3">
                <span className="text-blue-600 font-medium">•</span>
                <span>Interactive dashboards for visualizing hospital bed occupancy and resource utilization due to accidents.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-blue-600 font-medium">•</span>
                <span>Data import from hospital systems with validation rules to ensure accuracy (e.g., duplicate checks, mandatory fields).</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-blue-600 font-medium">•</span>
                <span>Alerts for high-volume incidents to prioritize emergency responses.</span>
              </li>
            </ul>
          </div>
          <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600">
            "Streamline hospital coordination to save lives and optimize healthcare resources in the North Province."
          </blockquote>
        </div>
      )
    },
    analytics: {
      title: 'Temporal Analysis & Forecasting',
      icon: <TrendingUp className="w-8 h-8 text-blue-600" />,
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            The Analytics section employs sophisticated time series models to dissect historical accident patterns and forecast future occurrences. This empowers proactive interventions, such as targeted awareness campaigns during peak periods.
          </p>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">Advanced Capabilities</h4>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start space-x-3">
                <span className="text-blue-600 font-medium">•</span>
                <span>Time series forecasting using ARIMA and Prophet models for predictions over the next week and month, with confidence intervals.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-blue-600 font-medium">•</span>
                <span>Trend analysis highlighting seasonal variations, such as monsoon-related spikes in the North Province.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-blue-600 font-medium">•</span>
                <span>Valuable insights generated via anomaly detection rules (e.g., unusual accident clusters by location or time).</span>
              </li>
            </ul>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
              <h5 className="font-medium text-blue-900 mb-2">Weekly Forecast</h5>
              <p className="text-sm text-blue-700">Predicts short-term risks for immediate action.</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
              <h5 className="font-medium text-blue-900 mb-2">Monthly Forecast</h5>
              <p className="text-sm text-blue-700">Supports long-term planning and policy adjustments.</p>
            </div>
          </div>
        </div>
      )
    },
    reports: {
      title: 'Reports & Insights',
      icon: <FileText className="w-8 h-8 text-blue-600" />,
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            The Reports section compiles comprehensive summaries with embedded rules for data integrity and automated insights. Customize and export reports to inform stakeholders and drive evidence-based strategies.
          </p>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">Reporting Tools</h4>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start space-x-3">
                <span className="text-blue-600 font-medium">•</span>
                <span>Automated generation of PDF/Excel reports with visualizations and key metrics (e.g., accident rates by district).</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-blue-600 font-medium">•</span>
                <span>Rule-based insights, such as correlation analysis between traffic volume and accident severity.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-blue-600 font-medium">•</span>
                <span>Scheduled report delivery via email for ongoing monitoring.</span>
              </li>
            </ul>
          </div>
          <div className="text-center">
            <p className="text-gray-600 italic">
              Transform raw data into strategic intelligence for safer roads in the North Province.
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">User Guide: MedRecord Government Portal</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A step-by-step guide to navigating the road accident recording system for the North Province of Sri Lanka.
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
              <span>{sections[key].title.split(' ')[0]}</span>
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
            For technical support or feature requests, contact the MedRecord support team at support@medrecord.lk.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Guide;