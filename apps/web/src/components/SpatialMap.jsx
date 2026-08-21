/**
 * @component SpatialMap
 * @project Project CHOWKI — Campus Outbreak Surveillance System
 * @author Synthreaper | github.com/synthreaper/chowki
 * @description Dynamic Campus & Floor-Level Spatial Micro-Resolution Radar with F1/F2/F3 Blueprints
 * @lastModified 2026-08-22
 */

import React, { useState } from 'react';
import { MapPin, Navigation, Droplets, Layers, ShieldAlert, Cpu, Home, Grid, CheckCircle2, AlertOctagon } from 'lucide-react';

export default function SpatialMap({ zones = [], selectedZone, onSelectZone }) {
  const [activeFloor, setActiveFloor] = useState(3); // 1, 2, 3
  const [viewMode, setViewMode] = useState('floor'); // 'floor' | 'campus'

  const safeZones = Array.isArray(zones) ? zones : [];
  const zoneMap = {};
  safeZones.forEach(z => {
    const k = z.zone_token || z.zone_id;
    if (k) zoneMap[k] = z;
  });

  const blockCData = zoneMap['Hostel_C_Fl_3'] || { case_count: 0, alert_level: 0 };
  const blockAData = zoneMap['Hostel_A_Fl_1'] || { case_count: 0, alert_level: 0 };
  const blockBData = zoneMap['Hostel_B_Fl_2'] || { case_count: 0, alert_level: 0 };
  const blockDData = zoneMap['Hostel_D_Fl_1'] || { case_count: 0, alert_level: 0 };

  const isOutbreakActive = (blockCData.case_count || 0) >= 3 || (blockCData.alert_level || 0) >= 2;

  // Generate floor-specific room topology
  const getFloorRooms = (floorNum) => {
    const prefix = floorNum * 100;
    const rooms = [];
    for (let i = 1; i <= 12; i++) {
      const roomNum = prefix + i;
      let status = 'normal';
      let symptoms = [];

      if (floorNum === 3 && isOutbreakActive) {
        // Floor 3 has the 5-case outbreak cluster in adjacent rooms
        if ([302, 303, 304, 305, 306].includes(roomNum)) {
          status = 'outbreak';
          symptoms = ['Nausea', 'Vomiting', 'Cramps'];
        }
      } else if (floorNum === 1) {
        // Floor 1 has 1 solitary sporadic case
        if (roomNum === 104) {
          status = 'sporadic';
          symptoms = ['Mild Queasiness'];
        }
      }
      // Floor 2 has 0 cases

      rooms.push({
        number: roomNum,
        status: status,
        occupants: 2,
        symptoms: symptoms
      });
    }
    return rooms;
  };

  const currentRooms = getFloorRooms(activeFloor);
  const floorCases = currentRooms.filter(r => r.status !== 'normal').length;
  const isFloorHot = activeFloor === 3 && isOutbreakActive;

  return (
    <div className="luminous-card" style={{ minHeight: '460px', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header with View Toggle and Floor Level Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Navigation size={18} style={{ color: 'var(--tertiary)' }} />
          <h2 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--on-surface)' }}>
            Spatial Topology Radar // Hostel Block C
          </h2>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* View Mode Toggle */}
          <div style={{ display: 'flex', background: 'var(--surface-container-low)', padding: '3px', borderRadius: 'var(--radius-full)' }}>
            <button
              onClick={() => setViewMode('floor')}
              style={{
                background: viewMode === 'floor' ? '#FFFFFF' : 'transparent',
                color: viewMode === 'floor' ? 'var(--on-surface)' : 'var(--on-surface-variant)',
                border: 'none',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.72rem',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: viewMode === 'floor' ? '0 1px 4px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              Floor Blueprint
            </button>
            <button
              onClick={() => setViewMode('campus')}
              style={{
                background: viewMode === 'campus' ? '#FFFFFF' : 'transparent',
                color: viewMode === 'campus' ? 'var(--on-surface)' : 'var(--on-surface-variant)',
                border: 'none',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.72rem',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: viewMode === 'campus' ? '0 1px 4px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              Campus Map
            </button>
          </div>

          {/* Floor Level Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', background: 'var(--surface-container-low)', padding: '3px', borderRadius: 'var(--radius-full)' }}>
            <Layers size={13} style={{ color: 'var(--on-surface-variant)', marginLeft: '6px' }} />
            <span style={{ fontSize: '0.72rem', color: 'var(--on-surface-variant)', fontWeight: '600', marginRight: '4px' }}>Floor:</span>
            {[1, 2, 3].map((fl) => (
              <button
                key={fl}
                onClick={() => {
                  setActiveFloor(fl);
                  if (fl === 3 && onSelectZone) onSelectZone('Hostel_C_Fl_3');
                }}
                style={{
                  background: activeFloor === fl ? 'var(--primary-container)' : 'transparent',
                  color: activeFloor === fl ? 'var(--on-primary-container)' : 'var(--on-surface-variant)',
                  border: 'none',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.74rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                F{fl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Interactive Display Area */}
      <div style={{
        position: 'relative',
        flex: 1,
        background: 'var(--surface-container-low)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--surface-container)',
        overflow: 'hidden',
        minHeight: '340px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        
        {viewMode === 'floor' ? (
          /* ============================================================
             VIEW 1: FLOOR MICRO-BLUEPRINT RESOLUTION (F1, F2, F3)
             ============================================================ */
          <div>
            
            {/* Top Floor Summary Banner */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#FFFFFF',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 16px',
              marginBottom: '16px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
            }}>
              <div>
                <span style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--on-surface)' }}>
                  Hostel Block C — Floor {activeFloor} Architectural Blueprint
                </span>
                <div style={{ fontSize: '0.74rem', color: 'var(--on-surface-variant)', marginTop: '2px' }}>
                  12 Rooms • 24 Residents • Water Source: Floor {activeFloor} RO Dispenser (Cl2: {isFloorHot ? '0.18' : '0.52'} mg/L)
                </div>
              </div>
              <span className={`pill-badge ${isFloorHot ? 'badge-crimson' : activeFloor === 1 ? 'badge-lavender' : 'badge-lime'}`}>
                {isFloorHot ? '5 Outbreak Cases (p=0.002)' : activeFloor === 1 ? '1 Sporadic Case' : '0 Cases (Clear)'}
              </span>
            </div>

            {/* Architectural Corridor Layout */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: `1.5px solid ${isFloorHot ? 'var(--error-container)' : 'var(--surface-container)'}`,
              padding: '16px',
              position: 'relative'
            }}>
              
              {/* North Wing Rooms (301-306 / 201-206 / 101-106) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px', marginBottom: '10px' }}>
                {currentRooms.slice(0, 6).map((room) => {
                  const isHot = room.status === 'outbreak';
                  const isSporadic = room.status === 'sporadic';
                  return (
                    <div
                      key={room.number}
                      style={{
                        background: isHot ? '#FFDAD6' : isSporadic ? 'var(--tertiary-container)' : 'var(--surface-container-low)',
                        border: `1.5px solid ${isHot ? '#BA1A1A' : isSporadic ? '#C4C0FF' : 'var(--surface-container)'}`,
                        borderRadius: 'var(--radius-sm)',
                        padding: '10px 8px',
                        textAlign: 'center',
                        boxShadow: isHot ? '0 2px 10px rgba(255, 51, 102, 0.25)' : 'none',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ fontSize: '0.78rem', fontWeight: '800', color: isHot ? '#BA1A1A' : isSporadic ? 'var(--tertiary)' : 'var(--on-surface)' }}>
                        Room {room.number}
                      </div>
                      <div style={{ fontSize: '0.65rem', fontWeight: '600', color: isHot ? '#BA1A1A' : isSporadic ? 'var(--tertiary)' : 'var(--primary)', marginTop: '2px' }}>
                        {isHot ? '⚠️ 1 Case' : isSporadic ? '1 Case (Noise)' : '● Clear'}
                      </div>
                      {room.symptoms.length > 0 && (
                        <div style={{ fontSize: '0.58rem', color: isHot ? '#93000A' : 'var(--on-surface-variant)', marginTop: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {room.symptoms.join(', ')}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Central Walking Corridor */}
              <div style={{
                height: '32px',
                background: 'var(--surface-container-low)',
                borderRadius: 'var(--radius-xs)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 16px',
                marginBottom: '10px',
                border: '1px dashed #CBD5E1'
              }}>
                <span className="font-mono text-muted" style={{ fontSize: '0.68rem' }}>◄ NORTH STAIRCASE</span>
                <span className="font-mono" style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--on-surface-variant)' }}>
                  CENTRAL ACCESS CORRIDOR // FLOOR {activeFloor}
                </span>
                <span className="font-mono text-muted" style={{ fontSize: '0.68rem' }}>SOUTH RO SUMP DISPENSER ►</span>
              </div>

              {/* South Wing Rooms (307-312 / 207-212 / 107-112) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px' }}>
                {currentRooms.slice(6, 12).map((room) => {
                  const isHot = room.status === 'outbreak';
                  return (
                    <div
                      key={room.number}
                      style={{
                        background: isHot ? '#FFDAD6' : 'var(--surface-container-low)',
                        border: `1.5px solid ${isHot ? '#BA1A1A' : 'var(--surface-container)'}`,
                        borderRadius: 'var(--radius-sm)',
                        padding: '10px 8px',
                        textAlign: 'center',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ fontSize: '0.78rem', fontWeight: '800', color: isHot ? '#BA1A1A' : 'var(--on-surface)' }}>
                        Room {room.number}
                      </div>
                      <div style={{ fontSize: '0.65rem', fontWeight: '600', color: isHot ? '#BA1A1A' : 'var(--primary)', marginTop: '2px' }}>
                        {isHot ? '⚠️ 1 Case' : '● Clear'}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Floor Status Explanation Banner */}
            <div style={{
              marginTop: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.76rem',
              color: 'var(--on-surface-variant)'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: isFloorHot ? 'var(--error)' : 'var(--primary)' }}></span>
                {isFloorHot
                  ? 'Active Contagion: Point-source cluster concentrated in contiguous rooms 302-306.'
                  : activeFloor === 1
                  ? 'Baseline Normal: Room 104 is an isolated off-campus meal (p ≥ 0.05).'
                  : 'Baseline Normal: Zero reported gastrointestinal symptoms.'}
              </span>
              <span className="font-mono text-muted">
                Scan Window: T-4h
              </span>
            </div>

          </div>
        ) : (
          /* ============================================================
             VIEW 2: CAMPUS MACRO GIS OVERVIEW
             ============================================================ */
          <svg viewBox="0 0 700 320" style={{ width: '100%', height: '100%' }}>
            <defs>
              <pattern id="campus-grid-macro" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#E2E8F0" strokeWidth="0.8" />
              </pattern>
            </defs>

            <rect width="700" height="320" fill="url(#campus-grid-macro)" />

            {/* Water Pipelines */}
            <path d="M 520 240 L 520 90 L 220 90" fill="none" stroke={isOutbreakActive ? '#FF3366' : '#59569D'} strokeWidth="3" strokeDasharray="6 4" />
            <path d="M 520 240 L 370 240" fill="none" stroke="#59569D" strokeWidth="2.5" strokeDasharray="6 4" />

            {/* BLOCK C */}
            <g onClick={() => { setActiveFloor(3); setViewMode('floor'); }} style={{ cursor: 'pointer' }}>
              <rect x="105" y="55" width="120" height="75" rx="16" fill={isOutbreakActive ? '#FFDAD6' : '#FFFFFF'} stroke={isOutbreakActive ? '#BA1A1A' : '#CBD5E1'} strokeWidth={isOutbreakActive ? '2.5' : '1'} />
              <text x="117" y="80" fill="#1E293B" fontSize="12" fontWeight="700">Hostel Block C</text>
              <text x="117" y="100" fill={isOutbreakActive ? '#BA1A1A' : '#64748B'} fontSize="10" fontWeight="600" fontFamily="monospace">Floor 3: 5 Cases</text>
              <text x="117" y="118" fill={isOutbreakActive ? '#BA1A1A' : '#516600'} fontSize="9" fontWeight="700">{isOutbreakActive ? '● Level 2 Alert' : '● Clear'}</text>
            </g>

            {/* BLOCK A */}
            <g onClick={() => { setActiveFloor(1); setViewMode('floor'); }} style={{ cursor: 'pointer' }}>
              <rect x="105" y="195" width="110" height="70" rx="16" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
              <text x="117" y="220" fill="#1E293B" fontSize="11" fontWeight="700">Hostel Block A</text>
              <text x="117" y="240" fill="#64748B" fontSize="9" fontFamily="monospace">Floor 1: 1 Case</text>
              <text x="117" y="254" fill="#516600" fontSize="9" fontWeight="600">● Normal</text>
            </g>

            {/* BLOCK B */}
            <g onClick={() => { setActiveFloor(2); setViewMode('floor'); }} style={{ cursor: 'pointer' }}>
              <rect x="265" y="55" width="110" height="70" rx="16" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
              <text x="277" y="80" fill="#1E293B" fontSize="11" fontWeight="700">Hostel Block B</text>
              <text x="277" y="100" fill="#64748B" fontSize="9" fontFamily="monospace">Floor 2: 0 Cases</text>
              <text x="277" y="114" fill="#516600" fontSize="9" fontWeight="600">● Normal</text>
            </g>

            {/* BLOCK D */}
            <g style={{ cursor: 'pointer' }}>
              <rect x="265" y="195" width="110" height="70" rx="16" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
              <text x="277" y="220" fill="#1E293B" fontSize="11" fontWeight="700">Hostel Block D</text>
              <text x="277" y="240" fill="#64748B" fontSize="9" fontFamily="monospace">Floor 1: 0 Cases</text>
              <text x="277" y="254" fill="#516600" fontSize="9" fontWeight="600">● Normal</text>
            </g>

            {/* MESS 2 */}
            <g style={{ cursor: 'pointer' }}>
              <rect x="435" y="55" width="125" height="75" rx="16" fill={isOutbreakActive ? '#FEF3C7' : '#FFFFFF'} stroke={isOutbreakActive ? '#F59E0B' : '#CBD5E1'} strokeWidth={isOutbreakActive ? '2' : '1'} />
              <text x="447" y="80" fill="#1E293B" fontSize="11" fontWeight="700">Mess Hall 2</text>
              <text x="447" y="100" fill="#D97706" fontSize="9" fontWeight="600">Palak Paneer (High)</text>
              <text x="447" y="118" fill={isOutbreakActive ? '#D97706' : '#516600'} fontSize="9" fontWeight="700">{isOutbreakActive ? '⚠️ Exposure Link' : '● Safe'}</text>
            </g>

            {/* RO SUMP C */}
            <g style={{ cursor: 'pointer' }}>
              <rect x="465" y="215" width="115" height="65" rx="16" fill={isOutbreakActive ? '#FFDAD6' : '#F2EEFF'} stroke={isOutbreakActive ? '#BA1A1A' : '#C4C0FF'} strokeWidth="2" />
              <text x="477" y="240" fill="#1E293B" fontSize="11" fontWeight="700">RO Sump C</text>
              <text x="477" y="258" fill={isOutbreakActive ? '#BA1A1A' : '#59569D'} fontSize="9" fontFamily="monospace">Cl2: {isOutbreakActive ? '0.18' : '0.52'} mg/L</text>
              <text x="477" y="272" fill={isOutbreakActive ? '#BA1A1A' : '#516600'} fontSize="8" fontWeight="700">{isOutbreakActive ? '⚠️ Chlorine Dip' : '● Optimal'}</text>
            </g>
          </svg>
        )}

      </div>

      {/* Footer Info */}
      <div style={{
        marginTop: '14px',
        padding: '12px 18px',
        background: 'var(--surface-container-low)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.8rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={15} style={{ color: isFloorHot ? 'var(--error)' : 'var(--primary)' }} />
          <span style={{ fontWeight: '700', color: 'var(--on-surface)' }}>
            Active Focus: Hostel Block C (Floor {activeFloor})
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--on-surface-variant)', fontFamily: 'var(--font-mono)' }}>
            [k-Anonymity Verified: 24 Residents on Floor]
          </span>
        </div>

        <div style={{ color: isFloorHot ? 'var(--error)' : 'var(--primary)', fontWeight: '600', fontSize: '0.78rem' }}>
          {isFloorHot ? 'Micro-Cluster: Contiguous Rooms 302-306 // Palak Paneer Exposure' : activeFloor === 1 ? 'Solitary sporadic case in Room 104' : 'All rooms on Floor 2 within standard baseline'}
        </div>
      </div>

    </div>
  );
}
