// // import React from "react";
// // import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
// // import "leaflet/dist/leaflet.css";
// // import { t } from "../utils/translations";
// // const hospitals = [
// //   { name: "DGH – Vavuniya", lat: 8.7542, lng: 80.4971 },
// //   { name: "DGH – Mullaithivu", lat: 9.2671, lng: 80.8147 },
// //   { name: "Teaching Hospital - Jaffna (THJ)", lat: 9.66597, lng: 80.01458 },
// //   { name: "Base Hospital (A) - Tellipalai", lat: 9.78539, lng: 80.03958 },
// //   { name: "Base Hospital (B) - Chavakachcheri", lat: 9.66164, lng: 80.167 },
// //   { name: "DGH – Kilinochchi", lat: 9.39295, lng: 80.35829 },
// //   { name: "Base Hospital (A) - Point Pedro", lat: 9.80519, lng: 80.22412 },
// //   { name: "DGH – Mannar", lat: 8.9770, lng: 79.9072 },
// //   { name: "DH,Alaveddy", lat: 9.7667, lng: 80.0000 },
// //   { name: "DH,Nanattan", lat: 8.867, lng: 80.000 },
// //   { name: "DH,Poonakary", lat: 9.50431, lng: 80.21241 },
// //   { name: "DH,Tharmapuram", lat: 9.29, lng: 80.85 },
// //   { name: "Base Hospital (B) - Mulankavil", lat: 9.23333, lng: 80.13333 },
// //   { name: "Base Hospital (B) - Mallavi", lat: 9.13461, lng: 80.30875 },
// //   { name: "DH,Palai", lat: 9.61167, lng: 80.32556 },
// //   { name: "DH,Kopay", lat: 9.6833, lng: 80.0500 },
// //   { name: "Base Hospital (B) - Puthukudiyiruppu", lat: 9.30, lng: 80.85 },
// //   { name: "DH,Sampathnuwara", lat: 9.07, lng: 80.77 },
// //   { name: "Base Hospital (B) - Cheddikulam", lat: 8.6591, lng: 80.31244 },
// //   { name: "Base Hospital (B) - Kayts", lat: 9.69339, lng: 79.8681 },
// //   { name: "DH,Atchuveli", lat: 9.75, lng: 80.08 },
// //   { name: "DH,Periyapandivirichchan", lat: 8.97, lng: 79.96 },
// //   { name: "DH, Sithamparapuram", lat: 8.76, lng: 80.43 },
// //   { name: "PMCU, Tharapuram", lat: 8.92, lng: 79.93 },
// //   { name: "Base Hospital (B) - Murunkan", lat: 8.93, lng: 79.96 },
// //   { name: "Base Hospital (A) - Mankulam", lat: 9.15, lng: 80.47 },
// //   { name: "DH,Karainagar", lat: 9.74, lng: 79.91 },
// //   { name: "DH,Vaddakachchi", lat: 9.38, lng: 80.43 },
// //   { name: "DH,Velanai", lat: 9.667, lng: 79.867 },
// //   { name: "DH,Adampan", lat: 8.95, lng: 79.96 },
// //   { name: "DH,Akkarayankulam", lat: 9.33, lng: 80.46 },
// //   { name: "DH,Vankalai", lat: 8.96, lng: 79.92 },
// //   { name: "DH,Nainativu", lat: 9.603, lng: 79.769 },
// //   { name: "DH,Chankanai", lat: 9.73, lng: 79.99 },
// //   { name: "DH,Chilawaththurai", lat: 8.877, lng: 79.928 },
// //   { name: "DH,Vidathaltivu", lat: 9.017, lng: 80.05 },
// //   { name: "DH, Nerijakulam", lat: 8.80, lng: 80.45 },
// //   { name: "DH, Ulukulam", lat: 8.83, lng: 80.30 },
// //   { name: "DH,Alampil", lat: 9.16, lng: 80.75 },
// //   { name: "DH,Oddusuddan", lat: 9.22, lng: 80.67 },
// //   { name: "DH, Puliyankulam", lat: 9.13, lng: 80.48 },
// //   { name: "DH,Pesalai", lat: 9.02, lng: 79.84 },
// //   { name: "PMCU, Velankulam", lat: 9.02, lng: 80.52 },
// //   { name: "DH, Poovarasankulam", lat: 8.83, lng: 80.44 },
// //   { name: "DH,Veravil", lat: 9.39, lng: 80.11 },
// //   { name: "DH,Nedunkerny", lat: 9.15, lng: 80.70 },
// //   { name: "DH,Talaimannar", lat: 9.10, lng: 79.73 },
// //   { name: "DH,Delft", lat: 9.53, lng: 79.65 },
// //   { name: "DH,Vaddukoddai", lat: 9.75, lng: 79.98 },
// //   { name: "DH,Uruthirapuram", lat: 9.30, lng: 80.47 },
// //   { name: "DH,Valvettithurai", lat: 9.82, lng: 80.17 },
// //   { name: "DH,Kokulai", lat: 9.30, lng: 80.68 },
// //   { name: "DH,Pungudutivu", lat: 9.59, lng: 79.832 },
// //   { name: "DH,Moonkilaru", lat: 9.18, lng: 80.66 },
// //   { name: "PMCU, Omanthai", lat: 8.93, lng: 80.46 },
// //   { name: "PMCU, Bogeswewa", lat: 8.95, lng: 80.55 },
// //   { name: "DH,Kodikamam", lat: 9.681, lng: 80.21 },
// //   { name: "DH,Erukalampitti", lat: 9.034, lng: 79.875 },
// // ];
// // const HospitalsMap = ({ selectedHospital, allHospitals }) => {
// //   return (
// //     <div className="w-full h-[80vh] rounded-xl overflow-hidden shadow-md relative z-0">
// //       <MapContainer
// //         center={[9.2, 80.3]}   // Adjusted center for Northern Province
// //         zoom={8.5}             // Zoom level matching your screenshot
// //         minZoom={7.5}
// //         maxZoom={12}
// //         style={{ height: "100%", width: "100%", position: 'relative', zIndex: 1 }}
// //       >
// //         <TileLayer
// //           attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
// //           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// //         />
// //         {hospitals.map((hospital, index) => (
// //           <CircleMarker
// //             key={index}
// //             center={[hospital.lat, hospital.lng]}
// //             pathOptions={{ color: "red", fillColor: "red", fillOpacity: 0.8 }}
// //             radius={6}
// //           >
// //             <Tooltip direction="top" offset={[0, -5]} opacity={1} permanent>
// //               {t(hospital.name)}
// //             </Tooltip>
// //           </CircleMarker>
// //         ))}
// //       </MapContainer>
// //     </div>
// //   );
// // };
// // export default HospitalsMap;


