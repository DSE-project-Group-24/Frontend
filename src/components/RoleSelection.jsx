import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { t } from '../utils/translations';
import backgroundVideo from "../assets/backgroundq9.mov";

const RoleSelection = ({ setRole, isRegister = false }) => {
  const navigate = useNavigate();

  const selectRole = (selectedRole) => {
    setRole(selectedRole);
    navigate(isRegister ? `/register/${selectedRole}` : '/login');
  };

  const roles = [
    {
      id: 'nurse',
      title: t('role_nurse_title'),
      description: t('role_nurse_description'),
      icon: '🩺',
      color: 'from-emerald-500 to-teal-600',
      hoverColor: 'from-emerald-600 to-teal-700',
    },
    {
      id: 'doctor',
      title: t('role_doctor_title'),
      description: t('role_doctor_description'),
      icon: '👨‍⚕️',
      color: 'from-blue-500 to-indigo-600',
      hoverColor: 'from-blue-600 to-indigo-700',
    },
    {
      id: 'admin',
      title: t('role_admin_title'),
      description: t('role_admin_description'),
      icon: '🏥',
      color: 'from-purple-500 to-pink-600',
      hoverColor: 'from-purple-600 to-pink-700',
    },
    {
      id: 'government',
      title: t('role_government_title'),
      description: t('role_government_description'),
      icon: '🏛️',
      color: 'from-amber-500 to-orange-600',
      hoverColor: 'from-amber-600 to-orange-700',
    },
  ];

  return (
  <div className="h-screen flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-slate-900/5 to-blue-900/5">
      {/* Background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        src={backgroundVideo}
        autoPlay
        muted
        loop
        playsInline
      />

      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-indigo-900/30 z-10"></div>

      <div className="max-w-4xl w-full h-full relative z-20 flex flex-col justify-center">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-semibold text-white mb-2 tracking-tight">
            {isRegister ? t('roleSelectionTitleRegister') : t('roleSelectionTitle')}
          </h1>
          <p className="text-sm md:text-base text-white/90 max-w-2xl mx-auto leading-snug">
            {isRegister ? t('roleSelectionSubtitleRegister') : t('roleSelectionSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {roles.map((role) => (
            <div
              key={role.id}
              onClick={() => selectRole(role.id)}
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
            >
              <div className="bg-white/8 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-lg p-5 md:p-6 border border-white/8 transition-all duration-300 hover:bg-white/10 hover:bg-opacity-30">
                <div className="flex items-center justify-center mb-4">
                  <div className={`h-12 w-12 rounded-full bg-gradient-to-r ${role.color} group-hover:bg-gradient-to-r group-hover:${role.hoverColor} flex items-center justify-center text-xl shadow-md transition-all duration-300 group-hover:shadow-lg`}>
                    <span className="text-white">{role.icon}</span>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-lg md:text-xl font-semibold text-white mb-1 group-hover:text-white transition-colors duration-300">
                    {role.title}
                  </h3>
                  <p className="text-white/85 text-xs md:text-sm leading-snug group-hover:text-white transition-colors duration-300">
                    {role.description}
                  </p>
                </div>
                <div className="flex justify-center mt-6">
                  <div className="opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-white/90 text-sm">
            {t('role_footer_line')}
          </p>
          <div className="flex flex-col justify-center items-center mt-4 space-y-2 text-white/80 text-xs">
            <Link to="/" className="group inline-flex items-center text-sm text-white/90 hover:text-white transition-colors duration-200">
              <span className="relative">
                <span className="block">{t('alreadyHaveAccountLogin')}</span>
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
              </span>
              <svg className="ml-2 h-4 w-4 text-white/90 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;