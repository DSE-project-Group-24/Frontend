import React from 'react';

const Footer = ({ 
  title = "Road Accident Care System",
  description = "Comprehensive emergency management platform connecting hospitals, government agencies, and medical professionals for enhanced accident response and patient care coordination.",
  sections = [],
  quickLinks = [
    { label: "Emergency Hotline", value: "911", icon: "phone" },
    { label: "System Status", value: "All Systems Operational", icon: "status", color: "green" },
    { label: "Last Updated", value: new Date().toLocaleString(), icon: "clock" }
  ],
  socialLinks = [
    // { platform: "Twitter", url: "https://twitter.com/RoadAccidentCare", handle: "@RoadAccidentCare" },
    { platform: "LinkedIn", url: "https://linkedin.com/company/road-accident-care-system-group24", handle: "road-accident-care-system-group24" },
    { platform: "Email", url: "mailto:contact@roadaccidentcare.org", handle: "contact@roadaccidentcare.org" }
  ],
  showSystemStatus = true,
  copyright = "Road Accident Care System",
  poweredBy = "Group 24 - Data Science Engineering",
  className = ""
}) => {
  return (
    <footer className={`bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-300 rounded-full translate-y-32 -translate-x-32"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-blue-200 text-sm">Emergency Care Excellence</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              {description}
            </p>
            
            {/* Quick Contact */}
            <div className="flex flex-wrap gap-8 lg:gap-12">
              {quickLinks.map((link, index) => (
                <div key={index} className="flex items-center space-x-3">
                  {link.icon === 'phone' && (
                    <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                  )}
                  {link.icon === 'status' && (
                    <div className={`w-8 h-8 ${link.color === 'green' ? 'bg-green-500' : 'bg-gray-500'} rounded-lg flex items-center justify-center`}>
                      <div className={`w-3 h-3 ${link.color === 'green' ? 'bg-green-200' : 'bg-gray-200'} rounded-full animate-pulse`}></div>
                    </div>
                  )}
                  {link.icon === 'clock' && (
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-white">{link.label}</p>
                    <p className="text-xs text-gray-300">{link.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Dynamic Sections */}
          {sections.map((section, index) => (
            <div key={index} className="lg:col-span-1">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wide border-b border-blue-700 pb-2">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <div className="text-sm text-gray-300 flex items-center space-x-2">
                      <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{item}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        
        
        {/* Bottom Section */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-center lg:text-left">
              <p className="text-sm text-gray-300">
                © {new Date().getFullYear()} {copyright}. All rights reserved.
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Licensed healthcare management platform - Patient data protected under HIPAA
              </p>
            </div>
            
            {/* Social Links & Credits */}
            <div className="flex flex-col lg:flex-row items-center gap-4">
              {/* Social Links */}
              <div className="flex items-center space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-xs hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.platform}: {social.handle}
                  </a>
                ))}
              </div>
              
              {/* Credits */}
              <div className="flex items-center space-x-2 bg-white/5 px-3 py-1 rounded-full">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-xs text-gray-300">Built by {poweredBy}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;