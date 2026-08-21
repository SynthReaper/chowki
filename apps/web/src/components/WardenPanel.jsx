/**
 * @component WardenPanel
 * @project Project CHOWKI — Campus Outbreak Surveillance System
 * @author Synthreaper | github.com/synthreaper/chowki
 * @description Hostel Warden tactical containment panel with verified SOP checklist & field log
 * @lastModified 2026-08-22
 */

import React, { useState, useEffect } from 'react';
import { UserCheck, CheckSquare, Square, ClipboardCheck, Droplets, ShieldCheck } from 'lucide-react';
import { fetchWardenTasks, updateWardenTask, submitWardenFieldLog } from '../api/client';

export default function WardenPanel({ zone = 'Hostel_C_Fl_3' }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chlorineInput, setChlorineInput] = useState(0.65);
  const [roStatus, setRoStatus] = useState('operational');
  const [sanitized, setSanitized] = useState(true);
  const [notes, setNotes] = useState('Floor 3 washrooms deep bleached with sodium hypochlorite.');
  const [fieldLogMsg, setFieldLogMsg] = useState('');

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
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
      
      {/* Left Card: SOP Tasks */}
      <div className="luminous-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ClipboardCheck size={18} style={{ color: 'var(--tertiary)' }} />
            <h2 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--on-surface)' }}>
              Hostel Warden SOP Tasks
            </h2>
          </div>
          <span className="pill-badge badge-lavender">
            Zone: {zone}
          </span>
        </div>

        <p style={{ fontSize: '0.78rem', color: 'var(--on-surface-variant)', marginBottom: '16px' }}>
          Mandatory containment protocols dispatched upon Level 1/2 outbreak alerts.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {tasks.map((t) => (
            <div
              key={t.id}
              onClick={() => handleToggleTask(t)}
              style={{
                background: t.is_completed ? 'var(--primary-container)' : 'var(--surface-container-low)',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ marginTop: '2px' }}>
                {t.is_completed ? (
                  <CheckSquare size={18} style={{ color: 'var(--primary)' }} />
                ) : (
                  <Square size={18} style={{ color: 'var(--on-surface-variant)' }} />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '0.86rem',
                  fontWeight: '700',
                  color: t.is_completed ? 'var(--on-primary-container)' : 'var(--on-surface)',
                  textDecoration: t.is_completed ? 'line-through' : 'none'
                }}>
                  {t.title}
                </div>
                <div style={{ fontSize: '0.76rem', color: t.is_completed ? 'var(--on-primary-container)' : 'var(--on-surface-variant)', marginTop: '3px' }}>
                  {t.description}
                </div>
                {t.is_completed && t.completed_at && (
                  <div className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--primary)', marginTop: '4px', fontWeight: '600' }}>
                    Completed at {t.completed_at} ({t.completed_by})
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Card: Physical Chlorination & Sump Inspection Form */}
      <div className="luminous-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Droplets size={18} style={{ color: 'var(--primary)' }} />
          <h2 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--on-surface)' }}>
            Chlorine & RO Sump Log
          </h2>
        </div>

        <form onSubmit={handleFieldLogSubmit}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: 'var(--on-surface)', marginBottom: '4px' }}>
              Free Residual Chlorine (DPD Test Tablet) in mg/L:
            </label>
            <input
              type="number"
              step="0.05"
              value={chlorineInput}
              onChange={(e) => setChlorineInput(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 14px',
                background: 'var(--surface-container-low)',
                border: '1px solid var(--surface-container)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--on-surface)',
                fontFamily: 'var(--font-mono)'
              }}
              required
            />
            <span style={{ fontSize: '0.7rem', color: 'var(--on-surface-variant)' }}>Target: 0.50 mg/L (Min safe: 0.20 mg/L)</span>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: 'var(--on-surface)', marginBottom: '4px' }}>
              Floor RO Sump Status:
            </label>
            <select
              value={roStatus}
              onChange={(e) => setRoStatus(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 14px',
                background: 'var(--surface-container-low)',
                border: '1px solid var(--surface-container)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--on-surface)'
              }}
            >
              <option value="operational">Operational & Chlorinated</option>
              <option value="bypassed">Bypassed to Tanker Supply</option>
              <option value="serviced">Under Sanitization Service</option>
            </select>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--on-surface)', cursor: 'pointer', fontWeight: '500' }}>
              <input
                type="checkbox"
                checked={sanitized}
                onChange={(e) => setSanitized(e.target.checked)}
              />
              Common Washroom Bleach Sanitization Completed
            </label>
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: 'var(--on-surface)', marginBottom: '4px' }}>
              Inspection Notes / Verification Stamp:
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 14px',
                background: 'var(--surface-container-low)',
                border: '1px solid var(--surface-container)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--on-surface)',
                fontSize: '0.82rem'
              }}
            />
          </div>

          <button type="submit" className="btn-lime" style={{ width: '100%', justifyContent: 'center' }}>
            <ShieldCheck size={16} />
            Record Verified Field Log
          </button>
        </form>

        {fieldLogMsg && (
          <div style={{ marginTop: '14px', fontSize: '0.78rem', color: 'var(--primary)', fontWeight: '600' }}>
            {fieldLogMsg}
          </div>
        )}
      </div>

    </div>
  );
}