// import React, { useEffect, useRef } from "react";
// import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet";
// import "leaflet/dist/leaflet.css";

// // Component to handle map view updates
// const MapViewController = ({ hospitals }) => {
//   const map = useMap();
  
//   useEffect(() => {
//     if (hospitals && hospitals.length > 0) {
//       if (hospitals.length === 1) {
//         // Single hospital - center and zoom in
//         const hospital = hospitals[0];
//         map.setView([hospital.lat, hospital.lng], 11, { animate: true });
//       } else {
//         // Multiple hospitals - fit bounds
//         const bounds = hospitals.map(h => [h.lat, h.lng]);
//         if (bounds.length > 1) {
//           map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
//         }
//       }
//     } else {
//       // No filters - show all (default view)
//       map.setView([9.2, 80.3], 8.5, { animate: true });
//     }
//   }, [hospitals, map]);
  
//   return null;
// };

// const HospitalsMap = ({ selectedHospital, allHospitals, filterType, filterRegion, searchTerm }) => {
//   const mapRef = useRef(null);

//   // Determine which hospitals to display
//   const getDisplayHospitals = () => {
//     // Hardcoded hospital coordinates
//     const hospitalCoordinates = [
//       { name: "DGH – Vavuniya", lat: 8.7542, lng: 80.4971 },
//       { name: "DGH – Mullaithivu", lat: 9.2671, lng: 80.8147 },
//       { name: "Teaching Hospital - Jaffna (THJ)", lat: 9.66597, lng: 80.01458 },
//       { name: "Base Hospital (A) - Tellipalai", lat: 9.78539, lng: 80.03958 },
//       { name: "Base Hospital (B) - Chavakachcheri", lat: 9.66164, lng: 80.167 },
//       { name: "DGH – Kilinochchi", lat: 9.39295, lng: 80.35829 },
//       { name: "Base Hospital (A) - Point Pedro", lat: 9.80519, lng: 80.22412 },
//       { name: "DGH – Mannar", lat: 8.9770, lng: 79.9072 },
//       { name: "DH,Alaveddy", lat: 9.7667, lng: 80.0000 },
//       { name: "DH,Nanattan", lat: 8.867, lng: 80.000 },
//       { name: "DH,Poonakary", lat: 9.50431, lng: 80.21241 },
//       { name: "DH,Tharmapuram", lat: 9.29, lng: 80.85 },
//       { name: "Base Hospital (B) - Mulankavil", lat: 9.23333, lng: 80.13333 },
//       { name: "Base Hospital (B) - Mallavi", lat: 9.13461, lng: 80.30875 },
//       { name: "DH,Palai", lat: 9.61167, lng: 80.32556 },
//       { name: "DH,Kopay", lat: 9.6833, lng: 80.0500 },
//       { name: "Base Hospital (B) - Puthukudiyiruppu", lat: 9.30, lng: 80.85 },
//       { name: "DH,Sampathnuwara", lat: 9.07, lng: 80.77 },
//       { name: "Base Hospital (B) - Cheddikulam", lat: 8.6591, lng: 80.31244 },
//       { name: "Base Hospital (B) - Kayts", lat: 9.69339, lng: 79.8681 },
//       { name: "DH,Atchuveli", lat: 9.75, lng: 80.08 },
//       { name: "DH,Periyapandivirichchan", lat: 8.97, lng: 79.96 },
//       { name: "DH, Sithamparapuram", lat: 8.76, lng: 80.43 },
//       { name: "PMCU, Tharapuram", lat: 8.92, lng: 79.93 },
//       { name: "Base Hospital (B) - Murunkan", lat: 8.93, lng: 79.96 },
//       { name: "Base Hospital (A) - Mankulam", lat: 9.15, lng: 80.47 },
//       { name: "DH,Karainagar", lat: 9.74, lng: 79.91 },
//       { name: "DH,Vaddakachchi", lat: 9.38, lng: 80.43 },
//       { name: "DH,Velanai", lat: 9.667, lng: 79.867 },
//       { name: "DH,Adampan", lat: 8.95, lng: 79.96 },
//       { name: "DH,Akkarayankulam", lat: 9.33, lng: 80.46 },
//       { name: "DH,Vankalai", lat: 8.96, lng: 79.92 },
//       { name: "DH,Nainativu", lat: 9.603, lng: 79.769 },
//       { name: "DH,Chankanai", lat: 9.73, lng: 79.99 },
//       { name: "DH,Chilawaththurai", lat: 8.877, lng: 79.928 },
//       { name: "DH,Vidathaltivu", lat: 9.017, lng: 80.05 },
//       { name: "DH, Nerijakulam", lat: 8.80, lng: 80.45 },
//       { name: "DH, Ulukulam", lat: 8.83, lng: 80.30 },
//       { name: "DH,Alampil", lat: 9.16, lng: 80.75 },
//       { name: "DH,Oddusuddan", lat: 9.22, lng: 80.67 },
//       { name: "DH, Puliyankulam", lat: 9.13, lng: 80.48 },
//       { name: "DH,Pesalai", lat: 9.02, lng: 79.84 },
//       { name: "PMCU, Velankulam", lat: 9.02, lng: 80.52 },
//       { name: "DH, Poovarasankulam", lat: 8.83, lng: 80.44 },
//       { name: "DH,Veravil", lat: 9.39, lng: 80.11 },
//       { name: "DH,Nedunkerny", lat: 9.15, lng: 80.70 },
//       { name: "DH,Talaimannar", lat: 9.10, lng: 79.73 },
//       { name: "DH,Delft", lat: 9.53, lng: 79.65 },
//       { name: "DH,Vaddukoddai", lat: 9.75, lng: 79.98 },
//       { name: "DH,Uruthirapuram", lat: 9.30, lng: 80.47 },
//       { name: "DH,Valvettithurai", lat: 9.82, lng: 80.17 },
//       { name: "DH,Kokulai", lat: 9.30, lng: 80.68 },
//       { name: "DH,Pungudutivu", lat: 9.59, lng: 79.832 },
//       { name: "DH,Moonkilaru", lat: 9.18, lng: 80.66 },
//       { name: "PMCU, Omanthai", lat: 8.93, lng: 80.46 },
//       { name: "PMCU, Bogeswewa", lat: 8.95, lng: 80.55 },
//       { name: "DH,Kodikamam", lat: 9.681, lng: 80.21 },
//       { name: "DH,Erukalampitti", lat: 9.034, lng: 79.875 }
//     ];

