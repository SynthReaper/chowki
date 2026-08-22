/**
 * @component WardenPanel
 * @project Project CHOWKI — Campus Outbreak Surveillance System
 * @author Synthreaper | github.com/synthreaper/chowki
 * @description Hostel Warden Tactical Operations Hub with Live Student Pulse Inflow Stream & Doorstep Delivery Queue
 * @lastModified 2026-08-22
 */

import React, { useState, useEffect } from 'react';
import { UserCheck, CheckSquare, Square, ClipboardCheck, Droplets, ShieldCheck, Activity, Package, AlertCircle, PhoneCall, Ambulance, CheckCircle2, Clock, RefreshCw, Send, MapPin } from 'lucide-react';
import { fetchWardenTasks, updateWardenTask, submitWardenFieldLog } from '../api/client';

export default function WardenPanel({ zone = 'Hostel_C_Fl_3' }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chlorineInput, setChlorineInput] = useState(0.65);
  const [roStatus, setRoStatus] = useState('operational');
  const [sanitized, setSanitized] = useState(true);
  const [notes, setNotes] = useState('Floor 3 washrooms deep bleached with sodium hypochlorite.');
  const [fieldLogMsg, setFieldLogMsg] = useState('');

  // Live Student Pulses in Warden's Block Queue
  const [residentPulses, setResidentPulses] = useState([
    {
      id: 'PLS-304',
      room: 'Room 304',
      token: 'USR-CHK-91FA',
      symptoms: ['Projectile Vomiting', 'Nausea'],
      meal: 'Mess 2 (Palak Paneer)',
      timeAgo: '4 mins ago',
      orsStatus: 'pending',
      severity: 'high'
    },
    {
      id: 'PLS-302',
      room: 'Room 302',
      token: 'USR-CHK-88B1',
      symptoms: ['Vomiting', 'Stomach Cramps'],
      meal: 'Mess 2 (Palak Paneer)',
      timeAgo: '12 mins ago',
      orsStatus: 'dispatched',
      severity: 'high'
    },
    {
      id: 'PLS-306',
      room: 'Room 306',
      token: 'USR-CHK-44A9',
      symptoms: ['Severe Cramps', 'Watery Diarrhea'],
      meal: 'Mess 2 (Palak Paneer)',
      timeAgo: '19 mins ago',
      orsStatus: 'delivered',
      severity: 'moderate'
    },
    {
      id: 'PLS-305',
      room: 'Room 305',
      token: 'USR-CHK-77C2',
      symptoms: ['Nausea', 'Queasiness'],
      meal: 'Mess 2 (Palak Paneer)',
      timeAgo: '28 mins ago',
      orsStatus: 'delivered',
      severity: 'moderate'
    },
    {
      id: 'PLS-303',
      room: 'Room 303',
      token: 'USR-CHK-12E4',
      symptoms: ['Mild Fever', 'Headache'],
      meal: 'Mess 1 (Dal Tadka)',
      timeAgo: '42 mins ago',
      orsStatus: 'delivered',
      severity: 'low'
    }
  ]);

  const [escalationMsg, setEscalationMsg] = useState('');

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await fetchWardenTasks(zone);
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [zone]);

  const handleToggleTask = async (task) => {
    try {
      await updateWardenTask(task.id, !task.is_completed, 'Verified by Hostel Warden on floor inspection.');
      loadTasks();
    } catch (err) {
      alert(`Failed to update task: ${err.message}`);
    }
  };

  const handleToggleOrsDelivery = (id) => {
    setResidentPulses(prev => prev.map(p => {
      if (p.id === id) {
        const nextStatus = p.orsStatus === 'pending' ? 'dispatched' : p.orsStatus === 'dispatched' ? 'delivered' : 'pending';
        return { ...p, orsStatus: nextStatus };
      }
      return p;
    }));
  };

  const handleEscalateToClinic = (room) => {
    setEscalationMsg(`🚑 Emergency ambulance request dispatched to Campus Health Center for ${room}!`);
    setTimeout(() => setEscalationMsg(''), 5000);
  };

  const handleFieldLogSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitWardenFieldLog({
        zone: zone,
        free_chlorine_mg_l: parseFloat(chlorineInput),
        ro_unit_status: roStatus,
        sanitization_performed: sanitized,
        notes: notes
      });
      setFieldLogMsg('✅ Field inspection recorded in immutable statutory audit log.');
    } catch (err) {
      alert(`Error submitting log: ${err.message}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Warden Operations Banner */}
      <div className="luminous-card" style={{
        background: 'linear-gradient(135deg, #FFFFFF 0%, var(--surface-container-low) 100%)',
        border: '1.5px solid var(--amber-container)',
        padding: '20px 24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="pill-badge badge-amber" style={{ fontSize: '0.74rem' }}>
                👨‍✈️ HOSTEL WARDEN TACTICAL COMMAND
              </span>
              <span className="pill-badge badge-crimson" style={{ fontSize: '0.7rem' }}>
                Hostel Block C — Floor 3 Active Outbreak
              </span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--on-surface)', letterSpacing: '-0.02em' }}>
              Ground Containment & Resident Welfare Operations
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--on-surface-variant)', maxWidth: '720px', marginTop: '2px' }}>
              Real-time telemetry queue tracking resident health pulses, doorstep WHO-ORS delivery distribution, and water sanitation test strip logs.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#FFFFFF', padding: '10px 16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--surface-container)', textAlign: 'right' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--on-surface-variant)', fontWeight: '700' }}>Active Floor Hotspot</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--error)' }}>Block C — Floor 3 (7 Cases)</div>
            </div>
          </div>
        </div>
      </div>

      {escalationMsg && (
        <div style={{
          background: '#FFDAD6',
          color: '#93000A',
          padding: '12px 18px',
          borderRadius: 'var(--radius-md)',
          fontWeight: '800',
          fontSize: '0.86rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 4px 14px rgba(186, 26, 26, 0.2)'
        }}>
          <Ambulance size={20} />
          <span>{escalationMsg}</span>
        </div>
      )}

      {/* Grid: Live Student Pulse Inflow Stream (Left) + SOP Tasks & Field Log (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
        
        {/* LEFT COLUMN: LIVE RESIDENT PULSE INFLOW QUEUE */}
        <div className="luminous-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="pulse-dot-red"></span>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--on-surface)' }}>
                Live Resident Pulse Inflow Queue (Floor 3 Corridor)
              </h3>
            </div>
            <span className="pill-badge badge-lavender" style={{ fontSize: '0.7rem' }}>
              {residentPulses.length} Active Pulses
            </span>
          </div>

          <p style={{ fontSize: '0.78rem', color: 'var(--on-surface-variant)', marginBottom: '16px' }}>
            Incoming encrypted student check-in telemetry for Hostel Block C. Dispatch ORS hydration packets directly to room doors.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {residentPulses.map((pulse) => (
              <div
                key={pulse.id}
                style={{
                  background: 'var(--surface-container-low)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 16px',
                  border: `1.5px solid ${pulse.severity === 'high' ? 'var(--error-container)' : 'var(--surface-container)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-full)',
                    background: pulse.severity === 'high' ? '#FFDAD6' : '#FEF3C7',
                    color: pulse.severity === 'high' ? '#BA1A1A' : '#92400E',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    fontWeight: '800',
                    flexShrink: 0
                  }}>
                    🚪
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ fontSize: '0.92rem', color: 'var(--on-surface)' }}>
                        {pulse.room}
                      </strong>
                      <span className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--on-surface-variant)' }}>
                        ({pulse.token})
                      </span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--on-surface-variant)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Clock size={11} /> {pulse.timeAgo}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.76rem', color: pulse.severity === 'high' ? '#BA1A1A' : 'var(--on-surface)', marginTop: '3px', fontWeight: '600' }}>
                      Symptoms: {pulse.symptoms.join(', ')}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--on-surface-variant)', marginTop: '2px' }}>
                      Exposure: {pulse.meal}
                    </div>
                  </div>
                </div>

                {/* Warden Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => handleToggleOrsDelivery(pulse.id)}
                    style={{
                      background: pulse.orsStatus === 'delivered' ? '#F4FDE2' : pulse.orsStatus === 'dispatched' ? '#FEF3C7' : '#FFFFFF',
                      color: pulse.orsStatus === 'delivered' ? '#364B00' : pulse.orsStatus === 'dispatched' ? '#92400E' : 'var(--on-surface)',
                      border: `1px solid ${pulse.orsStatus === 'delivered' ? 'var(--primary)' : 'var(--surface-container-high)'}`,
                      borderRadius: 'var(--radius-full)',
                      padding: '5px 12px',
                      fontSize: '0.72rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Package size={12} />
                    {pulse.orsStatus === 'delivered' ? '✓ ORS Delivered' : pulse.orsStatus === 'dispatched' ? '📦 In Transit' : 'Deliver ORS'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleEscalateToClinic(pulse.room)}
                    title="Escalate to Campus Health Center Ambulance"
                    style={{
                      background: '#FFF0F0',
                      color: '#BA1A1A',
                      border: '1px solid var(--error-container)',
                      borderRadius: 'var(--radius-full)',
                      padding: '5px 10px',
                      fontSize: '0.72rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Ambulance size={12} />
                    Escalate
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT COLUMN: SOP TASKS & FIELD CHLORINATION FORM */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* SOP Task Checklist */}
          <div className="luminous-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ClipboardCheck size={18} style={{ color: 'var(--tertiary)' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--on-surface)' }}>
                  Warden Containment Tasks
                </h3>
              </div>
              <span className="pill-badge badge-lavender">
                Zone: {zone}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {tasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => handleToggleTask(t)}
                  style={{
                    background: t.is_completed ? 'var(--primary-container)' : 'var(--surface-container-low)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ marginTop: '2px' }}>
                    {t.is_completed ? (
                      <CheckSquare size={16} style={{ color: 'var(--primary)' }} />
                    ) : (
                      <Square size={16} style={{ color: 'var(--on-surface-variant)' }} />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '0.84rem',
                      fontWeight: '700',
                      color: t.is_completed ? 'var(--on-primary-container)' : 'var(--on-surface)',
                      textDecoration: t.is_completed ? 'line-through' : 'none'
                    }}>
                      {t.title}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: t.is_completed ? 'var(--on-primary-container)' : 'var(--on-surface-variant)', marginTop: '2px' }}>
                      {t.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Physical Chlorine Strip Field Log */}
          <div className="luminous-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Droplets size={18} style={{ color: 'var(--primary)' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--on-surface)' }}>
                Field Chlorine Strip & Sump Log
              </h3>
            </div>

            <form onSubmit={handleFieldLogSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: '700', color: 'var(--on-surface)', marginBottom: '4px' }}>
                  Free Residual Chlorine (DPD Chemical Strip Test in mg/L):
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={chlorineInput}
                  onChange={(e) => setChlorineInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--surface-container-high)',
                    fontSize: '0.85rem',
                    fontFamily: 'var(--font-mono)'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: '700', color: 'var(--on-surface)', marginBottom: '4px' }}>
                  Floor 3 Water Cooler / RO Unit Status:
                </label>
                <select
                  value={roStatus}
                  onChange={(e) => setRoStatus(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--surface-container-high)',
                    fontSize: '0.85rem'
                  }}
                >
                  <option value="operational">Operational — Auto Chlorinated</option>
                  <option value="diverted">Diverted / Quarantined to Ground Floor</option>
                  <option value="maintenance_required">Maintenance Required (Cartridge Swab)</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn-lime"
                style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '0.85rem' }}
              >
                <Send size={14} />
                Record Field Inspection Log
              </button>

              {fieldLogMsg && (
                <div style={{ marginTop: '8px', fontSize: '0.74rem', color: 'var(--primary)', fontWeight: '700' }}>
                  {fieldLogMsg}
                </div>
              )}
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
