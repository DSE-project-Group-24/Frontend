// import React from "react";
// import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
// import "leaflet/dist/leaflet.css";

// const hospitals = [
//   { name: "DGH – Vavuniya", lat: 8.7542, lng: 80.4971 },
//   { name: "DGH – Mullaithivu", lat: 9.2671, lng: 80.8147 },
//   { name: "Teaching Hospital - Jaffna (THJ)", lat: 9.6626, lng: 80.0210 },
//   { name: "Base Hospital (A) - Tellipalai", lat: 9.7840, lng: 80.0100 },
//   { name: "Base Hospital (B) - Chavakachcheri", lat: 9.6581, lng: 80.1747 },
//   { name: "DGH – Kilinochchi", lat: 9.3956, lng: 80.4060 },
//   { name: "Base Hospital (A) - Point Pedro", lat: 9.8167, lng: 80.2333 },
//   { name: "DGH – Mannar", lat: 8.9770, lng: 79.9072 },
//   { name: "DH,Alavedddy", lat: 9.7, lng: 80.02 },
//   { name: "DH,Nanattan", lat: 8.87, lng: 79.93 },
//   { name: "DH,Poonakary", lat: 9.31, lng: 80.20 },
//   { name: "DH,Tharmapuram", lat: 9.29, lng: 80.85 },
//   { name: "Base Hospital (B) - Mulankavil", lat: 9.28, lng: 80.18 },
//   { name: "Base Hospital (B) - Mallavi", lat: 9.25, lng: 80.52 },
//   { name: "DH,Palai", lat: 9.57, lng: 80.35 },
//   { name: "DH,Kopay", lat: 9.68, lng: 80.05 },
//   { name: "Base Hospital (B) - Puthukudiyiruppu", lat: 9.30, lng: 80.85 },
//   { name: "DH,Sampathnuwara", lat: 9.07, lng: 80.77 },
//   { name: "Base Hospital (B) - Cheddikulam", lat: 8.75, lng: 80.45 },
//   { name: "Base Hospital (B) - Kayts", lat: 9.68, lng: 79.94 },
//   { name: "DH,Atchuveli", lat: 9.75, lng: 80.08 },
//   { name: "DH,Periyapandivirichchan", lat: 8.97, lng: 79.96 },
//   { name: "DH, Sithamparapuram", lat: 8.76, lng: 80.43 },
//   { name: "PMCU, Tharapuram", lat: 8.92, lng: 79.93 },
//   { name: "Base Hospital (B) - Murunkan", lat: 8.93, lng: 79.96 },
//   { name: "Base Hospital (A) - Mankulam", lat: 9.15, lng: 80.47 },
//   { name: "DH,Karainagar", lat: 9.74, lng: 79.91 },
//   { name: "DH,Vaddakachchi", lat: 9.38, lng: 80.43 },
//   { name: "DH,Velanai", lat: 9.68, lng: 79.91 },
//   { name: "DH,Adampan", lat: 8.95, lng: 79.96 },
//   { name: "DH,Akkarayankulam", lat: 9.33, lng: 80.46 },
//   { name: "DH,Vankalai", lat: 8.96, lng: 79.92 },
//   { name: "DH,Nainativu", lat: 9.65, lng: 79.76 },
//   { name: "DH,Chankanai", lat: 9.73, lng: 79.99 },
//   { name: "DH,Chilawaththurai", lat: 8.95, lng: 79.85 },
//   { name: "DH,Vidathaltivu", lat: 8.90, lng: 79.88 },
//   { name: "DH, Nerijakulam", lat: 8.80, lng: 80.45 },
//   { name: "DH, Ulukulam", lat: 8.83, lng: 80.30 },
//   { name: "DH,Alampil", lat: 9.16, lng: 80.75 },
//   { name: "DH,Oddusuddan", lat: 9.22, lng: 80.67 },
//   { name: "DH, Puliyankulam", lat: 9.13, lng: 80.48 },
//   { name: "DH,Pesalai", lat: 9.02, lng: 79.84 },
//   { name: "PMCU, Velankulam", lat: 9.02, lng: 80.52 },
//   { name: "DH, Poovarasankulam", lat: 8.83, lng: 80.44 },
//   { name: "DH,Veravil", lat: 9.39, lng: 80.11 },
//   { name: "DH,Nedunkerny", lat: 9.15, lng: 80.70 },
//   { name: "DH,Talaimannar", lat: 9.05, lng: 79.73 },
//   { name: "DH,Delft", lat: 9.53, lng: 79.65 },
//   { name: "DH,Vaddukoddai", lat: 9.75, lng: 79.98 },
//   { name: "DH,Uruthirapuram", lat: 9.30, lng: 80.47 },
//   { name: "DH,Valvettithurai", lat: 9.82, lng: 80.17 },
//   { name: "DH,Kokulai", lat: 9.30, lng: 80.68 },
//   { name: "DH,Pungudutivu", lat: 9.63, lng: 79.84 },
//   { name: "DH,Moonkilaru", lat: 9.18, lng: 80.66 },
//   { name: "PMCU, Omanthai", lat: 8.93, lng: 80.46 },
//   { name: "PMCU, Bogeswewa", lat: 8.95, lng: 80.55 },
//   { name: "DH,Kodikamam", lat: 9.65, lng: 80.18 },
//   { name: "DH,Erukalampitti", lat: 8.84, lng: 79.84 },
// ];