//     // If a specific hospital is selected, show only that one
//     if (selectedHospital) {
//       const coords = hospitalCoordinates.find(
//         h => h.name.toLowerCase() === (selectedHospital.name || '').toLowerCase()
//       );
//       if (coords) {
//         return [{ ...selectedHospital, ...coords }];
//       }
//       return [];
//     }

//     // Merge allHospitals data with coordinates
//     let hospitalsWithCoords = hospitalCoordinates.map(coord => {
//       const hospitalData = allHospitals.find(
//         h => (h.name || '').toLowerCase() === coord.name.toLowerCase()
//       );
//       return { ...coord, ...hospitalData };
//     });

//     // Apply filters
//     if (searchTerm && searchTerm.trim()) {
//       hospitalsWithCoords = hospitalsWithCoords.filter(h =>
//         (h.name || '').toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     if (filterType && filterType !== 'all') {
//       hospitalsWithCoords = hospitalsWithCoords.filter(h =>
//         (h.Type || h.type || '').toLowerCase().includes(filterType.toLowerCase())
//       );
//     }

//     if (filterRegion && filterRegion !== 'all') {
//       hospitalsWithCoords = hospitalsWithCoords.filter(h =>
//         (h.Region || h.region) === filterRegion
//       );
//     }

//     return hospitalsWithCoords;
//   };

