import React from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../public/background.jpg';

const RoleSelection = ({ setRole, isRegister = false }) => {
  const navigate = useNavigate();

  const selectRole = (selectedRole) => {
    setRole(selectedRole);
    navigate(isRegister ? `/register/${selectedRole}` : '/login');
  };

  const roles = [
    {
      id: 'nurse',
      title: 'Nurse',
      description: 'Patient care and medical assistance',
      icon: '🩺',
      color: 'from-emerald-500 to-teal-600',
      hoverColor: 'from-emerald-600 to-teal-700',
    },
    {
      id: 'doctor',
      title: 'Doctor',
      description: 'Medical diagnosis and treatment',
      icon: '👨‍⚕️',
      color: 'from-blue-500 to-indigo-600',
      hoverColor: 'from-blue-600 to-indigo-700',
    },
    {
      id: 'admin',
      title: 'Hospital Administrator',
      description: 'Hospital operations and management',
      icon: '🏥',
      color: 'from-purple-500 to-pink-600',
      hoverColor: 'from-purple-600 to-pink-700',
    },
    {
      id: 'government',
      title: 'Government Official',
      description: 'Healthcare policy and oversight',
      icon: '🏛️',
      color: 'from-amber-500 to-orange-600',
      hoverColor: 'from-amber-600 to-orange-700',
    },
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8 relative"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-indigo-900/20"></div>
      
      <div className="max-w-4xl w-full relative z-10">
        <div className="text-center mb-12">
          <div className="mx-auto h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-2xl mb-6">
            <span className="text-3xl">⚕️</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            {isRegister ? 'Register for Healthcare Portal' : 'Healthcare Portal'}
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            {isRegister ? 'Select your role to register' : 'Select your role to access the healthcare management system'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {roles.map((role) => (
            <div
              key={role.id}
              onClick={() => selectRole(role.id)}
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
            >
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl p-8 border border-white/20 transition-all duration-300 hover:bg-white">
                <div className="flex items-center justify-center mb-6">
                  <div className={`h-16 w-16 rounded-full bg-gradient-to-r ${role.color} group-hover:bg-gradient-to-r group-hover:${role.hoverColor} flex items-center justify-center text-2xl shadow-lg transition-all duration-300 group-hover:shadow-xl`}>
                    <span className="text-white">{role.icon}</span>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors duration-300">
                    {role.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
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

        <div className="text-center mt-12">
          <p className="text-blue-100 text-sm">
            Secure • Reliable • Professional Healthcare Management
          </p>
          <div className="flex justify-center items-center mt-4 space-x-4 text-blue-200 text-xs">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              HIPAA Compliant
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              SSL Encrypted
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;