// const HospitalsMap = () => {
//   return (
//     <div className="w-full h-[80vh] rounded-xl overflow-hidden shadow-md">
//       <MapContainer
//         center={[9.0, 80.4]} // Center near Northern Province
//         zoom={8}
//         style={{ height: "100%", width: "100%" }}
//       >
//         <TileLayer
//           attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />
//         {hospitals.map((hospital, index) => (
//           <CircleMarker
//             key={index}
//             center={[hospital.lat, hospital.lng]}
//             pathOptions={{ color: "red", fillColor: "red", fillOpacity: 0.8 }}
//             radius={5}
//           >
//             <Tooltip direction="top" offset={[0, -5]} opacity={1} permanent>
//               {hospital.name}
//             </Tooltip>
//           </CircleMarker>
//         ))}
//       </MapContainer>
//     </div>
//   );
// };

// export default HospitalsMap;


import React from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { t } from "../utils/translations";

const hospitals = [
  { name: "DGH – Vavuniya", lat: 8.7542, lng: 80.4971 },
  { name: "DGH – Mullaithivu", lat: 9.2671, lng: 80.8147 },
  { name: "Teaching Hospital - Jaffna (THJ)", lat: 9.6626, lng: 80.0210 },
  { name: "Base Hospital (A) - Tellipalai", lat: 9.7840, lng: 80.0100 },
  { name: "Base Hospital (B) - Chavakachcheri", lat: 9.6581, lng: 80.1747 },
  { name: "DGH – Kilinochchi", lat: 9.3956, lng: 80.4060 },
  { name: "Base Hospital (A) - Point Pedro", lat: 9.8167, lng: 80.2333 },
  { name: "DGH – Mannar", lat: 8.9770, lng: 79.9072 },
  { name: "DH,Alavedddy", lat: 9.7, lng: 80.02 },
  { name: "DH,Nanattan", lat: 8.87, lng: 79.93 },
  { name: "DH,Poonakary", lat: 9.31, lng: 80.20 },
  { name: "DH,Tharmapuram", lat: 9.29, lng: 80.85 },
  { name: "Base Hospital (B) - Mulankavil", lat: 9.28, lng: 80.18 },
  { name: "Base Hospital (B) - Mallavi", lat: 9.25, lng: 80.52 },
  { name: "DH,Palai", lat: 9.57, lng: 80.35 },
  { name: "DH,Kopay", lat: 9.68, lng: 80.05 },
  { name: "Base Hospital (B) - Puthukudiyiruppu", lat: 9.30, lng: 80.85 },
  { name: "DH,Sampathnuwara", lat: 9.07, lng: 80.77 },
  { name: "Base Hospital (B) - Cheddikulam", lat: 8.75, lng: 80.45 },
  { name: "Base Hospital (B) - Kayts", lat: 9.68, lng: 79.94 },
  { name: "DH,Atchuveli", lat: 9.75, lng: 80.08 },
  { name: "DH,Periyapandivirichchan", lat: 8.97, lng: 79.96 },
  { name: "DH, Sithamparapuram", lat: 8.76, lng: 80.43 },
  { name: "PMCU, Tharapuram", lat: 8.92, lng: 79.93 },
  { name: "Base Hospital (B) - Murunkan", lat: 8.93, lng: 79.96 },
  { name: "Base Hospital (A) - Mankulam", lat: 9.15, lng: 80.47 },
  { name: "DH,Karainagar", lat: 9.74, lng: 79.91 },
  { name: "DH,Vaddakachchi", lat: 9.38, lng: 80.43 },
  { name: "DH,Velanai", lat: 9.68, lng: 79.91 },
  { name: "DH,Adampan", lat: 8.95, lng: 79.96 },
  { name: "DH,Akkarayankulam", lat: 9.33, lng: 80.46 },
  { name: "DH,Vankalai", lat: 8.96, lng: 79.92 },
  { name: "DH,Nainativu", lat: 9.65, lng: 79.76 },
  { name: "DH,Chankanai", lat: 9.73, lng: 79.99 },
  { name: "DH,Chilawaththurai", lat: 8.95, lng: 79.85 },
  { name: "DH,Vidathaltivu", lat: 8.90, lng: 79.88 },
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
  { name: "DH,Talaimannar", lat: 9.05, lng: 79.73 },
  { name: "DH,Delft", lat: 9.53, lng: 79.65 },
  { name: "DH,Vaddukoddai", lat: 9.75, lng: 79.98 },
  { name: "DH,Uruthirapuram", lat: 9.30, lng: 80.47 },
  { name: "DH,Valvettithurai", lat: 9.82, lng: 80.17 },
  { name: "DH,Kokulai", lat: 9.30, lng: 80.68 },
  { name: "DH,Pungudutivu", lat: 9.63, lng: 79.84 },
  { name: "DH,Moonkilaru", lat: 9.18, lng: 80.66 },
  { name: "PMCU, Omanthai", lat: 8.93, lng: 80.46 },
  { name: "PMCU, Bogeswewa", lat: 8.95, lng: 80.55 },
  { name: "DH,Kodikamam", lat: 9.65, lng: 80.18 },
  { name: "DH,Erukalampitti", lat: 8.84, lng: 79.84 },
];

const HospitalsMap = () => {
  return (
    <div className="w-full h-[80vh] rounded-xl overflow-hidden shadow-md">
      <MapContainer
        center={[9.2, 80.3]}   // Adjusted center for Northern Province
        zoom={8.5}             // Zoom level matching your screenshot
        minZoom={7.5}
        maxZoom={12}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {hospitals.map((hospital, index) => (
          <CircleMarker
            key={index}
            center={[hospital.lat, hospital.lng]}
            pathOptions={{ color: "red", fillColor: "red", fillOpacity: 0.8 }}
            radius={6}
          >
            <Tooltip direction="top" offset={[0, -5]} opacity={1} permanent>
              {t(hospital.name)}
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
};

export default HospitalsMap;