//   const displayHospitals = getDisplayHospitals();

//   // Determine marker colors based on selection/filter state
//   const getMarkerColor = (hospital) => {
//     if (selectedHospital) {
//       return hospital.name === selectedHospital.name ? "#ef4444" : "#94a3b8";
//     }
//     if (searchTerm || filterType !== 'all' || filterRegion !== 'all') {
//       return "#3b82f6"; // Blue for filtered results
//     }
//     return "#ef4444"; // Red for all hospitals
//   };

//   const getMarkerRadius = (hospital) => {
//     if (selectedHospital && hospital.name === selectedHospital.name) {
//       return 10;
//     }
//     return 6;
//   };

//   return (
//     <div className="w-full h-[80vh] rounded-xl overflow-hidden shadow-md relative z-0">
//       <MapContainer
//         center={[9.2, 80.3]}
//         zoom={8.5}
//         minZoom={7.5}
//         maxZoom={14}
//         style={{ height: "100%", width: "100%", position: 'relative', zIndex: 1 }}
//         ref={mapRef}
//       >
//         <TileLayer
//           attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />
        
//         <MapViewController hospitals={displayHospitals} />
        
//         {displayHospitals.map((hospital, index) => {
//           const color = getMarkerColor(hospital);
//           const radius = getMarkerRadius(hospital);
          
