/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Incident } from '../types';
import { MapPin, Info, ArrowUpRight } from 'lucide-react';

interface MapComponentProps {
  incidents: Incident[];
  onSelectIncident?: (id: string) => void;
  pickerMode?: boolean;
  selectedCoords?: { latitude: number; longitude: number };
  onCoordsChange?: (coords: { latitude: number; longitude: number; displayAddress: string }) => void;
}

export default function MapComponent({
  incidents,
  onSelectIncident,
  pickerMode = false,
  selectedCoords,
  onCoordsChange
}: MapComponentProps) {
  const [hoveredPin, setHoveredPin] = useState<Incident | null>(null);
  const [selectedPin, setSelectedPin] = useState<Incident | null>(null);

  // Map coordinates (Veridale City boundings)
  // Lat range: 37.73 to 37.80
  // Lng range: -122.47 to -122.39
  const latMin = 37.7300;
  const latMax = 37.8000;
  const lngMin = -122.4700;
  const lngMax = -122.3900;

  // Convert lat/lng to SVG percentage coordinates
  const convertCoords = (lat: number, lng: number) => {
    // x corresponds to longitude (lng)
    const x = ((lng - lngMin) / (lngMax - lngMin)) * 100;
    // y corresponds to latitude (lat) - inverted since SVG y-axis goes down
    const y = 100 - (((lat - latMin) / (latMax - latMin)) * 100);
    return { x: Math.max(2, Math.min(98, x)), y: Math.max(2, Math.min(98, y)) };
  };

  // Convert SVG click percentages back to lat/lng
  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!pickerMode || !onCoordsChange) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const pctX = (clickX / rect.width) * 100;
    const pctY = (clickY / rect.height) * 100;

    const lng = lngMin + (pctX / 100) * (lngMax - lngMin);
    const lat = latMin + ((100 - pctY) / 100) * (latMax - latMin);

    // Dynamic reverse-geocoding simulator for Veridale City
    let address = 'Veridale Sector Area';
    let ward = 'General District';

    if (lat > 37.77 && lng < -122.41) {
      address = `${Math.floor(lat * 1000) % 500 + 100} Oakwood Street, North Side`;
      ward = 'Ward 4 - Education District';
    } else if (lat > 37.78 && lng > -122.41) {
      address = `${Math.floor(lat * 1000) % 500 + 1200} Elm Street, Central`;
      ward = 'Ward 2 - Central Hill';
    } else if (lat < 37.77 && lng < -122.44) {
      address = `Intersection near Pine Boulevard & West Ave`;
      ward = 'Ward 7 - West End';
    } else if (lat < 37.76 && lng > -122.44 && lng < -122.41) {
      address = `${Math.floor(lat * 1000) % 500 + 400} Greenwood Park North Boundary`;
      ward = 'Ward 5 - Parks & Recreation';
    } else if (lat > 37.78 && lng > -122.40) {
      address = `Market Square Mall, loading bay alley`;
      ward = 'Ward 1 - Downtown Commercial';
    } else {
      address = `${Math.floor(lat * 1000) % 500 + 80} Veridale Ave, Ward ${Math.floor(lat * 100) % 5 + 1}`;
      ward = `Ward ${Math.floor(lat * 100) % 5 + 1}`;
    }

    onCoordsChange({
      latitude: Number(lat.toFixed(6)),
      longitude: Number(lng.toFixed(6)),
      displayAddress: address
    });
  };

  const getPriorityColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'fill-rose-500 stroke-rose-700';
      case 'HIGH': return 'fill-amber-500 stroke-amber-700';
      case 'MEDIUM': return 'fill-blue-500 stroke-blue-700';
      case 'LOW': return 'fill-slate-400 stroke-slate-600';
      default: return 'fill-emerald-500 stroke-emerald-700';
    }
  };

  const getStatusBgColor = (status: string) => {
    if (status === 'RESOLVED') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (status === 'REJECTED') return 'bg-rose-100 text-rose-800 border-rose-200';
    if (status === 'IN_PROGRESS' || status === 'ACCEPTED_BY_DEPARTMENT') return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  return (
    <div id="veridale-interactive-map" className="relative w-full aspect-[4/3] bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-sm select-none">
      {/* SVG Map Graphics */}
      <svg
        onClick={handleMapClick}
        className={`w-full h-full ${pickerMode ? 'cursor-crosshair' : 'cursor-default'}`}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Background Grid */}
        <defs>
          <pattern id="gridPattern" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e2e8f0" strokeWidth="0.15" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="#f8fafc" />
        <rect width="100%" height="100%" fill="url(#gridPattern)" />

        {/* Greenwood Park Area */}
        <rect x="15" y="55" width="45" height="30" rx="3" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="0.3" />
        <text x="37" y="72" className="fill-emerald-600 font-sans font-semibold text-[3px]" textAnchor="middle">
          GREENWOOD PARK (Ward 5)
        </text>

        {/* Education/School Area */}
        <rect x="5" y="10" width="35" height="25" rx="3" fill="#f0fdfa" stroke="#99f6e4" strokeWidth="0.3" />
        <text x="22" y="24" className="fill-teal-700 font-sans font-semibold text-[3px]" textAnchor="middle">
          EDUCATION SECTOR (Ward 4)
        </text>

        {/* Downtown Commercial Area */}
        <rect x="65" y="15" width="30" height="30" rx="3" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="0.3" />
        <text x="80" y="31" className="fill-blue-700 font-sans font-semibold text-[3px]" textAnchor="middle">
          DOWNTOWN MALL (Ward 1)
        </text>

        {/* Suburbs Area */}
        <rect x="60" y="60" width="35" height="35" rx="3" fill="#faf5ff" stroke="#e9d5ff" strokeWidth="0.3" />
        <text x="77" y="80" className="fill-purple-700 font-sans font-semibold text-[3px]" textAnchor="middle">
          ORCHARD SUBURBS (Ward 6)
        </text>

        {/* Principal Road Networks (Grid Grid) */}
        {/* Highway 101 */}
        <line x1="50" y1="0" x2="50" y2="100" stroke="#cbd5e1" strokeWidth="1.2" />
        <text x="52" y="5" className="fill-slate-500 font-sans font-semibold text-[2px]">HWY 101</text>

        {/* Pine Boulevard */}
        <line x1="0" y1="45" x2="100" y2="45" stroke="#cbd5e1" strokeWidth="0.9" />
        <text x="2" y="44" className="fill-slate-500 font-sans font-semibold text-[2px]">Pine Blvd</text>

        {/* Elm Street */}
        <line x1="0" y1="20" x2="100" y2="20" stroke="#cbd5e1" strokeWidth="0.6" strokeDasharray="1,1" />
        <text x="2" y="19" className="fill-slate-500 font-sans font-semibold text-[2px]">Elm Street</text>

        {/* Oakwood Street */}
        <line x1="20" y1="0" x2="20" y2="100" stroke="#cbd5e1" strokeWidth="0.6" />
        <text x="21" y="98" className="fill-slate-500 font-sans font-semibold text-[2px]" transform="rotate(-90 21 98)">Oakwood St</text>

        {/* Castro Street */}
        <line x1="75" y1="0" x2="75" y2="100" stroke="#cbd5e1" strokeWidth="0.6" />
        <text x="76" y="98" className="fill-slate-500 font-sans font-semibold text-[2px]" transform="rotate(-90 76 98)">Castro St</text>

        {/* Map Pins / Cluster representations */}
        {!pickerMode && incidents.map(inc => {
          const { x, y } = convertCoords(inc.location.latitude, inc.location.longitude);
          const isSelected = selectedPin?.id === inc.id;
          return (
            <g
              key={inc.id}
              className="cursor-pointer group"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPin(inc);
                if (onSelectIncident) onSelectIncident(inc.id);
              }}
              onMouseEnter={() => setHoveredPin(inc)}
              onMouseLeave={() => setHoveredPin(null)}
            >
              {/* Ripple Ring for High Urgency */}
              {(inc.priorityLevel === 'CRITICAL' || inc.priorityLevel === 'HIGH') && inc.status !== 'RESOLVED' && (
                <circle
                  cx={x}
                  cy={y}
                  r="2.5"
                  className={`animate-ping opacity-25 fill-none stroke-current ${
                    inc.priorityLevel === 'CRITICAL' ? 'text-rose-500' : 'text-amber-500'
                  }`}
                  strokeWidth="0.3"
                />
              )}

              {/* Pin Base Shadow */}
              <ellipse cx={x} cy={y + 0.8} rx="0.8" ry="0.3" fill="#475569" fillOpacity="0.3" />

              {/* Pin Circle */}
              <circle
                cx={x}
                cy={y}
                r={isSelected ? '1.8' : '1.3'}
                className={`transition-all duration-200 stroke-white ${getPriorityColor(inc.priorityLevel)} ${
                  isSelected ? 'stroke-[0.4]' : 'stroke-[0.25] group-hover:r-[1.6]'
                }`}
              />

              {/* Resolved Overlay checkmark */}
              {inc.status === 'RESOLVED' && (
                <path
                  d={`M ${x - 0.4} ${y} L ${x - 0.1} ${y + 0.3} L ${x + 0.4} ${y - 0.3}`}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="0.2"
                  strokeLinecap="round"
                />
              )}
            </g>
          );
        })}

        {/* Report Picker Indicator Pin */}
        {pickerMode && selectedCoords && (() => {
          const { x, y } = convertCoords(selectedCoords.latitude, selectedCoords.longitude);
          return (
            <g>
              <ellipse cx={x} cy={y + 1.2} rx="1" ry="0.4" fill="#6366f1" fillOpacity="0.4" />
              <path
                d={`M ${x} ${y + 1.2} C ${x - 1.2} ${y} ${x - 1.2} ${y - 1.2} ${x} ${y - 2.4} C ${x + 1.2} ${y - 1.2} ${x + 1.2} ${y} ${x} ${y + 1.2} Z`}
                className="fill-indigo-600 stroke-white stroke-[0.3]"
              />
              <circle cx={x} cy={y - 0.6} r="0.6" fill="#ffffff" />
            </g>
          );
        })()}
      </svg>

      {/* Floating Info Panels */}
      {pickerMode && (
        <div className="absolute top-3 left-3 bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-xl border border-slate-800 max-w-[240px] pointer-events-none">
          <p className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 flex items-center gap-1">
            <Info className="w-3.5 h-3.5" /> GPS Manual Pin Picker
          </p>
          <p className="text-xs text-slate-300 mt-1 leading-normal">
            Click anywhere on Veridale City map to set latitude and longitude. AI will align routing!
          </p>
          {selectedCoords && (
            <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400 font-mono">
              <div>Lat: {selectedCoords.latitude}</div>
              <div>Lng: {selectedCoords.longitude}</div>
            </div>
          )}
        </div>
      )}

      {/* Hover Tooltip */}
      {!pickerMode && hoveredPin && (
        <div
          className="absolute pointer-events-none bg-slate-950/95 backdrop-blur-md border border-slate-800 text-white p-2.5 rounded-xl shadow-xl z-10 text-xs flex flex-col gap-1 w-52"
          style={{
            left: `${convertCoords(hoveredPin.location.latitude, hoveredPin.location.longitude).x}%`,
            top: `${convertCoords(hoveredPin.location.latitude, hoveredPin.location.longitude).y - 22}%`,
            transform: 'translateX(-50%)'
          }}
        >
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-100">{hoveredPin.incidentCode}</span>
            <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-bold ${
              hoveredPin.priorityLevel === 'CRITICAL' ? 'bg-rose-950 text-rose-300' :
              hoveredPin.priorityLevel === 'HIGH' ? 'bg-amber-950 text-amber-300' :
              'bg-blue-950 text-blue-300'
            }`}>
              {hoveredPin.priorityLevel}
            </span>
          </div>
          <p className="font-semibold text-slate-200 line-clamp-1">{hoveredPin.title}</p>
          <p className="text-[10px] text-slate-400 truncate">{hoveredPin.location.displayAddress}</p>
        </div>
      )}

      {/* Selected Incident Detail Widget */}
      {!pickerMode && selectedPin && (
        <div className="absolute bottom-3 right-3 left-3 bg-white/95 backdrop-blur-md border border-slate-200 p-3 rounded-2xl shadow-xl flex gap-3 items-center z-20 animate-slide-up">
          {selectedPin.primaryImageUrl && (
            <img
              src={selectedPin.primaryImageUrl}
              alt=""
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-lg object-cover shrink-0"
            />
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-slate-900">{selectedPin.incidentCode}</span>
              <span className={`text-[9px] px-1.5 py-0.5 font-bold rounded-full uppercase border ${getStatusBgColor(selectedPin.status)}`}>
                {selectedPin.status.replace(/_/g, ' ')}
              </span>
            </div>
            <h4 className="text-xs font-bold text-slate-800 truncate mt-0.5">{selectedPin.title}</h4>
            <p className="text-[10px] text-slate-500 truncate">{selectedPin.location.displayAddress}</p>
          </div>
          <button
            onClick={() => {
              if (onSelectIncident) onSelectIncident(selectedPin.id);
            }}
            className="p-2 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl flex items-center justify-center transition-all shrink-0 group"
          >
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
}