//           return (
//             <CircleMarker
//               key={`${hospital.name}-${index}`}
//               center={[hospital.lat, hospital.lng]}
//               pathOptions={{ 
//                 color: color, 
//                 fillColor: color, 
//                 fillOpacity: 0.8,
//                 weight: 2
//               }}
//               radius={radius}
//             >
//               <Tooltip 
//                 direction="top" 
//                 offset={[0, -5]} 
//                 opacity={1}
//                 permanent={selectedHospital && hospital.name === selectedHospital.name}
//               >
//                 <div className="text-sm">
//                   <div className="font-semibold">{hospital.name}</div>
//                   {hospital.Type && (
//                     <div className="text-xs text-gray-600">{hospital.Type}</div>
//                   )}
//                   {hospital.Region && (
//                     <div className="text-xs text-gray-600">{hospital.Region}</div>
//                   )}
//                 </div>
//               </Tooltip>
//             </CircleMarker>
//           );
//         })}
//       </MapContainer>
      
//       {/* Map Legend */}
//       <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg z-10 text-sm">
//         <div className="font-semibold mb-2">Map Legend</div>
//         <div className="flex items-center gap-2 mb-1">
//           <div className="w-3 h-3 rounded-full bg-red-500"></div>
//           <span className="text-xs">
//             {selectedHospital ? 'Selected Hospital' : 'All Hospitals'}
//           </span>
//         </div>
//         {(searchTerm || filterType !== 'all' || filterRegion !== 'all') && !selectedHospital && (
//           <div className="flex items-center gap-2 mb-1">
//             <div className="w-3 h-3 rounded-full bg-blue-500"></div>
//             <span className="text-xs">Filtered Results</span>
//           </div>
//         )}
//         {selectedHospital && displayHospitals.length > 1 && (
//           <div className="flex items-center gap-2">
//             <div className="w-3 h-3 rounded-full bg-gray-400"></div>
//             <span className="text-xs">Other Hospitals</span>
//           </div>
//         )}
//         <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-600">
//           Showing {displayHospitals.length} hospital{displayHospitals.length !== 1 ? 's' : ''}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HospitalsMap;


import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Component to handle map view updates
const MapViewController = ({ hospitals }) => {
  const map = useMap();
  
  useEffect(() => {
    if (hospitals && hospitals.length > 0) {
      if (hospitals.length === 1) {
        // Single hospital - center and zoom in
        const hospital = hospitals[0];
        map.setView([hospital.lat, hospital.lng], 11, { animate: true });
      } else {
        // Multiple hospitals - fit bounds
        const bounds = hospitals.map(h => [h.lat, h.lng]);
        if (bounds.length > 1) {
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
        }
      }
    } else {
      // No filters - show all (default view)
      map.setView([9.2, 80.3], 8.5, { animate: true });
    }
  }, [hospitals, map]);
  
  return null;
};

const HospitalsMap = ({ selectedHospital, allHospitals, filterType, filterRegion, searchTerm }) => {
  const mapRef = useRef(null);

  // Determine which hospitals to display
  const getDisplayHospitals = () => {
    // Hardcoded hospital coordinates
    const hospitalCoordinates = [
      { name: "DGH – Vavuniya", lat: 8.7542, lng: 80.4971 },
      { name: "DGH – Mullaithivu", lat: 9.2671, lng: 80.8147 },
      { name: "Teaching Hospital - Jaffna (THJ)", lat: 9.66597, lng: 80.01458 },
      { name: "Base Hospital (A) - Tellipalai", lat: 9.78539, lng: 80.03958 },
      { name: "Base Hospital (B) - Chavakachcheri", lat: 9.66164, lng: 80.167 },
      { name: "DGH – Kilinochchi", lat: 9.39295, lng: 80.35829 },
      { name: "Base Hospital (A) - Point Pedro", lat: 9.80519, lng: 80.22412 },
      { name: "DGH – Mannar", lat: 8.9770, lng: 79.9072 },
      { name: "DH,Alaveddy", lat: 9.7667, lng: 80.0000 },
      { name: "DH,Nanattan", lat: 8.867, lng: 80.000 },
      { name: "DH,Poonakary", lat: 9.50431, lng: 80.21241 },
      { name: "DH,Tharmapuram", lat: 9.29, lng: 80.85 },
      { name: "Base Hospital (B) - Mulankavil", lat: 9.23333, lng: 80.13333 },
      { name: "Base Hospital (B) - Mallavi", lat: 9.13461, lng: 80.30875 },
      { name: "DH,Palai", lat: 9.61167, lng: 80.32556 },
      { name: "DH,Kopay", lat: 9.6833, lng: 80.0500 },
      { name: "Base Hospital (B) - Puthukudiyiruppu", lat: 9.30, lng: 80.85 },
      { name: "DH,Sampathnuwara", lat: 9.07, lng: 80.77 },
      { name: "Base Hospital (B) - Cheddikulam", lat: 8.6591, lng: 80.31244 },
      { name: "Base Hospital (B) - Kayts", lat: 9.69339, lng: 79.8681 },
      { name: "DH,Atchuveli", lat: 9.75, lng: 80.08 },
      { name: "DH,Periyapandivirichchan", lat: 8.97, lng: 79.96 },
      { name: "DH, Sithamparapuram", lat: 8.76, lng: 80.43 },
      { name: "PMCU, Tharapuram", lat: 8.92, lng: 79.93 },
      { name: "Base Hospital (B) - Murunkan", lat: 8.93, lng: 79.96 },
      { name: "Base Hospital (A) - Mankulam", lat: 9.15, lng: 80.47 },
      { name: "DH,Karainagar", lat: 9.74, lng: 79.91 },
      { name: "DH,Vaddakachchi", lat: 9.38, lng: 80.43 },
      { name: "DH,Velanai", lat: 9.667, lng: 79.867 },
      { name: "DH,Adampan", lat: 8.95, lng: 79.96 },
      { name: "DH,Akkarayankulam", lat: 9.33, lng: 80.46 },
      { name: "DH,Vankalai", lat: 8.96, lng: 79.92 },
      { name: "DH,Nainativu", lat: 9.603, lng: 79.769 },
      { name: "DH,Chankanai", lat: 9.73, lng: 79.99 },
      { name: "DH,Chilawaththurai", lat: 8.877, lng: 79.928 },
      { name: "DH,Vidathaltivu", lat: 9.017, lng: 80.05 },
      { name: "DH, Nerijakulam", lat: 8.80, lng: 80.45 },
      { name: "DH, Ulukulam", lat: 8.83, lng: 80.30 },
      { name: "DH,Alampil", lat: 9.16, lng: 80.75 },
      { name: "DH,Oddusuddan", lat: 9.22, lng: 80.67 },
      { name: "DH, Puliyankulam", lat: 9.13, lng: 80.48 },
      { name: "DH,Pesalai", lat: 9.02, lng: 79.84 },
      { name: "PMCU, Velankulam", lat: 9.02, lng: 80.52 },
      { name: "DH, Poovarasankulam", lat: 8.83, lng: 80.44 },
      { name: "DH,Veravil", lat: 9.39, lng: 80.11 },
      { name: "DH,Nedunkerny", lat: 9.15, lng: 80.70 },
      { name: "DH,Talaimannar", lat: 9.10, lng: 79.73 },
      { name: "DH,Delft", lat: 9.53, lng: 79.65 },
      { name: "DH,Vaddukoddai", lat: 9.75, lng: 79.98 },
      { name: "DH,Uruthirapuram", lat: 9.30, lng: 80.47 },
      { name: "DH,Valvettithurai", lat: 9.82, lng: 80.17 },
      { name: "DH,Kokulai", lat: 9.30, lng: 80.68 },
      { name: "DH,Pungudutivu", lat: 9.59, lng: 79.832 },
      { name: "DH,Moonkilaru", lat: 9.18, lng: 80.66 },
      { name: "PMCU, Omanthai", lat: 8.93, lng: 80.46 },
      { name: "PMCU, Bogeswewa", lat: 8.95, lng: 80.55 },
      { name: "DH,Kodikamam", lat: 9.681, lng: 80.21 },
      { name: "DH,Erukalampitti", lat: 9.034, lng: 79.875 }
    ];

    // Merge allHospitals data with coordinates first
    let hospitalsWithCoords = hospitalCoordinates.map(coord => {
      const hospitalData = allHospitals.find(
        h => (h.name || '').toLowerCase() === coord.name.toLowerCase()
      );
      return { ...coord, ...hospitalData };
    });

    // Check if any filters are active (excluding 'all' values)
    const hasActiveFilters = 
      (searchTerm && searchTerm.trim()) || 
      (filterType && filterType !== 'all') || 
      (filterRegion && filterRegion !== 'all');

    // If a specific hospital is selected from search, show only that one
    if (selectedHospital) {
      const coords = hospitalCoordinates.find(
        h => h.name.toLowerCase() === (selectedHospital.name || '').toLowerCase()
      );
      if (coords) {
        return [{ ...selectedHospital, ...coords }];
      }
      return [];
    }

    // If filters are active (but no specific hospital selected), apply filters and show all matching
    if (hasActiveFilters) {
      if (searchTerm && searchTerm.trim()) {
        hospitalsWithCoords = hospitalsWithCoords.filter(h =>
          (h.name || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (filterType && filterType !== 'all') {
        hospitalsWithCoords = hospitalsWithCoords.filter(h =>
          (h.Type || h.type || '').toLowerCase().includes(filterType.toLowerCase())
        );
      }

      if (filterRegion && filterRegion !== 'all') {
        hospitalsWithCoords = hospitalsWithCoords.filter(h =>
          (h.Region || h.region) === filterRegion
        );
      }
    }

    // Return all hospitals (filtered or unfiltered)
    return hospitalsWithCoords;
  };

  const displayHospitals = getDisplayHospitals();

  // Determine marker colors based on selection/filter state
  const getMarkerColor = (hospital) => {
    if (selectedHospital) {
      return hospital.name === selectedHospital.name ? "#ef4444" : "#94a3b8";
    }
    if (searchTerm || filterType !== 'all' || filterRegion !== 'all') {
      return "#3b82f6"; // Blue for filtered results
    }
    return "#ef4444"; // Red for all hospitals
  };

  const getMarkerRadius = (hospital) => {
    if (selectedHospital && hospital.name === selectedHospital.name) {
      return 10;
    }
    return 6;
  };

  return (
    <div className="w-full h-[80vh] rounded-xl overflow-hidden shadow-md relative z-0">
      <MapContainer
        center={[9.2, 80.3]}
        zoom={8.5}
        minZoom={7.5}
        maxZoom={14}
        style={{ height: "100%", width: "100%", position: 'relative', zIndex: 1 }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapViewController hospitals={displayHospitals} />
        
        {displayHospitals.map((hospital, index) => {
          const color = getMarkerColor(hospital);
          const radius = getMarkerRadius(hospital);
          
          return (
            <CircleMarker
              key={`${hospital.name}-${index}`}
              center={[hospital.lat, hospital.lng]}
              pathOptions={{ 
                color: color, 
                fillColor: color, 
                fillOpacity: 0.8,
                weight: 2
              }}
              radius={radius}
            >
              <Tooltip 
                direction="top" 
                offset={[0, -5]} 
                opacity={1}
                permanent={selectedHospital && hospital.name === selectedHospital.name}
              >
                <div className="text-sm">
                  <div className="font-semibold">{hospital.name}</div>
                  {hospital.Type && (
                    <div className="text-xs text-gray-600">{hospital.Type}</div>
                  )}
                  {hospital.Region && (
                    <div className="text-xs text-gray-600">{hospital.Region}</div>
                  )}
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
      
      {/* Map Legend */}
      <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg z-10 text-sm">
        <div className="font-semibold mb-2">Map Legend</div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-xs">
            {selectedHospital ? 'Selected Hospital' : 'All Hospitals'}
          </span>
        </div>
        {(searchTerm || filterType !== 'all' || filterRegion !== 'all') && !selectedHospital && (
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs">Filtered Results</span>
          </div>
        )}
        {selectedHospital && displayHospitals.length > 1 && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
            <span className="text-xs">Other Hospitals</span>
          </div>
        )}
        <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-600">
          Showing {displayHospitals.length} hospital{displayHospitals.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
};

export default HospitalsMap;